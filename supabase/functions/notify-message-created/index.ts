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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const payload = await req.json();
    
    console.log("New message webhook received:", payload);

    const message = payload.record;
    
    // Don't notify the sender
    const recipientId = message.recipient_id;
    
    // Get sender name
    let senderName = "Someone";
    
    // Check if sender is a vendor
    const { data: vendor } = await supabase
      .from("vendors")
      .select("business_name, user_id")
      .eq("user_id", message.sender_id)
      .single();
    
    if (vendor) {
      senderName = vendor.business_name;
    } else {
      // Sender is a couple/user
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", message.sender_id)
        .single();
      
      if (profile) {
        senderName = profile.full_name;
      }
    }

    // Create in-app notification
    await supabase.from("notifications").insert({
      user_id: recipientId,
      type: "message",
      title: "New Message",
      message: `${senderName}: ${message.message.substring(0, 50)}${message.message.length > 50 ? '...' : ''}`,
      link: "/messages",
    });

    // Send push notification
    await fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        user_id: recipientId,
        title: `💬 ${senderName}`,
        body: message.message.substring(0, 100) + (message.message.length > 100 ? '...' : ''),
        url: "/messages",
        tag: "message"
      }),
    });

    // Send email notification
    const { data: recipientAuth } = await supabase.auth.admin.getUserById(recipientId);
    const recipientEmail = recipientAuth?.user?.email;
    if (recipientEmail) {
      const preview = message.message.substring(0, 120) + (message.message.length > 120 ? '...' : '');
      fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          to: recipientEmail,
          subject: `New message from ${senderName} — Karlo Shaadi`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #b91c1c;">💬 New Message</h2>
              <p>You have a new message from <strong>${senderName}</strong>:</p>
              <div style="background: #fef2f2; border-left: 4px solid #b91c1c; padding: 16px; border-radius: 4px; margin: 16px 0;">
                <p style="margin: 0; font-style: italic;">"${preview}"</p>
              </div>
              <a href="https://karloshaadi.com/messages" style="display: inline-block; background: #b91c1c; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 10px;">
                Reply Now
              </a>
              <p style="color: #666; font-size: 12px; margin-top: 30px;">
                This is an automated message from Karlo Shaadi. Please do not reply to this email.
              </p>
            </div>
          `,
          type: "new_message",
        }),
      }).catch(() => { /* best-effort */ });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-message-created:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
