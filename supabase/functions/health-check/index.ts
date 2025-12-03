import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  message?: string;
  latency_ms?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = performance.now();
  
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const healthStatus: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: { status: 'up' },
      auth: { status: 'up' },
      storage: { status: 'up' },
      edge_functions: { status: 'up' },
    },
    latency: {
      database_ms: 0,
      total_ms: 0,
    },
    version: '1.0.0',
  };

  // Check Database
  const dbStart = performance.now();
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('id')
      .limit(1);
    
    healthStatus.latency.database_ms = Math.round(performance.now() - dbStart);
    
    if (error) {
      healthStatus.services.database = {
        status: 'down',
        message: error.message,
        latency_ms: healthStatus.latency.database_ms,
      };
      healthStatus.status = 'degraded';
    } else {
      healthStatus.services.database.latency_ms = healthStatus.latency.database_ms;
    }
  } catch (e) {
    healthStatus.services.database = {
      status: 'down',
      message: e instanceof Error ? e.message : 'Unknown error',
      latency_ms: Math.round(performance.now() - dbStart),
    };
    healthStatus.status = 'unhealthy';
  }

  // Check Auth service
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error && error.message !== 'Auth session missing!') {
      healthStatus.services.auth = {
        status: 'degraded',
        message: error.message,
      };
      if (healthStatus.status === 'healthy') {
        healthStatus.status = 'degraded';
      }
    }
  } catch (e) {
    healthStatus.services.auth = {
      status: 'down',
      message: e instanceof Error ? e.message : 'Unknown error',
    };
    healthStatus.status = 'unhealthy';
  }

  // Check Storage
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      healthStatus.services.storage = {
        status: 'degraded',
        message: error.message,
      };
      if (healthStatus.status === 'healthy') {
        healthStatus.status = 'degraded';
      }
    }
  } catch (e) {
    healthStatus.services.storage = {
      status: 'down',
      message: e instanceof Error ? e.message : 'Unknown error',
    };
    healthStatus.status = 'unhealthy';
  }

  // Edge functions are healthy if we got this far
  healthStatus.services.edge_functions = {
    status: 'up',
    message: 'Edge functions operational',
  };

  healthStatus.latency.total_ms = Math.round(performance.now() - startTime);

  // Log health check for monitoring
  console.log('Health check completed:', JSON.stringify({
    status: healthStatus.status,
    database_latency: healthStatus.latency.database_ms,
    total_latency: healthStatus.latency.total_ms,
  }));

  // Return appropriate HTTP status
  const httpStatus = healthStatus.status === 'healthy' ? 200 
    : healthStatus.status === 'degraded' ? 200 
    : 503;

  return new Response(JSON.stringify(healthStatus, null, 2), {
    status: httpStatus,
    headers: { 
      ...corsHeaders, 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
});
