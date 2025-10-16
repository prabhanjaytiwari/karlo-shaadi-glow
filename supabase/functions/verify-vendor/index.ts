import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyVendorRequest {
  vendor_id: string;
  verified: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Get the admin user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const { data: { user } } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (roleError || !roleData) {
      throw new Error("User is not an admin");
    }

    const { vendor_id, verified }: VerifyVendorRequest = await req.json();

    console.log(`${verified ? 'Verifying' : 'Unverifying'} vendor: ${vendor_id} by admin: ${user.id}`);

    // Update vendor verification status
    const { data, error } = await supabaseClient
      .from("vendors")
      .update({
        verified,
        verified_by: verified ? user.id : null,
        verification_date: verified ? new Date().toISOString() : null,
      })
      .eq("id", vendor_id)
      .select("id, business_name, user_id")
      .single();

    if (error) {
      console.error("Error updating vendor:", error);
      throw error;
    }

    // Get vendor user email to send notification
    const { data: vendorUser } = await supabaseClient.auth.admin.getUserById(data.user_id);

    if (vendorUser && vendorUser.user?.email) {
      // Send email notification to vendor
      await supabaseClient.functions.invoke("send-email", {
        body: {
          to: vendorUser.user.email,
          subject: verified ? "Your Vendor Profile is Verified!" : "Vendor Verification Status Update",
          html: verified
            ? `
              <h1>Congratulations!</h1>
              <p>Your vendor profile for <strong>${data.business_name}</strong> has been verified by our admin team.</p>
              <p>You will now appear as a verified vendor on Karlo Shaadi, which will help build trust with potential customers.</p>
              <p>Best regards,<br>The Karlo Shaadi Team</p>
            `
            : `
              <h1>Verification Status Update</h1>
              <p>Your vendor profile verification status for <strong>${data.business_name}</strong> has been updated.</p>
              <p>Please contact support if you have any questions.</p>
              <p>Best regards,<br>The Karlo Shaadi Team</p>
            `,
          type: "vendor_verification",
        },
      });
    }

    // Create notification for vendor
    await supabaseClient.from("notifications").insert({
      user_id: data.user_id,
      type: "vendor_verification",
      title: verified ? "Profile Verified!" : "Verification Status Updated",
      message: verified
        ? `Your vendor profile "${data.business_name}" has been verified!`
        : `Your vendor profile verification status has been updated.`,
      link: "/vendor/dashboard",
    });

    console.log("Vendor verification updated successfully");

    return new Response(
      JSON.stringify({ success: true, vendor: data }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-vendor function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
