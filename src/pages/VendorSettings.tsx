import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Bell, Shield, CreditCard, Building2, LogOut } from "lucide-react";
import { SEO } from "@/components/SEO";
import { PasswordChange } from "@/components/settings/PasswordChange";
import { NotificationPreferences } from "@/components/settings/NotificationPreferences";
import { DeleteAccount } from "@/components/settings/DeleteAccount";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";

export default function VendorSettings() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: vendorData } = await supabase
        .from("vendors")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!vendorData) {
        navigate("/vendor/onboarding");
        return;
      }

      setVendor(vendorData);

      const { data: subData } = await supabase
        .from("vendor_subscriptions")
        .select("*")
        .eq("vendor_id", vendorData.id)
        .single();

      setSubscription(subData);
    } catch (error) {
      console.error("Error loading vendor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been signed out successfully",
    });
    navigate("/");
  };

  const getTierBadge = (tier: string) => {
    const configs: Record<string, { label: string; className: string }> = {
      free: { label: "Silver (Free)", className: "bg-muted text-muted-foreground" },
      featured: { label: "Gold ⭐", className: "bg-gradient-to-r from-yellow-400/20 to-amber-500/20 text-amber-700 border border-amber-300" },
      sponsored: { label: "Diamond 💎", className: "bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30" },
    };
    return configs[tier] || configs.free;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading settings..." />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Vendor Settings"
        description="Manage your vendor account settings, billing, and preferences"
        keywords="vendor settings, account, billing"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60">
        
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <Button
              variant="ghost"
              onClick={() => navigate("/vendor/dashboard")}
              className="mb-6 hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="mb-8">
              <Badge className="bg-accent text-accent-foreground mb-2">Vendor Portal</Badge>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-2">
                Manage your business account and preferences
              </p>
            </div>

            <Tabs defaultValue="business" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                <TabsTrigger value="business" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Business</span>
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden sm:inline">Billing</span>
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

              <TabsContent value="business" className="space-y-6">
                {/* Business Info */}
                <Card className="bg-white/90 border-2 border-accent/20">
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                    <CardDescription>Your registered business details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Business Name</p>
                        <p className="font-medium">{vendor?.business_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-medium capitalize">{vendor?.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{vendor?.phone_number || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Verification Status</p>
                        <Badge variant={vendor?.verified ? "default" : "secondary"}>
                          {vendor?.verified ? "Verified ✓" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                    <Button onClick={() => navigate("/vendor/dashboard")} variant="outline">
                      Edit Business Profile
                    </Button>
                  </CardContent>
                </Card>

                {/* Logout */}
                <Card className="bg-white/90 border-2 border-accent/20">
                  <CardHeader>
                    <CardTitle>Sign Out</CardTitle>
                    <CardDescription>Sign out of your vendor account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleLogout} variant="outline" className="text-destructive hover:bg-destructive/10">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="space-y-6">
                {/* Current Plan */}
                <Card className="bg-white/90 border-2 border-accent/20">
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>Your subscription details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Plan</p>
                        <Badge className={getTierBadge(vendor?.subscription_tier || "free").className}>
                          {getTierBadge(vendor?.subscription_tier || "free").label}
                        </Badge>
                      </div>
                      {subscription?.status === "active" && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Next billing</p>
                          <p className="font-medium">
                            {subscription.expires_at 
                              ? new Date(subscription.expires_at).toLocaleDateString()
                              : "N/A"
                            }
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button onClick={() => navigate("/vendor-pricing")} variant="outline">
                        {vendor?.subscription_tier === "free" ? "Upgrade Plan" : "Manage Plan"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Billing History Link */}
                <Card className="bg-white/90 border-2 border-accent/20">
                  <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>View all your payments and download invoices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => navigate("/vendor/billing")} variant="outline">
                      <CreditCard className="h-4 w-4 mr-2" />
                      View Billing History
                    </Button>
                  </CardContent>
                </Card>
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
