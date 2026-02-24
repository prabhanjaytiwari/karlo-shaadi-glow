import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAnalytics } from "@/hooks/useAnalytics";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search as SearchIcon, MapPin, Star, Shield, Loader2, Sparkles, Crown, LayoutGrid, List } from "lucide-react";
import { Link } from "react-router-dom";
import { rankVendors, getVendorBadge, type Vendor } from "@/lib/vendorRanking";
import { TrustSignals } from "@/components/TrustSignals";
import { VendorComparisonToggle } from "@/components/VendorComparisonToggle";
import { EmptyState } from "@/components/EmptyState";
import { SmartVendorMatch } from "@/components/SmartVendorMatch";
import { AdvancedFilters, defaultFilters, type FiltersState } from "@/components/AdvancedFilters";

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
  const [selectedForComparison, setSelectedForComparison] = useState<any[]>([]);
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

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

      const { data: vendorsData } = await query;
      
      // Apply ranking algorithm
      if (vendorsData) {
        const rankedVendors = rankVendors(vendorsData as Vendor[]);
        setVendors(rankedVendors);
      }

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60">
      <BhindiHeader />
      
      <main className="flex-1 py-4 sm:py-8 md:py-12 px-4 pt-14 sm:pt-20">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-4 sm:mb-8 animate-fade-in">
            <Badge className="bg-accent text-accent-foreground mx-auto block w-fit mb-2 sm:mb-4 text-[10px] sm:text-xs">Find Vendors</Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-center">Find Your Perfect Vendors</h1>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 mx-auto mb-4 sm:mb-6 rounded-full" />
            <GlassCard className="p-3 sm:p-4 md:p-6 bg-white/90 backdrop-blur-sm border border-accent/20">
              <div className="grid md:grid-cols-4 gap-3 md:gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search vendors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full h-11"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-11">
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
                  <SelectTrigger className="h-11">
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
                className="w-full md:w-auto mt-4 h-11"
                onClick={handleSearch}
              >
                <SearchIcon className="h-4 w-4 mr-2" />
                Search
              </Button>
            </GlassCard>
          </div>

          {/* Smart Matching */}
          <div className="mb-8">
            <SmartVendorMatch
              category={selectedCategory !== "all" ? selectedCategory : undefined}
              budget={undefined}
              city={selectedCity !== "all" ? selectedCity : undefined}
            />
          </div>

          {/* Results with Sidebar */}
          <div className="flex gap-6">
            {/* Advanced Filters Sidebar */}
            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={() => setFilters(defaultFilters)}
              category={selectedCategory !== "all" ? selectedCategory : undefined}
            />

            {/* Results */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
              ) : vendors.length === 0 ? (
                <EmptyState
                  icon={SearchIcon}
                  title="No Vendors Found"
                  description="We couldn't find any vendors matching your criteria. Try adjusting your filters or browse all vendors."
                  actionText="Browse All Vendors"
                  actionLink="/categories"
                />
              ) : (
                <div className="space-y-4">
                  {/* Results Header */}
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">
                      Found {vendors.length} verified vendor{vendors.length !== 1 ? "s" : ""}
                    </p>
                    <div className="flex items-center gap-2">
                      {/* Mobile Filters */}
                      <div className="lg:hidden">
                        <AdvancedFilters
                          filters={filters}
                          onFiltersChange={setFilters}
                          onClearFilters={() => setFilters(defaultFilters)}
                          category={selectedCategory !== "all" ? selectedCategory : undefined}
                        />
                      </div>
                      {/* View Toggle */}
                      <div className="hidden md:flex items-center gap-1 border border-border/50 rounded-lg p-1">
                        <Button
                          variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setViewMode('list')}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setViewMode('grid')}
                        >
                          <LayoutGrid className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
              
              {vendors.map((vendor, i) => {
                const badge = getVendorBadge(vendor as Vendor);
                const isSponsored = vendor.subscription_tier === 'sponsored';
                const isFeatured = vendor.subscription_tier === 'featured';
                const isSelected = selectedForComparison.some(v => v.id === vendor.id);
                
                // Use real data from vendor record
                const lastBookedHours = undefined; // Only show when we have real booking data
                const availabilityCount = undefined; // Only show when vendor has set availability

                return (
                  <div key={vendor.id} className="relative">
                    <Link to={`/vendors/${vendor.id}`}>
                      <GlassCard 
                        hover
                        className={`p-4 sm:p-6 animate-fade-up transition-all duration-300 ${
                          isSponsored ? 'border-primary/50 shadow-lg' : isFeatured ? 'border-accent/50' : ''
                        }`}
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className="flex flex-col md:flex-row gap-3 sm:gap-6">
                          <div className="md:w-1/4 relative w-20 h-20 sm:w-auto sm:h-auto flex-shrink-0">
                            <div className={`aspect-square rounded-xl flex items-center justify-center w-20 h-20 sm:w-full sm:h-auto ${
                              isSponsored 
                                ? 'bg-gradient-to-br from-primary/30 to-accent/30' 
                                : isFeatured 
                                  ? 'bg-gradient-to-br from-accent/30 to-secondary/30'
                                  : 'bg-gradient-to-br from-accent/20 to-secondary/20'
                            }`}>
                              <span className={`text-2xl sm:text-4xl font-bold ${
                                isSponsored ? 'text-primary' : 'text-accent'
                              }`}>
                                {vendor.business_name.charAt(0)}
                              </span>
                            </div>
                            {isSponsored && (
                              <div className="absolute -top-2 -right-2">
                                <Crown className="h-6 w-6 text-primary fill-primary/20" />
                              </div>
                            )}
                            {isFeatured && (
                              <div className="absolute -top-2 -right-2">
                                <Sparkles className="h-6 w-6 text-accent fill-accent/20" />
                              </div>
                            )}
                          </div>
                          
                          <div className="md:w-3/4">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {badge && (
                                <Badge 
                                  variant={badge.variant}
                                  className="flex items-center gap-1 font-semibold"
                                >
                                  {badge.variant === 'premium' && <Crown className="h-3 w-3" />}
                                  {badge.variant === 'accent' && <Sparkles className="h-3 w-3" />}
                                  {badge.text}
                                </Badge>
                              )}
                              {vendor.verified && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Shield className="h-3 w-3" />
                                  Verified
                                </Badge>
                              )}
                              <Badge variant="secondary">
                                {vendor.category}
                              </Badge>
                            </div>

                            <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">{vendor.business_name}</h3>
                            <p className="text-muted-foreground mb-2 sm:mb-4 line-clamp-2 text-xs sm:text-base">
                              {vendor.description || "Professional wedding services"}
                            </p>

                            <TrustSignals 
                              lastBookedHours={lastBookedHours}
                              totalBookings={vendor.total_reviews}
                              responseTime="2 hours"
                              availabilityCount={availabilityCount}
                              className="mb-4"
                            />

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
                    
                    {/* Compare Checkbox */}
                    <div 
                      className="absolute top-4 right-4 z-10"
                      onClick={(e) => e.preventDefault()}
                    >
                      <div className="flex items-center gap-2 bg-background/95 backdrop-blur-sm border rounded-lg px-3 py-2 shadow-md">
                        <Checkbox
                          id={`compare-${vendor.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              if (selectedForComparison.length >= 3) return;
                              setSelectedForComparison([...selectedForComparison, vendor]);
                            } else {
                              setSelectedForComparison(selectedForComparison.filter(v => v.id !== vendor.id));
                            }
                          }}
                          disabled={!isSelected && selectedForComparison.length >= 3}
                        />
                        <label 
                          htmlFor={`compare-${vendor.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          Compare
                        </label>
                      </div>
                    </div>
                  </div>
                );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <BhindiFooter />

      {/* Vendor Comparison Toggle */}
      <VendorComparisonToggle
        selectedVendors={selectedForComparison}
        onRemove={(vendorId) => {
          setSelectedForComparison(selectedForComparison.filter(v => v.id !== vendorId));
        }}
        onClear={() => setSelectedForComparison([])}
      />
    </div>
  );
}