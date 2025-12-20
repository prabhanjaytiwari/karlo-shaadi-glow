import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PlanInput {
  side: "bride" | "groom";
  yourName: string;
  partnerName: string;
  weddingDate: string;
  city: string;
  budget: number;
  guestCount: number;
  weddingStyle: "traditional" | "modern" | "destination" | "intimate" | "royal";
}

function generatePlanId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "KS-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: PlanInput = await req.json();
    console.log("Generating wedding plan for:", input);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch real vendors from the database for recommendations
    const { data: vendors } = await supabase
      .from("vendors")
      .select(`
        id,
        business_name,
        category,
        description,
        average_rating,
        total_reviews,
        verified,
        cities!vendors_city_id_fkey(name)
      `)
      .eq("is_active", true)
      .limit(50);

    // Filter vendors by city if available
    const cityVendors = vendors?.filter(
      (v: any) => v.cities?.name?.toLowerCase() === input.city.toLowerCase()
    ) || [];

    const systemPrompt = `You are an expert Indian wedding planner AI. Generate a comprehensive, realistic wedding plan based on the user's inputs. Be specific to Indian wedding traditions and customs.

The budget is in Indian Rupees (₹). Be realistic about costs in India.
Consider the wedding style and adjust recommendations accordingly.
Include specific vendor categories relevant to Indian weddings.

IMPORTANT: Return ONLY the JSON object, no markdown formatting or code blocks.`;

    const userPrompt = `Create a complete wedding plan with these details:
- Couple: ${input.yourName} & ${input.partnerName}
- Who's planning: ${input.side === "bride" ? "Bride" : "Groom"}
- Wedding Date: ${input.weddingDate}
- City: ${input.city}
- Budget: ₹${input.budget} Lakhs (${input.budget * 100000} INR)
- Guest Count: ${input.guestCount}
- Wedding Style: ${input.weddingStyle}

Available vendors in ${input.city}: ${JSON.stringify(cityVendors.slice(0, 10).map((v: any) => ({
  id: v.id,
  name: v.business_name,
  category: v.category,
  rating: v.average_rating,
  verified: v.verified
})))}

Generate a JSON response with this EXACT structure:
{
  "budgetBreakdown": [
    {"category": "Venue", "percentage": 25, "amount": 625000, "priority": "high"},
    {"category": "Catering", "percentage": 20, "amount": 500000, "priority": "high"},
    {"category": "Photography & Video", "percentage": 12, "amount": 300000, "priority": "high"},
    {"category": "Decoration & Flowers", "percentage": 10, "amount": 250000, "priority": "medium"},
    {"category": "Bridal Makeup & Mehendi", "percentage": 8, "amount": 200000, "priority": "medium"},
    {"category": "Music & Entertainment", "percentage": 7, "amount": 175000, "priority": "medium"},
    {"category": "Invitations & Stationery", "percentage": 3, "amount": 75000, "priority": "low"},
    {"category": "Transport", "percentage": 5, "amount": 125000, "priority": "medium"},
    {"category": "Pandit & Rituals", "percentage": 3, "amount": 75000, "priority": "high"},
    {"category": "Miscellaneous & Buffer", "percentage": 7, "amount": 175000, "priority": "low"}
  ],
  "timeline": [
    {"monthsBefore": 6, "title": "Book Major Vendors", "tasks": ["Book venue", "Book photographer", "Book caterer"]},
    {"monthsBefore": 4, "title": "Finalize Details", "tasks": ["Finalize decoration theme", "Book makeup artist", "Order invitations"]},
    {"monthsBefore": 2, "title": "Confirmations", "tasks": ["Confirm guest list", "Final venue walkthrough", "Book transport"]},
    {"monthsBefore": 1, "title": "Final Preparations", "tasks": ["Mehendi ceremony planning", "Final fittings", "Confirm all vendors"]},
    {"monthsBefore": 0, "title": "Wedding Week", "tasks": ["Haldi ceremony", "Sangeet night", "Main wedding ceremony"]}
  ],
  "vendorRecommendations": [
    {"category": "Photography", "vendorId": "uuid-if-available", "vendorName": "Name", "reason": "Why this vendor fits", "estimatedCost": 150000}
  ],
  "tips": [
    "Specific tip 1 for this wedding",
    "Specific tip 2 for budget optimization",
    "Specific tip 3 for the city/style"
  ],
  "ceremonies": ["Haldi", "Mehendi", "Sangeet", "Wedding", "Reception"]
}

Adjust all amounts to match the total budget of ₹${input.budget} Lakhs.
Be specific to ${input.city} and ${input.weddingStyle} style.`;

    console.log("Calling Lovable AI Gateway...");

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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI Response received, parsing...");

    // Parse the JSON from the response (handle markdown code blocks if present)
    let planData;
    try {
      // Remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      planData = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse wedding plan");
    }

    // Generate unique plan ID
    const planId = generatePlanId();

    // Construct the full plan output
    const planOutput = {
      planId,
      coupleNames: `${input.yourName} & ${input.partnerName}`,
      weddingDate: input.weddingDate,
      city: input.city,
      totalBudget: input.budget * 100000,
      guestCount: input.guestCount,
      weddingStyle: input.weddingStyle,
      ...planData,
      shareableMessage: `✨ Check out our wedding plan! ✨\n\n👫 ${input.yourName} & ${input.partnerName}\n📅 ${input.weddingDate}\n📍 ${input.city}\n💰 Budget: ₹${input.budget} Lakhs\n\n✅ Complete budget breakdown\n✅ 6-month planning timeline\n✅ AI-recommended vendors\n✅ Personalized tips\n\nMade with 💕 on Karlo Shaadi`,
    };

    // Save to database
    const { error: insertError } = await supabase
      .from("wedding_plans")
      .insert({
        plan_id: planId,
        input_data: input,
        plan_output: planOutput,
      });

    if (insertError) {
      console.error("Failed to save plan:", insertError);
      // Continue anyway - plan was generated successfully
    }

    console.log("Plan generated successfully:", planId);

    return new Response(JSON.stringify(planOutput), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating wedding plan:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to generate plan" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
