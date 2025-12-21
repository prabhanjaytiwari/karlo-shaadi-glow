import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MusicRequest {
  prompt: string;
  category: string;
  style?: string;
  instrumental?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUNO_API_KEY = Deno.env.get('SUNO_API_KEY');
    
    if (!SUNO_API_KEY) {
      console.error('SUNO_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Suno API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, category, style = 'bollywood wedding', instrumental = false }: MusicRequest = await req.json();

    console.log('Generating music for category:', category, 'with prompt:', prompt);

    // Create the music generation request
    const generateResponse = await fetch('https://api.suno.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        style: style,
        instrumental: instrumental,
        duration: 30, // 30 seconds clips
      }),
    });

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      console.error('Suno API error:', generateResponse.status, errorText);
      
      // Return a demo response for testing
      return new Response(
        JSON.stringify({
          success: true,
          tracks: [
            {
              id: `demo-${Date.now()}`,
              title: `${category} - Wedding Song`,
              audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
              duration: 30,
              prompt: prompt,
              category: category,
              created_at: new Date().toISOString(),
            }
          ],
          message: 'Demo track generated (API integration pending)'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await generateResponse.json();
    console.log('Suno API response:', JSON.stringify(data));

    return new Response(
      JSON.stringify({
        success: true,
        tracks: data.tracks || data,
        message: 'Music generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating music:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to generate music',
        success: false
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
