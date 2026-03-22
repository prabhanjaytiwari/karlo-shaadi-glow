
import { ReviewsSection } from "@/components/ReviewsSection";
import { BentoGrid } from "@/components/BentoGrid";
import { TensionsSection } from "@/components/TensionsSection";
import { SponsoredVendorsCarousel } from "@/components/SponsoredVendorsCarousel";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { HeroSearchWidget } from "@/components/HeroSearchWidget";
import { TrustStatsBanner } from "@/components/TrustStatsBanner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CinematicImage } from "@/components/CinematicImage";
import heroWedding from "@/assets/hero-wedding-phere.jpeg";
import weddingCoupleRomantic from "@/assets/wedding-couple-romantic.jpg";
import weddingFireworks from "@/assets/wedding-fireworks.jpg";
import weddingCeremony from "@/assets/wedding-ceremony.jpg";
import weddingManifesting from "@/assets/wedding-manifesting.jpg";
import { Shield, CheckCircle2, Star, Users, Calculator, Calendar, Heart } from "lucide-react";
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

const Index = () => {
  const isMobile = useIsMobile();
  const { user, loading: authLoading } = useAuthContext();
  const section1 = useScrollAnimation({
    threshold: 0.2
  });
  const section2 = useScrollAnimation({
    threshold: 0.2
  });
  const section3 = useScrollAnimation({
    threshold: 0.2
  });
  const section4 = useScrollAnimation({
    threshold: 0.2
  });
  const humorSection1 = useScrollAnimation({
    threshold: 0.2
  });
  const humorSection2 = useScrollAnimation({
    threshold: 0.2
  });
  const {
    ref: parallaxRef,
    offset
  } = useParallax(0.3);
  const [isLoaded, setIsLoaded] = useState(false);
  const [aiMatchmakingOpen, setAiMatchmakingOpen] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // All mobile users see the app home screen
  if (isMobile && !authLoading) {
    return <MobileHomeScreen />;
  }

  return <div className="min-h-screen bg-background text-foreground overflow-x-hidden w-full max-w-[100vw]">
      <SEO
        title="India's #1 Wedding Planning Platform"
        description="Plan your dream Indian wedding with Karlo Shaadi. Verified vendors for photography, venues, catering, decoration, mehendi & more across 20+ cities. Zero commission. AI planner, budget calculator & muhurat finder — all free."
        keywords="indian wedding planning, wedding vendors India, wedding photographer near me, wedding caterer India, wedding venue India, shaadi planning, mehendi artist, bridal makeup, wedding DJ, wedding decoration, AI wedding planner, wedding budget calculator, muhurat finder 2025 2026, destination wedding India, zero commission wedding, शादी प्लानर, शादी वेंडर, विवाह फोटोग्राफर, शादी का खर्च, बेस्ट वेडिंग प्लानर इंडिया, shaadi vendor dhundhe, wedding booking India, vivah photographer, mehendi wala near me, dulhan makeup artist"
        url="/"
      />
      <WebSiteJsonLd />
      <FAQPageJsonLd faqs={[
        { question: "Is Karlo Shaadi free?", answer: "Yes! Creating an account, browsing vendors, and booking is completely free. We don't charge any commission or hidden fees." },
        { question: "How do I find wedding vendors near me?", answer: "Use our search or browse by city — we have verified vendors across 20+ Indian cities including Delhi, Mumbai, Lucknow, Bangalore, and more." },
        { question: "Are vendors on Karlo Shaadi verified?", answer: "Yes, every vendor goes through our verification process including identity checks, portfolio review, and reference validation." },
        { question: "What is the 2-Minute Wedding Plan?", answer: "It's a free AI-powered tool that generates a complete wedding plan with budget breakdown, timeline, and vendor recommendations — no signup needed." },
        { question: "What is Shaadi Seva?", answer: "10% of every payment on Karlo Shaadi goes to the Shaadi Seva Fund — supporting financially disadvantaged couples and Saamuhik Vivaah (mass wedding) events." },
      ]} />
      
      {/* Hero Section */}
      <section className="relative min-h-[65vh] sm:min-h-[75vh] md:min-h-screen flex flex-col overflow-hidden w-full max-w-[100vw] pt-20 sm:pt-24">
        {/* Background */}
        <div ref={parallaxRef} className="absolute inset-0 z-0" style={{ transform: `translateY(${offset * 0.3}px) scale(1.05)` }}>
          <CinematicImage src={heroWedding} alt="Indian wedding ceremony" className="w-full h-full" cinematic objectPosition="center 25%" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-background" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-6 sm:py-8">
          <div className="container mx-auto px-4 sm:px-6">
            <div className={`w-full max-w-4xl mx-auto transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-center mb-4 sm:mb-6 md:mb-8">
                <h1 className="font-display font-semibold text-3xl md:text-5xl leading-tight text-white drop-shadow-lg">
                  <span className={`inline-block hero-text-reveal ${isLoaded ? '' : 'opacity-0'}`}>Aap</span>{' '}
                  <span className={`inline-block font-quote italic font-normal hero-text-reveal hero-text-reveal-delay-1 ${isLoaded ? '' : 'opacity-0'}`}>Shaadi</span>{' '}
                  <span className={`inline-block hero-text-reveal hero-text-reveal-delay-2 ${isLoaded ? '' : 'opacity-0'}`}>Karo,</span>
                  <br />
                  <span className={`inline-block hero-text-reveal hero-text-reveal-delay-3 ${isLoaded ? '' : 'opacity-0'}`}>Tension Hum Sambhal Lenge</span>
                </h1>
                <p className={`text-white/90 text-sm sm:text-base mt-2 sm:mt-3 hero-text-reveal hero-text-reveal-delay-4 ${isLoaded ? '' : 'opacity-0'}`}>
                  India's Most Trusted Wedding Platform
                </p>
              </div>

              <div className={`hero-text-reveal hero-text-reveal-delay-5 ${isLoaded ? '' : 'opacity-0'}`}>
                <HeroSearchWidget />
                
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-5">
                  <Link to="/plan-wizard">
                    <Button size="lg" className="rounded-full px-8 font-medium shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground">
                      2-Minute Wedding Plan
                    </Button>
                  </Link>
                  <Button onClick={() => setAiMatchmakingOpen(true)} variant="glass" className="rounded-full px-8 font-medium border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20">
                    Vendor Matching
                  </Button>
                </div>
              </div>

              <AIMatchmakingDialog open={aiMatchmakingOpen} onOpenChange={setAiMatchmakingOpen} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 md:h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      {/* Trust Stats Banner */}
      <TrustStatsBanner />

      {/* Tensions Section */}
      <TensionsSection />

      {/* Free Wedding Tools Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted mb-4">
              <span className="text-primary text-sm font-medium">Free Planning Tools</span>
            </div>
            <h2 className="font-display font-semibold text-2xl md:text-3xl mb-3">
              Plan Your Perfect Wedding <span className="text-primary">For Free</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto mt-2">
              Use our powerful tools to budget, find auspicious dates, and create beautiful invites
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {/* Budget Calculator */}
            <Link to="/budget-calculator" className="group">
              <div className="relative h-full p-6 sm:p-8 rounded-2xl bg-card shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-200 hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <Calculator className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Budget Calculator</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Get a detailed breakdown of your wedding budget based on city, guest count, and preferences
                </p>
                <span className="inline-flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  Calculate Now <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </Link>

            {/* Muhurat Finder */}
            <Link to="/muhurat-finder" className="group">
              <div className="relative h-full p-6 sm:p-8 rounded-2xl bg-card shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-200 hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Muhurat Finder</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Find the most auspicious wedding dates for 2025 & 2026 with detailed timings
                </p>
                <span className="inline-flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  Find Dates <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </Link>

            {/* Invite Creator */}
            <Link to="/invite-creator" className="group">
              <div className="relative h-full p-6 sm:p-8 rounded-2xl bg-card shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-200 hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Invite Creator</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Create stunning wedding invitations in seconds with your details
                </p>
                <span className="inline-flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  Create Invite <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Viral Tools Row */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-3xl mx-auto">
            {[
              { label: "Couple Quiz", to: "/couple-quiz" },
              { label: "Family Frame", to: "/family-frame" },
              { label: "Vendor Checker", to: "/vendor-check" },
              { label: "Speech Writer", to: "/speech-writer" },
              { label: "Music Generator", to: "/music-generator" },
            ].map((tool) => (
              <Link key={tool.to} to={tool.to} className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-xs font-medium text-muted-foreground hover:text-foreground transition-all">
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsored Vendors Carousel */}
      <SponsoredVendorsCarousel />

      {/* Value Proposition Section */}
      <section ref={humorSection1.ref} className="py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className={`max-w-5xl mx-auto ${humorSection1.isVisible ? 'scroll-reveal-scale is-visible' : 'scroll-reveal-scale'}`}>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted mb-4">
                <span className="text-accent font-medium text-sm">Your Wedding, Simplified</span>
              </div>
              <h2 className="font-display font-semibold text-2xl md:text-3xl mb-3">
                We Handle Everything, <span className="text-accent">You Celebrate</span>
              </h2>
              
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Focus on your love story while we take care of the details
              </p>
            </div>
            
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-video shadow-[var(--shadow-md)] group">
              <CinematicImage src={weddingCeremony} alt="Beautiful wedding ceremony" className="w-full h-full" cinematic />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-6">
              {[{
              title: "300+ Calls",
              subtitle: "Handled for you"
            }, {
              title: "Zero Fraud",
              subtitle: "Fully verified"
            }, {
              title: "Your Day",
              subtitle: "Stress-free"
            }].map((item, i) => <div key={i} className="text-center p-2 sm:p-3 rounded-xl bg-card shadow-[var(--shadow-xs)]">
                  <h3 className="font-semibold text-xs sm:text-sm text-accent">{item.title}</h3>
                  <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: For Vendors */}
      <section ref={section1.ref} className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-5 sm:gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            {/* Content */}
            <div className={`space-y-3 sm:space-y-5 ${section1.isVisible ? 'scroll-reveal-left is-visible' : 'scroll-reveal-left'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted">
                <span className="text-muted-foreground text-sm font-medium">For Vendors</span>
              </div>
              
              <h2 className="font-display font-semibold text-2xl md:text-3xl">
                Grow Your Wedding<br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Business 10x Faster</span>
              </h2>
              

              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Join India's #1 wedding platform. Get verified, showcase your portfolio, and connect with ready-to-book clients.
              </p>

              <div className="space-y-2">
                {[{
                icon: Users,
                text: "Couples across 20+ cities"
              }, {
                icon: Shield,
                text: "100% secure payments"
              }, {
                icon: Star,
                text: "Verified reviews only"
              }, {
                icon: CheckCircle2,
                text: "Start free, pay when booked"
              }].map((item, i) => <div key={i} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    </div>
                    <p className="text-foreground text-sm">{item.text}</p>
                  </div>)}
              </div>

              <Link to="/for-vendors">
                <Button size="default" className="rounded-full px-6">
                  Join as Vendor
                </Button>
              </Link>
            </div>

            {/* Image */}
            <div className={`hidden lg:block ${section1.isVisible ? 'scroll-reveal-right is-visible' : 'scroll-reveal-right'}`}>
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] group">
                <CinematicImage src={weddingCoupleRomantic} alt="Happy wedding couple" className="w-full h-full" cinematic sharp />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Activity Feed (replaces Expert Vendors) */}
      <LiveActivityFeed />

      {/* Section 3: How It Works */}
      <section ref={section2.ref} className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Image */}
            <div className={`order-2 lg:order-1 ${section2.isVisible ? 'scroll-reveal-left is-visible' : 'scroll-reveal-left'}`}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-[var(--shadow-md)] group">
                <CinematicImage src={weddingFireworks} alt="Wedding celebration with fireworks" className="w-full h-full" cinematic />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
            </div>

            {/* Content */}
            <div className={`order-1 lg:order-2 space-y-8 ${section2.isVisible ? 'scroll-reveal-right is-visible' : 'scroll-reveal-right'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted">
                <span className="text-muted-foreground font-medium text-sm">Simple Process</span>
              </div>
              
              <h2 className="font-display font-semibold text-2xl md:text-3xl">
                Planning Made <span className="text-accent">Simple</span>
              </h2>
              

              <div className="space-y-8">
                {[{
                number: "01",
                title: "Tell Us Your Vision",
                description: "Share your wedding date, location, style preferences, and budget"
              }, {
                number: "02",
                title: "Get Matched",
                description: "We curate the perfect vendors based on your requirements"
              }, {
                number: "03",
                title: "Book & Relax",
                description: "Secure your vendors with our protected payment system and enjoy the journey"
              }].map((step, i) => <div key={i} className="flex gap-6 items-start group" style={{
                transitionDelay: `${i * 100}ms`
              }}>
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                      <span className="text-accent font-semibold text-lg">{step.number}</span>
                    </div>
                     <div className="group-hover:translate-x-1 transition-transform duration-200">
                      <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm sm:text-base">{step.description}</p>
                    </div>
                  </div>)}
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

      {/* Shaadi Seva Impact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted mb-4">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-primary text-sm font-medium">Shaadi Seva</span>
            </div>
            <h2 className="font-display font-semibold text-2xl md:text-3xl mb-3">
              Every Wedding You Plan <span className="text-primary">Helps Someone Get Married</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-xl mx-auto">
              10% of every payment on Karlo Shaadi goes to the Shaadi Seva Fund — supporting couples in need and Saamuhik Vivaah events.
            </p>
            <ShaadiSevaCounter />
            <Link to="/shaadi-seva">
              <Button variant="outline" className="rounded-full mt-6 px-6">
                See How Shaadi Seva Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* BentoGrid */}
      <BentoGrid />

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Section 4: Success Stories */}
      <section ref={section3.ref} className="py-16 md:py-24 relative" style={{
      background: 'radial-gradient(ellipse at center, hsl(350 85% 55% / 0.05) 0%, transparent 50%)'
    }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Content */}
            <div className={`space-y-8 ${section3.isVisible ? 'scroll-reveal-left is-visible' : 'scroll-reveal-left'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted">
                <span className="text-muted-foreground text-sm font-medium">Success Stories</span>
              </div>
              
              <h2 className="font-display font-semibold text-2xl md:text-3xl">
                Real Couples,<br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Real Celebrations</span>
              </h2>

              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Couples across India have trusted us with their special day. From intimate gatherings to grand celebrations, 
                we're building beautiful love stories together.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center flex-shrink-0">
                     <Star className="h-6 w-6 text-accent" />
                   </div>
                  <div className="group-hover:translate-x-2 transition-transform duration-300">
                    <div className="text-2xl font-semibold">4.9/5</div>
                    <div className="text-muted-foreground text-sm">Average Rating</div>
                  </div>
                </div>
              </div>

              <Link to="/testimonials">
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Read Their Stories
                </Button>
              </Link>
            </div>

            {/* Image */}
            <div className={section3.isVisible ? 'scroll-reveal-right is-visible' : 'scroll-reveal-right'}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-[var(--shadow-md)] group">
                <CinematicImage src={weddingManifesting} alt="Beautiful wedding couple" className="w-full h-full" cinematic sharp />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section ref={section4.ref} className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className={`max-w-4xl mx-auto text-center ${section4.isVisible ? 'scroll-reveal-scale is-visible' : 'scroll-reveal-scale'}`}>
            <h2 className="font-display font-semibold text-2xl md:text-3xl mb-6">
              Ready to Start Your<br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Dream Wedding Journey?</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto mb-8">
              Plan your perfect wedding with zero stress and zero commission. Your happily ever after starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/categories">
                <Button size="lg" variant="premium" className="rounded-full px-8">
                  Explore Vendors
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vendor Acquisition Banner */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h2 className="font-display font-semibold text-2xl md:text-3xl">
              Are You a <span className="text-accent">Wedding Vendor?</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              Register free on India's zero-commission wedding platform. Grow your business with verified leads and zero commission.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/for-vendors">
                <Button size="lg" className="rounded-full px-8">
                  Register as Vendor — Free
                </Button>
              </Link>
              <Link to="/vendor-check">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-accent/30 hover:border-accent">
                  Check Your Vendor Score
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>;
};
export default Index;
