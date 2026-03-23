import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUBSCRIPTION_PLANS: Record<string, { amount: number; name: string; description: string }> = {
  starter: {
    amount: 99900,
    name: 'Starter Plan',
    description: 'Enhanced visibility with Silver badge and 7% commission'
  },
  pro: {
    amount: 299900,
    name: 'Pro Plan',
    description: 'Top 5 placement with Gold badge and 3% commission'
  },
  elite: {
    amount: 699900,
    name: 'Elite Plan',
    description: 'Homepage featured with Diamond badge and 0% commission'
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vendorId, plan, promoCode, finalAmount } = await req.json();

    console.log(`Creating vendor subscription: vendor=${vendorId}, plan=${plan}, promo=${promoCode || 'none'}`);

    if (!['starter', 'pro', 'elite'].includes(plan)) {
      throw new Error("Invalid subscription plan");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Unauthorized");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) throw new Error("Unauthorized");

    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('id, business_name, user_id')
      .eq('id', vendorId)
      .single();

    if (vendorError || !vendor || vendor.user_id !== user.id) {
      throw new Error("Vendor not found or unauthorized");
    }

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!razorpayKeyId || !razorpayKeySecret) throw new Error("Razorpay credentials not configured");

    const planDetails = SUBSCRIPTION_PLANS[plan];
    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

    // Determine the actual charge amount (in paise)
    const chargeAmountPaise = finalAmount ? Math.round(finalAmount * 100) : planDetails.amount;
    const fullAmountPaise = planDetails.amount;

    // Create a Razorpay Plan at the FULL price (recurring charges are always full price)
    const planResponse = await fetch("https://api.razorpay.com/v1/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
      body: JSON.stringify({
        period: "monthly",
        interval: 1,
        item: {
          name: planDetails.name,
          amount: fullAmountPaise,
          currency: "INR",
          description: planDetails.description,
        },
      }),
    });

    if (!planResponse.ok) {
      const error = await planResponse.text();
      console.error("Razorpay plan creation error:", error);
      throw new Error("Failed to create Razorpay plan");
    }

    const razorpayPlan = await planResponse.json();
    console.log(`Created Razorpay plan: ${razorpayPlan.id}`);

    // Create Razorpay Subscription
    // If promo applied, use first_min_amount to charge discounted price for first cycle
    const subscriptionBody: any = {
      plan_id: razorpayPlan.id,
      customer_notify: 1,
      quantity: 1,
      total_count: 12,
      notes: {
        vendor_id: vendorId,
        user_id: user.id,
        plan_type: plan,
        business_name: vendor.business_name,
        promo_code: promoCode || '',
      },
    };

    // If promo discount applied, charge discounted amount for first cycle only
    if (promoCode && chargeAmountPaise < fullAmountPaise) {
      subscriptionBody.first_min_amount = chargeAmountPaise;
    }

    const subscriptionResponse = await fetch("https://api.razorpay.com/v1/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
      body: JSON.stringify(subscriptionBody),
    });

    if (!subscriptionResponse.ok) {
      const error = await subscriptionResponse.text();
      console.error("Razorpay subscription creation error:", error);
      throw new Error("Failed to create Razorpay subscription");
    }

    const subscription = await subscriptionResponse.json();
    console.log(`Created Razorpay subscription: ${subscription.id}`);

    // Create vendor_subscriptions record
    const discountAmount = promoCode ? (fullAmountPaise - chargeAmountPaise) / 100 : 0;
    const { error: dbError } = await supabase
      .from('vendor_subscriptions')
      .upsert([{
        vendor_id: vendorId,
        plan: plan,
        amount: chargeAmountPaise / 100,
        discount_amount: discountAmount,
        razorpay_subscription_id: subscription.id,
        status: 'created',
        started_at: new Date().toISOString(),
      }], { onConflict: 'vendor_id' });

    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }

    return new Response(
      JSON.stringify({
        subscriptionId: subscription.id,
        keyId: razorpayKeyId,
        amount: chargeAmountPaise,
        plan,
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
