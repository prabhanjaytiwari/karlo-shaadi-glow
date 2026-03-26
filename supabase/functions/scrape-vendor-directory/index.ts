import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    if (!FIRECRAWL_API_KEY) throw new Error("FIRECRAWL_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { city, category, source } = await req.json();

    if (!city || !category) {
      return new Response(
        JSON.stringify({ error: "city and category are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const searchQuery = `${category} for wedding in ${city}`;
    console.log("Searching:", searchQuery, "Source:", source || "web");

    // Use Firecrawl search to find vendors
    const searchResponse = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: 20,
        lang: "en",
        country: "IN",
        scrapeOptions: {
          formats: ["markdown"],
          onlyMainContent: true,
        },
      }),
    });

    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      console.error("Firecrawl search error:", searchData);
      throw new Error(searchData.error || `Search failed with status ${searchResponse.status}`);
    }

    const results = searchData.data || [];
    console.log(`Found ${results.length} results`);

    // Store scraped leads
    const leads = results.map((result: any) => ({
      source_url: result.url || "",
      source_platform: source || "web_search",
      business_name: result.title || "Unknown",
      city: city,
      category: category,
      raw_data: {
        title: result.title,
        description: result.description,
        markdown_snippet: result.markdown?.substring(0, 500),
        url: result.url,
      },
      status: "new",
      scraped_at: new Date().toISOString(),
    }));

    if (leads.length > 0) {
      const { error: insertError } = await supabase
        .from("scraped_vendor_leads")
        .upsert(leads, { onConflict: "source_url" });

      if (insertError) {
        console.error("Insert error:", insertError);
        // Table might not exist yet, log but don't fail
      }
    }

    // Log the scrape event
    await supabase.from("analytics_events").insert({
      event_type: "vendor_directory_scrape",
      metadata: {
        city,
        category,
        source: source || "web_search",
        results_count: results.length,
        triggered_at: new Date().toISOString(),
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        leads_found: results.length,
        city,
        category,
        results: results.map((r: any) => ({
          title: r.title,
          url: r.url,
          description: r.description,
        })),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Scrape error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
