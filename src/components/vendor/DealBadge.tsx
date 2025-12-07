import { Sparkles } from "lucide-react";

interface DealBadgeProps {
  className?: string;
}

export const DealBadge = ({ className }: DealBadgeProps) => {
  return (
    <div 
      className={`
        relative overflow-hidden
        bg-gradient-to-r from-accent via-amber-500 to-accent
        text-white font-semibold text-sm
        px-4 py-2.5 rounded-lg
        flex items-center justify-center gap-2
        shadow-md
        ${className}
      `}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
      
      <Sparkles className="h-4 w-4" />
      <span className="relative">Mention "Karlo Shaadi" for Best Deal!</span>
    </div>
  );
};
