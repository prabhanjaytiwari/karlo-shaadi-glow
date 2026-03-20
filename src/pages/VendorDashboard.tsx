import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Calendar, Package, Images, Star, MessageSquare, User, LogOut, Plus, Trash2, Settings, TrendingUp, FileQuestion, ShieldCheck, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { ServiceForm } from "@/components/vendor/ServiceForm";
import { PortfolioUpload } from "@/components/vendor/PortfolioUpload";
import { AvailabilityCalendar } from "@/components/vendor/AvailabilityCalendar";
import { BookingManagementCard } from "@/components/vendor/BookingManagementCard";
import { ReviewResponse } from "@/components/vendor/ReviewResponse";
import { VendorAnalytics } from "@/components/vendor/VendorAnalytics";
import { VendorProfileEdit } from "@/components/vendor/VendorProfileEdit";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Skeleton } from "@/components/ui/skeleton";
import { BulkPortfolioUpload } from "@/components/vendor/BulkPortfolioUpload";
import { VendorMessagingInbox } from "@/components/vendor/VendorMessagingInbox";
import { RevenueCharts } from "@/components/vendor/RevenueCharts";
import { ProfileCompletionProgress } from "@/components/vendor/ProfileCompletionProgress";
import { VendorSubscriptionCheckout } from "@/components/vendor/VendorSubscriptionCheckout";
import { VendorInquiryManagement } from "@/components/vendor/VendorInquiryManagement";
import { VerifiedBadgeShowcase } from "@/components/vendor/VerifiedBadgeShowcase";
import { VendorToolkit } from "@/components/vendor/VendorToolkit";

const mapSubscriptionPlan = (sub: any): "free" | "silver" | "gold" | "diamond" => {
  if (!sub || sub.status !== 'active') return 'free';
  const plan = sub.plan?.toLowerCase() || 'free';
  if (plan === 'diamond' || plan === 'sponsored') return 'diamond';
  if (plan === 'gold' || plan === 'featured') return 'gold';
  if (plan === 'silver') return 'silver';
  return 'free';
};

