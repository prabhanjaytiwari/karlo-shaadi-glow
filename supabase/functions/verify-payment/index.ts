import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting for payment verification
const rateLimitStore = new Map<string, { count: number; resetAt: number; failedAttempts: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_ATTEMPTS = 10; // Max 10 verification attempts per minute
const MAX_FAILED_ATTEMPTS = 3; // Max 3 failed attempts before blocking

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);

  if (!userLimit || now > userLimit.resetAt) {
    rateLimitStore.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW, failedAttempts: 0 });
    return true;
  }

  if (userLimit.count >= MAX_ATTEMPTS || userLimit.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

function recordFailedAttempt(userId: string): void {
  const userLimit = rateLimitStore.get(userId);
  if (userLimit) {
    userLimit.failedAttempts++;
    console.warn(`Failed payment verification for user ${userId}. Total failures: ${userLimit.failedAttempts}`);
  }
}

// Function to send payment receipt email
async function sendPaymentReceiptEmail(supabaseUrl: string, supabaseKey: string, params: {
  userEmail: string;
  userName: string;
  amount: number;
  paymentId: string;
  orderId: string;
  paymentType: 'subscription' | 'booking';
  planName?: string;
  vendorName?: string;
  bookingDate?: string;
}) {
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/send-payment-receipt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      console.error('Failed to send payment receipt email:', await response.text());
    } else {
      console.log('Payment receipt email sent successfully');
    }
  } catch (err) {
    console.error('Error sending payment receipt:', err);
  }
}

// Function to send push notification
async function sendPushNotification(supabaseUrl: string, supabaseKey: string, params: {
  user_id: string;
  title: string;
  body: string;
  url?: string;
  tag?: string;
}) {
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      console.error('Failed to send push notification:', await response.text());
    } else {
      console.log('Push notification sent successfully');
    }
  } catch (err) {
    console.error('Error sending push notification:', err);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, paymentId, signature, bookingId, subscriptionPlan } = await req.json();
    
    // Get user from auth header for rate limiting
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

    // Apply rate limiting
    if (!checkRateLimit(user.id)) {
      console.warn(`Rate limit exceeded for user ${user.id}`);
      return new Response(
        JSON.stringify({ error: "Too many verification attempts. Please contact support." }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Payment verification attempt for user ${user.id}, order ${orderId}`);

    // Get Razorpay secret
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!razorpayKeySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    // Verify signature
    const generatedSignature = createHmac("sha256", razorpayKeySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      recordFailedAttempt(user.id);
      console.error(`Invalid payment signature for user ${user.id}, order ${orderId}`);
      throw new Error("Invalid payment signature");
    }

    // Get user profile for email
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    const userName = profile?.full_name || "Customer";

    // Handle subscription payment
    if (subscriptionPlan) {
      console.log(`Processing subscription payment for plan: ${subscriptionPlan}`);
      
      // Get subscription amount from create-payment response
      const planPrices: Record<string, number> = {
        'premium': 2999,
        'vip': 9999
      };
      
      const planNames: Record<string, string> = {
        'premium': 'Premium Plan',
        'vip': 'VIP Plan'
      };
      
      const amount = planPrices[subscriptionPlan] || 0;
      
      // Upsert subscription (update if exists, insert if not)
      const { error: subscriptionError } = await supabase
        .from("subscriptions")
        .upsert({
          user_id: user.id,
          plan: subscriptionPlan,
          status: 'active',
          amount: amount,
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          activated_at: new Date().toISOString(),
          expires_at: null, // One-time lifetime access
        }, {
          onConflict: 'user_id'
        });

      if (subscriptionError) {
        console.error(`Subscription upsert error: ${subscriptionError.message}`);
        throw subscriptionError;
      }

      console.log(`Subscription ${subscriptionPlan} activated for user ${user.id}`);
      
      // Send payment receipt email for subscription
      await sendPaymentReceiptEmail(supabaseUrl, supabaseKey, {
        userEmail: user.email!,
        userName,
        amount,
        paymentId,
        orderId,
        paymentType: 'subscription',
        planName: planNames[subscriptionPlan] || subscriptionPlan
      });
      
      // Send push notification for subscription payment
      await sendPushNotification(supabaseUrl, supabaseKey, {
        user_id: user.id,
        title: "Payment Successful! 🎉",
        body: `Your ${planNames[subscriptionPlan] || subscriptionPlan} subscription is now active!`,
        url: "/dashboard",
        tag: "payment"
      });
      
      return new Response(
        JSON.stringify({ success: true, verified: true }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle booking payment
    // Update payment record
    const { data: paymentRecord, error: updateError } = await supabase
      .from("payments")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        transaction_id: paymentId,
      })
      .eq("transaction_id", orderId)
      .select("amount, milestone, booking_id")
      .single();

    if (updateError) throw updateError;

    // Get booking details for email
    let vendorName = "Vendor";
    let bookingDate = "";
    
    if (bookingId || paymentRecord?.booking_id) {
      const targetBookingId = bookingId || paymentRecord?.booking_id;
      
      const { data: booking } = await supabase
        .from("bookings")
        .select("wedding_date, vendor_id")
        .eq("id", targetBookingId)
        .single();
      
      if (booking) {
        bookingDate = new Date(booking.wedding_date).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        // Get vendor name
        const { data: vendor } = await supabase
          .from("vendors")
          .select("business_name")
          .eq("id", booking.vendor_id)
          .single();
        
        if (vendor) {
          vendorName = vendor.business_name;
        }
      }
    }

    // Send payment receipt email for booking
    await sendPaymentReceiptEmail(supabaseUrl, supabaseKey, {
      userEmail: user.email!,
      userName,
      amount: paymentRecord?.amount || 0,
      paymentId,
      orderId,
      paymentType: 'booking',
      vendorName,
      bookingDate
    });
    
    // Send push notification for booking payment
    const milestoneLabel = paymentRecord?.milestone === 'advance' ? 'Advance' : 
                          paymentRecord?.milestone === 'completion' ? 'Final' : 'Payment';
    await sendPushNotification(supabaseUrl, supabaseKey, {
      user_id: user.id,
      title: `${milestoneLabel} Payment Confirmed! ✅`,
      body: `₹${(paymentRecord?.amount || 0).toLocaleString()} paid to ${vendorName}`,
      url: "/bookings",
      tag: "payment"
    });

    // Check if all milestones are paid to mark booking as confirmed
    const { data: payments } = await supabase
      .from("payments")
      .select("*")
      .eq("booking_id", bookingId || paymentRecord?.booking_id);

    const allPaid = payments?.every(p => p.status === "paid");
    
    if (allPaid) {
      await supabase
        .from("bookings")
        .update({
          status: "confirmed",
          confirmed_at: new Date().toISOString(),
        })
        .eq("id", bookingId || paymentRecord?.booking_id);
    }

    return new Response(
      JSON.stringify({ success: true, verified: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});