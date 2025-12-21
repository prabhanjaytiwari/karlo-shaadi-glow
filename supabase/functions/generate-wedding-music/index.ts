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

interface SunoGenerateResponse {
  code: number;
  msg: string;
  data?: {
    taskId: string;
  };
}

interface SunoTaskResponse {
  code: number;
  msg: string;
  data?: {
    status: string;
    clips?: Array<{
      id: string;
      title: string;
      audio_url: string;
      image_url?: string;
      duration?: number;
      created_at?: string;
    }>;
  };
}

// Helper to poll for task completion
async function pollForCompletion(
  taskId: string, 
  apiKey: string, 
  maxAttempts: number = 30,
  delayMs: number = 3000
): Promise<SunoTaskResponse> {
  for (let i = 0; i < maxAttempts; i++) {
    console.log(`Polling attempt ${i + 1}/${maxAttempts} for task ${taskId}`);
    
    const response = await fetch(`https://api.sunoapi.org/api/v1/task/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Task polling error:', response.status);
      throw new Error(`Failed to check task status: ${response.status}`);
    }

    const data: SunoTaskResponse = await response.json();
    console.log('Task status:', data.data?.status);

    if (data.data?.status === 'completed' || data.data?.status === 'complete') {
      return data;
    }

    if (data.data?.status === 'failed' || data.data?.status === 'error') {
      throw new Error('Music generation failed');
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  throw new Error('Timeout waiting for music generation');
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

    const { prompt, category, style = 'Bollywood Wedding', instrumental = false }: MusicRequest = await req.json();

    console.log('Generating music for category:', category, 'with prompt:', prompt);

    // Enhance the prompt with wedding context
    const enhancedPrompt = `${prompt}. Style: ${style}. Indian wedding celebration music.`;
    
    // Create the music generation request using sunoapi.org
    const generateResponse = await fetch('https://api.sunoapi.org/api/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customMode: true,
        instrumental: instrumental,
        model: 'V4',
        prompt: enhancedPrompt,
        style: style,
        title: `${category} - Wedding Music`,
      }),
    });

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      console.error('Suno API generate error:', generateResponse.status, errorText);
      
      // If API fails, return demo track for testing
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
          message: 'Demo track (API key may be invalid or rate limited)'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const generateData: SunoGenerateResponse = await generateResponse.json();
    console.log('Suno generate response:', JSON.stringify(generateData));

    if (generateData.code !== 0 || !generateData.data?.taskId) {
      console.error('Suno API error:', generateData.msg);
      throw new Error(generateData.msg || 'Failed to start music generation');
    }

    // Poll for task completion
    const taskResult = await pollForCompletion(generateData.data.taskId, SUNO_API_KEY);

    if (!taskResult.data?.clips || taskResult.data.clips.length === 0) {
      throw new Error('No audio clips generated');
    }

    // Format the tracks
    const tracks = taskResult.data.clips.map(clip => ({
      id: clip.id,
      title: clip.title || `${category} - Wedding Music`,
      audio_url: clip.audio_url,
      image_url: clip.image_url,
      duration: clip.duration || 30,
      prompt: prompt,
      category: category,
      created_at: clip.created_at || new Date().toISOString(),
    }));

    return new Response(
      JSON.stringify({
        success: true,
        tracks: tracks,
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
