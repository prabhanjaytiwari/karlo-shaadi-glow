import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAnalytics } from "@/hooks/useAnalytics";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search as SearchIcon, MapPin, Star, Shield, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const [vendors, setVendors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "all");

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedCity, searchQuery]);

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

      // Load cities
      const { data: citiesData } = await supabase
        .from("cities")
        .select("*")
        .eq("is_active", true);
      
      if (citiesData) setCities(citiesData);

      // Build vendor query
      let query = supabase
        .from("vendors")
        .select(`
          *,
          cities (name, state),
          vendor_services (*)
        `)
        .eq("is_active", true)
        .eq("verified", true);

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory as any);
      }

      if (selectedCity !== "all") {
        query = query.eq("city_id", selectedCity);
      }

      if (searchQuery) {
        query = query.or(`business_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data: vendorsData } = await query.order("average_rating", { ascending: false });
      
      if (vendorsData) setVendors(vendorsData);

      // Track search event
      if (searchQuery || selectedCategory !== "all" || selectedCity !== "all") {
        trackEvent({
          event_type: 'vendor_search',
          metadata: {
            search_query: searchQuery,
            category: selectedCategory,
            city: selectedCity,
            results_count: vendorsData?.length || 0,
          },
        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedCity !== "all") params.set("city", selectedCity);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-primary/5">
      <BhindiHeader />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-8 text-center">Find Your Perfect Vendors</h1>
            <GlassCard className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search vendors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="hero" 
                className="w-full md:w-auto mt-4"
                onClick={handleSearch}
              >
                <SearchIcon className="h-4 w-4 mr-2" />
                Search
              </Button>
            </GlassCard>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <p className="text-muted-foreground text-lg">No vendors found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-muted-foreground animate-fade-in">
                Found {vendors.length} verified vendor{vendors.length !== 1 ? "s" : ""}
              </p>
              
              {vendors.map((vendor, i) => (
                <Link key={vendor.id} to={`/vendors/${vendor.id}`}>
                  <GlassCard 
                    hover
                    className="p-6 animate-fade-up transition-all duration-300"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/4">
                        <div className="aspect-square bg-gradient-to-br from-accent/20 to-secondary/20 rounded-xl flex items-center justify-center">
                          <span className="text-4xl font-bold text-accent">
                            {vendor.business_name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="md:w-3/4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {vendor.verified && (
                            <span className="glass-subtle px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              Verified
                            </span>
                          )}
                          <span className="glass-subtle px-3 py-1 rounded-full text-xs font-semibold">
                            {vendor.category}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold mb-2">{vendor.business_name}</h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {vendor.description || "Professional wedding services"}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-accent" />
                            <span>{vendor.cities?.name || "India"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-accent fill-accent" />
                            <span className="font-semibold">{vendor.average_rating || 0}</span>
                            <span className="text-muted-foreground">
                              ({vendor.total_reviews || 0} reviews)
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold">{vendor.years_experience}+</span>
                            <span className="text-muted-foreground"> years exp</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <BhindiFooter />
    </div>
  );
}