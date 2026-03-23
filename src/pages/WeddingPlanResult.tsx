import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { PremiumBackground, PoweredByBadge } from "@/components/ui/premium-background";
import { PremiumCard, PremiumBadge } from "@/components/ui/premium-card";
import { WhatsAppStatusShare } from "@/components/WhatsAppStatusShare";
import {
  Calendar, MapPin, Users, IndianRupee, Share2, Bookmark, CheckCircle2, Clock,
  Sparkles, Heart, MessageCircle, ChevronRight, Loader2, PartyPopper, ExternalLink,
  Search, Phone, Crown, ShieldCheck, Star, ArrowRight, Send,
} from "lucide-react";
import { cdn } from "@/lib/cdnAssets";

interface DayEvent {
  time: string;
  event: string;
  location?: string;
  notes?: string;
}

interface PlanData {
  planId: string;
  coupleNames: string;
  weddingDate: string;
  city: string;
  religion?: string;
  totalBudget: number;
  guestCount: number;
  brideSideGuests?: number;
  groomSideGuests?: number;
  weddingStyle: string;
  venueType?: string;
  foodType?: string;
  alcohol?: string;
  priorities?: string[];
  specialRequirements?: string[];
  budgetBreakdown: Array<{ category: string; percentage: number; amount: number; priority: string; details?: string }>;
  ceremonyBudgets?: Array<{ ceremony: string; budget: number; items: string[] }>;
  dayWiseSchedule?: Array<{ day: string; date?: string; events: DayEvent[] }>;
  timeline: Array<{ monthsBefore: number; title: string; tasks: string[] }>;
  vendorSuggestions?: Array<{ category: string; vendorName: string; vendorId?: string; estimatedCost: number; reason: string; searchLink?: string }>;
  vendorRecommendations?: Array<{ category: string; vendorName: string; vendorId?: string; estimatedCost: number; reason: string }>;
  tips: string[];
  ceremonies: string[];
  weddingManagerNote?: string;
  shareableMessage: string;
}

const managerPackages = [
  { name: "Day-of Coordination", price: "₹25,000", features: ["Event day management", "Vendor coordination", "Timeline management", "Emergency handling"], popular: false },
  { name: "Full Planning", price: "₹50,000", features: ["Complete vendor booking", "Budget management", "Design & decor planning", "Day-of coordination", "Guest management"], popular: true },
  { name: "Luxury Concierge", price: "₹1,00,000", features: ["Everything in Full Planning", "Destination coordination", "Celebrity vendor access", "Unlimited revisions", "Personal account manager", "Post-wedding support"], popular: false },
];

