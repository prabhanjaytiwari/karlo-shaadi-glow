import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Bot, PhoneCall, Gift, Crown, Shield, Heart, HelpCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

const plans = [
  {
    name: "Free",
    icon: Heart,
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
    cta: "Get Started Free",
    popular: false,
    highlight: true
  },
  {
    name: "AI Premium",
    icon: Sparkles,
    price: "₹999",
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
    popular: true
  }
];

const faqs = [
  {
    q: "Is the Free plan really free forever?",
    a: "Yes! The Free plan includes all essential features - unlimited vendor search, bookings, messaging, budget tools, and more. No credit card required, no hidden fees, ever."
  },
  {
    q: "What makes AI Premium worth ₹999/month?",
    a: "AI Premium gives you a 24/7 intelligent wedding planner that answers questions, creates timelines, optimizes budgets, and recommends vendors. Plus you get human support via video calls, contract reviews, and exclusive discounts that often save more than the subscription cost."
  },
  {
    q: "Can I cancel AI Premium anytime?",
    a: "Absolutely! No long-term contracts. Cancel anytime and keep using the Free plan. You'll retain access to AI Premium features until the end of your billing cycle."
  },
  {
    q: "How does the AI Wedding Planner work?",
    a: "Our AI is trained on thousands of Indian weddings across cultures, traditions, and budgets. It provides personalized recommendations based on your preferences, budget, location, and wedding date. It's like having an expert wedding planner available 24/7."
  },
  {
    q: "Do vendors charge extra fees on your platform?",
    a: "No! We don't add any commission to vendor prices. The price you see is what you pay. AI Premium members even get 5% exclusive discounts from participating vendors."
  },
  {
    q: "Can I upgrade or downgrade my plan?",
    a: "Yes! Upgrade to AI Premium anytime to unlock AI features and personal support. Downgrade to Free anytime - you'll keep all your data, bookings, and favorites."
  }
];

export default function Pricing() {
  const navigate = useNavigate();

  const handlePremiumClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth?redirect=/subscription-checkout?plan=ai_premium");
    } else {
      navigate("/subscription-checkout?plan=ai_premium");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Pricing - 100% Free Wedding Planning"
        description="Karlo Shaadi is 100% FREE forever! Get AI Premium for ₹999/month for AI wedding planner, personal consultant, and exclusive discounts."
      />
      <BhindiHeader />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-4 bg-accent/10 text-accent border-accent/20 text-base px-4 py-2">
            🎉 100% Free for Couples!
          </Badge>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl mb-6">
            Plan Your Dream Wedding for <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Free</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need is FREE forever. Upgrade to AI Premium for intelligent planning assistance and VIP support.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative rounded-3xl border-2 p-8 ${
                  plan.popular
                    ? 'border-primary shadow-2xl scale-105 bg-card'
                    : plan.highlight
                      ? 'border-accent/50 shadow-xl bg-card'
                      : 'border-border/50 bg-card/50'
                } transition-all hover:shadow-xl`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Best Value
                  </Badge>
                )}
                {plan.highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                    Most Popular
                  </Badge>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>

                {/* Header */}
                <div className="mb-6">
                  <h3 className="font-bold text-2xl mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-display font-bold text-4xl">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                {/* CTA */}
                {plan.name === 'Free' ? (
                  <Link to="/auth">
                    <Button
                      className="w-full mb-6 bg-accent text-accent-foreground hover:bg-accent/90"
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="w-full mb-6 bg-primary text-primary-foreground hover:bg-primary/90"
                    size="lg"
                    onClick={handlePremiumClick}
                  >
                    {plan.cta}
                  </Button>
                )}

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span
                        className={`text-sm ${
                          feature.included ? 'text-foreground' : 'text-muted-foreground/50'
                        } ${feature.bold ? 'font-bold' : ''}`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Showcase */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Bot className="h-3 w-3 mr-1" />
              Powered by AI
            </Badge>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Meet Your AI Wedding Planner
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Get instant answers, personalized recommendations, and expert guidance 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Bot,
                title: "AI Chat Assistant",
                description: "Ask anything about vendors, budget, timeline, traditions, or decorations. Get instant, personalized answers."
              },
              {
                icon: PhoneCall,
                title: "Human Expert Support",
                description: "2 video consultations per month with experienced wedding planners who understand your vision."
              },
              {
                icon: Gift,
                title: "Exclusive Savings",
                description: "5% discount with premium vendors. Save more than the subscription cost on a single booking!"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border-2 border-border/50 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Vendors Section */}
      <section className="py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            Are You a Wedding Vendor?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join Karlo Shaadi and grow your business! Featured listings start at ₹4,999/month with zero transaction fees for Premium vendors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/vendor-pricing">
              <Button size="lg" variant="hero" className="rounded-full px-8">
                View Vendor Pricing
              </Button>
            </Link>
            <Link to="/vendor-auth">
              <Button size="lg" variant="outline" className="rounded-full px-8">
                Join as Vendor - Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-card border-2 border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-primary to-accent">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-6 text-white">
            Ready to Plan Your Dream Wedding?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Join 50,000+ happy couples who found their perfect vendors on Karlo Shaadi - 100% FREE!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8">
                Start Planning - It's Free!
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary rounded-full px-8"
              onClick={handlePremiumClick}
            >
              Try AI Premium
            </Button>
          </div>
        </div>
      </section>

      <BhindiFooter />
    </div>
  );
}
