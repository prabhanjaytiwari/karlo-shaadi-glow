import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TrackEventRequest {
  event_type: string;
  vendor_id?: string;
  metadata?: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use service role key to bypass RLS for analytics tracking
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Create anon client just to verify user token if provided
    const supabaseAnon = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    let userId = null;

    if (authHeader) {
      const { data: { user } } = await supabaseAnon.auth.getUser(
        authHeader.replace("Bearer ", "")
      );
      userId = user?.id;
    }

    const { event_type, vendor_id, metadata }: TrackEventRequest = await req.json();

    console.log(`Tracking event: ${event_type} for user: ${userId || 'anonymous'}`);

    // Insert event using admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from("analytics_events")
      .insert({
        event_type,
        user_id: userId,
        vendor_id,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error("Error tracking event:", error);
      throw error;
    }

    console.log("Event tracked successfully:", data.id);

    return new Response(JSON.stringify({ success: true, event_id: data.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in track-event function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
