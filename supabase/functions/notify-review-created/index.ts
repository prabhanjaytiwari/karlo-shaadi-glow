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
          <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a0a2e; font-weight: 700;">New Review Received! ⭐</h1>
          <p style="color: #444; font-size: 15px; line-height: 1.7;"><strong>${couple.full_name}</strong> has left you a review.</p>
          <div style="background: linear-gradient(135deg, #faf7f4 0%, #f5ede4 100%); border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #D4A574; text-align: center;">
            <p style="margin: 0 0 4px; font-size: 28px;">${stars}</p>
            <p style="margin: 0; color: #1a0a2e; font-weight: 600; font-size: 16px;">${review.rating}/5 Stars</p>
          </div>
          ${review.comment ? `<div style="background: #fff8f0; border-radius: 8px; padding: 16px; margin: 16px 0; border: 1px solid rgba(212,165,116,0.2);"><p style="margin: 0; color: #555; font-style: italic; font-size: 14px;">"${review.comment}"</p></div>` : ""}
          <div style="text-align: center; margin: 24px 0;">
            <a href="https://karloshaadi.com/vendor/dashboard" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">Respond to Review →</a>
          </div>
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
