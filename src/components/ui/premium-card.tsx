import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface PremiumCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gold" | "maroon" | "gradient";
  glow?: boolean;
  hover?: boolean;
}

export const PremiumCard = forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ children, className, variant = "default", glow = false, hover = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl overflow-hidden transition-all duration-300",
          // Base styling
          "bg-card/80 backdrop-blur-xl border",
          // Variant styling
          variant === "default" && "border-border/50 shadow-lg",
          variant === "gold" && "border-accent/30 shadow-[0_8px_32px_hsl(38,90%,55%,0.15)]",
          variant === "maroon" && "border-primary/30 shadow-[0_8px_32px_hsl(340,75%,50%,0.15)]",
          variant === "gradient" && "border-transparent bg-gradient-to-br from-card via-card to-accent/5",
          // Glow effect
          glow && variant === "gold" && "before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-br before:from-accent/40 before:via-accent/20 before:to-transparent before:-z-10",
          glow && variant === "maroon" && "before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-br before:from-primary/40 before:via-primary/20 before:to-transparent before:-z-10",
          // Hover effects
          hover && "hover:shadow-xl hover:scale-[1.01] hover:border-accent/40",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PremiumCard.displayName = "PremiumCard";

interface PremiumCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  badge?: string;
}

export const PremiumCardHeader = forwardRef<HTMLDivElement, PremiumCardHeaderProps>(
  ({ children, className, icon, badge, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-6 pb-4", className)}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                {icon}
              </div>
            )}
            {children}
          </div>
          {badge && (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent border border-accent/20">
              {badge}
            </span>
          )}
        </div>
      </div>
    );
  }
);

PremiumCardHeader.displayName = "PremiumCardHeader";

export const PremiumCardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-6 pt-0", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PremiumCardContent.displayName = "PremiumCardContent";

// Premium Badge Component
interface PremiumBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "maroon" | "success" | "info";
  icon?: React.ReactNode;
}

export const PremiumBadge = forwardRef<HTMLSpanElement, PremiumBadgeProps>(
  ({ children, className, variant = "gold", icon, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full",
          variant === "gold" && "bg-gradient-to-r from-accent/20 to-amber-500/20 text-accent border border-accent/30",
          variant === "maroon" && "bg-gradient-to-r from-primary/20 to-rose-500/20 text-primary border border-primary/30",
          variant === "success" && "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-600 border border-emerald-500/30",
          variant === "info" && "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600 border border-blue-500/30",
          className
        )}
        {...props}
      >
        {icon}
        {children}
      </span>
    );
  }
);

PremiumBadge.displayName = "PremiumBadge";
