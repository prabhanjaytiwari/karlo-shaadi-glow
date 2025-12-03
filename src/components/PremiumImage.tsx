import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface PremiumImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  blur?: boolean;
  threshold?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  auto: "",
};

export const PremiumImage = ({
  src,
  alt,
  className,
  containerClassName,
  aspectRatio = "auto",
  blur = true,
  threshold = 0.1,
  onLoad,
  onError,
}: PremiumImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "50px" }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-muted/30",
        aspectRatioClasses[aspectRatio],
        containerClassName
      )}
    >
      {/* Shimmer placeholder */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          isLoaded ? "opacity-0" : "opacity-100"
        )}
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-muted/50 to-accent/10" />
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Subtle pattern */}
        <div className="absolute inset-0 noise-texture opacity-20" />
      </div>

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-destructive/10 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted/50 flex items-center justify-center">
              <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs text-muted-foreground">Image unavailable</span>
          </div>
        </div>
      )}

      {/* Actual image with blur-up effect */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            isLoaded 
              ? "opacity-100 scale-100" 
              : blur 
                ? "opacity-0 scale-105 blur-lg" 
                : "opacity-0",
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
        />
      )}

      {/* Subtle overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};
