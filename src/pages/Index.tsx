import { BhindiFooter } from "@/components/BhindiFooter";
import { ReviewsSection } from "@/components/ReviewsSection";
import { BentoGrid } from "@/components/BentoGrid";
import { TensionsSection } from "@/components/TensionsSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Camera, Utensils, Music, Palette, MapPin, Cake, Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import heroWedding from "@/assets/hero-wedding-phere.jpeg";
import sectionVendors from "@/assets/section-vendors.jpg";
import sectionProcess from "@/assets/section-process.jpg";
import sectionVenue from "@/assets/section-venue.jpg";
import { Shield, CheckCircle2, Star, Users } from "lucide-react";

const categories = [
  {
    title: "Photography",
    href: "/categories/photography",
    description: "Professional wedding photographers to capture your special moments",
    icon: Camera,
  },
  {
    title: "Catering",
    href: "/categories/catering",
    description: "Delicious food and beverage services for your guests",
    icon: Utensils,
  },
  {
    title: "Music & Entertainment",
    href: "/categories/music",
    description: "DJs, bands, and entertainment to keep the party alive",
    icon: Music,
  },
  {
    title: "Decoration",
    href: "/categories/decoration",
    description: "Beautiful décor to transform your venue",
    icon: Palette,
  },
  {
    title: "Venues",
    href: "/categories/venues",
    description: "Perfect locations for your wedding ceremony and reception",
    icon: MapPin,
  },
  {
    title: "Cakes & Desserts",
    href: "/categories/cakes",
    description: "Custom wedding cakes and sweet treats",
    icon: Cake,
  },
  {
    title: "Mehendi Artists",
    href: "/categories/mehendi",
    description: "Expert mehendi artists for bridal and guest designs",
    icon: Sparkles,
  },
  {
    title: "Wedding Planning",
    href: "/categories/planning",
    description: "Full-service wedding planners to coordinate everything",
    icon: Heart,
  },
];

const ListItem = ({
  className,
  title,
  children,
  icon: Icon,
  href,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className={cn(
            "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 hover:text-white focus:bg-accent/10 focus:text-white group",
            className
          )}
        >
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
    </li>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section with Integrated Header */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Wedding Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroWedding}
            alt="Indian wedding ceremony"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Header Inside Hero */}
        <header className="relative z-20 border-b border-white/10 bg-black/20 backdrop-blur-xl">
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
                          {categories.map((category) => (
                            <ListItem
                              key={category.title}
                              title={category.title}
                              href={category.href}
                              icon={category.icon}
                            >
                              {category.description}
                            </ListItem>
                          ))}
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

                <Button 
                  variant="default"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6 ml-2"
                >
                  Get Started
                </Button>
              </nav>

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="icon" className="md:hidden text-white">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </Button>
            </div>
          </div>
        </header>
        
        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto animate-fade-up">
              {/* Frosted Glass Card */}
              <div className="relative rounded-[3rem] border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl p-12 md:p-20 shadow-2xl">
                {/* Content */}
                <div className="text-center space-y-8">
                  {/* Headline with Script Font */}
                  <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight text-white">
                    Aap <span className="font-quote italic font-normal">Shaadi</span> Karo,<br />
                    Tension Hum Dekh Lenge
                  </h1>

                  {/* Subtext */}
                  <p className="text-white/90 text-xl md:text-2xl font-light">
                    Stress-free planning. Verified vendors. Personal planner.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-500 hover:to-amber-600 rounded-full px-10 py-7 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
                    >
                      Plan My Wedding Free
                    </Button>
                    <Button 
                      size="lg"
                      variant="outline"
                      className="bg-black/40 text-white border-2 border-white/30 hover:bg-black/60 rounded-full px-10 py-7 text-lg font-semibold backdrop-blur-sm"
                    >
                      Become a Vendor
                    </Button>
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

      {/* Section 2: For Vendors */}
      <section className="py-32 relative bg-muted/5">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Content */}
            <div className="space-y-8 animate-fade-up">
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-primary text-sm font-semibold">For Vendors</span>
              </div>
              
              <h2 className="font-display font-bold text-4xl md:text-6xl">
                Grow Your Wedding<br />
                <span className="text-primary">Business Faster</span>
              </h2>

              <p className="text-muted-foreground text-lg leading-relaxed">
                Join India's most trusted wedding platform. Get verified, showcase your work, 
                and connect with couples who are ready to book.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Users, text: "Access to 50,000+ active wedding planners" },
                  { icon: Shield, text: "Secure milestone-based payments" },
                  { icon: Star, text: "Build reputation with verified reviews" },
                  { icon: CheckCircle2, text: "No commission on bookings" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-foreground pt-3">{item.text}</p>
                  </div>
                ))}
              </div>

              <Button 
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
              >
                Join as Vendor
              </Button>
            </div>

            {/* Image */}
            <div className="animate-fade-up">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                <img 
                  src={sectionVendors}
                  alt="Professional vendors at work"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Image */}
            <div className="order-2 lg:order-1 animate-fade-up">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                <img 
                  src={sectionProcess}
                  alt="Wedding planning process"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2 space-y-8 animate-fade-up">
              <div className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                <span className="text-accent text-sm font-semibold">Simple Process</span>
              </div>
              
              <h2 className="font-display font-bold text-4xl md:text-6xl">
                Planning Made<br />
                <span className="text-accent">Ridiculously Easy</span>
              </h2>

              <div className="space-y-8">
                {[
                  {
                    number: "01",
                    title: "Tell Us Your Vision",
                    description: "Share your wedding date, location, style preferences, and budget"
                  },
                  {
                    number: "02",
                    title: "Get Matched",
                    description: "Our AI curates the perfect vendors based on your requirements"
                  },
                  {
                    number: "03",
                    title: "Book & Relax",
                    description: "Secure bookings with milestone payments and enjoy planning support"
                  }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="text-accent/30 font-display text-5xl font-bold flex-shrink-0">
                      {step.number}
                    </div>
                    <div className="space-y-2 pt-2">
                      <h3 className="font-semibold text-xl">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8"
              >
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Real Weddings */}
      <section className="py-32 relative bg-muted/5">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Content */}
            <div className="space-y-8 animate-fade-up">
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-primary text-sm font-semibold">Success Stories</span>
              </div>
              
              <h2 className="font-display font-bold text-4xl md:text-6xl">
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
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
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

              <Button 
                size="lg"
                variant="outline"
                className="rounded-full px-8"
              >
                Read More Stories
              </Button>
            </div>

            {/* Image */}
            <div className="animate-fade-up">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                <img 
                  src={sectionVenue}
                  alt="Beautiful wedding venue"
                  className="w-full h-full object-cover"
                />
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
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
            <h2 className="font-display font-bold text-4xl md:text-6xl">
              Ready to Plan Your<br />
              <span className="text-accent">Dream Wedding?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of couples who trusted us with their special day
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-500 hover:to-amber-600 rounded-full px-10 py-7 text-lg font-semibold"
              >
                Start Planning Free
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="rounded-full px-10 py-7 text-lg"
              >
                Talk to Expert
              </Button>
            </div>
          </div>
        </div>
      </section>

      <BhindiFooter />
    </div>
  );
};

export default Index;
