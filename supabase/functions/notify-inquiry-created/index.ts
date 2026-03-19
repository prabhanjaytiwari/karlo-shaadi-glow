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
    
    console.log("New inquiry webhook received:", payload);

    const inquiry = payload.record;
    
    // Get vendor details
    const { data: vendor, error: vendorError } = await supabase
      .from("vendors")
      .select("user_id, business_name, whatsapp_number")
      .eq("id", inquiry.vendor_id)
      .single();
    
    if (vendorError || !vendor) {
      console.error("Vendor not found:", vendorError);
      throw new Error("Vendor not found");
    }

    // Get vendor's email
    const { data: authUser } = await supabase.auth.admin.getUserById(vendor.user_id);
    const vendorEmail = authUser?.user?.email;

    // Create in-app notification for vendor
    await supabase.from("notifications").insert({
      user_id: vendor.user_id,
      type: "inquiry",
      title: "New Quote Request! 🎉",
      message: `${inquiry.name} is interested in your services for their wedding${inquiry.wedding_date ? ` on ${inquiry.wedding_date}` : ''}.`,
      link: "/vendor/dashboard",
    });

    // Send push notification
    await fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        user_id: vendor.user_id,
        title: "🎉 New Quote Request!",
        body: `${inquiry.name} wants a quote for ${inquiry.wedding_date || 'their wedding'}`,
        url: "/vendor/dashboard",
        tag: "inquiry"
      }),
    });

    // Send email notification to vendor
    if (vendorEmail) {
      await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          to: vendorEmail,
          subject: `New Quote Request from ${inquiry.name} - Karlo Shaadi`,
          html: `
            <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a0a2e; font-weight: 700;">New Quote Request! 🎉</h1>
            <p style="color: #444; font-size: 15px; line-height: 1.7;">Hi ${vendor.business_name}, great news! You have a new inquiry on Karlo Shaadi.</p>
            
            <div style="background: linear-gradient(135deg, #faf7f4 0%, #f5ede4 100%); border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #D4A574;">
              <h3 style="margin: 0 0 12px; font-family: 'Playfair Display', Georgia, serif; color: #1a0a2e; font-size: 16px;">Inquiry Details</h3>
              <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Name:</strong> ${inquiry.name}</p>
              <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Email:</strong> ${inquiry.email}</p>
              <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Phone:</strong> ${inquiry.phone}</p>
              ${inquiry.wedding_date ? `<p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Wedding Date:</strong> ${inquiry.wedding_date}</p>` : ''}
              ${inquiry.guest_count ? `<p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Guest Count:</strong> ${inquiry.guest_count}</p>` : ''}
              ${inquiry.budget_range ? `<p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Budget:</strong> ${inquiry.budget_range}</p>` : ''}
              ${inquiry.message ? `<p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Message:</strong> ${inquiry.message}</p>` : ''}
            </div>
            
            <p style="color: #888; font-size: 13px;">💡 <strong>Tip:</strong> Responding quickly increases your chances of booking!</p>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="https://karloshaadi.com/vendor/dashboard" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">View & Respond →</a>
            </div>
          `,
          type: "inquiry",
        }),
      });
    }

    // Send SMS if vendor has WhatsApp number
    if (vendor.whatsapp_number) {
      try {
        await fetch(`${supabaseUrl}/functions/v1/send-sms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            to: vendor.whatsapp_number,
            message: `🎉 New Quote Request on Karlo Shaadi!\n\n${inquiry.name} is interested in your services${inquiry.wedding_date ? ` for ${inquiry.wedding_date}` : ''}.\n\nLogin to respond: karloshaadi.com/vendor/dashboard`,
            type: "inquiry_notification"
          }),
        });
      } catch (smsError) {
        console.log("SMS sending failed (optional):", smsError);
      }
    }

    console.log(`Inquiry notification sent to vendor ${vendor.business_name}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-inquiry-created:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
