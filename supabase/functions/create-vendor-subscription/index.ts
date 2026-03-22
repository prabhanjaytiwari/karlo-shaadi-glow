import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VendorSubscriptionRequest {
  vendorId: string;
  plan: 'starter' | 'pro' | 'elite';
}

// Subscription plan details
const SUBSCRIPTION_PLANS = {
  starter: {
    amount: 99900, // ₹999 in paise
    period: 'monthly',
    interval: 1,
    name: 'Starter Plan',
    description: 'Enhanced visibility with Silver badge and 7% commission'
  },
  pro: {
    amount: 299900, // ₹2,999 in paise
    period: 'monthly',
    interval: 1,
    name: 'Pro Plan',
    description: 'Top 5 placement with Gold badge and 3% commission'
  },
  elite: {
    amount: 699900, // ₹6,999 in paise
    period: 'monthly',
    interval: 1,
    name: 'Elite Plan',
    description: 'Homepage featured with Diamond badge and 0% commission'
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vendorId, plan }: VendorSubscriptionRequest = await req.json();

    console.log(`Creating vendor subscription for vendor ${vendorId}, plan: ${plan}`);

    // Validate plan
    if (!['featured', 'sponsored'].includes(plan)) {
      throw new Error("Invalid subscription plan");
    }

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Unauthorized");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Verify vendor ownership
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('id, business_name, user_id')
      .eq('id', vendorId)
      .single();

    if (vendorError || !vendor || vendor.user_id !== user.id) {
      throw new Error("Vendor not found or unauthorized");
    }

    // Get Razorpay credentials
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    const planDetails = SUBSCRIPTION_PLANS[plan];
    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

    // Step 1: Create or get Razorpay Plan
    const planId = `${plan}_monthly_${planDetails.amount}`;
    
    // Try to fetch existing plan first
    let razorpayPlan;
    try {
      const planResponse = await fetch(`https://api.razorpay.com/v1/plans/${planId}`, {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      if (planResponse.ok) {
        razorpayPlan = await planResponse.json();
        console.log(`Using existing Razorpay plan: ${planId}`);
      }
    } catch (error) {
      console.log(`Plan ${planId} not found, creating new one`);
    }

    // Create plan if it doesn't exist
    if (!razorpayPlan) {
      const createPlanResponse = await fetch("https://api.razorpay.com/v1/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          period: planDetails.period,
          interval: planDetails.interval,
          item: {
            name: planDetails.name,
            amount: planDetails.amount,
            currency: "INR",
            description: planDetails.description,
          },
          notes: {
            plan_type: plan,
            vendor_id: vendorId,
          },
        }),
      });

      if (!createPlanResponse.ok) {
        const error = await createPlanResponse.text();
        console.error("Razorpay plan creation error:", error);
        throw new Error("Failed to create Razorpay plan");
      }

      razorpayPlan = await createPlanResponse.json();
      console.log(`Created new Razorpay plan: ${razorpayPlan.id}`);
    }

    // Step 2: Create Razorpay Subscription
    const subscriptionResponse = await fetch("https://api.razorpay.com/v1/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        plan_id: razorpayPlan.id,
        customer_notify: 1,
        quantity: 1,
        total_count: 12, // 12 months
        notes: {
          vendor_id: vendorId,
          user_id: user.id,
          plan_type: plan,
          business_name: vendor.business_name,
        },
      }),
    });

    if (!subscriptionResponse.ok) {
      const error = await subscriptionResponse.text();
      console.error("Razorpay subscription creation error:", error);
      throw new Error("Failed to create Razorpay subscription");
    }

    const subscription = await subscriptionResponse.json();
    console.log(`Created Razorpay subscription: ${subscription.id}`);

    // Step 3: Create vendor_subscriptions record
    const { data: vendorSubscription, error: dbError } = await supabase
      .from('vendor_subscriptions')
      .upsert([{
        vendor_id: vendorId,
        plan: plan,
        amount: planDetails.amount / 100, // Convert from paise to rupees
        razorpay_subscription_id: subscription.id,
        status: 'created',
        started_at: new Date().toISOString(),
      }], {
        onConflict: 'vendor_id'
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }

    console.log(`Created vendor subscription record: ${vendorSubscription.id}`);

    return new Response(
      JSON.stringify({
        subscription: subscription,
        subscriptionId: subscription.id,
        planId: razorpayPlan.id,
        amount: planDetails.amount,
        plan: plan,
        keyId: razorpayKeyId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
