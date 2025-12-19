import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { ReferralDashboard } from "@/components/ReferralDashboard";
import { SEO } from "@/components/SEO";

const Referrals = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
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
    } catch (error) {
      console.error("Error:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
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
      <SEO
        title="Refer & Earn | Karlo Shaadi"
        description="Refer friends to Karlo Shaadi and earn ₹500 for each successful booking. Share your unique link and grow your credits!"
      />
      <BhindiHeader />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-8 animate-fade-up">
            <h1 className="text-4xl font-bold mb-2 text-foreground">
              Refer & Earn
            </h1>
            <p className="text-muted-foreground text-lg">
              Share the love and earn ₹500 for every friend who books!
            </p>
          </div>

          {user && <ReferralDashboard userId={user.id} />}
        </div>
      </main>

      <BhindiFooter />
    </div>
  );
};

export default Referrals;
