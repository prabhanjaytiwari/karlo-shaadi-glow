import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Star, Shield } from "lucide-react";
import { useWeddingSounds } from "@/hooks/useWeddingSounds";
import photographyImg from "@/assets/category-photography.jpg";
import venueImg from "@/assets/category-venue.jpg";
import mehendiImg from "@/assets/category-mehendi.jpg";

const Categories = () => {
  const { category } = useParams();
  const [vendors, setVendors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { playCameraSound, playCateringSound, playMusicSound, playDecorationSound, playMehendiSound, playVenueSound } = useWeddingSounds();

  const categoryImages: Record<string, string> = {
    photography: photographyImg,
    venue: venueImg,
    mehendi: mehendiImg,
  };

  const handleCategoryClick = (categorySlug: string) => {
    switch(categorySlug) {
      case 'photography':
        playCameraSound();
        break;
      case 'catering':
        playCateringSound();
        break;
      case 'music':
      case 'entertainment':
        playMusicSound();
        break;
      case 'decoration':
        playDecorationSound();
        break;
      case 'mehendi':
        playMehendiSound();
        break;
      case 'venue':
        playVenueSound();
        break;
      default:
        playCameraSound();
    }
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
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4">
          {currentCategory ? (
            <div className="max-w-4xl mx-auto text-center animate-fade-in duration-500">
              <h1 className="font-display font-bold text-5xl mb-4">{currentCategory.name}</h1>
              <p className="text-xl text-muted-foreground mb-8">{currentCategory.description}</p>
            </div>
          ) : (
            <div className="text-center animate-fade-in duration-500">
              <h1 className="font-display font-bold text-5xl mb-4">Explore All Categories</h1>
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
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
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
                      className="overflow-hidden animate-fade-up transition-all duration-300"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="grid md:grid-cols-3 gap-6 p-6">
                        <div className="aspect-square bg-gradient-to-br from-accent/20 to-secondary/20 rounded-xl flex items-center justify-center">
                          <span className="text-4xl font-bold text-accent">
                            {vendor.business_name?.charAt(0) || "V"}
                          </span>
                        </div>
                        <div className="md:col-span-2">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {vendor.verified && (
                              <span className="glass-subtle px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
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
                    className="overflow-hidden animate-fade-up transition-all duration-300"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="aspect-square relative overflow-hidden group bg-gradient-to-br from-accent/10 to-secondary/10">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl font-bold text-accent/20">
                          {cat.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-display font-semibold text-lg">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Categories;
