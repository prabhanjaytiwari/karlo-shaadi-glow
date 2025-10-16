import { supabase } from "@/integrations/supabase/client";

interface TrackEventParams {
  event_type: string;
  vendor_id?: string;
  metadata?: Record<string, any>;
}

export const useAnalytics = () => {
  const trackEvent = async ({ event_type, vendor_id, metadata }: TrackEventParams) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase.functions.invoke('track-event', {
        body: {
          event_type,
          vendor_id,
          metadata,
        },
        headers: session?.access_token ? {
          Authorization: `Bearer ${session.access_token}`,
        } : {},
      });

      if (error) {
        console.error('Error tracking event:', error);
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  };

  return { trackEvent };
};
