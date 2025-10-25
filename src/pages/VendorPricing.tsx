import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, TrendingUp } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function VendorPricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<'featured' | 'sponsored' | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Basic Listing',
      price: 'Free',
      period: 'Forever',
      icon: Check,
      badge: null,
      description: 'Get started with essential visibility',
      features: [
        'Basic listing in search results',
        'Profile page with contact info',
        'Up to 5 portfolio images',
        'Up to 3 service packages',
        'Email notifications for inquiries',
        'Standard response time (48 hours)',
        'Monthly performance reports',
        '12% transaction fee on bookings',
      ],
      cta: 'Current Plan',
      disabled: true,
      gradient: 'from-muted/50 to-muted/30',
    },
    {
      id: 'featured',
      name: 'Featured Listing',
      price: '₹4,999',
      period: 'per month',
      icon: Sparkles,
      badge: 'MOST POPULAR',
      badgeColor: 'bg-accent',
      description: 'Stand out and get 3x more inquiries',
      features: [
        'Top 5 placement in search results',
        '"Featured" badge on your profile',
        'Unlimited portfolio images',
        'Unlimited service packages',
        'Priority email & SMS notifications',
        'Instant inquiry alerts',
        'Advanced analytics dashboard',
        'Weekly performance insights',
        '10% transaction fee (save 2%)',
        'Profile views & conversion tracking',
        'Priority customer support',
        'Featured in category pages',
      ],
      cta: 'Upgrade to Featured',
      highlight: true,
      gradient: 'from-accent/20 to-primary/20',
      estimatedBookings: '8-12 bookings/month',
      roi: '10x return on investment',
    },
    {
      id: 'sponsored',
      name: 'Sponsored Profile',
      price: '₹9,999',
      period: 'per month',
      icon: Crown,
      badge: 'PREMIUM',
      badgeColor: 'bg-gradient-to-r from-primary to-accent',
      description: 'Maximum visibility with VIP treatment',
      features: [
        'Homepage featured carousel placement',
        'Top 1-3 placement in all searches',
        '"Verified Premium" badge',
        'All Featured plan benefits',
        'Zero transaction fees (save 12%)',
        'Dedicated account manager',
        'Social media promotion',
        'Bi-weekly business consulting',
        'Custom URL (yourname.karloshaadi.com)',
        'Priority booking queue access',
        'Exclusive networking events',
        'Featured in success stories',
        '24/7 VIP support',
      ],
      cta: 'Go Premium',
      premium: true,
      gradient: 'from-primary/30 via-accent/20 to-primary/30',
      estimatedBookings: '15-25 bookings/month',
      roi: '25x return on investment',
    },
  ];

  const handleUpgrade = (planId: string) => {
    if (planId === 'free') return;
    navigate('/vendor/dashboard', { state: { upgradeTo: planId } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SEO 
        title="Vendor Pricing - Grow Your Wedding Business"
        description="Choose the perfect plan for your wedding business. Featured listings get 3x more bookings. Premium profiles get dedicated support and zero fees."
      />
      <BhindiHeader />
      
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

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <Card 
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 ${
                  plan.highlight ? 'scale-105 shadow-2xl border-accent' : ''
                } ${plan.premium ? 'border-primary shadow-xl' : ''} animate-fade-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-50`} />
                
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute top-0 right-0 m-4">
                    <Badge className={`${plan.badgeColor} text-white font-bold`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${plan.highlight ? 'bg-accent/20' : plan.premium ? 'bg-primary/20' : 'bg-muted'}`}>
                      <plan.icon className={`h-6 w-6 ${plan.highlight ? 'text-accent' : plan.premium ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  
                  <div className="mt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period !== 'Forever' && (
                        <span className="text-muted-foreground">/ {plan.period}</span>
                      )}
                    </div>
                    {plan.estimatedBookings && (
                      <p className="text-sm text-accent font-semibold mt-2">
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
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          plan.highlight ? 'text-accent' : plan.premium ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={plan.highlight ? 'default' : plan.premium ? 'hero' : 'outline'}
                    size="lg"
                    disabled={plan.disabled}
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
                    "Featured listing helped us get from 3 to 12 bookings per month in just 2 months!"
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
                    "Sponsored profile gave us homepage visibility. Best investment we made!"
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
                    Transaction fees apply only to bookings made through our platform. Featured vendors get 
                    10% fee (vs 12% for free), and Sponsored vendors pay zero transaction fees.
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
              Get started with a Featured plan today and see results within 30 days.
            </p>
            <Button size="lg" variant="hero" onClick={() => navigate('/vendor/dashboard')}>
              Upgrade Now
            </Button>
          </div>
        </div>
      </main>

      <BhindiFooter />
    </div>
  );
}
