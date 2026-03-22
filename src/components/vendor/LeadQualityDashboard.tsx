import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Eye, MessageSquare, CalendarCheck, TrendingUp, Clock, Zap } from "lucide-react";

interface LeadQualityDashboardProps {
  vendorId: string;
  vendorUserId: string;
}

export function LeadQualityDashboard({ vendorId, vendorUserId }: LeadQualityDashboardProps) {
  const [stats, setStats] = useState({
    profileViews: 0,
    totalInquiries: 0,
    totalBookings: 0,
    completedBookings: 0,
    avgResponseHours: 0,
    conversionRate: 0,
    inquiryToBooking: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [vendorId]);

  const loadStats = async () => {
    try {
      const [viewsResult, inquiriesResult, bookingsResult, vendorResult] = await Promise.all([
        supabase
          .from("analytics_events")
          .select("id", { count: "exact", head: true })
          .eq("vendor_id", vendorId)
          .eq("event_type", "vendor_profile_viewed"),
        supabase
          .from("vendor_inquiries")
          .select("id", { count: "exact", head: true })
          .eq("vendor_id", vendorId),
        supabase
          .from("bookings")
          .select("status")
          .eq("vendor_id", vendorId),
        supabase
          .from("vendors")
          .select("avg_response_time_hours")
          .eq("id", vendorId)
          .single(),
      ]);

      const profileViews = viewsResult.count || 0;
      const totalInquiries = inquiriesResult.count || 0;
      const allBookings = bookingsResult.data || [];
      const totalBookings = allBookings.length;
      const completedBookings = allBookings.filter(b => b.status === "completed").length;
      const avgResponseHours = vendorResult.data?.avg_response_time_hours || 0;

      const conversionRate = profileViews > 0 
        ? Math.round((totalInquiries / profileViews) * 100) 
        : 0;
      const inquiryToBooking = totalInquiries > 0 
        ? Math.round((totalBookings / totalInquiries) * 100) 
        : 0;

      setStats({
        profileViews,
        totalInquiries,
        totalBookings,
        completedBookings,
        avgResponseHours: Math.round(avgResponseHours * 10) / 10,
        conversionRate,
        inquiryToBooking,
      });
    } catch (error) {
      console.error("Error loading lead quality stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading lead quality data...
        </CardContent>
      </Card>
    );
  }

  const funnel = [
    { 
      label: "Profile Views", 
      value: stats.profileViews, 
      icon: Eye, 
      color: "text-blue-600",
      bgColor: "bg-blue-500",
      percentage: 100 
    },
    { 
      label: "Inquiries Received", 
      value: stats.totalInquiries, 
      icon: MessageSquare, 
      color: "text-amber-600",
      bgColor: "bg-amber-500",
      percentage: stats.conversionRate 
    },
    { 
      label: "Bookings Made", 
      value: stats.totalBookings, 
      icon: CalendarCheck, 
      color: "text-green-600",
      bgColor: "bg-green-500",
      percentage: stats.inquiryToBooking 
    },
    { 
      label: "Completed", 
      value: stats.completedBookings, 
      icon: TrendingUp, 
      color: "text-primary",
      bgColor: "bg-primary",
      percentage: stats.totalBookings > 0 
        ? Math.round((stats.completedBookings / stats.totalBookings) * 100) 
        : 0 
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            Lead Quality Funnel
          </CardTitle>
          <CardDescription>
            Transparent breakdown: how visitors convert to bookings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {funnel.map((stage, i) => (
            <div key={stage.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${stage.bgColor}/10`}>
                    <stage.icon className={`h-4 w-4 ${stage.color}`} />
                  </div>
                  <span className="text-sm font-medium">{stage.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">{stage.value}</span>
                  {i > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                      {stage.percentage}% conversion
                    </span>
                  )}
                </div>
              </div>
              <Progress 
                value={i === 0 ? 100 : Math.max(stage.percentage, 2)} 
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Response Time Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center">
              <Clock className="h-7 w-7 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold">
                {stats.avgResponseHours > 0 
                  ? stats.avgResponseHours < 1 
                    ? `${Math.round(stats.avgResponseHours * 60)} min`
                    : `${stats.avgResponseHours} hrs`
                  : "N/A"
                }
              </p>
            </div>
            <div className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
              stats.avgResponseHours === 0 ? 'bg-muted text-muted-foreground' :
              stats.avgResponseHours <= 2 ? 'bg-green-100 text-green-700' :
              stats.avgResponseHours <= 6 ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {stats.avgResponseHours === 0 ? 'No data' :
               stats.avgResponseHours <= 2 ? '⚡ Fast Responder' :
               stats.avgResponseHours <= 6 ? '⏱ Average' :
               '🐢 Slow — Improve!'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      {stats.conversionRate < 5 && stats.profileViews > 10 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-6 text-sm">
            <p className="font-semibold text-amber-800 mb-1">💡 Low inquiry rate ({stats.conversionRate}%)</p>
            <p className="text-amber-700">
              Your profile gets views but few inquiries. Try adding more portfolio images, 
              video reels, and competitive pricing to convert browsers into leads.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
