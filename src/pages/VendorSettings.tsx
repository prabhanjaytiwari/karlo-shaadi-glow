import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Bell, Shield, CreditCard, Building2, LogOut, Loader2, XCircle } from "lucide-react";
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
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => { loadVendorData(); }, []);

  const loadVendorData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }

      const { data: vendorData } = await supabase
        .from("vendors").select("*").eq("user_id", user.id).single();
      if (!vendorData) { navigate("/vendor/onboarding"); return; }
      setVendor(vendorData);

      const { data: subData } = await supabase
        .from("vendor_subscriptions").select("*").eq("vendor_id", vendorData.id).single();
      setSubscription(subData);
    } catch { /* ignored */ } finally { setLoading(false); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out", description: "You have been signed out successfully" });
    navigate("/");
  };

  const handleCancelSubscription = async () => {
    if (!vendor?.id) return;
    setCancelling(true);
    try {
      const { data, error } = await supabase.functions.invoke("cancel-vendor-subscription", {
        body: { vendorId: vendor.id },
      });
      if (error) throw error;

      toast({
        title: "Subscription Cancelled",
        description: `Your benefits remain active until ${data.endsAt ? new Date(data.endsAt).toLocaleDateString() : 'end of billing period'}. No further charges.`,
      });
      await loadVendorData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to cancel subscription", variant: "destructive" });
    } finally { setCancelling(false); }
  };

  const getTierBadge = (tier: string) => {
    const configs: Record<string, { label: string; className: string }> = {
      free: { label: "Free", className: "bg-muted text-muted-foreground" },
      starter: { label: "Starter ⭐", className: "bg-slate-100 text-slate-700 border border-slate-300" },
      pro: { label: "Pro 🌟", className: "bg-amber-100 text-amber-700 border border-amber-300" },
      elite: { label: "Elite 💎", className: "bg-primary/10 text-primary border border-primary/30" },
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

  const isActiveSubscription = subscription && ['active', 'created'].includes(subscription.status);
  const isCancelled = subscription?.status === 'cancelled';

  return (
    <>
      <SEO title="Vendor Settings" description="Manage your vendor account settings, billing, and preferences" keywords="vendor settings, account, billing" />
      <div className="min-h-screen bg-background">
        <MobilePageHeader title="Vendor Settings" />
        <main className={isMobile ? "px-4 py-4 pb-24" : "pt-24 pb-16"}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-4xl">
            <Button variant="ghost" onClick={() => navigate("/vendor/dashboard")} className="mb-6 hover:text-accent">
              <ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard
            </Button>

            <div className="mb-8">
              <Badge className="bg-accent text-accent-foreground mb-2">Vendor Portal</Badge>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-2">Manage your business account and preferences</p>
            </div>

            <Tabs defaultValue="business" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                <TabsTrigger value="business" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" /><span className="hidden sm:inline">Business</span>
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /><span className="hidden sm:inline">Billing</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" /><span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" /><span className="hidden sm:inline">Security</span>
                </TabsTrigger>
              </TabsList>

              {/* Business Tab */}
              <TabsContent value="business" className="space-y-6">
                <Card className="bg-card shadow-sm">
                  <CardHeader><CardTitle>Business Information</CardTitle><CardDescription>Your registered business details</CardDescription></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div><p className="text-sm text-muted-foreground">Business Name</p><p className="font-medium">{vendor?.business_name}</p></div>
                      <div><p className="text-sm text-muted-foreground">Category</p><p className="font-medium capitalize">{vendor?.category}</p></div>
                      <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{vendor?.phone_number || "Not set"}</p></div>
                      <div><p className="text-sm text-muted-foreground">Verification Status</p><Badge variant={vendor?.verified ? "default" : "secondary"}>{vendor?.verified ? "Verified ✓" : "Pending"}</Badge></div>
                    </div>
                    <Button onClick={() => navigate("/vendor/dashboard")} variant="outline">Edit Business Profile</Button>
                  </CardContent>
                </Card>
                <Card className="bg-card shadow-sm">
                  <CardHeader><CardTitle>Sign Out</CardTitle><CardDescription>Sign out of your vendor account</CardDescription></CardHeader>
                  <CardContent>
                    <Button onClick={handleLogout} variant="outline" className="text-destructive hover:bg-destructive/10">
                      <LogOut className="h-4 w-4 mr-2" />Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-6">
                <Card className="bg-card shadow-sm">
                  <CardHeader><CardTitle>Current Plan</CardTitle><CardDescription>Your subscription details</CardDescription></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Plan</p>
                        <Badge className={getTierBadge(vendor?.subscription_tier || "free").className}>
                          {getTierBadge(vendor?.subscription_tier || "free").label}
                        </Badge>
                      </div>
                      {isActiveSubscription && subscription.expires_at && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Next billing</p>
                          <p className="font-medium">{new Date(subscription.expires_at).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>

                    {isActiveSubscription && subscription.amount && (
                      <div className="text-sm text-muted-foreground">
                        Monthly charge: <span className="font-semibold text-foreground">₹{Number(subscription.amount).toLocaleString()}</span>
                        {subscription.discount_amount > 0 && (
                          <span className="text-green-600 ml-2">(saved ₹{Number(subscription.discount_amount).toLocaleString()} with promo)</span>
                        )}
                      </div>
                    )}

                    {isCancelled && (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
                        ⚠️ Subscription cancelled. Benefits active until {subscription.expires_at ? new Date(subscription.expires_at).toLocaleDateString() : 'end of period'}.
                      </div>
                    )}

                    <div className="pt-4 border-t flex flex-wrap gap-3">
                      <Button onClick={() => navigate("/vendor-pricing")} variant="outline">
                        {vendor?.subscription_tier === "free" || isCancelled ? "Upgrade Plan" : "Change Plan"}
                      </Button>

                      {isActiveSubscription && subscription.razorpay_subscription_id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" className="text-destructive hover:bg-destructive/10">
                              <XCircle className="h-4 w-4 mr-2" />Cancel Subscription
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel your subscription?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Your {subscription.plan} plan benefits will remain active until{" "}
                                <strong>{subscription.expires_at ? new Date(subscription.expires_at).toLocaleDateString() : 'end of billing period'}</strong>.
                                After that, your account will revert to the Free plan. No further charges will be made.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                              <AlertDialogAction onClick={handleCancelSubscription} disabled={cancelling} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                {cancelling ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Cancelling...</> : "Yes, Cancel"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card shadow-sm">
                  <CardHeader><CardTitle>Billing History</CardTitle><CardDescription>View all your payments and download invoices</CardDescription></CardHeader>
                  <CardContent>
                    <Button onClick={() => navigate("/vendor/billing")} variant="outline">
                      <CreditCard className="h-4 w-4 mr-2" />View Billing History
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications"><NotificationPreferences /></TabsContent>

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
