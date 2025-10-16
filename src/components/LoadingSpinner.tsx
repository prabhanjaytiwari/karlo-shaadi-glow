import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16"
};

export const LoadingSpinner = ({ 
  size = "md", 
  className,
  text 
}: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 
        className={cn(
          "animate-spin text-primary",
          sizeClasses[size],
          className
        )} 
      />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export const FullPageLoader = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner size="xl" text={text} />
    </div>
  );
};

export const SectionLoader = ({ text }: { text?: string }) => {
  return (
    <div className="py-24 flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};