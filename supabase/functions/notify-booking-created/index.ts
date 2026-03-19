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
    
    console.log("Booking webhook received:", payload);

    const booking = payload.record;
    
    const { data: vendor } = await supabase
      .from("vendors")
      .select("business_name, user_id")
      .eq("id", booking.vendor_id)
      .single();

    const { data: couple } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", booking.couple_id)
      .single();

    if (!vendor || !couple) {
      throw new Error("Vendor or couple not found");
    }

    const { data: { user: vendorUser } } = await supabase.auth.admin.getUserById(vendor.user_id);
    const { data: { user: coupleUser } } = await supabase.auth.admin.getUserById(booking.couple_id);

    if (!vendorUser?.email || !coupleUser?.email) {
      throw new Error("User emails not found");
    }

    // Create notifications
    await supabase.from("notifications").insert([
      {
        user_id: vendor.user_id,
        type: "booking",
        title: "New Booking Request",
        message: `You have a new booking request from ${couple.full_name}`,
        link: "/vendor/dashboard",
      },
      {
        user_id: booking.couple_id,
        type: "booking",
        title: "Booking Request Sent",
        message: `Your booking request has been sent to ${vendor.business_name}`,
        link: "/bookings",
      },
    ]);

    // Send push notifications
    const pushPromises = [
      fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          user_id: vendor.user_id,
          title: "New Booking Request 🎉",
          body: `${couple.full_name} wants to book you for their wedding!`,
          url: "/vendor/dashboard",
          tag: "booking"
        }),
      }),
      fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          user_id: booking.couple_id,
          title: "Booking Request Sent ✅",
          body: `Your request to ${vendor.business_name} has been sent!`,
          url: "/bookings",
          tag: "booking"
        }),
      }),
    ];

    const weddingDateFormatted = new Date(booking.wedding_date).toLocaleDateString();
    const amountFormatted = `₹${Number(booking.total_amount).toLocaleString()}`;

    // Send emails
    const emailPromises = [
      fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          to: vendorUser.email,
          subject: `New Booking Request - ${couple.full_name}`,
          html: `
            <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a0a2e; font-weight: 700;">New Booking Request 🎉</h1>
            <p style="color: #444; font-size: 15px; line-height: 1.7;">You have received a new booking request from <strong>${couple.full_name}</strong>.</p>
            <div style="background: linear-gradient(135deg, #faf7f4 0%, #f5ede4 100%); border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #D4A574;">
              <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Wedding Date:</strong> ${weddingDateFormatted}</p>
              <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Amount:</strong> ${amountFormatted}</p>
              ${booking.special_requirements ? `<p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Special Requirements:</strong> ${booking.special_requirements}</p>` : ""}
            </div>
            <p style="color: #666; font-size: 14px;">Please log in to your dashboard to accept or reject this booking.</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="https://karloshaadi.com/vendor/dashboard" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">View Booking →</a>
            </div>
          `,
          type: "booking_vendor",
        }),
      }),
      fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          to: coupleUser.email,
          subject: `Booking Request Sent - ${vendor.business_name}`,
          html: `
            <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a0a2e; font-weight: 700;">Booking Request Sent ✅</h1>
            <p style="color: #444; font-size: 15px; line-height: 1.7;">Your booking request has been sent to <strong>${vendor.business_name}</strong>.</p>
            <div style="background: linear-gradient(135deg, #faf7f4 0%, #f5ede4 100%); border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #D4A574;">
              <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Wedding Date:</strong> ${weddingDateFormatted}</p>
              <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Total Amount:</strong> ${amountFormatted}</p>
              <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Advance Payment:</strong> ₹${Number(booking.total_amount * booking.advance_percentage / 100).toLocaleString()} (${booking.advance_percentage}%)</p>
            </div>
            <p style="color: #666; font-size: 14px;">The vendor will review your request and respond shortly.</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="https://karloshaadi.com/bookings" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">View Bookings →</a>
            </div>
          `,
          type: "booking_couple",
        }),
      }),
    ];

    Promise.all([...pushPromises, ...emailPromises]).catch(err => console.error("Notification sending error:", err));

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-booking-created:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});