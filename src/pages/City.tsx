import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, TrendingUp, Award } from "lucide-react";
import heroImage from "@/assets/hero-wedding.jpg";

const City = () => {
  const { slug } = useParams();
  
  const cityData: Record<string, any> = {
    lucknow: {
      name: "Lucknow",
      tagline: "Nawabi Elegance Meets Modern Romance",
      description: "Plan your dream wedding in the city of tehzeeb with verified vendors, royal venues, and authentic Awadhi hospitality.",
      bestMonths: "October to March",
      avgCost: "₹8-15 lakhs",
      topVenues: ["La Palais Banquet", "Vivanta Gomti Nagar", "Clarks Awadh"],
    },
    delhi: {
      name: "Delhi",
      tagline: "Grand Celebrations in the Heart of India",
      description: "Experience magnificent weddings in India's capital with world-class venues, diverse vendors, and unmatched scale.",
      bestMonths: "November to February",
      avgCost: "₹12-25 lakhs",
      topVenues: ["The Lalit", "ITC Maurya", "Taj Palace"],
    },
    mumbai: {
      name: "Mumbai",
      tagline: "Bollywood Dreams & Coastal Charm",
      description: "Create unforgettable memories in the city of dreams with stunning venues, celebrity vendors, and magical seaside settings.",
      bestMonths: "November to February",
      avgCost: "₹15-30 lakhs",
      topVenues: ["Taj Mahal Palace", "The St. Regis", "Grand Hyatt"],
    }
  };

  const city = cityData[slug || "lucknow"];

  const topPicks = [
    { title: "Budget-Friendly Top 10", description: "Best value vendors starting at ₹25,000", badge: "Popular" },
    { title: "Premium Experiences", description: "Luxury vendors for royal weddings", badge: "Exclusive" },
    { title: "Trending This Season", description: "Most booked vendors this month", badge: "Hot" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt={`Wedding in ${city.name}`}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/70 to-background/50" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl animate-fade-up">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-accent" />
              <span className="text-accent font-semibold">Planning in {city.name}</span>
            </div>
            <h1 className="font-display font-bold text-5xl md:text-6xl mb-4">
              {city.tagline}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {city.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg">
                Find Vendors Now
              </Button>
              <Button variant="outline" size="lg">
                View Real Weddings
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: "Verified Vendors", value: "500+" },
              { label: "Weddings Planned", value: "2,000+" },
              { label: "Best Season", value: city.bestMonths },
              { label: "Average Budget", value: city.avgCost },
            ].map((stat, i) => (
              <GlassCard 
                key={i} 
                className="p-6 text-center animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <p className="font-display font-bold text-3xl mb-2 text-accent">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* AI Picks */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="font-display font-bold text-4xl mb-4">
              AI-Curated Picks for {city.name}
            </h2>
            <p className="text-muted-foreground text-lg">
              Personalized recommendations based on your preferences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {topPicks.map((pick, i) => (
              <GlassCard 
                key={i}
                hover
                className="p-6 animate-fade-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <Award className="h-8 w-8 text-accent" />
                  <span className="glass-subtle px-3 py-1 rounded-full text-xs font-semibold">
                    {pick.badge}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">{pick.title}</h3>
                <p className="text-muted-foreground mb-4">{pick.description}</p>
                <Button variant="quiet" className="w-full">
                  View Collection →
                </Button>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Micro Guide */}
      <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <GlassCard className="max-w-4xl mx-auto p-8 md:p-12">
            <h2 className="font-display font-bold text-3xl mb-6">
              Wedding Planning Guide for {city.name}
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold text-lg">Best Time to Book</h3>
                </div>
                <p className="text-muted-foreground pl-7">
                  Peak wedding season in {city.name} runs from {city.bestMonths}. 
                  Book venues 6-12 months in advance for these dates. Off-season weddings (April-September) 
                  can save 20-30% on vendor costs.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold text-lg">Popular Venues</h3>
                </div>
                <p className="text-muted-foreground pl-7">
                  Top choices include {city.topVenues.join(", ")}. These venues book fast during 
                  wedding season. Pro tip: Visit venues on a weekday for better negotiation leverage.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold text-lg">Local Specialties</h3>
                </div>
                <p className="text-muted-foreground pl-7">
                  {city.name === "Lucknow" && "Don't miss authentic Awadhi cuisine catering, traditional chikankari decor, and nawabi-style welcome ceremonies."}
                  {city.name === "Delhi" && "Leverage Delhi's diverse vendor pool for fusion weddings, destination pre-wedding shoots at historical monuments, and royal palace venues."}
                  {city.name === "Mumbai" && "Take advantage of stunning beachfront venues, celebrity makeup artists, and Bollywood-style entertainment options."}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/50">
              <Link to="/categories">
                <Button variant="hero" size="lg" className="w-full md:w-auto">
                  Explore All Categories →
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default City;
