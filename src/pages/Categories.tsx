import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Star, Shield } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import heroMosaicImg from "@/assets/hero-categories-mosaic.jpg";
import { AnimatedSection } from "@/components/AnimatedSection";
import photographyImg from "@/assets/category-photography.jpg";
import venueImg from "@/assets/category-venue.jpg";
import mehendiImg from "@/assets/category-mehendi.jpg";
import cateringImg from "@/assets/category-catering.jpg";
import decorationImg from "@/assets/category-decoration.jpg";
import musicImg from "@/assets/category-music.jpg";
import cakeImg from "@/assets/category-cake.jpg";
import makeupImg from "@/assets/category-bridal-makeup.jpg";
import invitationsImg from "@/assets/category-invitations.jpg";
import choreographyImg from "@/assets/category-choreography.jpg";
import transportImg from "@/assets/category-transport.jpg";
import jewelryImg from "@/assets/category-jewelry.jpg";
import panditImg from "@/assets/category-pandit.jpg";
import entertainmentImg from "@/assets/category-entertainment.jpg";

const Categories = () => {
  const { category } = useParams();
  const isMobile = useIsMobile();
  const [vendors, setVendors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryImages: Record<string, string> = {
    photography: photographyImg, venue: venueImg, venues: venueImg,
    mehendi: mehendiImg, catering: cateringImg, decoration: decorationImg,
    decor: decorationImg, music: musicImg, cake: cakeImg, cakes: cakeImg,
    'cakes-desserts': cakeImg, planning: photographyImg, makeup: makeupImg,
    invitations: invitationsImg, choreography: choreographyImg,
    transport: transportImg, jewelry: jewelryImg, pandit: panditImg,
    entertainment: entertainmentImg, 'social-media-managers': photographyImg,
    'influencer': photographyImg, 'anchor': entertainmentImg, 'content-creator': photographyImg,
  };

  useEffect(() => { loadData(); }, [category]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: categoriesData } = await supabase.from("categories").select("*").eq("is_active", true).order("display_order");
      if (categoriesData) setCategories(categoriesData);
      if (category) {
        const { data: vendorsData } = await supabase.from("vendors").select(`*, cities (name, state), vendor_services (*)`).eq("is_active", true).eq("verified", true).eq("category", category as any).order("average_rating", { ascending: false });
        if (vendorsData) setVendors(vendorsData);
      }
    } catch (error) { console.error("Error loading data:", error); }
    finally { setLoading(false); }
  };

  const currentCategory = category ? categories.find(c => c.slug === category) : null;

  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title={currentCategory?.name || "Categories"} />

      {/* Hero Banner */}
      {!currentCategory && (
        <div className={`relative overflow-hidden ${isMobile ? 'h-44' : 'h-64 mt-20'}`}>
          <img src={heroMosaicImg} alt="Wedding categories" className="w-full h-full object-cover" style={{ filter: 'contrast(1.03) saturate(1.08)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 md:left-12">
            <p className="text-white/80 text-xs font-medium tracking-widest uppercase mb-1">Browse All</p>
            <h1 className={`text-white font-bold ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
              Explore Categories
            </h1>
          </div>
        </div>
      )}

      {/* Category Header when category is selected */}
      {currentCategory && !isMobile && (
        <div className="pt-24 pb-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-2">Category</p>
            <h1 className="text-3xl font-bold text-foreground mb-2">{currentCategory.name}</h1>
            <p className="text-muted-foreground">{currentCategory.description}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <section className={isMobile ? "px-4 py-5" : "py-10"}>
        <div className={isMobile ? "" : "container mx-auto px-4 max-w-6xl"}>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : currentCategory ? (
            /* Vendor List */
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                {vendors.length} verified vendor{vendors.length !== 1 ? "s" : ""}
              </p>
              <div className="space-y-3">
                {vendors.map((vendor) => (
                  <Link key={vendor.id} to={`/vendors/${vendor.id}`}>
                    <div className="rounded-2xl border border-border/50 bg-background p-4 hover:border-accent/30 hover:shadow-md transition-all">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center shrink-0 ring-1 ring-accent/20">
                          <span className="text-2xl font-bold text-accent">{vendor.business_name?.charAt(0) || "V"}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">{vendor.business_name}</h3>
                            {vendor.verified && <Shield className="h-4 w-4 text-accent shrink-0" />}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{vendor.cities?.name || "India"}</p>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 text-accent fill-accent" />
                              <span className="font-medium">{vendor.average_rating || 0}</span>
                              <span className="text-muted-foreground">({vendor.total_reviews || 0})</span>
                            </span>
                            <span className="text-muted-foreground">{vendor.years_experience}+ yrs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            /* Categories Grid */
            <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'}`}>
              {categories.map((cat) => (
                <Link key={cat.id} to={`/category/${cat.slug}`}>
                  <div className="group relative overflow-hidden rounded-2xl border border-border/50 hover:border-accent/30 hover:shadow-lg transition-all">
                    <div className={`relative ${isMobile ? 'h-36' : 'h-48'}`}>
                      {categoryImages[cat.slug] ? (
                        <img src={categoryImages[cat.slug]} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ filter: 'contrast(1.03) saturate(1.08)' }} />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent/15 to-primary/10 flex items-center justify-center">
                          <span className="text-4xl font-bold text-accent/30">{cat.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-base'}`}>{cat.name}</h3>
                        {!isMobile && cat.description && (
                          <p className="text-white/70 text-xs mt-0.5 line-clamp-1">{cat.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      
    </div>
  );
};

export default Categories;
