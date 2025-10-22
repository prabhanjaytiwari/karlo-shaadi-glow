import { BhindiHeader } from "@/components/BhindiHeader";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Zap, Crown, Heart, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    icon: Heart,
    price: "₹0",
    period: "Forever Free",
    description: "Perfect for couples just starting their wedding planning journey",
    color: "from-blue-500 to-cyan-500",
    features: [
      { text: "Browse unlimited vendors", included: true },
      { text: "Save up to 10 favorites", included: true },
      { text: "Basic search & filters", included: true },
      { text: "Read vendor reviews", included: true },
      { text: "Direct messaging with vendors", included: true },
      { text: "1 active booking at a time", included: true },
      { text: "Email support (48hr response)", included: true },
      { text: "Vendor comparison (up to 3)", included: false },
      { text: "Priority booking", included: false },
      { text: "Wedding budget planner", included: false },
      { text: "Dedicated wedding manager", included: false }
    ],
    cta: "Get Started Free",
    popular: false
  },
  {
    name: "Premium",
    icon: Zap,
    price: "₹2,999",
    period: "One-time payment",
    description: "Everything you need to plan your perfect wedding stress-free",
    color: "from-primary to-accent",
    features: [
      { text: "Everything in Free, plus:", included: true, bold: true },
      { text: "Unlimited favorites & bookings", included: true },
      { text: "Advanced filters & search", included: true },
      { text: "Vendor comparison (unlimited)", included: true },
      { text: "Priority booking & responses", included: true },
      { text: "Wedding budget planner tool", included: true },
      { text: "Guest list management", included: true },
      { text: "Digital wedding checklist", included: true },
      { text: "WhatsApp support (24hr response)", included: true },
      { text: "Booking calendar integration", included: true },
      { text: "Early access to new vendors", included: true },
      { text: "Dedicated wedding manager", included: false }
    ],
    cta: "Upgrade to Premium",
    popular: true
  },
  {
    name: "VIP",
    icon: Crown,
    price: "₹9,999",
    period: "One-time payment",
    description: "White-glove service for couples who want the absolute best",
    color: "from-yellow-500 to-orange-500",
    features: [
      { text: "Everything in Premium, plus:", included: true, bold: true },
      { text: "Dedicated wedding manager", included: true },
      { text: "Personal vendor recommendations", included: true },
      { text: "Negotiation support", included: true },
      { text: "On-ground coordination support", included: true },
      { text: "Priority phone support (4hr response)", included: true },
      { text: "Vendor contract review", included: true },
      { text: "Custom timeline & schedule", included: true },
      { text: "Post-wedding vendor reviews help", included: true },
      { text: "Exclusive discounts from vendors", included: true },
      { text: "Wedding insurance guidance", included: true },
      { text: "Access to premium vendor network", included: true }
    ],
    cta: "Get VIP Service",
    popular: false
  }
];

const faqs = [
  {
    q: "Is the payment really one-time?",
    a: "Yes! Unlike subscription services, you pay once and get lifetime access to all features in your plan. No recurring charges, ever."
  },
  {
    q: "Can I upgrade my plan later?",
    a: "Absolutely! You can upgrade from Free to Premium or VIP anytime. Just pay the difference. We'll credit your previous payments."
  },
  {
    q: "What if I need to cancel a booking?",
    a: "Our platform fee is non-refundable, but vendor booking amounts follow individual vendor cancellation policies (shown before booking)."
  },
  {
    q: "Do vendors charge extra fees?",
    a: "No hidden charges! Vendors set their own prices, and we don't add any commission. The price you see is what you pay to the vendor."
  },
  {
    q: "What happens after my wedding?",
    a: "Your account remains active! You can still access your booking history, download invoices, leave reviews, and help other couples by sharing your story."
  },
  {
    q: "Is there a money-back guarantee?",
    a: "We offer a 7-day satisfaction guarantee. If you're not happy with Premium or VIP features, we'll refund your payment - no questions asked."
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <BhindiHeader />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
            Simple, Transparent Pricing
          </Badge>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl mb-6">
            Choose Your Perfect <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Wedding Plan</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            One-time payment. Lifetime access. No subscriptions, no recurring charges. Just pure wedding planning magic.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative rounded-3xl border-2 p-8 ${
                  plan.popular
                    ? 'border-primary shadow-2xl scale-105 bg-card'
                    : 'border-border/50 bg-card/50'
                } transition-all hover:shadow-xl`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
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
                <Link to={plan.name === 'Free' ? '/auth' : `/premium-upgrade?plan=${plan.name.toLowerCase()}`}>
                  <Button
                    className={`w-full mb-6 ${
                      plan.popular
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-card border-2 border-border hover:bg-accent/10'
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                      )}
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

      {/* For Vendors Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            Are You a Vendor?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join Karlo Shaadi for FREE! No commission on bookings. Get verified, showcase your work, and connect with 50,000+ couples.
          </p>
          <Link to="/vendor/onboarding">
            <Button size="lg" className="rounded-full px-8">
              Join as Vendor - Free Forever
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6">
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
            Join 50,000+ happy couples who found their perfect vendors on Karlo Shaadi
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8">
              Start Planning - It's Free!
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}