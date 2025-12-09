import { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export function StickyPromoBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    {
      text: "500+ couples found vendors this week!",
      cta: "Find Yours",
      link: "/search",
    },
    {
      text: "New vendors joining daily – Premium listings available",
      cta: "View Plans",
      link: "/vendor-pricing",
    },
    {
      text: "Exclusive deals on Gold & Diamond vendor plans",
      cta: "See Offers",
      link: "/vendor-pricing",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const currentMessage = messages[messageIndex];

  return (
    <div className="sticky top-0 left-0 right-0 z-[60] bg-gradient-to-r from-primary via-accent to-primary text-white py-2 px-4">
      <div className="container mx-auto flex items-center justify-center gap-4 text-sm">
        <Sparkles className="h-4 w-4 hidden sm:block animate-pulse" />
        <p className="font-medium text-center animate-fade-in" key={messageIndex}>
          {currentMessage.text}
        </p>
        <Link 
          to={currentMessage.link} 
          className="hidden sm:inline-flex items-center gap-1 font-semibold hover:underline"
        >
          {currentMessage.cta} <ArrowRight className="h-3 w-3" />
        </Link>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
