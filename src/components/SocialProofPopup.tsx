import { useState, useEffect } from "react";
import { Sparkles, Heart, Stars, PartyPopper, Crown, Gem } from "lucide-react";
import weddingCouple1 from "@/assets/wedding-couple-1.jpg";
import weddingCouple2 from "@/assets/wedding-couple-2.jpg";
import weddingCeremony from "@/assets/wedding-ceremony.jpg";
import weddingHaldi from "@/assets/wedding-haldi.jpg";
import weddingBridesmaids from "@/assets/wedding-bridesmaids.jpg";
import weddingManifesting from "@/assets/wedding-manifesting.jpg";

// Premium celebration moments with Indian wedding vibes
const celebrationMoments = [
  {
    type: "rishta_pakka",
    couple: "Rahul & Priya",
    city: "Mumbai",
    image: weddingCouple1,
    quote: "Found our dream vendors!",
    icon: Heart,
    accent: "from-rose-500 to-pink-600",
    bgAccent: "bg-rose-50",
    borderAccent: "border-rose-200",
  },
  {
    type: "muhurat_booked",
    couple: "Vikram & Anjali",
    city: "Delhi",
    image: weddingCeremony,
    quote: "Muhurat locked for Feb 2025",
    icon: Stars,
    accent: "from-amber-500 to-orange-600",
    bgAccent: "bg-amber-50",
    borderAccent: "border-amber-200",
  },
  {
    type: "dream_team",
    couple: "Arjun & Meera",
    city: "Jaipur",
    image: weddingHaldi,
    quote: "Booked all 8 vendors!",
    icon: Crown,
    accent: "from-purple-500 to-violet-600",
    bgAccent: "bg-purple-50",
    borderAccent: "border-purple-200",
  },
  {
    type: "celebration",
    couple: "Karan & Simran",
    city: "Bangalore",
    image: weddingBridesmaids,
    quote: "Wedding planning done!",
    icon: PartyPopper,
    accent: "from-emerald-500 to-teal-600",
    bgAccent: "bg-emerald-50",
    borderAccent: "border-emerald-200",
  },
  {
    type: "premium_couple",
    couple: "Aditya & Neha",
    city: "Pune",
    image: weddingCouple2,
    quote: "Upgraded to VIP!",
    icon: Gem,
    accent: "from-blue-500 to-indigo-600",
    bgAccent: "bg-blue-50",
    borderAccent: "border-blue-200",
  },
  {
    type: "shaadi_magic",
    couple: "Rohan & Tara",
    city: "Hyderabad",
    image: weddingManifesting,
    quote: "Our fairytale begins!",
    icon: Sparkles,
    accent: "from-pink-500 to-rose-600",
    bgAccent: "bg-pink-50",
    borderAccent: "border-pink-200",
  },
];

const typeLabels: Record<string, string> = {
  rishta_pakka: "💍 Rishta Pakka!",
  muhurat_booked: "🪔 Shubh Muhurat",
  dream_team: "👑 Dream Team Complete",
  celebration: "🎊 Badhai Ho!",
  premium_couple: "✨ Royal Treatment",
  shaadi_magic: "💫 Shaadi Magic",
};

export function SocialProofPopup() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start showing after 8 seconds
    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, 8000);

    return () => clearTimeout(initialTimeout);
  }, []);

  useEffect(() => {
    if (!isVisible || hasInteracted) return;

    // Show for 6 seconds, hide for 12 seconds
    const hideTimeout = setTimeout(() => {
      setIsAnimating(false);
      
      setTimeout(() => {
        setIsVisible(false);
        
        const showTimeout = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % celebrationMoments.length);
          setIsVisible(true);
          setTimeout(() => setIsAnimating(true), 50);
        }, 12000);

        return () => clearTimeout(showTimeout);
      }, 300);
    }, 6000);

    return () => clearTimeout(hideTimeout);
  }, [isVisible, currentIndex, hasInteracted]);

  if (!isVisible || hasInteracted) return null;

  const moment = celebrationMoments[currentIndex];
  const IconComponent = moment.icon;

  return (
    <div 
      className={`fixed bottom-20 left-4 z-50 max-w-[280px] cursor-pointer transition-all duration-500 ${
        isAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
      }`}
      onClick={() => setHasInteracted(true)}
    >
      {/* Main Card */}
      <div className={`relative overflow-hidden rounded-2xl shadow-2xl border-2 ${moment.borderAccent} ${moment.bgAccent}`}>
        {/* Animated Border Glow */}
        <div className={`absolute inset-0 bg-gradient-to-r ${moment.accent} opacity-20 animate-pulse`} />
        
        {/* Content */}
        <div className="relative p-4">
          {/* Header Badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${moment.accent} text-white text-xs font-bold mb-3 shadow-lg`}>
            <IconComponent className="w-3 h-3" />
            <span>{typeLabels[moment.type]}</span>
          </div>
          
          {/* Couple Info */}
          <div className="flex items-center gap-3">
            {/* Couple Image */}
            <div className="relative">
              <div className={`w-14 h-14 rounded-xl overflow-hidden ring-2 ring-offset-2 ring-offset-white shadow-lg`} style={{ 
                boxShadow: `0 4px 20px -4px ${moment.accent.includes('rose') ? 'rgba(244,63,94,0.4)' : 
                  moment.accent.includes('amber') ? 'rgba(245,158,11,0.4)' : 
                  moment.accent.includes('purple') ? 'rgba(168,85,247,0.4)' : 
                  moment.accent.includes('emerald') ? 'rgba(16,185,129,0.4)' : 
                  moment.accent.includes('blue') ? 'rgba(59,130,246,0.4)' : 'rgba(236,72,153,0.4)'}` 
              }}>
                <img 
                  src={moment.image} 
                  alt={moment.couple}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Heart */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md animate-bounce">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
              </div>
            </div>
            
            {/* Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-foreground text-sm truncate">
                {moment.couple}
              </h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {moment.city}
              </p>
              <p className={`text-xs font-medium mt-1 bg-gradient-to-r ${moment.accent} bg-clip-text text-transparent`}>
                "{moment.quote}"
              </p>
            </div>
          </div>
          
          {/* Sparkle Decorations */}
          <div className="absolute top-2 right-2 opacity-60">
            <Sparkles className={`w-4 h-4 text-amber-400 animate-pulse`} />
          </div>
        </div>
        
        {/* Close hint */}
        <div className="absolute top-2 right-8 opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-muted-foreground">Click to dismiss</span>
        </div>
      </div>
      
      {/* Stats Badge Below */}
      <div className="mt-2 flex items-center justify-center gap-2">
        <div className="flex -space-x-1">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="w-5 h-5 rounded-full border-2 border-white overflow-hidden shadow-sm"
            >
              <img 
                src={celebrationMoments[(currentIndex + i + 1) % celebrationMoments.length].image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground font-medium">
          +47 couples planning today
        </span>
      </div>
    </div>
  );
}
