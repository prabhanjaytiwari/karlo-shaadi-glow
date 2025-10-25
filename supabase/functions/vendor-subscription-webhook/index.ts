import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-razorpay-signature",
};

function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  const expectedSignature = createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  
  return expectedSignature === signature;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("x-razorpay-signature");
    const rawBody = await req.text();
    
    console.log("Received Razorpay webhook");

    // Verify webhook signature
    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.error("Invalid webhook signature");
        return new Response(
          JSON.stringify({ error: "Invalid signature" }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const subscriptionData = payload.payload.subscription.entity;
    const paymentData = payload.payload.payment?.entity;

    console.log(`Processing webhook event: ${event}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const vendorId = subscriptionData.notes?.vendor_id;
    const userId = subscriptionData.notes?.user_id;

    if (!vendorId) {
      console.error("No vendor_id in webhook payload");
      throw new Error("Invalid webhook payload: missing vendor_id");
    }

    // Get vendor subscription
    const { data: vendorSubscription } = await supabase
      .from('vendor_subscriptions')
      .select('*')
      .eq('vendor_id', vendorId)
      .single();

    if (!vendorSubscription) {
      console.error(`Vendor subscription not found for vendor ${vendorId}`);
      throw new Error("Vendor subscription not found");
    }

    let updateData: any = {};
    let vendorUpdateData: any = {};
    let notificationMessage = '';

    switch (event) {
      case 'subscription.activated':
        console.log(`Subscription activated: ${subscriptionData.id}`);
        
        updateData = {
          status: 'active',
          razorpay_subscription_id: subscriptionData.id,
          started_at: new Date(subscriptionData.start_at * 1000).toISOString(),
          expires_at: new Date(subscriptionData.current_end * 1000).toISOString(),
        };

        vendorUpdateData = {
          subscription_tier: vendorSubscription.plan,
          featured_until: updateData.expires_at,
          homepage_featured: vendorSubscription.plan === 'sponsored',
        };

        notificationMessage = `Your ${vendorSubscription.plan} subscription is now active!`;
        break;

      case 'subscription.charged':
        console.log(`Subscription charged: ${subscriptionData.id}`);
        
        // Extend subscription period
        updateData = {
          status: 'active',
          expires_at: new Date(subscriptionData.current_end * 1000).toISOString(),
          razorpay_payment_id: paymentData?.id,
        };

        vendorUpdateData = {
          featured_until: updateData.expires_at,
        };

        notificationMessage = `Your ${vendorSubscription.plan} subscription has been renewed successfully.`;
        break;

      case 'subscription.completed':
        console.log(`Subscription completed: ${subscriptionData.id}`);
        
        updateData = {
          status: 'expired',
          expires_at: new Date(subscriptionData.end_at * 1000).toISOString(),
        };

        vendorUpdateData = {
          subscription_tier: 'free',
          featured_until: null,
          homepage_featured: false,
        };

        notificationMessage = 'Your subscription has completed. Upgrade again to continue premium benefits.';
        break;

      case 'subscription.cancelled':
        console.log(`Subscription cancelled: ${subscriptionData.id}`);
        
        updateData = {
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        };

        // Don't immediately downgrade - let it expire naturally
        notificationMessage = `Your subscription has been cancelled. Benefits will remain active until ${new Date(subscriptionData.current_end * 1000).toLocaleDateString()}.`;
        break;

      case 'subscription.paused':
        console.log(`Subscription paused: ${subscriptionData.id}`);
        
        updateData = {
          status: 'paused',
        };

        vendorUpdateData = {
          subscription_tier: 'free',
          featured_until: null,
          homepage_featured: false,
        };

        notificationMessage = 'Your subscription has been paused. Reactivate anytime to restore benefits.';
        break;

      case 'subscription.resumed':
        console.log(`Subscription resumed: ${subscriptionData.id}`);
        
        updateData = {
          status: 'active',
          expires_at: new Date(subscriptionData.current_end * 1000).toISOString(),
        };

        vendorUpdateData = {
          subscription_tier: vendorSubscription.plan,
          featured_until: updateData.expires_at,
          homepage_featured: vendorSubscription.plan === 'sponsored',
        };

        notificationMessage = 'Your subscription has been resumed successfully!';
        break;

      case 'subscription.pending':
        console.log(`Subscription pending: ${subscriptionData.id}`);
        
        updateData = {
          status: 'pending_payment',
        };

        notificationMessage = 'Your subscription is pending payment confirmation.';
        break;

      case 'subscription.halted':
        console.log(`Subscription halted: ${subscriptionData.id}`);
        
        updateData = {
          status: 'expired',
        };

        vendorUpdateData = {
          subscription_tier: 'free',
          featured_until: null,
          homepage_featured: false,
        };

        notificationMessage = 'Your subscription has been halted due to payment failure. Please update your payment method.';
        break;

      default:
        console.log(`Unhandled webhook event: ${event}`);
        return new Response(
          JSON.stringify({ received: true, event }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }

    // Update vendor_subscriptions
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('vendor_subscriptions')
        .update(updateData)
        .eq('vendor_id', vendorId);

      if (updateError) {
        console.error("Failed to update vendor subscription:", updateError);
        throw updateError;
      }
    }

    // Update vendors table
    if (Object.keys(vendorUpdateData).length > 0) {
      const { error: vendorError } = await supabase
        .from('vendors')
        .update(vendorUpdateData)
        .eq('id', vendorId);

      if (vendorError) {
        console.error("Failed to update vendor:", vendorError);
        throw vendorError;
      }
    }

    // Send notification
    if (notificationMessage && userId) {
      await supabase.from('notifications').insert([{
        user_id: userId,
        type: 'subscription',
        title: 'Subscription Update',
        message: notificationMessage,
        link: '/vendor/dashboard',
      }]);
    }

    console.log(`Webhook processed successfully for vendor ${vendorId}`);

    return new Response(
      JSON.stringify({ received: true, event, vendorId }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
