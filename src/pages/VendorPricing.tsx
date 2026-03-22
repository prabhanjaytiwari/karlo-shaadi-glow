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
import { CountdownBanner, isOfferActive, getDiscountedPrice, getPerDayPrice } from "@/components/CountdownBanner";

export default function VendorPricing() {
  const navigate = useNavigate();
  const [isVendor, setIsVendor] = useState(false);
  const [loading, setLoading] = useState(true);
  const offerActive = isOfferActive();

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
      badgeColor: 'bg-gradient-to-r from-primary to-accent',
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-primary/5">
      <MobilePageHeader title="Vendor Pricing" />
      <SEO 
        title="Vendor Pricing - 50% OFF Launch Offer"
        description="50% OFF first month! Choose Silver, Gold, or Diamond plans. Grow your wedding business with premium listings. 100% money-back guarantee."
      />
      
      <main className="flex-1 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Countdown Banner */}
          {offerActive && <CountdownBanner className="mb-8" />}

          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <Badge variant="outline" className="mb-4 text-lg px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              Grow Your Business
            </Badge>
            <h1 className="text-5xl font-bold mb-4">
              Choose Your <span className="text-gradient">Success Plan</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
              Join 10,000+ verified vendors earning ₹5-20 lakhs annually through Karlo Shaadi
            </p>
            {offerActive && (
              <p className="text-sm font-bold text-primary animate-pulse">
                🎉 LAUNCH OFFER: 50% OFF your first month on all paid plans!
              </p>
            )}
          </div>

          {/* Social Proof Banner */}
          <div className="bg-gradient-to-r from-accent/20 via-primary/10 to-accent/20 border-2 border-accent/30 rounded-2xl p-6 mb-12 text-center animate-fade-in">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-bold">847 vendors upgraded this month</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="font-bold text-green-600">100% money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Gem className="h-4 w-4 text-accent-foreground" />
                <span className="font-bold">Most popular in your city</span>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {plans.map((plan, index) => {
              const discountedPrice = offerActive && plan.price > 0 ? getDiscountedPrice(plan.price) : null;
              const perDay = discountedPrice ? getPerDayPrice(discountedPrice) : plan.price > 0 ? getPerDayPrice(plan.price) : null;
              const savings = discountedPrice ? plan.price - discountedPrice : 0;

              return (
                <Card 
                  key={plan.id}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    plan.highlight ? 'scale-105 shadow-2xl border-amber-400 ring-2 ring-amber-400/20' : ''
                  } ${plan.premium ? 'border-primary shadow-xl' : ''} animate-fade-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-50`} />
                  
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute top-0 right-0 m-4">
                      <Badge className={`${plan.badgeColor} text-white font-bold text-xs`}>
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  {/* Limited spots */}
                  {plan.spotsLeft && offerActive && (
                    <div className="absolute top-0 left-0 m-4">
                      <Badge variant="destructive" className="text-[10px] animate-pulse">
                        Only {plan.spotsLeft} spots left!
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="relative pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${plan.highlight ? 'bg-amber-500/20' : plan.premium ? 'bg-primary/20' : 'bg-muted'}`}>
                        <plan.icon className={`h-5 w-5 ${plan.tierColor}`} />
                      </div>
                      <CardTitle className={`text-xl ${plan.tierColor}`}>{plan.name}</CardTitle>
                    </div>
                    <CardDescription className="text-sm">{plan.description}</CardDescription>
                    
                    <div className="mt-4">
                      {/* Price with anchoring */}
                      {discountedPrice ? (
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg line-through text-muted-foreground">₹{plan.price.toLocaleString()}</span>
                            <Badge variant="destructive" className="text-xs">50% OFF</Badge>
                          </div>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-black text-primary">₹{discountedPrice.toLocaleString()}</span>
                            <span className="text-muted-foreground text-sm">/ first month</span>
                          </div>
                          <p className="text-xs text-green-600 font-bold mt-1">
                            💰 You save ₹{savings.toLocaleString()}!
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold">{plan.priceDisplay}</span>
                          {plan.period !== 'Forever' && (
                            <span className="text-muted-foreground text-sm">/ {plan.period}</span>
                          )}
                        </div>
                      )}

                      {/* Per-day reframing */}
                      {perDay && (
                        <p className="text-xs text-muted-foreground mt-1">
                          That's just <span className="font-bold text-foreground">₹{perDay}/day</span> — less than a chai!
                        </p>
                      )}

                      {plan.estimatedBookings && (
                        <p className={`text-sm font-semibold mt-2 ${plan.tierColor}`}>
                          ⚡ {plan.estimatedBookings}
                        </p>
                      )}
                      {plan.roi && (
                        <p className="text-xs text-muted-foreground">
                          Average {plan.roi}
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="relative">
                    {/* Loss aversion */}
                    {plan.lossAversion && (
                      <div className="flex items-start gap-2 mb-4 p-2 rounded-lg bg-destructive/5 border border-destructive/10">
                        <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                        <p className="text-[11px] text-destructive font-medium">{plan.lossAversion}</p>
                      </div>
                    )}

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          <Check className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${plan.tierColor}`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full"
                      variant={plan.highlight ? 'default' : plan.premium ? 'hero' : 'outline'}
                      size="default"
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      {plan.id !== 'free' && offerActive && <Zap className="h-3.5 w-3.5 mr-1" />}
                      {plan.cta}
                    </Button>

                    {/* Risk reversal */}
                    {plan.price > 0 && (
                      <div className="flex items-center justify-center gap-1.5 mt-3">
                        <Shield className="h-3 w-3 text-green-500" />
                        <p className="text-[10px] text-green-600 font-semibold">
                          100% money-back if no 3 leads in 30 days
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Second countdown (mid-page urgency) */}
          {offerActive && <CountdownBanner compact className="mb-12 max-w-md mx-auto" />}

          {/* Success Stories */}
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl p-8 mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-8">Real Success Stories</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { stat: "300%", label: "Increase in Bookings", quote: "Gold listing helped us get from 3 to 12 bookings per month in just 2 months!", author: "Priya's Photography, Mumbai" },
                { stat: "₹18L", label: "Revenue in 6 Months", quote: "Diamond profile gave us homepage visibility. Best investment we made!", author: "Divine Caterers, Delhi" },
                { stat: "500+", label: "Profile Views Daily", quote: "The analytics dashboard shows exactly where our leads come from. Game changer!", author: "Royal Venues, Jaipur" },
              ].map((story, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-primary">{story.stat}</div>
                      <p className="text-sm text-muted-foreground">{story.label}</p>
                    </div>
                    <p className="text-sm italic">"{story.quote}"</p>
                    <p className="text-xs text-muted-foreground mt-2">- {story.author}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Can I switch plans anytime?", a: "Yes! Upgrade or downgrade anytime. Upgrades take effect immediately, downgrades apply next billing cycle." },
                { q: "What happens if I cancel?", a: "Your premium benefits continue until the end of your paid period. After that, you move to Free plan with all basic features intact." },
                { q: "How does the transaction fee work?", a: "Transaction fees apply only to bookings through our platform. Starter: 7%, Pro: 3%, Elite: zero!" },
                { q: "Is there a contract or commitment?", a: "No long-term contracts! All plans are month-to-month. Cancel anytime with no penalties." },
                { q: "What's the money-back guarantee?", a: "If you don't receive at least 3 leads within 30 days of upgrading, we'll refund 100% of your subscription. No questions asked." },
              ].map((faq, i) => (
                <Card key={i}>
                  <CardHeader><CardTitle className="text-lg">{faq.q}</CardTitle></CardHeader>
                  <CardContent><p className="text-muted-foreground">{faq.a}</p></CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Final CTA with urgency */}
          <div className="text-center mt-16 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
            {offerActive && (
              <p className="text-primary font-bold mb-2 animate-pulse">
                ⏰ 50% OFF ends soon — don't miss this launch price!
              </p>
            )}
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join 847 vendors who upgraded this month. Get started with Gold and see results within 30 days — guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" onClick={() => navigate('/vendor-onboarding')}>
                Register Free
              </Button>
              <Button size="lg" variant="hero" onClick={() => navigate('/vendor/dashboard')}>
                <Zap className="h-4 w-4 mr-2" />
                Upgrade Now — 50% OFF
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
