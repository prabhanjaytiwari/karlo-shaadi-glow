import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BANNER_PROMPTS = [
  {
    key: "couple-quiz",
    prompt:
      "A premium minimal illustration banner (400x200px landscape) for a 'Couple Quiz' wedding feature. Show a stylized Indian couple silhouette with hearts floating around them, warm rose and gold tones, soft gradient background, flat modern design style. No text.",
  },
  {
    key: "budget-roast",
    prompt:
      "A premium minimal illustration banner (400x200px landscape) for a 'Budget Roast' wedding feature. Show a humorous scene of wedding budget papers with playful flames, Indian wedding gold and red color theme, flat illustration style. No text.",
  },
  {
    key: "speech-writer",
    prompt:
      "A premium minimal illustration banner (400x200px landscape) for a 'Speech Writer' wedding feature. Show an elegant vintage microphone with wedding flowers (marigolds, roses), warm amber and rose tones, minimal design. No text.",
  },
  {
    key: "music-generator",
    prompt:
      "A premium minimal illustration banner (400x200px landscape) for a 'Music Generator' wedding feature. Show musical notes flowing with Indian wedding instruments like tabla and shehnai, rose gold palette, minimal flat illustration. No text.",
  },
  {
    key: "vendor-score",
    prompt:
      "A premium minimal illustration banner (400x200px landscape) for a 'Vendor Score Checker' wedding feature. Show a golden checkmark badge surrounded by wedding motifs like flowers and mandala patterns, gold and amber tones, premium feel. No text.",
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check which banners already exist
    const { data: existingFiles } = await supabase.storage
      .from("home-banners")
      .list();

    const existingKeys = new Set(
      (existingFiles || []).map((f) => f.name.replace(".png", ""))
    );

    const results: Record<string, string> = {};
    const toGenerate = BANNER_PROMPTS.filter(
      (p) => !existingKeys.has(p.key)
    );

    // Return existing URLs for already-generated banners
    for (const p of BANNER_PROMPTS) {
      if (existingKeys.has(p.key)) {
        const { data } = supabase.storage
          .from("home-banners")
          .getPublicUrl(`${p.key}.png`);
        results[p.key] = data.publicUrl;
      }
    }

    // Generate missing banners
    for (const banner of toGenerate) {
      console.log(`Generating banner: ${banner.key}`);

      const aiResponse = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-pro-image-preview",
            messages: [{ role: "user", content: banner.prompt }],
            modalities: ["image", "text"],
          }),
        }
      );

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error(
          `AI generation failed for ${banner.key}: ${aiResponse.status} ${errorText}`
        );
        continue;
      }

      const aiData = await aiResponse.json();
      const imageUrl =
        aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!imageUrl) {
        console.error(`No image returned for ${banner.key}`);
        continue;
      }

      // Extract base64 data
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
      const binaryData = Uint8Array.from(atob(base64Data), (c) =>
        c.charCodeAt(0)
      );

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("home-banners")
        .upload(`${banner.key}.png`, binaryData, {
          contentType: "image/png",
          upsert: true,
        });

      if (uploadError) {
        console.error(`Upload failed for ${banner.key}:`, uploadError);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from("home-banners")
        .getPublicUrl(`${banner.key}.png`);

      results[banner.key] = publicUrlData.publicUrl;
      console.log(`Successfully generated and uploaded: ${banner.key}`);
    }

    return new Response(JSON.stringify({ success: true, banners: results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-home-banners error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
