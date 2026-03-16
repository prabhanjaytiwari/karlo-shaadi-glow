import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "intense" | "subtle" | "ios" | "ios-thick" | "ios-thin";
  hover?: boolean;
}

export const GlassCard = ({ 
  children, 
  className, 
  variant = "ios",
  hover = false,
  ...props 
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-200",
        variant === "default" && "glass",
        variant === "intense" && "glass-intense",
        variant === "subtle" && "glass-subtle",
        variant === "ios" && "glass-ios",
        variant === "ios-thick" && "glass-ios-thick",
        variant === "ios-thin" && "glass-ios-thin",
        hover && "hover:shadow-lg cursor-pointer",
        className
      )}
      style={{ transitionTimingFunction: 'var(--ease-spring)' }}
      {...props}
    >
      {children}
    </div>
  );
};
