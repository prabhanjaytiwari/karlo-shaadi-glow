import { useState } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function StickyPromoBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-primary via-accent to-primary text-white py-2 px-4">
      <div className="container mx-auto flex items-center justify-center gap-4 text-sm">
        <Sparkles className="h-4 w-4 hidden sm:block" />
        <p className="font-medium text-center">
          <span className="hidden sm:inline">Limited Time Offer: </span>
          Vendors get first 3 months FREE on Featured plan!
        </p>
        <Link 
          to="/vendor-pricing" 
          className="hidden sm:inline-flex items-center gap-1 font-semibold hover:underline"
        >
          Claim Now <ArrowRight className="h-3 w-3" />
        </Link>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
