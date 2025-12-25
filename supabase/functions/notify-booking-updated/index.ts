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
    
    // Only proceed if status changed
    if (oldBooking.status === newBooking.status) {
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Fetch vendor and couple details
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

    if (!coupleUser?.email) {
      throw new Error("Couple email not found");
    }

    let notificationTitle = "";
    let notificationMessage = "";
    let emailSubject = "";
    let emailHtml = "";

    // Handle different status changes
    if (newBooking.status === "confirmed") {
      notificationTitle = "Booking Confirmed";
      notificationMessage = `${vendor.business_name} has confirmed your booking`;
      emailSubject = `Booking Confirmed - ${vendor.business_name}`;
      emailHtml = `
        <h1>🎉 Booking Confirmed!</h1>
        <p><strong>${vendor.business_name}</strong> has confirmed your booking.</p>
        <p><strong>Wedding Date:</strong> ${new Date(newBooking.wedding_date).toLocaleDateString()}</p>
        <p><strong>Total Amount:</strong> ₹${Number(newBooking.total_amount).toLocaleString()}</p>
        <p><strong>Advance to Pay:</strong> ₹${Number(newBooking.total_amount * newBooking.advance_percentage / 100).toLocaleString()}</p>
        <p>Please proceed with the advance payment to secure your booking.</p>
        <a href="${supabaseUrl.replace('.supabase.co', '.lovable.app')}/bookings" style="display: inline-block; background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">Make Payment</a>
      `;
    } else if (newBooking.status === "cancelled") {
      notificationTitle = "Booking Cancelled";
      notificationMessage = `Your booking with ${vendor.business_name} has been cancelled`;
      emailSubject = `Booking Cancelled - ${vendor.business_name}`;
      emailHtml = `
        <h1>Booking Cancelled</h1>
        <p>Your booking with <strong>${vendor.business_name}</strong> has been cancelled.</p>
        <p><strong>Wedding Date:</strong> ${new Date(newBooking.wedding_date).toLocaleDateString()}</p>
        ${newBooking.cancellation_reason ? `<p><strong>Reason:</strong> ${newBooking.cancellation_reason}</p>` : ""}
        <p>You can browse other vendors on our platform.</p>
        <a href="${supabaseUrl.replace('.supabase.co', '.lovable.app')}/search" style="display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">Find Vendors</a>
      `;
    } else if (newBooking.status === "completed") {
      notificationTitle = "Booking Completed";
      notificationMessage = `Your booking with ${vendor.business_name} is marked as completed`;
      emailSubject = `Booking Completed - ${vendor.business_name}`;
      emailHtml = `
        <h1>🎊 Booking Completed!</h1>
        <p>Your booking with <strong>${vendor.business_name}</strong> has been completed.</p>
        <p>We hope you had an amazing wedding experience!</p>
        <p>Please take a moment to leave a review and help other couples.</p>
        <a href="${supabaseUrl.replace('.supabase.co', '.lovable.app')}/bookings" style="display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">Leave a Review</a>
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

    // Send email in background
    fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        to: coupleUser.email,
        subject: emailSubject,
        html: emailHtml,
        type: `booking_${newBooking.status}`,
      }),
    }).catch(err => console.error("Email sending error:", err));

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
