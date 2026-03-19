import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const senderEmail = Deno.env.get("SENDER_EMAIL") || "Karlo Shaadi <noreply@karloshaadi.com>";

const LOGO_URL = "https://qeutvpwskilkbgynhrai.supabase.co/storage/v1/object/public/og-images/karlo-shaadi-logo.png";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentReceiptRequest {
  email: string;
  name: string;
  amount: number;
  transaction_id: string;
  payment_type: string;
  description?: string;
  booking_id?: string;
  vendor_name?: string;
  wedding_date?: string;
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
    const data: PaymentReceiptRequest = await req.json();
    
    console.log(`Sending payment receipt to ${data.email} for ₹${data.amount}`);

    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(data.amount);

    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    let paymentDetails = '';
    if (data.payment_type === 'booking') {
      paymentDetails = `
        <tr>
          <td style="padding: 10px 0; color: #888; font-size: 13px; border-bottom: 1px solid #f0e8df;">Vendor</td>
          <td style="padding: 10px 0; font-weight: 600; font-size: 14px; color: #1a0a2e; text-align: right; border-bottom: 1px solid #f0e8df;">${data.vendor_name || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #888; font-size: 13px; border-bottom: 1px solid #f0e8df;">Wedding Date</td>
          <td style="padding: 10px 0; font-weight: 600; font-size: 14px; color: #1a0a2e; text-align: right; border-bottom: 1px solid #f0e8df;">${data.wedding_date || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #888; font-size: 13px; border-bottom: 1px solid #f0e8df;">Booking ID</td>
          <td style="padding: 10px 0; font-weight: 600; font-size: 13px; color: #1a0a2e; text-align: right; font-family: monospace; border-bottom: 1px solid #f0e8df;">${data.booking_id || 'N/A'}</td>
        </tr>
      `;
    } else if (data.payment_type === 'subscription') {
      paymentDetails = `
        <tr>
          <td style="padding: 10px 0; color: #888; font-size: 13px; border-bottom: 1px solid #f0e8df;">Plan</td>
          <td style="padding: 10px 0; font-weight: 600; font-size: 14px; color: #1a0a2e; text-align: right; border-bottom: 1px solid #f0e8df;">${data.description || 'Premium'}</td>
        </tr>
      `;
    }

    const bodyContent = `
      <div style="text-align: center; margin-bottom: 28px;">
        <div style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); width: 56px; height: 56px; border-radius: 50%; line-height: 56px; margin-bottom: 12px;">
          <span style="color: white; font-size: 28px;">✓</span>
        </div>
        <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a0a2e; font-weight: 700;">Payment Successful!</h1>
      </div>
      
      <p style="color: #444; font-size: 15px; line-height: 1.7;">
        Hi ${data.name}, thank you for your payment. Here's your receipt for your records.
      </p>
      
      <!-- Receipt card -->
      <div style="background: linear-gradient(135deg, #faf7f4 0%, #f5ede4 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid rgba(212, 165, 116, 0.3);">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="background: #D4A574; color: white; padding: 5px 16px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">Payment Receipt</span>
        </div>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #888; font-size: 13px; border-bottom: 1px solid #f0e8df;">Date</td>
            <td style="padding: 10px 0; font-weight: 600; font-size: 14px; color: #1a0a2e; text-align: right; border-bottom: 1px solid #f0e8df;">${currentDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #888; font-size: 13px; border-bottom: 1px solid #f0e8df;">Transaction ID</td>
            <td style="padding: 10px 0; font-weight: 600; font-size: 13px; color: #1a0a2e; text-align: right; font-family: monospace; border-bottom: 1px solid #f0e8df;">${data.transaction_id}</td>
          </tr>
          ${paymentDetails}
          <tr>
            <td style="padding: 16px 0 8px; color: #1a0a2e; font-size: 16px; font-weight: 600;">Amount Paid</td>
            <td style="padding: 16px 0 8px; font-weight: 700; font-size: 24px; color: #D946EF; text-align: right; font-family: 'Playfair Display', Georgia, serif;">${formattedAmount}</td>
          </tr>
        </table>
      </div>
      
      <p style="color: #888; font-size: 13px; line-height: 1.6;">
        This is an official receipt from Karlo Shaadi. Please save this email for your records.
      </p>
      
      <div style="text-align: center; margin: 32px 0 8px;">
        <a href="https://karloshaadi.com/dashboard" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; letter-spacing: 0.3px;">Go to Dashboard →</a>
      </div>
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
        subject: `Payment Receipt - ${formattedAmount} | Karlo Shaadi`,
        html: brandedWrapper(bodyContent),
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", emailData);
      throw new Error(emailData.message || "Failed to send email");
    }

    console.log("Payment receipt sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true, data: emailData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending payment receipt:", error);
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
