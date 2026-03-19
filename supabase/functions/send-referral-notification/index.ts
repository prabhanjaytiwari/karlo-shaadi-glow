import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const rawSenderEmail = Deno.env.get("SENDER_EMAIL") || "";
const freeEmailDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com"];
const isFreeEmail = freeEmailDomains.some((d) => rawSenderEmail.includes(d));
const senderEmail = rawSenderEmail && !isFreeEmail ? rawSenderEmail : "Karlo Shaadi <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReferralNotificationRequest {
  email: string;
  referrer_name: string;
  notification_type: "friend_signed_up" | "reward_earned" | "milestone_achieved";
  friend_name?: string;
  reward_amount?: number;
  milestone_name?: string;
  total_referrals?: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ReferralNotificationRequest = await req.json();
    
    console.log(`Sending referral notification to ${data.email}: ${data.notification_type}`);

    let subject = "";
    let content = "";

    switch (data.notification_type) {
      case "friend_signed_up":
        subject = `🎉 Your friend ${data.friend_name} just signed up!`;
        content = `
          <h2 style="color: #f43f5e; margin-bottom: 16px;">Great news! 🎊</h2>
          <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
            Hi ${data.referrer_name},
          </p>
          <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
            Your friend <strong>${data.friend_name}</strong> just signed up using your referral link! 
            They're now exploring Karlo Shaadi to plan their dream wedding.
          </p>
          <div style="background: #fef7f0; border-left: 4px solid #f97316; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #666;">
              💰 <strong>Earn ₹500</strong> when they complete their first booking!
            </p>
          </div>
          <p style="font-size: 14px; color: #666;">
            Keep sharing your referral link to earn more rewards!
          </p>
        `;
        break;

      case "reward_earned":
        subject = `💰 You earned ₹${data.reward_amount} referral reward!`;
        content = `
          <h2 style="color: #f43f5e; margin-bottom: 16px;">Cha-ching! 💰</h2>
          <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
            Hi ${data.referrer_name},
          </p>
          <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
            Amazing news! Your friend just completed their first booking, and you've earned your referral reward!
          </p>
          <div style="background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%); border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0;">
            <p style="color: white; font-size: 14px; margin: 0 0 8px 0;">Reward Credited</p>
            <p style="color: white; font-size: 32px; font-weight: 700; margin: 0;">₹${data.reward_amount?.toLocaleString()}</p>
          </div>
          <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
            This amount has been added to your referral credits. You can use it for future bookings!
          </p>
          <p style="font-size: 14px; color: #666;">
            Total Referrals: ${data.total_referrals || 1} | Keep inviting friends to earn more!
          </p>
        `;
        break;

      case "milestone_achieved":
        subject = `🏆 Milestone Unlocked: ${data.milestone_name}!`;
        content = `
          <h2 style="color: #f43f5e; margin-bottom: 16px;">Achievement Unlocked! 🏆</h2>
          <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
            Hi ${data.referrer_name},
          </p>
          <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
            Congratulations! You've achieved a new referral milestone!
          </p>
          <div style="background: #fef7f0; border: 2px solid #f97316; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0;">
            <p style="font-size: 24px; margin: 0 0 8px 0;">🎖️</p>
            <p style="font-size: 20px; font-weight: 700; color: #f97316; margin: 0 0 8px 0;">${data.milestone_name}</p>
            <p style="font-size: 14px; color: #666; margin: 0;">${data.total_referrals} successful referrals</p>
          </div>
          ${data.reward_amount ? `
            <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
              🎁 <strong>Bonus Reward:</strong> ₹${data.reward_amount.toLocaleString()} has been added to your account!
            </p>
          ` : ''}
          <p style="font-size: 14px; color: #666;">
            Keep referring to unlock more milestones and rewards!
          </p>
        `;
        break;
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
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%); border-radius: 16px 16px 0 0; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">Referral Update</h1>
          </div>
          
          <!-- Content -->
          <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            ${content}
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://karloshaadi.com/referrals" 
                 style="display: inline-block; background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                View Referral Dashboard
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>Share your referral link: karloshaadi.com/auth?ref=YOUR_CODE</p>
            <p>© 2025 Karlo Shaadi. Making dreams come true! 💕</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: senderEmail,
        to: [data.email],
        subject,
        html: htmlContent,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", emailData);
      throw new Error(emailData.message || "Failed to send email");
    }

    console.log("Referral notification sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true, data: emailData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending referral notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
