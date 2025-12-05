import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  threshold?: number;
  blur?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
}

export const LazyImage = ({
  src,
  alt,
  className,
  placeholderClassName,
  threshold = 0,
  blur = true,
  onLoad,
  onError,
  sizes
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Use native lazy loading for browsers that support it
    if ('loading' in HTMLImageElement.prototype) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "100px" }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate optimized srcset for responsive images
  const getSrcSet = (originalSrc: string) => {
    // For external URLs (like unsplash), use their resize parameters
    if (originalSrc.includes('unsplash.com')) {
      return `${originalSrc}&w=400 400w, ${originalSrc}&w=800 800w, ${originalSrc}&w=1200 1200w`;
    }
    return undefined;
  };

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", placeholderClassName)}>
      {/* Shimmer placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-muted/50 to-muted/30" />
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-muted/30 flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Image unavailable</span>
        </div>
      )}

      {/* Optimized image */}
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        srcSet={isInView ? getSrcSet(src) : undefined}
        sizes={sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        alt={alt}
        className={cn(
          "transition-all duration-500",
          isLoaded ? "opacity-100" : blur ? "opacity-0 blur-sm" : "opacity-0",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
      />
    </div>
  );
};
