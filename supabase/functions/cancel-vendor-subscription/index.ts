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

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { vendorId } = await req.json();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Unauthorized");

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) throw new Error("Unauthorized");

    const { data: vendor } = await supabase
      .from('vendors')
      .select('id, user_id')
      .eq('id', vendorId)
      .single();

    if (!vendor || vendor.user_id !== user.id) throw new Error("Unauthorized");

    const { data: subscription } = await supabase
      .from('vendor_subscriptions')
      .select('*')
      .eq('vendor_id', vendorId)
      .in('status', ['active', 'created'])
      .single();

    if (!subscription?.razorpay_subscription_id) {
      throw new Error("No active subscription found");
    }

    // Log cancellation attempt
    await supabase.from("payment_logs").insert([{
      vendor_id: vendorId,
      user_id: user.id,
      event_type: "cancellation_initiated",
      razorpay_subscription_id: subscription.razorpay_subscription_id,
      plan: subscription.plan,
      status: "pending",
    }]);

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID")!;
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;
    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

    const cancelResponse = await fetch(
      `https://api.razorpay.com/v1/subscriptions/${subscription.razorpay_subscription_id}/cancel`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
        body: JSON.stringify({ cancel_at_cycle_end: 1 }),
      }
    );

    if (!cancelResponse.ok) {
      const error = await cancelResponse.text();
      console.error("Razorpay cancel error:", error);

      await supabase.from("payment_logs").insert([{
        vendor_id: vendorId,
        user_id: user.id,
        event_type: "cancellation_failed",
        razorpay_subscription_id: subscription.razorpay_subscription_id,
        plan: subscription.plan,
        status: "failed",
        error_message: error,
      }]);

      throw new Error("Failed to cancel subscription on payment gateway");
    }

    const cancelData = await cancelResponse.json();
    console.log("Subscription cancelled:", cancelData.id);

    await supabase
      .from('vendor_subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('vendor_id', vendorId);

    // Log success
    await supabase.from("payment_logs").insert([{
      vendor_id: vendorId,
      user_id: user.id,
      event_type: "subscription_cancelled",
      razorpay_subscription_id: subscription.razorpay_subscription_id,
      plan: subscription.plan,
      status: "success",
      metadata: { ends_at: subscription.expires_at },
    }]);

    await supabase.from('notifications').insert([{
      user_id: user.id,
      type: 'subscription',
      title: 'Subscription Cancelled',
      message: `Your subscription has been cancelled. Benefits remain active until ${subscription.expires_at ? new Date(subscription.expires_at).toLocaleDateString() : 'the end of your billing period'}.`,
      link: '/vendor/settings',
    }]);

    return new Response(
      JSON.stringify({ success: true, endsAt: subscription.expires_at }),
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
