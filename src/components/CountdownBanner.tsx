import { useState, useEffect } from "react";
import { Clock, Flame, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// FIX 8: Real end-of-month countdown (no localStorage reset trick)
function getEndOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
}

function getTimeLeft(): number {
  return Math.max(0, getEndOfMonth().getTime() - Date.now());
}

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

interface CountdownBannerProps {
  className?: string;
  compact?: boolean;
}

export function CountdownBanner({ className, compact = false }: CountdownBannerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (timeLeft <= 0) return null;

  const { days, hours, minutes, seconds } = formatTime(timeLeft);
  const isUrgent = timeLeft < 24 * 60 * 60 * 1000; // < 1 day left
  const pad = (n: number) => n.toString().padStart(2, "0");

  if (compact) {
    return (
      <div className={cn(
        "flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg",
        isUrgent
          ? "bg-destructive/15 text-destructive border border-destructive/30 animate-pulse"
          : "bg-accent/15 text-accent-foreground border border-accent/30",
        className
      )}>
        <Flame className="h-3.5 w-3.5" />
        <span>Launch Offer ends in</span>
        <span className="font-mono font-black tracking-wider">
          {days > 0 ? `${days}d ` : ""}{pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </span>
      </div>
    );
  }

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-4 md:p-5",
      isUrgent
        ? "bg-gradient-to-r from-destructive/20 via-destructive/10 to-destructive/20 border-2 border-destructive/40"
        : "bg-gradient-to-r from-accent/20 via-primary/10 to-accent/20 border-2 border-accent/40",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_infinite] pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl", isUrgent ? "bg-destructive/20" : "bg-accent/20")}>
            {isUrgent ? <Zap className="h-5 w-5 text-destructive animate-pulse" /> : <Flame className="h-5 w-5 text-accent-foreground" />}
          </div>
          <div>
            <p className="font-black text-sm md:text-base">
              🔥 LAUNCH OFFER: <span className={isUrgent ? "text-destructive" : "text-primary"}>50% OFF</span> First Month!
            </p>
            <p className="text-xs text-muted-foreground">
              {isUrgent ? "⚠️ Offer ends today! Don't miss this price." : "Valid till end of this month. New subscribers only."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className={cn("h-4 w-4", isUrgent ? "text-destructive" : "text-muted-foreground")} />
          <div className="flex gap-1">
            {[
              ...(days > 0 ? [{ value: pad(days), label: "DAYS" }] : []),
              { value: pad(hours), label: "HRS" },
              { value: pad(minutes), label: "MIN" },
              { value: pad(seconds), label: "SEC" },
            ].map((unit, i) => (
              <div key={i} className="flex items-center gap-1">
                {i > 0 && <span className="font-mono font-black text-lg animate-pulse">:</span>}
                <div className={cn(
                  "flex flex-col items-center rounded-lg px-2.5 py-1 min-w-[44px]",
                  isUrgent ? "bg-destructive/20" : "bg-primary/10"
                )}>
                  <span className={cn("font-mono font-black text-xl leading-tight", isUrgent ? "text-destructive" : "text-foreground")}>{unit.value}</span>
                  <span className="text-[9px] font-semibold text-muted-foreground tracking-wider">{unit.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper: get whether offer is still active (always active until end of month)
export function isOfferActive(): boolean {
  return getTimeLeft() > 0;
}

// Helper: get discounted price (50% off)
export function getDiscountedPrice(original: number): number {
  return Math.round(original / 2);
}

// Helper: per-day cost
export function getPerDayPrice(monthlyPrice: number): number {
  return Math.round(monthlyPrice / 30);
}