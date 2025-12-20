import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const planId = url.searchParams.get("planId");

    if (!planId) {
      return new Response(JSON.stringify({ error: "planId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if OG image already exists in storage
    const storagePath = `og-images/${planId}.png`;
    const { data: existingImage } = await supabase.storage
      .from("og-images")
      .createSignedUrl(storagePath, 3600);

    if (existingImage?.signedUrl) {
      // Redirect to cached image
      return Response.redirect(existingImage.signedUrl, 302);
    }

    // Fetch plan data
    const { data: plan, error: planError } = await supabase
      .from("wedding_plans")
      .select("*")
      .eq("plan_id", planId)
      .single();

    if (planError || !plan) {
      console.error("Plan not found:", planError);
      return new Response(JSON.stringify({ error: "Plan not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const inputData = plan.input_data as {
      yourName?: string;
      partnerName?: string;
      city?: string;
      weddingDate?: string;
      budget?: number;
      guestCount?: number;
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Format budget in lakhs
    const budgetInLakhs = inputData.budget ? Math.round(inputData.budget / 100000) : 0;
    
    // Format date
    const dateStr = inputData.weddingDate 
      ? new Date(inputData.weddingDate).toLocaleDateString("en-IN", { 
          day: "numeric", 
          month: "long", 
          year: "numeric" 
        })
      : "";

    // Generate OG image using Lovable AI
    const imagePrompt = `Create a beautiful, elegant wedding announcement card image. 
    Design specifications:
    - Dimensions: 1200x630 pixels (OG image standard)
    - Background: Soft rose gold or blush pink gradient with subtle floral patterns
    - Style: Elegant Indian wedding theme with modern touches
    - Include decorative elements: mandap silhouette, marigold garlands, diyas
    
    Text to include (centered, elegant typography):
    - "✨ Wedding Plan ✨" at the top in gold
    - "${inputData.yourName || "Bride"} & ${inputData.partnerName || "Groom"}" in large elegant script
    - "📅 ${dateStr}" in medium text
    - "📍 ${inputData.city || "India"}" below the date
    - "💰 ₹${budgetInLakhs} Lakhs | 👥 ${inputData.guestCount || 300} Guests" at bottom
    - Small "Karlo Shaadi" branding in corner
    
    Make it visually stunning, shareable, and professional.`;

    console.log("Generating OG image for plan:", planId);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: imagePrompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Image generation failed:", response.status, errorText);
      
      // Return a fallback - simple colored placeholder
      return new Response(JSON.stringify({ 
        error: "Image generation failed",
        fallback: true 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "No image generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract base64 data
    const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("og-images")
      .upload(storagePath, imageBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Failed to upload image:", uploadError);
      // Still return the generated image even if caching fails
    }

    // Return the image directly
    return new Response(imageBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error in generate-og-image:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
