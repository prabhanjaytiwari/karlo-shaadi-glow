import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Shield, Users, CheckCircle, TrendingUp, IndianRupee, BarChart3,
  MessageSquare, Star, Calendar, Eye, Flag, Search, Activity,
  LogOut, Bell, Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { StoryModerationTab } from "@/components/admin/StoryModerationTab";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { PaymentTestingPanel } from "@/components/admin/PaymentTestingPanel";
import { VendorVerificationPanel } from "@/components/admin/VendorVerificationPanel";
import { ShaadiSevaAdminTab } from "@/components/admin/ShaadiSevaAdminTab";
import { SubscriptionRecoveryPanel } from "@/components/admin/SubscriptionRecoveryPanel";
import { useAuthContext } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({
  title, value, icon: Icon, trend, color = "primary", loading
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  color?: "primary" | "amber" | "green" | "blue" | "purple" | "rose";
  loading?: boolean;
}) => {
  const colorMap = {
    primary: "text-primary bg-primary/10",
    amber: "text-amber-600 bg-amber-100",
    green: "text-emerald-600 bg-emerald-100",
    blue: "text-blue-600 bg-blue-100",
    purple: "text-purple-600 bg-purple-100",
    rose: "text-rose-600 bg-rose-100",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border border-border/50 hover:border-border hover:shadow-md transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <p className="text-2xl font-bold tracking-tight">{value}</p>
              )}
              {trend && <p className="text-xs text-emerald-600 font-medium">{trend}</p>}
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const { signOut } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVendors: 0,
    pendingVerification: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeBookings: 0,
    totalReviews: 0,
    avgRating: 0,
  });
  const [pendingVendors, setPendingVendors] = useState<any[]>([]);
  const [allVendors, setAllVendors] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [vendorPerformance, setVendorPerformance] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [vendorsRes, bookingsRes, reviewsRes] = await Promise.all([
        supabase.from("vendors").select("*"),
        supabase
          .from("bookings")
          .select("*, vendor:vendors(business_name), couple:profiles(full_name)")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("reviews")
          .select("*, vendor:vendors(business_name), couple:profiles(full_name)")
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      if (vendorsRes.data) {
        const vendors = vendorsRes.data;
        setAllVendors(vendors);
        setPendingVendors(vendors.filter(v => !v.verified));
        setVendorPerformance(
          vendors.filter(v => v.verified)
            .map(v => ({
              id: v.id,
              name: v.business_name,
              category: v.category,
              rating: v.average_rating || 0,
              reviews: v.total_reviews || 0,
              bookings: v.total_bookings || 0,
            }))
            .sort((a, b) => b.bookings - a.bookings)
            .slice(0, 10)
        );
        setStats(prev => ({
          ...prev,
          totalVendors: vendors.length,
          pendingVerification: vendors.filter(v => !v.verified).length,
        }));
      }

      if (bookingsRes.data) {
        const bookings = bookingsRes.data;
        setRecentBookings(bookings);
        const revenue = bookings.filter(b => b.status === "completed").reduce((s, b) => s + Number(b.total_amount), 0);
        const activeBookings = bookings.filter(b => ["confirmed", "pending"].includes(b.status)).length;
        setStats(prev => ({ ...prev, totalBookings: bookings.length, totalRevenue: revenue, activeBookings }));
      }

      if (reviewsRes.data) {
        const reviews = reviewsRes.data;
        setRecentReviews(reviews);
        const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
        setStats(prev => ({ ...prev, totalReviews: reviews.length, avgRating: Number(avgRating.toFixed(1)) }));
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyVendor = async (vendorId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("vendors")
      .update({ verified: true, verification_date: new Date().toISOString(), verified_by: user?.id })
      .eq("id", vendorId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Vendor verified ✓", description: "Vendor has been approved and notified." });
      loadDashboardData();
    }
  };

  const handleRejectVendor = async (vendorId: string) => {
    const { error } = await supabase.from("vendors").update({ is_active: false }).eq("id", vendorId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Vendor rejected", description: "Vendor application has been declined." });
      loadDashboardData();
    }
  };

  const filteredVendors = allVendors.filter(v =>
    (filterCategory === "all" || v.category === filterCategory) &&
    (searchTerm === "" || v.business_name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Admin-specific top bar */}
      <div className="sticky top-0 z-40 bg-background border-b border-border/50 shadow-[var(--shadow-xs)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Shield className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">Admin Console</h1>
              <p className="text-[10px] text-muted-foreground leading-none">Karlo Shaadi Platform</p>
            </div>
            <Badge variant="outline" className="border-amber-500/40 text-amber-700 bg-amber-50 text-[10px]">
              Admin
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => window.location.href = '/'}>
              ← View Site
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground"
              onClick={async () => { await signOut(); window.location.href = '/'; }}
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Platform Overview</h2>
              <p className="text-muted-foreground text-sm mt-0.5">
                {format(new Date(), "EEEE, MMMM d, yyyy")} · Real-time data
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={loadDashboardData} className="gap-2">
              <Activity className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Vendors" value={stats.totalVendors} icon={Users} color="blue" loading={loading} />
          <StatCard
            title="Pending Approval"
            value={stats.pendingVerification}
            icon={Shield}
            color="amber"
            loading={loading}
            trend={stats.pendingVerification > 0 ? `${stats.pendingVerification} need review` : undefined}
          />
          <StatCard title="Total Bookings" value={stats.totalBookings} icon={TrendingUp} color="green" loading={loading} />
          <StatCard title="Platform Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} icon={IndianRupee} color="purple" loading={loading} />
          <StatCard title="Active Bookings" value={stats.activeBookings} icon={Calendar} color="primary" loading={loading} />
          <StatCard title="Total Reviews" value={stats.totalReviews} icon={MessageSquare} color="rose" loading={loading} />
          <StatCard
            title="Avg Rating"
            value={`${stats.avgRating} ★`}
            icon={Star}
            color="amber"
            loading={loading}
          />
          <StatCard
            title="Verified Vendors"
            value={stats.totalVendors - stats.pendingVerification}
            icon={CheckCircle}
            color="green"
            loading={loading}
          />
        </div>

        {/* Quick Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                </div>
                Recent Bookings
              </CardTitle>
              <CardDescription className="text-xs">Latest booking activity across platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg">
                    <div className="space-y-1">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))
              ) : recentBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No bookings yet</p>
              ) : (
                recentBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{booking.vendor?.business_name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{booking.couple?.full_name || "—"} · {format(new Date(booking.created_at), "MMM d")}</p>
                    </div>
                    <Badge
                      className="text-[10px]"
                      variant={
                        booking.status === "confirmed" ? "default" :
                          booking.status === "pending" ? "secondary" :
                            booking.status === "completed" ? "outline" : "destructive"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Star className="h-3.5 w-3.5 text-yellow-600" />
                </div>
                Recent Reviews
              </CardTitle>
              <CardDescription className="text-xs">Latest vendor feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-2.5 rounded-lg space-y-1">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))
              ) : recentReviews.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No reviews yet</p>
              ) : (
                recentReviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{review.vendor?.business_name || "—"}</p>
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs font-bold">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{review.comment}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      by {review.couple?.full_name || "—"} · {format(new Date(review.created_at), "MMM d")}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="verification" className="space-y-6">
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="inline-flex h-10 items-center gap-1 p-1 min-w-max">
              <TabsTrigger value="verification" className="text-xs px-3">
                Verification
                {stats.pendingVerification > 0 && (
                  <span className="ml-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {stats.pendingVerification}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="vendors" className="text-xs px-3">Vendors</TabsTrigger>
              <TabsTrigger value="performance" className="text-xs px-3">Performance</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs px-3">Analytics</TabsTrigger>
              <TabsTrigger value="testing" className="text-xs px-3">Payments</TabsTrigger>
              <TabsTrigger value="stories" className="text-xs px-3">Stories</TabsTrigger>
              <TabsTrigger value="moderation" className="text-xs px-3">Moderation</TabsTrigger>
              <TabsTrigger value="seva" className="text-xs px-3">Shaadi Seva</TabsTrigger>
              <TabsTrigger value="subscriptions" className="text-xs px-3">Subscriptions</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="testing">
            <PaymentTestingPanel />
          </TabsContent>

          <TabsContent value="verification">
            <VendorVerificationPanel
              pendingVendors={pendingVendors}
              onUpdate={loadDashboardData}
            />
          </TabsContent>

          <TabsContent value="vendors">
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-base">All Vendors</CardTitle>
                <CardDescription className="text-xs">Complete vendor directory — {allVendors.length} total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search vendors by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-9 text-sm"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full sm:w-[180px] h-9 text-sm">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="photography">Photography</SelectItem>
                      <SelectItem value="catering">Catering</SelectItem>
                      <SelectItem value="venues">Venues</SelectItem>
                      <SelectItem value="decoration">Decoration</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="mehendi">Mehendi</SelectItem>
                      <SelectItem value="makeup">Makeup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="overflow-x-auto rounded-lg border border-border/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="text-xs">Business</TableHead>
                        <TableHead className="text-xs">Category</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs">Rating</TableHead>
                        <TableHead className="text-xs">Bookings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVendors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                            No vendors found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredVendors.map((vendor) => (
                          <TableRow key={vendor.id} className="hover:bg-muted/20">
                            <TableCell className="font-medium text-sm">{vendor.business_name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-[10px] capitalize">{vendor.category}</Badge>
                            </TableCell>
                            <TableCell>
                              {vendor.verified ? (
                                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">✓ Verified</Badge>
                              ) : (
                                <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">Pending</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm">{(vendor.average_rating || 0).toFixed(1)} ★</TableCell>
                            <TableCell className="text-sm">{vendor.total_bookings || 0}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Top Performing Vendors
                </CardTitle>
                <CardDescription className="text-xs">Ranked by total bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-lg border border-border/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="text-xs w-12">Rank</TableHead>
                        <TableHead className="text-xs">Business</TableHead>
                        <TableHead className="text-xs">Category</TableHead>
                        <TableHead className="text-xs">Rating</TableHead>
                        <TableHead className="text-xs">Reviews</TableHead>
                        <TableHead className="text-xs">Bookings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendorPerformance.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                            No verified vendors yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        vendorPerformance.map((vendor, index) => (
                          <TableRow key={vendor.id} className="hover:bg-muted/20">
                            <TableCell>
                              <span className={`font-bold text-sm ${index < 3 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                                #{index + 1}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium text-sm">{vendor.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-[10px] capitalize">{vendor.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                {vendor.rating.toFixed(1)}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{vendor.reviews}</TableCell>
                            <TableCell>
                              <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">{vendor.bookings}</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stories">
            <StoryModerationTab />
          </TabsContent>

          <TabsContent value="moderation">
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  Content Moderation
                </CardTitle>
                <CardDescription className="text-xs">Review and moderate platform content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="p-4 rounded-lg border space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    ))
                  ) : recentReviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No reviews to moderate</p>
                  ) : (
                    recentReviews.map((review) => (
                      <div key={review.id} className="p-4 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-sm">{review.vendor?.business_name || "—"}</p>
                            <p className="text-xs text-muted-foreground">
                              by {review.couple?.full_name || "—"} · {format(new Date(review.created_at), "PPP")}
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                            <span className="font-bold text-sm">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-foreground/80 mb-3">{review.comment}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                            <Eye className="h-3 w-3" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-rose-600 border-rose-200 hover:bg-rose-50">
                            <Flag className="h-3 w-3" />
                            Flag
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seva">
            <ShaadiSevaAdminTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
