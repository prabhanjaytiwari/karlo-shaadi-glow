import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Bot, PhoneCall, Gift, Crown, Shield, Zap, Users, AlertTriangle } from "lucide-react";
import { FAQPageJsonLd } from "@/components/JsonLd";
import { Link, useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CountdownBanner, isOfferActive, getDiscountedPrice, getPerDayPrice } from "@/components/CountdownBanner";
import heroImg from "@/assets/hero-pricing-carefree.jpg";

const faqs = [
  { q: "Is the Free plan really free forever?", a: "Yes! The Free plan includes all essential features - unlimited vendor search, bookings, messaging, budget tools, and more. No credit card required, no hidden fees, ever." },
  { q: "What makes AI Premium worth ₹999/month?", a: "AI Premium gives you a 24/7 intelligent wedding planner that answers questions, creates timelines, optimizes budgets, and recommends vendors. Plus you get human support via video calls, contract reviews, and exclusive discounts that often save more than the subscription cost." },
  { q: "Can I cancel AI Premium anytime?", a: "Absolutely! No long-term contracts. Cancel anytime and keep using the Free plan. You'll retain access to AI Premium features until the end of your billing cycle." },
  { q: "How does the AI Wedding Planner work?", a: "Our AI is trained on thousands of Indian weddings across cultures, traditions, and budgets. It provides personalized recommendations based on your preferences, budget, location, and wedding date." },
  { q: "Do vendors charge extra fees on your platform?", a: "No! We don't add any commission to vendor prices. The price you see is what you pay. AI Premium members even get 5% exclusive discounts from participating vendors." },
  { q: "Can I upgrade or downgrade my plan?", a: "Yes! Upgrade to AI Premium anytime to unlock AI features and personal support. Downgrade to Free anytime - you'll keep all your data, bookings, and favorites." },
  { q: "What's the money-back guarantee?", a: "If AI Premium doesn't help you save time and money on your wedding planning within 30 days, we'll refund your subscription. No questions asked." },
];

const AI_PREMIUM_PRICE = 999;

