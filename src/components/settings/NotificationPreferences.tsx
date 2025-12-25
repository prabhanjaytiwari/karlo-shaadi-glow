import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bell, Mail, MessageSquare, Loader2 } from "lucide-react";

interface NotificationSettings {
  email_new_booking: boolean;
  email_booking_status: boolean;
  email_new_message: boolean;
  email_review: boolean;
  email_marketing: boolean;
  email_referral: boolean;
  sms_new_booking: boolean;
  sms_booking_status: boolean;
}

const defaultSettings: NotificationSettings = {
  email_new_booking: true,
  email_booking_status: true,
  email_new_message: true,
  email_review: true,
  email_marketing: false,
  email_referral: true,
  sms_new_booking: true,
  sms_booking_status: true,
};

export function NotificationPreferences() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setSettings({
          email_new_booking: data.email_new_booking ?? true,
          email_booking_status: data.email_booking_status ?? true,
          email_new_message: data.email_new_message ?? true,
          email_review: data.email_review ?? true,
          email_marketing: data.email_marketing ?? false,
          email_referral: data.email_referral ?? true,
          sms_new_booking: data.sms_new_booking ?? true,
          sms_booking_status: data.sms_booking_status ?? true,
        });
      }
    } catch (error) {
      // No existing preferences, use defaults
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("notification_preferences")
        .upsert({
          user_id: user.id,
          ...settings,
        });

      if (error) throw error;

      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save preferences",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <Card className="bg-white/90 border-2 border-accent/20">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 border-2 border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-accent" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose how you want to receive updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Notifications
          </h4>
          
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="email_new_booking" className="cursor-pointer">
                New bookings & inquiries
              </Label>
              <Switch
                id="email_new_booking"
                checked={settings.email_new_booking}
                onCheckedChange={() => toggleSetting("email_new_booking")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email_booking_status" className="cursor-pointer">
                Booking status updates
              </Label>
              <Switch
                id="email_booking_status"
                checked={settings.email_booking_status}
                onCheckedChange={() => toggleSetting("email_booking_status")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email_new_message" className="cursor-pointer">
                New messages
              </Label>
              <Switch
                id="email_new_message"
                checked={settings.email_new_message}
                onCheckedChange={() => toggleSetting("email_new_message")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email_review" className="cursor-pointer">
                Review notifications
              </Label>
              <Switch
                id="email_review"
                checked={settings.email_review}
                onCheckedChange={() => toggleSetting("email_review")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email_referral" className="cursor-pointer">
                Referral updates
              </Label>
              <Switch
                id="email_referral"
                checked={settings.email_referral}
                onCheckedChange={() => toggleSetting("email_referral")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email_marketing" className="cursor-pointer text-muted-foreground">
                Marketing & promotional emails
              </Label>
              <Switch
                id="email_marketing"
                checked={settings.email_marketing}
                onCheckedChange={() => toggleSetting("email_marketing")}
              />
            </div>
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            SMS Notifications
          </h4>
          
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="sms_new_booking" className="cursor-pointer">
                New bookings & inquiries
              </Label>
              <Switch
                id="sms_new_booking"
                checked={settings.sms_new_booking}
                onCheckedChange={() => toggleSetting("sms_new_booking")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sms_booking_status" className="cursor-pointer">
                Booking status updates
              </Label>
              <Switch
                id="sms_booking_status"
                checked={settings.sms_booking_status}
                onCheckedChange={() => toggleSetting("sms_booking_status")}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}
