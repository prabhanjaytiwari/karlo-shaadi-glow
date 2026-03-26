import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
    if (!TELEGRAM_API_KEY) throw new Error("TELEGRAM_API_KEY not configured");

    const { event_type, data } = await req.json();

    // Admin chat ID - you'll need to set this after sending /start to the bot
    const ADMIN_CHAT_ID = Deno.env.get("TELEGRAM_ADMIN_CHAT_ID");
    if (!ADMIN_CHAT_ID) throw new Error("TELEGRAM_ADMIN_CHAT_ID not configured");

    let message = "";

    switch (event_type) {
      case "vendor_registered":
        message = `🎉 *New Vendor Registration*\n\n` +
          `👤 *Name:* ${data.business_name || "N/A"}\n` +
          `📍 *City:* ${data.city || "N/A"}\n` +
          `📂 *Category:* ${data.category || "N/A"}\n` +
          `📧 *Email:* ${data.email || "N/A"}\n` +
          `📱 *Phone:* ${data.phone || "N/A"}\n` +
          `💰 *Plan:* ${data.plan || "Free"}\n` +
          `⏰ *Time:* ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;
        break;

      case "vendor_payment":
        message = `💳 *Vendor Payment Received*\n\n` +
          `👤 *Vendor:* ${data.business_name || "N/A"}\n` +
          `💰 *Amount:* ₹${data.amount || 0}\n` +
          `📋 *Plan:* ${data.plan || "N/A"}\n` +
          `🔗 *Payment ID:* \`${data.payment_id || "N/A"}\`\n` +
          `⏰ *Time:* ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;
        break;

      case "couple_registered":
        message = `💍 *New Couple Registration*\n\n` +
          `👤 *Name:* ${data.full_name || "N/A"}\n` +
          `📍 *City:* ${data.city || "N/A"}\n` +
          `📧 *Email:* ${data.email || "N/A"}\n` +
          `⏰ *Time:* ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;
        break;

      case "inquiry_created":
        message = `📩 *New Vendor Inquiry*\n\n` +
          `👤 *From:* ${data.name || "N/A"}\n` +
          `🏢 *To Vendor:* ${data.vendor_name || "N/A"}\n` +
          `📅 *Wedding Date:* ${data.wedding_date || "N/A"}\n` +
          `💰 *Budget:* ${data.budget_range || "N/A"}\n` +
          `⏰ *Time:* ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;
        break;

      case "booking_created":
        message = `📋 *New Booking*\n\n` +
          `🏢 *Vendor:* ${data.vendor_name || "N/A"}\n` +
          `💰 *Amount:* ₹${data.total_amount || 0}\n` +
          `📅 *Wedding Date:* ${data.wedding_date || "N/A"}\n` +
          `⏰ *Time:* ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;
        break;

      case "daily_summary":
        message = `📊 *Daily Summary — ${new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}*\n\n` +
          `👥 *New Vendors:* ${data.new_vendors || 0}\n` +
          `💍 *New Couples:* ${data.new_couples || 0}\n` +
          `📩 *Inquiries:* ${data.inquiries || 0}\n` +
          `📋 *Bookings:* ${data.bookings || 0}\n` +
          `💳 *Revenue:* ₹${data.revenue || 0}\n` +
          `🔥 *Total Vendors:* ${data.total_vendors || 0}\n` +
          `💑 *Total Couples:* ${data.total_couples || 0}`;
        break;

      default:
        message = `🔔 *Alert*\n\n${JSON.stringify(data, null, 2)}`;
    }

    const response = await fetch(`${GATEWAY_URL}/sendMessage`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TELEGRAM_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(`Telegram API failed [${response.status}]: ${JSON.stringify(result)}`);
    }

    return new Response(
      JSON.stringify({ success: true, message_id: result.result?.message_id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Telegram alert error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
