import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatMessage {
  message: string;
  sessionId: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId }: ChatMessage = await req.json();

    console.log(`AI Wedding Planner request - Session: ${sessionId}`);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Unauthorized");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Check if user has AI Premium subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('plan', 'ai_premium')
      .eq('status', 'active')
      .maybeSingle();

    if (!subscription) {
      console.warn(`User ${user.id} attempted AI chat without subscription`);
      return new Response(
        JSON.stringify({ 
          error: 'AI Premium subscription required',
          requiresUpgrade: true 
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get chat history for context
    const { data: history } = await supabase
      .from('ai_chat_history')
      .select('*')
      .eq('user_id', user.id)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(50);

    // Get user profile for personalization
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Build conversation context
    const systemPrompt = `You are an expert Indian wedding planner assistant for Karlo Shaadi, India's #1 wedding planning platform.

YOUR ROLE:
- Help couples plan their dream Indian wedding with personalized recommendations
- Understand Indian wedding traditions, customs, and cultural nuances
- Provide budget-friendly yet beautiful solutions
- Guide through the entire wedding planning journey

AVAILABLE VENDOR CATEGORIES on Karlo Shaadi:
1. Photography & Videography - Capture beautiful memories
2. Catering - From traditional to fusion cuisine
3. Venues - Banquet halls, hotels, outdoor venues, destination weddings
4. Decoration - Floral, lighting, mandap design, stage decoration
5. Music & Entertainment - DJs, bands, orchestras, entertainers
6. Mehendi Artists - Traditional and contemporary designs
7. Makeup Artists - Bridal makeup, party makeup
8. Wedding Cakes - Custom designs and flavors
9. Wedding Planning - Full-service coordination

YOUR CAPABILITIES:
1. **Budget Planning**: Help allocate budget across categories (typically: Venue 25%, Catering 20%, Photography 15%, Decoration 15%, Others 25%)
2. **Timeline Creation**: 6-12 month planning timeline with milestones
3. **Vendor Recommendations**: Based on budget, location, style preferences
4. **Guest Management**: Help plan guest list, seating, invitations
5. **Theme & Decor**: Suggest themes, colors, decoration styles
6. **Tradition Guidance**: Explain rituals, customs, muhurat timing
7. **Budget Optimization**: Money-saving tips without compromising quality

USER CONTEXT:
${profile?.wedding_date ? `- Wedding Date: ${profile.wedding_date}` : '- Wedding date not set yet'}
${profile?.venue_city ? `- Wedding City: ${profile.venue_city}` : ''}
${profile?.guest_count ? `- Expected Guests: ${profile.guest_count}` : ''}
${profile?.budget_range ? `- Budget Range: ${profile.budget_range}` : ''}

RESPONSE STYLE:
- Warm, friendly, and encouraging
- Use Indian wedding terminology naturally (mandap, phere, sangeet, mehendi, etc.)
- Be practical and budget-conscious
- Provide specific, actionable advice
- Ask clarifying questions to understand better
- Suggest next steps in their planning journey
- When recommending vendors, direct them to search on Karlo Shaadi platform

IMPORTANT GUIDELINES:
- Always be culturally sensitive and respectful
- Consider regional variations in Indian weddings
- Don't push expensive solutions - focus on value
- Encourage using Karlo Shaadi's verified vendors
- If asked about specific vendors, suggest searching on the platform
- Keep responses concise but comprehensive (2-4 paragraphs max)
- Use emojis sparingly for warmth ✨💐🎊

Remember: You're helping create their dream wedding within their budget and preferences!`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).map(h => ({ 
        role: h.message_role, 
        content: h.message_content 
      })),
      { role: 'user', content: message }
    ];

    // Call Lovable AI (GPT-5 via gateway)
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('AI service not configured');
    }

    console.log('Calling Lovable AI Gateway...');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash', // Fast and cost-effective for conversations
        messages: messages,
        max_completion_tokens: 1000,
        temperature: 0.8, // Slightly creative for wedding planning
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', errorText);
      throw new Error('AI service temporarily unavailable');
    }

    const aiData = await aiResponse.json();
    const assistantMessage = aiData.choices[0].message.content;

    console.log('AI response generated successfully');

    // Save to chat history
    await supabase.from('ai_chat_history').insert([
      { 
        user_id: user.id, 
        session_id: sessionId, 
        message_role: 'user', 
        message_content: message,
        metadata: { timestamp: new Date().toISOString() }
      },
      { 
        user_id: user.id, 
        session_id: sessionId, 
        message_role: 'assistant', 
        message_content: assistantMessage,
        metadata: { 
          model: 'google/gemini-2.5-flash',
          timestamp: new Date().toISOString()
        }
      }
    ]);

    console.log(`Chat history saved for session ${sessionId}`);

    return new Response(
      JSON.stringify({ 
        response: assistantMessage,
        sessionId: sessionId
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("AI Wedding Planner error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Sorry, I encountered an issue. Please try again."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
