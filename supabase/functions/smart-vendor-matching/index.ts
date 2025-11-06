import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MatchingRequest {
  userId: string;
  category?: string;
  budget?: { min: number; max: number };
  city?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { userId, category, budget, city }: MatchingRequest = await req.json();
    console.log("Smart matching request:", { userId, category, budget, city });

    // Gather user data for personalization
    const [favoritesData, bookingsData, profileData] = await Promise.all([
      supabaseClient
        .from("favorites")
        .select("vendor:vendors!inner(id, category, average_rating, subscription_tier)")
        .eq("user_id", userId),
      supabaseClient
        .from("bookings")
        .select("vendor:vendors!inner(id, category)")
        .eq("couple_id", userId),
      supabaseClient
        .from("profiles")
        .select("budget_range, venue_city")
        .eq("id", userId)
        .single()
    ]);

    // Extract preferences - handle nested vendor data
    const favoriteCategories = (favoritesData.data || [])
      .map((f: any) => f?.vendor?.category)
      .filter(Boolean);
    const bookedCategories = (bookingsData.data || [])
      .map((b: any) => b?.vendor?.category)
      .filter(Boolean);
    const preferredCity = city || profileData.data?.venue_city;
    const userBudget = budget || { min: 0, max: 1000000 };

    // Build vendor query with filters
    let vendorQuery = supabaseClient
      .from("vendors")
      .select(`
        *,
        cities(name, state),
        vendor_services(base_price, price_range_min, price_range_max)
      `)
      .eq("is_active", true)
      .eq("verified", true);

    if (category) {
      vendorQuery = vendorQuery.eq("category", category);
    }

    if (preferredCity) {
      vendorQuery = vendorQuery.eq("city_id", preferredCity);
    }

    const { data: vendors, error } = await vendorQuery;

    if (error) throw error;

    // Use Lovable AI to rank vendors based on user preferences
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.log("LOVABLE_API_KEY not configured, using basic ranking");
      return new Response(
        JSON.stringify({
          vendors: vendors?.slice(0, 10) || [],
          method: "basic"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Prepare context for AI
    const context = {
      favoriteCategories,
      bookedCategories,
      budget: userBudget,
      preferredCity,
      vendors: vendors?.map(v => ({
        id: v.id,
        name: v.business_name,
        category: v.category,
        rating: v.average_rating,
        reviews: v.total_reviews,
        tier: v.subscription_tier,
        experience: v.years_experience,
        services: v.vendor_services
      }))
    };

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a wedding vendor matching expert. Analyze user preferences and vendor data to recommend the best matches.
Consider: budget compatibility, past preferences, ratings, experience, and subscription tier (sponsored > featured > free).
Return only vendor IDs in order of recommendation as a JSON array.`
          },
          {
            role: "user",
            content: `User context: ${JSON.stringify(context)}
Recommend the top 10 vendors. Return format: {"vendor_ids": ["id1", "id2", ...]}`
          }
        ],
        tools: [{
          type: "function",
          function: {
            name: "recommend_vendors",
            parameters: {
              type: "object",
              properties: {
                vendor_ids: {
                  type: "array",
                  items: { type: "string" }
                }
              },
              required: ["vendor_ids"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "recommend_vendors" } }
      }),
    });

    if (aiResponse.status === 429) {
      console.log("Rate limit exceeded, using basic ranking");
      return new Response(
        JSON.stringify({
          vendors: vendors?.slice(0, 10) || [],
          method: "basic",
          reason: "rate_limit"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const recommendedIds = toolCall ? JSON.parse(toolCall.function.arguments).vendor_ids : [];

    // Sort vendors by AI recommendations
    const rankedVendors = recommendedIds
      .map((id: string) => vendors?.find(v => v.id === id))
      .filter(Boolean);

    console.log(`AI recommended ${rankedVendors.length} vendors`);

    return new Response(
      JSON.stringify({
        vendors: rankedVendors,
        method: "ai_powered"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Smart matching error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
