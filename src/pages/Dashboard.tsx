import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, Search, MessageSquare, LogOut, User, Palette, Trophy, ListChecks, PiggyBank, Gift, Settings, Users, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WeddingPlanningProgress } from "@/components/WeddingPlanningProgress";
import { AchievementBadges } from "@/components/AchievementBadges";
import { DashboardMusicSection } from "@/components/DashboardMusicSection";
import { ReferralWidget } from "@/components/ReferralWidget";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import heroPlanning from "@/assets/hero-dashboard-planning.jpg";
import weddingCouple from "@/assets/wedding-couple-romantic.jpg";
import { useAuthContext } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const mobileQuickActions = [
  { icon: Search, label: "Search", route: "/search", emoji: "🔍" },
  { icon: Calendar, label: "Bookings", route: "/bookings", emoji: "📅" },
  { icon: Heart, label: "Favorites", route: "/favorites", emoji: "❤️" },
  { icon: MessageSquare, label: "Messages", route: "/messages", emoji: "💬" },
  { icon: PiggyBank, label: "Budget", route: "/budget", emoji: "💰" },
  { icon: ListChecks, label: "Checklist", route: "/checklist", emoji: "✅" },
];

const allQuickActions = [
  { icon: Search, label: "Search", route: "/search", emoji: "🔍" },
  { icon: Calendar, label: "Bookings", route: "/bookings", emoji: "📅" },
  { icon: Heart, label: "Favorites", route: "/favorites", emoji: "❤️" },
  { icon: MessageSquare, label: "Messages", route: "/messages", emoji: "💬" },
  { icon: Palette, label: "Moodboards", route: "/moodboards", emoji: "🎨" },
  { icon: Trophy, label: "Achievements", route: "/achievements", emoji: "🏆" },
  { icon: ListChecks, label: "Checklist", route: "/checklist", emoji: "✅" },
  { icon: PiggyBank, label: "Budget", route: "/budget", emoji: "💰" },
  { icon: Gift, label: "Refer", route: "/referrals", emoji: "🎁" },
  { icon: Users, label: "Guests", route: "/guest-list", emoji: "👥" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user, isAdmin, isVendor, loading: authLoading, signOut } = useAuthContext();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    if (isVendor && !isAdmin) {
      // Allow vendors to view couple dashboard if they explicitly switched
      const activeView = localStorage.getItem("ks-active-view");
      if (activeView !== "couple") {
        navigate("/vendor/dashboard"); return;
      }
    }

    const loadProfile = async () => {
      try {
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setProfile(profileData);
        
        // Fallback: if no role yet, check if they have a vendor profile
        if (!isVendor && !isAdmin) {
          const { data: vendorData } = await supabase.from("vendors").select("id").eq("user_id", user.id).maybeSingle();
          if (vendorData) {
            navigate("/vendor/dashboard");
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user, authLoading, isAdmin, isVendor, navigate]);

  const handleLogout = async () => {
    await signOut();
    toast({ title: "Logged out", description: "You've been successfully logged out." });
    navigate("/");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-14 border-b bg-background/95" />
        <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
          {/* Hero skeleton */}
          <Skeleton className="w-full h-40 rounded-2xl" />
          {/* Quick actions grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          {/* Content blocks */}
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  const daysUntilWedding = (() => {
    if (!profile?.wedding_date) return null;
    const d = new Date(profile.wedding_date);
    if (isNaN(d.getTime())) return null;
    return Math.max(0, Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  })();

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
              <Settings className="h-5 w-5 text-muted-foreground" />
            </button>
          ) : undefined
        }
      />

      <main className={isMobile ? "px-4 py-4 pb-24 space-y-5" : "pt-20 pb-16"}>
        <div className={isMobile ? "" : "container mx-auto px-4 md:px-6 space-y-8"}>

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

          {/* Immersive Wedding Countdown */}
          <motion.div
            className="relative overflow-hidden rounded-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <img
              src={profile?.wedding_date ? heroPlanning : weddingCouple}
              alt="Wedding"
              className="w-full h-56 md:h-72 object-cover"
              style={{ filter: 'contrast(1.05) saturate(1.1) brightness(0.85)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
              {profile?.wedding_date ? (
                <>
                  <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1">Your Wedding</p>
                  <p className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                    {daysUntilWedding !== null ? `${daysUntilWedding} Days` : "Set Date"}
                  </p>
                  <p className="text-white/50 text-sm mt-1">
                    {(() => { const d = new Date(profile.wedding_date); return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }); })()}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1">Welcome to</p>
                  <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Karlo Shaadi</p>
                  <p className="text-white/50 text-sm mt-1">Your dream wedding, simplified</p>
                </>
              )}
            </div>
          </motion.div>

          {/* FIX 6: Mobile Quick Actions — 2x3 grid + More button */}
          {isMobile ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="grid grid-cols-3 gap-3">
                {mobileQuickActions.map((action, i) => (
                  <motion.button
                    key={action.route}
                    onClick={() => navigate(action.route)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-card shadow-[var(--shadow-sm)] active:scale-95 transition-transform"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.04 }}
                  >
                    <span className="text-xl">{action.emoji}</span>
                    <span className="text-[11px] font-medium text-muted-foreground">{action.label}</span>
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => navigate("/tools")}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-muted/30 text-sm font-medium text-muted-foreground active:scale-[0.98] transition-transform"
              >
                <MoreHorizontal className="h-4 w-4" />
                More Tools
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
              {allQuickActions.map((action, i) => (
                <motion.div
                  key={action.route}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.03 }}
                  onClick={() => navigate(action.route)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all cursor-pointer"
                >
                  <span className="text-2xl">{action.emoji}</span>
                  <span className="text-xs font-medium text-muted-foreground">{action.label}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Profile Completion */}
          {profilePercent < 100 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => navigate("/profile")}
              className="p-4 rounded-2xl bg-card shadow-[var(--shadow-sm)] cursor-pointer hover:shadow-[var(--shadow-md)] transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">Complete Your Profile</p>
                <span className="text-xs text-muted-foreground">{profilePercent}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" style={{ width: `${profilePercent}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {!profile?.wedding_date && "Add wedding date • "}{!profile?.budget_range && "Set budget • "}{!profile?.city && "Add city"}
              </p>
            </motion.div>
          )}

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-card shadow-[var(--shadow-sm)] p-5">
              {user && <WeddingPlanningProgress userId={user.id} weddingDate={profile?.wedding_date} />}
            </div>
            <div className="space-y-5">
              <div className="rounded-2xl bg-card shadow-[var(--shadow-sm)] p-5">
                {user && <ReferralWidget userId={user.id} />}
              </div>
              <div className="rounded-2xl bg-card shadow-[var(--shadow-sm)] p-5">
                {user && <AchievementBadges userId={user.id} compact />}
              </div>
            </div>
          </div>

          {/* Music Section */}
          {user && (
            <div className="rounded-2xl bg-card shadow-[var(--shadow-sm)] p-5">
              <DashboardMusicSection userId={user.id} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;