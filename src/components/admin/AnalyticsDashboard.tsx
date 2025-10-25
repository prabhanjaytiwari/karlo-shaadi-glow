import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, Users, DollarSign, ShoppingCart, 
  Star, MessageCircle, Calendar, Crown 
} from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface AnalyticsData {
  totalRevenue: number;
  totalBookings: number;
  totalUsers: number;
  totalVendors: number;
  activeSubscriptions: number;
  avgBookingValue: number;
  conversionRate: number;
  topVendors: Array<{
    id: string;
    business_name: string;
    total_bookings: number;
    revenue: number;
    rating: number;
  }>;
  recentEvents: Array<{
    event_type: string;
    count: number;
    date: string;
  }>;
}

export function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));

      // Get total revenue from payments
      const { data: payments } = await supabase
        .from("payments")
        .select("amount")
        .eq("status", "paid")
        .gte("paid_at", cutoffDate.toISOString());

      const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      // Get subscription revenue
      const { data: subscriptions } = await supabase
        .from("subscriptions")
        .select("amount")
        .eq("status", "active")
        .gte("activated_at", cutoffDate.toISOString());

      const subscriptionRevenue = subscriptions?.reduce((sum, s) => sum + Number(s.amount || 0), 0) || 0;

      // Get vendor subscription revenue
      const { data: vendorSubs } = await supabase
        .from("vendor_subscriptions")
        .select("amount")
        .eq("status", "active")
        .gte("started_at", cutoffDate.toISOString());

      const vendorRevenue = vendorSubs?.reduce((sum, v) => sum + Number(v.amount || 0), 0) || 0;

      // Get booking stats
      const { data: bookings, count: bookingCount } = await supabase
        .from("bookings")
        .select("total_amount", { count: "exact" })
        .gte("created_at", cutoffDate.toISOString());

      const avgBookingValue = bookings && bookings.length > 0
        ? bookings.reduce((sum, b) => sum + Number(b.total_amount), 0) / bookings.length
        : 0;

      // Get user count
      const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Get vendor count
      const { count: vendorCount } = await supabase
        .from("vendors")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      // Get active subscriptions
      const { count: activeSubCount } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      // Get top performing vendors
      const { data: topVendors } = await supabase
        .from("vendors")
        .select(`
          id,
          business_name,
          total_bookings,
          average_rating,
          bookings!inner(total_amount)
        `)
        .eq("is_active", true)
        .order("total_bookings", { ascending: false })
        .limit(5);

      const topVendorsData = topVendors?.map(v => ({
        id: v.id,
        business_name: v.business_name,
        total_bookings: v.total_bookings || 0,
        revenue: 0, // Would need to calculate from bookings
        rating: Number(v.average_rating || 0)
      })) || [];

      // Get recent event counts
      const { data: events } = await supabase
        .from("analytics_events")
        .select("event_type, created_at")
        .gte("created_at", cutoffDate.toISOString())
        .order("created_at", { ascending: false });

      const eventCounts = events?.reduce((acc: any, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        return acc;
      }, {});

      const recentEvents = Object.entries(eventCounts || {})
        .map(([event_type, count]) => ({
          event_type,
          count: count as number,
          date: new Date().toISOString()
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setData({
        totalRevenue: totalRevenue + subscriptionRevenue + vendorRevenue,
        totalBookings: bookingCount || 0,
        totalUsers: userCount || 0,
        totalVendors: vendorCount || 0,
        activeSubscriptions: activeSubCount || 0,
        avgBookingValue,
        conversionRate: userCount ? ((bookingCount || 0) / userCount) * 100 : 0,
        topVendors: topVendorsData,
        recentEvents
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${data.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Total Bookings",
      value: data.totalBookings.toLocaleString(),
      icon: ShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Active Users",
      value: data.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Active Vendors",
      value: data.totalVendors.toLocaleString(),
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      title: "AI Premium Users",
      value: data.activeSubscriptions.toLocaleString(),
      icon: Crown,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Avg Booking Value",
      value: `₹${Math.round(data.avgBookingValue).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Platform performance and insights</p>
        </div>
        <Tabs value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
          <TabsList>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="90d">90 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <Badge variant="secondary">{timeRange}</Badge>
              </div>
              <div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Vendors */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Vendors</CardTitle>
            <CardDescription>By total bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topVendors.map((vendor, i) => (
                <div key={vendor.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{i + 1}</Badge>
                    <div>
                      <p className="font-semibold">{vendor.business_name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{vendor.total_bookings} bookings</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          {vendor.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
            <CardDescription>Most common events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.recentEvents.map((event, i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                  <span className="text-sm font-medium capitalize">
                    {event.event_type.replace(/_/g, ' ')}
                  </span>
                  <Badge variant="outline">{event.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
