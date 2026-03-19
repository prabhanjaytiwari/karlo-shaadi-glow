import { supabase } from "@/integrations/supabase/client";

export type ErrorLevel = 'info' | 'warn' | 'error' | 'fatal';

export interface MonitoredError {
  level: ErrorLevel;
  message: string;
  context?: string;
  stack?: string;
  componentStack?: string;
  metadata?: Record<string, unknown>;
  userId?: string;
  vendorId?: string;
  url?: string;
  timestamp?: string;
}

// Error queue for batching
let errorQueue: MonitoredError[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_INTERVAL = 5000;
const MAX_QUEUE_SIZE = 20;

/**
 * Initialize global error handlers
 */
export const initializeErrorMonitoring = () => {
  if (typeof window === 'undefined') return;
  
  // Handle uncaught errors
  window.onerror = (message, source, lineno, colno, error) => {
    captureError({
      level: 'error',
      message: typeof message === 'string' ? message : 'Unknown error',
      context: 'GlobalErrorHandler',
      stack: error?.stack,
      metadata: {
        source,
        lineno,
        colno
      }
    });
    return false; // Let default handler run
  };
  
  // Handle unhandled promise rejections
  window.onunhandledrejection = (event) => {
    captureError({
      level: 'error',
      message: event.reason?.message || 'Unhandled Promise Rejection',
      context: 'UnhandledRejection',
      stack: event.reason?.stack,
      metadata: {
        reason: String(event.reason)
      }
    });
  };
  
  // Handle resource loading errors
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      const target = event.target as HTMLElement;
      captureError({
        level: 'warn',
        message: `Resource failed to load: ${target.tagName}`,
        context: 'ResourceError',
        metadata: {
          tagName: target.tagName,
          src: (target as HTMLImageElement | HTMLScriptElement).src || 
               (target as HTMLLinkElement).href,
        }
      });
    }
  }, true);
  
  console.log('[ErrorMonitor] Initialized global error handlers');
};

/**
 * Capture and queue an error
 */
export const captureError = (error: MonitoredError) => {
  const enrichedError: MonitoredError = {
    ...error,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  };
  
  // Log to console in development
  const logMethod = error.level === 'fatal' || error.level === 'error' 
    ? console.error 
    : error.level === 'warn' 
      ? console.warn 
      : console.log;
  
  logMethod(`[${error.level.toUpperCase()}] ${error.context || 'App'}:`, error.message, {
    metadata: error.metadata,
    stack: error.stack
  });
  
  // Add to queue
  errorQueue.push(enrichedError);
  
  // Flush immediately for fatal errors
  if (error.level === 'fatal') {
    flushErrors();
    return;
  }
  
  // Schedule flush if not already scheduled
  if (!flushTimer) {
    flushTimer = setTimeout(flushErrors, FLUSH_INTERVAL);
  }
  
  // Flush if queue is full
  if (errorQueue.length >= MAX_QUEUE_SIZE) {
    flushErrors();
  }
};

/**
 * Flush error queue to backend
 */
const flushErrors = async () => {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  
  if (errorQueue.length === 0) return;
  
  const errors = [...errorQueue];
  errorQueue = [];
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Send each error to analytics
    await Promise.allSettled(
      errors.map(error => 
        supabase.functions.invoke('track-event', {
          body: {
            event_type: `error_${error.level}`,
            vendor_id: error.vendorId,
            metadata: {
              message: error.message,
              context: error.context,
              stack: error.stack?.slice(0, 1000), // Limit stack trace size
              url: error.url,
              ...error.metadata
            }
          },
          headers: session?.access_token ? {
            Authorization: `Bearer ${session.access_token}`,
          } : {},
        })
      )
    );
  } catch (e) {
    // Silent fail to prevent infinite loops
    console.error('[ErrorMonitor] Failed to flush errors:', e);
  }
};

/**
 * Capture an error from React Error Boundary
 */
export const captureReactError = (
  error: Error, 
  errorInfo: { componentStack?: string },
  context?: string
) => {
  captureError({
    level: 'error',
    message: error.message,
    context: context || 'ReactErrorBoundary',
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    metadata: {
      errorName: error.name,
    }
  });
};

/**
 * Capture a payment-related error
 */
export const capturePaymentError = (
  message: string,
  metadata?: Record<string, unknown>
) => {
  captureError({
    level: 'error',
    message,
    context: 'Payment',
    metadata: {
      ...metadata,
      critical: true
    }
  });
};

/**
 * Capture an API error
 */
export const captureApiError = (
  endpoint: string,
  error: Error | string,
  metadata?: Record<string, unknown>
) => {
  captureError({
    level: 'error',
    message: typeof error === 'string' ? error : error.message,
    context: 'API',
    stack: typeof error === 'object' ? error.stack : undefined,
    metadata: {
      endpoint,
      ...metadata
    }
  });
};

/**
 * Performance monitoring - capture slow operations
 */
export const measureOperation = async <T>(
  operationName: string,
  operation: () => Promise<T>,
  thresholdMs: number = 3000
): Promise<T> => {
  const start = performance.now();
  
  try {
    const result = await operation();
    const duration = performance.now() - start;
    
    if (duration > thresholdMs) {
      captureError({
        level: 'warn',
        message: `Slow operation: ${operationName}`,
        context: 'Performance',
        metadata: {
          operationName,
          durationMs: Math.round(duration),
          thresholdMs
        }
      });
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    captureError({
      level: 'error',
      message: `Operation failed: ${operationName}`,
      context: 'Performance',
      stack: error instanceof Error ? error.stack : undefined,
      metadata: {
        operationName,
        durationMs: Math.round(duration),
        errorMessage: error instanceof Error ? error.message : String(error)
      }
    });
    throw error;
  }
};

/**
 * Create a wrapped function with automatic error capturing
 */
export function withErrorCapture<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureError({
        level: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        context,
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }) as T;
}

// Flush errors on page unload — errors are sent to track-event above.
// Clear the queue on unload; sendBeacon to /api/log-errors is removed
// because that endpoint does not exist in this project.
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    errorQueue = [];
  });

  // Initialize monitoring
  initializeErrorMonitoring();
}
