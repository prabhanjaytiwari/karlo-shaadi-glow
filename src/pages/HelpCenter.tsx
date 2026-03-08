import { useState } from "react";
import { SEO } from "@/components/SEO";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Search,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Users,
  CreditCard,
  Calendar,
  Shield,
  Star,
  FileText,
  HelpCircle,
  ChevronRight,
  Headphones,
  BookOpen,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    icon: Users,
    title: "Getting Started",
    description: "Account setup, profile, and basics",
    articles: [
      "How to create an account",
      "Setting up your wedding profile",
      "Understanding dashboard features",
      "How to search for vendors"
    ],
    link: "/faq"
  },
  {
    icon: Calendar,
    title: "Bookings",
    description: "Making and managing bookings",
    articles: [
      "How to book a vendor",
      "Changing your booking date",
      "Cancellation policy explained",
      "What happens after booking"
    ],
    link: "/faq"
  },
  {
    icon: CreditCard,
    title: "Payments & Refunds",
    description: "Payment methods and refund process",
    articles: [
      "Accepted payment methods",
      "Understanding milestone payments",
      "How refunds work",
      "Payment security"
    ],
    link: "/cancellation-refunds"
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "Verification and security",
    articles: [
      "How vendor verification works",
      "Reporting issues",
      "Dispute resolution",
      "Data privacy"
    ],
    link: "/privacy"
  },
  {
    icon: Star,
    title: "Reviews",
    description: "Leaving and managing reviews",
    articles: [
      "How to leave a review",
      "Review guidelines",
      "Responding to reviews (vendors)",
      "Reporting fake reviews"
    ],
    link: "/faq"
  },
  {
    icon: FileText,
    title: "For Vendors",
    description: "Vendor-specific help",
    articles: [
      "Vendor onboarding guide",
      "Setting up services",
      "Managing availability",
      "Upgrading your plan"
    ],
    link: "/vendor-guide"
  }
];

const quickAnswers = [
  {
    question: "How do I cancel my booking?",
    answer: "Go to Dashboard → Bookings → Select booking → Click 'Cancel Booking'. Refund amount depends on how far in advance you cancel: 100% for 30+ days, 50% for 15-29 days, 25% for 7-14 days, 0% for less than 7 days."
  },
  {
    question: "How do milestone payments work?",
    answer: "Payments are split into milestones: 30% advance payment at booking confirmation, and 70% final payment after service completion. This protects both couples and vendors."
  },
  {
    question: "What does 'Verified Vendor' mean?",
    answer: "Verified vendors have passed our verification process including identity verification, business credentials check, portfolio review, and reference validation. Only verified vendors can accept bookings."
  },
  {
    question: "How do I contact a vendor?",
    answer: "Click 'Message' on any vendor profile to start a conversation. You need to be logged in to message vendors. All conversations are saved in your Messages section."
  },
  {
    question: "Can I get a refund?",
    answer: "Yes, refunds follow our cancellation policy. Full details are shown before booking. Refunds are processed within 5-7 business days to your original payment method."
  },
  {
    question: "How do I become a vendor?",
    answer: "Click 'For Vendors' in the menu, then 'Get Started'. Complete your profile with business details, portfolio, and wait for verification (24-48 hours). Check our Vendor Guide for detailed steps."
  }
];

