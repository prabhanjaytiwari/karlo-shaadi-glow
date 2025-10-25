import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ManageTierRequest {
  vendorId: string;
  action: 'upgrade' | 'downgrade' | 'cancel' | 'activate';
  newTier?: 'free' | 'featured' | 'sponsored';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vendorId, action, newTier }: ManageTierRequest = await req.json();

    console.log(`Managing vendor tier for ${vendorId}: action=${action}, newTier=${newTier}`);

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

    // Verify vendor ownership (or admin access)
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('id, user_id, subscription_tier')
      .eq('id', vendorId)
      .single();

    if (vendorError || !vendor) {
      throw new Error("Vendor not found");
    }

    // Check if user is admin
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    const isAdmin = userRole?.role === 'admin';
    const isOwner = vendor.user_id === user.id;

    if (!isAdmin && !isOwner) {
      throw new Error("Unauthorized to manage this vendor");
    }

    // Get current subscription
    const { data: currentSubscription } = await supabase
      .from('vendor_subscriptions')
      .select('*')
      .eq('vendor_id', vendorId)
      .single();

    let updateData: any = {};
    let razorpayAction = null;

    switch (action) {
      case 'activate':
        // Activate subscription after payment
        if (!currentSubscription) {
          throw new Error("No subscription found to activate");
        }
        
        updateData = {
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        };

        // Update vendor tier
        const activeTier = currentSubscription.plan;
        await supabase
          .from('vendors')
          .update({
            subscription_tier: activeTier,
            featured_until: updateData.expires_at,
            homepage_featured: activeTier === 'sponsored',
          })
          .eq('id', vendorId);

        console.log(`Activated ${activeTier} tier for vendor ${vendorId}`);
        break;

      case 'upgrade':
        if (!newTier || newTier === 'free') {
          throw new Error("Invalid upgrade tier");
        }

        // Cancel existing Razorpay subscription if exists
        if (currentSubscription?.razorpay_subscription_id && currentSubscription.status === 'active') {
          const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
          const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
          
          if (razorpayKeyId && razorpayKeySecret) {
            const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
            
            await fetch(
              `https://api.razorpay.com/v1/subscriptions/${currentSubscription.razorpay_subscription_id}/cancel`,
              {
                method: "POST",
                headers: {
                  Authorization: `Basic ${auth}`,
                },
              }
            );
            console.log(`Cancelled old subscription: ${currentSubscription.razorpay_subscription_id}`);
          }
        }

        // Update to new tier (new subscription will be created separately)
        updateData = {
          plan: newTier,
          status: 'pending_payment',
        };

        await supabase
          .from('vendors')
          .update({ subscription_tier: newTier })
          .eq('id', vendorId);

        console.log(`Upgraded vendor ${vendorId} to ${newTier}`);
        break;

      case 'downgrade':
        // Downgrade always goes to free
        updateData = {
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        };

        // Cancel Razorpay subscription if exists
        if (currentSubscription?.razorpay_subscription_id) {
          const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
          const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
          
          if (razorpayKeyId && razorpayKeySecret) {
            const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
            
            await fetch(
              `https://api.razorpay.com/v1/subscriptions/${currentSubscription.razorpay_subscription_id}/cancel`,
              {
                method: "POST",
                headers: {
                  Authorization: `Basic ${auth}`,
                },
              }
            );
          }
        }

        // Update vendor to free tier
        await supabase
          .from('vendors')
          .update({
            subscription_tier: 'free',
            featured_until: null,
            homepage_featured: false,
          })
          .eq('id', vendorId);

        console.log(`Downgraded vendor ${vendorId} to free`);
        break;

      case 'cancel':
        if (!currentSubscription) {
          throw new Error("No active subscription to cancel");
        }

        updateData = {
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        };

        // Cancel Razorpay subscription
        if (currentSubscription.razorpay_subscription_id) {
          const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
          const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
          
          if (razorpayKeyId && razorpayKeySecret) {
            const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
            
            const cancelResponse = await fetch(
              `https://api.razorpay.com/v1/subscriptions/${currentSubscription.razorpay_subscription_id}/cancel`,
              {
                method: "POST",
                headers: {
                  Authorization: `Basic ${auth}`,
                },
              }
            );

            if (!cancelResponse.ok) {
              console.error("Failed to cancel Razorpay subscription");
            } else {
              console.log(`Cancelled Razorpay subscription: ${currentSubscription.razorpay_subscription_id}`);
            }
          }
        }

        // Keep tier active until expiration
        console.log(`Cancelled subscription for vendor ${vendorId}, will expire at ${currentSubscription.expires_at}`);
        break;

      default:
        throw new Error("Invalid action");
    }

    // Update vendor_subscriptions table
    if (currentSubscription) {
      const { error: updateError } = await supabase
        .from('vendor_subscriptions')
        .update(updateData)
        .eq('vendor_id', vendorId);

      if (updateError) {
        console.error("Database update error:", updateError);
        throw updateError;
      }
    }

    // Send notification to vendor
    await supabase.from('notifications').insert([{
      user_id: vendor.user_id,
      type: 'subscription',
      title: `Subscription ${action}`,
      message: `Your vendor subscription has been ${action}d successfully.`,
      link: '/vendor/dashboard',
    }]);

    return new Response(
      JSON.stringify({
        success: true,
        action,
        vendorId,
        newTier: newTier || vendor.subscription_tier,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
