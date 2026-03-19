import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const senderEmail = Deno.env.get("SENDER_EMAIL") || "Karlo Shaadi <noreply@karloshaadi.com>";

const LOGO_URL = "https://qeutvpwskilkbgynhrai.supabase.co/storage/v1/object/public/og-images/karlo-shaadi-logo.png";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OnboardingEmailRequest {
  user_id: string;
  email: string;
  name: string;
  user_type: "couple" | "vendor";
}

function brandedWrapper(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #faf7f4; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #faf7f4;">
        
        <!-- Top accent bar -->
        <div style="height: 4px; background: linear-gradient(90deg, #D946EF 0%, #D4A574 50%, #f43f5e 100%);"></div>
        
        <!-- Header with logo -->
        <div style="background: linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 40%, #1a0a2e 100%); padding: 40px 30px 35px; text-align: center;">
          <img src="${LOGO_URL}" alt="Karlo Shaadi" style="height: 60px; width: auto; margin-bottom: 12px;" />
          <p style="margin: 0; color: #D4A574; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; font-family: 'DM Sans', sans-serif;">India's Most Trending Wedding Platform</p>
        </div>
        
        <!-- Main content card -->
        <div style="margin: 0; background: #ffffff; padding: 40px 35px;">
          ${content}
        </div>
        
        <!-- Footer -->
        <div style="background: #1a0a2e; padding: 30px; text-align: center;">
          <img src="${LOGO_URL}" alt="Karlo Shaadi" style="height: 32px; width: auto; margin-bottom: 12px; opacity: 0.8;" />
          <p style="margin: 0 0 8px; color: #D4A574; font-size: 12px; font-family: 'DM Sans', sans-serif;">
            Aap Shaadi Karo, Tension Hum Sambhal Lenge
          </p>
          <div style="margin: 16px 0; border-top: 1px solid rgba(212, 165, 116, 0.2); padding-top: 16px;">
            <a href="https://karloshaadi.com" style="color: #D4A574; text-decoration: none; font-size: 12px; margin: 0 8px;">Website</a>
            <span style="color: rgba(212, 165, 116, 0.3);">•</span>
            <a href="https://wa.me/917011460321" style="color: #D4A574; text-decoration: none; font-size: 12px; margin: 0 8px;">WhatsApp</a>
            <span style="color: rgba(212, 165, 116, 0.3);">•</span>
            <a href="https://instagram.com/karloshaadiofficial" style="color: #D4A574; text-decoration: none; font-size: 12px; margin: 0 8px;">Instagram</a>
          </div>
          <p style="margin: 0; color: rgba(255,255,255,0.4); font-size: 11px; font-family: 'DM Sans', sans-serif;">
            © ${new Date().getFullYear()} Karlo Shaadi · Lucknow, India
          </p>
        </div>
        
        <!-- Bottom accent bar -->
        <div style="height: 4px; background: linear-gradient(90deg, #f43f5e 0%, #D4A574 50%, #D946EF 100%);"></div>
      </div>
    </body>
    </html>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, email, name, user_type }: OnboardingEmailRequest = await req.json();
    console.log(`Sending onboarding email to ${email} (${user_type})`);

    const firstName = name?.split(" ")[0] || "there";

    let subject: string;
    let bodyContent: string;

    if (user_type === "vendor") {
      subject = `Welcome to Karlo Shaadi, ${firstName}! 🎉 Let's Grow Your Business`;
      bodyContent = `
        <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 26px; color: #1a0a2e; font-weight: 700;">
          Welcome aboard, ${firstName}! 🎊
        </h1>
        <p style="margin: 0 0 24px; color: #D4A574; font-size: 14px; font-weight: 500;">You're now part of India's fastest-growing wedding vendor network</p>
        
        <p style="color: #444; font-size: 15px; line-height: 1.7;">
          Congratulations on joining <strong>500+ successful wedding professionals</strong> who are growing their business with Karlo Shaadi — with <strong style="color: #D946EF;">zero commission</strong>.
        </p>
        
        <!-- Steps card -->
        <div style="background: linear-gradient(135deg, #faf7f4 0%, #f5ede4 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid #D4A574;">
          <h3 style="margin: 0 0 16px; font-family: 'Playfair Display', Georgia, serif; color: #1a0a2e; font-size: 17px;">📋 Complete Your Profile</h3>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; color: #555; font-size: 14px;">
                <span style="display: inline-block; width: 24px; height: 24px; background: #D946EF; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 10px;">1</span>
                Add your <strong>portfolio</strong> — showcase your best work
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555; font-size: 14px;">
                <span style="display: inline-block; width: 24px; height: 24px; background: #D946EF; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 10px;">2</span>
                List your <strong>services & pricing</strong>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555; font-size: 14px;">
                <span style="display: inline-block; width: 24px; height: 24px; background: #D946EF; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 10px;">3</span>
                Get <strong>verified</strong> — build instant trust
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555; font-size: 14px;">
                <span style="display: inline-block; width: 24px; height: 24px; background: #D946EF; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 10px;">4</span>
                Set your <strong>availability calendar</strong>
              </td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://karloshaadi.com/vendor/dashboard" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; letter-spacing: 0.3px;">Complete Your Profile →</a>
        </div>
        
        <!-- Pro tips -->
        <div style="background: #fff8f0; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid rgba(212, 165, 116, 0.3);">
          <h3 style="margin: 0 0 12px; font-family: 'Playfair Display', Georgia, serif; color: #1a0a2e; font-size: 17px;">💡 Pro Tips for More Bookings</h3>
          <p style="margin: 4px 0; color: #555; font-size: 13px; line-height: 1.8;">
            ✦ Upload at least <strong>10 high-quality portfolio images</strong><br>
            ✦ Respond to inquiries <strong>within 2 hours</strong><br>
            ✦ Keep your calendar <strong>always updated</strong><br>
            ✦ Ask happy clients to <strong>leave reviews</strong>
          </p>
        </div>
        
        <p style="color: #666; font-size: 14px; line-height: 1.7;">
          Need help? WhatsApp us anytime: <a href="https://wa.me/917011460321" style="color: #D946EF; text-decoration: none; font-weight: 600;">+91 70114 60321</a>
        </p>
        
        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #f0e8df;">
          <p style="margin: 0; color: #1a0a2e; font-size: 14px;">Here's to your success! 🥂</p>
          <p style="margin: 4px 0 0; color: #888; font-size: 13px;"><strong>Prabhanjay Tiwari</strong> · Founder, Karlo Shaadi</p>
        </div>
      `;
    } else {
      subject = `Welcome to Karlo Shaadi, ${firstName}! 💍 Let's Plan Your Dream Wedding`;
      bodyContent = `
        <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 26px; color: #1a0a2e; font-weight: 700;">
          Congratulations, ${firstName}! 💍
        </h1>
        <p style="margin: 0 0 24px; color: #D4A574; font-size: 14px; font-weight: 500;">Your dream wedding journey starts now</p>
        
        <p style="color: #444; font-size: 15px; line-height: 1.7;">
          Welcome to the Karlo Shaadi family! We connect you with <strong>500+ verified wedding vendors</strong> across India — from photographers to caterers, decorators to makeup artists.
        </p>
        
        <!-- Getting started card -->
        <div style="background: linear-gradient(135deg, #faf7f4 0%, #f5ede4 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid #D4A574;">
          <h3 style="margin: 0 0 16px; font-family: 'Playfair Display', Georgia, serif; color: #1a0a2e; font-size: 17px;">🎯 Get Started in Minutes</h3>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; color: #555; font-size: 14px;">
                <span style="display: inline-block; width: 24px; height: 24px; background: #D946EF; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 10px;">1</span>
                Complete your <strong>wedding profile</strong>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555; font-size: 14px;">
                <span style="display: inline-block; width: 24px; height: 24px; background: #D946EF; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 10px;">2</span>
                Browse <strong>verified vendors</strong> in your city
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555; font-size: 14px;">
                <span style="display: inline-block; width: 24px; height: 24px; background: #D946EF; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 10px;">3</span>
                Use <strong>AI matching</strong> for personalized picks
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555; font-size: 14px;">
                <span style="display: inline-block; width: 24px; height: 24px; background: #D946EF; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 10px;">4</span>
                Save ideas to your <strong>moodboard</strong>
              </td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://karloshaadi.com/search" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; letter-spacing: 0.3px;">Start Exploring Vendors →</a>
        </div>
        
        <!-- Features grid -->
        <div style="margin: 24px 0;">
          <h3 style="margin: 0 0 16px; font-family: 'Playfair Display', Georgia, serif; color: #1a0a2e; font-size: 17px;">✨ Your Planning Toolkit</h3>
          <table style="width: 100%; border-spacing: 8px; border-collapse: separate;">
            <tr>
              <td style="background: #fff8f0; border-radius: 8px; padding: 14px; width: 50%; vertical-align: top; border: 1px solid rgba(212,165,116,0.2);">
                <span style="font-size: 18px;">🤖</span>
                <p style="margin: 4px 0 0; font-size: 13px; color: #555; font-weight: 600;">AI Wedding Planner</p>
              </td>
              <td style="background: #fff8f0; border-radius: 8px; padding: 14px; width: 50%; vertical-align: top; border: 1px solid rgba(212,165,116,0.2);">
                <span style="font-size: 18px;">📋</span>
                <p style="margin: 4px 0 0; font-size: 13px; color: #555; font-weight: 600;">Smart Checklist</p>
              </td>
            </tr>
            <tr>
              <td style="background: #fff8f0; border-radius: 8px; padding: 14px; width: 50%; vertical-align: top; border: 1px solid rgba(212,165,116,0.2);">
                <span style="font-size: 18px;">💰</span>
                <p style="margin: 4px 0 0; font-size: 13px; color: #555; font-weight: 600;">Budget Tracker</p>
              </td>
              <td style="background: #fff8f0; border-radius: 8px; padding: 14px; width: 50%; vertical-align: top; border: 1px solid rgba(212,165,116,0.2);">
                <span style="font-size: 18px;">💬</span>
                <p style="margin: 4px 0 0; font-size: 13px; color: #555; font-weight: 600;">Vendor Chat</p>
              </td>
            </tr>
          </table>
        </div>
        
        <p style="color: #666; font-size: 14px; line-height: 1.7;">
          Questions? WhatsApp us: <a href="https://wa.me/917011460321" style="color: #D946EF; text-decoration: none; font-weight: 600;">+91 70114 60321</a>
        </p>
        
        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #f0e8df;">
          <p style="margin: 0; color: #1a0a2e; font-size: 14px;">Happy planning! 🎊</p>
          <p style="margin: 4px 0 0; color: #888; font-size: 13px;"><strong>Team Karlo Shaadi</strong></p>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: senderEmail,
      to: [email],
      subject: subject,
      html: brandedWrapper(bodyContent),
    });

    console.log("Onboarding email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in onboarding-email function:", error);
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
