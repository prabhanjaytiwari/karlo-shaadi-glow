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

// Helper to create personalized lyrics with names - Professional songwriting quality
function createPersonalizedLyrics(category: string, names: MusicRequest['names'], customLyrics?: string): string {
  if (customLyrics) {
    return customLyrics;
  }

  const bride = names?.bride || 'Dulhaniya';
  const groom = names?.groom || 'Raja';
  const family = names?.family || 'Parivaar';

  const lyricsTemplates: Record<string, string> = {
    'couples': `[Verse 1]
In the garden where our stories first began
${bride} met ${groom}, fate's perfect plan
Every heartbeat whispers only your name
Through the fire and the rain, we burn the same flame

[Pre-Chorus]
Tumse mili toh zindagi badal gayi
Har khwahish meri tujhse jaa mili
You're the answer to my silent prayer
The one I'll love beyond compare

[Chorus]
${bride} aur ${groom} - yeh ishq hai sachcha
Saaton janam ka vaada hai pakka
Chandni raat mein dil ye gaaye
Do dil ek raaste pe mil jaaye
Oh-oh, ${bride} aur ${groom}
Forever and always, forever and always

[Verse 2]
Hand in hand through seasons we'll dance
${groom} promised ${bride} a lifetime romance
From haldi to pheras, every ritual we share
Is a testament to love, beyond compare`,

    'shaadi-joda': `[Intro - Dhol Beat]
Balle balle! Shaadi hai aaj!

[Verse 1]
Sehra bandh ke aa gaya raja ${groom}
Ghodi pe sawaar, chamke jaisa sooraj
Dulhan ${bride} tayyar, sharmaaye nazrein jhuka
Mehendi waale haathon mein chhupa pyaar ka naksha

[Pre-Chorus]
Shehnai pe chad gayi khushiyon ki dhun
Band baaje bajenge har gali har nukkad mein
Rishtey naye banenge, duaayein milegi sabki
${groom} aur ${bride} ki jodi hai sabse sachchi

[Chorus]
Jodi kamaal ki - rab ne banayi
${groom} ke dil mein ${bride} samayi
Nachho gaao, khushiyan manao
Shaadi ka jashn hai, sab mil ke aao!
Ho-ho, jodi number one
Forever together, our journey's begun

[Bridge]
Phere saat, vaade saat
Janmo janmo ka hai yeh saath!`,

    'family': `[Verse 1]
${family} ke aangan mein mehfil saji hai
${bride} aur ${groom} ki khushiyon ki gadi aaji hai
Nani ki duaayein, dadi ka aashirwaad
Mummy papa ki aankhon mein sapno ki baaraat

[Pre-Chorus]
Bade bhaiya muskuraye, choti behen ne gaana gaaya
Chacha chachi ne dance kiya, ghar mein rang jamaya
Every cousin, every uncle, every maasi here tonight
${family} together, everything feels right

[Chorus]
Ghar mein aaj jashn hai, roshni hai har taraf
${family} ki aan baan shaan, pyaar hai beshumaar
${bride} ki bidaai mein, aankhein bhi muskuraayi
Kyunki ${groom} ke ghar mein nayi khushiyaan aayi
Parivaar parivaar, pyaara parivaar!

[Verse 2]
Rishtey nibhaane ki hai yeh khushi
${family} ke saath, zindagi lagti hai nayi
From generation to generation, love passes on
In ${family}'s embrace, forever we belong`,

    'didi-jiju': `[Verse 1]
Yaad hai wo din jab didi ne rakhi bandhi thi
Bhai behen ki woh mithi yaadein, sab yaad aati hain
Aaj ${bride} didi dulhan bani, ${groom} jiju le jaayenge
Par dil ke kone mein hamesha didi reh jaayengi

[Pre-Chorus]
Ladaai jhagde, manaana maafi
Didi ki daant, aur phir pyaar wali chai
Jiju ${groom} sunlo yeh baat, didi ki izzat rakhna
Warna bhai aa jayega, yeh waada hai pakka!

[Chorus]
Didi meri jaan, jiju mera yaar
${bride} didi, ${groom} jiju, sabse pyaara pair
Vidaai ki raat mein, aankhein bhi ro rahi
Par dil mein khushi hai, nayi zindagi jo basi
Didi-jiju, didi-jiju, always in my heart!

[Bridge]
Raksha bandhan ki woh yaadein
Aaj shaadi ki hai yeh duaayein
Didi aap khush raho, yahi meri farmaish
${groom} jiju, didi ki hamesha rakhna laaj`,

    'sangeet': `[Intro - Beat Drop]
Let's go! Sangeet night!

[Verse 1]
DJ drop that beat, floor's getting hot
${bride} ke moves dekho, sabko kar de shocked
${groom} bhi kuch kam nahi, breaking it down
Saari mehfil nachti hai, we're painting the town

[Pre-Chorus]
Aunties in the corner, trying to keep up
Uncles doing bhangra, they never stop
${family} together on the dance floor tonight
Sangeet ki raat hai, everything feels right

[Chorus]
Nachle nachle, saari raat nachle
${bride} aur ${groom} ke liye pawein thapakle
Dham dham dham, bajti hai dholki
Sangeet mein aaj, har khushi hai dolki
One more time! Nachle nachle!
Hands up high, let's celebrate!

[Verse 2]
From Bollywood moves to the trending reels
${family} ne milke, sabko kiya heal
Haseen raat hai yeh, music is loud
${bride} and ${groom} dancing, making everyone proud

[Outro]
This is how we party, Indian style
Sangeet night, making memories worthwhile!`,

    'mehendi': `[Verse 1]
Mehendi lagi ${bride} ke haathon mein
${groom} ka naam chhupa hai lakeeron mein
Haldi ki khushboo, hawa mein ghuli
Dulhan ki khushiyon ki kitab khuli

[Pre-Chorus]
Sakhi sab mili, geet sunaye
Nani ke nuske se mehendi lagaye
Rangeen ratein, sapno ki baatein
${bride} ki aankhon mein chamkein sitaarein

[Chorus]
Mehendi tere naam ki, rang gehra laaye
${groom} ki yaad mein, dil ye gaaye
Haathon mein likhi, prem ki kahaani
${bride} bani dulhan, sabse suhani
Mehendi mehendi, rang la mehendi!

[Verse 2]
Cone se likhe patterns, intricate and fine
Every swirl and every dot, a love that's divine
${groom} dhundhega naam, haathon mein ${bride} ke
Yeh rasmein pyaari, nibhaye sadiyon ke

[Bridge]
Jitni gehri mehendi, utna gehra pyaar
${bride} aur ${groom} ka, permanent ikraar!`,

    'reception': `[Verse 1]
Welcome everyone to the grandest night
${bride} and ${groom}, under crystal lights
Dressed to impress, they walk hand in hand
The most beautiful couple across the land

[Pre-Chorus]
Champagne flowing, music playing soft
${family} gathered, spirits aloft
Every table decorated, every heart is full
Tonight we celebrate love, beautiful and wonderful

[Chorus]
Raise your glass to ${bride} and ${groom}
Love that blossomed, love that bloomed
Reception night, stars align
Cheers to forever, cheers to divine
To the couple! To the love!
Blessings shower from above!

[Verse 2]
From the first dance to the cake cutting sweet
Every moment magical, every memory complete
${groom} holds ${bride}, whispers in her ear
"I'll love you forever, year after year"

[Outro]
Thank you all for being here tonight
To witness love so pure and bright!`,

    'invitation': `[Verse 1]
A celebration awaits, so grand and divine
${family} invites you, please do make time
${bride} and ${groom} are tying the knot
Your presence is the blessing we've always sought

[Chorus]
Aapka aashirwaad chahiye, aapki duaayein
${bride} aur ${groom} ki khushiyon mein, shamil ho jaayein
Mark your calendars, save the date
For love and laughter, please don't be late!

[Outro]
With love and warmth, we welcome you
To be part of our dreams coming true!`,
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
