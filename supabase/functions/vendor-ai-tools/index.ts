import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { tool } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("AI service not configured");

    let prompt = "";

    if (tool === "quote") {
      const { vendorName, clientName, eventType, eventDate, guestCount, location, services, budget } = body;
      prompt = `You are a professional Indian wedding vendor named "${vendorName}". Generate a formal, professional quote/proposal for the following event:

Client: ${clientName}
Event: ${eventType}
Date: ${eventDate}
Guests: ${guestCount || "Not specified"}
Location: ${location || "Not specified"}
Budget: ${budget || "Not specified"}
Services needed: ${services || "General services"}

Create a professional quote that includes:
1. A warm greeting
2. Service package description
3. Pricing breakdown (use realistic Indian wedding pricing)
4. Terms & conditions (advance payment, cancellation policy)
5. Contact CTA

Keep it concise, professional, and formatted for easy copy-paste to WhatsApp or email. Use ₹ for pricing.`;
    } else if (tool === "caption") {
      const { description, platform, tone } = body;
      prompt = `Generate a ${tone} social media caption for ${platform} about the following Indian wedding work:

"${description}"

Requirements:
- Write for ${platform} (${platform === "instagram" ? "include line breaks and emojis" : platform === "whatsapp" ? "keep it short and engaging" : "medium length"})
- Tone: ${tone}
- Include 15-20 relevant hashtags for Indian wedding industry
- Use trending wedding hashtags like #IndianWedding #WeddingPhotography #ShaadiVibes etc.
- Make it engaging and shareable
- Keep the caption authentic and not overly promotional`;
    } else {
      return new Response(JSON.stringify({ error: "Unknown tool" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a helpful assistant for Indian wedding vendors. Be professional, culturally aware, and practical." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI service error");
    }

    const data = await aiResponse.json();
    const result = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("vendor-ai-tools error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
