import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface SuccessAnimationProps {
  message?: string;
  onComplete?: () => void;
  duration?: number;
}

export const SuccessAnimation = ({ 
  message = "Success!", 
  onComplete,
  duration = 2000 
}: SuccessAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 -sm animate-fade-in">
      <div className="bg-card border-2 border-primary rounded-3xl p-8 shadow-2xl animate-scale-in">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-primary animate-scale-in" />
            </div>
          </div>
          <p className="text-xl font-bold text-center">{message}</p>
        </div>
      </div>
    </div>
  );
};
