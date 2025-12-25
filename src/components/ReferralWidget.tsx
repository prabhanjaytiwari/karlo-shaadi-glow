import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Gift, Users, IndianRupee, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ReferralWidgetProps {
  userId: string;
}

export const ReferralWidget = ({ userId }: ReferralWidgetProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralData();
  }, [userId]);

  const fetchReferralData = async () => {
    try {
      // Fetch user's referral code and credits
      const { data: profile } = await supabase
        .from("profiles")
        .select("referral_code, referral_credits")
        .eq("id", userId)
        .single();

      if (profile) {
        setReferralCode(profile.referral_code);
        setCredits(profile.referral_credits || 0);
      }

      // Count referrals
      const { count } = await supabase
        .from("referrals")
        .select("*", { count: "exact", head: true })
        .eq("referrer_id", userId);

      setReferralCount(count || 0);
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

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="pt-6">
          <div className="h-24 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-accent/10 via-rose-50/50 to-amber-50/50 border-2 border-accent/30 overflow-hidden">
      <CardContent className="pt-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/30 to-primary/20 flex items-center justify-center">
              <Gift className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Refer & Earn</h3>
              <p className="text-sm text-muted-foreground">Share the joy, earn rewards!</p>
            </div>
          </div>
          <Badge className="bg-accent/20 text-accent border-accent/30">
            {referralCount} referrals
          </Badge>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/60 rounded-lg p-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-accent" />
            <div>
              <p className="text-lg font-bold">{referralCount}</p>
              <p className="text-xs text-muted-foreground">Friends Invited</p>
            </div>
          </div>
          <div className="bg-white/60 rounded-lg p-3 flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-emerald-600" />
            <div>
              <p className="text-lg font-bold">₹{credits}</p>
              <p className="text-xs text-muted-foreground">Credits Earned</p>
            </div>
          </div>
        </div>

        {/* Referral Code */}
        <div className="bg-white/80 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Your code</p>
            <p className="font-mono font-bold text-accent">{referralCode || "..."}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyReferralLink}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={shareReferral} className="bg-accent hover:bg-accent/90">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>

        {/* CTA */}
        <Button 
          variant="ghost" 
          className="w-full justify-between text-accent hover:text-accent hover:bg-accent/10"
          onClick={() => navigate("/referrals")}
        >
          <span>View all referrals & rewards</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};