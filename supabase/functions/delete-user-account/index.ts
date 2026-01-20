import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    // Create client with user's token to verify identity
    const supabaseUser = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get the current user
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const userId = user.id;
    console.log(`Starting account deletion for user: ${userId}`);

    // Create admin client for deletions
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Delete user data from all related tables in order (respecting foreign keys)
    const deletionSteps = [
      // 1. Delete moodboard items first (references moodboards)
      async () => {
        const { data: moodboards } = await supabaseAdmin
          .from("moodboards")
          .select("id")
          .eq("user_id", userId);
        
        if (moodboards?.length) {
          const moodboardIds = moodboards.map(m => m.id);
          await supabaseAdmin
            .from("moodboard_items")
            .delete()
            .in("moodboard_id", moodboardIds);
        }
      },
      
      // 2. Delete moodboards
      async () => {
        await supabaseAdmin.from("moodboards").delete().eq("user_id", userId);
      },

      // 3. Delete wedding website related data
      async () => {
        const { data: websites } = await supabaseAdmin
          .from("wedding_websites")
          .select("id")
          .eq("user_id", userId);
        
        if (websites?.length) {
          const websiteIds = websites.map(w => w.id);
          await supabaseAdmin.from("wedding_gallery").delete().in("website_id", websiteIds);
          await supabaseAdmin.from("wedding_events").delete().in("website_id", websiteIds);
          await supabaseAdmin.from("wedding_rsvps").delete().in("website_id", websiteIds);
        }
      },

      // 4. Delete wedding websites
      async () => {
        await supabaseAdmin.from("wedding_websites").delete().eq("user_id", userId);
      },

      // 5. Delete booking documents (references bookings)
      async () => {
        const { data: bookings } = await supabaseAdmin
          .from("bookings")
          .select("id")
          .eq("couple_id", userId);
        
        if (bookings?.length) {
          const bookingIds = bookings.map(b => b.id);
          await supabaseAdmin.from("booking_documents").delete().in("booking_id", bookingIds);
          await supabaseAdmin.from("payments").delete().in("booking_id", bookingIds);
        }
      },

      // 6. Delete reviews (couple's reviews)
      async () => {
        await supabaseAdmin.from("reviews").delete().eq("couple_id", userId);
      },

      // 7. Delete bookings
      async () => {
        await supabaseAdmin.from("bookings").delete().eq("couple_id", userId);
      },

      // 8. Delete vendor data if user is a vendor
      async () => {
        const { data: vendor } = await supabaseAdmin
          .from("vendors")
          .select("id")
          .eq("user_id", userId)
          .single();
        
        if (vendor) {
          await supabaseAdmin.from("vendor_portfolio").delete().eq("vendor_id", vendor.id);
          await supabaseAdmin.from("vendor_services").delete().eq("vendor_id", vendor.id);
          await supabaseAdmin.from("vendor_availability").delete().eq("vendor_id", vendor.id);
          await supabaseAdmin.from("vendor_discounts").delete().eq("vendor_id", vendor.id);
          await supabaseAdmin.from("vendor_inquiries").delete().eq("vendor_id", vendor.id);
          await supabaseAdmin.from("vendor_subscriptions").delete().eq("vendor_id", vendor.id);
          await supabaseAdmin.from("vendor_payments").delete().eq("vendor_id", vendor.id);
          await supabaseAdmin.from("story_vendors").delete().eq("vendor_id", vendor.id);
          await supabaseAdmin.from("favorites").delete().eq("vendor_id", vendor.id);
          await supabaseAdmin.from("analytics_events").delete().eq("vendor_id", vendor.id);
          await supabaseAdmin.from("vendors").delete().eq("id", vendor.id);
        }
      },

      // 9. Delete other user data
      async () => {
        await supabaseAdmin.from("favorites").delete().eq("user_id", userId);
        await supabaseAdmin.from("messages").delete().eq("sender_id", userId);
        await supabaseAdmin.from("messages").delete().eq("recipient_id", userId);
        await supabaseAdmin.from("notifications").delete().eq("user_id", userId);
        await supabaseAdmin.from("push_subscriptions").delete().eq("user_id", userId);
        await supabaseAdmin.from("referrals").delete().eq("referrer_id", userId);
        await supabaseAdmin.from("referrals").delete().eq("referred_user_id", userId);
        await supabaseAdmin.from("user_referral_milestones").delete().eq("user_id", userId);
        await supabaseAdmin.from("user_achievements").delete().eq("user_id", userId);
        await supabaseAdmin.from("subscriptions").delete().eq("user_id", userId);
        await supabaseAdmin.from("budget_allocations").delete().eq("user_id", userId);
        await supabaseAdmin.from("wedding_checklist_items").delete().eq("user_id", userId);
        await supabaseAdmin.from("wedding_plans").delete().eq("user_id", userId);
        await supabaseAdmin.from("wedding_stories").delete().eq("submitted_by", userId);
        await supabaseAdmin.from("ai_chat_history").delete().eq("user_id", userId);
        await supabaseAdmin.from("generated_songs").delete().eq("user_id", userId);
        await supabaseAdmin.from("consultation_bookings").delete().eq("user_id", userId);
        await supabaseAdmin.from("notification_preferences").delete().eq("user_id", userId);
        await supabaseAdmin.from("analytics_events").delete().eq("user_id", userId);
      },

      // 10. Delete user roles
      async () => {
        await supabaseAdmin.from("user_roles").delete().eq("user_id", userId);
      },

      // 11. Delete profile
      async () => {
        await supabaseAdmin.from("profiles").delete().eq("id", userId);
      },

      // 12. Finally, delete the auth user
      async () => {
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (error) throw error;
      },
    ];

    // Execute all deletion steps
    for (let i = 0; i < deletionSteps.length; i++) {
      try {
        await deletionSteps[i]();
        console.log(`Deletion step ${i + 1}/${deletionSteps.length} completed`);
      } catch (stepError) {
        console.error(`Error in deletion step ${i + 1}:`, stepError);
        // Continue with other steps even if one fails
      }
    }

    console.log(`Account deletion completed for user: ${userId}`);

    return new Response(
      JSON.stringify({ success: true, message: "Account deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error deleting user account:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
