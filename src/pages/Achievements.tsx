import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import { AchievementBadges } from "@/components/AchievementBadges";
import { SEO } from "@/components/SEO";
import { Trophy } from "lucide-react";

const Achievements = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    setLoading(false);
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
      <SEO 
        title="Your Achievements - Karlo Shaadi"
        description="Track your wedding planning progress and earn badges! Complete milestones to unlock achievements and earn reward points."
      />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Your Achievements
            </h1>
            <p className="text-muted-foreground">
              Complete milestones in your wedding planning journey to earn badges and points
            </p>
          </div>

          {user && <AchievementBadges userId={user.id} />}
        </div>
      </main>

      
    </div>
  );
};

export default Achievements;
