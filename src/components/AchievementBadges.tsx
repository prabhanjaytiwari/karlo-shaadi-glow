import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Heart, 
  Calendar, 
  MessageCircle, 
  Palette,
  Sparkles,
  UserCheck,
  Compass,
  Clock,
  Users,
  CalendarCheck
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  requirement_type: string;
  requirement_value: number;
}

interface UserAchievement {
  id: string;
  achievement_id: string;
  earned_at: string;
}

interface AchievementBadgesProps {
  userId: string;
  compact?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  "sparkles": Sparkles,
  "user-check": UserCheck,
  "heart": Heart,
  "compass": Compass,
  "calendar-check": CalendarCheck,
  "trophy": Trophy,
  "star": Star,
  "palette": Palette,
  "message-circle": MessageCircle,
  "users": Users,
  "clock": Clock,
};

export const AchievementBadges = ({ userId, compact = false }: AchievementBadgesProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [userStats, setUserStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      // Fetch all achievements
      const { data: allAchievements } = await supabase
        .from("achievements")
        .select("*")
        .order("points", { ascending: true });

      // Fetch user's earned achievements
      const { data: earned } = await supabase
        .from("user_achievements")
        .select("*")
        .eq("user_id", userId);

      // Fetch user stats for progress
      const [favoritesResult, bookingsResult, reviewsResult, moodboardsResult, messagesResult] = await Promise.all([
        supabase.from("favorites").select("id", { count: "exact" }).eq("user_id", userId),
        supabase.from("bookings").select("id", { count: "exact" }).eq("couple_id", userId),
        supabase.from("reviews").select("id", { count: "exact" }).eq("couple_id", userId),
        supabase.from("moodboards").select("id", { count: "exact" }).eq("user_id", userId),
        supabase.from("messages").select("id", { count: "exact" }).eq("sender_id", userId),
      ]);

      setAchievements(allAchievements || []);
      setUserAchievements(earned || []);
      setUserStats({
        favorites_count: favoritesResult.count || 0,
        bookings_count: bookingsResult.count || 0,
        reviews_count: reviewsResult.count || 0,
        moodboards_count: moodboardsResult.count || 0,
        messages_count: messagesResult.count || 0,
        account_created: 1,
        profile_complete: 0, // Would need to check profile fields
      });
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  const isEarned = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId);
  };

  const getProgress = (achievement: Achievement) => {
    const current = userStats[achievement.requirement_type] || 0;
    return Math.min(100, (current / achievement.requirement_value) * 100);
  };

  const totalPoints = achievements
    .filter(a => isEarned(a.id))
    .reduce((sum, a) => sum + a.points, 0);

  const earnedCount = userAchievements.length;
  const totalCount = achievements.length;

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-xl"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className="border-2 border-primary/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Achievements
            </CardTitle>
            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
              {totalPoints} pts
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-3">
            <Progress value={(earnedCount / totalCount) * 100} className="h-2" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {earnedCount}/{totalCount}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {achievements.slice(0, 6).map((achievement) => {
              const Icon = ICON_MAP[achievement.icon] || Trophy;
              const earned = isEarned(achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    earned 
                      ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg" 
                      : "bg-muted text-muted-foreground"
                  }`}
                  title={`${achievement.name} - ${achievement.description}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              );
            })}
            {achievements.length > 6 && (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                +{achievements.length - 6}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/10">
      <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Your Achievements
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 text-lg px-3 py-1">
              {totalPoints} points
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Progress value={(earnedCount / totalCount) * 100} className="h-2" />
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {earnedCount} of {totalCount} unlocked
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {achievements.map((achievement) => {
            const Icon = ICON_MAP[achievement.icon] || Trophy;
            const earned = isEarned(achievement.id);
            const progress = getProgress(achievement);
            
            return (
              <div
                key={achievement.id}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  earned 
                    ? "border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-amber-500/10" 
                    : "border-border bg-muted/30 opacity-60 hover:opacity-100"
                }`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                  earned 
                    ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="h-6 w-6" />
                </div>

                {/* Info */}
                <h4 className="font-semibold text-sm mb-1">{achievement.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {achievement.description}
                </p>

                {/* Points Badge */}
                <Badge 
                  variant={earned ? "default" : "outline"} 
                  className={`text-xs ${earned ? "bg-yellow-500 hover:bg-yellow-600" : ""}`}
                >
                  {achievement.points} pts
                </Badge>

                {/* Progress Bar (if not earned) */}
                {!earned && progress > 0 && (
                  <div className="mt-2">
                    <Progress value={progress} className="h-1" />
                    <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                )}

                {/* Earned checkmark */}
                {earned && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
