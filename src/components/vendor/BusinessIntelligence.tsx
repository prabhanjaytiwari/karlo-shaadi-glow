import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import {
  TrendingUp, Target, Zap, AlertTriangle, CheckCircle2,
  Users, Star, Clock, Camera, FileText, MessageSquare
} from "lucide-react";

interface BusinessIntelligenceProps {
  vendorId: string;
  vendorName: string;
  vendorCategory?: string;
}

interface ProfileStrengthItem {
  label: string;
  icon: React.ReactNode;
  completed: boolean;
  weight: number;
}

const CHART_COLORS = ["hsl(var(--accent))", "hsl(var(--primary))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

export function BusinessIntelligence({ vendorId, vendorName, vendorCategory }: BusinessIntelligenceProps) {
  const [loading, setLoading] = useState(true);
  const [inquiryTrend, setInquiryTrend] = useState<any[]>([]);
  const [conversionData, setConversionData] = useState({ inquiries: 0, bookings: 0, rate: 0 });
  const [profileStrength, setProfileStrength] = useState<ProfileStrengthItem[]>([]);
  const [strengthScore, setStrengthScore] = useState(0);
  const [pricingComparison, setPricingComparison] = useState<any>(null);
  const [tips, setTips] = useState<string[]>([]);

  useEffect(() => {
    loadAllData();
  }, [vendorId]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadInquiryTrend(),
      loadConversionData(),
      loadProfileStrength(),
      loadPricingComparison(),
    ]);
    setLoading(false);
  };

  const loadInquiryTrend = async () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data } = await supabase
      .from("vendor_inquiries")
      .select("created_at")
      .eq("vendor_id", vendorId)
      .gte("created_at", sixMonthsAgo.toISOString());

    if (data) {
      const monthMap = new Map<string, number>();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        monthMap.set(months[d.getMonth()], 0);
      }

      data.forEach(inq => {
        const m = months[new Date(inq.created_at).getMonth()];
        monthMap.set(m, (monthMap.get(m) || 0) + 1);
      });

      setInquiryTrend(Array.from(monthMap.entries()).map(([month, count]) => ({ month, inquiries: count })));
    }
  };

  const loadConversionData = async () => {
    const [{ count: inquiryCount }, { count: bookingCount }] = await Promise.all([
      supabase.from("vendor_inquiries").select("*", { count: "exact", head: true }).eq("vendor_id", vendorId),
      supabase.from("bookings").select("*", { count: "exact", head: true }).eq("vendor_id", vendorId),
    ]);

    const inq = inquiryCount || 0;
    const bk = bookingCount || 0;
    const rate = inq > 0 ? Math.round((bk / inq) * 100) : 0;
    setConversionData({ inquiries: inq, bookings: bk, rate });
  };

  const loadProfileStrength = async () => {
    const [{ data: vendor }, { data: portfolio }, { data: services }, { data: reviews }] = await Promise.all([
      supabase.from("vendors").select("*").eq("id", vendorId).single(),
      supabase.from("vendor_portfolio").select("id").eq("vendor_id", vendorId),
      supabase.from("vendor_services").select("id").eq("vendor_id", vendorId),
      supabase.from("reviews").select("id").eq("vendor_id", vendorId),
    ]);

    const items: ProfileStrengthItem[] = [
      { label: "Business description added", icon: <FileText className="h-4 w-4" />, completed: !!vendor?.description && vendor.description.length > 50, weight: 15 },
      { label: "Logo uploaded", icon: <Camera className="h-4 w-4" />, completed: !!vendor?.logo_url, weight: 10 },
      { label: "5+ portfolio images", icon: <Camera className="h-4 w-4" />, completed: (portfolio?.length || 0) >= 5, weight: 20 },
      { label: "At least 1 service listed", icon: <FileText className="h-4 w-4" />, completed: (services?.length || 0) >= 1, weight: 20 },
      { label: "Phone number added", icon: <MessageSquare className="h-4 w-4" />, completed: !!vendor?.phone, weight: 10 },
      { label: "WhatsApp number added", icon: <MessageSquare className="h-4 w-4" />, completed: !!vendor?.whatsapp_number, weight: 10 },
      { label: "At least 1 review", icon: <Star className="h-4 w-4" />, completed: (reviews?.length || 0) >= 1, weight: 15 },
    ];

    const score = items.reduce((acc, item) => acc + (item.completed ? item.weight : 0), 0);
    setProfileStrength(items);
    setStrengthScore(score);

    // Generate tips
    const newTips: string[] = [];
    if (!items[2].completed) newTips.push("Upload at least 5 portfolio images — vendors with 5+ photos get 2x more inquiries");
    if (!items[3].completed) newTips.push("List your services with pricing — couples filter by budget, so visible pricing = more leads");
    if (!items[0].completed) newTips.push("Write a detailed description (50+ words) — it boosts your search ranking");
    if (!items[1].completed) newTips.push("Add a professional logo — it builds instant trust with couples");
    if (conversionData.rate < 20 && conversionData.inquiries > 3) newTips.push("Your conversion rate is below 20% — try responding to inquiries within 1 hour");
    if (newTips.length === 0) newTips.push("Great job! Your profile is well-optimized. Keep collecting reviews to stay competitive 🌟");
    setTips(newTips);
  };

  const loadPricingComparison = async () => {
    if (!vendorCategory) return;

    const { data: myServices } = await supabase
      .from("vendor_services")
      .select("base_price")
      .eq("vendor_id", vendorId)
      .not("base_price", "is", null);

    const { data: allServices } = await supabase
      .from("vendor_services")
      .select("base_price, vendor_id")
      .not("base_price", "is", null);

    if (myServices && myServices.length > 0 && allServices && allServices.length > 0) {
      const myAvg = myServices.reduce((a, s) => a + Number(s.base_price), 0) / myServices.length;
      const allPrices = allServices.filter(s => s.vendor_id !== vendorId).map(s => Number(s.base_price));
      const categoryAvg = allPrices.length > 0 ? allPrices.reduce((a, b) => a + b, 0) / allPrices.length : myAvg;
      const diff = categoryAvg > 0 ? Math.round(((myAvg - categoryAvg) / categoryAvg) * 100) : 0;

      setPricingComparison({
        yourAvg: Math.round(myAvg),
        categoryAvg: Math.round(categoryAvg),
        diff,
        data: [
          { name: "Your Pricing", value: Math.round(myAvg) },
          { name: "Category Avg", value: Math.round(categoryAvg) },
        ],
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-32" />
          </Card>
        ))}
      </div>
    );
  }

  const funnelData = [
    { stage: "Inquiries", value: conversionData.inquiries, fill: "hsl(var(--accent))" },
    { stage: "Bookings", value: conversionData.bookings, fill: "hsl(var(--primary))" },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Strength */}
      <Card className="border-accent/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" />
              Profile Strength
            </CardTitle>
            <Badge variant={strengthScore >= 80 ? "default" : strengthScore >= 50 ? "secondary" : "destructive"}>
              {strengthScore}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={strengthScore} className="h-3 mb-4" />
          <div className="grid gap-2">
            {profileStrength.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                {item.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                )}
                <span className={item.completed ? "text-muted-foreground" : "font-medium"}>{item.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inquiry Trend */}
      <Card className="border-accent/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Monthly Inquiry Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {inquiryTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={inquiryTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="inquiries" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No inquiry data yet</p>
          )}
        </CardContent>
      </Card>

      {/* Conversion Funnel + Pricing side by side */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelData.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.stage}</span>
                    <span className="font-bold">{item.value}</span>
                  </div>
                  <div className="h-8 rounded-md overflow-hidden bg-muted">
                    <div
                      className="h-full rounded-md transition-all"
                      style={{
                        width: `${conversionData.inquiries > 0 ? (item.value / conversionData.inquiries) * 100 : 0}%`,
                        backgroundColor: item.fill,
                        minWidth: item.value > 0 ? "8%" : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="text-center mt-2">
                <span className="text-2xl font-bold">{conversionData.rate}%</span>
                <span className="text-sm text-muted-foreground ml-1">conversion rate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {pricingComparison && (
          <Card className="border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                Pricing Benchmark
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Your Avg Price</p>
                    <p className="text-xl font-bold">₹{pricingComparison.yourAvg.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Category Avg</p>
                    <p className="text-xl font-bold">₹{pricingComparison.categoryAvg.toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <div className="text-center">
                  <Badge variant={pricingComparison.diff > 0 ? "default" : pricingComparison.diff < -15 ? "destructive" : "secondary"}>
                    {pricingComparison.diff > 0 ? "+" : ""}{pricingComparison.diff}% vs category
                  </Badge>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={pricingComparison.data} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} stroke="hsl(var(--muted-foreground))" />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {pricingComparison.data.map((_: any, i: number) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Actionable Tips */}
      <Card className="border-accent/20 bg-accent/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            Actionable Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
