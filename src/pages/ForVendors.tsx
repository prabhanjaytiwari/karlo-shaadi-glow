
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle2, TrendingUp, Users, Shield, Star, Zap, IndianRupee, Camera, Utensils, MapPin, Palette, Sparkles, ArrowRight, BadgeCheck, BarChart3, MessageSquare, Phone, Check, Crown, Gem, Gift, Clock, Award } from "lucide-react";
import { SEO } from "@/components/SEO";
import { FAQPageJsonLd } from "@/components/JsonLd";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CompetitorComparison } from "@/components/vendor/CompetitorComparison";
import { VendorToolShowcase } from "@/components/vendor/VendorToolShowcase";
import vendorHeroImg from "@/assets/vendor-landing-hero.jpg";
import vendorDashboardImg from "@/assets/vendor-landing-dashboard.jpg";
import vendorEarlybirdImg from "@/assets/vendor-landing-earlybird.jpg";
import vendorTeamImg from "@/assets/vendor-landing-team.jpg";

const vendorCategoryDefs = [
  { name: "Photographers", icon: Camera, dbCategory: "photography" },
  { name: "Caterers", icon: Utensils, dbCategory: "catering" },
  { name: "Venues", icon: MapPin, dbCategory: "venues" },
  { name: "Decorators", icon: Palette, dbCategory: "decoration" },
  { name: "Makeup Artists", icon: Sparkles, dbCategory: "makeup" },
  { name: "DJs & Music", icon: Zap, dbCategory: "music" },
];

const vendorFaqs = [
  { question: "Is it free to register as a vendor on Karlo Shaadi?", answer: "Yes, registration is completely free. You can create your vendor profile, upload your portfolio, and start receiving inquiries at zero cost. We never charge commission on your bookings." },
  { question: "How does Karlo Shaadi help me get more wedding bookings?", answer: "We use AI-powered matching to connect you with couples whose requirements match your services, budget range, and location. Couples can send you direct inquiries, view your portfolio, and book you — all through the platform." },
  { question: "What is the Karlo Shaadi Verified Badge?", answer: "The Verified Badge is earned after completing our verification process — including identity verification, portfolio review, and reference checks. Verified vendors appear higher in search results and receive 3x more inquiries on average." },
  { question: "Does Karlo Shaadi charge commission on bookings?", answer: "No. Unlike WedMeGood, Shaadidukaan, or other platforms that charge 15-20% commission, Karlo Shaadi charges zero commission. We monetize through optional premium subscription tiers that give you extra visibility and features." },
  { question: "What categories of wedding vendors can register?", answer: "We accept all wedding service categories: Photography, Videography, Venues, Catering, Decoration, Makeup Artists, Mehendi Artists, Music & DJ, Entertainment, Invitations, Choreography, Transport, Jewelry, Pandit Services, and more." },
  { question: "How do I manage my bookings and inquiries?", answer: "Your vendor dashboard gives you a complete overview of all inquiries, bookings, payments, and reviews. You can respond to inquiries, manage your calendar availability, update pricing, and track your business analytics — all in one place." },
  { question: "What are the premium subscription plans?", answer: "We offer Starter (₹999/mo), Pro (₹2,999/mo), and Elite (₹6,999/mo) plans. Premium vendors get priority listing, featured placement, advanced analytics, bulk portfolio uploads, and dedicated account support. All plans are month-to-month with no long-term contracts." },
  { question: "Which cities does Karlo Shaadi operate in?", answer: "We serve 20+ cities across India including Delhi, Mumbai, Lucknow, Bangalore, Hyderabad, Kolkata, Chennai, Pune, Jaipur, Ahmedabad, Chandigarh, Udaipur, and more. We're expanding rapidly to new cities every month." },
];

const plans = [
  {
    id: 'free', name: 'Free', price: 0, priceDisplay: 'Free', period: 'Forever',
    description: 'Get started with basic visibility',
    features: ['Basic listing in search', 'Profile page', 'Up to 5 portfolio images', 'Email notifications', 'Direct couple inquiries'],
    cta: 'Register Free', highlight: false, premium: false,
  },
  {
    id: 'starter', name: 'Starter', price: 999, priceDisplay: '₹999', period: '/mo',
    badge: 'STARTER',
    description: 'Enhanced visibility for growing businesses',
    features: ['All Free features', 'Top 10 in search results', 'Silver verified badge', '15 portfolio images', 'Analytics dashboard', '7% transaction fee'],
    cta: 'Start with Starter', highlight: false, premium: false,
  },
  {
    id: 'pro', name: 'Pro', price: 2999, priceDisplay: '₹2,999', period: '/mo',
    badge: 'MOST POPULAR',
    description: 'Stand out and get 3x more inquiries',
    features: ['All Starter features', 'Top 5 in search', 'Gold verified badge', 'Unlimited portfolio', 'Advanced analytics', '3% transaction fee', 'Featured in category'],
    cta: 'Go Pro', highlight: true, premium: false,
  },
  {
    id: 'elite', name: 'Elite', price: 6999, priceDisplay: '₹6,999', period: '/mo',
    badge: 'BEST VALUE',
    description: 'Maximum visibility, VIP treatment',
    features: ['All Pro features', 'Homepage carousel', '#1 in all searches', 'Diamond badge', 'Zero transaction fees', 'Dedicated manager', 'Custom URL'],
    cta: 'Go Elite', highlight: false, premium: true,
  },
];

