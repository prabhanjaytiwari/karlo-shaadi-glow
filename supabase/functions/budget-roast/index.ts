import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { city, guests, budget } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const budgetPerGuest = Math.round((budget * 100000) / guests);

    const systemPrompt = `You are a brutally honest, hilarious Indian wedding budget comedian. You roast people's unrealistic wedding budgets with sharp wit, cultural references, and Bollywood humor. You speak in a mix of English and occasional Hindi phrases.

Rules:
- Start with a savage one-liner about their budget
- Give 3-4 specific roasts about what their budget can ACTUALLY get them (photography, venue, food, decoration)
- Use Indian wedding references (pandit ji, baraat, mehendi, sangeet, etc.)
- Reference Bollywood, Indian aunties, and desi culture
- Be funny but not mean-spirited — end with genuine encouragement
- After the roast, add a line break and "But seriously..." followed by 2-3 actual helpful tips
- Keep it under 300 words
- Don't use emojis in the roast text itself`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Roast this wedding budget:
City: ${city}
Guests: ${guests}
Total Budget: ₹${budget} Lakhs (₹${budget * 100000})
Per guest budget: ₹${budgetPerGuest}

Give them the truth.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Our roast machine is too popular right now. Try again in a minute!" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const roast = data.choices?.[0]?.message?.content || "Even AI can't roast a budget this confusing.";

    return new Response(JSON.stringify({ roast }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("budget-roast error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
