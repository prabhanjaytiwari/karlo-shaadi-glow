import { BhindiFooter } from "@/components/BhindiFooter";
import { ReviewsSection } from "@/components/ReviewsSection";
import { BentoGrid } from "@/components/BentoGrid";
import { TensionsSection } from "@/components/TensionsSection";
import { SponsoredVendorsCarousel } from "@/components/SponsoredVendorsCarousel";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroWedding from "@/assets/hero-wedding-phere.jpeg";
import sectionVendors from "@/assets/section-vendors.jpg";
import sectionProcess from "@/assets/section-process.jpg";
import sectionVenue from "@/assets/section-venue.jpg";
import sectionHumorRescue from "@/assets/section-humor-rescue.jpg";
import sectionHumorVendors from "@/assets/section-humor-vendors.jpg";
import { Shield, CheckCircle2, Star, Users } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useWeddingSounds } from "@/hooks/useWeddingSounds";
import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { useParallax } from "@/hooks/usePremiumAnimations";

const Index = () => {
  const section1 = useScrollAnimation({ threshold: 0.2 });
  const section2 = useScrollAnimation({ threshold: 0.2 });
  const section3 = useScrollAnimation({ threshold: 0.2 });
  const section4 = useScrollAnimation({ threshold: 0.2 });
  const humorSection1 = useScrollAnimation({ threshold: 0.2 });
  const humorSection2 = useScrollAnimation({ threshold: 0.2 });
  
  const { ref: parallaxRef, offset } = useParallax(0.3);
  const [isLoaded, setIsLoaded] = useState(false);

  const { playWelcomeSound } = useWeddingSounds();
  
  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => {
      playWelcomeSound();
    }, 500);
    return () => clearTimeout(timer);
  }, [playWelcomeSound]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden w-full max-w-[100vw]">
      <SEO 
        title="India's #1 Wedding Planning Platform"
        description="Plan your dream Indian wedding with Karlo Shaadi. Book verified vendors for photography, catering, venues, decoration, and more. 50,000+ happy couples trust us."
        keywords="indian wedding planning, wedding vendors, wedding photographer, wedding caterer, wedding venue, shaadi planning"
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] sm:min-h-screen flex flex-col overflow-hidden w-full max-w-[100vw] pt-16 sm:pt-20">
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
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className={`max-w-3xl mx-auto transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              {/* Glass Card */}
              <div className="relative rounded-xl md:rounded-2xl border border-white/20 bg-white/90 backdrop-blur-xl p-6 sm:p-8 md:p-12 shadow-xl">
                {/* Content */}
                <div className="relative text-center space-y-4 md:space-y-6">
                  {/* Headline */}
                  <h1 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground">
                    <span className={`inline-block hero-text-reveal ${isLoaded ? '' : 'opacity-0'}`}>Aap</span>{' '}
                    <span className={`inline-block font-quote italic font-normal text-primary hero-text-reveal hero-text-reveal-delay-1 ${isLoaded ? '' : 'opacity-0'}`}>Shaadi</span>{' '}
                    <span className={`inline-block hero-text-reveal hero-text-reveal-delay-2 ${isLoaded ? '' : 'opacity-0'}`}>Karo,</span>
                    <br />
                    <span className={`inline-block hero-text-reveal hero-text-reveal-delay-3 ${isLoaded ? '' : 'opacity-0'}`}>Tension Hum Sambhal Lenge</span>
                  </h1>

                  {/* Subtext */}
                  <p className={`text-muted-foreground text-sm sm:text-base md:text-lg max-w-lg mx-auto hero-text-reveal hero-text-reveal-delay-4 ${isLoaded ? '' : 'opacity-0'}`}>
                    India's Most Trusted Wedding Platform • 50,000+ Happy Couples
                  </p>

                  {/* CTA Buttons - 2 buttons only */}
                  <div className={`flex flex-col sm:flex-row gap-3 justify-center pt-2 hero-text-reveal hero-text-reveal-delay-5 ${isLoaded ? '' : 'opacity-0'}`}>
                    <Link to="/categories">
                      <Button size="lg" className="w-full sm:w-auto">
                        Explore Vendors
                      </Button>
                    </Link>
                    <Link to="/auth">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        Start Planning Free
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      {/* Tensions Section */}
      <TensionsSection />

      {/* Live Activity Feed - Social Proof */}
      <LiveActivityFeed />

      {/* Sponsored Vendors Carousel */}
      <SponsoredVendorsCarousel />

      {/* Value Proposition Section */}
      <section ref={humorSection1.ref} className="py-12 sm:py-16 md:py-20 relative overflow-hidden bg-gradient-to-b from-rose-50/50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className={`max-w-5xl mx-auto ${humorSection1.isVisible ? 'scroll-reveal-scale is-visible' : 'scroll-reveal-scale'}`}>
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-block px-3 py-1.5 rounded-lg bg-accent/15 border border-accent/30 mb-4">
                <span className="text-accent font-semibold text-xs sm:text-sm">Your Wedding, Simplified</span>
              </div>
              <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl mb-3 px-2">
                We Handle Everything, <span className="text-accent">You Celebrate</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 mx-auto rounded-full mb-4" />
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
                Focus on your love story while we take care of the details
              </p>
            </div>
            
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-video shadow-xl border-2 border-accent/20 group">
              <img src={sectionHumorRescue} alt="Wedding planning" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-8">
              {[
                { title: "300+ Calls", subtitle: "Handled for you" },
                { title: "Zero Fraud", subtitle: "Fully verified" },
                { title: "Your Day", subtitle: "Stress-free" }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="text-center p-3 sm:p-4 rounded-xl bg-white border-2 border-accent/20 hover:border-accent/50 hover:shadow-lg transition-all duration-300"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <h3 className="font-semibold text-xs sm:text-sm md:text-base text-accent">{item.title}</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: For Vendors */}
      <section ref={section1.ref} className="py-10 sm:py-16 md:py-20 relative bg-gradient-to-b from-white via-amber-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            {/* Content */}
            <div className={`space-y-4 sm:space-y-6 ${section1.isVisible ? 'scroll-reveal-left is-visible' : 'scroll-reveal-left'}`}>
              <div className="inline-block px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-primary text-xs sm:text-sm font-semibold">For Vendors</span>
              </div>
              
              <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl">
                Grow Your Wedding<br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Business 10x Faster</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />

              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Join India's #1 wedding platform. Get verified, showcase your portfolio, and connect with ready-to-book clients.
              </p>

              <div className="space-y-2 sm:space-y-3">
                {[
                  { icon: Users, text: "50,000+ active couples" },
                  { icon: Shield, text: "Secure payments" },
                  { icon: Star, text: "Verified reviews" },
                  { icon: CheckCircle2, text: "Zero commission" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group" style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300">
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <p className="text-foreground text-sm sm:text-base">{item.text}</p>
                  </div>
                ))}
              </div>

              <Button size="default" variant="default" className="rounded-full px-6 h-10">
                Join as Vendor
              </Button>
            </div>

            {/* Image */}
            <div className={`hidden lg:block ${section1.isVisible ? 'scroll-reveal-right is-visible' : 'scroll-reveal-right'}`}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] img-luxury group">
                <img src={sectionVendors} alt="Professional vendors at work" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Vendors Section */}
      <section ref={humorSection2.ref} className="py-16 sm:py-20 md:py-24 relative bg-gradient-to-b from-white via-rose-50/40 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className={`max-w-6xl mx-auto ${humorSection2.isVisible ? 'scroll-reveal is-visible' : 'scroll-reveal'}`}>
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-block px-4 py-2 rounded-lg bg-accent/15 border border-accent/30 mb-4">
                <span className="text-accent font-semibold text-sm">Our Experts</span>
              </div>
              <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl mb-4 px-2">
                Industry-Leading <span className="text-accent">Wedding Professionals</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 mx-auto rounded-full mb-4" />
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                Every vendor is vetted for quality, reliability, and professionalism
              </p>
            </div>
            
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-video shadow-xl border-2 border-accent/20 mb-8 group">
              <img src={sectionHumorVendors} alt="Professional wedding vendors" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                { title: "Photography", specialty: "Capturing moments", description: "Professional photographers with years of experience documenting weddings beautifully." },
                { title: "Catering", specialty: "Culinary excellence", description: "Expert caterers who handle large events with precision and accommodate all dietary needs." },
                { title: "Decoration", specialty: "Venue transformation", description: "Creative decorators who bring your vision to life with stunning setups." },
                { title: "Entertainment", specialty: "Perfect atmosphere", description: "Experienced DJs and performers who know how to engage your guests." }
              ].map((vendor, i) => (
                <div 
                  key={i} 
                  className="bg-white border-2 border-accent/20 rounded-xl p-5 sm:p-6 hover:border-accent/50 hover:shadow-lg transition-all duration-300"
                  style={{ transitionDelay: `${i * 75}ms` }}
                >
                  <h3 className="text-lg font-semibold mb-1">{vendor.title}</h3>
                  <div className="text-accent font-medium text-sm mb-2">{vendor.specialty}</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{vendor.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link to="/categories">
                <Button size="default" className="rounded-full px-8">
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
                <img src={sectionVenue} alt="Beautiful wedding venue" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
