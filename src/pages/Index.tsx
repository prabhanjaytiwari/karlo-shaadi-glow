
import { ReviewsSection } from "@/components/ReviewsSection";
import { TensionsSection } from "@/components/TensionsSection";
import { SponsoredVendorsCarousel } from "@/components/SponsoredVendorsCarousel";
import { HeroSearchWidget } from "@/components/HeroSearchWidget";
import { TrustStatsBanner } from "@/components/TrustStatsBanner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CinematicImage } from "@/components/CinematicImage";
import { Shield, CheckCircle2, Star, Users, Calculator, Calendar, Heart, ArrowRight } from "lucide-react";
import { ShaadiSevaCounter } from "@/components/ShaadiSevaCounter";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FAQPageJsonLd, WebSiteJsonLd } from "@/components/JsonLd";

import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { useParallax } from "@/hooks/usePremiumAnimations";
import { AIMatchmakingDialog } from "@/components/AIMatchmakingDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthContext } from "@/contexts/AuthContext";
import { MobileHomeScreen } from "@/components/mobile/MobileHomeScreen";
import { cdn } from "@/lib/cdnAssets";

const Index = () => {
  const isMobile = useIsMobile();
  const { user, loading: authLoading } = useAuthContext();
  const section1 = useScrollAnimation({ threshold: 0.2 });
  const section2 = useScrollAnimation({ threshold: 0.2 });
  const section3 = useScrollAnimation({ threshold: 0.2 });
  const section4 = useScrollAnimation({ threshold: 0.2 });
  const { ref: parallaxRef, offset } = useParallax(0.3);
  const [isLoaded, setIsLoaded] = useState(false);
  const [aiMatchmakingOpen, setAiMatchmakingOpen] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (isMobile && !authLoading) {
    return <MobileHomeScreen />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden w-full max-w-[100vw]">
      <SEO
        title="India's #1 Wedding Planning Platform"
        description="Plan your dream Indian wedding with Karlo Shaadi. Verified vendors for photography, venues, catering, decoration, mehendi & more across 20+ cities. Zero commission."
        keywords="indian wedding planning, wedding vendors India, shaadi planning, wedding photographer, wedding venue, mehendi artist, bridal makeup, AI wedding planner, muhurat finder 2025 2026"
        url="/"
      />
      <WebSiteJsonLd />
      <FAQPageJsonLd faqs={[
        { question: "Is Karlo Shaadi free?", answer: "Yes! Creating an account, browsing vendors, and booking is completely free. We don't charge any commission or hidden fees." },
        { question: "How do I find wedding vendors near me?", answer: "Use our search or browse by city — we have verified vendors across 20+ Indian cities." },
        { question: "Are vendors on Karlo Shaadi verified?", answer: "Yes, every vendor goes through our verification process including identity checks and portfolio review." },
        { question: "What is Shaadi Seva?", answer: "10% of every payment goes to the Shaadi Seva Fund — supporting couples in need." },
      ]} />

      {/* ═══════════ HERO — Cinematic Full-Bleed ═══════════ */}
      <section className="relative min-h-[70vh] md:min-h-screen flex flex-col overflow-hidden w-full pt-20 sm:pt-24">
        <div ref={parallaxRef} className="absolute inset-0 z-0" style={{ transform: `translateY(${offset * 0.3}px) scale(1.05)` }}>
          <CinematicImage src={cdn.heroWeddingPhere} alt="Indian wedding ceremony with pheras" className="w-full h-full" cinematic objectPosition="center 25%" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-background" />
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center py-8">
          <div className="container mx-auto px-4 sm:px-6">
            <div className={`w-full max-w-4xl mx-auto transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-center mb-6 md:mb-10">
                {/* Elegant serif headline */}
                <h1 className="font-display font-semibold text-4xl md:text-6xl lg:text-7xl leading-[1.08] text-white drop-shadow-lg tracking-tight">
                  <span className={`inline-block hero-text-reveal ${isLoaded ? '' : 'opacity-0'}`}>Aap</span>{' '}
                  <span className={`inline-block font-quote italic font-normal hero-text-reveal hero-text-reveal-delay-1 ${isLoaded ? '' : 'opacity-0'}`}>Shaadi</span>{' '}
                  <span className={`inline-block hero-text-reveal hero-text-reveal-delay-2 ${isLoaded ? '' : 'opacity-0'}`}>Karo,</span>
                  <br />
                  <span className={`inline-block hero-text-reveal hero-text-reveal-delay-3 ${isLoaded ? '' : 'opacity-0'}`}>
                    Tension Hum{' '}
                    <span className="relative">
                      Sambhal Lenge
                      <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent/60 rounded-full" />
                    </span>
                  </span>
                </h1>
                <p className={`text-white/85 text-base sm:text-lg mt-4 font-body hero-text-reveal hero-text-reveal-delay-4 max-w-xl mx-auto ${isLoaded ? '' : 'opacity-0'}`}>
                  Where families find trusted vendors for their most cherished celebrations
                </p>
              </div>

              <div className={`hero-text-reveal hero-text-reveal-delay-5 ${isLoaded ? '' : 'opacity-0'}`}>
                <HeroSearchWidget />

                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-5">
                  <Link to="/plan-wizard">
                    <Button size="lg" className="rounded-full px-8 font-medium shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground">
                      2-Minute Wedding Plan
                    </Button>
                  </Link>
                  <Button onClick={() => setAiMatchmakingOpen(true)} variant="glass" className="rounded-full px-8 font-medium border border-white/30 bg-white/10 text-white hover:bg-white/20">
                    Find My Vendors
                  </Button>
                </div>
              </div>

              <AIMatchmakingDialog open={aiMatchmakingOpen} onOpenChange={setAiMatchmakingOpen} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 md:h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      {/* ═══════════ TRUST STATS ═══════════ */}
      <TrustStatsBanner />

      {/* ═══════════ EMOTIONAL STORY SECTION ═══════════ */}
      <section className="py-20 md:py-28 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-accent font-medium text-sm tracking-widest uppercase mb-3">Why Families Choose Us</p>
              <h2 className="font-display font-semibold text-3xl md:text-4xl lg:text-5xl leading-tight">
                Because Every <span className="font-quote italic text-primary">Rishta</span> Deserves<br />
                the Best Beginning
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg mt-4 max-w-2xl mx-auto">
                From the first <em>roka</em> to the final <em>vidaai</em>, we ensure every moment is handled with care, trust, and perfection.
              </p>
            </div>

            {/* Value cards — warm, minimal */}
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: Shield,
                  title: "Verified & Trusted",
                  description: "Every vendor undergoes identity verification, portfolio review, and reference checks before joining our platform.",
                },
                {
                  icon: Heart,
                  title: "Built for Indian Weddings",
                  description: "Muhurat dates, regional traditions, multi-event planning — designed for how Indian families actually plan weddings.",
                },
                {
                  icon: CheckCircle2,
                  title: "Zero Commission",
                  description: "We never take a cut from your vendor payments. What you negotiate is what you pay — completely transparent.",
                },
              ].map((item, i) => (
                <div key={i} className="p-7 rounded-2xl bg-card shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-5 group-hover:bg-primary/12 transition-colors">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORIES ═══════════ */}
      <TensionsSection />

      {/* ═══════════ PLANNING TOOLS ═══════════ */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <p className="text-accent font-medium text-sm tracking-widest uppercase mb-3">Free Planning Tools</p>
            <h2 className="font-display font-semibold text-3xl md:text-4xl">
              Your Wedding, <span className="font-quote italic text-primary">Planned Beautifully</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mt-3">
              Powerful tools for budgeting, finding auspicious dates, and creating stunning invitations — all completely free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { icon: Calculator, title: "Budget Calculator", desc: "Get a detailed breakdown based on city, guest count, and style", to: "/budget-calculator", cta: "Calculate Now" },
              { icon: Calendar, title: "Muhurat Finder", desc: "Find auspicious wedding dates for 2025 & 2026 with timings", to: "/muhurat-finder", cta: "Find Dates" },
              { icon: Heart, title: "Invite Creator", desc: "Create beautiful digital wedding invitations in seconds", to: "/invite-creator", cta: "Create Invite" },
            ].map((tool, i) => (
              <Link key={i} to={tool.to} className="group">
                <div className="relative h-full p-7 rounded-2xl bg-card shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                    <tool.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{tool.title}</h3>
                  <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{tool.desc}</p>
                  <span className="inline-flex items-center text-primary text-sm font-medium gap-1 group-hover:gap-2 transition-all">
                    {tool.cta} <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Viral tools pills */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-10 max-w-3xl mx-auto">
            {[
              { label: "Couple Quiz", to: "/couple-quiz" },
              { label: "Family Frame", to: "/family-frame" },
              { label: "Vendor Checker", to: "/vendor-check" },
              { label: "Speech Writer", to: "/speech-writer" },
              { label: "Music Generator", to: "/music-generator" },
            ].map((tool) => (
              <Link key={tool.to} to={tool.to} className="px-4 py-2 rounded-full border border-border hover:border-primary/30 hover:bg-primary/5 text-xs font-medium text-muted-foreground hover:text-foreground transition-all">
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SPONSORED VENDORS ═══════════ */}
      <SponsoredVendorsCarousel />

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section ref={section2.ref} className="py-20 md:py-28 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
            {/* Image */}
            <div className={`${section2.isVisible ? 'scroll-reveal-left is-visible' : 'scroll-reveal-left'}`}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-[var(--shadow-lg)] group">
                <CinematicImage src={cdn.weddingFireworks} alt="Grand Indian wedding celebration" className="w-full h-full" cinematic />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white/90 font-display text-lg font-medium">Every celebration, flawlessly orchestrated</p>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className={`space-y-8 ${section2.isVisible ? 'scroll-reveal-right is-visible' : 'scroll-reveal-right'}`}>
              <div>
                <p className="text-accent font-medium text-sm tracking-widest uppercase mb-3">Simple Process</p>
                <h2 className="font-display font-semibold text-3xl md:text-4xl">
                  From Vision to <span className="font-quote italic text-primary">Vidaai</span>
                </h2>
              </div>

              <div className="space-y-8">
                {[
                  { number: "01", title: "Share Your Vision", description: "Tell us your wedding date, city, style, and budget — we'll do the rest" },
                  { number: "02", title: "Meet Your Vendors", description: "We handpick verified professionals matched to your exact needs" },
                  { number: "03", title: "Celebrate Freely", description: "Book with secure payments and enjoy every moment stress-free" },
                ].map((step, i) => (
                  <div key={i} className="flex gap-5 items-start group">
                    <div className="w-12 h-12 rounded-full border-2 border-accent/30 flex items-center justify-center flex-shrink-0 group-hover:border-accent group-hover:bg-accent/5 transition-all duration-300">
                      <span className="text-accent font-display font-semibold text-sm">{step.number}</span>
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg mb-1">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/plan-wizard">
                <Button size="lg" className="rounded-full px-8">
                  Start Planning Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ REVIEWS ═══════════ */}
      <ReviewsSection />

      {/* ═══════════ SHAADI SEVA ═══════════ */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 mb-5">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-primary text-sm font-medium">Shaadi Seva</span>
            </div>
            <h2 className="font-display font-semibold text-3xl md:text-4xl mb-4">
              Your Celebration Helps<br />
              <span className="font-quote italic text-primary">Someone Else Get Married</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
              10% of every payment on Karlo Shaadi goes to the Shaadi Seva Fund — supporting financially disadvantaged couples and <em>Saamuhik Vivaah</em> events across India.
            </p>
            <ShaadiSevaCounter />
            <Link to="/shaadi-seva">
              <Button variant="outline" className="rounded-full mt-6 px-6">
                Learn About Shaadi Seva
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ FOR VENDORS ═══════════ */}
      <section ref={section1.ref} className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
            <div className={`space-y-6 ${section1.isVisible ? 'scroll-reveal-left is-visible' : 'scroll-reveal-left'}`}>
              <p className="text-accent font-medium text-sm tracking-widest uppercase">For Wedding Professionals</p>

              <h2 className="font-display font-semibold text-3xl md:text-4xl">
                Grow Your Wedding<br />
                <span className="font-quote italic text-primary">Business With Us</span>
              </h2>

              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Join India's zero-commission wedding platform. Get verified, showcase your portfolio, and connect with couples who are ready to book.
              </p>

              <div className="space-y-3">
                {[
                  { icon: Users, text: "Couples across 20+ cities actively looking" },
                  { icon: Shield, text: "100% secure milestone payments" },
                  { icon: Star, text: "Only verified, authentic reviews" },
                  { icon: CheckCircle2, text: "Start free — upgrade when you grow" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-4 w-4 text-accent" />
                    </div>
                    <p className="text-foreground text-sm">{item.text}</p>
                  </div>
                ))}
              </div>

              <Link to="/for-vendors">
                <Button size="lg" className="rounded-full px-8">
                  Join as Vendor
                </Button>
              </Link>
            </div>

            <div className={`hidden lg:block ${section1.isVisible ? 'scroll-reveal-right is-visible' : 'scroll-reveal-right'}`}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-[var(--shadow-lg)] group">
                <CinematicImage src={cdn.weddingCoupleRomantic} alt="Happy wedding couple" className="w-full h-full" cinematic sharp />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section ref={section4.ref} className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        {/* Subtle mandala-inspired pattern */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className={`max-w-3xl mx-auto text-center ${section4.isVisible ? 'scroll-reveal-scale is-visible' : 'scroll-reveal-scale'}`}>
            <h2 className="font-display font-semibold text-3xl md:text-4xl lg:text-5xl mb-5 text-primary-foreground leading-tight">
              Your Dream Wedding<br />
              <span className="font-quote italic">Starts Here</span>
            </h2>
            <p className="text-primary-foreground/85 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join thousands of families who planned their perfect celebration with zero stress and zero commission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/categories">
                <Button size="lg" className="rounded-full px-10 bg-white text-primary hover:bg-white/90 font-semibold shadow-lg">
                  Explore Vendors
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="rounded-full px-10 border-2 border-white/30 text-white hover:bg-white/10">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Index;
