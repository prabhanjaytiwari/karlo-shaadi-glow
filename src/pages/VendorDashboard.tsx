import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Package, Images, Star, MessageSquare, TrendingUp, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";

export default function VendorDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<any>(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    revenue: 0,
    avgRating: 0,
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
      const revenue = bookings
        .filter(b => b.status === "completed")
        .reduce((sum, b) => sum + Number(b.total_amount), 0);

      setStats({
        totalBookings: bookings.length,
        pendingBookings: pending,
        revenue,
        avgRating: vendor?.average_rating || 0,
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BhindiHeader />
      
      <main className="flex-1 bg-gradient-to-br from-background via-background/95 to-primary/5 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">{vendor?.business_name}</h1>
              <p className="text-muted-foreground">Vendor Dashboard</p>
            </div>
            <Button variant="outline" onClick={handleLogout} size="icon" className="rounded-full">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalBookings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.pendingBookings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{stats.revenue.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center">
                  {vendor?.average_rating || 0}
                  <Star className="ml-2 h-6 w-6 fill-primary text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Manage your bookings and requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No bookings yet. Share your profile to get started!</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Your Services</CardTitle>
                  <CardDescription>Add and manage your service packages</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>Add New Service</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                  <CardDescription>Showcase your best work</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>Upload Images</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability">
              <Card>
                <CardHeader>
                  <CardTitle>Availability Calendar</CardTitle>
                  <CardDescription>Manage your booking calendar</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Calendar coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                  <CardDescription>View and respond to reviews</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No reviews yet</p>
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
