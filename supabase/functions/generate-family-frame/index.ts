import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { weddingImageUrl, lovedOneImageUrl, placement } = await req.json();

    if (!weddingImageUrl || !lovedOneImageUrl) {
      return new Response(
        JSON.stringify({ error: "Both images are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Fetch both images in parallel
    const [weddingRes, lovedRes] = await Promise.all([
      fetch(weddingImageUrl),
      fetch(lovedOneImageUrl),
    ]);

    if (!weddingRes.ok || !lovedRes.ok) {
      throw new Error("Failed to fetch one or both images");
    }

    const [weddingBuf, lovedBuf] = await Promise.all([
      weddingRes.arrayBuffer(),
      lovedRes.arrayBuffer(),
    ]);

    const weddingBase64 = arrayBufferToBase64(weddingBuf);
    const lovedBase64 = arrayBufferToBase64(lovedBuf);

    // Detect content types
    const weddingType =
      weddingRes.headers.get("content-type") || "image/jpeg";
    const lovedType = lovedRes.headers.get("content-type") || "image/jpeg";

    // Build placement instruction
    const placementMap: Record<string, string> = {
      "next-to-bride":
        "next to the bride, on her side of the group, standing naturally beside her",
      "next-to-groom":
        "next to the groom, on his side of the group, standing naturally beside him",
      anywhere:
        "in a natural open space within the group photo where they fit best",
      auto: "in the most natural and aesthetically balanced position within the group, using AI judgment for the best placement",
    };

    const placementInstruction =
      placementMap[placement] || placementMap["auto"];

    const prompt = `You are an expert professional photo editor specializing in family portrait compositing for Indian weddings.

You have two images:
1. FIRST IMAGE: A wedding family/group photograph
2. SECOND IMAGE: A portrait of a beloved family member who could not attend the wedding

YOUR TASK: Seamlessly composite the person from the SECOND image into the FIRST wedding photograph.

PLACEMENT: Place the person ${placementInstruction}.

CRITICAL REQUIREMENTS:
- Perfectly match the lighting, color temperature, exposure, and white balance of the wedding photo
- Scale the person proportionally to match other people in the frame
- Add realistic shadows consistent with the scene's light direction
- Blend edges seamlessly — no visible cutout artifacts
- The person should appear naturally present, wearing appropriate attire
- Preserve EVERY existing person in the wedding photo exactly as they are
- Maintain the original photo's resolution and quality
- Match the depth of field and focus characteristics
- Ensure natural skin tone consistency across the composite

Output a single, high-quality composite wedding family photograph.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-pro-image-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${weddingType};base64,${weddingBase64}`,
                  },
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${lovedType};base64,${lovedBase64}`,
                  },
                },
              ],
            },
          ],
          modalities: ["image", "text"],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error:
              "Our AI is processing too many photos right now. Please try again in a minute.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const resultImageDataUrl =
      data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!resultImageDataUrl) {
      console.error("No image in AI response:", JSON.stringify(data).substring(0, 500));
      throw new Error("AI did not return an image. Please try again.");
    }

    // Extract base64 and upload to storage
    const base64Match = resultImageDataUrl.match(
      /^data:image\/(\w+);base64,(.+)$/
    );
    if (!base64Match) {
      throw new Error("Invalid image data format from AI");
    }

    const imgFormat = base64Match[1]; // png, jpeg, etc
    const imgBase64 = base64Match[2];

    // Decode base64 to Uint8Array
    const binaryStr = atob(imgBase64);
    const imgBytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      imgBytes[i] = binaryStr.charCodeAt(i);
    }

    // Upload to Supabase storage
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const fileName = `results/${crypto.randomUUID()}.${imgFormat}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("family-frame")
      .upload(fileName, imgBytes, {
        contentType: `image/${imgFormat}`,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("Failed to save generated image");
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("family-frame").getPublicUrl(fileName);

    return new Response(JSON.stringify({ imageUrl: publicUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-family-frame error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Failed to generate image",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
