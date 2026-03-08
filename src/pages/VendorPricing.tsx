import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, TrendingUp, Gem, Star } from "lucide-react";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function VendorPricing() {
  const navigate = useNavigate();
  const [isVendor, setIsVendor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkVendorStatus();
  }, []);

  const checkVendorStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if user is a vendor
      const { data: vendor } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", user.id)
        .single();

      setIsVendor(!!vendor);
    } catch (error) {
      console.error("Error checking vendor status:", error);
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free Registration',
      price: 'Free',
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
        'Standard response time (48 hours)',
        '15% transaction fee on bookings',
      ],
      cta: 'Register Free',
      disabled: false,
      gradient: 'from-muted/50 to-muted/30',
      tierColor: 'text-muted-foreground',
    },
    {
      id: 'silver',
      name: 'Silver',
      price: '₹4,999',
      period: 'per month',
      icon: Star,
      badge: 'STARTER',
      badgeColor: 'bg-slate-400',
      description: 'Enhanced visibility for growing businesses',
      features: [
        'All Free features included',
        'Top 10 placement in search results',
        '"Silver" badge on your profile',
        'Up to 15 portfolio images',
        'Up to 10 service packages',
        'Priority email notifications',
        'Basic analytics dashboard',
        '12% transaction fee (save 3%)',
        'Monthly performance reports',
      ],
      cta: 'Upgrade to Silver',
      highlight: false,
      gradient: 'from-slate-100 to-slate-50',
      tierColor: 'text-slate-500',
      estimatedBookings: '5-8 bookings/month',
      roi: '5x return on investment',
    },
    {
      id: 'gold',
      name: 'Gold',
      price: '₹9,999',
      period: 'per month',
      icon: Sparkles,
      badge: 'MOST POPULAR',
      badgeColor: 'bg-amber-500',
      description: 'Stand out and get 3x more inquiries',
      features: [
        'All Silver features included',
        'Top 5 placement in search results',
        '"Gold Verified" badge on your profile',
        'Unlimited portfolio images',
        'Unlimited service packages',
        'Priority email & SMS notifications',
        'Advanced analytics dashboard',
        'Weekly performance insights',
        '8% transaction fee (save 7%)',
        'Featured in category pages',
        'Priority customer support',
      ],
      cta: 'Upgrade to Gold',
      highlight: true,
      gradient: 'from-amber-100/50 to-yellow-50/50',
      tierColor: 'text-amber-600',
      estimatedBookings: '10-15 bookings/month',
      roi: '12x return on investment',
    },
    {
      id: 'diamond',
      name: 'Diamond',
      price: '₹19,999',
      period: 'per month',
      icon: Crown,
      badge: 'PREMIUM',
      badgeColor: 'bg-gradient-to-r from-primary to-accent',
      description: 'Maximum visibility with VIP treatment',
      features: [
        'All Gold features included',
        'Homepage featured carousel placement',
        'Top 1-3 placement in all searches',
        '"Diamond Premium" badge',
        'Zero transaction fees (save 15%)',
        'Dedicated account manager',
        'Social media promotion',
        'Bi-weekly business consulting',
        'Custom URL (yourname.karloshaadi.com)',
        'Priority booking queue access',
        'Featured in success stories',
        '24/7 VIP support',
      ],
      cta: 'Go Diamond',
      premium: true,
      gradient: 'from-primary/20 via-accent/10 to-primary/20',
      tierColor: 'text-primary',
      estimatedBookings: '20-30 bookings/month',
      roi: '25x return on investment',
    },
  ];

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') {
      navigate('/vendor-onboarding');
      return;
    }
    
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in first to upgrade your plan");
      navigate('/vendor-auth', { state: { from: '/vendor-pricing', upgradeTo: planId } });
      return;
    }

    // Check if user is a vendor
    if (!isVendor) {
      toast.info("Complete your vendor registration first");
      navigate('/vendor-onboarding', { state: { upgradeTo: planId } });
      return;
    }

    // Navigate to dashboard with upgrade intent
    navigate('/vendor/dashboard', { state: { upgradeTo: planId } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SEO 
        title="Vendor Pricing - Grow Your Wedding Business"
        description="Choose the perfect plan for your wedding business. Silver, Gold, and Diamond listings get more bookings. Premium profiles get dedicated support."
      />
      
      <main className="flex-1 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <Badge variant="outline" className="mb-4 text-lg px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              Grow Your Business
            </Badge>
            <h1 className="text-5xl font-bold mb-4">
              Choose Your <span className="text-gradient">Success Plan</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join 10,000+ verified vendors earning ₹5-20 lakhs annually through Karlo Shaadi
            </p>
          </div>

          {/* Trust Banner */}
          <div className="bg-gradient-to-r from-accent/20 via-primary/10 to-accent/20 border-2 border-accent/30 rounded-2xl p-6 mb-12 text-center animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gem className="h-5 w-5 text-accent" />
              <span className="font-bold text-lg">Join 10,000+ Successful Vendors</span>
            </div>
            <p className="text-muted-foreground">
              Trusted by wedding professionals across India • Secure payments • Dedicated support
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {plans.map((plan, index) => (
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

                <CardHeader className="relative pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${plan.highlight ? 'bg-amber-500/20' : plan.premium ? 'bg-primary/20' : 'bg-muted'}`}>
                      <plan.icon className={`h-5 w-5 ${plan.tierColor}`} />
                    </div>
                    <CardTitle className={`text-xl ${plan.tierColor}`}>{plan.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  
                  <div className="mt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period !== 'Forever' && (
                        <span className="text-muted-foreground text-sm">/ {plan.period}</span>
                      )}
                    </div>
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
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Success Stories */}
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl p-8 mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-8">Real Success Stories</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-primary">300%</div>
                    <p className="text-sm text-muted-foreground">Increase in Bookings</p>
                  </div>
                  <p className="text-sm italic">
                    "Gold listing helped us get from 3 to 12 bookings per month in just 2 months!"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    - Priya's Photography, Mumbai
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-primary">₹18L</div>
                    <p className="text-sm text-muted-foreground">Revenue in 6 Months</p>
                  </div>
                  <p className="text-sm italic">
                    "Diamond profile gave us homepage visibility. Best investment we made!"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    - Divine Caterers, Delhi
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-primary">500+</div>
                    <p className="text-sm text-muted-foreground">Profile Views Daily</p>
                  </div>
                  <p className="text-sm italic">
                    "The analytics dashboard shows exactly where our leads come from. Game changer!"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    - Royal Venues, Jaipur
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I switch plans anytime?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, 
                    and downgrades will apply from your next billing cycle.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What happens if I cancel?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your premium benefits will continue until the end of your paid period. After that, 
                    your profile will automatically move to the Free plan with all basic features intact.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How does the transaction fee work?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Transaction fees apply only to bookings made through our platform. Silver vendors get 
                    12% fee, Gold vendors 8%, and Diamond vendors pay zero transaction fees.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is there a contract or commitment?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No long-term contracts! All plans are month-to-month. Cancel anytime with no penalties. 
                    We believe in earning your business every month.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of successful vendors who trust Karlo Shaadi to grow their wedding business.
              Get started with a Gold plan today and see results within 30 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" onClick={() => navigate('/vendor-onboarding')}>
                Register Free
              </Button>
              <Button size="lg" variant="hero" onClick={() => navigate('/vendor/dashboard')}>
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </main>

      <BhindiFooter />
    </div>
  );
}
