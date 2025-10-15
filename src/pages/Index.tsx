import { BhindiFooter } from "@/components/BhindiFooter";
import { ReviewsSection } from "@/components/ReviewsSection";
import { BentoGrid } from "@/components/BentoGrid";
import { TensionsSection } from "@/components/TensionsSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Camera, Utensils, Music, Palette, MapPin, Cake, Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import heroWedding from "@/assets/hero-wedding-phere.jpeg";
import sectionVendors from "@/assets/section-vendors.jpg";
import sectionProcess from "@/assets/section-process.jpg";
import sectionVenue from "@/assets/section-venue.jpg";
import sectionHumorRescue from "@/assets/section-humor-rescue.jpg";
import sectionHumorVendors from "@/assets/section-humor-vendors.jpg";
import { Shield, CheckCircle2, Star, Users } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useWeddingSounds } from "@/hooks/useWeddingSounds";
import { useEffect } from "react";
const categories = [{
  title: "Photography",
  href: "/categories/photography",
  description: "Professional wedding photographers to capture your special moments",
  icon: Camera
}, {
  title: "Catering",
  href: "/categories/catering",
  description: "Delicious food and beverage services for your guests",
  icon: Utensils
}, {
  title: "Music & Entertainment",
  href: "/categories/music",
  description: "DJs, bands, and entertainment to keep the party alive",
  icon: Music
}, {
  title: "Decoration",
  href: "/categories/decoration",
  description: "Beautiful décor to transform your venue",
  icon: Palette
}, {
  title: "Venues",
  href: "/categories/venues",
  description: "Perfect locations for your wedding ceremony and reception",
  icon: MapPin
}, {
  title: "Cakes & Desserts",
  href: "/categories/cakes",
  description: "Custom wedding cakes and sweet treats",
  icon: Cake
}, {
  title: "Mehendi Artists",
  href: "/categories/mehendi",
  description: "Expert mehendi artists for bridal and guest designs",
  icon: Sparkles
}, {
  title: "Wedding Planning",
  href: "/categories/planning",
  description: "Full-service wedding planners to coordinate everything",
  icon: Heart
}];
const ListItem = ({
  className,
  title,
  children,
  icon: Icon,
  href
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  icon: React.ComponentType<{
    className?: string;
  }>;
  href: string;
}) => {
  return <li>
      <NavigationMenuLink asChild>
        <Link to={href} className={cn("block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-white focus:bg-accent/10 focus:text-white group", className)}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <Icon className="h-4 w-4 text-accent" />
            </div>
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-white/70 pl-10">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>;
};
const Index = () => {
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
    playWelcomeSound
  } = useWeddingSounds();
  useEffect(() => {
    // Play welcome sound on mount with slight delay
    const timer = setTimeout(() => {
      playWelcomeSound();
    }, 500);
    return () => clearTimeout(timer);
  }, [playWelcomeSound]);
  return <div className="min-h-screen bg-background text-foreground overflow-x-hidden w-full max-w-[100vw]">
      {/* Hero Section with Integrated Header */}
      <section className="relative min-h-screen flex flex-col overflow-hidden w-full max-w-[100vw]">
        {/* Wedding Background */}
          <div className="absolute inset-0 z-0">
          <img src={heroWedding} alt="Indian wedding ceremony" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/80" />
        </div>

        {/* Header Inside Hero */}
        <header className="relative z-20 border-b border-white/10">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white font-bold text-xl">K</span>
                </div>
                <span className="font-semibold text-lg tracking-tight text-white group-hover:text-accent transition-colors">
                  Karlo Shaadi
                </span>
              </Link>

              {/* Navigation Menu */}
              <nav className="hidden md:flex items-center gap-4">
                <NavigationMenu>
                  <NavigationMenuList>
                    {/* Categories Dropdown */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-sm text-white/80 hover:text-white bg-transparent data-[state=open]:bg-white/10">
                        Categories
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="bg-black/95 backdrop-blur-xl border-white/10">
                        <ul className="grid w-[600px] gap-3 p-6 md:grid-cols-2">
                          {categories.map(category => <ListItem key={category.title} title={category.title} href={category.href} icon={category.icon}>
                              {category.description}
                            </ListItem>)}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Regular Links */}
                    <NavigationMenuItem>
                      <Link to="/stories">
                        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-white/80 hover:text-white bg-transparent hover:bg-white/10")}>
                          Stories
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <Link to="/vendor-onboarding">
                        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-white/80 hover:text-white bg-transparent hover:bg-white/10")}>
                          For Vendors
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>

                <Link to="/auth">
                  <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6 ml-2">
                    Get Started
                  </Button>
                </Link>
              </nav>

              {/* Mobile Menu - Uses BhindiHeader component */}
              <Link to="/categories">
                <Button variant="ghost" size="icon" className="md:hidden text-white">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto animate-fade-up">
              {/* Frosted Glass Card */}
              <div className="relative rounded-2xl md:rounded-[3rem] border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl p-6 sm:p-8 md:p-12 lg:p-16 shadow-2xl mx-0 sm:mx-4 max-w-full">
                {/* Content */}
                <div className="text-center space-y-4 sm:space-y-6 md:space-y-8">
                  {/* Headline with Script Font */}
                  <h1 className="font-display font-bold sm:text-3xl md:text-5xl lg:text-7xl leading-[1.15] tracking-tight text-white px-2 sm:px-4 text-4xl">
                    Aap <span className="font-quote italic font-normal">Shaadi</span> Karo,<br />
                    Tension Hum Dekh Lenge
                  </h1>

                  {/* Subtext */}
                  <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl font-light px-2 sm:px-4">
                    Stress-free planning. Verified vendors. Personal planner.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center pt-2 sm:pt-4 px-2 sm:px-4">
                    <Link to="/categories" className="w-full sm:w-auto">
                      <Button size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 h-11 sm:h-12">
                        Explore Vendors
                      </Button>
                    </Link>
                    <Link to="/auth" className="w-full sm:w-auto">
                      <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 shadow-xl h-11 sm:h-12">
                        Free Wedding Manager 🤖
                      </Button>
                    </Link>
                    <Link to="/vendor/onboarding" className="w-full sm:w-auto">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 border-white text-white hover:bg-white hover:text-primary h-11 sm:h-12">
                        For Vendors
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      {/* Tensions Section */}
      <TensionsSection />

      {/* HUMOR SECTION 1: Wedding Planning Superhero */}
      <section ref={humorSection1.ref} className="py-16 sm:py-24 md:py-32 relative bg-gradient-to-br from-primary/5 via-accent/5 to-background overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className={`max-w-6xl mx-auto ${humorSection1.isVisible ? 'scroll-reveal-scale is-visible' : 'scroll-reveal-scale'}`}>
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-accent/10 border-2 border-accent/30 mb-4 sm:mb-6">
                <span className="text-accent text-sm sm:text-base md:text-lg font-bold">🦸 Plot Twist Alert!</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-4 sm:mb-6 px-2">
                We're Like Avengers,<br />
                <span className="text-primary">But For Weddings</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
                While you're busy being romantic, we're busy being your wedding planning superheroes 🦸‍♂️
              </p>
            </div>
            
            <div className="relative rounded-2xl sm:rounded-3xl md:rounded-[3rem] overflow-hidden aspect-video shadow-2xl img-luxury border-2 sm:border-4 border-accent/20">
              <img src={sectionHumorRescue} alt="Wedding planning superhero to the rescue" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              
              {/* Floating badges - hidden on small mobile */}
              <div className="hidden sm:block absolute top-4 sm:top-8 left-4 sm:left-8 bg-white/95 backdrop-blur-sm px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg border border-accent/20 animate-pulse">
                <span className="font-bold text-primary text-sm sm:text-base md:text-lg">No More Stress! 🎉</span>
              </div>
              <div className="hidden sm:block absolute bottom-4 sm:bottom-8 right-4 sm:right-8 bg-white/95 backdrop-blur-sm px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg border border-accent/20">
                <span className="font-bold text-primary text-sm sm:text-base md:text-lg">We've Got This! 💪</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12 md:mt-16">
              {[{
              emoji: "📞",
              title: "300+ Vendor Calls",
              subtitle: "We make them, not you"
            }, {
              emoji: "🛡️",
              title: "Zero Fraud Risk",
              subtitle: "We verify everything"
            }, {
              emoji: "🎯",
              title: "Your Dream Wedding",
              subtitle: "You just show up & enjoy"
            }].map((item, i) => <div key={i} className="text-center p-4 sm:p-6 md:p-8 rounded-2xl bg-card border-2 border-accent/10 hover:border-accent/30 transition-all hover:scale-105 shadow-lg">
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">{item.emoji}</div>
                  <h3 className="font-bold text-base sm:text-lg md:text-xl mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{item.subtitle}</p>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: For Vendors */}
      <section ref={section1.ref} className="py-16 sm:py-24 md:py-32 relative bg-muted/5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Content */}
            <div className={`space-y-8 ${section1.isVisible ? 'scroll-reveal-left is-visible' : 'scroll-reveal-left'}`}>
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-primary text-sm font-semibold">For Vendors</span>
              </div>
              
              <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                Grow Your Wedding<br />
                <span className="text-primary">Business Faster</span>
              </h2>

              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Join India's most trusted wedding platform. Get verified, showcase your work, 
                and connect with couples who are ready to book.
              </p>

              <div className="space-y-4">
                {[{
                icon: Users,
                text: "Access to 50,000+ active wedding planners"
              }, {
                icon: Shield,
                text: "Secure milestone-based payments"
              }, {
                icon: Star,
                text: "Build reputation with verified reviews"
              }, {
                icon: CheckCircle2,
                text: "No commission on bookings"
              }].map((item, i) => <div key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-foreground pt-3">{item.text}</p>
                  </div>)}
              </div>

              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8">
                Join as Vendor
              </Button>
            </div>

            {/* Image */}
            <div className={section1.isVisible ? 'scroll-reveal-right is-visible' : 'scroll-reveal-right'}>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] img-luxury">
                <img src={sectionVendors} alt="Professional vendors at work" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HUMOR SECTION 2: Vendor Superheroes */}
      <section ref={humorSection2.ref} className="py-16 sm:py-24 md:py-32 relative bg-gradient-to-br from-accent/5 via-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className={`max-w-6xl mx-auto ${humorSection2.isVisible ? 'scroll-reveal is-visible' : 'scroll-reveal'}`}>
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-primary/10 border-2 border-primary/30 mb-4 sm:mb-6">
                <span className="text-primary text-sm sm:text-base md:text-lg font-bold">🦸‍♀️ Meet Your Squad</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-4 sm:mb-6 px-2">
                Our Vendors Have<br />
                <span className="text-accent">Literal Superpowers</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
                Okay, not literal. But have you seen a photographer capture 50 perfect shots in 5 minutes? That's basically a superpower.
              </p>
            </div>
            
            <div className="relative rounded-2xl sm:rounded-3xl md:rounded-[3rem] overflow-hidden aspect-video shadow-2xl img-luxury border-2 sm:border-4 border-primary/20 mb-8 sm:mb-12">
              <img src={sectionHumorVendors} alt="Vendor superheroes ready to save your wedding" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {[{
              title: "Photographers 📸",
              power: "Can freeze time",
              description: "They'll capture that one perfect moment when your mom isn't crying and your dad isn't checking his phone."
            }, {
              title: "Caterers 🍽️",
              power: "Feed 500 people perfectly",
              description: "Your cousin with 47 dietary restrictions? Your vegetarian uncle who 'just wants dal'? They got this."
            }, {
              title: "Decorators 🎨",
              power: "Transform venues magically",
              description: "They'll turn that boring banquet hall into something out of a Bollywood movie. Complete with flowers everywhere."
            }, {
              title: "DJs 🎵",
              power: "Read the room instantly",
              description: "They know exactly when to play 'Kala Chashma' and when to slow it down with 'Tum Hi Ho'. It's a gift."
            }].map((vendor, i) => <div key={i} className="bg-card border-2 border-accent/10 rounded-2xl p-4 sm:p-6 md:p-8 hover:border-accent/30 transition-all hover:scale-105 shadow-lg">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{vendor.title}</h3>
                  <div className="text-primary font-semibold mb-3 text-sm sm:text-base">✨ Superpower: {vendor.power}</div>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{vendor.description}</p>
                </div>)}
            </div>

            <div className="mt-8 sm:mt-12 text-center">
              <Link to="/categories">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 rounded-full shadow-xl hover:shadow-2xl transition-all">
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
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] img-luxury">
                <img src={sectionProcess} alt="Wedding planning process" className="w-full h-full object-cover" />
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
                <span className="text-accent">Ridiculously Easy</span>
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
                description: "Secure bookings with milestone payments and enjoy planning support"
              }].map((step, i) => <div key={i} className="flex gap-6">
                    <div className="text-accent/30 font-display text-5xl font-bold flex-shrink-0">
                      {step.number}
                    </div>
                    <div className="space-y-2 pt-2">
                      <h3 className="font-semibold text-xl">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>)}
              </div>

              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8">
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Real Weddings */}
      <section ref={section3.ref} className="py-16 sm:py-24 md:py-32 relative bg-muted/5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Content */}
            <div className={`space-y-8 ${section3.isVisible ? 'scroll-reveal-left is-visible' : 'scroll-reveal-left'}`}>
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-primary text-sm font-semibold">Success Stories</span>
              </div>
              
              <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                50,000+ Couples<br />
                <span className="text-primary">Trusted Us</span>
              </h2>

              <p className="text-muted-foreground text-lg leading-relaxed">
                From intimate ceremonies to grand celebrations, couples across India 
                have planned their perfect weddings with Karlo Shaadi.
              </p>

              {/* Testimonial */}
              <div className="border border-border/50 rounded-2xl p-8 bg-card">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-accent text-accent" />)}
                </div>
                <p className="text-foreground mb-4 leading-relaxed">
                  "Karlo Shaadi made our wedding planning journey absolutely stress-free. 
                  The vendors were amazing, payments were secure, and we had support every step of the way."
                </p>
                <div>
                  <p className="font-semibold">Priya & Rahul</p>
                  <p className="text-sm text-muted-foreground">Married in Mumbai, December 2024</p>
                </div>
              </div>

              <Button size="lg" variant="outline" className="rounded-full px-8">
                Read More Stories
              </Button>
            </div>

            {/* Image */}
            <div className={section3.isVisible ? 'scroll-reveal-right is-visible' : 'scroll-reveal-right'}>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] img-luxury">
                <img src={sectionVenue} alt="Beautiful wedding venue" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <BentoGrid />

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Final CTA */}
      <section className="py-16 sm:py-24 md:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 animate-fade-up">
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-2">
              Ready to Plan Your<br />
              <span className="text-accent">Dream Wedding?</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
              Join thousands of couples who trusted us with their special day
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button size="lg" className="bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-500 hover:to-amber-600 rounded-full px-6 sm:px-10 py-5 sm:py-7 text-base sm:text-lg font-semibold">
                Start Planning Free
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-6 sm:px-10 py-5 sm:py-7 text-base sm:text-lg">
                Talk to Expert
              </Button>
            </div>
          </div>
        </div>
      </section>

      <BhindiFooter />
    </div>;
};
export default Index;