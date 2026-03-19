import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const senderEmail = Deno.env.get("SENDER_EMAIL") || "Karlo Shaadi <noreply@karloshaadi.com>";

const LOGO_URL = "https://qeutvpwskilkbgynhrai.supabase.co/storage/v1/object/public/og-images/karlo-shaadi-logo.png";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function brandedWrapper(content: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');</style></head><body style="margin:0;padding:0;background-color:#faf7f4;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;"><div style="max-width:600px;margin:0 auto;background-color:#faf7f4;"><div style="height:4px;background:linear-gradient(90deg,#D946EF 0%,#D4A574 50%,#f43f5e 100%);"></div><div style="background:linear-gradient(135deg,#1a0a2e 0%,#2d1b4e 40%,#1a0a2e 100%);padding:40px 30px 35px;text-align:center;"><img src="${LOGO_URL}" alt="Karlo Shaadi" style="height:60px;width:auto;margin-bottom:12px;"/><p style="margin:0;color:#D4A574;font-size:11px;letter-spacing:3px;text-transform:uppercase;">India's Most Trending Wedding Platform</p></div><div style="margin:0;background:#ffffff;padding:40px 35px;">${content}</div><div style="background:#1a0a2e;padding:30px;text-align:center;"><img src="${LOGO_URL}" alt="Karlo Shaadi" style="height:32px;width:auto;margin-bottom:12px;opacity:0.8;"/><p style="margin:0 0 8px;color:#D4A574;font-size:12px;">Aap Shaadi Karo, Tension Hum Sambhal Lenge</p><div style="margin:16px 0;border-top:1px solid rgba(212,165,116,0.2);padding-top:16px;"><a href="https://karloshaadi.com" style="color:#D4A574;text-decoration:none;font-size:12px;margin:0 8px;">Website</a><span style="color:rgba(212,165,116,0.3);">•</span><a href="https://wa.me/917011460321" style="color:#D4A574;text-decoration:none;font-size:12px;margin:0 8px;">WhatsApp</a><span style="color:rgba(212,165,116,0.3);">•</span><a href="https://instagram.com/karloshaadiofficial" style="color:#D4A574;text-decoration:none;font-size:12px;margin:0 8px;">Instagram</a></div><p style="margin:0;color:rgba(255,255,255,0.4);font-size:11px;">© ${new Date().getFullYear()} Karlo Shaadi · Lucknow, India</p></div><div style="height:4px;background:linear-gradient(90deg,#f43f5e 0%,#D4A574 50%,#D946EF 100%);"></div></div></body></html>`;
}

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

    const firstName = data.referrer_name?.split(" ")[0] || "there";
    let subject = "";
    let content = "";

    switch (data.notification_type) {
      case "friend_signed_up":
        subject = `🎉 Your friend ${data.friend_name} just signed up!`;
        content = `
          <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a0a2e; font-weight: 700;">Great News! 🎊</h1>
          <p style="color: #444; font-size: 15px; line-height: 1.7;">Hi ${firstName}, your friend <strong>${data.friend_name}</strong> just signed up using your referral link!</p>
          <div style="background: linear-gradient(135deg, #faf7f4 0%, #f5ede4 100%); border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #D4A574;">
            <p style="margin: 0; color: #555; font-size: 14px;">💰 <strong>Earn ₹500</strong> when they complete their first booking!</p>
          </div>
          <p style="color: #888; font-size: 13px;">Keep sharing your referral link to earn more rewards!</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="https://karloshaadi.com/referrals" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">View Referrals →</a>
          </div>
        `;
        break;

      case "reward_earned":
        subject = `💰 You earned ₹${data.reward_amount} referral reward!`;
        content = `
          <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a0a2e; font-weight: 700;">Cha-ching! 💰</h1>
          <p style="color: #444; font-size: 15px; line-height: 1.7;">Hi ${firstName}, your friend just completed their first booking!</p>
          <div style="background: linear-gradient(135deg, #D946EF 0%, #ec4899 100%); border-radius: 12px; padding: 28px; text-align: center; margin: 24px 0;">
            <p style="color: rgba(255,255,255,0.8); font-size: 13px; margin: 0 0 4px;">Reward Credited</p>
            <p style="color: white; font-size: 36px; font-weight: 700; margin: 0; font-family: 'Playfair Display', Georgia, serif;">₹${data.reward_amount?.toLocaleString()}</p>
          </div>
          <p style="color: #444; font-size: 15px; line-height: 1.7;">This has been added to your referral credits. Use it for future bookings!</p>
          <p style="color: #888; font-size: 13px;">Total Referrals: ${data.total_referrals || 1} | Keep inviting to earn more!</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="https://karloshaadi.com/referrals" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">View Referrals →</a>
          </div>
        `;
        break;

      case "milestone_achieved":
        subject = `🏆 Milestone Unlocked: ${data.milestone_name}!`;
        content = `
          <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a0a2e; font-weight: 700;">Achievement Unlocked! 🏆</h1>
          <p style="color: #444; font-size: 15px; line-height: 1.7;">Hi ${firstName}, congratulations! You've achieved a new referral milestone!</p>
          <div style="background: linear-gradient(135deg, #faf7f4 0%, #f5ede4 100%); border: 2px solid #D4A574; border-radius: 12px; padding: 28px; text-align: center; margin: 24px 0;">
            <p style="font-size: 32px; margin: 0 0 8px;">🎖️</p>
            <p style="font-size: 20px; font-weight: 700; color: #D4A574; margin: 0 0 4px; font-family: 'Playfair Display', Georgia, serif;">${data.milestone_name}</p>
            <p style="font-size: 13px; color: #888; margin: 0;">${data.total_referrals} successful referrals</p>
          </div>
          ${data.reward_amount ? `<p style="color: #444; font-size: 15px; line-height: 1.7;">🎁 <strong>Bonus Reward:</strong> ₹${data.reward_amount.toLocaleString()} has been added to your account!</p>` : ''}
          <p style="color: #888; font-size: 13px;">Keep referring to unlock more milestones!</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="https://karloshaadi.com/referrals" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">View Referrals →</a>
          </div>
        `;
        break;
    }

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
        html: brandedWrapper(content),
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