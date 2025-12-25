import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const senderEmail = Deno.env.get("SENDER_EMAIL") || "Karlo Shaadi <onboarding@resend.dev>";
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
      // Find bookings happening in 7 days
      targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + 7);
      const dateStr = targetDate.toISOString().split('T')[0];
      
      const { data: bookings } = await supabase
        .from("bookings")
        .select(`
          id,
          wedding_date,
          couple_id,
          vendor_id,
          total_amount,
          vendors (business_name, category)
        `)
        .eq("wedding_date", dateStr)
        .eq("status", "confirmed");
      
      bookingsToNotify = bookings || [];
      
    } else if (reminder_type === "1_day") {
      // Find bookings happening tomorrow
      targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + 1);
      const dateStr = targetDate.toISOString().split('T')[0];
      
      const { data: bookings } = await supabase
        .from("bookings")
        .select(`
          id,
          wedding_date,
          couple_id,
          vendor_id,
          total_amount,
          vendors (business_name, category, phone_number)
        `)
        .eq("wedding_date", dateStr)
        .eq("status", "confirmed");
      
      bookingsToNotify = bookings || [];
      
    } else if (reminder_type === "review_request") {
      // Find bookings completed 2 days ago without reviews
      targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() - 2);
      const dateStr = targetDate.toISOString().split('T')[0];
      
      const { data: bookings } = await supabase
        .from("bookings")
        .select(`
          id,
          wedding_date,
          couple_id,
          vendor_id,
          vendors (business_name, category)
        `)
        .eq("status", "completed")
        .gte("completed_at", dateStr + "T00:00:00")
        .lte("completed_at", dateStr + "T23:59:59");
      
      // Filter out bookings that already have reviews
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
      // Get user email from auth
      const { data: { user } } = await supabase.auth.admin.getUserById(booking.couple_id);
      if (!user?.email) continue;

      // Get profile for name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", booking.couple_id)
        .single();

      const userName = profile?.full_name || "there";
      const vendorName = booking.vendors?.business_name || "your vendor";

      let subject = "";
      let content = "";

      if (reminder_type === "7_days") {
        subject = `📅 1 Week to Go! Your wedding with ${vendorName}`;
        content = `
          <h2 style="color: #f43f5e;">Your big day is almost here! 🎊</h2>
          <p>Hi ${userName},</p>
          <p>Just a friendly reminder that your wedding is in <strong>7 days</strong>!</p>
          <div style="background: #fef7f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Vendor:</strong> ${vendorName}</p>
            <p><strong>Date:</strong> ${new Date(booking.wedding_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <p>Make sure to:</p>
          <ul>
            <li>Confirm final details with your vendor</li>
            <li>Complete any pending payments</li>
            <li>Share any last-minute requirements</li>
          </ul>
        `;
      } else if (reminder_type === "1_day") {
        subject = `🎉 Tomorrow is the day! Final reminder for ${vendorName}`;
        content = `
          <h2 style="color: #f43f5e;">It's happening tomorrow! 🎊</h2>
          <p>Hi ${userName},</p>
          <p>Your wedding is <strong>TOMORROW</strong>! We're so excited for you!</p>
          <div style="background: #fef7f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Vendor:</strong> ${vendorName}</p>
            <p><strong>Contact:</strong> ${booking.vendors?.phone_number || 'Check your messages'}</p>
            <p><strong>Date:</strong> ${new Date(booking.wedding_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <p>Wishing you all the happiness in the world! 💕</p>
        `;
      } else if (reminder_type === "review_request") {
        subject = `💬 How was ${vendorName}? Share your experience!`;
        content = `
          <h2 style="color: #f43f5e;">We'd love your feedback! ⭐</h2>
          <p>Hi ${userName},</p>
          <p>Congratulations on your wedding! 🎊 We hope everything went perfectly!</p>
          <p>Would you mind taking a moment to review <strong>${vendorName}</strong>? Your feedback helps other couples make informed decisions.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://karloshaadi.com/booking/${booking.id}" 
               style="display: inline-block; background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Leave a Review
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Your review makes a real difference in helping others plan their dream wedding!</p>
        `;
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f4f0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              ${content}
            </div>
            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
              <p>© 2025 Karlo Shaadi. Making dreams come true! 💕</p>
            </div>
          </div>
        </body>
        </html>
      `;

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
            html: htmlContent,
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
      JSON.stringify({ 
        success: true, 
        message: `Sent ${sentCount} ${reminder_type} reminders` 
      }),
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
