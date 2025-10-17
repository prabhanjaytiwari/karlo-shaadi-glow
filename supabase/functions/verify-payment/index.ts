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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, paymentId, signature, bookingId } = await req.json();
    
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

    // Update payment record
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        transaction_id: paymentId,
      })
      .eq("transaction_id", orderId);

    if (updateError) throw updateError;

    // Check if all milestones are paid to mark booking as confirmed
    const { data: payments } = await supabase
      .from("payments")
      .select("*")
      .eq("booking_id", bookingId);

    const allPaid = payments?.every(p => p.status === "paid");
    
    if (allPaid) {
      await supabase
        .from("bookings")
        .update({
          status: "confirmed",
          confirmed_at: new Date().toISOString(),
        })
        .eq("id", bookingId);
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
