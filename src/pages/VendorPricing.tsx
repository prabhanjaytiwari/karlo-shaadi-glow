import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, TrendingUp, Gem, Star, Shield, Users, AlertTriangle, Zap } from "lucide-react";
import { SEO } from "@/components/SEO";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
// Discount removed

export default function VendorPricing() {
  const navigate = useNavigate();
  const [isVendor, setIsVendor] = useState(false);
  const [loading, setLoading] = useState(true);
  // Discount removed

  useEffect(() => {
    checkVendorStatus();
  }, []);

  const checkVendorStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: vendor } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", user.id)
        .single();
      setIsVendor(!!vendor);
    } catch { /* ignored */ } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      priceDisplay: 'Free',
      period: 'Forever',
      icon: Check,
      badge: null,
      description: 'Get started with basic visibility',
      features: [
        'Basic listing in search results',
        'Profile page with contact info',
        'Up to 5 portfolio images',
        'Up to 3 service packages',
        'Email notifications for inquiries',
        '10% transaction fee on bookings',
      ],
      cta: 'Register Free',
      gradient: 'from-muted/50 to-muted/30',
      tierColor: 'text-muted-foreground',
      lossAversion: null,
      spotsLeft: null,
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 999,
      priceDisplay: '₹999',
      period: 'per month',
      icon: Star,
      badge: 'STARTER',
      badgeColor: 'bg-slate-400',
      description: 'Enhanced visibility for growing businesses',
      features: [
        'All Free features included',
        'Top 10 placement in search results',
        '"Silver" verified badge on profile',
        'Up to 15 portfolio images',
        'Basic analytics dashboard',
        '7% transaction fee (save 3%)',
        'Monthly performance reports',
      ],
      cta: 'Upgrade to Starter',
      gradient: 'from-slate-100 to-slate-50',
      tierColor: 'text-slate-500',
      estimatedBookings: '5-8 bookings/month',
      roi: '5x return on investment',
      lossAversion: 'You lose ~₹5,000/month in bookings without Starter',
      spotsLeft: 23,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 2999,
      priceDisplay: '₹2,999',
      period: 'per month',
      icon: Sparkles,
      badge: 'MOST POPULAR',
      badgeColor: 'bg-amber-500',
      description: 'Stand out and get 3x more inquiries',
      features: [
        'All Starter features included',
        'Top 5 placement in search results',
        '"Gold Verified" badge on your profile',
        'Unlimited portfolio images',
        'Advanced analytics dashboard',
        '3% transaction fee (save 7%)',
        'Featured in category pages',
        'Priority customer support',
      ],
      cta: 'Upgrade to Pro',
      highlight: true,
      gradient: 'from-amber-100/50 to-yellow-50/50',
      tierColor: 'text-amber-600',
      estimatedBookings: '10-15 bookings/month',
      roi: '12x return on investment',
      lossAversion: 'You lose ~₹15,000/month in leads without Pro',
      spotsLeft: 11,
    },
    {
      id: 'elite',
      name: 'Elite',
      price: 6999,
      priceDisplay: '₹6,999',
      period: 'per month',
      icon: Crown,
      badge: 'BEST VALUE',
      badgeColor: 'bg-primary',
      description: 'Maximum visibility with VIP treatment',
      features: [
        'All Pro features included',
        'Homepage featured carousel placement',
        'Top 1-3 placement in all searches',
        '"Diamond Premium" badge',
        'Zero transaction fees (save 10%)',
        'Dedicated account manager',
        'Social media promotion',
        'Custom URL (yourname.karloshaadi.com)',
        '24/7 VIP support',
      ],
      cta: 'Go Elite',
      premium: true,
      gradient: 'from-primary/20 via-accent/10 to-primary/20',
      tierColor: 'text-primary',
      estimatedBookings: '20-30 bookings/month',
      roi: '25x return on investment',
      lossAversion: 'You lose ~₹50,000/month in revenue without Elite',
      spotsLeft: 5,
    },
  ];

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') {
      navigate('/vendor-onboarding');
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in first to upgrade your plan");
      navigate('/vendor/onboarding', { state: { from: '/vendor-pricing', upgradeTo: planId } });
      return;
    }
    if (!isVendor) {
      toast.info("Complete your vendor registration first");
      navigate('/vendor-onboarding', { state: { upgradeTo: planId } });
      return;
    }
    navigate('/vendor/dashboard', { state: { upgradeTo: planId } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MobilePageHeader title="Vendor Pricing" />
      <SEO 
        title="Vendor Pricing Plans | Karlo Shaadi"
        description="Affordable vendor plans starting from Free. Grow your wedding business with premium listings and verified leads."
      />
      
      <main className="flex-1 pt-16 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted mb-4">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Grow Your Business</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Choose Your <span className="text-gradient">Success Plan</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Join verified vendors earning more through Karlo Shaadi. Start free, upgrade when ready.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative rounded-2xl p-6 transition-all duration-200 ${
                  plan.highlight 
                    ? 'bg-foreground text-background shadow-[var(--shadow-xl)] scale-[1.02]' 
                    : 'bg-card shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      plan.highlight ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6 mt-2">
                  <h3 className={`text-lg font-semibold mb-1 ${plan.highlight ? '' : ''}`}>{plan.name}</h3>
                  <p className={`text-xs ${plan.highlight ? 'text-background/70' : 'text-muted-foreground'}`}>{plan.description}</p>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.priceDisplay}</span>
                    {plan.period !== 'Forever' && (
                      <span className={`text-sm ${plan.highlight ? 'text-background/60' : 'text-muted-foreground'}`}>/{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <Check className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-accent' : 'text-primary'}`} />
                      <span className={plan.highlight ? 'text-background/80' : ''}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full rounded-xl ${plan.highlight ? 'bg-background text-foreground hover:bg-background/90' : ''}`}
                  variant={plan.highlight ? 'default' : plan.premium ? 'default' : 'outline'}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {plan.cta}
                </Button>

                {plan.price > 0 && (
                  <p className={`text-center text-[10px] mt-3 ${plan.highlight ? 'text-background/50' : 'text-muted-foreground'}`}>
                    30-day money-back guarantee
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Success Stories */}
          <div className="bg-card rounded-2xl p-8 mb-16 shadow-[var(--shadow-sm)]">
            <h2 className="text-2xl font-bold text-center mb-8">Real Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { stat: "300%", label: "Increase in Bookings", quote: "Gold listing helped us get from 3 to 12 bookings per month in just 2 months!", author: "Priya's Photography, Mumbai" },
                { stat: "₹18L", label: "Revenue in 6 Months", quote: "Diamond profile gave us homepage visibility. Best investment we made!", author: "Divine Caterers, Delhi" },
                { stat: "500+", label: "Profile Views Daily", quote: "The analytics dashboard shows exactly where our leads come from. Game changer!", author: "Royal Venues, Jaipur" },
              ].map((story, i) => (
                <div key={i} className="p-5 rounded-xl bg-muted/30">
                  <div className="text-center mb-3">
                    <div className="text-3xl font-bold text-primary">{story.stat}</div>
                    <p className="text-xs text-muted-foreground">{story.label}</p>
                  </div>
                  <p className="text-sm italic text-foreground/80">"{story.quote}"</p>
                  <p className="text-xs text-muted-foreground mt-2">— {story.author}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {[
                { q: "Can I switch plans anytime?", a: "Yes! Upgrade or downgrade anytime. Upgrades take effect immediately, downgrades apply next billing cycle." },
                { q: "What happens if I cancel?", a: "Your premium benefits continue until the end of your paid period. After that, you move to Free plan with all basic features intact." },
                { q: "How does the transaction fee work?", a: "Transaction fees apply only to bookings through our platform. Starter: 7%, Pro: 3%, Elite: zero!" },
                { q: "Is there a contract or commitment?", a: "No long-term contracts! All plans are month-to-month. Cancel anytime with no penalties." },
                { q: "What's the money-back guarantee?", a: "If you don't receive at least 3 leads within 30 days of upgrading, we'll refund 100% of your subscription. No questions asked." },
              ].map((faq, i) => (
                <div key={i} className="bg-card rounded-xl p-5 shadow-[var(--shadow-xs)]">
                  <h3 className="font-semibold text-sm mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold mb-3">Ready to Grow Your Business?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto text-sm">
              Start free and upgrade when you see results. No contracts, no commitments.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="outline" className="rounded-full" onClick={() => navigate('/vendor-onboarding')}>
                Register Free
              </Button>
              <Button size="lg" className="rounded-full" onClick={() => navigate('/vendor/dashboard')}>
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
