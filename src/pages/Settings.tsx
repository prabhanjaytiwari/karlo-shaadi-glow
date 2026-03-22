import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Bell, Shield, LogOut, ChevronRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { PasswordChange } from "@/components/settings/PasswordChange";
import { NotificationPreferences } from "@/components/settings/NotificationPreferences";
import { DeleteAccount } from "@/components/settings/DeleteAccount";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
      
      <div className="min-h-screen bg-background">
        
        <MobilePageHeader title="Settings" />
        
        <main className={isMobile ? "px-4 py-4 pb-24" : "pt-24 pb-16"}>
          <div className={isMobile ? "" : "container mx-auto px-6 max-w-4xl"}>
            {!isMobile && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/dashboard")}
                  className="mb-6 hover:text-accent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>

                <div className="mb-8">
                  <div className="w-12 h-0.5 bg-primary/30 rounded-full mb-4" />
                  <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                  <p className="text-muted-foreground mt-2">
                    Manage your account preferences and security
                  </p>
                </div>
              </>
            )}

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
                <div className="bg-card border border-border/50 rounded-2xl p-6">
                  <h3 className="font-medium mb-2">Profile Information</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Update your wedding details and preferences
                  </p>
                  <Button onClick={() => navigate("/profile")} variant="outline">
                    Edit Profile
                  </Button>
                </div>

                {/* Logout */}
                <div className="bg-card border border-border/50 rounded-2xl p-6">
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

        
      </div>
    </>
  );
}
