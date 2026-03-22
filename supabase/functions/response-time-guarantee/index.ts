import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find inquiries older than 2 hours that are still pending
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

    const { data: overdueInquiries, error: fetchError } = await supabase
      .from("vendor_inquiries")
      .select("id, vendor_id, user_id, name, email, phone, message, budget_range, wedding_date, guest_count")
      .eq("status", "pending")
      .lt("created_at", twoHoursAgo)
      .is("last_contacted_at", null);

    if (fetchError) throw fetchError;

    console.log(`Found ${overdueInquiries?.length || 0} overdue inquiries`);

    const results = [];

    for (const inquiry of overdueInquiries || []) {
      // Get the original vendor's category and city
      const { data: originalVendor } = await supabase
        .from("vendors")
        .select("category, city_id, business_name")
        .eq("id", inquiry.vendor_id)
        .single();

      if (!originalVendor) continue;

      // Find 3 alternative vendors in same category and city
      const { data: alternatives } = await supabase
        .from("vendors")
        .select("id, business_name, average_rating, whatsapp_number, cities(name)")
        .eq("category", originalVendor.category)
        .eq("city_id", originalVendor.city_id)
        .eq("is_active", true)
        .neq("id", inquiry.vendor_id)
        .order("average_rating", { ascending: false })
        .limit(3);

      // Create notification for the couple if they have an account
      if (inquiry.user_id) {
        const alternativeNames = (alternatives || [])
          .map(a => a.business_name)
          .join(", ");

        await supabase.from("notifications").insert({
          user_id: inquiry.user_id,
          title: "⏰ Response Guarantee Activated",
          message: `${originalVendor.business_name} hasn't responded in 2 hours. Here are alternatives: ${alternativeNames || 'Check other vendors in this category'}. You've earned ₹200 credit!`,
          type: "guarantee",
          link: `/category/${originalVendor.category}`,
        });

        // Add ₹200 credit to the couple's profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("referral_credits")
          .eq("id", inquiry.user_id)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({ 
              referral_credits: (profile.referral_credits || 0) + 200 
            })
            .eq("id", inquiry.user_id);
        }
      }

      // Mark inquiry as guarantee-triggered so we don't process it again
      await supabase
        .from("vendor_inquiries")
        .update({ 
          notes_internal: `[AUTO] Response guarantee triggered at ${new Date().toISOString()}. Alternatives suggested.`,
          last_contacted_at: new Date().toISOString(),
        })
        .eq("id", inquiry.id);

      // Notify the vendor they missed the response window
      const { data: vendorUser } = await supabase
        .from("vendors")
        .select("user_id")
        .eq("id", inquiry.vendor_id)
        .single();

      if (vendorUser?.user_id) {
        await supabase.from("notifications").insert({
          user_id: vendorUser.user_id,
          title: "⚠️ Missed Response Window",
          message: `You didn't respond to ${inquiry.name}'s inquiry within 2 hours. Alternative vendors were suggested to them. Respond faster to retain leads!`,
          type: "warning",
          link: "/vendor/dashboard?tab=inquiries",
        });
      }

      results.push({
        inquiry_id: inquiry.id,
        vendor: originalVendor.business_name,
        alternatives_suggested: alternatives?.length || 0,
        credit_given: !!inquiry.user_id,
      });
    }

    return new Response(
      JSON.stringify({ 
        processed: results.length, 
        results 
      }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Response time guarantee error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
