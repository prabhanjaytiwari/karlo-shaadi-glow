import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Gift, Users, IndianRupee, CheckCircle, Trophy, Star, Crown, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Referral {
  id: string;
  referral_code: string;
  referred_email: string | null;
  status: string;
  reward_amount: number;
  created_at: string;
  completed_at: string | null;
}

interface Milestone {
  id: string;
  referral_count: number;
  reward_type: string;
  reward_value: number;
  badge_name: string;
  badge_icon: string;
  description: string;
}

interface UserMilestone {
  milestone_id: string;
  achieved_at: string;
}

interface ReferralDashboardProps {
  userId: string;
}

export const ReferralDashboard = ({ userId }: ReferralDashboardProps) => {
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [credits, setCredits] = useState(0);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [userMilestones, setUserMilestones] = useState<UserMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralData();
  }, [userId]);

  const fetchReferralData = async () => {
    try {
      // Fetch user's referral code from profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("referral_code, referral_credits")
        .eq("id", userId)
        .single();

      if (profile) {
        setReferralCode(profile.referral_code);
        setCredits(profile.referral_credits || 0);
      }

      // Fetch referral history
      const { data: referralData } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", userId)
        .order("created_at", { ascending: false });

      if (referralData) {
        setReferrals(referralData);
      }

      // Fetch milestones
      const { data: milestonesData } = await supabase
        .from("referral_milestones")
        .select("*")
        .order("referral_count", { ascending: true });

      if (milestonesData) {
        setMilestones(milestonesData);
      }

      // Fetch user's achieved milestones
      const { data: userMilestonesData } = await supabase
        .from("user_referral_milestones")
        .select("milestone_id, achieved_at")
        .eq("user_id", userId);

      if (userMilestonesData) {
        setUserMilestones(userMilestonesData);
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/auth?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const shareReferral = async () => {
    const link = `${window.location.origin}/auth?ref=${referralCode}`;
    const text = `Join Karlo Shaadi and get ₹500 off your first booking! Use my referral link:`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Karlo Shaadi",
          text: text,
          url: link,
        });
      } catch (err) {
        copyReferralLink();
      }
    } else {
      copyReferralLink();
    }
  };

  const completedReferrals = referrals.filter(r => r.status === "completed" || r.status === "rewarded").length;
  const pendingReferrals = referrals.filter(r => r.status === "pending").length;

  const isMilestoneAchieved = (milestoneId: string) => {
    return userMilestones.some(um => um.milestone_id === milestoneId);
  };

  const getNextMilestone = () => {
    return milestones.find(m => !isMilestoneAchieved(m.id));
  };

  const nextMilestone = getNextMilestone();
  const progressToNext = nextMilestone 
    ? Math.min((completedReferrals / nextMilestone.referral_count) * 100, 100)
    : 100;

  const getMilestoneIcon = (iconName: string) => {
    switch (iconName) {
      case '🌟': return <Star className="h-5 w-5" />;
      case '🎊': return <Sparkles className="h-5 w-5" />;
      case '💫': return <Star className="h-5 w-5" />;
      case '👑': return <Crown className="h-5 w-5" />;
      case '🏆': return <Trophy className="h-5 w-5" />;
      default: return <Gift className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Referral Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-accent/10 to-primary/5 border-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{referrals.length}</p>
                <p className="text-xs text-muted-foreground">Total Referrals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-100/50 to-teal-100/30 border-emerald-200/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-200/50 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedReferrals}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-100/50 to-yellow-100/30 border-amber-200/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200/50 flex items-center justify-center">
                <Gift className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingReferrals}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <IndianRupee className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{credits}</p>
                <p className="text-xs text-muted-foreground">Credits Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Milestone */}
      {nextMilestone && (
        <Card className="bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5 border-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" />
                <span className="font-semibold">Next Milestone: {nextMilestone.badge_name}</span>
              </div>
              <Badge variant="outline" className="font-mono">
                {completedReferrals}/{nextMilestone.referral_count} referrals
              </Badge>
            </div>
            <Progress value={progressToNext} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">{nextMilestone.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Referral Link Card */}
      <Card className="shadow-[var(--shadow-sm)] bg-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-accent" />
            Your Referral Link
          </CardTitle>
          <CardDescription>
            Share your unique link and earn ₹500 for each friend who books a vendor!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              readOnly
              value={`${window.location.origin}/auth?ref=${referralCode || ""}`}
              className="bg-background/80 font-mono text-sm"
            />
            <Button variant="outline" size="icon" onClick={copyReferralLink}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button onClick={shareReferral} className="bg-accent hover:bg-accent/90">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="font-mono">
              Code: {referralCode || "Loading..."}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Referral Milestones
          </CardTitle>
          <CardDescription>Unlock rewards as you refer more friends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => {
              const achieved = isMilestoneAchieved(milestone.id);
              return (
                <div
                  key={milestone.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                    achieved 
                      ? "bg-emerald-50 border-emerald-200" 
                      : "bg-muted/30 border-muted"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    achieved 
                      ? "bg-emerald-200 text-emerald-700" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {achieved ? <CheckCircle className="h-6 w-6" /> : getMilestoneIcon(milestone.badge_icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-semibold ${achieved ? "text-emerald-700" : ""}`}>
                        {milestone.badge_name}
                      </h4>
                      <Badge variant={achieved ? "default" : "secondary"} className={achieved ? "bg-emerald-500" : ""}>
                        {milestone.referral_count} referrals
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                  {achieved && (
                    <Badge className="bg-emerald-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Achieved
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Referrals Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <Share2 className="h-6 w-6 text-accent" />
              </div>
              <h4 className="font-semibold">1. Share Your Link</h4>
              <p className="text-sm text-muted-foreground">
                Share your unique referral link with friends and family
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h4 className="font-semibold">2. They Sign Up</h4>
              <p className="text-sm text-muted-foreground">
                Your friend signs up and gets ₹500 off their first booking
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <Gift className="h-6 w-6 text-accent" />
              </div>
              <h4 className="font-semibold">3. You Earn</h4>
              <p className="text-sm text-muted-foreground">
                Get ₹500 credits when they complete their first booking
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      {referrals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Referral History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <Users className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {referral.referred_email || "Pending signup"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(referral.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {referral.status === "rewarded" && (
                      <Badge variant="outline" className="text-emerald-600 border-emerald-300">
                        +₹{referral.reward_amount}
                      </Badge>
                    )}
                    <Badge
                      variant={referral.status === "rewarded" ? "default" : "secondary"}
                      className={referral.status === "rewarded" ? "bg-emerald-500" : ""}
                    >
                      {referral.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};