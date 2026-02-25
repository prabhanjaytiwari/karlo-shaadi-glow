import { useState } from "react";
import { cn } from "@/lib/utils";

interface CinematicImageProps {
  src: string;
  alt: string;
  className?: string;
  cinematic?: boolean;
  sharp?: boolean;
  aspectRatio?: string;
  objectPosition?: string;
}

export const CinematicImage = ({
  src,
  alt,
  className,
  cinematic = false,
  sharp = false,
  aspectRatio,
  objectPosition = "center",
}: CinematicImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ aspectRatio }}>
      {/* Blur placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          !loaded && "opacity-0 scale-105",
          loaded && "opacity-100 scale-100",
          cinematic && "img-cinematic",
          sharp && "img-sharp",
        )}
        style={{ objectPosition, imageRendering: "auto" }}
      />
      {/* Cinematic film grain overlay */}
      {cinematic && loaded && (
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />
      )}
    </div>
  );
};
