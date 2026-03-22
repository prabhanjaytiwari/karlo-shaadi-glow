import { useState, useEffect } from "react";
import { Heart, MapPin, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

// Wedding images
import weddingCouple1 from "@/assets/wedding-couple-1.jpg";
import weddingCouple2 from "@/assets/wedding-couple-2.jpg";
import weddingHaldi from "@/assets/wedding-haldi.jpg";
import weddingCeremony from "@/assets/wedding-ceremony.jpg";
import weddingBridesmaids from "@/assets/wedding-bridesmaids.jpg";

const recentCelebrations = [
  { id: 1, couple: "Priya & Rahul", city: "Udaipur", venue: "Lake Palace", theme: "Royal Rajasthani", guests: "450", emoji: "👑", quote: "Our fairytale came true", image: weddingCouple1 },
  { id: 2, couple: "Ananya & Vikram", city: "Jaipur", venue: "Samode Palace", theme: "Vintage Elegance", guests: "320", emoji: "🏰", quote: "Beyond our dreams", image: weddingCouple2 },
  { id: 3, couple: "Sneha & Arjun", city: "Goa", venue: "Beach Resort", theme: "Boho Beach", guests: "180", emoji: "🌊", quote: "Perfect sunset wedding", image: weddingHaldi },
  { id: 4, couple: "Kavya & Siddharth", city: "Mumbai", venue: "Taj Lands End", theme: "Modern Luxury", guests: "600", emoji: "✨", quote: "Magical in every way", image: weddingCeremony },
  { id: 5, couple: "Meera & Rohan", city: "Delhi", venue: "Leela Palace", theme: "Grand Traditional", guests: "800", emoji: "🪔", quote: "Our Big Fat Indian Wedding", image: weddingBridesmaids },
];

const liveStats = [
  { label: "Shaadis This Month", value: "2,847", subtext: "across India" },
  { label: "Happy Couples", value: "50,000+", subtext: "and counting" },
  { label: "Total Guest Celebrations", value: "2.5 Cr+", subtext: "memories made" },
];

export const LiveActivityFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % recentCelebrations.length);
        setIsAnimating(false);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = recentCelebrations[currentIndex];
  const nextTwo = [
    recentCelebrations[(currentIndex + 1) % recentCelebrations.length],
    recentCelebrations[(currentIndex + 2) % recentCelebrations.length],
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted mb-4">
              <span className="text-sm">🎊</span>
              <span className="font-display text-muted-foreground text-sm font-medium">Live Shaadi Celebrations</span>
              <span className="relative flex h-2 w-2 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            
            <h2 className="font-display font-semibold text-2xl md:text-3xl mb-3">
              Real Weddings, <span className="text-primary">Real Magic</span>
            </h2>
            
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              Every week, thousands of couples create their forever moments with us
            </p>
          </div>

          {/* Main Showcase */}
          <div className="grid lg:grid-cols-5 gap-5 sm:gap-6 items-center">
            
            {/* Featured Card */}
            <div className="lg:col-span-3">
              <div className={`relative transition-all duration-500 ${isAnimating ? 'opacity-0 scale-98' : 'opacity-100 scale-100'}`}>
                <div className="relative bg-card rounded-2xl overflow-hidden shadow-[var(--shadow-md)]">
                  <div className="grid md:grid-cols-2">
                    <div className="relative h-64 md:h-full min-h-[280px] overflow-hidden">
                      <img src={current.image} alt={`${current.couple} wedding`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-green-700 text-xs font-medium">Just Celebrated</span>
                      </div>
                    </div>
                    
                    <div className="p-6 sm:p-8">
                      <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-2">
                        {current.couple}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{current.venue}, {current.city}</span>
                      </div>

                      <blockquote className="text-base sm:text-lg italic text-foreground/80 mb-6 pl-4 border-l-2 border-primary/30">
                        "{current.quote}"
                      </blockquote>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground">Theme</div>
                            <div className="font-semibold text-xs">{current.theme}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                            <Heart className="h-4 w-4 text-accent" />
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground">Guests</div>
                            <div className="font-semibold text-xs">{current.guests}+</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                            <Star className="h-4 w-4 text-amber-500" />
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground">Rating</div>
                            <div className="font-semibold text-xs">5.0 ★</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="lg:col-span-2 space-y-4">
              
              <div className="bg-card rounded-xl p-5 shadow-[var(--shadow-sm)]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">🎉</span>
                  <h4 className="font-semibold text-sm text-foreground">More Celebrations</h4>
                </div>
                
                <div className="space-y-2.5">
                  {nextTwo.map((celebration, i) => (
                    <div 
                      key={celebration.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div className="text-2xl">{celebration.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{celebration.couple}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {celebration.city}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl p-5 shadow-[var(--shadow-sm)]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">📊</span>
                  <h4 className="font-semibold text-sm text-foreground">Shaadi Stats</h4>
                </div>
                
                <div className="space-y-3">
                  {liveStats.map((stat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                      <div className="text-right">
                        <div className="font-bold text-base text-foreground">{stat.value}</div>
                        <div className="text-[10px] text-muted-foreground">{stat.subtext}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/stories">
                <Button className="w-full rounded-xl h-12">
                  <span className="mr-2">💒</span>
                  Read Success Stories
                </Button>
              </Link>
            </div>
          </div>

          {/* Trending Cities */}
          <div className="mt-10 sm:mt-12">
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <span className="font-medium">Trending Cities:</span>
              <div className="flex flex-wrap justify-center gap-2">
                {["Mumbai", "Delhi", "Udaipur", "Jaipur", "Bangalore", "Goa"].map((city) => (
                  <span key={city} className="px-3 py-1 rounded-full bg-card shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-shadow cursor-pointer text-foreground">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
