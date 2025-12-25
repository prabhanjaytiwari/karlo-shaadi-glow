import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const senderEmail = Deno.env.get("SENDER_EMAIL") || "Karlo Shaadi <onboarding@resend.dev>";

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
          <td style="padding: 8px 0; color: #666;">Vendor:</td>
          <td style="padding: 8px 0; font-weight: 600;">${data.vendor_name || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Wedding Date:</td>
          <td style="padding: 8px 0; font-weight: 600;">${data.wedding_date || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Booking ID:</td>
          <td style="padding: 8px 0; font-weight: 600;">${data.booking_id || 'N/A'}</td>
        </tr>
      `;
    } else if (data.payment_type === 'subscription') {
      paymentDetails = `
        <tr>
          <td style="padding: 8px 0; color: #666;">Plan:</td>
          <td style="padding: 8px 0; font-weight: 600;">${data.description || 'Premium'}</td>
        </tr>
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
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%); border-radius: 16px 16px 0 0; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Payment Successful! ✓</h1>
          </div>
          
          <!-- Content -->
          <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Hi ${data.name},
            </p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 30px;">
              Thank you for your payment! Here's your receipt for your records.
            </p>
            
            <!-- Receipt Box -->
            <div style="background: #fef7f0; border: 2px solid #f97316; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="background: #f97316; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                  PAYMENT RECEIPT
                </span>
              </div>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Date:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${currentDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Transaction ID:</td>
                  <td style="padding: 8px 0; font-weight: 600; font-family: monospace;">${data.transaction_id}</td>
                </tr>
                ${paymentDetails}
                <tr style="border-top: 2px solid #f97316; margin-top: 10px;">
                  <td style="padding: 16px 0 8px; color: #666; font-size: 18px;">Amount Paid:</td>
                  <td style="padding: 16px 0 8px; font-weight: 700; font-size: 24px; color: #f43f5e;">${formattedAmount}</td>
                </tr>
              </table>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
              This is an official receipt from Karlo Shaadi. Please save this for your records.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://karloshaadi.com/dashboard" 
                 style="display: inline-block; background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                Go to Dashboard
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>Questions? Contact us at support@karloshaadi.com</p>
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
        subject: `Payment Receipt - ${formattedAmount} | Karlo Shaadi`,
        html: htmlContent,
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
