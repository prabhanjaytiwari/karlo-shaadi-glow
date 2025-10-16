import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SMSRequest {
  to: string;
  message: string;
  type?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, message, type }: SMSRequest = await req.json();

    console.log(`Sending ${type || 'SMS'} to ${to}`);

    // Validate phone number format (basic validation)
    if (!to || !to.match(/^\+?[1-9]\d{1,14}$/)) {
      throw new Error("Invalid phone number format");
    }

    // Create the request body for Twilio
    const formData = new URLSearchParams({
      To: to,
      From: twilioPhoneNumber!,
      Body: message,
    });

    // Send SMS via Twilio API
    const smsResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
        },
        body: formData.toString(),
      }
    );

    const smsData = await smsResponse.json();

    if (!smsResponse.ok) {
      console.error("Twilio API error:", smsData);
      throw new Error(smsData.message || "Failed to send SMS");
    }

    console.log("SMS sent successfully:", smsData.sid);

    return new Response(JSON.stringify(smsData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending SMS:", error);
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
