import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Calendar, Package, Images, Star, MessageSquare, User, LogOut, Plus, Trash2, Settings, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { ServiceForm } from "@/components/vendor/ServiceForm";
import { PortfolioUpload } from "@/components/vendor/PortfolioUpload";
import { AvailabilityCalendar } from "@/components/vendor/AvailabilityCalendar";
import { BookingManagementCard } from "@/components/vendor/BookingManagementCard";
import { ReviewResponse } from "@/components/vendor/ReviewResponse";
import { VendorAnalytics } from "@/components/vendor/VendorAnalytics";
import { VendorProfileEdit } from "@/components/vendor/VendorProfileEdit";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { BulkPortfolioUpload } from "@/components/vendor/BulkPortfolioUpload";
import { VendorMessagingInbox } from "@/components/vendor/VendorMessagingInbox";
import { RevenueCharts } from "@/components/vendor/RevenueCharts";

export default function VendorDashboard() {
  const navigate = useNavigate();
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
      loadStats(vendorData.id);
      loadServices(vendorData.id);
      loadPortfolio(vendorData.id);
      loadBookings(vendorData.id);
      loadReviews(vendorData.id);
      loadSubscription(vendorData.id);
      loadRevenueData(vendorData.id);
    } catch (error) {
      console.error("Error:", error);
      navigate("/vendor/onboarding");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (vendorId: string) => {
    const { data: bookings } = await supabase
      .from("bookings")
      .select("*")
      .eq("vendor_id", vendorId);

    if (bookings) {
      const pending = bookings.filter(b => b.status === "pending").length;
      const confirmed = bookings.filter(b => b.status === "confirmed").length;
      const completed = bookings.filter(b => b.status === "completed").length;
      const revenue = bookings
        .filter(b => b.status === "completed")
        .reduce((sum, b) => sum + Number(b.total_amount), 0);
      const avgValue = bookings.length > 0 
        ? bookings.reduce((sum, b) => sum + Number(b.total_amount), 0) / bookings.length 
        : 0;

      setStats({
        totalBookings: bookings.length,
        pendingBookings: pending,
        confirmedBookings: confirmed,
        completedBookings: completed,
        revenue,
        avgBookingValue: avgValue,
        responseRate: 95, // Could calculate from messages in future
        avgRating: vendor?.average_rating || 0,
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

  const loadRevenueData = async (vendorId: string) => {
    // Generate mock data for last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyData = months.map(month => ({
      month,
      revenue: Math.floor(Math.random() * 200000) + 50000,
      bookings: Math.floor(Math.random() * 15) + 5,
      avgBookingValue: Math.floor(Math.random() * 30000) + 20000
    }));

    const categoryBreakdown = [
      { name: 'Photography', value: 120000 },
      { name: 'Catering', value: 95000 },
      { name: 'Decoration', value: 75000 },
      { name: 'Music', value: 45000 }
    ];

    setRevenueData({
      monthlyData,
      categoryBreakdown,
      conversionData: {
        inquiries: 45,
        bookings: stats.totalBookings,
        conversionRate: stats.totalBookings > 0 ? Math.round((stats.totalBookings / 45) * 100) : 0
      }
    });
  };

  const getSubscriptionBadge = () => {
    const tier = vendor?.subscription_tier || 'free';
    const colors = {
      free: 'bg-muted text-muted-foreground',
      featured: 'bg-accent/20 text-accent',
      sponsored: 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary'
    };
    const labels = {
      free: 'Free',
      featured: 'Featured ⭐',
      sponsored: 'Sponsored Premium 👑'
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BhindiHeader />
      
      <main className="flex-1 bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Badge className="bg-accent text-accent-foreground mb-2">Vendor Portal</Badge>
              <h1 className="text-4xl font-bold mb-2">{vendor?.business_name}</h1>
              <div className="w-20 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 rounded-full" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/vendor-pricing')} size="sm" className="border-accent/30 hover:border-accent/50 hover:bg-accent/5">
                Upgrade Plan
              </Button>
              <Button variant="outline" onClick={handleLogout} size="icon" className="rounded-full border-accent/30 hover:border-accent/50 hover:bg-accent/5">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Subscription Status Card */}
          {vendor && (
            <Card className="mb-8 bg-white/90 backdrop-blur-sm border-2 border-accent/30 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      Current Plan: 
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getSubscriptionBadge().color}`}>
                        {getSubscriptionBadge().label}
                      </span>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {vendor.subscription_tier === 'free' && 
                        "Upgrade to Featured or Sponsored to get 3-10x more bookings"}
                      {vendor.subscription_tier === 'featured' && 
                        "You're getting top 5 placement! Upgrade to Sponsored for homepage visibility"}
                      {vendor.subscription_tier === 'sponsored' && 
                        "You're on our premium plan with maximum visibility!"}
                    </CardDescription>
                  </div>
                  {vendor.subscription_tier === 'free' && (
                    <Button onClick={() => navigate('/vendor-pricing')} className="ml-4">
                      Upgrade Now
                    </Button>
                  )}
                </div>
              </CardHeader>
              {subscription && subscription.status === 'active' && (
                <CardContent>
                  <div className="flex gap-6 text-sm">
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-accent/20 hover:border-accent/40 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalBookings}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-accent/20 hover:border-accent/40 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.pendingBookings}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-accent/20 hover:border-accent/40 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{stats.revenue.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-accent/20 hover:border-accent/40 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center">
                  {vendor?.average_rating || 0}
                  <Star className="ml-2 h-6 w-6 fill-accent text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 lg:w-auto">
              <TabsTrigger value="analytics">
                <BarChart3 className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="revenue">
                <TrendingUp className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Revenue</span>
              </TabsTrigger>
              <TabsTrigger value="bookings">
                <Calendar className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Bookings</span>
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageSquare className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Messages</span>
              </TabsTrigger>
              <TabsTrigger value="services">
                <Package className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Services</span>
              </TabsTrigger>
              <TabsTrigger value="portfolio">
                <Images className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Portfolio</span>
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <Star className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Reviews</span>
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Profile</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <VendorAnalytics stats={stats} />
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

      <BhindiFooter />

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
