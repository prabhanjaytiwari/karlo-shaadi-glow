import { BhindiFooter } from "@/components/BhindiFooter";
import { ReviewsSection } from "@/components/ReviewsSection";
import { BentoGrid } from "@/components/BentoGrid";
import { TensionsSection } from "@/components/TensionsSection";
import { SponsoredVendorsCarousel } from "@/components/SponsoredVendorsCarousel";
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
      
      {/* Hero Section - Premium Parallax */}
      <section className="relative min-h-screen flex flex-col overflow-hidden w-full max-w-[100vw] pt-20">
        {/* Parallax Background */}
        <div 
          ref={parallaxRef}
          className="absolute inset-0 z-0"
          style={{ transform: `translateY(${offset * 0.5}px) scale(1.1)` }}
        >
          <img 
            src={heroWedding} 
            alt="Indian wedding ceremony" 
            className="w-full h-full object-cover transition-transform duration-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-background" />
        </div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-accent/10 blur-3xl float-slow" />
          <div className="absolute top-1/3 right-20 w-48 h-48 rounded-full bg-primary/10 blur-3xl float-medium" style={{ animationDelay: '-2s' }} />
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 rounded-full bg-accent/15 blur-2xl float-fast" style={{ animationDelay: '-4s' }} />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="container mx-auto px-6">
            <div className={`max-w-5xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              {/* Frosted Glass Card with Premium Effects */}
              <div className="relative rounded-2xl md:rounded-[3rem] border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl p-6 sm:p-8 md:p-12 lg:p-16 shadow-2xl mx-0 sm:mx-4 max-w-full hover:border-white/30 transition-all duration-500">
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl md:rounded-[3rem] bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Content */}
                <div className="relative text-center space-y-4 sm:space-y-6 md:space-y-8">
                  {/* Headline with Premium Text Reveal */}
                  <h1 className="font-display font-bold sm:text-3xl md:text-5xl lg:text-7xl leading-[1.15] tracking-tight text-white px-2 sm:px-4 text-4xl">
                    <span className={`inline-block hero-text-reveal ${isLoaded ? '' : 'opacity-0'}`}>Aap</span>{' '}
                    <span className={`inline-block font-quote italic font-normal bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent hero-text-reveal hero-text-reveal-delay-1 ${isLoaded ? '' : 'opacity-0'}`}>Shaadi</span>{' '}
                    <span className={`inline-block hero-text-reveal hero-text-reveal-delay-2 ${isLoaded ? '' : 'opacity-0'}`}>Karo,</span>
                    <br />
                    <span className={`inline-block hero-text-reveal hero-text-reveal-delay-3 ${isLoaded ? '' : 'opacity-0'}`}>Tension Hum Sambhal Lenge</span>
                  </h1>

                  {/* Subtext with Delayed Reveal */}
                  <p className={`text-white/90 text-sm sm:text-base md:text-lg lg:text-xl font-light px-2 sm:px-4 max-w-2xl mx-auto hero-text-reveal hero-text-reveal-delay-4 ${isLoaded ? '' : 'opacity-0'}`}>
                    India's Most Trusted Wedding Platform • 50,000+ Happy Couples • Zero Stress Guarantee
                  </p>

                  {/* CTA Buttons with Spring Animation */}
                  <div className={`flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center pt-2 sm:pt-4 px-2 sm:px-4 hero-text-reveal hero-text-reveal-delay-5 ${isLoaded ? '' : 'opacity-0'}`}>
                    <Link to="/categories" className="w-full sm:w-auto">
                      <Button size="lg" variant="premium" className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 h-11 sm:h-12">
                        Explore Vendors
                      </Button>
                    </Link>
                    <Link to="/auth" className="w-full sm:w-auto">
                      <Button size="lg" variant="glow" className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 h-11 sm:h-12">
                        Free Wedding Manager
                      </Button>
                    </Link>
                    <Link to="/vendor-auth" className="w-full sm:w-auto">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 border-white/50 text-white hover:bg-white hover:text-primary h-11 sm:h-12 backdrop-blur-sm">
                        For Vendors
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade - Smoother */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
      </section>

      {/* Tensions Section */}
      <TensionsSection />

      {/* Sponsored Vendors Carousel */}
      <SponsoredVendorsCarousel />

      {/* HUMOR SECTION 1: Wedding Planning Superhero */}
      <section ref={humorSection1.ref} className="py-16 sm:py-24 md:py-32 relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at top, hsl(350 85% 55% / 0.08) 0%, transparent 50%)' }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className={`max-w-6xl mx-auto ${humorSection1.isVisible ? 'scroll-reveal-scale is-visible' : 'scroll-reveal-scale'}`}>
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-accent/10 border-2 border-accent/30 mb-4 sm:mb-6 animate-breathe">
                <span className="text-accent text-sm sm:text-base md:text-lg font-bold">🦸 Plot Twist Alert!</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-4 sm:mb-6 px-2">
                We're Like <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Avengers</span>,<br />
                But For Your Wedding
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
                While you focus on your love story, we handle everything else - from vendor calls to perfect execution 🦸‍♂️
              </p>
            </div>
            
            <div className="relative rounded-2xl sm:rounded-3xl md:rounded-[3rem] overflow-hidden aspect-video shadow-2xl img-luxury border-2 sm:border-4 border-accent/20 group">
              <img src={sectionHumorRescue} alt="Wedding planning superhero to the rescue" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              
              {/* Floating badges */}
              <div className="hidden sm:block absolute top-4 sm:top-8 left-4 sm:left-8 bg-white/95 backdrop-blur-sm px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg border border-accent/20 animate-breathe">
                <span className="font-bold text-primary text-sm sm:text-base md:text-lg">No More Stress! 🎉</span>
              </div>
              <div className="hidden sm:block absolute bottom-4 sm:bottom-8 right-4 sm:right-8 bg-white/95 backdrop-blur-sm px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg border border-accent/20" style={{ animationDelay: '1s' }}>
                <span className="font-bold text-primary text-sm sm:text-base md:text-lg">We've Got This! 💪</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12 md:mt-16">
              {[
                { emoji: "📞", title: "300+ Vendor Calls", subtitle: "We make them, not you" },
                { emoji: "🛡️", title: "Zero Fraud Risk", subtitle: "We verify everything" },
                { emoji: "🎯", title: "Your Dream Wedding", subtitle: "You just show up & enjoy" }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="text-center p-4 sm:p-6 md:p-8 rounded-2xl bg-card border-2 border-accent/10 hover:border-accent/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-[0_20px_40px_hsl(var(--accent)/0.15)] group"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-500">{item.emoji}</div>
                  <h3 className="font-bold text-base sm:text-lg md:text-xl mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: For Vendors */}
      <section ref={section1.ref} className="py-16 sm:py-24 md:py-32 relative" style={{ background: 'radial-gradient(ellipse at center, hsl(35 85% 70% / 0.05) 0%, transparent 50%)' }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Content */}
            <div className={`space-y-8 ${section1.isVisible ? 'scroll-reveal-left is-visible' : 'scroll-reveal-left'}`}>
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-primary text-sm font-semibold">For Vendors</span>
              </div>
              
              <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                Grow Your Wedding<br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Business 10x Faster</span>
              </h2>

              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Join India's #1 wedding platform trusted by 50,000+ couples. Get verified instantly, showcase your portfolio beautifully, 
                and connect with ready-to-book clients - all without any commission fees.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Users, text: "Access to 50,000+ active wedding planners" },
                  { icon: Shield, text: "Secure milestone-based payments" },
                  { icon: Star, text: "Build reputation with verified reviews" },
                  { icon: CheckCircle2, text: "No commission on bookings" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group" style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-foreground pt-3 group-hover:translate-x-2 transition-transform duration-300">{item.text}</p>
                  </div>
                ))}
              </div>

              <Button size="lg" variant="premium" className="rounded-full px-8">
                Join as Vendor
              </Button>
            </div>

            {/* Image */}
            <div className={section1.isVisible ? 'scroll-reveal-right is-visible' : 'scroll-reveal-right'}>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] img-luxury group">
                <img src={sectionVendors} alt="Professional vendors at work" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HUMOR SECTION 2: Vendor Superheroes */}
      <section ref={humorSection2.ref} className="py-16 sm:py-24 md:py-32 relative" style={{ background: 'radial-gradient(ellipse at bottom, hsl(35 85% 70% / 0.08) 0%, transparent 50%)' }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className={`max-w-6xl mx-auto ${humorSection2.isVisible ? 'scroll-reveal is-visible' : 'scroll-reveal'}`}>
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-primary/10 border-2 border-primary/30 mb-4 sm:mb-6">
                <span className="text-primary text-sm sm:text-base md:text-lg font-bold">🦸‍♀️ Meet Your Squad</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-4 sm:mb-6 px-2">
                Our Vendors Have<br />
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Actual Superpowers</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
                Not literally, but seriously - have you seen a photographer nail 50 perfect candids in 5 minutes? Or a decorator transform a basic hall into a palace? Pure magic. ✨
              </p>
            </div>
            
            <div className="relative rounded-2xl sm:rounded-3xl md:rounded-[3rem] overflow-hidden aspect-video shadow-2xl img-luxury border-2 sm:border-4 border-primary/20 mb-8 sm:mb-12 group">
              <img src={sectionHumorVendors} alt="Vendor superheroes ready to save your wedding" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                { title: "Photographers 📸", power: "Can freeze time", description: "They'll capture that one perfect moment when your mom isn't crying and your dad isn't checking his phone." },
                { title: "Caterers 🍽️", power: "Feed 500 people perfectly", description: "Your cousin with 47 dietary restrictions? Your vegetarian uncle who 'just wants dal'? They got this." },
                { title: "Decorators 🎨", power: "Transform venues magically", description: "They'll turn that boring banquet hall into something out of a Bollywood movie. Complete with flowers everywhere." },
                { title: "DJs 🎵", power: "Read the room instantly", description: "They know exactly when to play 'Kala Chashma' and when to slow it down with 'Tum Hi Ho'. It's a gift." }
              ].map((vendor, i) => (
                <div 
                  key={i} 
                  className="bg-card border-2 border-accent/10 rounded-2xl p-4 sm:p-6 md:p-8 hover:border-accent/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 shadow-lg hover:shadow-[0_20px_40px_hsl(var(--accent)/0.15)] group"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 group-hover:text-accent transition-colors duration-300">{vendor.title}</h3>
                  <div className="text-primary font-semibold mb-3 text-sm sm:text-base">✨ Superpower: {vendor.power}</div>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{vendor.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 sm:mt-12 text-center">
              <Link to="/categories">
                <Button size="lg" variant="premium" className="text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 rounded-full shadow-xl hover:shadow-2xl">
                  Meet Your Superhero Squad
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section ref={section2.ref} className="py-16 sm:py-24 md:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Image */}
            <div className={`order-2 lg:order-1 ${section2.isVisible ? 'scroll-reveal-left is-visible' : 'scroll-reveal-left'}`}>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] img-luxury group">
                <img src={sectionProcess} alt="Wedding planning process" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
            </div>

            {/* Content */}
            <div className={`order-1 lg:order-2 space-y-8 ${section2.isVisible ? 'scroll-reveal-right is-visible' : 'scroll-reveal-right'}`}>
              <div className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                <span className="text-accent text-sm font-semibold">Simple Process</span>
              </div>
              
              <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                Planning Made<br />
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Stupidly Simple</span>
              </h2>

              <div className="space-y-8">
                {[
                  { number: "01", title: "Tell Us Your Vision", description: "Share your wedding date, location, style preferences, and budget" },
                  { number: "02", title: "Get Matched", description: "We curate the perfect vendors based on your requirements" },
                  { number: "03", title: "Book & Relax", description: "Secure your vendors with our protected payment system and enjoy the journey" }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 items-start group" style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300">
                      <span className="text-accent font-bold text-lg">{step.number}</span>
                    </div>
                    <div className="group-hover:translate-x-2 transition-transform duration-300">
                      <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button size="lg" variant="accent" className="rounded-full px-8">
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
