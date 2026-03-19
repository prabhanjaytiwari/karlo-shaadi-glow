import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const senderEmail = Deno.env.get("SENDER_EMAIL") || "Karlo Shaadi <noreply@karloshaadi.com>";
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const LOGO_URL = "https://qeutvpwskilkbgynhrai.supabase.co/storage/v1/object/public/og-images/karlo-shaadi-logo.png";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function brandedWrapper(content: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');</style></head><body style="margin:0;padding:0;background-color:#faf7f4;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;"><div style="max-width:600px;margin:0 auto;background-color:#faf7f4;"><div style="height:4px;background:linear-gradient(90deg,#D946EF 0%,#D4A574 50%,#f43f5e 100%);"></div><div style="background:linear-gradient(135deg,#1a0a2e 0%,#2d1b4e 40%,#1a0a2e 100%);padding:40px 30px 35px;text-align:center;"><img src="${LOGO_URL}" alt="Karlo Shaadi" style="height:60px;width:auto;margin-bottom:12px;"/><p style="margin:0;color:#D4A574;font-size:11px;letter-spacing:3px;text-transform:uppercase;">India's Most Trending Wedding Platform</p></div><div style="margin:0;background:#ffffff;padding:40px 35px;">${content}</div><div style="background:#1a0a2e;padding:30px;text-align:center;"><img src="${LOGO_URL}" alt="Karlo Shaadi" style="height:32px;width:auto;margin-bottom:12px;opacity:0.8;"/><p style="margin:0 0 8px;color:#D4A574;font-size:12px;">Aap Shaadi Karo, Tension Hum Sambhal Lenge</p><div style="margin:16px 0;border-top:1px solid rgba(212,165,116,0.2);padding-top:16px;"><a href="https://karloshaadi.com" style="color:#D4A574;text-decoration:none;font-size:12px;margin:0 8px;">Website</a><span style="color:rgba(212,165,116,0.3);">•</span><a href="https://wa.me/917011460321" style="color:#D4A574;text-decoration:none;font-size:12px;margin:0 8px;">WhatsApp</a><span style="color:rgba(212,165,116,0.3);">•</span><a href="https://instagram.com/karloshaadiofficial" style="color:#D4A574;text-decoration:none;font-size:12px;margin:0 8px;">Instagram</a></div><p style="margin:0;color:rgba(255,255,255,0.4);font-size:11px;">© ${new Date().getFullYear()} Karlo Shaadi · Lucknow, India</p></div><div style="height:4px;background:linear-gradient(90deg,#f43f5e 0%,#D4A574 50%,#D946EF 100%);"></div></div></body></html>`;
}

interface BookingReminderRequest {
  reminder_type: "7_days" | "1_day" | "review_request";
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { reminder_type } = await req.json() as BookingReminderRequest;
    console.log(`Processing ${reminder_type} reminders`);

    const today = new Date();
    let targetDate: Date;
    let bookingsToNotify: any[] = [];

    if (reminder_type === "7_days") {
      targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + 7);
      const dateStr = targetDate.toISOString().split('T')[0];
      const { data: bookings } = await supabase
        .from("bookings")
        .select(`id, wedding_date, couple_id, vendor_id, total_amount, vendors (business_name, category)`)
        .eq("wedding_date", dateStr)
        .eq("status", "confirmed");
      bookingsToNotify = bookings || [];
    } else if (reminder_type === "1_day") {
      targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + 1);
      const dateStr = targetDate.toISOString().split('T')[0];
      const { data: bookings } = await supabase
        .from("bookings")
        .select(`id, wedding_date, couple_id, vendor_id, total_amount, vendors (business_name, category, phone_number)`)
        .eq("wedding_date", dateStr)
        .eq("status", "confirmed");
      bookingsToNotify = bookings || [];
    } else if (reminder_type === "review_request") {
      targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() - 2);
      const dateStr = targetDate.toISOString().split('T')[0];
      const { data: bookings } = await supabase
        .from("bookings")
        .select(`id, wedding_date, couple_id, vendor_id, vendors (business_name, category)`)
        .eq("status", "completed")
        .gte("completed_at", dateStr + "T00:00:00")
        .lte("completed_at", dateStr + "T23:59:59");
      if (bookings) {
        for (const booking of bookings) {
          const { data: existingReview } = await supabase
            .from("reviews")
            .select("id")
            .eq("booking_id", booking.id)
            .single();
          if (!existingReview) {
            bookingsToNotify.push(booking);
          }
        }
      }
    }

    console.log(`Found ${bookingsToNotify.length} bookings to notify`);

    let sentCount = 0;
    
    for (const booking of bookingsToNotify) {
      const { data: { user } } = await supabase.auth.admin.getUserById(booking.couple_id);
      if (!user?.email) continue;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", booking.couple_id)
        .single();

      const userName = profile?.full_name?.split(" ")[0] || "there";
      const vendorName = booking.vendors?.business_name || "your vendor";
      const weddingDateFormatted = new Date(booking.wedding_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      let subject = "";
      let content = "";

      if (reminder_type === "7_days") {
        subject = `📅 1 Week to Go! Your wedding with ${vendorName}`;
        content = `
          <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a0a2e; font-weight: 700;">Your Big Day is Almost Here! 🎊</h1>
          <p style="color: #444; font-size: 15px; line-height: 1.7;">Hi ${userName}, just a friendly reminder that your wedding is in <strong>7 days</strong>!</p>
          <div style="background: linear-gradient(135deg, #faf7f4 0%, #f5ede4 100%); border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #D4A574;">
            <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Vendor:</strong> ${vendorName}</p>
            <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Date:</strong> ${weddingDateFormatted}</p>
          </div>
          <p style="color: #444; font-size: 14px; line-height: 1.7;">Make sure to:</p>
          <p style="color: #555; font-size: 13px; line-height: 1.8; margin: 8px 0;">
            ✦ Confirm final details with your vendor<br>
            ✦ Complete any pending payments<br>
            ✦ Share any last-minute requirements
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="https://karloshaadi.com/bookings" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">View Booking Details →</a>
          </div>
        `;
      } else if (reminder_type === "1_day") {
        subject = `🎉 Tomorrow is the day! Final reminder for ${vendorName}`;
        content = `
          <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a0a2e; font-weight: 700;">It's Happening Tomorrow! 🎊</h1>
          <p style="color: #444; font-size: 15px; line-height: 1.7;">Hi ${userName}, your wedding is <strong>TOMORROW</strong>! We're so excited for you!</p>
          <div style="background: linear-gradient(135deg, #faf7f4 0%, #f5ede4 100%); border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #D946EF;">
            <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Vendor:</strong> ${vendorName}</p>
            <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Contact:</strong> ${booking.vendors?.phone_number || 'Check your messages'}</p>
            <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Date:</strong> ${weddingDateFormatted}</p>
          </div>
          <p style="color: #444; font-size: 15px; line-height: 1.7;">Wishing you all the happiness in the world! 💕</p>
        `;
      } else if (reminder_type === "review_request") {
        subject = `💬 How was ${vendorName}? Share your experience!`;
        content = `
          <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a0a2e; font-weight: 700;">We'd Love Your Feedback! ⭐</h1>
          <p style="color: #444; font-size: 15px; line-height: 1.7;">Hi ${userName}, congratulations on your wedding! 🎊 We hope everything went perfectly!</p>
          <p style="color: #444; font-size: 15px; line-height: 1.7;">Would you mind taking a moment to review <strong>${vendorName}</strong>? Your feedback helps other couples make informed decisions.</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="https://karloshaadi.com/booking/${booking.id}" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">Leave a Review →</a>
          </div>
          <p style="color: #888; font-size: 13px;">Your review makes a real difference in helping others plan their dream wedding!</p>
        `;
      }

      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: senderEmail,
            to: [user.email],
            subject,
            html: brandedWrapper(content),
          }),
        });

        if (emailResponse.ok) {
          sentCount++;
          console.log(`Sent reminder to ${user.email}`);
        }
      } catch (emailError) {
        console.error(`Failed to send to ${user.email}:`, emailError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: `Sent ${sentCount} ${reminder_type} reminders` }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error processing reminders:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);