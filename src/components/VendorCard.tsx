import { useState, useRef, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Crown, Sparkles, Shield, Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PremiumImage } from "@/components/PremiumImage";

interface VendorCardProps {
  vendor: {
    id: string;
    business_name: string;
    category: string;
    description?: string | null;
    average_rating?: number | null;
    total_reviews?: number | null;
    verified?: boolean;
    subscription_tier?: string | null;
    years_experience?: number | null;
    cities?: { name: string; state?: string } | null;
  };
  badge?: { text: string; variant: string } | null;
  imageUrl?: string;
  className?: string;
  style?: React.CSSProperties;
  enable3D?: boolean;
}

export const VendorCard = ({
  vendor,
  badge,
  imageUrl,
  className,
  style,
  enable3D = true,
}: VendorCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const isSponsored = vendor.subscription_tier === "sponsored";
  const isFeatured = vendor.subscription_tier === "featured";

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!enable3D || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Calculate rotation (max 8 degrees)
    const rotateY = (mouseX / (rect.width / 2)) * 8;
    const rotateX = -(mouseY / (rect.height / 2)) * 8;

    setTransform({ rotateX, rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTransform({ rotateX: 0, rotateY: 0 });
  };

  return (
    <Link to={`/vendors/${vendor.id}`}>
      <div
        ref={cardRef}
        className={cn(
          "group relative rounded-2xl overflow-hidden",
          "bg-card/80 backdrop-blur-sm border border-border/50",
          "transition-all duration-300 ease-out",
          isSponsored && "border-primary/30 shadow-lg shadow-primary/5",
          isFeatured && "border-accent/30 shadow-lg shadow-accent/5",
          className
        )}
        style={{
          ...style,
          transform: enable3D
            ? `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) ${isHovering ? 'translateZ(10px)' : ''}`
            : undefined,
          transformStyle: "preserve-3d",
          transition: isHovering
            ? "transform 0.1s ease-out"
            : "transform 0.5s ease-out",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gradient border glow on hover */}
        <div
          className={cn(
            "absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm",
            isSponsored
              ? "bg-gradient-to-br from-primary via-accent to-primary"
              : isFeatured
              ? "bg-gradient-to-br from-accent via-secondary to-accent"
              : "bg-gradient-to-br from-primary/50 via-accent/50 to-primary/50"
          )}
        />

        {/* Image section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {imageUrl ? (
            <PremiumImage
              src={imageUrl}
              alt={vendor.business_name}
              className="group-hover:scale-105 transition-transform duration-500"
              containerClassName="w-full h-full"
            />
          ) : (
            <div
              className={cn(
                "w-full h-full flex items-center justify-center",
                isSponsored
                  ? "bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20"
                  : isFeatured
                  ? "bg-gradient-to-br from-accent/20 via-accent/10 to-secondary/20"
                  : "bg-gradient-to-br from-muted/50 to-muted/30"
              )}
            >
              <span
                className={cn(
                  "text-5xl font-bold",
                  isSponsored ? "text-primary/60" : "text-accent/60"
                )}
              >
                {vendor.business_name.charAt(0)}
              </span>
            </div>
          )}

          {/* Tier badge */}
          {(isSponsored || isFeatured) && (
            <div className="absolute top-3 right-3 z-10">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  "backdrop-blur-md border",
                  isSponsored
                    ? "bg-primary/20 border-primary/30"
                    : "bg-accent/20 border-accent/30"
                )}
              >
                {isSponsored ? (
                  <Crown className="h-4 w-4 text-primary" />
                ) : (
                  <Sparkles className="h-4 w-4 text-accent" />
                )}
              </div>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content section */}
        <div className="p-4 space-y-3" style={{ transform: "translateZ(20px)" }}>
          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            {badge && (
              <Badge
                variant={badge.variant as any}
                className="text-xs font-medium"
              >
                {badge.variant === "premium" && <Crown className="h-3 w-3 mr-1" />}
                {badge.variant === "accent" && <Sparkles className="h-3 w-3 mr-1" />}
                {badge.text}
              </Badge>
            )}
            {vendor.verified && (
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs capitalize">
              {vendor.category}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {vendor.business_name}
          </h3>

          {/* Description */}
          {vendor.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {vendor.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm pt-1">
            {vendor.cities?.name && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{vendor.cities.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span className="font-medium">{vendor.average_rating || 0}</span>
              <span className="text-muted-foreground">
                ({vendor.total_reviews || 0})
              </span>
            </div>
          </div>
        </div>

        {/* Shine effect on hover */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
            "bg-gradient-to-tr from-transparent via-white/5 to-transparent"
          )}
        />
      </div>
    </Link>
  );
};
