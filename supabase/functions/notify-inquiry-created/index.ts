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
          subject: `New Quote Request from ${inquiry.name} - Bhindi`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #b91c1c;">🎉 New Quote Request!</h2>
              <p>Hi ${vendor.business_name},</p>
              <p>Great news! You have received a new quote request on Bhindi.</p>
              
              <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Inquiry Details:</h3>
                <p><strong>Name:</strong> ${inquiry.name}</p>
                <p><strong>Email:</strong> ${inquiry.email}</p>
                <p><strong>Phone:</strong> ${inquiry.phone}</p>
                ${inquiry.wedding_date ? `<p><strong>Wedding Date:</strong> ${inquiry.wedding_date}</p>` : ''}
                ${inquiry.guest_count ? `<p><strong>Guest Count:</strong> ${inquiry.guest_count}</p>` : ''}
                ${inquiry.budget_range ? `<p><strong>Budget:</strong> ${inquiry.budget_range}</p>` : ''}
                ${inquiry.message ? `<p><strong>Message:</strong> ${inquiry.message}</p>` : ''}
              </div>
              
              <p><strong>Tip:</strong> Responding quickly increases your chances of booking! Average response time matters.</p>
              
              <a href="https://bhindi.app/vendor/dashboard" style="display: inline-block; background: #b91c1c; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 10px;">
                View & Respond
              </a>
              
              <p style="color: #666; font-size: 12px; margin-top: 30px;">
                This is an automated message from Bhindi. Please do not reply to this email.
              </p>
            </div>
          `,
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
            message: `🎉 New Quote Request on Bhindi!\n\n${inquiry.name} is interested in your services${inquiry.wedding_date ? ` for ${inquiry.wedding_date}` : ''}.\n\nLogin to respond: bhindi.app/vendor`,
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
