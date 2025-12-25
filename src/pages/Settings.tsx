import { useNavigate } from "react-router-dom";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Bell, Shield, LogOut } from "lucide-react";
import { SEO } from "@/components/SEO";
import { PasswordChange } from "@/components/settings/PasswordChange";
import { NotificationPreferences } from "@/components/settings/NotificationPreferences";
import { DeleteAccount } from "@/components/settings/DeleteAccount";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been signed out successfully",
    });
    navigate("/");
  };

  return (
    <>
      <SEO 
        title="Settings"
        description="Manage your account settings, notifications, and privacy preferences"
        keywords="settings, account, notifications, privacy"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60">
        <BhindiHeader />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="mb-6 hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="mb-8">
              <div className="w-16 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 rounded-full mb-4" />
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-2">
                Manage your account preferences and security
              </p>
            </div>

            <Tabs defaultValue="account" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Account</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="space-y-6">
                {/* Profile Link */}
                <div className="bg-white/90 border-2 border-accent/20 rounded-lg p-6">
                  <h3 className="font-medium mb-2">Profile Information</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Update your wedding details and preferences
                  </p>
                  <Button onClick={() => navigate("/profile")} variant="outline">
                    Edit Profile
                  </Button>
                </div>

                {/* Logout */}
                <div className="bg-white/90 border-2 border-accent/20 rounded-lg p-6">
                  <h3 className="font-medium mb-2">Sign Out</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sign out of your account on this device
                  </p>
                  <Button onClick={handleLogout} variant="outline" className="text-destructive hover:bg-destructive/10">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="notifications">
                <NotificationPreferences />
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <PasswordChange />
                <DeleteAccount />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <BhindiFooter />
      </div>
    </>
  );
}
