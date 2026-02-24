import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, Search, MessageSquare, LogOut, User, Palette, Trophy, ListChecks, PiggyBank, Music, Gift, Settings, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WeddingPlanningProgress } from "@/components/WeddingPlanningProgress";
import { AchievementBadges } from "@/components/AchievementBadges";
import { DashboardMusicSection } from "@/components/DashboardMusicSection";
import { ReferralWidget } from "@/components/ReferralWidget";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if user is a vendor - redirect to vendor dashboard
      const { data: vendorData } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (vendorData) {
        navigate("/vendor/dashboard");
        return;
      }

      setUser(user);

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60">
      <BhindiHeader />
      
      <main className="pt-16 sm:pt-24 pb-8 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-12 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-1 text-foreground">
                  Welcome, {profile?.full_name?.split(' ')[0] || "there"}! 👋
                </h1>
                <p className="text-muted-foreground text-sm sm:text-lg">
                  Let's plan your dream wedding
                </p>
              </div>
              {/* Desktop action buttons */}
              <div className="hidden sm:flex gap-2">
                <Button variant="outline" onClick={() => navigate("/profile")} className="border-accent/30 hover:border-accent/50">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button variant="outline" onClick={() => navigate("/settings")} className="border-accent/30 hover:border-accent/50">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" onClick={handleLogout} className="border-accent/30 hover:border-accent/50">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
              {/* Mobile icon-only action row */}
              <div className="flex sm:hidden gap-2">
                <Button variant="outline" size="icon" onClick={() => navigate("/profile")} className="h-9 w-9 border-accent/30">
                  <User className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => navigate("/settings")} className="h-9 w-9 border-accent/30">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleLogout} className="h-9 w-9 border-accent/30">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {profile?.wedding_date && (
              <Card className="bg-gradient-to-r from-accent/10 via-rose-100/50 to-amber-100/50 border-2 border-accent/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Your wedding date</p>
                      <p className="text-2xl font-bold text-foreground">
                        {new Date(profile.wedding_date).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-4 mb-6 sm:mb-12 animate-fade-up">
            <Card className="bg-white/80 border border-accent/20 hover:border-accent/40 hover:shadow-lg transition-all cursor-pointer active:scale-95" onClick={() => navigate("/search")}>
              <CardHeader className="p-3 sm:p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center mb-1 sm:mb-2">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <CardTitle className="text-[11px] sm:text-sm leading-tight">Search</CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 border border-accent/20 hover:border-accent/40 hover:shadow-lg transition-all cursor-pointer active:scale-95" onClick={() => navigate("/bookings")}>
              <CardHeader className="p-3 sm:p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent/20 to-amber-200/50 flex items-center justify-center mb-1 sm:mb-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <CardTitle className="text-[11px] sm:text-sm leading-tight">Bookings</CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 border border-accent/20 hover:border-accent/40 hover:shadow-lg transition-all cursor-pointer active:scale-95" onClick={() => navigate("/favorites")}>
              <CardHeader className="p-3 sm:p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-rose-200/50 to-pink-200/50 flex items-center justify-center mb-1 sm:mb-2">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-rose-500" />
                </div>
                <CardTitle className="text-[11px] sm:text-sm leading-tight">Favorites</CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 border border-accent/20 hover:border-accent/40 hover:shadow-lg transition-all cursor-pointer active:scale-95" onClick={() => navigate("/messages")}>
              <CardHeader className="p-3 sm:p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent/20 to-blue-200/50 flex items-center justify-center mb-1 sm:mb-2">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <CardTitle className="text-[11px] sm:text-sm leading-tight">Messages</CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 border border-accent/20 hover:border-accent/40 hover:shadow-lg transition-all cursor-pointer active:scale-95" onClick={() => navigate("/moodboards")}>
              <CardHeader className="p-3 sm:p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent/20 to-purple-200/50 flex items-center justify-center mb-1 sm:mb-2">
                  <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <CardTitle className="text-[11px] sm:text-sm leading-tight">Moodboards</CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 border border-accent/20 hover:border-accent/40 hover:shadow-lg transition-all cursor-pointer active:scale-95" onClick={() => navigate("/achievements")}>
              <CardHeader className="p-3 sm:p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent/30 to-yellow-200/50 flex items-center justify-center mb-1 sm:mb-2">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <CardTitle className="text-[11px] sm:text-sm leading-tight">Awards</CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 border border-accent/20 hover:border-accent/40 hover:shadow-lg transition-all cursor-pointer active:scale-95" onClick={() => navigate("/checklist")}>
              <CardHeader className="p-3 sm:p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-200/50 to-teal-200/50 flex items-center justify-center mb-1 sm:mb-2">
                  <ListChecks className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                </div>
                <CardTitle className="text-[11px] sm:text-sm leading-tight">Checklist</CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 border border-accent/20 hover:border-accent/40 hover:shadow-lg transition-all cursor-pointer active:scale-95" onClick={() => navigate("/budget")}>
              <CardHeader className="p-3 sm:p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent/30 to-amber-200/50 flex items-center justify-center mb-1 sm:mb-2">
                  <PiggyBank className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <CardTitle className="text-[11px] sm:text-sm leading-tight">Budget</CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 border border-accent/20 hover:border-accent/40 hover:shadow-lg transition-all cursor-pointer active:scale-95" onClick={() => navigate("/referrals")}>
              <CardHeader className="p-3 sm:p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent/20 to-emerald-200/50 flex items-center justify-center mb-1 sm:mb-2">
                  <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <CardTitle className="text-[11px] sm:text-sm leading-tight">Refer</CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 border border-accent/20 hover:border-accent/40 hover:shadow-lg transition-all cursor-pointer active:scale-95" onClick={() => navigate("/guest-list")}>
              <CardHeader className="p-3 sm:p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent/20 to-rose-200/50 flex items-center justify-center mb-1 sm:mb-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <CardTitle className="text-[11px] sm:text-sm leading-tight">Guests</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Wedding Planning Progress & Profile */}
          <div className="grid lg:grid-cols-2 gap-6 animate-fade-up">
            {/* Wedding Planning Progress Tracker */}
            {user && (
              <WeddingPlanningProgress 
                userId={user.id} 
                weddingDate={profile?.wedding_date}
              />
            )}

            <div className="space-y-6">
              {/* Referral Widget */}
              {user && <ReferralWidget userId={user.id} />}

              {/* Achievement Badges (Compact) */}
              {user && <AchievementBadges userId={user.id} compact />}

              <Card className="bg-white/90 border-2 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-foreground">Complete Your Profile</CardTitle>
                  <CardDescription>Help us personalize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Wedding Date</span>
                    <Badge variant={profile?.wedding_date ? "default" : "secondary"} className={profile?.wedding_date ? "bg-accent text-accent-foreground" : ""}>
                      {profile?.wedding_date ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Budget Range</span>
                    <Badge variant={profile?.budget_range ? "default" : "secondary"} className={profile?.budget_range ? "bg-accent text-accent-foreground" : ""}>
                      {profile?.budget_range ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">City/Location</span>
                    <Badge variant={profile?.city ? "default" : "secondary"} className={profile?.city ? "bg-accent text-accent-foreground" : ""}>
                      {profile?.city ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                  <Button 
                    className="w-full mt-4 border-accent/30 hover:border-accent/50" 
                    variant="outline"
                    onClick={() => navigate("/profile")}
                  >
                    Complete Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* My Music Section */}
          <div className="mt-6 animate-fade-up">
            {user && <DashboardMusicSection userId={user.id} />}
          </div>
        </div>
      </main>

      <BhindiFooter />
    </div>
  );
};

export default Dashboard;
