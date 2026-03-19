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
    
    console.log("Booking update webhook received:", payload);

    const oldBooking = payload.old_record;
    const newBooking = payload.record;
    
    if (oldBooking.status === newBooking.status) {
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { data: vendor } = await supabase
      .from("vendors")
      .select("business_name, user_id")
      .eq("id", newBooking.vendor_id)
      .single();

    const { data: couple } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", newBooking.couple_id)
      .single();

    if (!vendor || !couple) {
      throw new Error("Vendor or couple not found");
    }

    const { data: { user: coupleUser } } = await supabase.auth.admin.getUserById(newBooking.couple_id);
    const { data: { user: vendorUser } } = await supabase.auth.admin.getUserById(vendor.user_id);

    if (!coupleUser?.email) {
      throw new Error("Couple email not found");
    }

    let notificationTitle = "";
    let notificationMessage = "";
    let emailSubject = "";
    let emailHtml = "";

    const weddingDateFormatted = new Date(newBooking.wedding_date).toLocaleDateString();
    const amountFormatted = `₹${Number(newBooking.total_amount).toLocaleString()}`;

    if (newBooking.status === "confirmed") {
      notificationTitle = "Booking Confirmed";
      notificationMessage = `${vendor.business_name} has confirmed your booking`;
      emailSubject = `Booking Confirmed - ${vendor.business_name}`;
      emailHtml = `
        <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a0a2e; font-weight: 700;">Booking Confirmed! 🎉</h1>
        <p style="color: #444; font-size: 15px; line-height: 1.7;"><strong>${vendor.business_name}</strong> has confirmed your booking.</p>
        <div style="background: linear-gradient(135deg, #faf7f4 0%, #f5ede4 100%); border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #22c55e;">
          <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Wedding Date:</strong> ${weddingDateFormatted}</p>
          <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Total Amount:</strong> ${amountFormatted}</p>
          <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Advance to Pay:</strong> ₹${Number(newBooking.total_amount * newBooking.advance_percentage / 100).toLocaleString()}</p>
        </div>
        <p style="color: #666; font-size: 14px;">Please proceed with the advance payment to secure your booking.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://karloshaadi.com/bookings" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">Make Payment →</a>
        </div>
      `;
    } else if (newBooking.status === "cancelled") {
      notificationTitle = "Booking Cancelled";
      notificationMessage = `Your booking with ${vendor.business_name} has been cancelled`;
      emailSubject = `Booking Cancelled - ${vendor.business_name}`;
      emailHtml = `
        <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a0a2e; font-weight: 700;">Booking Cancelled</h1>
        <p style="color: #444; font-size: 15px; line-height: 1.7;">Your booking with <strong>${vendor.business_name}</strong> has been cancelled.</p>
        <div style="background: linear-gradient(135deg, #faf7f4 0%, #f5ede4 100%); border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Wedding Date:</strong> ${weddingDateFormatted}</p>
          ${newBooking.cancellation_reason ? `<p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Reason:</strong> ${newBooking.cancellation_reason}</p>` : ""}
        </div>
        <p style="color: #666; font-size: 14px;">You can browse other vendors on our platform.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://karloshaadi.com/search" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">Find Vendors →</a>
        </div>
      `;
    } else if (newBooking.status === "completed") {
      notificationTitle = "Booking Completed";
      notificationMessage = `Your booking with ${vendor.business_name} is marked as completed`;
      emailSubject = `Booking Completed - ${vendor.business_name}`;
      emailHtml = `
        <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a0a2e; font-weight: 700;">Booking Completed! 🎊</h1>
        <p style="color: #444; font-size: 15px; line-height: 1.7;">Your booking with <strong>${vendor.business_name}</strong> has been completed.</p>
        <p style="color: #444; font-size: 15px; line-height: 1.7;">We hope you had an amazing wedding experience! Please take a moment to leave a review.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://karloshaadi.com/bookings" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">Leave a Review →</a>
        </div>
      `;
    }

    // Create notification
    await supabase.from("notifications").insert({
      user_id: newBooking.couple_id,
      type: "booking",
      title: notificationTitle,
      message: notificationMessage,
      link: "/bookings",
    });

    // Send push notification
    fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        user_id: newBooking.couple_id,
        title: notificationTitle,
        body: notificationMessage,
        url: "/bookings",
        tag: "booking-update"
      }),
    }).catch(err => console.error("Push notification error:", err));

    // Send email to couple
    fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${supabaseServiceKey}` },
      body: JSON.stringify({ to: coupleUser.email, subject: emailSubject, html: emailHtml, type: `booking_${newBooking.status}` }),
    }).catch(() => { /* best-effort */ });

    // Send email to vendor for status changes
    if (vendorUser?.email) {
      let vendorSubject = "";
      let vendorHtml = "";
      if (newBooking.status === "cancelled") {
        vendorSubject = `Booking Cancelled by ${couple.full_name}`;
        vendorHtml = `
          <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a0a2e; font-weight: 700;">Booking Cancelled</h1>
          <p style="color: #444; font-size: 15px; line-height: 1.7;">Hi ${vendor.business_name},</p>
          <p style="color: #444; font-size: 15px; line-height: 1.7;"><strong>${couple.full_name}</strong> has cancelled their booking with you.</p>
          <div style="background: linear-gradient(135deg, #faf7f4 0%, #f5ede4 100%); border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Wedding Date:</strong> ${weddingDateFormatted}</p>
            ${newBooking.cancellation_reason ? `<p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Reason:</strong> ${newBooking.cancellation_reason}</p>` : ""}
          </div>
          <div style="text-align: center; margin: 24px 0;">
            <a href="https://karloshaadi.com/vendor/dashboard" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">View Dashboard →</a>
          </div>
        `;
      } else if (newBooking.status === "completed") {
        vendorSubject = `Booking Completed — ${couple.full_name}`;
        vendorHtml = `
          <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a0a2e; font-weight: 700;">Booking Completed! 🎊</h1>
          <p style="color: #444; font-size: 15px; line-height: 1.7;">Hi ${vendor.business_name},</p>
          <p style="color: #444; font-size: 15px; line-height: 1.7;">The booking for <strong>${couple.full_name}</strong> has been marked as completed. Great work!</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="https://karloshaadi.com/vendor/dashboard" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">View Dashboard →</a>
          </div>
        `;
      }
      if (vendorSubject) {
        fetch(`${supabaseUrl}/functions/v1/send-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${supabaseServiceKey}` },
          body: JSON.stringify({ to: vendorUser.email, subject: vendorSubject, html: vendorHtml, type: `booking_${newBooking.status}_vendor` }),
        }).catch(() => { /* best-effort */ });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-booking-updated:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});