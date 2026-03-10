import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { partner1, partner2, surname, style } = await req.json();
    
    if (!partner1 || !partner2) {
      return new Response(JSON.stringify({ error: "Both partner names are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const styleGuide = style === "funny" 
      ? "Make them witty, punny, and humorous — Indian wedding humor style."
      : style === "traditional"
      ? "Make them elegant, traditional, and culturally rich — think royal Indian wedding vibes."
      : style === "trendy"
      ? "Make them trendy, Instagram-worthy, and modern — think Gen-Z Indian wedding aesthetic."
      : "Mix of witty, elegant, and trendy styles.";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a creative Indian wedding hashtag generator. Generate unique, catchy wedding hashtags that work great on Instagram and social media. Focus on wordplay with the couple's names. ${styleGuide}

Rules:
- Generate exactly 12 hashtags
- Mix the couple's names creatively (portmanteau, rhymes, puns)
- Include the surname if provided
- Make them memorable and easy to type
- Some should be Hindi-English mashups (Hinglish)
- Include at least 2-3 that play on Bollywood references or Indian wedding traditions
- Each hashtag should start with #
- Return ONLY a JSON array of objects with "hashtag" and "category" (one of: "Name Mashup", "Bollywood", "Hinglish", "Classic", "Trendy", "Funny")
- No markdown, no explanation, just the JSON array`
          },
          {
            role: "user",
            content: `Partner 1: ${partner1}\nPartner 2: ${partner2}${surname ? `\nSurname: ${surname}` : ""}\nStyle: ${style || "mixed"}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_hashtags",
              description: "Generate wedding hashtags for the couple",
              parameters: {
                type: "object",
                properties: {
                  hashtags: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        hashtag: { type: "string" },
                        category: { type: "string", enum: ["Name Mashup", "Bollywood", "Hinglish", "Classic", "Trendy", "Funny"] }
                      },
                      required: ["hashtag", "category"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["hashtags"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_hashtags" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ hashtags: parsed.hashtags }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: try parsing content directly
    const content = data.choices?.[0]?.message?.content || "[]";
    const hashtags = JSON.parse(content);
    return new Response(JSON.stringify({ hashtags }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("hashtag generator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Failed to generate hashtags" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
