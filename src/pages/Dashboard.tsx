import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, Search, MessageSquare, LogOut, User, Palette, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WeddingPlanningProgress } from "@/components/WeddingPlanningProgress";
import { AchievementBadges } from "@/components/AchievementBadges";

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
    <div className="min-h-screen bg-background">
      <BhindiHeader />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Welcome Section */}
          <div className="mb-12 animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Welcome back, {profile?.full_name || "there"}! 👋
                </h1>
                <p className="text-muted-foreground text-lg">
                  Let's make your wedding planning journey amazing
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate("/profile")}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>

            {profile?.wedding_date && (
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-8 w-8 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Your wedding date</p>
                      <p className="text-2xl font-bold">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12 animate-fade-up">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/search")}>
              <CardHeader className="p-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-sm">Search Vendors</CardTitle>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/bookings")}>
              <CardHeader className="p-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-2">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-sm">My Bookings</CardTitle>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/favorites")}>
              <CardHeader className="p-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center mb-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                </div>
                <CardTitle className="text-sm">Favorites</CardTitle>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/messages")}>
              <CardHeader className="p-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                </div>
                <CardTitle className="text-sm">Messages</CardTitle>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/moodboards")}>
              <CardHeader className="p-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-2">
                  <Palette className="h-5 w-5 text-purple-500" />
                </div>
                <CardTitle className="text-sm">Moodboards</CardTitle>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/achievements")}>
              <CardHeader className="p-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
                <CardTitle className="text-sm">Achievements</CardTitle>
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
              {/* Achievement Badges (Compact) */}
              {user && <AchievementBadges userId={user.id} compact />}

              <Card>
                <CardHeader>
                  <CardTitle>Complete Your Profile</CardTitle>
                  <CardDescription>Help us personalize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Wedding Date</span>
                    <Badge variant={profile?.wedding_date ? "default" : "secondary"}>
                      {profile?.wedding_date ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Budget Range</span>
                    <Badge variant={profile?.budget_range ? "default" : "secondary"}>
                      {profile?.budget_range ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">City/Location</span>
                    <Badge variant={profile?.city ? "default" : "secondary"}>
                      {profile?.city ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => navigate("/profile")}
                  >
                    Complete Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <BhindiFooter />
    </div>
  );
};

export default Dashboard;
