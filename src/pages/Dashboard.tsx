import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, Search, MessageSquare, LogOut, User, Palette, Trophy, ListChecks, PiggyBank, Gift, Settings, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WeddingPlanningProgress } from "@/components/WeddingPlanningProgress";
import { AchievementBadges } from "@/components/AchievementBadges";
import { DashboardMusicSection } from "@/components/DashboardMusicSection";
import { ReferralWidget } from "@/components/ReferralWidget";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import heroPlanning from "@/assets/hero-dashboard-planning.jpg";

const quickActions = [
  { icon: Search, label: "Search", route: "/search", gradient: "from-accent/20 to-primary/10" },
  { icon: Calendar, label: "Bookings", route: "/bookings", gradient: "from-accent/20 to-amber-200/50" },
  { icon: Heart, label: "Favorites", route: "/favorites", gradient: "from-rose-200/50 to-pink-200/50" },
  { icon: MessageSquare, label: "Messages", route: "/messages", gradient: "from-accent/20 to-blue-200/50" },
  { icon: Palette, label: "Moodboards", route: "/moodboards", gradient: "from-accent/20 to-purple-200/50" },
  { icon: Trophy, label: "Achievements", route: "/achievements", gradient: "from-accent/30 to-yellow-200/50" },
  { icon: ListChecks, label: "Checklist", route: "/checklist", gradient: "from-emerald-200/50 to-teal-200/50" },
  { icon: PiggyBank, label: "Budget", route: "/budget", gradient: "from-accent/30 to-amber-200/50" },
  { icon: Gift, label: "Refer", route: "/referrals", gradient: "from-accent/20 to-emerald-200/50" },
  { icon: Users, label: "Guests", route: "/guest-list", gradient: "from-accent/20 to-rose-200/50" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      const { data: vendorData } = await supabase.from("vendors").select("id").eq("user_id", user.id).maybeSingle();
      if (vendorData) { navigate("/vendor/dashboard"); return; }
      setUser(user);
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out", description: "You've been successfully logged out." });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const daysUntilWedding = profile?.wedding_date
    ? Math.max(0, Math.ceil((new Date(profile.wedding_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const profileCompletion = [profile?.wedding_date, profile?.budget_range, profile?.city].filter(Boolean).length;
  const profilePercent = Math.round((profileCompletion / 3) * 100);

  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader 
        title="Dashboard" 
        showBack={false} 
        rightActions={
          isMobile ? (
            <button onClick={() => navigate("/settings")} className="p-2 rounded-full active:scale-95 transition-transform">
              <Settings className="h-5 w-5 text-foreground" />
            </button>
          ) : undefined
        }
      />

      <main className={isMobile ? "px-4 py-4 space-y-5" : "pt-24 pb-16"}>
        <div className={isMobile ? "" : "container mx-auto px-6 space-y-8"}>
          
          {/* Desktop Header */}
          {!isMobile && (
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Welcome back, {profile?.full_name || "there"}!</h1>
                <p className="text-muted-foreground mt-1">Let's make your wedding planning journey amazing</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate("/profile")} className="rounded-full"><User className="h-4 w-4 mr-2" />Profile</Button>
                <Button variant="outline" onClick={() => navigate("/settings")} className="rounded-full"><Settings className="h-4 w-4 mr-2" />Settings</Button>
                <Button variant="outline" onClick={handleLogout} className="rounded-full"><LogOut className="h-4 w-4 mr-2" />Logout</Button>
              </div>
            </div>
          )}

          {/* Mobile Greeting */}
          {isMobile && (
            <div>
              <h1 className="text-xl font-semibold text-foreground">Hey, {profile?.full_name?.split(' ')[0] || "there"} 👋</h1>
              <p className="text-sm text-muted-foreground">Your wedding planner</p>
            </div>
          )}

          {/* Wedding Countdown Banner */}
          {profile?.wedding_date && (
            <motion.div 
              className="relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <img src={heroPlanning} alt="Wedding planning" className="w-full h-32 md:h-40 object-cover" style={{ filter: 'contrast(1.03) saturate(1.08)' }} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
              <div className="absolute inset-0 flex items-center px-5 md:px-8">
                <div className="flex items-center gap-4 w-full">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-xs font-medium uppercase tracking-wide">Your wedding</p>
                    <p className="text-white text-2xl md:text-3xl font-bold">
                      {daysUntilWedding !== null ? `${daysUntilWedding} days to go` : "Set your date"}
                    </p>
                    <p className="text-white/70 text-sm">
                      {new Date(profile.wedding_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Actions - Horizontal scroll on mobile */}
          {isMobile ? (
            <motion.div 
              className="overflow-x-auto scrollbar-hide -mx-4 px-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex gap-3" style={{ width: 'max-content' }}>
                {quickActions.map((action, i) => (
                  <motion.button
                    key={action.route}
                    onClick={() => navigate(action.route)}
                    className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.04 }}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center ring-1 ring-accent/20`}>
                      <action.icon className="h-6 w-6 text-accent" />
                    </div>
                    <span className="text-[11px] font-medium text-foreground">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
              {quickActions.map((action) => (
                <Card key={action.route} className="rounded-2xl border border-border/50 hover:border-accent/30 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate(action.route)}>
                  <CardHeader className="p-4 items-center text-center">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-1.5`}>
                      <action.icon className="h-5 w-5 text-accent" />
                    </div>
                    <CardTitle className="text-xs font-medium">{action.label}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          {/* Profile Completion Progress */}
          {profilePercent < 100 && (
            <Card className="rounded-2xl border border-border/50" onClick={() => navigate("/profile")}>
              <CardContent className="p-4 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">Complete Your Profile</p>
                  <span className="text-xs text-muted-foreground">{profilePercent}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all" style={{ width: `${profilePercent}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {!profile?.wedding_date && "Add wedding date • "}{!profile?.budget_range && "Set budget • "}{!profile?.city && "Add city"}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-5">
            {user && <WeddingPlanningProgress userId={user.id} weddingDate={profile?.wedding_date} />}
            <div className="space-y-5">
              {user && <ReferralWidget userId={user.id} />}
              {user && <AchievementBadges userId={user.id} compact />}
            </div>
          </div>

          {/* Music Section */}
          {user && (
            <div>
              <DashboardMusicSection userId={user.id} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
