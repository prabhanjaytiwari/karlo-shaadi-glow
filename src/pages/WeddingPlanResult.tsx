import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { PremiumBackground, PoweredByBadge } from "@/components/ui/premium-background";
import { PremiumCard, PremiumBadge } from "@/components/ui/premium-card";
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Share2,
  Download,
  Bookmark,
  CheckCircle2,
  Clock,
  Sparkles,
  Heart,
  MessageCircle,
  ChevronRight,
  Loader2,
  PartyPopper,
  ExternalLink,
} from "lucide-react";


import { WhatsAppStatusShare } from "@/components/WhatsAppStatusShare";

interface PlanData {
  planId: string;
  coupleNames: string;
  weddingDate: string;
  city: string;
  totalBudget: number;
  guestCount: number;
  weddingStyle: string;
  budgetBreakdown: Array<{
    category: string;
    percentage: number;
    amount: number;
    priority: string;
  }>;
  timeline: Array<{
    monthsBefore: number;
    title: string;
    tasks: string[];
  }>;
  vendorRecommendations?: Array<{
    category: string;
    vendorId?: string;
    vendorName: string;
    reason: string;
    estimatedCost: number;
  }>;
  tips: string[];
  ceremonies: string[];
  shareableMessage: string;
}

export default function WeddingPlanResult() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId) return;

      try {
        const { data, error } = await supabase
          .from("wedding_plans")
          .select("*")
          .eq("plan_id", planId)
          .single();

        if (error) throw error;

        setPlan(data.plan_output as unknown as PlanData);

        // Increment view count
        await supabase.rpc("increment_plan_views", { p_plan_id: planId });
      } catch (error) {
        console.error("Error fetching plan:", error);
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
    const message = `💒 Check out our wedding plan created with Karlo Shaadi!\n\n💕 ${plan.coupleNames}\n📅 ${plan.weddingDate}\n📍 ${plan.city}\n💰 Budget: ${formatCurrency(plan.totalBudget)}\n👥 ${plan.guestCount} Guests\n\n✨ View full plan: ${shareUrl}\n\n🎯 Create your own AI wedding plan: https://karloshaadi.com/plan`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSave = async () => {
    if (!user) {
      toast.info("Please sign in to save your plan");
      navigate("/auth?redirect=/plan/" + planId);
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("wedding_plans")
        .update({
          user_id: user.id,
          saved_at: new Date().toISOString(),
        })
        .eq("plan_id", planId);

      if (error) throw error;
      toast.success("Plan saved to your account!");
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error("Failed to save plan");
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}K`;
    }
    return `₹${amount}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "low":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground";
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
          <p className="text-muted-foreground mb-6">This wedding plan may have been removed or the link is incorrect.</p>
          <Button onClick={() => navigate("/")} className="bg-gradient-to-r from-accent to-primary">
            Go Home
          </Button>
        </PremiumCard>
      </PremiumBackground>
    );
  }

  const ogImageUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-og-image?planId=${plan?.planId}`;

  return (
    <>
      <SEO
        title={`${plan.coupleNames} Wedding Plan | Karlo Shaadi`}
        description={`Complete wedding plan for ${plan.coupleNames} in ${plan.city}. Budget: ${formatCurrency(plan.totalBudget)}, Guests: ${plan.guestCount}`}
        url={`/plan/${plan.planId}`}
        image={ogImageUrl}
      />
      <BhindiHeader />

      <PremiumBackground variant="wedding" pattern animated className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative py-12 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container relative z-10"
          >
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <PremiumBadge variant="gold" icon={<Sparkles className="h-3 w-3" />} className="mb-6">
                  Your Wedding Plan is Ready!
                </PremiumBadge>
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                  {plan.coupleNames}
                </span>
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground mb-8">
                <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span>{plan.weddingDate}</span>
                </div>
                <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span>{plan.city}</span>
                </div>
                <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50">
                  <Users className="h-4 w-4 text-accent" />
                  <span>{plan.guestCount} Guests</span>
                </div>
                <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50">
                  <IndianRupee className="h-4 w-4 text-accent" />
                  <span>{formatCurrency(plan.totalBudget)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  onClick={handleShare}
                  size="lg"
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="h-5 w-5" />
                  Share on WhatsApp
                </Button>
                <Button
                  onClick={handleSave}
                  variant="outline"
                  size="lg"
                  className="gap-2 border-accent/30 hover:bg-accent/10"
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                  {user ? "Save Plan" : "Sign in to Save"}
                </Button>
                <WhatsAppStatusShare
                  title={`${plan.coupleNames} Wedding Plan`}
                  subtitle={`${plan.city} • ${plan.weddingDate}`}
                  stats={[
                    { label: "Budget", value: formatCurrency(plan.totalBudget) },
                    { label: "Guests", value: `${plan.guestCount}` },
                  ]}
                  shareUrl={`https://karloshaadi.com/plan/${plan.planId}`}
                />
              </div>
              
              <div className="mt-6">
                <PoweredByBadge />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Main Content */}
        <section className="container py-8 pb-20">
          <Tabs defaultValue="budget" className="w-full">
            <TabsList className="w-full max-w-lg mx-auto grid grid-cols-3 mb-8">
              <TabsTrigger value="budget" className="gap-2">
                <IndianRupee className="h-4 w-4" />
                Budget
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-2">
                <Clock className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="tips" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Tips
              </TabsTrigger>
            </TabsList>

            {/* Budget Tab */}
            <TabsContent value="budget">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-6 lg:grid-cols-3"
              >
                {/* Summary Card */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IndianRupee className="h-5 w-5" />
                      Budget Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-6 bg-primary/5 rounded-xl">
                      <div className="text-4xl font-bold text-primary">
                        {formatCurrency(plan.totalBudget)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Total Wedding Budget
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">High Priority</span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(
                            plan.budgetBreakdown
                              .filter((b) => b.priority === "high")
                              .reduce((sum, b) => sum + b.amount, 0)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Medium Priority</span>
                        <span className="font-medium text-yellow-600">
                          {formatCurrency(
                            plan.budgetBreakdown
                              .filter((b) => b.priority === "medium")
                              .reduce((sum, b) => sum + b.amount, 0)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Low Priority</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(
                            plan.budgetBreakdown
                              .filter((b) => b.priority === "low")
                              .reduce((sum, b) => sum + b.amount, 0)
                          )}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Ceremonies Included</h4>
                      <div className="flex flex-wrap gap-2">
                        {plan.ceremonies?.map((ceremony) => (
                          <Badge key={ceremony} variant="secondary">
                            {ceremony}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Budget Breakdown */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Budget Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {plan.budgetBreakdown.map((item, index) => (
                        <motion.div
                          key={item.category}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{item.category}</span>
                              <Badge
                                variant="outline"
                                className={getPriorityColor(item.priority)}
                              >
                                {item.priority}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <span className="font-bold">
                                {formatCurrency(item.amount)}
                              </span>
                              <span className="text-muted-foreground text-sm ml-2">
                                ({item.percentage}%)
                              </span>
                            </div>
                          </div>
                          <Progress
                            value={item.percentage}
                            className="h-2"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Your Planning Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                      <div className="space-y-8">
                        {plan.timeline.map((phase, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-12"
                          >
                            {/* Timeline dot */}
                            <div className="absolute left-2 top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                            </div>

                            <div className="bg-card border rounded-xl p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <Badge variant="secondary">
                                  {phase.monthsBefore === 0
                                    ? "Wedding Week"
                                    : `${phase.monthsBefore} months before`}
                                </Badge>
                                <h3 className="font-semibold text-lg">{phase.title}</h3>
                              </div>

                              <ul className="space-y-2">
                                {phase.tasks.map((task, taskIndex) => (
                                  <li
                                    key={taskIndex}
                                    className="flex items-start gap-2 text-muted-foreground"
                                  >
                                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                                    <span>{task}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        ))}

                        {/* Final celebration */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                          className="relative pl-12"
                        >
                          <div className="absolute left-2 top-0 w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center">
                            <PartyPopper className="h-3 w-3 text-white" />
                          </div>
                          <div className="bg-gradient-to-r from-primary/10 to-pink-500/10 border border-primary/20 rounded-xl p-6 text-center">
                            <h3 className="text-xl font-bold mb-2">🎉 The Big Day!</h3>
                            <p className="text-muted-foreground">
                              Time to celebrate the union of {plan.coupleNames}!
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Tips Tab */}
            <TabsContent value="tips">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-6 md:grid-cols-2"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      AI Tips for Your Wedding
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {plan.tips.map((tip, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg"
                        >
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-primary text-sm font-bold">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{tip}</p>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-500" />
                      Ready to Start Planning?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground">
                      This AI-generated plan is just the beginning! Explore verified vendors 
                      on Karlo Shaadi to bring your dream wedding to life.
                    </p>

                    <div className="space-y-3">
                      <Button
                        className="w-full gap-2"
                        onClick={() => navigate(`/search?city=${encodeURIComponent(plan.city)}`)}
                      >
                        Explore Vendors in {plan.city}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={handleShare}
                      >
                        <Share2 className="h-4 w-4" />
                        Share with Family
                      </Button>
                    </div>

                    <Separator />

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Want to create another plan?
                      </p>
                      <Button
                        variant="ghost"
                        onClick={() => navigate("/plan-wizard")}
                        className="gap-2"
                      >
                        <Sparkles className="h-4 w-4" />
                        Start New Plan
                      </Button>
                    </div>
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
