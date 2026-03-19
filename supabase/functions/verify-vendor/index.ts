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
          subject: verified ? "Your Vendor Profile is Verified! ✅" : "Vendor Verification Status Update",
          html: verified
            ? `
              <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a0a2e; font-weight: 700;">Congratulations! 🎉</h1>
              <p style="color: #444; font-size: 15px; line-height: 1.7;">Your vendor profile for <strong>${data.business_name}</strong> has been verified by our team.</p>
              <div style="background: linear-gradient(135deg, #faf7f4 0%, #f5ede4 100%); border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #22c55e; text-align: center;">
                <p style="margin: 0; font-size: 36px;">✅</p>
                <p style="margin: 8px 0 0; color: #1a0a2e; font-weight: 600; font-size: 16px;">Verified Vendor</p>
              </div>
              <p style="color: #666; font-size: 14px;">You will now appear as a verified vendor on Karlo Shaadi, which helps build trust with couples.</p>
              <div style="text-align: center; margin: 24px 0;">
                <a href="https://karloshaadi.com/vendor/dashboard" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">View Dashboard →</a>
              </div>
            `
            : `
              <h1 style="margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #1a0a2e; font-weight: 700;">Verification Status Update</h1>
              <p style="color: #444; font-size: 15px; line-height: 1.7;">Your vendor profile verification status for <strong>${data.business_name}</strong> has been updated.</p>
              <p style="color: #666; font-size: 14px;">Please contact support if you have any questions.</p>
              <div style="text-align: center; margin: 24px 0;">
                <a href="https://karloshaadi.com/vendor/dashboard" style="background: #D946EF; color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">View Dashboard →</a>
              </div>
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
