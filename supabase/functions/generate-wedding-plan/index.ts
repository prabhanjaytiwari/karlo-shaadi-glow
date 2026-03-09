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
  religion: string;
  ceremonies: string[];
  budget: number;
  guestCount: number;
  brideSideGuests: number;
  groomSideGuests: number;
  venueType: string;
  foodType: string;
  alcohol: string;
  weddingStyle: string;
  priorities: string[];
  specialRequirements: string[];
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
    console.log("Generating wedding plan for:", input.yourName, "&", input.partnerName);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: vendors } = await supabase
      .from("vendors")
      .select(`id, business_name, category, description, average_rating, total_reviews, verified, cities!vendors_city_id_fkey(name)`)
      .eq("is_active", true)
      .limit(50);

    const cityVendors = vendors?.filter(
      (v: any) => v.cities?.name?.toLowerCase() === input.city.toLowerCase()
    ) || [];

    const totalBudgetINR = input.budget * 100000;
    const ceremoniesList = input.ceremonies.join(", ");
    const prioritiesList = input.priorities?.join(", ") || "balanced";
    const specialReqsList = input.specialRequirements?.join(", ") || "none";

    const systemPrompt = `You are India's top wedding planner AI with 20+ years experience planning ${input.religion} weddings across India. Generate an extremely detailed, realistic, and practical wedding plan.

KEY RULES:
- All costs in Indian Rupees (₹). Be VERY realistic about ${input.city} market rates in 2025.
- The total of all budget items MUST equal ₹${totalBudgetINR}.
- Consider ${input.religion} traditions and customs specifically.
- Venue type is ${input.venueType}, food is ${input.foodType}, alcohol preference is ${input.alcohol}.
- Priorities: ${prioritiesList} — allocate more budget to these.
- Special requirements: ${specialReqsList}.
- Return ONLY valid JSON. No markdown, no code blocks.`;

    const userPrompt = `Create a COMPLETE wedding plan:

COUPLE: ${input.yourName} & ${input.partnerName}
PLANNING BY: ${input.side === "bride" ? "Bride" : "Groom"}'s side
DATE: ${input.weddingDate}
CITY: ${input.city}
RELIGION: ${input.religion}
CEREMONIES: ${ceremoniesList}
BUDGET: ₹${totalBudgetINR} (${input.budget} Lakhs)
GUESTS: ${input.guestCount} total (Bride side: ${input.brideSideGuests}, Groom side: ${input.groomSideGuests})
VENUE: ${input.venueType}
FOOD: ${input.foodType}
ALCOHOL: ${input.alcohol}
STYLE: ${input.weddingStyle}
PRIORITIES: ${prioritiesList}
SPECIAL: ${specialReqsList}

Available verified vendors in ${input.city}: ${JSON.stringify(cityVendors.slice(0, 10).map((v: any) => ({
  id: v.id, name: v.business_name, category: v.category, rating: v.average_rating, verified: v.verified
})))}

Generate this EXACT JSON structure:
{
  "budgetBreakdown": [
    {"category": "Venue & Banquet", "percentage": 25, "amount": 625000, "priority": "high", "details": "Includes venue booking for all ceremonies, furniture, AC, power backup"},
    {"category": "Catering & Food", "percentage": 20, "amount": 500000, "priority": "high", "details": "Per plate cost breakdown for each ceremony"}
  ],
  "ceremonyBudgets": [
    {"ceremony": "Mehendi", "budget": 150000, "items": ["Mehendi artist: ₹25K", "Decor: ₹50K", "Food: ₹60K", "Music: ₹15K"]}
  ],
  "dayWiseSchedule": [
    {"day": "Day 1 - Haldi", "date": "2 days before wedding", "events": [
      {"time": "10:00 AM", "event": "Haldi ceremony setup", "location": "Home/Venue", "notes": "Yellow theme decoration"},
      {"time": "12:00 PM", "event": "Haldi rituals begin", "location": "Main lawn", "notes": "Keep towels and old clothes ready"}
    ]},
    {"day": "Day 2 - Mehendi & Sangeet", "date": "1 day before wedding", "events": [
      {"time": "2:00 PM", "event": "Mehendi starts", "location": "Bride's venue", "notes": "Arrange seating for 50+"}
    ]}
  ],
  "vendorSuggestions": [
    {"category": "Photography", "vendorName": "Suggested Vendor Name", "vendorId": "uuid-or-null", "estimatedCost": 150000, "reason": "Why this fits the budget/style", "searchLink": "/search?category=Photography&city=${input.city}"},
    {"category": "Venue", "vendorName": "Suggested Venue", "vendorId": null, "estimatedCost": 500000, "reason": "Good for ${input.guestCount} guests", "searchLink": "/search?category=Venue&city=${input.city}"}
  ],
  "timeline": [
    {"monthsBefore": 6, "title": "Start Booking", "tasks": ["Book venue for all ceremonies", "Book photographer/videographer", "Finalize caterer"]},
    {"monthsBefore": 3, "title": "Confirmations", "tasks": ["Order wedding cards", "Book decorator", "Finalize mehendi artist"]},
    {"monthsBefore": 1, "title": "Final Prep", "tasks": ["Confirm all vendors", "Trial makeup", "Final outfit fittings"]},
    {"monthsBefore": 0, "title": "Wedding Week", "tasks": ["Vendor coordination", "Guest welcome kits", "Emergency kit ready"]}
  ],
  "tips": [
    "City-specific practical tip about ${input.city}",
    "Budget optimization tip",
    "Vendor negotiation tip for Indian weddings",
    "${input.religion}-specific cultural tip",
    "Guest management tip for ${input.guestCount} guests"
  ],
  "ceremonies": ["${input.ceremonies.join('", "')}"],
  "weddingManagerNote": "A brief note about why hiring a wedding manager would benefit this specific wedding, considering the scale of ${input.guestCount} guests across ${input.ceremonies.length} ceremonies in ${input.city}"
}

IMPORTANT: 
- Generate 8-12 budget categories covering ALL aspects
- Generate day-wise schedule for ALL selected ceremonies: ${ceremoniesList}
- Suggest 6-10 vendor categories with realistic ${input.city} pricing
- Make tips SPECIFIC to this exact wedding setup, not generic
- Ceremony budgets should cover EACH selected ceremony individually
- All amounts must add up to ₹${totalBudgetINR}`;

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
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content in AI response");

    console.log("AI Response received, parsing...");

    let planData;
    try {
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) cleanContent = cleanContent.slice(7);
      else if (cleanContent.startsWith("```")) cleanContent = cleanContent.slice(3);
      if (cleanContent.endsWith("```")) cleanContent = cleanContent.slice(0, -3);
      planData = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse wedding plan");
    }

    const planId = generatePlanId();

    const planOutput = {
      planId,
      coupleNames: `${input.yourName} & ${input.partnerName}`,
      weddingDate: input.weddingDate,
      city: input.city,
      religion: input.religion,
      totalBudget: totalBudgetINR,
      guestCount: input.guestCount,
      brideSideGuests: input.brideSideGuests,
      groomSideGuests: input.groomSideGuests,
      weddingStyle: input.weddingStyle,
      venueType: input.venueType,
      foodType: input.foodType,
      alcohol: input.alcohol,
      priorities: input.priorities,
      specialRequirements: input.specialRequirements,
      ...planData,
      shareableMessage: `✨ Check out our wedding plan! ✨\n\n👫 ${input.yourName} & ${input.partnerName}\n📅 ${input.weddingDate}\n📍 ${input.city}\n💰 Budget: ₹${input.budget} Lakhs\n👥 ${input.guestCount} Guests\n🎊 ${input.ceremonies.length} Ceremonies\n\n✅ Detailed budget breakdown\n✅ Day-wise event schedule\n✅ AI-recommended vendors\n✅ Personalized tips\n\nMade with 💕 on Karlo Shaadi`,
    };

    const { error: insertError } = await supabase
      .from("wedding_plans")
      .insert({ plan_id: planId, input_data: input, plan_output: planOutput });

    if (insertError) console.error("Failed to save plan:", insertError);

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
