import { supabase } from "@/integrations/supabase/client";

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface ErrorLog {
  message: string;
  severity: ErrorSeverity;
  context?: string;
  metadata?: Record<string, any>;
  userId?: string;
  vendorId?: string;
  bookingId?: string;
  stack?: string;
}

// In-memory error buffer for batching
let errorBuffer: ErrorLog[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

/**
 * Log an error with context for debugging
 */
export const logError = async (error: ErrorLog) => {
  // Always log to console in development
  const logMethod = error.severity === 'critical' || error.severity === 'error' 
    ? console.error 
    : error.severity === 'warning' 
      ? console.warn 
      : console.log;

  logMethod(`[${error.severity.toUpperCase()}] ${error.context || 'App'}: ${error.message}`, {
    metadata: error.metadata,
    stack: error.stack
  });

  // Add to buffer for batching
  errorBuffer.push({
    ...error,
    metadata: {
      ...error.metadata,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }
  });

  // Flush immediately for critical errors
  if (error.severity === 'critical') {
    await flushErrors();
  } else {
    // Batch other errors
    scheduleFlush();
  }
};

/**
 * Schedule a flush of the error buffer
 */
const scheduleFlush = () => {
  if (flushTimeout) return;
  
  flushTimeout = setTimeout(async () => {
    await flushErrors();
    flushTimeout = null;
  }, 5000); // Flush every 5 seconds
};

/**
 * Flush all buffered errors to the analytics system
 */
const flushErrors = async () => {
  if (errorBuffer.length === 0) return;

  const errorsToSend = [...errorBuffer];
  errorBuffer = [];

  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Send to analytics/track-event edge function
    for (const error of errorsToSend) {
      await supabase.functions.invoke('track-event', {
        body: {
          event_type: `error_${error.severity}`,
          vendor_id: error.vendorId,
          metadata: {
            message: error.message,
            context: error.context,
            ...error.metadata
          }
        },
        headers: session?.access_token ? {
          Authorization: `Bearer ${session.access_token}`,
        } : {},
      }).catch(() => {
        // Silently fail - don't create infinite error loops
      });
    }
  } catch (e) {
    // Silently fail to prevent infinite loops
    console.error('Failed to flush error logs:', e);
  }
};

/**
 * Log a payment-related error
 */
export const logPaymentError = (
  message: string, 
  bookingId?: string, 
  metadata?: Record<string, any>
) => {
  return logError({
    message,
    severity: 'error',
    context: 'Payment',
    bookingId,
    metadata: {
      ...metadata,
      paymentFlow: true
    }
  });
};

/**
 * Log a booking-related error
 */
export const logBookingError = (
  message: string,
  bookingId?: string,
  vendorId?: string,
  metadata?: Record<string, any>
) => {
  return logError({
    message,
    severity: 'error',
    context: 'Booking',
    bookingId,
    vendorId,
    metadata
  });
};

/**
 * Log an authentication error
 */
export const logAuthError = (
  message: string,
  metadata?: Record<string, any>
) => {
  return logError({
    message,
    severity: 'warning',
    context: 'Authentication',
    metadata
  });
};

/**
 * Log a vendor-related error
 */
export const logVendorError = (
  message: string,
  vendorId?: string,
  metadata?: Record<string, any>
) => {
  return logError({
    message,
    severity: 'error',
    context: 'Vendor',
    vendorId,
    metadata
  });
};

/**
 * Log a critical system error
 */
export const logCriticalError = (
  message: string,
  error?: Error,
  metadata?: Record<string, any>
) => {
  return logError({
    message,
    severity: 'critical',
    context: 'System',
    stack: error?.stack,
    metadata: {
      ...metadata,
      errorName: error?.name,
      errorMessage: error?.message
    }
  });
};

/**
 * Create a wrapped function that logs errors
 */
export function withErrorLogging<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      await logError({
        message: error instanceof Error ? error.message : 'Unknown error',
        severity: 'error',
        context,
        stack: error instanceof Error ? error.stack : undefined,
        metadata: { args: JSON.stringify(args).slice(0, 500) }
      });
      throw error;
    }
  }) as T;
}

/**
 * Performance monitoring - log slow operations
 */
export const measurePerformance = async <T>(
  operation: string,
  fn: () => Promise<T>,
  thresholdMs: number = 2000
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    
    if (duration > thresholdMs) {
      await logError({
        message: `Slow operation detected: ${operation} took ${Math.round(duration)}ms`,
        severity: 'warning',
        context: 'Performance',
        metadata: {
          operation,
          duration: Math.round(duration),
          threshold: thresholdMs
        }
      });
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    await logError({
      message: `Operation failed: ${operation} after ${Math.round(duration)}ms`,
      severity: 'error',
      context: 'Performance',
      stack: error instanceof Error ? error.stack : undefined,
      metadata: {
        operation,
        duration: Math.round(duration)
      }
    });
    throw error;
  }
};

// Flush on page unload — errors already queued to track-event above;
// remaining buffered errors are dropped on page close to avoid calling
// a non-existent /api/log-errors endpoint.
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    errorBuffer = [];
  });
}
