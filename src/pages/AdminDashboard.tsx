import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Users, CheckCircle, XCircle, TrendingUp, IndianRupee, BarChart3, MessageSquare, Star, Calendar, Eye, Flag, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { format } from "date-fns";
import { StoryModerationTab } from "@/components/admin/StoryModerationTab";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { PaymentTestingPanel } from "@/components/admin/PaymentTestingPanel";
import { VendorVerificationPanel } from "@/components/admin/VendorVerificationPanel";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
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
  const [flaggedReviews, setFlaggedReviews] = useState<any[]>([]);
  const [vendorPerformance, setVendorPerformance] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const isAdmin = roles?.some(r => r.role === "admin");
      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      await loadDashboardData();
    } catch (error) {
      console.error("Error:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    // Fetch all data
    const [vendorsRes, bookingsRes, reviewsRes] = await Promise.all([
      supabase.from("vendors").select("*"),
      supabase.from("bookings").select("*, vendor:vendors(business_name), couple:profiles(full_name)").order("created_at", { ascending: false }).limit(10),
      supabase.from("reviews").select("*, vendor:vendors(business_name), couple:profiles(full_name)").order("created_at", { ascending: false }).limit(10),
    ]);

    if (vendorsRes.data) {
      const vendors = vendorsRes.data;
      setAllVendors(vendors);
      setPendingVendors(vendors.filter(v => !v.verified));
      
      // Calculate vendor performance
      const performance = vendors
        .filter(v => v.verified)
        .map(v => ({
          id: v.id,
          name: v.business_name,
          category: v.category,
          rating: v.average_rating || 0,
          reviews: v.total_reviews || 0,
          bookings: v.total_bookings || 0,
          revenue: 0, // Will be calculated from bookings
        }))
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 10);
      
      setVendorPerformance(performance);
    }

    if (bookingsRes.data) {
      const bookings = bookingsRes.data;
      setRecentBookings(bookings);
      
      const revenue = bookings
        .filter(b => b.status === "completed")
        .reduce((sum, b) => sum + Number(b.total_amount), 0);
      
      const activeBookings = bookings.filter(b => 
        b.status === "confirmed" || b.status === "pending"
      ).length;
      
      setStats(prev => ({
        ...prev,
        totalBookings: bookings.length,
        totalRevenue: revenue,
        activeBookings,
      }));
    }

    if (reviewsRes.data) {
      const reviews = reviewsRes.data;
      setRecentReviews(reviews);
      
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
      
      setStats(prev => ({
        ...prev,
        totalReviews: reviews.length,
        avgRating: Number(avgRating.toFixed(1)),
      }));
    }

    if (vendorsRes.data) {
      setStats(prev => ({
        ...prev,
        totalVendors: vendorsRes.data.length,
        pendingVerification: vendorsRes.data.filter(v => !v.verified).length,
      }));
    }
  };

  const handleVerifyVendor = async (vendorId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("vendors")
      .update({
        verified: true,
        verification_date: new Date().toISOString(),
        verified_by: user?.id,
      })
      .eq("id", vendorId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Vendor verified successfully",
      });
      loadDashboardData();
    }
  };

  const handleRejectVendor = async (vendorId: string) => {
    const { error } = await supabase
      .from("vendors")
      .update({ is_active: false })
      .eq("id", vendorId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Vendor rejected",
      });
      loadDashboardData();
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BhindiHeader />
      
      <main className="flex-1 bg-gradient-to-br from-background via-background/95 to-primary/5 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage platform operations and vendors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Vendors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalVendors}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Pending Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.pendingVerification}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Total Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalBookings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Active Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{stats.activeBookings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Total Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalReviews}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Avg Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-500">{stats.avgRating} ⭐</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Bookings
                </CardTitle>
                <CardDescription>Latest booking activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{booking.vendor?.business_name}</p>
                        <p className="text-sm text-muted-foreground">{booking.couple?.full_name}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          booking.status === "confirmed" ? "default" :
                          booking.status === "pending" ? "secondary" :
                          booking.status === "completed" ? "outline" : "destructive"
                        }>
                          {booking.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(booking.created_at), "MMM dd")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Recent Reviews
                </CardTitle>
                <CardDescription>Latest vendor reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentReviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">{review.vendor?.business_name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="font-bold">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        by {review.couple?.full_name} • {format(new Date(review.created_at), "MMM dd")}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="verification" className="space-y-6">
            <TabsList>
              <TabsTrigger value="verification">Vendor Verification</TabsTrigger>
              <TabsTrigger value="vendors">All Vendors</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="testing">Payment Testing</TabsTrigger>
              <TabsTrigger value="stories">Wedding Stories</TabsTrigger>
              <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
            </TabsList>

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
              <Card>
                <CardHeader>
                  <CardTitle>All Vendors</CardTitle>
                  <CardDescription>Complete vendor directory</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Search vendors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                        <SelectItem value="catering">Catering</SelectItem>
                        <SelectItem value="venues">Venues</SelectItem>
                        <SelectItem value="decoration">Decoration</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Bookings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allVendors
                        .filter(v => 
                          (filterCategory === "all" || v.category === filterCategory) &&
                          (searchTerm === "" || v.business_name.toLowerCase().includes(searchTerm.toLowerCase()))
                        )
                        .map((vendor) => (
                        <TableRow key={vendor.id}>
                          <TableCell className="font-medium">{vendor.business_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{vendor.category}</Badge>
                          </TableCell>
                          <TableCell>
                            {vendor.verified ? (
                              <Badge className="bg-green-500">Verified</Badge>
                            ) : (
                              <Badge variant="secondary">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell>{vendor.average_rating || 0} ⭐</TableCell>
                          <TableCell>{vendor.total_bookings || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Vendor Performance
                  </CardTitle>
                  <CardDescription>Top performing vendors by bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Reviews</TableHead>
                        <TableHead>Bookings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendorPerformance.map((vendor, index) => (
                        <TableRow key={vendor.id}>
                          <TableCell className="font-bold">#{index + 1}</TableCell>
                          <TableCell className="font-medium">{vendor.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{vendor.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              {vendor.rating.toFixed(1)}
                            </div>
                          </TableCell>
                          <TableCell>{vendor.reviews}</TableCell>
                          <TableCell>
                            <Badge>{vendor.bookings}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stories">
              <StoryModerationTab />
            </TabsContent>

            <TabsContent value="moderation">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="h-5 w-5" />
                    Content Moderation
                  </CardTitle>
                  <CardDescription>Review flagged content and moderate reviews</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Recent Reviews for Moderation</h3>
                      <div className="space-y-3">
                        {recentReviews.map((review) => (
                          <div key={review.id} className="p-4 rounded-lg border">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">{review.vendor?.business_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  by {review.couple?.full_name} • {format(new Date(review.created_at), "PPP")}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                <span className="font-bold">{review.rating}</span>
                              </div>
                            </div>
                            <p className="text-sm mb-3">{review.comment}</p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                              <Button size="sm" variant="outline">
                                <Flag className="h-4 w-4 mr-1" />
                                Flag
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <BhindiFooter />
    </div>
  );
}
