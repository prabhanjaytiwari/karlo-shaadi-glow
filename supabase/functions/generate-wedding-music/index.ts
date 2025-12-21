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
  lyrics?: string;
  title?: string;
  names?: {
    bride?: string;
    groom?: string;
    family?: string;
    custom?: string;
  };
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

// Helper to create personalized lyrics with names
function createPersonalizedLyrics(category: string, names: MusicRequest['names'], customLyrics?: string): string {
  if (customLyrics) {
    return customLyrics;
  }

  const bride = names?.bride || 'the bride';
  const groom = names?.groom || 'the groom';
  const family = names?.family || 'the family';

  const lyricsTemplates: Record<string, string> = {
    'couples': `[Verse 1]
${bride} and ${groom}, a love so divine
Two hearts beating as one, forever entwined
From this moment on, through joy and through rain
Together forever, in love we remain

[Chorus]
${bride} aur ${groom} ki shaadi hai
Khushiyon ki baaraat hai
Dil se dil mila hai aaj
Pyaar ki yeh raat hai`,

    'shaadi-joda': `[Verse 1]
Dekho aa gaya dulha raja ${groom}
Saath mein dulhan ${bride} ki jodi saja
Shehnai baje, dhol baje
Aaj ki raat mein jashn mane

[Chorus]
${groom} aur ${bride} ki jodi
Duniya mein sabse nyaari
Baraat chali, band baja
Shaadi ki dhoom machayi`,

    'family': `[Verse 1]
${family} ke ghar mein khushiyan aayi
${bride} aur ${groom} ne shaadi rachayi
Maa ki duayen, papa ka pyaar
Aaj hai sabse sundar tyohar

[Chorus]
Parivaar mein aaj jashn hai
${family} ki aankhon mein noor hai
Rishton ki gahrai mein
Pyaar ka samundar hai`,

    'didi-jiju': `[Verse 1]
Didi ${bride} ki shaadi hai aaj
Jiju ${groom} le aaye shaadi ka saaj
Behen ke liye yeh khushi ka din
Pyaar bhara tohfa hai yeh atin

[Chorus]
Didi jiju ki jodi salamat rahe
Duniya mein unka naam roshan rahe
Behen ki vidaai pe aankhon mein nami
Par khushiyon ki hai yeh saugaat ami`,

    'sangeet': `[Hook]
DJ bajao, floor hilao
${bride} aur ${groom} ke liye nach gaao
Sangeet ki raat mein nachte raho
Khushiyon mein doobte jao

[Verse]
Nachle nachle saari raat
${family} ki hai yeh baaraat
Dhamaal macha de dance floor pe
Yeh raat hai sabse khaas`,

    'mehendi': `[Verse 1]
Haathon mein ${bride} ke mehendi lagi
Pyaar ki kahani rang layi
${groom} ka naam chupa hai kahin
Dhundho agar mil sake yahin

[Chorus]
Mehendi rachni hai gulistaani
${bride} bani hai maharani
Rang laga, dhoom machaya
Mehendi ki raat hai suhani`,

    'reception': `[Verse 1]
Welcome to the celebration night
${bride} and ${groom} shining so bright
${family} together, hearts full of joy
This love story, nothing can destroy

[Chorus]
Cheers to the couple, raise your glass
${bride} aur ${groom} ki shaadi first class
Reception ki raat mein jashn manao
Zindagi bhar khushiyan paao`,

    'invitation': `[Instrumental intro]
Aapko ${family} ki taraf se
${bride} aur ${groom} ki shaadi mein
Sadar nimantran hai
Zaroor padhaarein, apni shubhkamnayein dein`,
  };

  return lyricsTemplates[category] || lyricsTemplates['couples'];
}

// Helper to poll for task completion
async function pollForCompletion(
  taskId: string, 
  apiKey: string, 
  maxAttempts: number = 40,
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

    const { 
      prompt, 
      category, 
      style = 'Bollywood Wedding', 
      instrumental = false,
      lyrics: customLyrics,
      title: customTitle,
      names
    }: MusicRequest = await req.json();

    console.log('Generating personalized song for category:', category, 'with names:', names);

    // Create personalized lyrics
    const personalizedLyrics = instrumental ? '' : createPersonalizedLyrics(category, names, customLyrics);
    
    // Create song title
    const songTitle = customTitle || (names?.bride && names?.groom 
      ? `${names.bride} & ${names.groom} - ${category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`
      : `Wedding Song - ${category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`);

    // Enhance the prompt with wedding context
    const enhancedPrompt = instrumental 
      ? `${prompt}. Style: ${style}. Beautiful Indian wedding instrumental music with shehnai, tabla, and sitar elements.`
      : `${prompt}. Style: ${style}. Indian wedding celebration song with emotional vocals.`;
    
    // Create the music generation request using sunoapi.org with V5 model
    const requestBody: Record<string, unknown> = {
      customMode: true,
      instrumental: instrumental,
      model: 'V5',
      prompt: enhancedPrompt,
      style: style,
      title: songTitle,
    };

    // Add lyrics if not instrumental
    if (!instrumental && personalizedLyrics) {
      requestBody.lyrics = personalizedLyrics;
    }

    console.log('Sending request to Suno API:', JSON.stringify(requestBody));

    const generateResponse = await fetch('https://api.sunoapi.org/api/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
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
              title: songTitle,
              audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
              duration: 30,
              prompt: prompt,
              lyrics: personalizedLyrics,
              category: category,
              names: names,
              created_at: new Date().toISOString(),
            }
          ],
          message: 'Demo track (API key may need activation)'
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
      title: clip.title || songTitle,
      audio_url: clip.audio_url,
      image_url: clip.image_url,
      duration: clip.duration || 30,
      prompt: prompt,
      lyrics: personalizedLyrics,
      category: category,
      names: names,
      created_at: clip.created_at || new Date().toISOString(),
    }));

    return new Response(
      JSON.stringify({
        success: true,
        tracks: tracks,
        message: 'Personalized wedding song generated successfully!'
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
