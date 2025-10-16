import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const payload = await req.json();
    
    console.log("Review webhook received:", payload);

    const review = payload.record;
    
    // Fetch vendor and couple details
    const { data: vendor } = await supabase
      .from("vendors")
      .select("business_name, user_id")
      .eq("id", review.vendor_id)
      .single();

    const { data: couple } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", review.couple_id)
      .single();

    if (!vendor || !couple) {
      throw new Error("Vendor or couple not found");
    }

    const { data: { user: vendorUser } } = await supabase.auth.admin.getUserById(vendor.user_id);

    if (!vendorUser?.email) {
      throw new Error("Vendor email not found");
    }

    // Create notification
    await supabase.from("notifications").insert({
      user_id: vendor.user_id,
      type: "review",
      title: "New Review Received",
      message: `${couple.full_name} left you a ${review.rating}-star review`,
      link: "/vendor/dashboard",
    });

    // Send email in background
    const stars = "⭐".repeat(review.rating);
    fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        to: vendorUser.email,
        subject: `New ${review.rating}-Star Review - ${couple.full_name}`,
        html: `
          <h1>New Review Received!</h1>
          <p><strong>${couple.full_name}</strong> has left you a review.</p>
          <p><strong>Rating:</strong> ${stars} (${review.rating}/5)</p>
          ${review.comment ? `<p><strong>Comment:</strong><br/>"${review.comment}"</p>` : ""}
          <p>You can respond to this review from your dashboard.</p>
          <a href="${supabaseUrl.replace('.supabase.co', '.lovable.app')}/vendor/dashboard" style="display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">Respond to Review</a>
        `,
        type: "review",
      }),
    }).catch(err => console.error("Email sending error:", err));

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-review-created:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
