import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, email, name, user_type }: OnboardingEmailRequest = await req.json();

    console.log(`Sending onboarding email to ${email} (${user_type})`);

    const firstName = name?.split(" ")[0] || "there";

    // Different email content based on user type
    let subject: string;
    let htmlContent: string;

    if (user_type === "vendor") {
      subject = `Welcome to Karlo Shaadi, ${firstName}! 🎉 Let's Grow Your Business`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #D4A574; margin-bottom: 10px;">🎊 Welcome to Karlo Shaadi!</h1>
          </div>
          
          <p>Hi ${firstName},</p>
          
          <p>Congratulations on joining India's fastest-growing wedding vendor platform! 🎉</p>
          
          <p>You're now part of a community of 500+ successful wedding professionals who are growing their business with us.</p>
          
          <h3 style="color: #D4A574;">📋 Complete Your Profile to Get Started:</h3>
          <ul style="padding-left: 20px;">
            <li><strong>Add your portfolio</strong> - Showcase your best work</li>
            <li><strong>List your services</strong> - Set your pricing and packages</li>
            <li><strong>Get verified</strong> - Build trust with the verified badge</li>
            <li><strong>Set availability</strong> - Let couples know when you're free</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://karloshaadi.com/vendor/dashboard" style="background: linear-gradient(135deg, #D4A574, #c49463); color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">Complete Your Profile</a>
          </div>
          
          <h3 style="color: #D4A574;">💡 Pro Tips to Get More Bookings:</h3>
          <ol style="padding-left: 20px;">
            <li>Upload at least 10 high-quality portfolio images</li>
            <li>Respond to inquiries within 2 hours</li>
            <li>Keep your calendar updated</li>
            <li>Ask happy clients to leave reviews</li>
          </ol>
          
          <p>Need help? Reply to this email or reach out on WhatsApp: <a href="https://wa.me/917011460321">+91 70114 60321</a></p>
          
          <p>Here's to your success! 🥂</p>
          
          <p>Warm regards,<br>
          <strong>Prabhanjay Tiwari</strong><br>
          Founder, Karlo Shaadi</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; text-align: center;">
            © 2024 Karlo Shaadi. Making Indian weddings magical.
          </p>
        </body>
        </html>
      `;
    } else {
      subject = `Welcome to Karlo Shaadi, ${firstName}! 💍 Let's Plan Your Dream Wedding`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #D4A574; margin-bottom: 10px;">💍 Welcome to Karlo Shaadi!</h1>
          </div>
          
          <p>Hi ${firstName},</p>
          
          <p>Congratulations on taking the first step towards your dream wedding! 🎉</p>
          
          <p>We're thrilled to have you join the Karlo Shaadi family. Our platform connects you with 500+ verified wedding vendors across India.</p>
          
          <h3 style="color: #D4A574;">🎯 Here's How to Get Started:</h3>
          <ul style="padding-left: 20px;">
            <li><strong>Complete your profile</strong> - Tell us about your wedding plans</li>
            <li><strong>Browse vendors</strong> - Explore photographers, caterers, decorators & more</li>
            <li><strong>Use AI matching</strong> - Get personalized vendor recommendations</li>
            <li><strong>Create moodboards</strong> - Save and organize your favorite ideas</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://karloshaadi.com/search" style="background: linear-gradient(135deg, #D4A574, #c49463); color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">Start Exploring Vendors</a>
          </div>
          
          <h3 style="color: #D4A574;">✨ Special Features Just For You:</h3>
          <ul style="padding-left: 20px;">
            <li>🤖 <strong>AI Wedding Planner</strong> - Chat with our AI for planning tips</li>
            <li>📋 <strong>Wedding Checklist</strong> - Never miss a task</li>
            <li>💰 <strong>Budget Tracker</strong> - Stay on budget effortlessly</li>
            <li>💬 <strong>Instant Messaging</strong> - Chat directly with vendors</li>
          </ul>
          
          <p>Need help? Reply to this email or reach out on WhatsApp: <a href="https://wa.me/917011460321">+91 70114 60321</a></p>
          
          <p>Happy planning! 🎊</p>
          
          <p>With love,<br>
          <strong>Team Karlo Shaadi</strong></p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; text-align: center;">
            © 2024 Karlo Shaadi. Making Indian weddings magical.
          </p>
        </body>
        </html>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Karlo Shaadi <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      html: htmlContent,
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
