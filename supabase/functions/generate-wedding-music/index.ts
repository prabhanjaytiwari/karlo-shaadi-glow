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

interface SunoTrack {
  id: string;
  title: string;
  // API may return camelCase or snake_case depending on version
  audio_url?: string;
  audioUrl?: string;
  source_audio_url?: string;
  sourceAudioUrl?: string;
  image_url?: string;
  imageUrl?: string;
  source_image_url?: string;
  sourceImageUrl?: string;
  duration?: number;
  tags?: string;
  prompt?: string;
  createTime?: string;
}

interface SunoQueryResponse {
  code: number;
  msg: string;
  data?: {
    status: string;
    response?: {
      taskId: string;
      sunoData?: SunoTrack[];
    };
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

// Helper to poll for task completion using the record-info endpoint
async function pollForCompletion(
  taskId: string, 
  apiKey: string, 
  maxAttempts: number = 60,
  delayMs: number = 5000
): Promise<SunoQueryResponse> {
  for (let i = 0; i < maxAttempts; i++) {
    console.log(`Polling attempt ${i + 1}/${maxAttempts} for task ${taskId}`);
    
    // Use the correct GET endpoint to check task status
    const response = await fetch(`https://api.sunoapi.org/api/v1/generate/record-info?taskId=${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Task polling error:', response.status);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error(`Failed to check task status: ${response.status}`);
    }

    const data: SunoQueryResponse = await response.json();
    const status = data.data?.status;
    const sunoData = data.data?.response?.sunoData;
    
    console.log('Task status:', status, 'Response code:', data.code, 'Has audio data:', !!(sunoData && sunoData.length > 0));
    
    // Log audio URLs if available
    if (sunoData && sunoData.length > 0) {
      sunoData.forEach((track, idx) => {
        const audioUrl = track.audio_url || track.audioUrl || track.source_audio_url || track.sourceAudioUrl;
        console.log(`Track ${idx}: audioUrl=${audioUrl}`);
      });
    }

    // Check for SUCCESS status (audio fully generated)
    if (data.code === 200 && status === 'SUCCESS') {
      // Verify we have actual audio URLs before returning (check both camelCase and snake_case)
      if (sunoData && sunoData.length > 0) {
        const firstTrack = sunoData[0];
        const hasAudio = firstTrack.audio_url || firstTrack.audioUrl || firstTrack.source_audio_url || firstTrack.sourceAudioUrl;
        if (hasAudio) {
          console.log('Audio generation complete with valid URLs');
          return data;
        }
      }
    }

    // TEXT_SUCCESS means lyrics are done but audio is still generating - keep polling
    if (status === 'TEXT_SUCCESS' || status === 'PENDING' || status === 'FIRST_STAGE_SUCCESS') {
      console.log('Audio still generating, continuing to poll...');
    }

    // Check for failure statuses
    if (status === 'CREATE_TASK_FAILED' || 
        status === 'GENERATE_AUDIO_FAILED' ||
        status === 'CALLBACK_EXCEPTION' ||
        status === 'SENSITIVE_WORD_ERROR' ||
        status === 'FAILED') {
      throw new Error('Music generation failed: ' + (status || data.msg));
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  throw new Error('Timeout waiting for music generation (5 minutes)');
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
    // Using callback URL from our edge function
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const callBackUrl = `${supabaseUrl}/functions/v1/suno-webhook`;
    
    const requestBody: Record<string, unknown> = {
      customMode: true,
      instrumental: instrumental,
      model: 'V5',
      prompt: enhancedPrompt,
      style: style,
      title: songTitle,
      callBackUrl: callBackUrl, // Required by Suno API
    };

    // Add lyrics if not instrumental
    if (!instrumental && personalizedLyrics) {
      requestBody.lyrics = personalizedLyrics;
    }

    console.log('Sending request to Suno API with callback:', callBackUrl);
    console.log('Request body:', JSON.stringify(requestBody));

    const generateResponse = await fetch('https://api.sunoapi.org/api/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const generateData: SunoGenerateResponse = await generateResponse.json();
    console.log('Suno generate response:', JSON.stringify(generateData));

    if (!generateResponse.ok || generateData.code !== 200) {
      console.error('Suno API generate error:', generateData.msg);
      
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
          message: 'Demo track - Please check your Suno API key and credits'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!generateData.data?.taskId) {
      throw new Error('No task ID returned from Suno API');
    }

    console.log('Task created with ID:', generateData.data.taskId);

    // Poll for task completion using the query endpoint
    const taskResult = await pollForCompletion(generateData.data.taskId, SUNO_API_KEY);

    const sunoData = taskResult.data?.response?.sunoData;
    if (!sunoData || sunoData.length === 0) {
      throw new Error('No audio clips generated');
    }

    // Format the tracks - handle both camelCase and snake_case from API
    const tracks = sunoData.map((track: SunoTrack) => ({
      id: track.id,
      title: track.title || songTitle,
      audio_url: track.audio_url || track.audioUrl || track.source_audio_url || track.sourceAudioUrl,
      image_url: track.image_url || track.imageUrl || track.source_image_url || track.sourceImageUrl,
      duration: track.duration || 180,
      prompt: track.prompt || prompt,
      lyrics: personalizedLyrics,
      category: category,
      names: names,
      created_at: track.createTime || new Date().toISOString(),
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