const contactOptions = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team",
    availability: "Mon-Sat, 9am-6pm IST",
    action: "Start Chat",
    primary: true
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "support@karloshaadi.com",
    availability: "Response within 24 hours",
    action: "Send Email",
    href: "mailto:support@karloshaadi.com"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "+91 98765 43210",
    availability: "Mon-Sat, 10am-5pm IST",
    action: "Call Now",
    href: "tel:+919876543210"
  }
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  const filteredQuickAnswers = quickAnswers.filter(
    qa => 
      qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qa.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen bg-background ${isMobile ? 'pb-24' : ''}`}>
      <SEO 
        title="Help Center | Karlo Shaadi"
        description="Get help with your Karlo Shaadi account, bookings, payments, and more. Find answers to common questions or contact our support team."
      />
      <MobilePageHeader title="Help Center" />
      
      {/* Hero Section with Search */}
      <section className={isMobile ? "pt-4 pb-6 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/10" : "pt-32 pb-16 px-4 sm:px-6 bg-gradient-to-br from-primary/10 via-background to-accent/10"}>
        <div className="container mx-auto max-w-4xl text-center">
          {!isMobile && (
            <Badge variant="secondary" className="mb-4">
              <Headphones className="w-3 h-3 mr-1" />
              24/7 Support
            </Badge>
          )}
          <h1 className={isMobile ? "font-display font-bold text-2xl mb-3" : "font-display font-bold text-4xl sm:text-5xl md:text-6xl mb-6"}>
            How can we <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">help you?</span>
          </h1>
          {!isMobile && (
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Find answers to your questions or get in touch with our support team
            </p>
          )}
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-full border-2 border-border/50 focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4 sm:px-6 border-b border-border/50">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/faq">
                <HelpCircle className="w-4 h-4 mr-2" />
                FAQ
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/vendor-guide">
                <BookOpen className="w-4 h-4 mr-2" />
                Vendor Guide
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/cancellation-refunds">
                <CreditCard className="w-4 h-4 mr-2" />
                Refund Policy
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/privacy">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Policy
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-display font-bold text-2xl sm:text-3xl mb-8 text-center">
            Browse by Category
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, idx) => (
              <Link key={idx} to={category.link}>
                <Card className="h-full border-2 border-border/50 hover:border-primary/30 hover:shadow-lg transition-all group cursor-pointer">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {category.title}
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.articles.slice(0, 3).map((article, aIdx) => (
                        <li key={aIdx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                          {article}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Answers */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-2">
              Quick Answers
            </h2>
            <p className="text-muted-foreground">
              Most frequently asked questions
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {(searchQuery ? filteredQuickAnswers : quickAnswers).map((qa, idx) => (
              <AccordionItem 
                key={idx} 
                value={`qa-${idx}`}
                className="border-2 border-border/50 rounded-xl px-6 bg-card hover:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="font-semibold">{qa.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {qa.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {searchQuery && filteredQuickAnswers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
              <Button variant="link" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </div>
          )}

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/faq">
                View All FAQs
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-2">
              Still Need Help?
            </h2>
            <p className="text-muted-foreground">
              Our support team is ready to assist you
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {contactOptions.map((option, idx) => (
              <Card key={idx} className={`border-2 text-center ${option.primary ? 'border-primary bg-primary/5' : 'border-border/50'}`}>
                <CardContent className="pt-6">
                  <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${option.primary ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <option.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{option.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{option.description}</p>
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-4">
                    <Clock className="w-3 h-3" />
                    {option.availability}
                  </div>
                  {option.href ? (
                    <Button 
                      variant={option.primary ? "default" : "outline"} 
                      size="sm" 
                      className="w-full"
                      asChild
                    >
                      <a href={option.href}>{option.action}</a>
                    </Button>
                  ) : (
                    <Button 
                      variant={option.primary ? "default" : "outline"} 
                      size="sm" 
                      className="w-full"
                    >
                      {option.action}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Support Banner */}
      <section className="py-8 px-4 sm:px-6 bg-destructive/10 border-y border-destructive/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="font-semibold text-lg mb-2">
            🚨 Wedding Day Emergency?
          </h3>
          <p className="text-muted-foreground mb-4">
            If you're facing an urgent issue on your wedding day, call our emergency hotline
          </p>
          <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90" asChild>
            <a href="tel:+919876543210">
              <Phone className="w-4 h-4 mr-2" />
              Emergency: +91 98765 43210
            </a>
          </Button>
        </div>
      </section>

    </div>
  );
}
