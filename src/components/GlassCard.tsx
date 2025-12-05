import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "intense" | "subtle";
  hover?: boolean;
}

export const GlassCard = ({ 
  children, 
  className, 
  variant = "default",
  hover = false,
  ...props 
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        "rounded-lg transition-all duration-200",
        variant === "default" && "glass",
        variant === "intense" && "glass-intense",
        variant === "subtle" && "glass-subtle",
        hover && "hover:border-border/80 hover:shadow-lg cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
