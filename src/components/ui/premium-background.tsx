import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface PremiumBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "wedding" | "festive" | "elegant";
  pattern?: boolean;
  animated?: boolean;
}

export const PremiumBackground = forwardRef<HTMLDivElement, PremiumBackgroundProps>(
  ({ children, className, variant = "default", pattern = true, animated = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative min-h-screen overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Base gradient */}
        <div 
          className={cn(
            "absolute inset-0 -z-20",
            variant === "default" && "bg-gradient-to-b from-background via-accent/3 to-background",
            variant === "wedding" && "bg-gradient-to-br from-primary/5 via-background to-accent/5",
            variant === "festive" && "bg-gradient-to-b from-accent/8 via-background to-primary/5",
            variant === "elegant" && "bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.08)_0%,transparent_50%),radial-gradient(ellipse_at_bottom,hsl(var(--primary)/0.06)_0%,transparent_50%)]"
          )}
        />

        {/* Decorative orbs */}
        <div className={cn(
          "absolute -z-10 top-20 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30",
          "bg-gradient-to-br from-accent/30 to-primary/20",
          animated && "animate-pulse"
        )} />
        <div className={cn(
          "absolute -z-10 bottom-20 -right-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-25",
          "bg-gradient-to-tl from-primary/30 to-accent/20",
          animated && "animate-pulse"
        )} style={{ animationDelay: "1s" }} />

        {/* Pattern overlay */}
        {pattern && (
          <div 
            className="absolute inset-0 -z-10 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        )}

        {/* Content */}
        {children}
      </div>
    );
  }
);

PremiumBackground.displayName = "PremiumBackground";

// Decorative elements for Indian wedding aesthetic
export const MandalaDecor = ({ className }: { className?: string }) => (
  <div className={cn("absolute opacity-5 pointer-events-none", className)}>
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="currentColor">
      <defs>
        <pattern id="mandala" patternUnits="userSpaceOnUse" width="100" height="100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <line
              key={angle}
              x1="50"
              y1="10"
              x2="50"
              y2="90"
              stroke="currentColor"
              strokeWidth="0.3"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#mandala)"/>
    </svg>
  </div>
);

// Powered by Karlo Shaadi badge
export const PoweredByBadge = ({ className }: { className?: string }) => (
  <div className={cn(
    "inline-flex items-center gap-2 px-4 py-2 rounded-full",
    "bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10",
    "border border-primary/20 text-sm",
    className
  )}>
    <span className="text-muted-foreground">Powered by</span>
    <span className="font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
      Karlo Shaadi
    </span>
    <span className="text-primary">💒</span>
  </div>
);

// Premium loading spinner
export const PremiumLoader = ({ text = "Loading..." }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-12">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-muted" />
      <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-primary border-r-accent border-b-transparent border-l-transparent animate-spin" />
      <div className="absolute inset-2 w-12 h-12 rounded-full border-2 border-t-accent border-r-transparent border-b-primary border-l-transparent animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
    </div>
    <p className="text-muted-foreground animate-pulse">{text}</p>
  </div>
);
