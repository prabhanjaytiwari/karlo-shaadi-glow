import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  message?: string;
  latency_ms?: number;
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: ServiceStatus;
    auth: ServiceStatus;
    storage: ServiceStatus;
    edge_functions: ServiceStatus;
  };
  latency: {
    database_ms: number;
    total_ms: number;
  };
  version: string;
}

interface UseHealthCheckReturn {
  health: HealthStatus | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isHealthy: boolean;
}

/**
 * Hook to check the health status of backend services
 * Use this for monitoring and displaying system status to users
 */
export const useHealthCheck = (autoRefresh: boolean = false, intervalMs: number = 60000): UseHealthCheckReturn => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('health-check');

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      setHealth(data);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to check health status';
      setError(errorMessage);
      console.error('Health check failed:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();

    if (autoRefresh) {
      const interval = setInterval(fetchHealth, intervalMs);
      return () => clearInterval(interval);
    }
  }, [fetchHealth, autoRefresh, intervalMs]);

  const isHealthy = health?.status === 'healthy';

  return {
    health,
    isLoading,
    error,
    refetch: fetchHealth,
    isHealthy,
  };
};

/**
 * Simple function to check if backend is reachable
 * Useful for one-off checks without the hook
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('health-check');
    return !error && data?.status === 'healthy';
  } catch {
    return false;
  }
};
