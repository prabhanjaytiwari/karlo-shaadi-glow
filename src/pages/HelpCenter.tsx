import { useState } from "react";
import { SEO } from "@/components/SEO";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Search, MessageCircle, Phone, Mail, Clock, Users, CreditCard, Calendar,
  Shield, Star, FileText, HelpCircle, ChevronRight, Headphones, BookOpen, Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { icon: Users, title: "Getting Started", description: "Account setup, profile, and basics", articles: ["How to create an account", "Setting up your wedding profile", "Understanding dashboard features", "How to search for vendors"], link: "/faq" },
  { icon: Calendar, title: "Bookings", description: "Making and managing bookings", articles: ["How to book a vendor", "Changing your booking date", "Cancellation policy explained", "What happens after booking"], link: "/faq" },
  { icon: CreditCard, title: "Payments & Refunds", description: "Payment methods and refund process", articles: ["Accepted payment methods", "Understanding milestone payments", "How refunds work", "Payment security"], link: "/cancellation-refunds" },
  { icon: Shield, title: "Trust & Safety", description: "Verification and security", articles: ["How vendor verification works", "Reporting issues", "Dispute resolution", "Data privacy"], link: "/privacy" },
  { icon: Star, title: "Reviews", description: "Leaving and managing reviews", articles: ["How to leave a review", "Review guidelines", "Responding to reviews (vendors)", "Reporting fake reviews"], link: "/faq" },
  { icon: FileText, title: "For Vendors", description: "Vendor-specific help", articles: ["Vendor onboarding guide", "Setting up services", "Managing availability", "Upgrading your plan"], link: "/vendor-guide" },
];

const quickAnswers = [
  { question: "How do I cancel my booking?", answer: "Go to Dashboard → Bookings → Select booking → Click 'Cancel Booking'. Refund amount depends on how far in advance you cancel." },
  { question: "How do milestone payments work?", answer: "Payments are split into milestones: 30% advance at booking confirmation, and 70% final payment after service completion." },
  { question: "What does 'Verified Vendor' mean?", answer: "Verified vendors have passed our vetting process including identity verification, business credentials check, and portfolio review." },
  { question: "How do I contact a vendor?", answer: "Click 'Message' on any vendor profile to start a conversation. You need to be logged in to message vendors." },
  { question: "Can I get a refund?", answer: "Yes, refunds follow our cancellation policy. Full details are shown before booking. Refunds are processed within 5-7 business days." },
  { question: "How do I become a vendor?", answer: "Click 'For Vendors' in the menu, then 'Get Started'. Complete your profile with business details, portfolio, and wait for verification." },
];

const contactOptions = [
  { icon: MessageCircle, title: "Live Chat", description: "Chat with our support team", availability: "Mon-Sat, 9am-6pm IST", action: "Start Chat", primary: true },
  { icon: Mail, title: "Email Support", description: "support@karloshaadi.com", availability: "Response within 24 hours", action: "Send Email", href: "mailto:support@karloshaadi.com" },
  { icon: Phone, title: "Phone Support", description: "+91 70114 60321", availability: "Mon-Sat, 10am-5pm IST", action: "Call Now", href: "tel:+917011460321" },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  const filteredQuickAnswers = quickAnswers.filter(
    qa => qa.question.toLowerCase().includes(searchQuery.toLowerCase()) || qa.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen bg-background ${isMobile ? 'pb-24' : ''}`}>
      <SEO title="Help Center | Karlo Shaadi" description="Get help with your Karlo Shaadi account, bookings, payments, and more." />
      <MobilePageHeader title="Help Center" />
      
      {/* Hero with Search */}
      <section className={isMobile ? "pt-4 pb-6 px-4" : "pt-28 pb-12 px-4"}>
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className={isMobile ? "font-bold text-2xl mb-3" : "font-bold text-4xl mb-4"}>
            How can we help you?
          </h1>
          {!isMobile && <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">Find answers to your questions or get in touch with our support team</p>}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text" placeholder="Search for help articles..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-base rounded-full border border-border/50 shadow-[var(--shadow-sm)]"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-6 px-4 border-b border-border/30">
        <div className="container mx-auto max-w-5xl flex flex-wrap justify-center gap-3">
          {[
            { label: "FAQ", icon: HelpCircle, to: "/faq" },
            { label: "Vendor Guide", icon: BookOpen, to: "/vendor-guide" },
            { label: "Refund Policy", icon: CreditCard, to: "/cancellation-refunds" },
            { label: "Privacy Policy", icon: Shield, to: "/privacy" },
          ].map(l => (
            <Button key={l.to} variant="outline" size="sm" className="rounded-full border-border/50" asChild>
              <Link to={l.to}><l.icon className="w-4 h-4 mr-2" />{l.label}</Link>
            </Button>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-bold text-2xl mb-6 text-center">Browse by Category</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, idx) => (
              <Link key={idx} to={category.link}>
                <div className="rounded-2xl bg-card shadow-[var(--shadow-sm)] p-5 h-full hover:shadow-[var(--shadow-md)] hover:-translate-y-px transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{category.title}</h3>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                  <ul className="space-y-1.5">
                    {category.articles.slice(0, 3).map((article, aIdx) => (
                      <li key={aIdx} className="text-xs text-muted-foreground flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary/40" />{article}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Answers */}
      <section className="py-12 px-4 bg-muted/20">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="font-bold text-2xl mb-1">Quick Answers</h2>
            <p className="text-sm text-muted-foreground">Most frequently asked questions</p>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {(searchQuery ? filteredQuickAnswers : quickAnswers).map((qa, idx) => (
              <AccordionItem key={idx} value={`qa-${idx}`} className="border border-border/30 rounded-2xl px-5 bg-card">
                <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline py-4">{qa.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">{qa.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {searchQuery && filteredQuickAnswers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No results found for "{searchQuery}"</p>
              <Button variant="link" size="sm" onClick={() => setSearchQuery("")}>Clear search</Button>
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="font-bold text-2xl mb-1">Still Need Help?</h2>
            <p className="text-sm text-muted-foreground">Our support team is ready to assist you</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {contactOptions.map((option, idx) => (
              <div key={idx} className={`rounded-2xl p-5 text-center ${option.primary ? 'bg-primary/5 shadow-[var(--shadow-md)]' : 'bg-card shadow-[var(--shadow-sm)]'}`}>
                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${option.primary ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <option.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-1">{option.title}</h3>
                <p className="text-sm text-muted-foreground mb-1">{option.description}</p>
                <p className="text-xs text-muted-foreground mb-3 flex items-center justify-center gap-1"><Clock className="w-3 h-3" />{option.availability}</p>
                {option.href ? (
                  <Button variant={option.primary ? "default" : "outline"} size="sm" className="w-full rounded-full" asChild><a href={option.href}>{option.action}</a></Button>
                ) : (
                  <Button variant={option.primary ? "default" : "outline"} size="sm" className="w-full rounded-full">{option.action}</Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency */}
      <section className="py-6 px-4 bg-destructive/5 border-t border-destructive/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="font-semibold mb-1">🚨 Wedding Day Emergency?</h3>
          <p className="text-sm text-muted-foreground mb-3">If you're facing an urgent issue on your wedding day, call our emergency hotline</p>
          <Button size="sm" className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full" asChild>
            <a href="tel:+917011460321"><Phone className="w-4 h-4 mr-2" />Emergency: +91 70114 60321</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
