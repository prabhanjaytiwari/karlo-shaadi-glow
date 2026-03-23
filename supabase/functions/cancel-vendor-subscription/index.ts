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
    const { vendorId } = await req.json();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Unauthorized");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) throw new Error("Unauthorized");

    // Verify vendor ownership
    const { data: vendor } = await supabase
      .from('vendors')
      .select('id, user_id')
      .eq('id', vendorId)
      .single();

    if (!vendor || vendor.user_id !== user.id) throw new Error("Unauthorized");

    // Get active subscription
    const { data: subscription } = await supabase
      .from('vendor_subscriptions')
      .select('*')
      .eq('vendor_id', vendorId)
      .in('status', ['active', 'created'])
      .single();

    if (!subscription?.razorpay_subscription_id) {
      throw new Error("No active subscription found");
    }

    // Cancel on Razorpay (at cycle end so vendor keeps benefits)
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
      throw new Error("Failed to cancel subscription on payment gateway");
    }

    const cancelData = await cancelResponse.json();
    console.log("Subscription cancelled:", cancelData.id);

    // Update local DB
    await supabase
      .from('vendor_subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('vendor_id', vendorId);

    // Send notification
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
