import { useState, useEffect } from "react";
import { X, TrendingUp, Users, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const fomoMessages = [
  { icon: Users, text: "47 couples are browsing vendors right now", color: "text-primary" },
  { icon: TrendingUp, text: "23 bookings made in the last 24 hours", color: "text-accent" },
  { icon: Clock, text: "December dates filling fast! Only 12% availability left", color: "text-destructive" },
  { icon: Zap, text: "Priya from Mumbai just booked a photographer!", color: "text-primary" },
  { icon: Users, text: "5 vendors upgraded to Featured this week", color: "text-accent" },
];

export function FOMOBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % fomoMessages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed || !isVisible) return null;

  const currentMessage = fomoMessages[currentIndex];
  const Icon = currentMessage.icon;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm animate-fade-up">
      <div className="bg-white/95 backdrop-blur-md border border-accent/20 rounded-xl shadow-lg p-4 pr-10">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted/50 transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-accent/10 ${currentMessage.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-foreground">
            {currentMessage.text}
          </p>
        </div>
      </div>
    </div>
  );
}
