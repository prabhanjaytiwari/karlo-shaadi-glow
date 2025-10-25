import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
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

export function SponsoredVendorsCarousel() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const plugin = useRef(AutoScroll({ playOnInit: true, speed: 1, stopOnInteraction: true }));

  useEffect(() => {
    loadSponsoredVendors();
  }, []);

  const loadSponsoredVendors = async () => {
    try {
      const { data } = await supabase
        .from("vendors")
        .select(`
          *,
          cities (name, state)
        `)
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
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <Badge variant="premium" className="mb-4 text-base px-4 py-2">
            <Crown className="h-4 w-4 mr-2" />
            Featured Premium Vendors
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Top-Rated Wedding <span className="text-gradient">Professionals</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Handpicked vendors with verified premium profiles and exceptional reviews
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {vendors.map((vendor) => (
              <CarouselItem key={vendor.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <Link to={`/vendors/${vendor.id}`}>
                  <Card className="group hover:shadow-2xl transition-all duration-300 border-primary/20 hover:border-primary/50 overflow-hidden h-full">
                    <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl font-bold text-primary/30">
                          {vendor.business_name.charAt(0)}
                        </span>
                      </div>
                      
                      {/* Premium Badge Overlay */}
                      <div className="absolute top-4 left-4">
                        <Badge variant="premium" className="shadow-lg">
                          <Crown className="h-3 w-3 mr-1" />
                          Verified Premium
                        </Badge>
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-bold text-sm">{vendor.average_rating || 5.0}</span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
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

                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-primary">
                            {vendor.years_experience}+ Years Experience
                          </span>
                          <ChevronRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        <div className="text-center mt-12">
          <Link to="/search?tier=sponsored">
            <Button variant="outline" size="lg" className="group">
              View All Premium Vendors
              <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
