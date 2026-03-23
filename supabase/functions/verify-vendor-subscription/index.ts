import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Unauthorized");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify caller is admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    const { data: adminRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!adminRole) throw new Error("Admin access required");

    const { vendorId, razorpaySubscriptionId, action, plan, paymentId } = await req.json();

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID")!;
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;
    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

    // ACTION: manual_activate — admin directly activates a subscription
    if (action === "manual_activate" && vendorId && plan) {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      await supabase.from("vendor_subscriptions").upsert([{
        vendor_id: vendorId,
        plan: plan,
        status: "active",
        razorpay_payment_id: paymentId || "manual_recovery",
        razorpay_subscription_id: razorpaySubscriptionId || null,
        started_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      }], { onConflict: "vendor_id" });

      await supabase.from("vendors").update({
        subscription_tier: plan,
        featured_until: expiresAt.toISOString(),
        homepage_featured: plan === "elite",
      }).eq("id", vendorId);

      await supabase.from("payment_logs").insert([{
        vendor_id: vendorId,
        user_id: user.id,
        event_type: "manual_recovery",
        razorpay_payment_id: paymentId || null,
        razorpay_subscription_id: razorpaySubscriptionId || null,
        plan,
        status: "success",
        metadata: { activated_by: user.id, action: "manual_activate" },
      }]);

      return new Response(
        JSON.stringify({ success: true, action: "manual_activate", plan }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ACTION: sync — fetch from Razorpay and reconcile
    if (!razorpaySubscriptionId && !vendorId) {
      throw new Error("Either vendorId or razorpaySubscriptionId required");
    }

    let subId = razorpaySubscriptionId;

    // If only vendorId, look up the subscription ID from our DB
    if (!subId && vendorId) {
      const { data: localSub } = await supabase
        .from("vendor_subscriptions")
        .select("razorpay_subscription_id")
        .eq("vendor_id", vendorId)
        .maybeSingle();
      subId = localSub?.razorpay_subscription_id;
    }

    if (!subId) {
      return new Response(
        JSON.stringify({ success: false, error: "No Razorpay subscription ID found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch from Razorpay
    const rzpResponse = await fetch(`https://api.razorpay.com/v1/subscriptions/${subId}`, {
      headers: { Authorization: `Basic ${auth}` },
    });

    if (!rzpResponse.ok) {
      const errText = await rzpResponse.text();
      throw new Error(`Razorpay API error: ${errText}`);
    }

    const rzpSub = await rzpResponse.json();

    // Get local status
    const targetVendorId = vendorId || rzpSub.notes?.vendor_id;
    const { data: localSub } = await supabase
      .from("vendor_subscriptions")
      .select("*")
      .eq("vendor_id", targetVendorId)
      .maybeSingle();

    const razorpayStatus = rzpSub.status; // active, created, authenticated, pending, halted, cancelled, completed, expired, paused
    const localStatus = localSub?.status || "none";

    let synced = false;
    let syncDetails = "";

    // If Razorpay says active but local doesn't match, fix it
    if (razorpayStatus === "active" && !["active"].includes(localStatus)) {
      const expiresAt = rzpSub.current_end
        ? new Date(rzpSub.current_end * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const planFromNotes = rzpSub.notes?.plan_type || localSub?.plan || "starter";

      await supabase.from("vendor_subscriptions").upsert([{
        vendor_id: targetVendorId,
        plan: planFromNotes,
        status: "active",
        razorpay_subscription_id: subId,
        started_at: rzpSub.start_at ? new Date(rzpSub.start_at * 1000).toISOString() : new Date().toISOString(),
        expires_at: expiresAt,
      }], { onConflict: "vendor_id" });

      await supabase.from("vendors").update({
        subscription_tier: planFromNotes,
        featured_until: expiresAt,
        homepage_featured: planFromNotes === "elite",
      }).eq("id", targetVendorId);

      synced = true;
      syncDetails = `Synced: Razorpay=${razorpayStatus}, Local was=${localStatus}, now=active`;
    }

    // Log the verification
    await supabase.from("payment_logs").insert([{
      vendor_id: targetVendorId,
      user_id: user.id,
      event_type: "admin_verification",
      razorpay_subscription_id: subId,
      plan: localSub?.plan || rzpSub.notes?.plan_type,
      status: synced ? "synced" : "verified",
      metadata: {
        razorpay_status: razorpayStatus,
        local_status: localStatus,
        synced,
        sync_details: syncDetails,
        verified_by: user.id,
      },
    }]);

    return new Response(
      JSON.stringify({
        success: true,
        vendorId: targetVendorId,
        razorpay: {
          status: razorpayStatus,
          subscription_id: subId,
          current_end: rzpSub.current_end,
          plan_id: rzpSub.plan_id,
        },
        local: {
          status: localStatus,
          plan: localSub?.plan,
          expires_at: localSub?.expires_at,
        },
        synced,
        syncDetails,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
