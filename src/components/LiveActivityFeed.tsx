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

// Real wedding celebrations with premium feel
const recentCelebrations = [
  { 
    id: 1, 
    couple: "Priya & Rahul", 
    city: "Udaipur",
    venue: "Lake Palace",
    theme: "Royal Rajasthani",
    guests: "450",
    emoji: "👑",
    quote: "Our fairytale came true",
    image: weddingCouple1
  },
  { 
    id: 2, 
    couple: "Ananya & Vikram", 
    city: "Jaipur",
    venue: "Samode Palace",
    theme: "Vintage Elegance",
    guests: "320",
    emoji: "🏰",
    quote: "Beyond our dreams",
    image: weddingCouple2
  },
  { 
    id: 3, 
    couple: "Sneha & Arjun", 
    city: "Goa",
    venue: "Beach Resort",
    theme: "Boho Beach",
    guests: "180",
    emoji: "🌊",
    quote: "Perfect sunset wedding",
    image: weddingHaldi
  },
  { 
    id: 4, 
    couple: "Kavya & Siddharth", 
    city: "Mumbai",
    venue: "Taj Lands End",
    theme: "Modern Luxury",
    guests: "600",
    emoji: "✨",
    quote: "Magical in every way",
    image: weddingCeremony
  },
  { 
    id: 5, 
    couple: "Meera & Rohan", 
    city: "Delhi",
    venue: "Leela Palace",
    theme: "Grand Traditional",
    guests: "800",
    emoji: "🪔",
    quote: "Our Big Fat Indian Wedding",
    image: weddingBridesmaids
  },
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
    <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 via-rose-50/50 to-white" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(38_90%_55%/0.15)_0%,transparent_60%)]" />
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 border border-primary/10 rounded-full opacity-50" />
      <div className="absolute bottom-20 right-20 w-48 h-48 border border-accent/10 rounded-full opacity-30" />
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header - Premium Feel */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-accent/15 to-primary/10 border border-primary/20 mb-4">
              <span className="text-2xl">🎊</span>
              <span className="font-display text-primary text-sm sm:text-base font-semibold tracking-wide">Live Shaadi Celebrations</span>
              <span className="relative flex h-2 w-2 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 tracking-tight">
              <span className="text-foreground">Real Weddings,</span>{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Real Magic</span>
            </h2>
            
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Every week, thousands of couples create their forever moments with us
            </p>
          </div>

          {/* Main Celebration Showcase */}
          <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 items-center">
            
            {/* Featured Celebration - Large Card */}
            <div className="lg:col-span-3">
              <div 
                className={`relative group transition-all duration-500 ${
                  isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                {/* Outer Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/40 to-primary/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Main Card */}
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-primary/20 overflow-hidden shadow-2xl">
                  {/* Top Accent Bar */}
                  <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
                  
                  <div className="grid md:grid-cols-2">
                    {/* Image Section */}
                    <div className="relative h-64 md:h-full min-h-[280px] overflow-hidden">
                      <img 
                        src={current.image} 
                        alt={`${current.couple} wedding`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      
                      {/* Live Badge */}
                      <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-green-500/30">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-green-700 text-xs font-semibold uppercase tracking-wider">Just Celebrated</span>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-6 sm:p-8">
                      {/* Emoji Badge */}
                      <div className="absolute top-6 right-6 text-4xl sm:text-5xl opacity-20 group-hover:opacity-40 transition-opacity">
                        {current.emoji}
                      </div>

                      {/* Couple Names */}
                      <h3 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-foreground mb-2">
                        {current.couple}
                      </h3>
                      
                      {/* Location */}
                      <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium">{current.venue}, {current.city}</span>
                      </div>

                      {/* Quote */}
                      <blockquote className="text-lg sm:text-xl italic text-foreground/80 mb-6 pl-4 border-l-2 border-primary/40">
                        "{current.quote}"
                      </blockquote>

                      {/* Stats Row */}
                      <div className="flex flex-wrap gap-4 sm:gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Theme</div>
                            <div className="font-semibold text-sm">{current.theme}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Heart className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Guests</div>
                            <div className="font-semibold text-sm">{current.guests}+</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                            <Star className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Rating</div>
                            <div className="font-semibold text-sm">5.0 ★</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Panel - Upcoming + Stats */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Next Celebrations Preview */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-accent/20 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">🎉</span>
                  <h4 className="font-semibold text-sm text-foreground">More Celebrations</h4>
                </div>
                
                <div className="space-y-3">
                  {nextTwo.map((celebration, i) => (
                    <div 
                      key={celebration.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 hover:border-primary/30 transition-all cursor-pointer group"
                      style={{ opacity: 1 - i * 0.2 }}
                    >
                      <div className="text-2xl">{celebration.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{celebration.couple}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {celebration.city}
                        </div>
                      </div>
                      <Heart className="h-4 w-4 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Stats - Premium Counter */}
              <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 rounded-xl border border-primary/20 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">📊</span>
                  <h4 className="font-semibold text-sm text-foreground">Shaadi Stats</h4>
                  <div className="ml-auto flex items-center gap-1 text-[10px] text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    LIVE
                  </div>
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

              {/* CTA */}
              <Link to="/stories">
                <Button className="w-full rounded-xl h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg">
                  <span className="mr-2">💒</span>
                  Read Success Stories
                </Button>
              </Link>
            </div>
          </div>

          {/* Bottom Ticker - Cities */}
          <div className="mt-10 sm:mt-14">
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <span className="font-medium">Trending Cities:</span>
              <div className="flex flex-wrap justify-center gap-2">
                {["Mumbai", "Delhi", "Udaipur", "Jaipur", "Bangalore", "Goa"].map((city) => (
                  <span 
                    key={city}
                    className="px-3 py-1 rounded-full bg-white border border-accent/20 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
                  >
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
