import { useState, useEffect } from "react";
import { BhindiFooter } from "@/components/BhindiFooter";
import { GlassCard } from "@/components/GlassCard";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Star, Shield } from "lucide-react";
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
  const [vendors, setVendors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryImages: Record<string, string> = {
    photography: photographyImg,
    venue: venueImg,
    venues: venueImg,
    mehendi: mehendiImg,
    catering: cateringImg,
    decoration: decorationImg,
    decor: decorationImg,
    music: musicImg,
    cake: cakeImg,
    cakes: cakeImg,
    'cakes-desserts': cakeImg,
    planning: photographyImg,
    makeup: makeupImg,
    invitations: invitationsImg,
    choreography: choreographyImg,
    transport: transportImg,
    jewelry: jewelryImg,
    pandit: panditImg,
    entertainment: entertainmentImg,
    'social-media-managers': photographyImg,
    'influencer': photographyImg,
    'anchor': entertainmentImg,
    'content-creator': photographyImg,
  };

  useEffect(() => {
    loadData();
  }, [category]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load categories
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      
      if (categoriesData) setCategories(categoriesData);

      // Load vendors if category selected
      if (category) {
        const { data: vendorsData } = await supabase
          .from("vendors")
          .select(`
            *,
            cities (name, state),
            vendor_services (*)
          `)
          .eq("is_active", true)
          .eq("verified", true)
          .eq("category", category as any)
          .order("average_rating", { ascending: false });
        
        if (vendorsData) setVendors(vendorsData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentCategory = category 
    ? categories.find(c => c.slug === category)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 via-white to-amber-50/30">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-rose-50/60 to-white">
        <div className="container mx-auto px-4">
          {currentCategory ? (
            <div className="max-w-4xl mx-auto text-center animate-fade-in duration-500">
              <div className="inline-block px-4 py-2 rounded-lg bg-accent/15 border-2 border-accent/30 mb-4">
                <span className="text-accent font-semibold text-sm">Category</span>
              </div>
              <h1 className="font-display font-bold text-5xl mb-4">{currentCategory.name}</h1>
              <div className="w-24 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 mx-auto rounded-full mb-4" />
              <p className="text-xl text-muted-foreground mb-8">{currentCategory.description}</p>
            </div>
          ) : (
            <div className="text-center animate-fade-in duration-500">
              <div className="inline-block px-4 py-2 rounded-lg bg-accent/15 border-2 border-accent/30 mb-4">
                <span className="text-accent font-semibold text-sm">Browse All</span>
              </div>
              <h1 className="font-display font-bold text-5xl mb-4">Explore All <span className="text-accent">Categories</span></h1>
              <div className="w-24 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 mx-auto rounded-full mb-4" />
              <p className="text-xl text-muted-foreground">
                Find verified vendors across every wedding service
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Grid or Vendor List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : currentCategory ? (
            // Vendor List View
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8 animate-fade-in">
                <p className="text-muted-foreground">
                  Showing {vendors.length} verified vendors
                </p>
              </div>

              <div className="space-y-6">
                {vendors.map((vendor, i) => (
                  <Link key={vendor.id} to={`/vendors/${vendor.id}`}>
                    <GlassCard 
                      hover
                      className="overflow-hidden animate-fade-up transition-all duration-300 bg-white border-2 border-accent/20 hover:border-accent/50"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="grid md:grid-cols-3 gap-6 p-6">
                        <div className="aspect-square bg-gradient-to-br from-accent/20 to-primary/10 rounded-xl flex items-center justify-center border border-accent/20">
                          <span className="text-4xl font-bold text-accent">
                            {vendor.business_name?.charAt(0) || "V"}
                          </span>
                        </div>
                        <div className="md:col-span-2">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {vendor.verified && (
                              <span className="bg-accent/15 border border-accent/30 px-3 py-1 rounded-full text-xs font-semibold text-accent flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                Verified
                              </span>
                            )}
                          </div>
                          <h3 className="font-display font-semibold text-2xl mb-2">{vendor.business_name}</h3>
                          <p className="text-muted-foreground mb-4">{vendor.cities?.name || "India"}</p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Rating</p>
                              <p className="font-semibold flex items-center gap-1">
                                <Star className="h-4 w-4 text-accent fill-accent" />
                                {vendor.average_rating || 0} ({vendor.total_reviews || 0} reviews)
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Experience</p>
                              <p className="font-semibold">{vendor.years_experience}+ years</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            // All Categories Grid
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((cat, i) => (
                <Link 
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                >
                  <GlassCard 
                    hover
                    className="overflow-hidden animate-fade-up transition-all duration-300 bg-white border-2 border-accent/20 hover:border-accent/50 hover:shadow-lg"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {categoryImages[cat.slug] ? (
                      <div className="relative h-48 -mx-6 -mt-6 mb-4">
                        <img 
                          src={categoryImages[cat.slug]} 
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                      </div>
                    ) : (
                      <div className="aspect-square relative overflow-hidden group bg-gradient-to-br from-accent/15 to-primary/10 -mx-6 -mt-6 mb-4">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl font-bold text-accent/30">
                            {cat.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-4 text-center">
                      <h3 className="font-display font-semibold text-lg text-foreground">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <BhindiFooter />
    </div>
  );
};

export default Categories;
