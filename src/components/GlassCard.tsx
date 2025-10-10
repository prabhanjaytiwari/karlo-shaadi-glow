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
        "rounded-2xl",
        variant === "default" && "glass",
        variant === "intense" && "glass-intense",
        variant === "subtle" && "glass-subtle",
        hover && "hover-lift cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
