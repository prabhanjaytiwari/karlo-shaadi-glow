import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Crown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import { getHomepageFeatured, type Vendor } from "@/lib/vendorRanking";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function SponsoredVendorsCarousel() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const plugin = useRef(AutoScroll({ playOnInit: true, speed: 0.8, stopOnInteraction: true }));
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  useEffect(() => {
    loadSponsoredVendors();
  }, []);

  const loadSponsoredVendors = async () => {
    try {
      const { data } = await supabase
        .from("vendors")
        .select(`*, cities (name, state)`)
        .eq("is_active", true)
        .eq("verified", true)
        .eq("subscription_tier", "sponsored")
        .eq("homepage_featured", true);

      if (data) {
        const featured = getHomepageFeatured(data as Vendor[]);
        setVendors(featured);
      }
    } catch (error) {
      console.error("Error loading sponsored vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || vendors.length === 0) return null;

  return (
    <section ref={ref} className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div 
          className="text-center mb-10"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="inline-block mb-4">
            <Badge variant="outline" className="text-sm px-4 py-2 bg-card">
              <Crown className="h-4 w-4 mr-2 text-accent" />
              <span className="text-accent font-medium">Featured Vendors</span>
            </Badge>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">
            Top-Rated Wedding <span className="text-accent">Professionals</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            Handpicked vendors with verified profiles and exceptional reviews
          </p>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {vendors.map((vendor, index) => (
              <CarouselItem 
                key={vendor.id} 
                className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <Link to={`/vendors/${vendor.id}`}>
                  <div className="group relative overflow-hidden bg-card rounded-2xl shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="relative">
                      <div className="relative aspect-video bg-muted overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl font-bold text-muted-foreground/20 group-hover:scale-110 transition-transform duration-500">
                            {vendor.business_name.charAt(0)}
                          </span>
                        </div>
                        
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-card/90 backdrop-blur-sm text-accent border-0 shadow-sm">
                            <Crown className="h-3 w-3 mr-1" />
                            Verified Premium
                          </Badge>
                        </div>

                        <div className="absolute top-3 right-3">
                          <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                            <Star className="h-4 w-4 fill-accent text-accent" />
                            <span className="font-bold text-sm text-card-foreground">{vendor.average_rating || 5.0}</span>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-5 relative">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors duration-200">
                              {vendor.business_name}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {vendor.category}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {vendor.description || "Professional wedding services with excellence"}
                        </p>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{vendor.cities?.name || "India"}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {vendor.total_reviews || 0} reviews
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-primary">
                              {vendor.years_experience}+ Years Experience
                            </span>
                            <ChevronRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform duration-200" />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 bg-card hover:bg-muted transition-colors" />
          <CarouselNext className="hidden md:flex -right-4 bg-card hover:bg-muted transition-colors" />
        </Carousel>

        <div 
          className="text-center mt-10"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            transitionDelay: '0.3s',
          }}
        >
          <Link to="/search?tier=sponsored">
            <Button variant="outline" size="lg" className="group rounded-full">
              View All Premium Vendors
              <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
