import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { relationship, brideName, groomName, anecdotes, tone, language, length } = await req.json();

    if (!relationship || !brideName || !groomName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const lengthGuide: Record<string, string> = {
      short: "about 150-200 words (1 minute speech)",
      medium: "about 400-500 words (3 minute speech)",
      long: "about 700-900 words (5 minute speech)",
    };

    const toneGuide: Record<string, string> = {
      funny: "humorous, witty, and sarcastic with roast-style jokes but ultimately heartfelt",
      emotional: "deeply emotional, heartfelt, and tear-jerking with poetic expressions",
      balanced: "a perfect mix of humor and emotion, light-hearted but touching",
    };

    const languageGuide: Record<string, string> = {
      english: "Write entirely in English.",
      hindi: "Write entirely in Hindi (use Devanagari script).",
      hinglish: "Write in Hinglish - mix of Hindi and English as spoken casually in urban India. Use Roman script for Hindi words.",
    };

    const anecdoteText = (anecdotes || []).filter((a: string) => a?.trim()).map((a: string, i: number) => `Memory ${i + 1}: ${a}`).join("\n");

    const systemPrompt = `You are an expert Indian wedding speech writer. You craft personalized, culturally authentic wedding speeches that resonate with Indian families and friends. You understand Indian wedding traditions, family dynamics, and cultural humor.

Rules:
- NEVER use generic filler. Every line should feel personal.
- Include culturally relevant references (shaadi ka ladoo, baraat, etc.) when appropriate.
- Structure: Opening hook → Personal stories → Couple appreciation → Blessing/Toast
- ${languageGuide[language] || languageGuide.english}
- Make it ${lengthGuide[length] || lengthGuide.medium}.
- Tone: ${toneGuide[tone] || toneGuide.balanced}.
- End with "— Speech crafted on KarloShaadi.com" as a subtle watermark line.`;

    const userPrompt = `Write a wedding speech for the wedding of ${brideName} and ${groomName}.

Speaker: ${relationship}
${anecdoteText ? `\nPersonal memories/anecdotes shared by the speaker:\n${anecdoteText}` : ""}

Create a beautiful, personalized speech that weaves in the shared memories naturally.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again in a minute." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "Failed to generate speech" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const speech = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ speech }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Speech generation error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