export default function VendorDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    revenue: 0,
    avgBookingValue: 0,
    responseRate: 95,
    avgRating: 0,
  });
  const [services, setServices] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [portfolioDialogOpen, setPortfolioDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [revenueData, setRevenueData] = useState({
    monthlyData: [] as any[],
    categoryBreakdown: [] as any[],
    conversionData: { inquiries: 0, bookings: 0, conversionRate: 0 }
  });
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "analytics");
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<string>("");

  // Sync tab from URL query param
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) setActiveTab(tabFromUrl);
  }, [searchParams]);

  // Handle upgrade intent from VendorPricing page
  useEffect(() => {
    const state = location.state as { upgradeTo?: string } | null;
    if (state?.upgradeTo && vendor) {
      setSelectedUpgradePlan(state.upgradeTo);
      setUpgradeDialogOpen(true);
      // Clear the state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, vendor]);

  useEffect(() => {
    checkVendorAccess();
  }, []);

  const checkVendorAccess = async () => {
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
      loadStats(vendorData.id, vendorData.average_rating);
      loadServices(vendorData.id);
      loadPortfolio(vendorData.id);
      loadBookings(vendorData.id);
      loadReviews(vendorData.id);
      loadSubscription(vendorData.id);
      loadRevenueData(vendorData.id, vendorData.user_id);
    } catch (error) {
      navigate("/vendor/onboarding");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (vendorId: string, avgRating?: number) => {
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("vendor_id", vendorId);

    if (error) {
      console.error("Failed to load vendor stats:", error);
      return;
    }

    if (bookings) {
      const pending = bookings.filter(b => b.status === "pending").length;
      const confirmed = bookings.filter(b => b.status === "confirmed").length;
      const completed = bookings.filter(b => b.status === "completed").length;
      const revenue = bookings
        .filter(b => b.status === "completed")
        .reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
      const avgValue = bookings.length > 0
        ? bookings.reduce((sum, b) => sum + Number(b.total_amount || 0), 0) / bookings.length
        : 0;

      // Read vendorData from state at call time
      const currentVendor = vendor;
      setStats({
        totalBookings: bookings.length,
        pendingBookings: pending,
        confirmedBookings: confirmed,
        completedBookings: completed,
        revenue,
        avgBookingValue: avgValue,
        responseRate: 95,
        avgRating: avgRating || 0,
      });
    }
  };

  const loadServices = async (vendorId: string) => {
    const { data } = await supabase
      .from("vendor_services")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });
    if (data) setServices(data);
  };

  const loadPortfolio = async (vendorId: string) => {
    const { data } = await supabase
      .from("vendor_portfolio")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("display_order", { ascending: true });
    if (data) setPortfolio(data);
  };

  const loadBookings = async (vendorId: string) => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });
    if (data) setBookings(data);
  };

  const loadReviews = async (vendorId: string) => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });
    if (data) setReviews(data);
  };

  const loadSubscription = async (vendorId: string) => {
    const { data } = await supabase
      .from("vendor_subscriptions")
      .select("*")
      .eq("vendor_id", vendorId)
      .single();
    
    if (data) setSubscription(data);
  };

  const loadRevenueData = async (vendorId: string, vendorUserId?: string) => {
    // Load real booking data for revenue charts
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("total_amount, created_at, status")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: true });

    if (bookingsData && bookingsData.length > 0) {
      // Group bookings by month
      const monthlyMap = new Map<string, { revenue: number; bookings: number; values: number[] }>();
      
      bookingsData.forEach(booking => {
        const date = new Date(booking.created_at);
        const monthKey = date.toLocaleString('default', { month: 'short' });
        const amount = booking.status === 'completed' ? (Number(booking.total_amount) || 0) : 0;
        
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, { revenue: 0, bookings: 0, values: [] });
        }
        
        const entry = monthlyMap.get(monthKey)!;
        entry.revenue += amount;
        entry.bookings += 1;
        entry.values.push(Number(booking.total_amount));
      });

      const monthlyData = Array.from(monthlyMap.entries()).map(([month, data]) => ({
        month,
        revenue: data.revenue,
        bookings: data.bookings,
        avgBookingValue: data.values.length > 0 
          ? Math.round(data.values.reduce((a, b) => a + b, 0) / data.values.length)
          : 0
      })).slice(-6); // Last 6 months

      // Load messages count for conversion rate
      const { count: inquiriesCount } = vendorUserId
        ? await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("recipient_id", vendorUserId)
        : { count: 0 };

      const conversionRate = inquiriesCount && inquiriesCount > 0 
        ? Math.round((stats.totalBookings / inquiriesCount) * 100)
        : 0;

      setRevenueData({
        monthlyData: monthlyData.length > 0 ? monthlyData : [
          { month: 'No Data', revenue: 0, bookings: 0, avgBookingValue: 0 }
        ],
        categoryBreakdown: [
          { name: vendor?.category || 'Services', value: stats.revenue }
        ],
        conversionData: {
          inquiries: inquiriesCount || 0,
          bookings: stats.totalBookings,
          conversionRate
        }
      });
    } else {
      // No bookings - show empty state
      setRevenueData({
        monthlyData: [{ month: 'No Data', revenue: 0, bookings: 0, avgBookingValue: 0 }],
        categoryBreakdown: [],
        conversionData: { inquiries: 0, bookings: 0, conversionRate: 0 }
      });
    }
  };

  const getSubscriptionBadge = () => {
    const tier = vendor?.subscription_tier || 'free';
    const colors = {
      free: 'bg-muted text-muted-foreground',
      featured: 'bg-gradient-to-r from-yellow-400/20 to-amber-500/20 text-amber-700 border border-amber-300',
      sponsored: 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30'
    };
    const labels = {
      free: 'Silver (Free)',
      featured: 'Gold ⭐',
      sponsored: 'Diamond 💎'
    };
    return { color: colors[tier as keyof typeof colors], label: labels[tier as keyof typeof labels] };
  };

  const deleteService = async (serviceId: string) => {
    const { error } = await supabase
      .from("vendor_services")
      .delete()
      .eq("id", serviceId);

    if (!error) {
      toast({ title: "Service deleted" });
      loadServices(vendor.id);
    }
  };

  const deletePortfolioItem = async (itemId: string) => {
    const { error } = await supabase
      .from("vendor_portfolio")
      .delete()
      .eq("id", itemId);

    if (!error) {
      toast({ title: "Portfolio item deleted" });
      loadPortfolio(vendor.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isMobile = useIsMobile();
  const subBadge = getSubscriptionBadge();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60">
        <div className="h-14 border-b bg-white/80" />
        <div className="max-w-7xl mx-auto px-4 pt-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 space-y-2 border border-border/30">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
          {/* Chart area */}
          <div className="grid md:grid-cols-2 gap-4">
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
          </div>
          {/* Table area */}
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      
      <MobilePageHeader title={vendor?.business_name || 'Dashboard'} showBack={false} />
      
      <main className={`flex-1 bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60 ${isMobile ? 'px-4 py-4' : 'pt-24 pb-12 px-4'}`}>
        <div className={isMobile ? '' : 'max-w-7xl mx-auto'}>
          {/* Subscription Checkout Dialog */}
          {vendor && (
            <VendorSubscriptionCheckout
              open={upgradeDialogOpen}
              onOpenChange={setUpgradeDialogOpen}
              vendorId={vendor.id}
              planId={selectedUpgradePlan}
              onSuccess={() => {
                checkVendorAccess();
              }}
            />
          )}

          {/* Desktop header */}
          {!isMobile && (
            <div className="flex justify-between items-center mb-8">
              <div>
                <Badge className="bg-accent text-accent-foreground mb-2">Vendor Portal</Badge>
                <h1 className="text-4xl font-bold mb-2">{vendor?.business_name}</h1>
                <div className="w-20 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 rounded-full" />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedUpgradePlan("gold");
                    setUpgradeDialogOpen(true);
                  }} 
                  size="sm" 
                  className="border-accent/30 hover:border-accent/50 hover:bg-accent/5"
                >
                  Upgrade Plan
                </Button>
                <Button variant="outline" onClick={() => navigate('/vendor/settings')} size="sm" className="border-accent/30 hover:border-accent/50 hover:bg-accent/5">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" onClick={handleLogout} size="icon" className="rounded-full border-accent/30 hover:border-accent/50 hover:bg-accent/5">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Mobile: Plan badge + upgrade strip */}
          {isMobile && vendor && (
            <div className="flex items-center justify-between mb-4 p-3 bg-white/90 rounded-xl border border-accent/20">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${subBadge.color}`}>
                  {subBadge.label}
                </span>
                <span className="text-xs text-muted-foreground">Plan</span>
              </div>
              {vendor.subscription_tier === 'free' && (
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => navigate('/vendor-pricing')}>
                  Upgrade
                </Button>
              )}
            </div>
          )}

          {/* Subscription Status Card */}
          {vendor && (
            <Card className="mb-6 bg-white/90 backdrop-blur-sm border border-accent/20 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      Current Plan: 
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getSubscriptionBadge().color}`}>
                        {getSubscriptionBadge().label}
                      </span>
                    </CardTitle>
                    <CardDescription className="mt-1.5 text-sm">
                      {vendor.subscription_tier === 'free' && 
                        "Upgrade to Featured or Sponsored to get 3-10x more bookings"}
                      {vendor.subscription_tier === 'featured' && 
                        "You're getting top 5 placement! Upgrade to Sponsored for homepage visibility"}
                      {vendor.subscription_tier === 'sponsored' && 
                        "You're on our premium plan with maximum visibility!"}
                    </CardDescription>
                  </div>
                  {vendor.subscription_tier === 'free' && (
                    <Button onClick={() => navigate('/vendor-pricing')} size="sm">
                      Upgrade Now
                    </Button>
                  )}
                </div>
              </CardHeader>
              {subscription && subscription.status === 'active' && (
                <CardContent className="pt-2">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Next Billing: </span>
                      <span className="font-semibold">
                        {new Date(subscription.expires_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount: </span>
                      <span className="font-semibold">₹{subscription.amount?.toLocaleString()}/month</span>
                    </div>
                    {vendor.subscription_tier === 'featured' && (
                      <div>
                        <span className="text-muted-foreground">Transaction Fee: </span>
                        <span className="font-semibold text-accent">10% (save 2%)</span>
                      </div>
                    )}
                    {vendor.subscription_tier === 'sponsored' && (
                      <div>
                        <span className="text-muted-foreground">Transaction Fee: </span>
                        <span className="font-semibold text-primary">0% (save 12%!)</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Stats Grid */}
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-3 mb-4' : 'grid-cols-2 md:grid-cols-4 gap-4 mb-6'}`}>
            <Card className="bg-white/90 backdrop-blur-sm border border-accent/15">
              <CardHeader className={isMobile ? 'p-3 pb-1' : 'p-4 pb-2'}>
                <CardTitle className="text-xs font-medium text-muted-foreground">Bookings</CardTitle>
              </CardHeader>
              <CardContent className={isMobile ? 'p-3 pt-0' : 'p-4 pt-0'}>
                <div className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{stats.totalBookings}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-accent/15">
              <CardHeader className={isMobile ? 'p-3 pb-1' : 'p-4 pb-2'}>
                <CardTitle className="text-xs font-medium text-muted-foreground">Pending</CardTitle>
              </CardHeader>
              <CardContent className={isMobile ? 'p-3 pt-0' : 'p-4 pt-0'}>
                <div className={`font-bold text-primary ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{stats.pendingBookings}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-accent/15">
              <CardHeader className={isMobile ? 'p-3 pb-1' : 'p-4 pb-2'}>
                <CardTitle className="text-xs font-medium text-muted-foreground">Revenue</CardTitle>
              </CardHeader>
              <CardContent className={isMobile ? 'p-3 pt-0' : 'p-4 pt-0'}>
                <div className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>₹{stats.revenue.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-accent/15">
              <CardHeader className={isMobile ? 'p-3 pb-1' : 'p-4 pb-2'}>
                <CardTitle className="text-xs font-medium text-muted-foreground">Rating</CardTitle>
              </CardHeader>
              <CardContent className={isMobile ? 'p-3 pt-0' : 'p-4 pt-0'}>
                <div className={`font-bold flex items-center ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                  {vendor?.average_rating || 0}
                  <Star className={`ml-1 fill-accent text-accent ${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Completion Progress */}
          {vendor && (
            <div className="mb-6">
              <ProfileCompletionProgress 
                vendor={vendor}
                servicesCount={services.length}
                portfolioCount={portfolio.length}
                onNavigateToTab={setActiveTab}
              />
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full flex overflow-x-auto scrollbar-hide justify-start lg:justify-center gap-1 p-1">
              <TabsTrigger value="analytics" className="shrink-0">
                <BarChart3 className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="inquiries" className="shrink-0 relative">
                <FileQuestion className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Inquiries</span>
              </TabsTrigger>
              <TabsTrigger value="revenue" className="shrink-0">
                <TrendingUp className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Revenue</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="shrink-0">
                <Calendar className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Bookings</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="shrink-0">
                <MessageSquare className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Messages</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="shrink-0">
                <Package className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Services</span>
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="shrink-0">
                <Images className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Portfolio</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="shrink-0">
                <Star className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Reviews</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="shrink-0">
                <Wrench className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Tools</span>
              </TabsTrigger>
              <TabsTrigger value="badge" className="shrink-0">
                <ShieldCheck className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Badge</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="shrink-0">
                <User className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Profile</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <VendorAnalytics stats={stats} />
            </TabsContent>

            <TabsContent value="inquiries">
              {vendor && <VendorInquiryManagement vendorId={vendor.id} />}
            </TabsContent>

            <TabsContent value="revenue">
              <RevenueCharts
                vendorId={vendor.id}
                monthlyData={revenueData.monthlyData}
                categoryBreakdown={revenueData.categoryBreakdown}
                conversionData={revenueData.conversionData}
              />
            </TabsContent>

            <TabsContent value="bookings">
              <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Your Bookings</h3>
                    {bookings.length === 0 ? (
                      <Card>
                        <CardContent className="py-8">
                          <p className="text-center text-muted-foreground">
                            No bookings yet. Share your profile to get started!
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid gap-4">
                        {bookings.map((booking) => (
                          <BookingManagementCard
                            key={booking.id}
                            booking={booking}
                            onUpdate={() => {
                              loadBookings(vendor.id);
                              loadStats(vendor.id);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Availability Calendar</h3>
                  <AvailabilityCalendar vendorId={vendor.id} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="messages">
              {vendor && (
                <VendorMessagingInbox vendorUserId={vendor.user_id} />
              )}
            </TabsContent>

            <TabsContent value="services">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Your Services</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your service packages and pricing
                    </p>
                  </div>
                  <Button onClick={() => { setEditingService(null); setServiceDialogOpen(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>

                {services.length === 0 ? (
                  <Card>
                    <CardContent className="py-8">
                      <p className="text-center text-muted-foreground">
                        No services yet. Add your first service package!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {services.map((service) => (
                      <Card key={service.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                          <CardTitle className="text-lg">{service.service_name}</CardTitle>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingService(service);
                                setServiceDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteService(service.id)}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {service.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {service.description}
                            </p>
                          )}
                          <div className="flex gap-4 text-sm">
                            <span className="font-semibold">
                              Base: ₹{Number(service.base_price).toLocaleString()}
                            </span>
                            {service.price_range_min && service.price_range_max && (
                              <span className="text-muted-foreground">
                                Range: ₹{Number(service.price_range_min).toLocaleString()} - ₹
                                {Number(service.price_range_max).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="portfolio">
              {vendor && (
                <BulkPortfolioUpload
                  vendorId={vendor.id}
                  onSuccess={() => {
                    loadPortfolio(vendor.id);
                    toast({
                      title: "Portfolio updated",
                      description: "Your images have been uploaded successfully.",
                    });
                  }}
                />
              )}

              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Your Portfolio</h3>
                    <p className="text-sm text-muted-foreground">
                      {portfolio.length} images uploaded
                    </p>
                  </div>
                </div>

                {portfolio.length === 0 ? (
                  <Card>
                    <CardContent className="py-8">
                      <p className="text-center text-muted-foreground">
                        No portfolio images yet. Upload your best work!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {portfolio.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="aspect-video relative">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                            onClick={() => deletePortfolioItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold">{item.title}</h4>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="availability">
              {vendor && <AvailabilityCalendar vendorId={vendor.id} />}
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <Card>
                    <CardContent className="py-8">
                      <p className="text-center text-muted-foreground">
                        No reviews yet. Complete bookings to receive reviews!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {reviews.map((review) => (
                      <ReviewResponse
                        key={review.id}
                        review={review}
                        onUpdate={() => loadReviews(vendor.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tools">
              {vendor && <VendorToolkit vendorId={vendor.id} vendorName={vendor.business_name} vendorCategory={vendor.category} subscriptionPlan={mapSubscriptionPlan(subscription)} />}
            </TabsContent>

            <TabsContent value="badge">
              {vendor && <VerifiedBadgeShowcase vendor={vendor} />}
            </TabsContent>

            <TabsContent value="profile">
              <VendorProfileEdit 
                vendor={vendor} 
                onUpdate={() => {
                  checkVendorAccess();
                  toast({
                    title: "Profile updated",
                    description: "Your changes have been saved successfully.",
                  });
                }} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      

      {vendor && (
        <>
          <ServiceForm
            vendorId={vendor.id}
            service={editingService}
            open={serviceDialogOpen}
            onOpenChange={setServiceDialogOpen}
            onSuccess={() => {
              loadServices(vendor.id);
              setEditingService(null);
            }}
          />
          <PortfolioUpload
            vendorId={vendor.id}
            open={portfolioDialogOpen}
            onOpenChange={setPortfolioDialogOpen}
            onSuccess={() => loadPortfolio(vendor.id)}
          />
        </>
      )}
    </div>
  );
}
