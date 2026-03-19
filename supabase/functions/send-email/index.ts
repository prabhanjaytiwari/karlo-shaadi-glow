import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const senderEmail = Deno.env.get("SENDER_EMAIL") || "noreply@karloshaadi.com";

const LOGO_URL = "https://qeutvpwskilkbgynhrai.supabase.co/storage/v1/object/public/og-images/karlo-shaadi-logo.png";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  type?: string;
  useTemplate?: boolean;
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
        
        <div style="height: 4px; background: linear-gradient(90deg, #D946EF 0%, #D4A574 50%, #f43f5e 100%);"></div>
        
        <div style="background: linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 40%, #1a0a2e 100%); padding: 40px 30px 35px; text-align: center;">
          <img src="${LOGO_URL}" alt="Karlo Shaadi" style="height: 60px; width: auto; margin-bottom: 12px;" />
          <p style="margin: 0; color: #D4A574; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; font-family: 'DM Sans', sans-serif;">India's Most Trending Wedding Platform</p>
        </div>
        
        <div style="margin: 0; background: #ffffff; padding: 40px 35px;">
          ${content}
        </div>
        
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
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

      if (token !== serviceRoleKey && token !== anonKey) {
        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_ANON_KEY")!,
          { global: { headers: { Authorization: authHeader } } }
        );
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        if (error || !user) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }
      }
    }

    const { to, subject, html, type, useTemplate = true }: EmailRequest = await req.json();

    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: "Missing required fields: to, subject, html" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`Sending ${type || 'email'} to ${to}`);

    const finalHtml = useTemplate ? brandedWrapper(html) : html;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: senderEmail,
        to: [to],
        subject,
        html: finalHtml,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", emailData);
      throw new Error(emailData.message || "Failed to send email");
    }

    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify(emailData), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while sending the email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
