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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get pending applications
    const { data: pendingApps, error } = await supabase
      .from("shaadi_seva_applications")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error) throw error;

    const pendingCount = pendingApps?.length || 0;

    // Get fund stats
    const { data: fundData } = await supabase
      .from("shaadi_seva_fund")
      .select("seva_amount");

    const totalRaised = fundData?.reduce((sum, r) => sum + Number(r.seva_amount), 0) || 0;

    // Log outreach event
    await supabase.from("analytics_events").insert({
      event_type: "shaadi_seva_outreach",
      metadata: {
        pending_applications: pendingCount,
        total_fund_raised: totalRaised,
        triggered_at: new Date().toISOString(),
      },
    });

    // Notify admin about pending applications
    if (pendingCount > 0) {
      // Get admin users
      const { data: adminRoles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (adminRoles && adminRoles.length > 0) {
        const notifications = adminRoles.map((admin) => ({
          user_id: admin.user_id,
          title: `Shaadi Seva: ${pendingCount} Pending Applications`,
          message: `There are ${pendingCount} new applications waiting for review. Total fund: ₹${totalRaised.toLocaleString()}.`,
          type: "shaadi_seva",
          link: "/admin/dashboard",
        }));

        await supabase.from("notifications").insert(notifications);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        pending_applications: pendingCount,
        total_raised: totalRaised,
        notifications_sent: pendingCount > 0,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Outreach error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
