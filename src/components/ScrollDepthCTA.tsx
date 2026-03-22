import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "ks_scroll_cta_dismissed";
const COOLDOWN_HOURS = 24;

export const ScrollDepthCTA = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check cooldown
    const lastDismissed = localStorage.getItem(STORAGE_KEY);
    if (lastDismissed) {
      const elapsed = Date.now() - parseInt(lastDismissed, 10);
      if (elapsed < COOLDOWN_HOURS * 60 * 60 * 1000) {
        setDismissed(true);
        return;
      }
    }

    const handleScroll = () => {
      const scrollPercent = 
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent >= 55 && !dismissed) {
        setVisible(true);
      }
    };

    // Throttle scroll
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [dismissed]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-40 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="relative bg-gradient-to-r from-primary to-rose-500 rounded-2xl p-4 pr-10 shadow-2xl shadow-primary/30">
        {/* Close */}
        <button
          onClick={handleDismiss}
          className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <X className="h-3.5 w-3.5 text-white" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20  flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm mb-0.5">
              Planning a wedding? 💍
            </p>
            <p className="text-white/80 text-xs mb-3">
              Get matched with verified vendors in 2 minutes — completely free
            </p>
            <Link to="/plan-wizard" onClick={handleDismiss}>
              <Button
                size="sm"
                className="bg-white text-primary hover:bg-white/90 rounded-full text-xs font-semibold h-8 px-4 shadow-md"
              >
                Get My Free Plan →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
