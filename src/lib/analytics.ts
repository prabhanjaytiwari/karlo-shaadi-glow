import { supabase } from "@/integrations/supabase/client";

export type EventType = 
  | "page_view"
  | "vendor_view"
  | "vendor_contact"
  | "booking_created"
  | "booking_confirmed"
  | "booking_cancelled"
  | "payment_initiated"
  | "payment_completed"
  | "payment_failed"
  | "subscription_started"
  | "subscription_cancelled"
  | "vendor_subscription_started"
  | "vendor_subscription_upgraded"
  | "vendor_subscription_cancelled"
  | "favorite_added"
  | "favorite_removed"
  | "search_performed"
  | "filter_applied"
  | "review_submitted"
  | "message_sent"
  | "ai_chat_started"
  | "ai_chat_message";

export interface AnalyticsEvent {
  event_type: EventType;
  user_id?: string;
  vendor_id?: string;
  metadata?: Record<string, any>;
}

/**
 * Track an analytics event
 */
export const trackEvent = async (event: AnalyticsEvent) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    const { error } = await supabase.functions.invoke("track-event", {
      body: {
        event_type: event.event_type,
        user_id: event.user_id || session?.user?.id,
        vendor_id: event.vendor_id,
        metadata: event.metadata || {}
      }
    });

    if (error) {
      console.error("Analytics tracking error:", error);
    }
  } catch (error) {
    // Silent fail - don't break user experience for analytics
    console.warn("Failed to track event:", error);
  }
};

/**
 * Track page view
 */
export const trackPageView = (page: string, metadata?: Record<string, any>) => {
  trackEvent({
    event_type: "page_view",
    metadata: { page, ...metadata }
  });
};

/**
 * Track vendor interaction
 */
export const trackVendorView = (vendorId: string, metadata?: Record<string, any>) => {
  trackEvent({
    event_type: "vendor_view",
    vendor_id: vendorId,
    metadata
  });
};

export const trackVendorContact = (vendorId: string, method: string) => {
  trackEvent({
    event_type: "vendor_contact",
    vendor_id: vendorId,
    metadata: { method }
  });
};

/**
 * Track booking events
 */
export const trackBookingCreated = (bookingId: string, vendorId: string, amount: number) => {
  trackEvent({
    event_type: "booking_created",
    vendor_id: vendorId,
    metadata: { booking_id: bookingId, amount }
  });
};

export const trackBookingConfirmed = (bookingId: string, vendorId: string) => {
  trackEvent({
    event_type: "booking_confirmed",
    vendor_id: vendorId,
    metadata: { booking_id: bookingId }
  });
};

export const trackBookingCancelled = (bookingId: string, vendorId: string, reason?: string) => {
  trackEvent({
    event_type: "booking_cancelled",
    vendor_id: vendorId,
    metadata: { booking_id: bookingId, reason }
  });
};

/**
 * Track payment events
 */
export const trackPaymentInitiated = (amount: number, type: "booking" | "subscription") => {
  trackEvent({
    event_type: "payment_initiated",
    metadata: { amount, type }
  });
};

export const trackPaymentCompleted = (amount: number, paymentId: string, type: "booking" | "subscription") => {
  trackEvent({
    event_type: "payment_completed",
    metadata: { amount, payment_id: paymentId, type }
  });
};

export const trackPaymentFailed = (amount: number, reason?: string) => {
  trackEvent({
    event_type: "payment_failed",
    metadata: { amount, reason }
  });
};

/**
 * Track subscription events
 */
export const trackSubscriptionStarted = (plan: string, amount: number) => {
  trackEvent({
    event_type: "subscription_started",
    metadata: { plan, amount }
  });
};

export const trackSubscriptionCancelled = (plan: string, reason?: string) => {
  trackEvent({
    event_type: "subscription_cancelled",
    metadata: { plan, reason }
  });
};

export const trackVendorSubscriptionStarted = (vendorId: string, plan: string, amount: number) => {
  trackEvent({
    event_type: "vendor_subscription_started",
    vendor_id: vendorId,
    metadata: { plan, amount }
  });
};

export const trackVendorSubscriptionUpgraded = (vendorId: string, oldPlan: string, newPlan: string) => {
  trackEvent({
    event_type: "vendor_subscription_upgraded",
    vendor_id: vendorId,
    metadata: { old_plan: oldPlan, new_plan: newPlan }
  });
};

export const trackVendorSubscriptionCancelled = (vendorId: string, plan: string) => {
  trackEvent({
    event_type: "vendor_subscription_cancelled",
    vendor_id: vendorId,
    metadata: { plan }
  });
};

/**
 * Track user engagement
 */
export const trackFavoriteAdded = (vendorId: string) => {
  trackEvent({
    event_type: "favorite_added",
    vendor_id: vendorId
  });
};

export const trackFavoriteRemoved = (vendorId: string) => {
  trackEvent({
    event_type: "favorite_removed",
    vendor_id: vendorId
  });
};

export const trackSearch = (query: string, filters?: Record<string, any>) => {
  trackEvent({
    event_type: "search_performed",
    metadata: { query, filters }
  });
};

export const trackReviewSubmitted = (vendorId: string, rating: number) => {
  trackEvent({
    event_type: "review_submitted",
    vendor_id: vendorId,
    metadata: { rating }
  });
};

export const trackMessageSent = (recipientId: string) => {
  trackEvent({
    event_type: "message_sent",
    metadata: { recipient_id: recipientId }
  });
};

/**
 * Track AI usage
 */
export const trackAIChatStarted = () => {
  trackEvent({
    event_type: "ai_chat_started"
  });
};

export const trackAIChatMessage = (messageLength: number) => {
  trackEvent({
    event_type: "ai_chat_message",
    metadata: { message_length: messageLength }
  });
};
