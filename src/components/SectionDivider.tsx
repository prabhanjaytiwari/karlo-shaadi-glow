import { cn } from "@/lib/utils";

interface SectionDividerProps {
  variant?: "mandala" | "gradient" | "dots";
  className?: string;
}

export const SectionDivider = ({ variant = "gradient", className }: SectionDividerProps) => {
  if (variant === "mandala") {
    return (
      <div className={cn("relative py-4 flex items-center justify-center", className)}>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="absolute bg-background px-4">
          <svg width="32" height="32" viewBox="0 0 32 32" className="text-accent/40">
            <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="16" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.3" />
            {[0, 45, 90, 135].map(angle => (
              <line key={angle} x1="16" y1="2" x2="16" y2="30" stroke="currentColor" strokeWidth="0.3" transform={`rotate(${angle} 16 16)`} />
            ))}
          </svg>
        </div>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center gap-2 py-6", className)}>
        {[0, 1, 2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent/30" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("py-2", className)}>
      <div className="w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
    </div>
  );
};
