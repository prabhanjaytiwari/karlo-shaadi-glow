import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Clock, Sparkles, Heart, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

// Simulated live activity data for social proof
const recentActivities = [
  { id: 1, couple: "Priya & Rahul", vendor: "Pixel Perfect Studios", category: "Photography", city: "Mumbai", timeAgo: "2 mins ago" },
  { id: 2, couple: "Sneha & Arjun", vendor: "Shahi Dawat Caterers", category: "Catering", city: "Delhi", timeAgo: "5 mins ago" },
  { id: 3, couple: "Ananya & Vikram", vendor: "The Grand Palace", category: "Venue", city: "Jaipur", timeAgo: "12 mins ago" },
  { id: 4, couple: "Meera & Siddharth", vendor: "Blossom Decor Studio", category: "Decoration", city: "Bangalore", timeAgo: "18 mins ago" },
  { id: 5, couple: "Kavya & Rohan", vendor: "DJ Rishi Entertainment", category: "Music", city: "Mumbai", timeAgo: "25 mins ago" },
  { id: 6, couple: "Neha & Aditya", vendor: "Henna by Priya", category: "Mehendi", city: "Delhi", timeAgo: "32 mins ago" },
];

const trendingCategories = [
  { name: "Photography", bookings: 234, growth: "+18%" },
  { name: "Venues", bookings: 189, growth: "+12%" },
  { name: "Catering", bookings: 156, growth: "+22%" },
  { name: "Decoration", bookings: 98, growth: "+15%" },
];

export const LiveActivityFeed = () => {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Rotate through activities
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentActivity((prev) => (prev + 1) % recentActivities.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const activity = recentActivities[currentActivity];

  return (
    <section className="py-8 sm:py-12 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Header - Compact */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-accent text-xs sm:text-sm font-semibold">Live Activity</span>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl mb-2">
              Couples Are <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Booking Right Now</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Join 50,000+ happy couples who found their perfect vendors
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Live Booking Feed */}
            <div className="lg:col-span-2">
              <Card className="p-4 sm:p-5 bg-card/50 backdrop-blur-sm border border-accent/10 hover:border-accent/20 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <h3 className="font-semibold text-sm">Recent Bookings</h3>
                  <Badge variant="secondary" className="ml-auto text-xs animate-pulse">
                    <span className="relative flex h-1.5 w-1.5 mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    Live
                  </Badge>
                </div>

                {/* Current Activity Card - Compact */}
                <div 
                  className={`p-3 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 transition-all duration-300 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {activity.couple.split(' ')[0].charAt(0)}{activity.couple.split(' ')[2]?.charAt(0) || 'R'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {activity.couple} <span className="text-muted-foreground font-normal text-xs">just booked</span>
                      </p>
                      <p className="text-primary font-medium text-sm truncate">{activity.vendor}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{activity.category}</Badge>
                        <span>•</span>
                        <span>{activity.city}</span>
                      </div>
                    </div>
                    <Heart className="h-4 w-4 text-pink-500 animate-pulse shrink-0" />
                  </div>
                </div>

                {/* Activity History - Compact */}
                <div className="mt-3 space-y-1.5 hidden sm:block">
                  {recentActivities
                    .filter((_, i) => i !== currentActivity)
                    .slice(0, 2)
                    .map((item, index) => (
                      <div 
                        key={item.id} 
                        className="flex items-center gap-2 text-xs text-muted-foreground p-1.5 rounded-md hover:bg-accent/5 transition-colors"
                        style={{ opacity: 1 - index * 0.3 }}
                      >
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium shrink-0">
                          {item.couple.split(' ')[0].charAt(0)}{item.couple.split(' ')[2]?.charAt(0) || 'R'}
                        </div>
                        <span className="truncate flex-1">
                          <span className="font-medium text-foreground">{item.couple}</span> booked {item.vendor}
                        </span>
                      </div>
                    ))}
                </div>

                <Link to="/search" className="block mt-3">
                  <div className="text-center py-2 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer">
                    <span className="text-primary font-medium text-xs sm:text-sm">Find Your Vendor →</span>
                  </div>
                </Link>
              </Card>
            </div>

            {/* Trending & Stats - Compact */}
            <div className="space-y-4">
              {/* Trending Categories */}
              <Card className="p-4 bg-card/50 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">Trending</h3>
                </div>
                <div className="space-y-2">
                  {trendingCategories.slice(0, 3).map((cat, i) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-3">{i + 1}</span>
                        <span className="font-medium text-xs">{cat.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] text-green-600 bg-green-500/10">
                        {cat.growth}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Live Stats - Compact */}
              <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">Right Now</h3>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-bold text-lg">247</div>
                    <div className="text-[10px] text-muted-foreground">Browsing</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-primary">34</div>
                    <div className="text-[10px] text-muted-foreground">Booked</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">12</div>
                    <div className="text-[10px] text-muted-foreground">Reviews</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
