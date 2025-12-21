import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This webhook receives callbacks from Suno API when music generation is complete
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Received Suno webhook callback:', JSON.stringify(body));

    const { code, msg, data } = body;

    if (code === 200 && data?.callbackType === 'complete') {
      console.log('Music generation completed for task:', data.task_id);
      console.log('Generated tracks:', data.data?.length || 0);
      
      // Store the result in database for the frontend to fetch
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Store the generated music data
      const { error } = await supabase
        .from('generated_music')
        .upsert({
          task_id: data.task_id,
          status: 'completed',
          tracks: data.data || [],
          completed_at: new Date().toISOString(),
        }, { onConflict: 'task_id' });

      if (error) {
        console.error('Error storing music data:', error);
      }
    } else if (data?.callbackType === 'error' || code !== 200) {
      console.log('Music generation failed:', msg);
      
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase
        .from('generated_music')
        .upsert({
          task_id: data?.task_id || 'unknown',
          status: 'failed',
          error_message: msg,
          completed_at: new Date().toISOString(),
        }, { onConflict: 'task_id' });
    }

    // Always return 200 to acknowledge receipt
    return new Response(
      JSON.stringify({ status: 'received' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