export default function WeddingPlanResult() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [managerInquiry, setManagerInquiry] = useState({ name: "", phone: "", message: "" });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId) return;
      try {
        const { data, error } = await supabase.from("wedding_plans").select("*").eq("plan_id", planId).single();
        if (error) throw error;
        setPlan(data.plan_output as unknown as PlanData);
        await supabase.rpc("increment_plan_views", { p_plan_id: planId });
      } catch (error) {
        toast.error("Plan not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId, navigate]);

  const handleShare = () => {
    if (!plan) return;
    const shareUrl = `https://karloshaadi.com/plan/${plan.planId}`;
    const message = `💒 Check out our wedding plan!\n\n💕 ${plan.coupleNames}\n📅 ${plan.weddingDate}\n📍 ${plan.city}\n💰 ${formatCurrency(plan.totalBudget)}\n👥 ${plan.guestCount} Guests\n\n✨ View: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleSave = async () => {
    if (!user) { toast.info("Sign in to save your plan"); navigate("/auth?redirect=/plan/" + planId); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from("wedding_plans").update({ user_id: user.id, saved_at: new Date().toISOString() }).eq("plan_id", planId);
      if (error) throw error;
      toast.success("Plan saved!");
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const handleManagerInquiry = async (packageName: string) => {
    if (!managerInquiry.name || !managerInquiry.phone) {
      toast.error("Please enter your name and phone number");
      return;
    }
    setSubmittingInquiry(true);
    try {
      const { error } = await supabase.from("contact_inquiries").insert({
        name: managerInquiry.name,
        phone: managerInquiry.phone,
        email: user?.email || "not-provided@karloshaadi.com",
        message: `Wedding Manager Inquiry - ${packageName}\n\nCouple: ${plan?.coupleNames}\nDate: ${plan?.weddingDate}\nCity: ${plan?.city}\nBudget: ${formatCurrency(plan?.totalBudget || 0)}\nGuests: ${plan?.guestCount}\nPlan ID: ${plan?.planId}\n\nMessage: ${managerInquiry.message || "Interested in wedding manager services"}`,
      });
      if (error) throw error;
      toast.success("Inquiry submitted! We'll call you within 2 hours.");
      setManagerInquiry({ name: "", phone: "", message: "" });
    } catch { toast.error("Failed to submit. Please try again."); } finally { setSubmittingInquiry(false); }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-accent/10 text-accent border-accent/20";
      case "low": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <PremiumBackground variant="wedding" pattern className="min-h-screen flex items-center justify-center">
        <PremiumCard variant="gold" glow className="p-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
            <p className="text-muted-foreground">Loading your wedding plan...</p>
          </div>
        </PremiumCard>
      </PremiumBackground>
    );
  }

  if (!plan) {
    return (
      <PremiumBackground variant="wedding" pattern className="min-h-screen flex items-center justify-center">
        <PremiumCard variant="maroon" className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Plan not found</h2>
          <p className="text-muted-foreground mb-6">This plan may have been removed.</p>
          <Button onClick={() => navigate("/")} className="bg-gradient-to-r from-accent to-primary">Go Home</Button>
        </PremiumCard>
      </PremiumBackground>
    );
  }

  const vendorList = plan.vendorSuggestions || plan.vendorRecommendations || [];
  const hasDaySchedule = plan.dayWiseSchedule && plan.dayWiseSchedule.length > 0;

  return (
    <>
      <SEO title={`${plan.coupleNames} Wedding Plan | Karlo Shaadi`} description={`Wedding plan for ${plan.coupleNames} in ${plan.city}. Budget: ${formatCurrency(plan.totalBudget)}`} url={`/plan/${plan.planId}`} />

      <PremiumBackground variant="wedding" pattern animated className={`min-h-screen ${isMobile ? "pt-2 pb-24" : "pt-20"}`}>
        {/* Hero */}
        <section className="relative py-6 md:py-10 overflow-hidden">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container relative z-10 px-4">
            <div className="text-center max-w-2xl mx-auto">
              <PremiumBadge variant="gold" icon={<Sparkles className="h-3 w-3" />} className="mb-4">Your Plan is Ready!</PremiumBadge>
              <h1 className="text-2xl md:text-4xl font-bold mb-3">
                <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">{plan.coupleNames}</span>
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-2 text-muted-foreground mb-4 text-sm">
                {[
                  { icon: Calendar, text: plan.weddingDate },
                  { icon: MapPin, text: plan.city },
                  { icon: Users, text: `${plan.guestCount} Guests` },
                  { icon: IndianRupee, text: formatCurrency(plan.totalBudget) },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-card/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-border/50">
                    <item.icon className="h-3.5 w-3.5 text-accent" />
                    <span className="text-xs">{item.text}</span>
                  </div>
                ))}
              </div>
              {plan.ceremonies && (
                <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                  {plan.ceremonies.map((c) => <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>)}
                </div>
              )}
              <div className="flex flex-wrap gap-2 justify-center">
                <Button onClick={handleShare} size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700">
                  <MessageCircle className="h-4 w-4" /> Share on WhatsApp
                </Button>
                <Button onClick={handleSave} variant="outline" size="sm" className="gap-1.5 border-accent/30" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bookmark className="h-4 w-4" />}
                  {user ? "Save" : "Sign in to Save"}
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Main Tabs */}
        <section className="container px-3 pb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`w-full ${isMobile ? "grid grid-cols-5 text-xs" : "max-w-2xl mx-auto grid grid-cols-5"} mb-6`}>
              <TabsTrigger value="overview" className="gap-1 text-xs"><Sparkles className="h-3 w-3" />{!isMobile && "Overview"}</TabsTrigger>
              <TabsTrigger value="budget" className="gap-1 text-xs"><IndianRupee className="h-3 w-3" />{!isMobile && "Budget"}</TabsTrigger>
              <TabsTrigger value="vendors" className="gap-1 text-xs"><Search className="h-3 w-3" />{!isMobile && "Vendors"}</TabsTrigger>
              <TabsTrigger value="schedule" className="gap-1 text-xs"><Clock className="h-3 w-3" />{!isMobile && "Schedule"}</TabsTrigger>
              <TabsTrigger value="manager" className="gap-1 text-xs"><Crown className="h-3 w-3" />{!isMobile && "Manager"}</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Total Budget", value: formatCurrency(plan.totalBudget), icon: IndianRupee },
                    { label: "Guests", value: `${plan.guestCount}`, icon: Users },
                    { label: "Ceremonies", value: `${plan.ceremonies?.length || 0}`, icon: PartyPopper },
                    { label: "Style", value: plan.weddingStyle, icon: Sparkles },
                  ].map((stat, i) => (
                    <Card key={i} className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <stat.icon className="h-4 w-4 text-accent" />
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                      </div>
                      <div className="font-bold text-sm capitalize">{stat.value}</div>
                    </Card>
                  ))}
                </div>

                {/* Guest Split */}
                {plan.brideSideGuests && plan.groomSideGuests && (
                  <Card className="p-4">
                    <CardTitle className="text-sm mb-3 flex items-center gap-2"><Users className="h-4 w-4" /> Guest Split</CardTitle>
                    <div className="flex gap-4">
                      <div className="flex-1 text-center p-3 rounded-xl bg-primary/5">
                        <div className="text-xs text-muted-foreground">👰 Bride's Side</div>
                        <div className="text-lg font-bold text-primary">{plan.brideSideGuests}</div>
                      </div>
                      <div className="flex-1 text-center p-3 rounded-xl bg-accent/5">
                        <div className="text-xs text-muted-foreground">🤵 Groom's Side</div>
                        <div className="text-lg font-bold text-accent">{plan.groomSideGuests}</div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Tips */}
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent" /> AI Tips for Your Wedding</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {plan.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 bg-muted/50 rounded-lg">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-primary text-xs font-bold">{i + 1}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
                  <CardContent className="p-4 text-center space-y-3">
                    <h3 className="font-bold text-sm">Ready to start booking?</h3>
                    <p className="text-xs text-muted-foreground">Browse verified vendors in {plan.city}</p>
                    <Button onClick={() => navigate(`/search?city=${encodeURIComponent(plan.city)}`)} className="gap-2 bg-gradient-to-r from-accent to-primary">
                      Explore Vendors <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Budget Tab */}
            <TabsContent value="budget">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Category-wise Breakdown</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {plan.budgetBreakdown.map((item, i) => (
                      <motion.div key={item.category} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">{item.category}</span>
                            <Badge variant="outline" className={`${getPriorityColor(item.priority)} text-[10px] px-1.5 py-0`}>{item.priority}</Badge>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold">{formatCurrency(item.amount)}</span>
                            <span className="text-[10px] text-muted-foreground ml-1">({item.percentage}%)</span>
                          </div>
                        </div>
                        <Progress value={item.percentage} className="h-1.5" />
                        {item.details && <p className="text-[10px] text-muted-foreground mt-0.5">{item.details}</p>}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Ceremony Budgets */}
                {plan.ceremonyBudgets && plan.ceremonyBudgets.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Ceremony-wise Budget</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      {plan.ceremonyBudgets.map((cb, i) => (
                        <div key={i} className="p-3 rounded-xl bg-muted/50 border border-border/50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-sm">{cb.ceremony}</span>
                            <Badge variant="secondary">{formatCurrency(cb.budget)}</Badge>
                          </div>
                          <div className="space-y-1">
                            {cb.items.map((item, j) => (
                              <div key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                <ChevronRight className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>

            {/* Vendors Tab */}
            <TabsContent value="vendors">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                {vendorList.length > 0 ? vendorList.map((v, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">{v.category}</h4>
                          <p className="text-xs text-muted-foreground">{v.vendorName}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">{formatCurrency(v.estimatedCost)}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{v.reason}</p>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 gap-1 text-xs h-8" onClick={() => navigate((v as any).searchLink || `/search?category=${encodeURIComponent(v.category)}&city=${encodeURIComponent(plan.city)}`)}>
                          <Search className="h-3 w-3" /> Find Vendors
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1 text-xs h-8" onClick={() => navigate(`/search?category=${encodeURIComponent(v.category)}&city=${encodeURIComponent(plan.city)}`)}>
                          <MessageCircle className="h-3 w-3" /> Enquire
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <Card className="p-6 text-center">
                    <Search className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">Explore verified vendors in {plan.city}</p>
                    <Button onClick={() => navigate(`/search?city=${encodeURIComponent(plan.city)}`)} className="gap-2">
                      Browse All Vendors <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Card>
                )}
              </motion.div>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Day-wise Schedule */}
                {hasDaySchedule && (
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Calendar className="h-4 w-4" /> Day-wise Event Schedule</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      {plan.dayWiseSchedule!.map((day, i) => (
                        <div key={i} className="border border-border/50 rounded-xl overflow-hidden">
                          <div className="bg-primary/5 px-4 py-2 border-b border-border/50">
                            <h4 className="font-semibold text-sm">{day.day}</h4>
                            {day.date && <p className="text-[10px] text-muted-foreground">{day.date}</p>}
                          </div>
                          <div className="p-3 space-y-2">
                            {day.events.map((evt, j) => (
                              <div key={j} className="flex gap-3 items-start">
                                <div className="text-xs font-mono text-accent font-semibold w-16 flex-shrink-0 pt-0.5">{evt.time}</div>
                                <div className="flex-1">
                                  <div className="text-xs font-medium">{evt.event}</div>
                                  {evt.location && <div className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin className="h-2.5 w-2.5" /> {evt.location}</div>}
                                  {evt.notes && <div className="text-[10px] text-muted-foreground italic mt-0.5">{evt.notes}</div>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Month-wise Timeline */}
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4" /> Planning Timeline</CardTitle></CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />
                      <div className="space-y-5">
                        {plan.timeline.map((phase, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="relative pl-9">
                            <div className="absolute left-1.5 top-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                              <CheckCircle2 className="h-2.5 w-2.5 text-primary-foreground" />
                            </div>
                            <div className="bg-card border rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="text-[10px]">{phase.monthsBefore === 0 ? "Wedding Week" : `${phase.monthsBefore}m before`}</Badge>
                                <h4 className="font-semibold text-xs">{phase.title}</h4>
                              </div>
                              <ul className="space-y-1">
                                {phase.tasks.map((task, j) => (
                                  <li key={j} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                    <ChevronRight className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                                    {task}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Wedding Manager Tab */}
            <TabsContent value="manager">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Hero Card */}
                <Card className="overflow-hidden">
                  <div className="relative h-40 md:h-52 overflow-hidden">
                    <img src={cdn.weddingManagerCta} alt="Karlo Shaadi Wedding Manager" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <PremiumBadge variant="gold" icon={<Crown className="h-3 w-3" />} className="mb-2">Premium Service</PremiumBadge>
                      <h3 className="text-lg font-bold text-foreground">Hire a Karlo Shaadi Wedding Manager</h3>
                      <p className="text-xs text-muted-foreground">Relax while our experts handle everything</p>
                    </div>
                  </div>
                </Card>

                {plan.weddingManagerNote && (
                  <Card className="bg-accent/5 border-accent/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">{plan.weddingManagerNote}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Packages */}
                <div className="space-y-3">
                  {managerPackages.map((pkg, i) => (
                    <Card key={i} className={cn("relative overflow-hidden", pkg.popular && "border-accent/50 shadow-md")}>
                      {pkg.popular && <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold px-3 py-0.5 rounded-bl-lg">MOST POPULAR</div>}
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-sm">{pkg.name}</h4>
                            <p className="text-lg font-bold text-primary">{pkg.price}</p>
                          </div>
                        </div>
                        <ul className="space-y-1.5 mb-3">
                          {pkg.features.map((f, j) => (
                            <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Inquiry Form */}
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Get a Callback</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Name</Label>
                        <Input placeholder="Your name" value={managerInquiry.name} onChange={(e) => setManagerInquiry({ ...managerInquiry, name: e.target.value })} className="mt-1 h-9 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Phone</Label>
                        <Input placeholder="Phone number" value={managerInquiry.phone} onChange={(e) => setManagerInquiry({ ...managerInquiry, phone: e.target.value })} className="mt-1 h-9 text-sm" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Message (optional)</Label>
                      <Textarea placeholder="Tell us about your wedding..." value={managerInquiry.message} onChange={(e) => setManagerInquiry({ ...managerInquiry, message: e.target.value })} className="mt-1 text-sm min-h-[60px]" />
                    </div>
                    <Button className="w-full gap-2 bg-gradient-to-r from-accent to-primary" onClick={() => handleManagerInquiry("General")} disabled={submittingInquiry}>
                      {submittingInquiry ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Submit Inquiry
                    </Button>
                    <p className="text-[10px] text-muted-foreground text-center">We'll call you within 2 hours • No spam</p>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </section>
      </PremiumBackground>
    </>
  );
}
