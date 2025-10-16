import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  threshold?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage = ({
  src,
  alt,
  className,
  placeholderClassName,
  threshold = 0.1,
  onLoad,
  onError
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(imgRef.current);

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
    <div className="relative overflow-hidden">
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse",
            placeholderClassName
          )}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-destructive/20 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Failed to load image</span>
        </div>
      )}

      {/* Actual image */}
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        alt={alt}
        className={cn(
          "transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};