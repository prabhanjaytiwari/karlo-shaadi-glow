import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UpdateResponseTimeRequest {
  vendor_id: string;
  inquiry_id: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    // Allow service role calls (internal server-to-server)
    const isServiceRole = token === supabaseServiceKey;

    if (!isServiceRole) {
      // Verify user JWT
      const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
      const { data: { user }, error: authError } = await userClient.auth.getUser(token);
      if (authError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { vendor_id, inquiry_id }: UpdateResponseTimeRequest = await req.json();

    console.log(`Calculating response time for vendor: ${vendor_id}, inquiry: ${inquiry_id}`);

    // Get the inquiry details
    const { data: inquiry, error: inquiryError } = await supabase
      .from("vendor_inquiries")
      .select("created_at, updated_at, status")
      .eq("id", inquiry_id)
      .single();

    if (inquiryError || !inquiry) {
      throw new Error("Inquiry not found");
    }

    // Only calculate if status changed from 'pending' to 'contacted'
    if (inquiry.status !== 'contacted') {
      return new Response(
        JSON.stringify({ message: "Response time only calculated when status changes to contacted" }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Calculate response time in hours
    const createdAt = new Date(inquiry.created_at);
    const respondedAt = new Date(inquiry.updated_at);
    const responseTimeHours = (respondedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    console.log(`Response time: ${responseTimeHours.toFixed(2)} hours`);

    // Get all responded inquiries for this vendor to calculate average
    const { data: allInquiries, error: allError } = await supabase
      .from("vendor_inquiries")
      .select("created_at, updated_at")
      .eq("vendor_id", vendor_id)
      .in("status", ["contacted", "converted", "closed"]);

    if (allError) {
      throw new Error("Failed to fetch vendor inquiries");
    }

    // Calculate average response time
    let totalHours = 0;
    let count = 0;

    for (const inq of allInquiries || []) {
      const created = new Date(inq.created_at);
      const updated = new Date(inq.updated_at);
      const hours = (updated.getTime() - created.getTime()) / (1000 * 60 * 60);
      
      // Only count reasonable response times (less than 7 days)
      if (hours > 0 && hours < 168) {
        totalHours += hours;
        count++;
      }
    }

    const avgResponseTimeHours = count > 0 ? totalHours / count : responseTimeHours;

    // Update vendor's average response time
    const { error: updateError } = await supabase
      .from("vendors")
      .update({ avg_response_time_hours: avgResponseTimeHours })
      .eq("id", vendor_id);

    if (updateError) {
      console.error("Failed to update vendor response time:", updateError);
      throw new Error("Failed to update vendor response time");
    }

    console.log(`Updated vendor ${vendor_id} avg response time: ${avgResponseTimeHours.toFixed(2)} hours`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        response_time_hours: responseTimeHours,
        avg_response_time_hours: avgResponseTimeHours 
      }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error calculating response time:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
