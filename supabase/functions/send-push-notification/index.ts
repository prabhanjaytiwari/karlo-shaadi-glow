import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushPayload {
  user_id: string;
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

interface PushError {
  statusCode?: number;
  message?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

    if (!vapidPrivateKey) {
      console.error('VAPID_PRIVATE_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Push notifications not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const payload: PushPayload = await req.json();

    console.log('Sending push notification to user:', payload.user_id);

    // Get user's push subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', payload.user_id);

    if (subError) {
      console.error('Error fetching subscriptions:', subError);
      throw subError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No push subscriptions found for user');
      return new Response(
        JSON.stringify({ message: 'No subscriptions found' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url || '/',
      tag: payload.tag || 'notification'
    });

    // Send to all subscriptions using web-push compatible format
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          // Import web-push compatible library for Deno
          const webPush = await import("https://esm.sh/web-push@3.6.7");
          
          webPush.setVapidDetails(
            'mailto:support@karloshaadi.com',
            vapidPublicKey,
            vapidPrivateKey
          );

          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth
            }
          };

          await webPush.sendNotification(pushSubscription, notificationPayload);
          console.log('Push sent successfully to:', sub.endpoint.substring(0, 50));
          return { success: true, endpoint: sub.endpoint };
        } catch (err: unknown) {
          const error = err as PushError;
          console.error('Error sending to subscription:', error);
          
          // Remove invalid subscriptions (410 Gone or 404 Not Found)
          if (error.statusCode === 410 || error.statusCode === 404) {
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('id', sub.id);
            console.log('Removed invalid subscription:', sub.id);
          }
          
          return { success: false, endpoint: sub.endpoint, error: error.message || 'Unknown error' };
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled' && (r.value as { success: boolean }).success).length;
    console.log(`Push notifications sent: ${successful}/${subscriptions.length}`);

    return new Response(
      JSON.stringify({ 
        message: 'Push notifications processed',
        sent: successful,
        total: subscriptions.length
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error in send-push-notification:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
