import { BhindiFooter } from "@/components/BhindiFooter";
import { ReviewsSection } from "@/components/ReviewsSection";
import { BentoGrid } from "@/components/BentoGrid";
import { TensionsSection } from "@/components/TensionsSection";
import { SponsoredVendorsCarousel } from "@/components/SponsoredVendorsCarousel";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { HeroSearchWidget } from "@/components/HeroSearchWidget";
import { TrustStatsBanner } from "@/components/TrustStatsBanner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroWedding from "@/assets/hero-wedding-phere.jpeg";
import sectionVendors from "@/assets/section-vendors.jpg";
import sectionProcess from "@/assets/section-process.jpg";
import sectionHumorRescue from "@/assets/section-humor-rescue.jpg";
import sectionHumorVendors from "@/assets/section-humor-vendors.jpg";
import { Shield, CheckCircle2, Star, Users, Sparkles, Calculator, Calendar } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FOMOBanner } from "@/components/FOMOBanner";
import { SocialProofPopup } from "@/components/SocialProofPopup";
import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { useParallax } from "@/hooks/usePremiumAnimations";
import { AIMatchmakingDialog } from "@/components/AIMatchmakingDialog";

const Index = () => {
  const section1 = useScrollAnimation({ threshold: 0.2 });
  const section2 = useScrollAnimation({ threshold: 0.2 });
  const section3 = useScrollAnimation({ threshold: 0.2 });
  const section4 = useScrollAnimation({ threshold: 0.2 });
  const humorSection1 = useScrollAnimation({ threshold: 0.2 });
  const humorSection2 = useScrollAnimation({ threshold: 0.2 });
  
  const { ref: parallaxRef, offset } = useParallax(0.3);
  const [isLoaded, setIsLoaded] = useState(false);
  const [aiMatchmakingOpen, setAiMatchmakingOpen] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden w-full max-w-[100vw]">
      <SEO 
        title="India's #1 Wedding Planning Platform"
        description="Plan your dream Indian wedding with Karlo Shaadi. Book verified vendors for photography, catering, venues, decoration, and more. 50,000+ happy couples trust us."
        keywords="indian wedding planning, wedding vendors, wedding photographer, wedding caterer, wedding venue, shaadi planning"
      />
      
      {/* FOMO Components */}
      <FOMOBanner />
      <SocialProofPopup />
      {/* Hero Section */}
      <section className="relative min-h-[65vh] sm:min-h-[75vh] md:min-h-screen flex flex-col overflow-hidden w-full max-w-[100vw] pt-20 sm:pt-24">
        {/* Background */}
        <div 
          ref={parallaxRef}
          className="absolute inset-0 z-0"
          style={{ transform: `translateY(${offset * 0.3}px) scale(1.05)` }}
        >
          <img 
            src={heroWedding} 
            alt="Indian wedding ceremony" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/40 to-background" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-6 sm:py-8">
          <div className="container mx-auto px-4 sm:px-6">
            <div className={`w-full max-w-4xl mx-auto transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              {/* Headline */}
              <div className="text-center mb-4 sm:mb-6 md:mb-8">
                <h1 className="font-display font-semibold text-xl sm:text-2xl md:text-4xl lg:text-5xl leading-tight text-white drop-shadow-lg">
                  <span className={`inline-block hero-text-reveal ${isLoaded ? '' : 'opacity-0'}`}>Aap</span>{' '}
                  <span className={`inline-block font-quote italic font-normal hero-text-reveal hero-text-reveal-delay-1 ${isLoaded ? '' : 'opacity-0'}`}>Shaadi</span>{' '}
                  <span className={`inline-block hero-text-reveal hero-text-reveal-delay-2 ${isLoaded ? '' : 'opacity-0'}`}>Karo,</span>
                  <br />
                  <span className={`inline-block hero-text-reveal hero-text-reveal-delay-3 ${isLoaded ? '' : 'opacity-0'}`}>Tension Hum Sambhal Lenge</span>
                </h1>
                <p className={`text-white/90 text-xs sm:text-sm md:text-lg mt-2 sm:mt-3 hero-text-reveal hero-text-reveal-delay-4 ${isLoaded ? '' : 'opacity-0'}`}>
                  India's Most Trusted Wedding Platform
                </p>
              </div>

              {/* Hero Search Widget */}
              <div className={`hero-text-reveal hero-text-reveal-delay-5 ${isLoaded ? '' : 'opacity-0'}`}>
                <HeroSearchWidget />
                
                {/* 2-Minute Wedding Plan CTA */}
                <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                  <Link to="/plan-wizard">
                    <Button
                      size="lg"
                      className="rounded-full px-8 sm:px-10 h-12 sm:h-14 text-sm sm:text-base font-semibold shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-primary/30 hover:shadow-xl w-full sm:w-auto"
                    >
                      Get Your 2-Minute Wedding Plan
                    </Button>
                  </Link>
                  <Button
                    onClick={() => setAiMatchmakingOpen(true)}
                    variant="outline"
                    className="bg-white/90 hover:bg-white border-accent/30 hover:border-accent text-foreground gap-2 rounded-full px-4 sm:px-6 h-9 sm:h-10 text-xs sm:text-sm shadow-lg"
                  >
                    AI Vendor Matchmaking
                  </Button>
                </div>
                
                {/* Quick Tools Row */}
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  <Link to="/budget-calculator">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/70 hover:bg-white/90 text-foreground gap-1.5 rounded-full text-xs"
                    >
                      <Calculator className="h-3.5 w-3.5" />
                      Budget Calculator
                    </Button>
                  </Link>
                  <Link to="/muhurat-finder">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/70 hover:bg-white/90 text-foreground gap-1.5 rounded-full text-xs"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      2025 Muhurats
                    </Button>
                  </Link>
                </div>
              </div>

              {/* AI Matchmaking Dialog */}
              <AIMatchmakingDialog open={aiMatchmakingOpen} onOpenChange={setAiMatchmakingOpen} />
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 md:h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      {/* Trust Stats Banner */}
      <TrustStatsBanner />

      {/* Tensions Section */}
      <TensionsSection />

      {/* Live Activity Feed - Social Proof */}
      <LiveActivityFeed />

      {/* Sponsored Vendors Carousel */}
      <SponsoredVendorsCarousel />

      {/* Value Proposition Section */}
      <section ref={humorSection1.ref} className="py-8 sm:py-12 md:py-16 relative overflow-hidden bg-gradient-to-b from-rose-50/50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className={`max-w-5xl mx-auto ${humorSection1.isVisible ? 'scroll-reveal-scale is-visible' : 'scroll-reveal-scale'}`}>
            <div className="text-center mb-4 sm:mb-6">
              <div className="inline-block px-2.5 py-1 rounded-lg bg-accent/15 border border-accent/30 mb-3">
                <span className="text-accent font-semibold text-xs">Your Wedding, Simplified</span>
              </div>
              <h2 className="font-display font-semibold text-xl sm:text-2xl md:text-3xl mb-2 px-2">
                We Handle Everything, <span className="text-accent">You Celebrate</span>
              </h2>
              <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent/50 via-accent to-accent/50 mx-auto rounded-full mb-3" />
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed px-2">
                Focus on your love story while we take care of the details
              </p>
            </div>
            
            <div className="relative rounded-lg sm:rounded-xl overflow-hidden aspect-video shadow-lg border border-accent/20 group">
              <img src={sectionHumorRescue} alt="Wedding planning" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-6">
              {[
                { title: "300+ Calls", subtitle: "Handled for you" },
                { title: "Zero Fraud", subtitle: "Fully verified" },
                { title: "Your Day", subtitle: "Stress-free" }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="text-center p-2 sm:p-3 rounded-lg bg-white border border-accent/20 hover:border-accent/40 transition-all duration-300"
                >
                  <h3 className="font-semibold text-xs sm:text-sm text-accent">{item.title}</h3>
                  <p className="text-[9px] sm:text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: For Vendors */}
      <section ref={section1.ref} className="py-8 sm:py-12 md:py-16 relative bg-gradient-to-b from-white via-amber-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-5 sm:gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            {/* Content */}
            <div className={`space-y-3 sm:space-y-5 ${section1.isVisible ? 'scroll-reveal-left is-visible' : 'scroll-reveal-left'}`}>
              <div className="inline-block px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-primary text-xs font-semibold">For Vendors</span>
              </div>
              
              <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl">
                Grow Your Wedding<br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Business 10x Faster</span>
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />

              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Join India's #1 wedding platform. Get verified, showcase your portfolio, and connect with ready-to-book clients.
              </p>

              <div className="space-y-2">
                {[
                  { icon: Users, text: "50,000+ active couples" },
                  { icon: Shield, text: "Secure payments" },
                  { icon: Star, text: "Verified reviews" },
                  { icon: CheckCircle2, text: "Zero commission" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    </div>
                    <p className="text-foreground text-xs sm:text-sm">{item.text}</p>
                  </div>
                ))}
              </div>

              <Button size="sm" variant="default" className="rounded-full px-5 h-9">
                Join as Vendor
              </Button>
            </div>

            {/* Image */}
            <div className={`hidden lg:block ${section1.isVisible ? 'scroll-reveal-right is-visible' : 'scroll-reveal-right'}`}>
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] group">
                <img src={sectionVendors} alt="Professional vendors at work" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Vendors Section */}
      <section ref={humorSection2.ref} className="py-8 sm:py-12 md:py-16 relative bg-gradient-to-b from-white via-rose-50/40 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className={`max-w-6xl mx-auto ${humorSection2.isVisible ? 'scroll-reveal is-visible' : 'scroll-reveal'}`}>
            <div className="text-center mb-5 sm:mb-8">
              <div className="inline-block px-2.5 py-1 rounded-lg bg-accent/15 border border-accent/30 mb-3">
                <span className="text-accent font-semibold text-xs">Our Experts</span>
              </div>
              <h2 className="font-display font-semibold text-xl sm:text-2xl md:text-3xl mb-2 px-2">
                Industry-Leading <span className="text-accent">Wedding Professionals</span>
              </h2>
              <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent/50 via-accent to-accent/50 mx-auto rounded-full mb-3" />
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed px-2">
                Every vendor is vetted for quality, reliability, and professionalism
              </p>
            </div>
            
            <div className="relative rounded-lg sm:rounded-xl overflow-hidden aspect-video shadow-lg border border-accent/20 mb-5 sm:mb-8 group">
              <img src={sectionHumorVendors} alt="Professional wedding vendors" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {[
                { title: "Photography", specialty: "Capturing moments", description: "Professional photographers documenting weddings beautifully." },
                { title: "Catering", specialty: "Culinary excellence", description: "Expert caterers handling large events with precision." },
                { title: "Decoration", specialty: "Venue transformation", description: "Creative decorators bringing your vision to life." },
                { title: "Entertainment", specialty: "Perfect atmosphere", description: "Experienced DJs and performers for your guests." }
              ].map((vendor, i) => (
                <div 
                  key={i} 
                  className="bg-white border border-accent/20 rounded-lg p-3 sm:p-4 hover:border-accent/40 transition-all duration-300"
                >
                  <h3 className="text-sm sm:text-base font-semibold mb-0.5">{vendor.title}</h3>
                  <div className="text-accent font-medium text-xs mb-1">{vendor.specialty}</div>
                  <p className="text-muted-foreground text-xs leading-relaxed hidden sm:block">{vendor.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 sm:mt-8 text-center">
              <Link to="/categories">
                <Button size="sm" className="rounded-full px-6">
                  Browse All Vendors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section ref={section2.ref} className="py-16 sm:py-24 md:py-32 relative bg-gradient-to-b from-white via-amber-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Image */}
            <div className={`order-2 lg:order-1 ${section2.isVisible ? 'scroll-reveal-left is-visible' : 'scroll-reveal-left'}`}>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] img-luxury group border-2 border-accent/20">
                <img src={sectionProcess} alt="Wedding planning process" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
            </div>

            {/* Content */}
            <div className={`order-1 lg:order-2 space-y-8 ${section2.isVisible ? 'scroll-reveal-right is-visible' : 'scroll-reveal-right'}`}>
              <div className="inline-block px-4 py-2 rounded-full bg-accent/15 border border-accent/30">
                <span className="text-accent font-semibold text-sm">Simple Process</span>
              </div>
              
              <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl">
                Planning Made <span className="text-accent">Simple</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-accent to-primary rounded-full" />

              <div className="space-y-8">
                {[
                  { number: "01", title: "Tell Us Your Vision", description: "Share your wedding date, location, style preferences, and budget" },
                  { number: "02", title: "Get Matched", description: "We curate the perfect vendors based on your requirements" },
                  { number: "03", title: "Book & Relax", description: "Secure your vendors with our protected payment system and enjoy the journey" }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 items-start group" style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 border-2 border-accent/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:border-accent/50 transition-all duration-300">
                      <span className="text-accent font-bold text-lg">{step.number}</span>
                    </div>
                    <div className="group-hover:translate-x-2 transition-transform duration-300">
                      <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button size="lg" className="rounded-full px-8">
                Start Planning Free
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* BentoGrid */}
      <BentoGrid />

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Section 4: Success Stories */}
      <section ref={section3.ref} className="py-16 sm:py-24 md:py-32 relative" style={{ background: 'radial-gradient(ellipse at center, hsl(350 85% 55% / 0.05) 0%, transparent 50%)' }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Content */}
            <div className={`space-y-8 ${section3.isVisible ? 'scroll-reveal-left is-visible' : 'scroll-reveal-left'}`}>
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-primary text-sm font-semibold">Success Stories</span>
              </div>
              
              <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                Real Couples,<br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Real Celebrations</span>
              </h2>

              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Over 50,000 couples have trusted us with their special day. From intimate gatherings to grand celebrations, 
                we've been part of beautiful love stories across India.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Star className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div className="group-hover:translate-x-2 transition-transform duration-300">
                    <div className="text-2xl font-bold">4.9/5</div>
                    <div className="text-muted-foreground text-sm">Average Rating</div>
                  </div>
                </div>
              </div>

              <Link to="/testimonials">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-primary/30 hover:border-primary">
                  Read Their Stories
                </Button>
              </Link>
            </div>

            {/* Image */}
            <div className={section3.isVisible ? 'scroll-reveal-right is-visible' : 'scroll-reveal-right'}>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] img-luxury group">
                <img src={sectionHumorVendors} alt="Beautiful wedding venue" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section ref={section4.ref} className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className={`max-w-4xl mx-auto text-center ${section4.isVisible ? 'scroll-reveal-scale is-visible' : 'scroll-reveal-scale'}`}>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6">
              Ready to Start Your<br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Dream Wedding Journey?</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Join 50,000+ happy couples who planned their perfect wedding with zero stress. Your happily ever after starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/categories">
                <Button size="lg" variant="premium" className="text-lg px-10 py-6 rounded-full">
                  Explore Vendors
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="text-lg px-10 py-6 rounded-full border-primary/30 hover:border-primary">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <BhindiFooter />
    </div>
  );
};

export default Index;
