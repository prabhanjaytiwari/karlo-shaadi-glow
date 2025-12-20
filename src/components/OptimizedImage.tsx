import { useState, useEffect, useRef, memo } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  blur?: boolean;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
}

// Generate blur placeholder data URL
const generateBlurPlaceholder = (width = 10, height = 10) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'hsl(var(--muted))';
    ctx.fillRect(0, 0, width, height);
  }
  return canvas.toDataURL();
};

// Check if WebP is supported
const supportsWebP = (() => {
  if (typeof window === 'undefined') return false;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').startsWith('data:image/webp');
})();

// Transform Unsplash URLs for optimization
const getOptimizedSrc = (src: string, width?: number): string => {
  if (!src) return '';
  
  // Unsplash optimization
  if (src.includes('unsplash.com')) {
    const params = new URLSearchParams();
    if (width) params.set('w', String(width));
    params.set('q', '80');
    params.set('auto', 'format');
    if (supportsWebP) params.set('fm', 'webp');
    
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}${params.toString()}`;
  }
  
  // Supabase storage optimization
  if (src.includes('supabase.co/storage')) {
    const params = new URLSearchParams();
    if (width) params.set('width', String(width));
    params.set('quality', '80');
    
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}${params.toString()}`;
  }
  
  return src;
};

// Generate responsive srcset
const generateSrcSet = (src: string): string | undefined => {
  if (!src) return undefined;
  
  if (src.includes('unsplash.com')) {
    const widths = [400, 800, 1200, 1920];
    return widths
      .map(w => `${getOptimizedSrc(src, w)} ${w}w`)
      .join(', ');
  }
  
  return undefined;
};

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  auto: ""
};

export const OptimizedImage = memo(({
  src,
  alt,
  className,
  containerClassName,
  width,
  height,
  priority = false,
  blur = true,
  fallbackSrc = "/placeholder.svg",
  onLoad,
  onError,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  aspectRatio = "auto"
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [blurDataUrl] = useState(() => generateBlurPlaceholder());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || !containerRef.current) {
      setIsInView(true);
      return;
    }

    // Use native lazy loading where supported
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
      { rootMargin: "200px", threshold: 0 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const optimizedSrc = getOptimizedSrc(src, width);
  const srcSet = generateSrcSet(src);

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "relative overflow-hidden bg-muted/30",
        aspectRatioClasses[aspectRatio],
        containerClassName
      )}
      style={width && height ? { width, height } : undefined}
    >
      {/* Blur placeholder */}
      {blur && !isLoaded && !hasError && (
        <div 
          className="absolute inset-0 z-10"
          style={{
            backgroundImage: `url(${blurDataUrl})`,
            backgroundSize: 'cover',
            filter: 'blur(20px)',
            transform: 'scale(1.1)'
          }}
        />
      )}

      {/* Shimmer loading animation */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-5">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
          <img 
            src={fallbackSrc} 
            alt={alt} 
            className="w-1/2 h-1/2 object-contain opacity-50" 
          />
        </div>
      )}

      {/* Main image */}
      {isInView && !hasError && (
        <img
          src={optimizedSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "transition-all duration-500",
            isLoaded ? "opacity-100 scale-100" : blur ? "opacity-0 scale-105" : "opacity-0",
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "low"}
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";