export default function Pricing() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isVendor, setIsVendor] = useState(false);
  const [user, setUser] = useState<any>(null);
  const offerActive = isOfferActive();
  const discountedPrice = offerActive ? getDiscountedPrice(AI_PREMIUM_PRICE) : null;
  const perDay = discountedPrice ? getPerDayPrice(discountedPrice) : getPerDayPrice(AI_PREMIUM_PRICE);
  const savings = discountedPrice ? AI_PREMIUM_PRICE - discountedPrice : 0;

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      setIsVendor(roles?.some(r => r.role === "vendor") || false);
    }
  };

  const handlePremiumClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/auth?redirect=/subscription-checkout?plan=ai_premium");
    else navigate("/subscription-checkout?plan=ai_premium");
  };

  const plans = [
    {
      name: "Free",
      icon: Sparkles,
      price: "₹0",
      period: "Forever Free",
      description: "Everything you need to plan your perfect wedding",
      color: "from-blue-500 to-cyan-500",
      features: [
        { text: "Unlimited vendor search & browsing", included: true },
        { text: "Unlimited favorites", included: true },
        { text: "Priority messaging with vendors", included: true },
        { text: "Unlimited bookings", included: true },
        { text: "Advanced search filters", included: true },
        { text: "Vendor comparison tool", included: true },
        { text: "Budget planning tools", included: true },
        { text: "Guest list management", included: true },
        { text: "Digital wedding checklist", included: true },
        { text: "Priority support", included: true },
        { text: "Early access to new vendors", included: true },
        { text: "Booking calendar integration", included: true },
      ],
      cta: "Plan Your Wedding Free",
      popular: false,
      highlight: true,
    },
    {
      name: "AI Premium",
      icon: Crown,
      price: `₹${AI_PREMIUM_PRICE}`,
      period: "per month",
      description: "AI-powered wedding planning with personal support",
      color: "from-primary to-accent",
      features: [
        { text: "Everything in Free, plus:", included: true, bold: true },
        { text: "AI Wedding Planner 24/7 🤖", included: true, bold: true },
        { text: "Personal wedding consultant", included: true },
        { text: "2 video consultation calls/month", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "Exclusive vendor discounts (5%)", included: true },
        { text: "Contract review assistance", included: true },
        { text: "Priority booking slots", included: true },
        { text: "24/7 concierge support", included: true },
        { text: "AI budget optimization", included: true },
        { text: "AI timeline generation", included: true },
        { text: "Personalized vendor recommendations", included: true },
      ],
      cta: "Start AI Planning",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Pricing - 50% OFF AI Premium Launch Offer" description="Karlo Shaadi is 100% FREE forever! Get AI Premium at 50% OFF — just ₹499/month for your first month. AI wedding planner, personal consultant, and exclusive discounts." />
      <FAQPageJsonLd faqs={faqs.map(f => ({ question: f.q, answer: f.a }))} />
      <MobilePageHeader title="Pricing" />

      {/* Hero with Image */}
      <div className={`relative overflow-hidden ${isMobile ? 'h-44' : 'h-72 mt-20'}`}>
        <img src={heroImg} alt="Happy couple" className="w-full h-full object-cover" style={{ filter: 'contrast(1.03) saturate(1.08)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className={`absolute bottom-5 ${isMobile ? 'left-4 right-4' : 'left-12 right-12'}`}>
          <Badge className="mb-2 bg-accent/90 text-accent-foreground text-xs">🎉 100% Free for Couples!</Badge>
          <h1 className={`text-white font-bold ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
            Plan Your Dream Wedding for Free
          </h1>
        </div>
      </div>

      {/* Countdown Banner */}
      {offerActive && (
        <div className={isMobile ? "px-4 pt-4" : "container mx-auto max-w-5xl pt-8"}>
          <CountdownBanner />
        </div>
      )}

      {/* Social Proof Bar */}
      <div className={isMobile ? "px-4 pt-4" : "container mx-auto max-w-5xl pt-6"}>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs py-3 px-4 rounded-xl bg-muted/50 border border-border/50">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span className="font-bold">2,341 couples joined this week</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-green-500" />
            <span className="font-bold text-green-600">30-day money-back guarantee</span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <section className={isMobile ? "px-4 py-6 space-y-4" : "py-16 md:py-24 px-4 md:px-6"}>
        <div className={isMobile ? "" : "container mx-auto max-w-5xl"}>
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'lg:grid-cols-2 gap-6'}`}>
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative rounded-2xl border-2 p-6 ${
                  plan.popular
                    ? 'border-primary shadow-xl bg-card ring-1 ring-primary/20'
                    : 'border-accent/30 bg-card'
                } transition-all hover:shadow-lg`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    {offerActive ? "🔥 50% OFF" : "Best Value"}
                  </Badge>
                )}
                {plan.highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">Most Popular</Badge>
                )}

                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-1">{plan.name}</h3>

                {/* Price with anchoring for AI Premium */}
                {plan.popular && offerActive && discountedPrice ? (
                  <div className="mb-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg line-through text-muted-foreground">₹{AI_PREMIUM_PRICE}</span>
                      <Badge variant="destructive" className="text-xs">50% OFF</Badge>
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-black text-3xl text-primary">₹{discountedPrice}</span>
                      <span className="text-muted-foreground text-sm">first month</span>
                    </div>
                    <p className="text-xs text-green-600 font-bold mt-0.5">
                      💰 You save ₹{savings}! That's just ₹{perDay}/day
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Then ₹{AI_PREMIUM_PRICE}/month. Cancel anytime.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-3xl">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                )}

                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                {/* Loss aversion for premium */}
                {plan.popular && (
                  <div className="flex items-start gap-2 mb-4 p-2.5 rounded-lg bg-destructive/5 border border-destructive/10">
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                    <p className="text-[11px] text-destructive font-medium">
                      Without AI Premium, couples spend 40+ hours on planning that takes AI just minutes
                    </p>
                  </div>
                )}

                {plan.name === 'Free' ? (
                  <Link to="/auth"><Button className="w-full mb-5 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90" size="lg">{plan.cta}</Button></Link>
                ) : (
                  <Button className="w-full mb-5 rounded-xl" size="lg" onClick={handlePremiumClick}>
                    {offerActive && <Zap className="h-4 w-4 mr-1" />}
                    {offerActive ? "Claim 50% OFF Now" : plan.cta}
                  </Button>
                )}

                {/* Risk reversal */}
                {plan.popular && (
                  <div className="flex items-center justify-center gap-1.5 mb-4">
                    <Shield className="h-3 w-3 text-green-500" />
                    <p className="text-[10px] text-green-600 font-semibold">
                      30-day money-back guarantee. No questions asked.
                    </p>
                  </div>
                )}

                <ul className="space-y-2.5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span className={`text-sm ${feature.bold ? 'font-semibold' : 'text-foreground'}`}>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className={isMobile ? "px-4 py-6" : "py-16 md:py-24 px-4 md:px-6"}>
        <div className={isMobile ? "" : "container mx-auto max-w-5xl"}>
          <h2 className={`font-bold ${isMobile ? 'text-xl mb-4' : 'text-3xl mb-8 text-center'}`}>Meet Your AI Wedding Planner</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Bot, title: "AI Chat Assistant", description: "Ask anything about vendors, budget, timeline, traditions, or decorations. Get instant, personalized answers." },
              { icon: PhoneCall, title: "Human Expert Support", description: "2 video consultations per month with experienced wedding planners who understand your vision." },
              { icon: Gift, title: "Exclusive Savings", description: "5% discount with premium vendors. Save more than the subscription cost on a single booking!" }
            ].map((f, i) => (
              <div key={i} className="rounded-2xl border border-border/50 p-5 hover:border-accent/30 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-3">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-base mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page countdown */}
      {offerActive && (
        <div className={isMobile ? "px-4 py-2" : "container mx-auto max-w-md py-4"}>
          <CountdownBanner compact />
        </div>
      )}

      {/* Vendor CTA */}
      {!isVendor && (
        <section className={isMobile ? "px-4 py-6" : "py-16 md:py-24 px-4 md:px-6"}>
          <div className="container mx-auto max-w-4xl text-center">
            <Crown className="h-10 w-10 text-primary mx-auto mb-3" />
            <h2 className={`font-bold ${isMobile ? 'text-xl' : 'text-3xl'} mb-3`}>Are You a Wedding Vendor?</h2>
            <p className="text-muted-foreground mb-6 text-sm max-w-lg mx-auto">
              Join Karlo Shaadi and grow your business! {offerActive ? "50% OFF all plans — limited time!" : "Featured listings start at ₹4,999/month."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/vendor-pricing"><Button size="lg" className="rounded-full px-8">View Vendor Pricing</Button></Link>
              <Link to="/vendor/onboarding"><Button size="lg" variant="outline" className="rounded-full px-8">Join as Vendor - Free</Button></Link>
            </div>
          </div>
        </section>
      )}

      {isVendor && (
        <section className={isMobile ? "px-4 py-6" : "py-16 md:py-24 px-4 md:px-6"}>
          <div className="container mx-auto max-w-4xl text-center">
            <Crown className="h-10 w-10 text-primary mx-auto mb-3" />
            <h2 className={`font-bold ${isMobile ? 'text-xl' : 'text-3xl'} mb-3`}>Manage Your Vendor Subscription</h2>
            <p className="text-muted-foreground mb-6 text-sm">Upgrade your plan or manage your subscription from your dashboard.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/vendor/dashboard"><Button size="lg" className="rounded-full px-8">Go to Dashboard</Button></Link>
              <Link to="/vendor-pricing"><Button size="lg" variant="outline" className="rounded-full px-8">Upgrade Options</Button></Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className={isMobile ? "px-4 py-6" : "py-16 md:py-24 px-4 md:px-6 bg-muted/20"}>
        <div className={isMobile ? "" : "container mx-auto max-w-3xl"}>
          <h2 className={`font-bold ${isMobile ? 'text-xl mb-4' : 'text-3xl mb-8 text-center'}`}>Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`} className="rounded-2xl border border-border/50 px-5 bg-background">
                <AccordionTrigger className="text-left font-semibold text-sm py-4 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4 md:px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent" />
        <div className="relative container mx-auto max-w-4xl text-center">
          <h2 className={`font-bold text-white ${isMobile ? 'text-2xl' : 'text-4xl'} mb-4`}>Ready to Plan Your Dream Wedding?</h2>
          <p className="text-white/80 mb-2 text-sm max-w-md mx-auto">Join 50,000+ happy couples who found their perfect vendors - 100% FREE!</p>
          {offerActive && (
            <p className="text-white font-bold mb-4 animate-pulse text-sm">
              ⏰ 50% OFF AI Premium ends soon — grab it now!
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth"><Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8">Start Planning Free</Button></Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary rounded-full px-8" onClick={handlePremiumClick}>
              {offerActive ? "🔥 Claim 50% OFF" : "Try AI Premium"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