const ForVendors = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: vendorStats } = useQuery({
    queryKey: ["vendor-stats-for-vendors"],
    queryFn: async () => {
      const [vendorsResult, citiesResult] = await Promise.all([
        supabase.from("vendors").select("category", { count: "exact" }).eq("is_active", true),
        supabase.from("cities").select("id", { count: "exact", head: true }).eq("is_active", true),
      ]);
      const catCounts: Record<string, number> = {};
      if (vendorsResult.data) {
        vendorsResult.data.forEach((v: any) => {
          catCounts[v.category] = (catCounts[v.category] || 0) + 1;
        });
      }
      return {
        totalVendors: vendorsResult.data?.length || 0,
        totalCities: citiesResult.count || 20,
        categoryCounts: catCounts,
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  const totalVendors = vendorStats?.totalVendors || 0;
  const totalCities = vendorStats?.totalCities || 20;
  const categoryCounts = vendorStats?.categoryCounts || {};
  const spotsLeft = Math.max(0, 500 - totalVendors);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Register as Wedding Vendor — Zero Commission | Karlo Shaadi"
        description="Join India's fastest-growing wedding vendor platform. Zero commission, verified badge, AI-powered couple matching. Free registration for photographers, caterers, venues, decorators across 20+ cities."
        keywords="wedding vendor registration, list wedding business, wedding photographer platform, wedding vendor marketplace India, zero commission wedding platform"
      />
      <FAQPageJsonLd faqs={vendorFaqs} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Register as Wedding Vendor - Karlo Shaadi",
            "description": "Free vendor registration on India's zero-commission wedding platform",
            "url": "https://karloshaadi.com/for-vendors",
            "mainEntity": {
              "@type": "Service",
              "name": "Karlo Shaadi Vendor Registration",
              "serviceType": "Wedding Vendor Marketplace",
              "provider": { "@type": "Organization", "name": "Karlo Shaadi", "url": "https://karloshaadi.com" },
              "areaServed": { "@type": "Country", "name": "India" },
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "description": "Free vendor registration with zero commission" }
            }
          })
        }}
      />

      <MobilePageHeader title="For Vendors" />

      <main className={isMobile ? "pb-24" : "pt-20"}>
        {/* ═══ HERO ═══ */}
        <section className="relative overflow-hidden">
          <div className="relative h-[75vh] min-h-[520px] max-h-[680px]">
            <img
              src={vendorHeroImg}
              alt="Indian wedding photographer at mandap venue"
              className="w-full h-full object-cover"
              width={1920} height={1080}
              style={{ filter: 'contrast(1.05) saturate(1.1) brightness(0.55)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 mb-4">
                    <BadgeCheck className="h-4 w-4 text-accent" />
                    <span className="text-white/80 text-xs font-semibold">Zero Commission Platform</span>
                  </div>

                  <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-white mb-4">
                    Apna Wedding Business<br />
                    <span className="text-accent">10x Karo</span> — Zero Commission
                  </h1>

                  <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-lg mb-6">
                    {totalVendors > 0 ? `${totalVendors}+ vendors already growing.` : "500+ vendors already growing."} AI-powered couple matching. Complete business dashboard. <span className="text-white/80 font-medium">Kya aap next ho?</span>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      size="xl"
                      onClick={() => navigate("/vendor/onboarding")}
                      className="rounded-full px-10 font-bold text-base"
                    >
                      Register Free Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <a href="#dashboard-preview">
                      <Button size="lg" variant="outline" className="rounded-full px-8 bg-white/10 text-white border-white/20 hover:bg-white/20 w-full sm:w-auto">
                        Watch Demo ↓
                      </Button>
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ TRUST STRIP ═══ */}
        <section className="py-8 border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex flex-wrap justify-center gap-6 md:gap-16">
              {[
                { value: `${totalVendors || 500}+`, label: "Active Vendors" },
                { value: "0%", label: "Commission" },
                { value: `${totalCities}+`, label: "Cities" },
                { value: "₹2Cr+", label: "Revenue Generated" },
                { value: "10K+", label: "Leads Delivered" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ COMPETITOR COMPARISON ═══ */}
        <CompetitorComparison />

        {/* ═══ CTA AFTER COMPARISON ═══ */}
        <div className="text-center pb-12">
          <Button size="lg" onClick={() => navigate("/vendor/onboarding")} className="rounded-full px-10 font-bold">
            Switch to Zero Commission <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* ═══ TOOL SHOWCASE ═══ */}
        <VendorToolShowcase />

        {/* ═══ DASHBOARD PREVIEW ═══ */}
        <section id="dashboard-preview" className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display font-bold text-xl md:text-3xl text-foreground mb-3">
                  Your Business, <span className="text-accent">One Dashboard</span>
                </h2>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  Track leads, manage bookings, send invoices, and watch your business grow — all from one powerful dashboard built for wedding vendors.
                </p>
                <div className="space-y-3 mb-6">
                  {["Real-time lead pipeline & CRM", "Booking calendar with availability", "Revenue analytics & growth charts", "Digital contracts & invoice generator"].map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-accent flex-shrink-0" />
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </div>
                <Button onClick={() => navigate("/vendor/onboarding")} className="rounded-full px-8 font-semibold">
                  Get Your Dashboard Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-border">
                  <img
                    src={vendorDashboardImg}
                    alt="Vendor business dashboard preview"
                    className="w-full h-auto"
                    loading="lazy"
                    width={1024} height={1024}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-display font-bold text-xl md:text-3xl text-foreground">
                  Start Getting Bookings in <span className="text-accent">4 Simple Steps</span>
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { num: "01", title: "Register Free", desc: "2-minute signup. No fees, no credit card.", icon: Users },
                  { num: "02", title: "Build Profile", desc: "Portfolio, pricing, services & availability.", icon: Camera },
                  { num: "03", title: "Get Verified", desc: "Earn the trust badge. 3x more inquiries.", icon: BadgeCheck },
                  { num: "04", title: "Get Bookings", desc: "Smart matching sends you ready-to-book couples.", icon: TrendingUp },
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center p-5 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                      <step.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div className="text-xs font-bold text-accent mb-1">{step.num}</div>
                    <h3 className="font-semibold text-base text-foreground mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ INLINE PRICING ═══ */}
        <section className="py-16 md:py-24 border-t border-border bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="text-center mb-10">
              <h2 className="font-display font-bold text-xl md:text-3xl text-foreground mb-2">
                Simple, Transparent Pricing
              </h2>
              <p className="text-muted-foreground text-sm">Start free. Upgrade when you see results. No contracts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`relative rounded-2xl p-5 transition-all duration-200 ${
                    plan.highlight
                      ? 'bg-foreground text-background shadow-xl scale-[1.02]'
                      : plan.premium
                        ? 'bg-card border-2 border-accent/30 shadow-md'
                        : 'bg-card border border-border shadow-sm hover:shadow-md'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        plan.highlight ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'
                      }`}>
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="mb-4 mt-2">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <p className={`text-xs ${plan.highlight ? 'text-background/70' : 'text-muted-foreground'}`}>{plan.description}</p>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold">{plan.priceDisplay}</span>
                    {plan.period !== 'Forever' && (
                      <span className={`text-sm ${plan.highlight ? 'text-background/60' : 'text-muted-foreground'}`}>{plan.period}</span>
                    )}
                  </div>

                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <Check className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-accent' : 'text-accent'}`} />
                        <span className={plan.highlight ? 'text-background/80' : ''}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full rounded-xl ${plan.highlight ? 'bg-background text-foreground hover:bg-background/90' : ''}`}
                    variant={plan.highlight ? 'default' : plan.premium ? 'default' : 'outline'}
                    onClick={() => navigate("/vendor/onboarding")}
                  >
                    {plan.cta}
                  </Button>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              30-day money-back guarantee on all paid plans. No lock-in contracts.
            </p>
          </div>
        </section>

        {/* ═══ EARLY VENDOR ADVANTAGE ═══ */}
        <section className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden aspect-video lg:aspect-square"
              >
                <img
                  src={vendorEarlybirdImg}
                  alt="Early bird VIP vendor pass"
                  className="w-full h-full object-contain bg-muted/30"
                  loading="lazy"
                  width={1024} height={1024}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
                  <Gift className="h-4 w-4 text-accent" />
                  <span className="text-accent text-xs font-bold">LIMITED OFFER</span>
                </div>

                <h2 className="font-display font-bold text-xl md:text-3xl text-foreground mb-3">
                  First 500 Vendors — <span className="text-accent">Free Forever</span>
                </h2>

                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  Be among the first 500 vendors to register and get permanent free access to premium features. Early joiners also get:
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    { icon: Award, text: "Founding Vendor badge on your profile" },
                    { icon: TrendingUp, text: "Priority placement in search results" },
                    { icon: Crown, text: "Free Starter plan benefits for life" },
                    { icon: Clock, text: "Early access to all new features" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-4 w-4 text-accent" />
                      </div>
                      <span className="text-sm text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>

                {spotsLeft > 0 && (
                  <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">Spots claimed</span>
                      <span className="text-xs font-bold text-accent">{500 - spotsLeft}/500</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-accent rounded-full h-2 transition-all duration-1000"
                        style={{ width: `${((500 - spotsLeft) / 500) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Only <span className="font-bold text-accent">{spotsLeft}</span> spots left in your city!
                    </p>
                  </div>
                )}

                <Button size="lg" onClick={() => navigate("/vendor/onboarding")} className="rounded-full px-10 font-bold">
                  Claim Your Free Spot <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ VENDOR SUCCESS STORIES ═══ */}
        <section className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="text-center mb-10">
              <h2 className="font-display font-bold text-xl md:text-3xl text-foreground mb-2">
                Vendors Love Karlo Shaadi
              </h2>
              <p className="text-muted-foreground text-sm">Real results from real wedding vendors</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {[
                { name: "Rajesh Photography", city: "Delhi", metric: "40+", metricLabel: "inquiries/month", quote: "We got 40+ inquiries in our first month. The zero commission model means we keep every rupee we earn.", rating: 5 },
                { name: "Ananya Mehendi Arts", city: "Lucknow", metric: "₹3.5L", metricLabel: "monthly revenue", quote: "The smart matching sends us couples who actually fit our budget range. No more time wasted on mismatched leads.", rating: 5 },
                { name: "Royal Caterers", city: "Jaipur", metric: "35%", metricLabel: "revenue increase", quote: "Unlike other platforms, Karlo Shaadi doesn't take a cut from our bookings. Our revenue increased by 35% after joining.", rating: 5 },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-2xl bg-card border border-border"
                >
                  <div className="text-center mb-4 p-3 rounded-xl bg-accent/5">
                    <div className="text-2xl font-bold text-accent">{t.metric}</div>
                    <div className="text-xs text-muted-foreground">{t.metricLabel}</div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 text-accent fill-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 italic leading-relaxed">"{t.quote}"</p>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.city}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CATEGORIES ═══ */}
        <section className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-xl md:text-3xl text-foreground mb-2">All Categories Welcome</h2>
              <p className="text-muted-foreground text-sm">Join the fastest-growing wedding platform in India</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
              {vendorCategoryDefs.map((cat, i) => {
                const count = categoryCounts?.[cat.dbCategory] || 0;
                return (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="text-center p-4 rounded-2xl bg-card border border-border hover:bg-muted hover:shadow-sm transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                      <cat.icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-sm text-foreground mb-1">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground">{count > 0 ? `${count}+` : "Join now"}</p>
                  </motion.div>
                );
              })}
            </div>
            <p className="text-center text-xs text-muted-foreground/60 mt-5">
              Also: Mehendi, Invitations, Choreography, Entertainment, Transport, Jewelry, Pandit, Bridal Wear, and more
            </p>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display font-bold text-xl md:text-3xl text-center text-foreground mb-8">
                Frequently Asked Questions
              </h2>

              <Accordion type="single" collapsible className="space-y-3">
                {vendorFaqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="border border-border rounded-2xl px-5 bg-card hover:border-accent/20 transition-colors data-[state=open]:bg-muted/50"
                  >
                    <AccordionTrigger className="text-left text-sm sm:text-base font-semibold hover:no-underline py-4 text-foreground">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm pb-4 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        <section className="relative overflow-hidden">
          <div className="relative h-[55vh] min-h-[400px]">
            <img
              src={vendorTeamImg}
              alt="Indian wedding vendor team"
              className="w-full h-full object-cover"
              loading="lazy"
              width={1280} height={832}
              style={{ filter: 'contrast(1.05) saturate(1.1) brightness(0.5)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-5 px-6 max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="font-display font-bold text-2xl md:text-4xl text-white mb-3">
                    Aaj Hi Register Karo.<br />
                    <span className="text-accent">Kal Se Bookings Aayengi.</span>
                  </h2>
                  <p className="text-white/50 text-sm max-w-xl mx-auto mb-6">
                    Join {totalVendors || 500}+ vendors across {totalCities}+ cities. Zero commission. Free forever for early joiners.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button size="xl" onClick={() => navigate("/vendor/onboarding")} className="rounded-full px-10 font-bold text-base">
                      Register Free Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <a href="tel:+917011460321">
                      <Button size="lg" variant="outline" className="rounded-full px-8 bg-white/10 text-white border-white/20 hover:bg-white/20 w-full sm:w-auto">
                        <Phone className="mr-2 h-4 w-4" /> Talk to Us
                      </Button>
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ForVendors;
