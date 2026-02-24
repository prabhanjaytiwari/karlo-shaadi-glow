import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, X, Calculator, Calendar, Heart } from "lucide-react";

const STORAGE_KEY = "ks_exit_intent_dismissed";
const COOLDOWN_DAYS = 5;

export const ExitIntentPopup = () => {
  const [open, setOpen] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const shouldShow = useCallback(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < COOLDOWN_DAYS * 24 * 60 * 60 * 1000) {
        return false;
      }
    }
    return true;
  }, []);

  useEffect(() => {
    if (!shouldShow()) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !triggered) {
        // Small delay to avoid false triggers
        timeoutId = setTimeout(() => {
          setOpen(true);
          setTriggered(true);
        }, 100);
      }
    };

    // Only on desktop (no mouseleave on mobile)
    if (window.innerWidth > 768) {
      // Delay attaching by 15s so it doesn't fire on immediate page loads
      const attachTimeout = setTimeout(() => {
        document.addEventListener("mouseleave", handleMouseLeave);
      }, 15000);

      return () => {
        clearTimeout(attachTimeout);
        clearTimeout(timeoutId);
        document.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [shouldShow, triggered]);

  const handleDismiss = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  const tools = [
    {
      icon: Sparkles,
      title: "2-Min Wedding Plan",
      desc: "AI builds your complete plan",
      link: "/plan-wizard",
      color: "from-primary to-rose-400",
    },
    {
      icon: Calculator,
      title: "Budget Calculator",
      desc: "Know exactly what to spend",
      link: "/budget-calculator",
      color: "from-amber-500 to-orange-400",
    },
    {
      icon: Calendar,
      title: "Muhurat Finder",
      desc: "Auspicious dates for 2025-26",
      link: "/muhurat-finder",
      color: "from-emerald-500 to-teal-400",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleDismiss(); }}>
      <DialogContent className="sm:max-w-md p-0 gap-0 border-0 bg-transparent shadow-none [&>button]:hidden">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-background via-background to-rose-50/50 border border-primary/20 shadow-2xl shadow-primary/10">
          {/* Close */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Header */}
          <div className="px-6 pt-8 pb-4 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Heart className="h-3.5 w-3.5 text-primary fill-primary" />
              <span className="text-xs font-semibold text-primary">Before you go...</span>
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl mb-2 text-foreground">
              Get Your <span className="text-primary">FREE</span> Wedding Plan
            </h3>
            <p className="text-muted-foreground text-sm">
              Try our free AI tools — no signup needed, takes 2 minutes
            </p>
          </div>

          {/* Tools */}
          <div className="px-6 pb-6 space-y-2.5">
            {tools.map((tool) => (
              <Link
                key={tool.link}
                to={tool.link}
                onClick={handleDismiss}
                className="group flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-primary/5 border border-border hover:border-primary/30 transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <tool.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">{tool.title}</p>
                  <p className="text-xs text-muted-foreground">{tool.desc}</p>
                </div>
                <span className="text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-0">
            <Button
              variant="ghost"
              className="w-full text-xs text-muted-foreground hover:text-foreground"
              onClick={handleDismiss}
            >
              No thanks, I'll figure it out myself
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
