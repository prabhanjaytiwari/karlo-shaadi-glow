import { useState, useRef, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Crown, Sparkles, Shield, Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { LazyImage } from "@/components/LazyImage";

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
    starting_price?: number | null;
    gender_preference?: string | null;
    cities?: { name: string; state?: string } | null;
  };
  badge?: { text: string; variant: string } | null;
  imageUrl?: string;
  className?: string;
  style?: React.CSSProperties;
  enable3D?: boolean;
  compact?: boolean;
}

export const VendorCard = ({
  vendor,
  badge,
  imageUrl,
  className,
  style,
  enable3D = true,
  compact = false,
}: VendorCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const isSponsored = vendor.subscription_tier === "sponsored";
  const isFeatured = vendor.subscription_tier === "featured";

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!enable3D || !cardRef.current || compact) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 4;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 4;
    setTransform({ rotateX, rotateY });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setTransform({ rotateX: 0, rotateY: 0 });
  };

  // Compact mobile card
  if (compact) {
    return (
      <Link to={`/vendors/${vendor.id}`}>
        <div
          className={cn(
            "group flex gap-3 p-2.5 rounded-xl",
            "bg-card shadow-[var(--shadow-xs)]",
            "transition-all duration-200 active:scale-[0.98]",
            className
          )}
          style={style}
        >
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
            {imageUrl ? (
              <LazyImage src={imageUrl} alt={vendor.business_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                <span className="text-2xl font-display font-bold text-primary/30">
                  {(vendor.business_name || 'V').charAt(0)}
                </span>
                <span className="text-[9px] text-muted-foreground mt-0.5">Photo coming soon</span>
              </div>
            )}
            {(isSponsored || isFeatured) && (
              <div className={cn(
                "absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center",
                isSponsored ? "bg-primary/80" : "bg-accent/80"
              )}>
                {isSponsored ? <Crown className="h-3 w-3 text-white" /> : <Sparkles className="h-3 w-3 text-white" />}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 py-0.5">
            <div className="flex items-center gap-1.5 mb-1">
              {vendor.verified && <Shield className="h-3 w-3 text-accent flex-shrink-0" />}
              <h3 className="font-semibold text-sm leading-tight truncate">{vendor.business_name}</h3>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 capitalize">
                {vendor.category}
              </Badge>
              {vendor.cities?.name && (
                <span className="flex items-center gap-0.5 truncate">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  {vendor.cities.name}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-accent fill-accent" />
                <span className="text-xs font-medium">{vendor.average_rating?.toFixed(1) || "0.0"}</span>
                <span className="text-[10px] text-muted-foreground">({vendor.total_reviews || 0})</span>
              </div>
              {vendor.starting_price && (
                <span className="text-xs font-semibold text-primary">
                  From ₹{(vendor.starting_price / 1000).toFixed(0)}K
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Standard card
  return (
    <Link to={`/vendors/${vendor.id}`}>
      <div
        ref={cardRef}
        className={cn(
          "group relative rounded-2xl overflow-hidden",
          "bg-card shadow-[var(--shadow-sm)]",
          "transition-all duration-200 ease-out hover:shadow-[var(--shadow-md)]",
          className
        )}
        style={{
          ...style,
          transform: enable3D
            ? `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) ${isHovering ? 'translateZ(4px)' : ''}`
            : undefined,
          transformStyle: "preserve-3d",
          transition: isHovering ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden">
          {imageUrl ? (
            <LazyImage
              src={imageUrl}
              alt={vendor.business_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-accent/3 to-primary/5">
              <span className="text-5xl font-display font-bold text-primary/20">
                {(vendor.business_name || 'V').charAt(0)}
              </span>
              <span className="text-xs text-muted-foreground mt-1">Portfolio coming soon</span>
            </div>
          )}

          {/* Tier badge */}
          {(isSponsored || isFeatured) && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
              <div className={cn(
                "w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center -md",
                isSponsored ? "bg-primary/20" : "bg-accent/20"
              )}>
                {isSponsored ? <Crown className="h-3 w-3 text-primary" /> : <Sparkles className="h-3 w-3 text-accent" />}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 space-y-2">
          <div className="flex flex-wrap items-center gap-1">
            {vendor.verified && (
              <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0 h-5">
                <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5" />
                Verified
              </Badge>
            )}
            <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0 h-5 capitalize">
              {vendor.category}
            </Badge>
          </div>

          <h3 className="font-semibold text-sm sm:text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {vendor.business_name}
          </h3>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            {vendor.cities?.name && (
              <div className="flex items-center gap-1 text-muted-foreground truncate max-w-[40%]">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{vendor.cities.name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              {vendor.starting_price && (
                <span className="font-semibold text-primary">
                  ₹{vendor.starting_price.toLocaleString()}
                </span>
              )}
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                <span className="font-medium">{vendor.average_rating?.toFixed(1) || "0.0"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
