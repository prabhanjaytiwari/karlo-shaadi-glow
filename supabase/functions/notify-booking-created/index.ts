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
    
    // Fetch vendor and couple details
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

    // Get vendor's email
    const { data: { user: vendorUser } } = await supabase.auth.admin.getUserById(vendor.user_id);
    
    // Get couple's email
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

    // Send emails in background
    const emailPromises = [
      // Email to vendor
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
            <h1>New Booking Request</h1>
            <p>You have received a new booking request from <strong>${couple.full_name}</strong>.</p>
            <p><strong>Wedding Date:</strong> ${new Date(booking.wedding_date).toLocaleDateString()}</p>
            <p><strong>Amount:</strong> ₹${Number(booking.total_amount).toLocaleString()}</p>
            ${booking.special_requirements ? `<p><strong>Special Requirements:</strong> ${booking.special_requirements}</p>` : ""}
            <p>Please log in to your dashboard to accept or reject this booking.</p>
            <a href="${supabaseUrl.replace('.supabase.co', '.lovable.app')}/vendor/dashboard" style="display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">View Booking</a>
          `,
          type: "booking_vendor",
        }),
      }),
      // Email to couple
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
            <h1>Booking Request Sent Successfully</h1>
            <p>Your booking request has been sent to <strong>${vendor.business_name}</strong>.</p>
            <p><strong>Wedding Date:</strong> ${new Date(booking.wedding_date).toLocaleDateString()}</p>
            <p><strong>Amount:</strong> ₹${Number(booking.total_amount).toLocaleString()}</p>
            <p><strong>Advance Payment:</strong> ₹${Number(booking.total_amount * booking.advance_percentage / 100).toLocaleString()} (${booking.advance_percentage}%)</p>
            <p>The vendor will review your request and respond shortly. You'll receive a notification when they accept or reject your booking.</p>
            <a href="${supabaseUrl.replace('.supabase.co', '.lovable.app')}/bookings" style="display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">View Bookings</a>
          `,
          type: "booking_couple",
        }),
      }),
    ];

    // Don't await, let them run in background
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
