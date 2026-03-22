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
        "rounded-2xl bg-card shadow-[var(--shadow-sm)] transition-all duration-200",
        hover && "hover:shadow-[var(--shadow-md)] hover:-translate-y-px cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
