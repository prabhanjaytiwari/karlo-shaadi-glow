import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, Heart, Wallet, Share2, Copy, CheckCircle2, 
  UserPlus, Utensils, Gift, Crown, Loader2 
} from "lucide-react";
import { SEO } from "@/components/SEO";

interface FamilyMember {
  side: "bride" | "groom";
  guests: any[];
  totalGuests: number;
  confirmed: number;
}

export default function FamilyDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [guests, setGuests] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [shareCode, setShareCode] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUser(user);

      const [profileResult, guestsResult, budgetsResult] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("guest_list").select("*").eq("user_id", user.id).order("name"),
        supabase.from("budget_allocations").select("*").eq("user_id", user.id),
      ]);

      setProfile(profileResult.data);
      setGuests(guestsResult.data || []);
      setBudgets(budgetsResult.data || []);
      setShareCode(profileResult.data?.referral_code || "");
    } catch (error) {
      console.error("Error loading family data:", error);
    } finally {
      setLoading(false);
    }
  };

  const brideGuests = guests.filter(g => g.category === "bride" || g.relation?.toLowerCase().includes("bride"));
  const groomGuests = guests.filter(g => g.category === "groom" || g.relation?.toLowerCase().includes("groom"));
  const otherGuests = guests.filter(g => 
    !brideGuests.includes(g) && !groomGuests.includes(g)
  );

  const totalConfirmed = guests.filter(g => g.rsvp_status === "confirmed").length;
  const totalDeclined = guests.filter(g => g.rsvp_status === "declined").length;
  const totalPending = guests.filter(g => !g.rsvp_status || g.rsvp_status === "pending").length;
  const totalPlusOnes = guests.reduce((sum, g) => sum + (g.plus_ones || 0), 0);
  const grandTotal = guests.length + totalPlusOnes;

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.total_budget || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent_amount || 0), 0);
  const budgetUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const vegCount = guests.filter(g => g.food_preference === "veg").length;
  const nonVegCount = guests.filter(g => g.food_preference === "non-veg").length;
  const veganCount = guests.filter(g => g.food_preference === "vegan").length;

  const copyShareLink = () => {
    const link = `${window.location.origin}/guest-list?invite=${shareCode}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Share link copied!", description: "Send this to family members to collaborate" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isMobile ? 'pb-20' : ''}`}>
      <SEO title="Family Dashboard — Karlo Shaadi" description="Collaborate with both families on guest lists, budgets, and wedding planning" />
      
      <MobilePageHeader title="Family Dashboard" />

      <main className={isMobile ? 'px-4 py-4 space-y-4' : 'max-w-6xl mx-auto px-4 pt-24 pb-12 space-y-6'}>
        {/* Share Banner */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground">Share with Family</h3>
                <p className="text-sm text-muted-foreground">
                  Invite both families to view and collaborate on planning
                </p>
              </div>
              <Button onClick={copyShareLink} variant="outline" className="gap-2 shrink-0">
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-3`}>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary/70" />
                <div>
                  <p className="text-2xl font-bold">{grandTotal}</p>
                  <p className="text-xs text-muted-foreground">Total Guests</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-green-500/70" />
                <div>
                  <p className="text-2xl font-bold">{totalConfirmed}</p>
                  <p className="text-xs text-muted-foreground">Confirmed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Wallet className="h-8 w-8 text-accent/70" />
                <div>
                  <p className="text-2xl font-bold">₹{(totalBudget / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-muted-foreground">Total Budget</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Utensils className="h-8 w-8 text-amber-500/70" />
                <div>
                  <p className="text-2xl font-bold">{totalPending}</p>
                  <p className="text-xs text-muted-foreground">RSVP Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="guests" className="space-y-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="guests" className="gap-1.5">
              <Users className="h-4 w-4" />
              <span className={isMobile ? 'text-xs' : ''}>Guests</span>
            </TabsTrigger>
            <TabsTrigger value="budget" className="gap-1.5">
              <Wallet className="h-4 w-4" />
              <span className={isMobile ? 'text-xs' : ''}>Budget</span>
            </TabsTrigger>
            <TabsTrigger value="food" className="gap-1.5">
              <Utensils className="h-4 w-4" />
              <span className={isMobile ? 'text-xs' : ''}>Food</span>
            </TabsTrigger>
          </TabsList>

          {/* Guests Tab - Side-by-Side Family View */}
          <TabsContent value="guests" className="space-y-4">
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
              {/* Bride's Side */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Crown className="h-4 w-4 text-pink-500" />
                    Bride's Side
                  </CardTitle>
                  <CardDescription>
                    {brideGuests.length} guests • {brideGuests.filter(g => g.rsvp_status === "confirmed").length} confirmed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                  {brideGuests.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No guests tagged as bride's side yet
                    </p>
                  ) : (
                    brideGuests.map(guest => (
                      <div key={guest.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{guest.name}</p>
                          <p className="text-xs text-muted-foreground">{guest.relation || "Guest"}</p>
                        </div>
                        <Badge variant={
                          guest.rsvp_status === "confirmed" ? "default" :
                          guest.rsvp_status === "declined" ? "destructive" :
                          "secondary"
                        } className="text-xs">
                          {guest.rsvp_status || "Pending"}
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Groom's Side */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Crown className="h-4 w-4 text-blue-500" />
                    Groom's Side
                  </CardTitle>
                  <CardDescription>
                    {groomGuests.length} guests • {groomGuests.filter(g => g.rsvp_status === "confirmed").length} confirmed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                  {groomGuests.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No guests tagged as groom's side yet
                    </p>
                  ) : (
                    groomGuests.map(guest => (
                      <div key={guest.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{guest.name}</p>
                          <p className="text-xs text-muted-foreground">{guest.relation || "Guest"}</p>
                        </div>
                        <Badge variant={
                          guest.rsvp_status === "confirmed" ? "default" :
                          guest.rsvp_status === "declined" ? "destructive" :
                          "secondary"
                        } className="text-xs">
                          {guest.rsvp_status || "Pending"}
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {otherGuests.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Gift className="h-4 w-4 text-accent" />
                    Mutual / Other Guests
                  </CardTitle>
                  <CardDescription>{otherGuests.length} guests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                  {otherGuests.map(guest => (
                    <div key={guest.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{guest.name}</p>
                        <p className="text-xs text-muted-foreground">{guest.relation || "Guest"}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {guest.rsvp_status || "Pending"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Button onClick={() => navigate("/guest-list")} variant="outline" className="w-full gap-2">
              <UserPlus className="h-4 w-4" />
              Manage Full Guest List
            </Button>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Budget Overview</CardTitle>
                <CardDescription>
                  ₹{totalSpent.toLocaleString("en-IN")} spent of ₹{totalBudget.toLocaleString("en-IN")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={budgetUsed} className="h-3" />
                <p className="text-sm text-muted-foreground">{budgetUsed}% used</p>

                <div className="space-y-3 mt-4">
                  {budgets.map(budget => {
                    const used = Number(budget.total_budget) > 0 
                      ? Math.round((Number(budget.spent_amount) / Number(budget.total_budget)) * 100) 
                      : 0;
                    return (
                      <div key={budget.id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium capitalize">{budget.category}</span>
                          <span className="text-muted-foreground">
                            ₹{Number(budget.spent_amount).toLocaleString("en-IN")} / ₹{Number(budget.total_budget).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <Progress value={used} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>

                {budgets.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No budget categories set up yet
                  </p>
                )}
              </CardContent>
            </Card>

            <Button onClick={() => navigate("/budget-tracker")} variant="outline" className="w-full gap-2">
              <Wallet className="h-4 w-4" />
              Manage Budget
            </Button>
          </TabsContent>

          {/* Food Preferences Tab */}
          <TabsContent value="food" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Food Preference Summary</CardTitle>
                <CardDescription>Based on guest list data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                    <p className="text-2xl font-bold text-green-700">{vegCount}</p>
                    <p className="text-xs text-green-600 mt-1">🥬 Vegetarian</p>
                  </div>
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                    <p className="text-2xl font-bold text-red-700">{nonVegCount}</p>
                    <p className="text-xs text-red-600 mt-1">🍗 Non-Veg</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <p className="text-2xl font-bold text-emerald-700">{veganCount}</p>
                    <p className="text-xs text-emerald-600 mt-1">🌱 Vegan</p>
                  </div>
                </div>

                {guests.filter(g => g.dietary_notes).length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold">Special Dietary Notes:</p>
                    {guests.filter(g => g.dietary_notes).map(g => (
                      <div key={g.id} className="text-sm p-2 bg-muted/50 rounded-lg">
                        <span className="font-medium">{g.name}:</span>{" "}
                        <span className="text-muted-foreground">{g.dietary_notes}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
