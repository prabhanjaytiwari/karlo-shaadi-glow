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

async function logPaymentEvent(
  supabase: any,
  data: {
    vendor_id?: string;
    user_id?: string;
    event_type: string;
    razorpay_payment_id?: string;
    razorpay_subscription_id?: string;
    plan?: string;
    amount?: number;
    status: string;
    error_message?: string;
    metadata?: any;
  }
) {
  try {
    await supabase.from("payment_logs").insert([{
      vendor_id: data.vendor_id || null,
      user_id: data.user_id || null,
      event_type: data.event_type,
      razorpay_payment_id: data.razorpay_payment_id || null,
      razorpay_subscription_id: data.razorpay_subscription_id || null,
      plan: data.plan || null,
      amount: data.amount || null,
      status: data.status,
      error_message: data.error_message || null,
      metadata: data.metadata || {},
    }]);
  } catch (e) {
    console.error("Failed to log payment event:", e);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

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
        await logPaymentEvent(supabase, {
          event_type: "webhook_signature_invalid",
          status: "failed",
          error_message: "Invalid webhook signature",
          metadata: { signature_present: true },
        });
        return new Response(
          JSON.stringify({ error: "Invalid signature" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const subscriptionData = payload.payload?.subscription?.entity;
    const paymentData = payload.payload?.payment?.entity;

    if (!subscriptionData) {
      console.error("No subscription data in payload");
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Processing webhook event: ${event}`);

    const vendorId = subscriptionData.notes?.vendor_id;
    const userId = subscriptionData.notes?.user_id;
    const planType = subscriptionData.notes?.plan_type;

    if (!vendorId) {
      await logPaymentEvent(supabase, {
        event_type: "webhook_missing_vendor",
        razorpay_subscription_id: subscriptionData.id,
        status: "failed",
        error_message: "No vendor_id in webhook payload",
        metadata: { event, notes: subscriptionData.notes },
      });
      console.error("No vendor_id in webhook payload");
      // Return 200 to prevent Razorpay from retrying endlessly
      return new Response(
        JSON.stringify({ received: true, error: "missing vendor_id" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // IDEMPOTENCY CHECK: For charged events, check if this payment was already processed
    if (event === "subscription.charged" && paymentData?.id) {
      const { data: existingLog } = await supabase
        .from("payment_logs")
        .select("id")
        .eq("razorpay_payment_id", paymentData.id)
        .eq("event_type", "webhook_subscription_charged")
        .eq("status", "success")
        .maybeSingle();

      if (existingLog) {
        console.log(`Duplicate webhook for payment ${paymentData.id}, skipping`);
        return new Response(
          JSON.stringify({ received: true, duplicate: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Log webhook received
    await logPaymentEvent(supabase, {
      vendor_id: vendorId,
      user_id: userId,
      event_type: `webhook_${event.replace("subscription.", "subscription_")}`,
      razorpay_payment_id: paymentData?.id,
      razorpay_subscription_id: subscriptionData.id,
      plan: planType,
      amount: paymentData?.amount ? paymentData.amount / 100 : undefined,
      status: "received",
      metadata: { razorpay_event: event },
    });

    // Get vendor subscription
    const { data: vendorSubscription } = await supabase
      .from("vendor_subscriptions")
      .select("*")
      .eq("vendor_id", vendorId)
      .single();

    let updateData: any = {};
    let vendorUpdateData: any = {};
    let notificationMessage = "";
    let logEventType = `webhook_${event.replace("subscription.", "subscription_")}`;

    switch (event) {
      case "subscription.activated":
        updateData = {
          status: "active",
          razorpay_subscription_id: subscriptionData.id,
          started_at: new Date(subscriptionData.start_at * 1000).toISOString(),
          expires_at: new Date(subscriptionData.current_end * 1000).toISOString(),
        };
        vendorUpdateData = {
          subscription_tier: vendorSubscription?.plan || planType || "starter",
          featured_until: updateData.expires_at,
          homepage_featured: (vendorSubscription?.plan || planType) === "elite",
        };
        notificationMessage = `Your ${vendorSubscription?.plan || planType || "subscription"} plan is now active!`;
        break;

      case "subscription.charged":
        updateData = {
          status: "active",
          expires_at: new Date(subscriptionData.current_end * 1000).toISOString(),
          razorpay_payment_id: paymentData?.id,
        };
        vendorUpdateData = {
          featured_until: updateData.expires_at,
        };
        notificationMessage = `Your ${vendorSubscription?.plan || "subscription"} has been renewed successfully.`;
        break;

      case "subscription.completed":
        updateData = {
          status: "expired",
          expires_at: subscriptionData.end_at
            ? new Date(subscriptionData.end_at * 1000).toISOString()
            : new Date().toISOString(),
        };
        vendorUpdateData = {
          subscription_tier: "free",
          featured_until: null,
          homepage_featured: false,
        };
        notificationMessage = "Your subscription has completed. Upgrade again for premium benefits.";
        break;

      case "subscription.cancelled":
        updateData = {
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
        };
        // Don't immediately downgrade — benefits last until expires_at
        notificationMessage = `Your subscription has been cancelled. Benefits remain active until ${
          subscriptionData.current_end
            ? new Date(subscriptionData.current_end * 1000).toLocaleDateString()
            : "the end of your billing period"
        }.`;
        break;

      case "subscription.paused":
        updateData = { status: "paused" };
        vendorUpdateData = {
          subscription_tier: "free",
          featured_until: null,
          homepage_featured: false,
        };
        notificationMessage = "Your subscription has been paused. Reactivate anytime.";
        break;

      case "subscription.resumed":
        updateData = {
          status: "active",
          expires_at: new Date(subscriptionData.current_end * 1000).toISOString(),
        };
        vendorUpdateData = {
          subscription_tier: vendorSubscription?.plan || planType || "starter",
          featured_until: updateData.expires_at,
          homepage_featured: (vendorSubscription?.plan || planType) === "elite",
        };
        notificationMessage = "Your subscription has been resumed!";
        break;

      case "subscription.pending":
        updateData = { status: "pending_payment" };
        notificationMessage = "Your subscription is pending payment confirmation.";
        break;

      case "subscription.halted":
        updateData = { status: "expired" };
        vendorUpdateData = {
          subscription_tier: "free",
          featured_until: null,
          homepage_featured: false,
        };
        notificationMessage = "Your subscription was halted due to payment failure. Please update your payment method.";
        break;

      default:
        console.log(`Unhandled webhook event: ${event}`);
        return new Response(
          JSON.stringify({ received: true, event }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // Update vendor_subscriptions (wrapped in try/catch for resilience)
    let dbUpdateSuccess = true;
    if (Object.keys(updateData).length > 0) {
      try {
        if (vendorSubscription) {
          const { error: updateError } = await supabase
            .from("vendor_subscriptions")
            .update(updateData)
            .eq("vendor_id", vendorId);
          if (updateError) {
            console.error("Failed to update vendor subscription:", updateError);
            dbUpdateSuccess = false;
          }
        } else {
          // No subscription record exists — create one (recovery path)
          const { error: insertError } = await supabase
            .from("vendor_subscriptions")
            .upsert([{
              vendor_id: vendorId,
              plan: planType || "starter",
              ...updateData,
              razorpay_subscription_id: subscriptionData.id,
            }], { onConflict: "vendor_id" });
          if (insertError) {
            console.error("Failed to insert vendor subscription:", insertError);
            dbUpdateSuccess = false;
          }
        }
      } catch (e) {
        console.error("DB update error:", e);
        dbUpdateSuccess = false;
      }
    }

    // Update vendors table
    if (Object.keys(vendorUpdateData).length > 0) {
      try {
        const { error: vendorError } = await supabase
          .from("vendors")
          .update(vendorUpdateData)
          .eq("id", vendorId);
        if (vendorError) {
          console.error("Failed to update vendor:", vendorError);
          dbUpdateSuccess = false;
        }
      } catch (e) {
        console.error("Vendor update error:", e);
      }
    }

    // Send notification
    if (notificationMessage && userId) {
      try {
        await supabase.from("notifications").insert([{
          user_id: userId,
          type: "subscription",
          title: "Subscription Update",
          message: notificationMessage,
          link: "/vendor/dashboard",
        }]);
      } catch (e) {
        console.error("Notification insert error:", e);
      }
    }

    // Log final result
    await logPaymentEvent(supabase, {
      vendor_id: vendorId,
      user_id: userId,
      event_type: logEventType,
      razorpay_payment_id: paymentData?.id,
      razorpay_subscription_id: subscriptionData.id,
      plan: vendorSubscription?.plan || planType,
      amount: paymentData?.amount ? paymentData.amount / 100 : undefined,
      status: dbUpdateSuccess ? "success" : "partial_failure",
      error_message: dbUpdateSuccess ? null : "One or more DB updates failed",
      metadata: { razorpay_event: event, update_data: updateData, vendor_update: vendorUpdateData },
    });

    console.log(`Webhook processed for vendor ${vendorId}: ${dbUpdateSuccess ? "success" : "partial"}`);

    // Always return 200 to prevent Razorpay retries
    return new Response(
      JSON.stringify({ received: true, event, vendorId, success: dbUpdateSuccess }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    
    await logPaymentEvent(supabase, {
      event_type: "webhook_processing_error",
      status: "failed",
      error_message: error instanceof Error ? error.message : "Unknown error",
    });

    // Return 200 even on error to prevent infinite retries
    return new Response(
      JSON.stringify({ received: true, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
