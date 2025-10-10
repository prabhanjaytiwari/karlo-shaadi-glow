import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  MapPin, 
  Tag, 
  Shield, 
  Clock, 
  Heart,
  Camera,
  Home as HomeIcon,
  UtensilsCrossed,
  Sparkles,
  Palette,
  Music,
  Users,
  Mail,
  Truck
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-wedding.jpg";
import mehendiImage from "@/assets/category-mehendi.jpg";
import photographyImage from "@/assets/category-photography.jpg";
import venueImage from "@/assets/category-venue.jpg";

const Index = () => {
  const categories = [
    { name: "Photography", icon: Camera, image: photographyImage, count: "150+ vendors" },
    { name: "Venues", icon: HomeIcon, image: venueImage, count: "200+ options" },
    { name: "Catering", icon: UtensilsCrossed, image: mehendiImage, count: "120+ caterers" },
    { name: "Decor", icon: Palette, image: venueImage, count: "180+ decorators" },
    { name: "Makeup", icon: Sparkles, image: photographyImage, count: "100+ artists" },
    { name: "Mehendi", icon: Heart, image: mehendiImage, count: "80+ artists" },
    { name: "Music/DJ", icon: Music, image: photographyImage, count: "90+ artists" },
    { name: "Hospitality", icon: Users, image: venueImage, count: "60+ services" },
  ];

  const howItWorks = [
    {
      icon: Heart,
      title: "Instant Match",
      description: "Tell us your city, date, and preferences. Our AI curates perfect vendor matches in seconds."
    },
    {
      icon: Shield,
      title: "Compare & Book Safely",
      description: "View verified profiles, real reviews, and transparent pricing. Book with milestone payment protection."
    },
    {
      icon: Clock,
      title: "No Tension Planning",
      description: "Track everything in your planner. We handle disputes, SLA enforcement, and support via WhatsApp."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Beautiful Indian wedding couple"
            className="w-full h-full object-cover animate-scale-in"
            style={{ animationDuration: "1200ms" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/60" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
            <h1 className="font-display font-bold text-5xl md:text-7xl leading-tight">
              Karlo Shaadi –<br />
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                No Tension Weddings
              </span>
            </h1>
            
            <p className="font-quote italic text-xl md:text-2xl text-muted-foreground">
              aap shaadi karo, tension hum sambhal lenge
            </p>

            {/* Search Form */}
            <GlassCard variant="intense" className="p-6 md:p-8 max-w-3xl mx-auto shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="City (e.g., Lucknow)" 
                    className="pl-10 glass-subtle border-0"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="date" 
                    className="pl-10 glass-subtle border-0"
                  />
                </div>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Category" 
                    className="pl-10 glass-subtle border-0"
                  />
                </div>
              </div>
              <Button variant="hero" size="lg" className="w-full text-base">
                ✨ Get Instant Matches
              </Button>
            </GlassCard>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {[
                { icon: Shield, text: "Verified Vendors" },
                { icon: Clock, text: "Milestone Payments" },
                { icon: Heart, text: "Fraud Protection" },
                { icon: Users, text: "Human Support" }
              ].map((badge, i) => (
                <div 
                  key={i}
                  className="glass-subtle px-4 py-2 rounded-full flex items-center gap-2 animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <badge.icon className="h-4 w-4 text-accent" />
                  <span className="font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
              Wedding Planning, Simplified
            </h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to your dream wedding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((step, i) => (
              <GlassCard 
                key={i} 
                className="p-8 text-center hover-lift animate-fade-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/60 rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
              Explore by Category
            </h2>
            <p className="text-muted-foreground text-lg">
              Verified vendors across every wedding service you need
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <Link 
                key={i}
                to={`/category/${cat.name.toLowerCase()}`}
              >
                <GlassCard 
                  hover
                  className="overflow-hidden group animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={cat.image} 
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                  </div>
                  <div className="p-4 text-center">
                    <cat.icon className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <h3 className="font-display font-semibold text-lg mb-1">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.count}</p>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <GlassCard variant="intense" className="max-w-3xl mx-auto p-12 text-center">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Ready to Start Planning?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Aaj book karoge to date lock — kal se prices badh sakte hain
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                Get Started Free
              </Button>
              <Button variant="outline" size="lg">
                <Mail className="h-4 w-4" />
                Contact Us
              </Button>
            </div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
