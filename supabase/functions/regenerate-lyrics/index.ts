import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RegenerateLyricsRequest {
  category: string;
  mood: string;
  names: {
    bride?: string;
    groom?: string;
    family?: string;
  };
  currentLyrics?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { category, mood, names, currentLyrics }: RegenerateLyricsRequest = await req.json();

    console.log('Regenerating lyrics with:', { category, mood, names: !!names });

    const bride = names?.bride || 'Dulhaniya';
    const groom = names?.groom || 'Raja';
    const family = names?.family || 'Parivaar';

    // Map categories to descriptions
    const categoryDescriptions: Record<string, string> = {
      'couples': `a romantic love song celebrating the eternal bond between ${bride} and ${groom}`,
      'shaadi-joda': `a grand wedding entry song for ${groom} (the groom) and ${bride} (the bride)`,
      'family': `a heartfelt family celebration song for the ${family} family`,
      'didi-jiju': `a fun, emotional song about ${bride} (didi/sister) getting married to ${groom} (jiju/brother-in-law)`,
      'sangeet': `an energetic dance song for sangeet night featuring ${bride} and ${groom}`,
      'mehendi': `a festive mehendi ceremony song celebrating ${bride}'s henna ceremony`,
      'reception': `an elegant reception party song for ${bride} and ${groom}'s celebration`,
      'invitation': `a beautiful wedding invitation song for ${bride} and ${groom}'s wedding`
    };

    // Map moods to style instructions
    const moodInstructions: Record<string, string> = {
      'romantic': 'deeply romantic, tender, and emotional with sweet metaphors about eternal love, hearts beating as one, and destiny bringing lovers together',
      'playful': 'fun, teasing, and lighthearted with witty wordplay, inside jokes about wedding chaos, and humorous observations about married life',
      'emotional': 'deeply moving, tear-jerking, and sentimental focusing on family bonds, childhood memories, and bittersweet moments of change',
      'energetic': 'high-energy, celebratory, and dance-worthy with catchy hooks, rhythmic patterns, and party vibes',
      'traditional': 'traditional Indian wedding style with classical references, auspicious imagery, cultural rituals, and blessings from elders',
      'modern': 'contemporary and trendy with current slang, modern love expressions, and fresh perspectives on marriage',
      'sufi': 'mystical, spiritual, and soulful with Sufi poetry influences, divine love metaphors, and transcendent themes',
      'bollywood': 'classic Bollywood drama style with filmi expressions, dramatic declarations of love, and cinematic moments'
    };

    const categoryDesc = categoryDescriptions[category] || `a wedding song for ${bride} and ${groom}`;
    const moodStyle = moodInstructions[mood] || moodInstructions['romantic'];

    const systemPrompt = `You are a legendary Indian wedding songwriter who has written thousands of hit wedding songs, jingles, and romantic ballads. You blend Hindi and English (Hinglish) seamlessly, creating lyrics that make people laugh, cry, and dance at weddings.

Your lyrics are known for:
- Perfect rhyme schemes and catchy hooks
- Emotional depth that touches hearts
- Clever wordplay mixing Hindi and English
- Using the actual names naturally in verses
- Creating memorable chorus sections people sing along to
- Authentic Indian wedding cultural references

FORMAT YOUR LYRICS EXACTLY LIKE THIS:
[Verse 1]
(4-6 lines)

[Pre-Chorus]
(2-4 lines building to chorus)

[Chorus]
(4-6 catchy, singable lines - this should be the most memorable part)

[Verse 2]
(4-6 lines)

[Bridge]
(2-4 emotional or powerful lines)

[Final Chorus]
(repeat or variation of chorus)`;

    const userPrompt = `Create ${moodStyle} lyrics for ${categoryDesc}.

IMPORTANT NAMES TO USE:
- Bride: ${bride}
- Groom: ${groom}
- Family: ${family}

MOOD/STYLE: ${mood.toUpperCase()} - Make the lyrics ${moodStyle}

${currentLyrics ? `Here are the current lyrics for reference (create something DIFFERENT but keep the names):\n${currentLyrics.substring(0, 500)}...` : ''}

Write complete, polished lyrics that a professional singer could perform. Make every line count - no filler. The names should appear naturally, not forced. Mix Hindi and English beautifully.`;

    console.log('Calling Lovable AI for lyrics generation...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.9,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please try again later.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const generatedLyrics = data.choices?.[0]?.message?.content;

    if (!generatedLyrics) {
      throw new Error('No lyrics generated');
    }

    console.log('Lyrics generated successfully');

    return new Response(JSON.stringify({ 
      lyrics: generatedLyrics,
      mood,
      category 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error regenerating lyrics:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to regenerate lyrics' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
