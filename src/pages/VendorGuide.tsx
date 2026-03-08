

import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  UserPlus, 
  Camera, 
  Calendar, 
  MessageSquare, 
  CreditCard,
  Star,
  Shield,
  TrendingUp,
  Clock,
  FileCheck,
  Award,
  ArrowRight,
  Sparkles,
  Users,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    number: 1,
    title: "Create Your Account",
    icon: UserPlus,
    description: "Sign up as a vendor with your business email",
    details: [
      "Go to 'For Vendors' page and click 'Get Started'",
      "Enter your email and create a secure password",
      "Verify your email address",
      "You'll receive vendor role automatically"
    ],
    tip: "Use your business email for professional communication"
  },
  {
    number: 2,
    title: "Complete Your Profile",
    icon: FileCheck,
    description: "Fill in your business details and service information",
    details: [
      "Enter your business name and category (Photography, Catering, etc.)",
      "Select your city from the available locations",
      "Write a compelling description of your services",
      "Add your experience years, team size, and contact details",
      "Include your Instagram handle and website URL"
    ],
    tip: "A complete profile gets 3x more inquiries than incomplete ones"
  },
  {
    number: 3,
    title: "Upload Your Portfolio",
    icon: Camera,
    description: "Showcase your best work with high-quality images",
    details: [
      "Upload at least 10-15 high-quality images",
      "Use bulk upload feature for faster uploads",
      "Add titles and descriptions to each image",
      "Organize by event type or style",
      "Keep images under 5MB each for best performance"
    ],
    tip: "Portfolios with 15+ images get 50% more bookings"
  },
  {
    number: 4,
    title: "Set Your Services & Pricing",
    icon: CreditCard,
    description: "Define your service packages and pricing",
    details: [
      "Add your main services with clear descriptions",
      "Set price ranges (min-max) for flexibility",
      "Specify what's included in each package",
      "Update pricing based on seasons if needed"
    ],
    tip: "Clear pricing builds trust and reduces back-and-forth"
  },
  {
    number: 5,
    title: "Manage Your Availability",
    icon: Calendar,
    description: "Keep your calendar updated to avoid double bookings",
    details: [
      "Mark dates when you're unavailable",
      "Block dates for confirmed bookings",
      "Update regularly during wedding season",
      "Enable calendar sync if available"
    ],
    tip: "Updated calendars reduce 70% of booking conflicts"
  },
  {
    number: 6,
    title: "Get Verified",
    icon: Shield,
    description: "Complete verification for the 'Verified' badge",
    details: [
      "Our admin team will review your profile",
      "Ensure all information is accurate",
      "Respond to any verification queries promptly",
      "Verification typically takes 24-48 hours"
    ],
    tip: "Verified vendors get priority in search results"
  }
];

const features = [
  {
    icon: MessageSquare,
    title: "Direct Messaging",
    description: "Chat directly with couples, answer queries, and build relationships"
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track profile views, inquiries, booking rates, and revenue"
  },
  {
    icon: Star,
    title: "Review Management",
    description: "Receive and respond to reviews from verified bookings"
  },
  {
    icon: TrendingUp,
    title: "Premium Listings",
    description: "Upgrade to Featured or Sponsored for more visibility"
  }
];

const tiers = [
  {
    name: "Free",
    price: "₹0",
    features: [
      "Basic listing",
      "Up to 10 portfolio images",
      "Basic analytics",
      "Standard search placement"
    ],
    highlight: false
  },
  {
    name: "Featured",
    price: "₹4,999/mo",
    features: [
      "Top 5 search placement",
      "Unlimited portfolio images",
      "Advanced analytics",
      "Featured badge",
      "Priority support"
    ],
    highlight: true
  },
  {
    name: "Sponsored",
    price: "₹9,999/mo",
    features: [
      "Homepage featured",
      "Top 3 in all searches",
      "Dedicated account manager",
      "Zero transaction fees",
      "Premium badge"
    ],
    highlight: false
  }
];

const faqs = [
  {
    question: "How long does verification take?",
    answer: "Verification typically takes 24-48 business hours. Make sure your profile is complete and all information is accurate to speed up the process."
  },
  {
    question: "Can I change my category later?",
    answer: "Yes, you can update your category by contacting support. However, we recommend choosing the right category from the start for better SEO."
  },
  {
    question: "What happens when I get a booking?",
    answer: "You'll receive a notification with booking details. Review and accept/decline within 24 hours. Once accepted, you can communicate directly with the couple."
  },
  {
    question: "How do payments work?",
    answer: "Couples pay in milestones: 30% advance at booking, and 70% after service completion. Payments are processed securely through Razorpay."
  },
  {
    question: "Can I offer discounts?",
    answer: "Yes! You can create special offers and discounts from your dashboard. These will be highlighted on your profile."
  }
];

export default function VendorGuide() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Vendor Onboarding Guide | Karlo Shaadi"
        description="Complete step-by-step guide for vendors to join Karlo Shaadi, set up their profile, and start receiving bookings."
      />
      <BhindiHeader />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Vendor Onboarding
          </Badge>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl mb-6">
            Welcome to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Karlo Shaadi</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Your complete guide to setting up your vendor profile, attracting couples, and growing your wedding business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/vendor-auth">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/vendor-pricing">
                View Pricing Plans
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-4 sm:px-6 border-y border-border/50 bg-card/30">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary">5,000+</div>
              <div className="text-muted-foreground text-sm">Active Vendors</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary">50,000+</div>
              <div className="text-muted-foreground text-sm">Monthly Visitors</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary">₹10Cr+</div>
              <div className="text-muted-foreground text-sm">Bookings Processed</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary">4.8★</div>
              <div className="text-muted-foreground text-sm">Vendor Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Step-by-Step Setup Guide
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Follow these 6 simple steps to get your vendor profile live and start receiving bookings
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, idx) => (
              <Card key={idx} className="overflow-hidden border-2 hover:border-primary/30 transition-colors">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                        <step.icon className="w-5 h-5 text-primary" />
                        {step.title}
                      </CardTitle>
                      <p className="text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2 mb-4">
                    {step.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                    <div className="flex items-start gap-2">
                      <Award className="w-5 h-5 text-accent flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-accent">Pro Tip:</span>{" "}
                        <span className="text-muted-foreground">{step.tip}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor Features */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Powerful Vendor Tools
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to manage and grow your wedding business
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="border-2 hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers Quick Overview */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Choose Your Plan
            </h2>
            <p className="text-muted-foreground text-lg">
              Start free and upgrade as you grow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier, idx) => (
              <Card 
                key={idx} 
                className={`border-2 relative ${tier.highlight ? 'border-primary shadow-lg shadow-primary/10' : 'border-border/50'}`}
              >
                {tier.highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle>{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{tier.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link to="/vendor-pricing">
                View Full Pricing Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-4 sm:px-6 bg-card/50">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="border-2 border-border/50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            Ready to Start?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of wedding vendors and grow your business with Karlo Shaadi
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/vendor-auth">
              Create Your Vendor Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      
    </div>
  );
}
