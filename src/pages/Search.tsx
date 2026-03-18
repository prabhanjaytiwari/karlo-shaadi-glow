import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search as SearchIcon, MapPin, Star, Shield, Loader2, Sparkles, Crown, LayoutGrid, List, ArrowLeft, SlidersHorizontal, IndianRupee, Heart, ChevronRight, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { rankVendors, getVendorBadge, type Vendor } from "@/lib/vendorRanking";
import { TrustSignals } from "@/components/TrustSignals";
import { VendorComparisonToggle } from "@/components/VendorComparisonToggle";
import { EmptyState } from "@/components/EmptyState";

import { AdvancedFilters, defaultFilters, type FiltersState } from "@/components/AdvancedFilters";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const FALLBACK_CATEGORIES = [
  { id: "fb-1", name: "Photography", slug: "photography", emoji: "📸" },
  { id: "fb-2", name: "Venues", slug: "venues", emoji: "🏛️" },
  { id: "fb-3", name: "Catering", slug: "catering", emoji: "🍽️" },
  { id: "fb-4", name: "Decoration", slug: "decoration", emoji: "🌸" },
  { id: "fb-5", name: "Mehendi", slug: "mehendi", emoji: "🤚" },
  { id: "fb-6", name: "Makeup", slug: "makeup", emoji: "💄" },
  { id: "fb-7", name: "Music & DJ", slug: "music", emoji: "🎵" },
  { id: "fb-8", name: "Planning", slug: "planning", emoji: "📋" },
  { id: "fb-9", name: "Invitations", slug: "invitations", emoji: "💌" },
  { id: "fb-10", name: "Choreography", slug: "choreography", emoji: "💃" },
  { id: "fb-11", name: "Transport", slug: "transport", emoji: "🚗" },
  { id: "fb-12", name: "Jewelry", slug: "jewelry", emoji: "💎" },
  { id: "fb-13", name: "Pandit", slug: "pandit", emoji: "🪔" },
  { id: "fb-14", name: "Entertainment", slug: "entertainment", emoji: "🎭" },
];

const FALLBACK_CITIES = [
  { id: "fc-1", name: "Delhi", state: "Delhi" },
  { id: "fc-2", name: "Mumbai", state: "Maharashtra" },
  { id: "fc-3", name: "Bangalore", state: "Karnataka" },
  { id: "fc-4", name: "Jaipur", state: "Rajasthan" },
  { id: "fc-5", name: "Hyderabad", state: "Telangana" },
  { id: "fc-6", name: "Chennai", state: "Tamil Nadu" },
  { id: "fc-7", name: "Kolkata", state: "West Bengal" },
  { id: "fc-8", name: "Pune", state: "Maharashtra" },
];

// Gradient palette for vendor avatars
const AVATAR_GRADIENTS = [
  "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500",
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-cyan-400 to-blue-500",
  "from-fuchsia-400 to-pink-500",
  "from-lime-400 to-emerald-500",
];

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const [vendors, setVendors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>(FALLBACK_CATEGORIES);
  const [cities, setCities] = useState<any[]>(FALLBACK_CITIES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "all");
  const [selectedForComparison, setSelectedForComparison] = useState<any[]>([]);
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCityFilter, setShowCityFilter] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedCity, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      
      if (categoriesData && categoriesData.length > 0) {
        setCategories(categoriesData.map(c => ({
          ...c,
          emoji: FALLBACK_CATEGORIES.find(fc => fc.slug === c.slug)?.emoji || "📦"
        })));
      }

      const { data: citiesData } = await supabase
        .from("cities")
        .select("*")
        .eq("is_active", true);
      
      if (citiesData && citiesData.length > 0) setCities(citiesData);

      let query = supabase
        .from("vendors")
        .select(`*, cities (name, state), vendor_services (*), vendor_portfolio (image_url, display_order)`)
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
      
      if (vendorsData) {
        const rankedVendors = rankVendors(vendorsData as Vendor[]);
        setVendors(rankedVendors);
      }

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

  const isMobile = useIsMobile();

  // ── PREMIUM MOBILE VENDOR CARD ──
  const MobileVendorCard = ({ vendor, i }: { vendor: any; i: number }) => {
    const badge = getVendorBadge(vendor as Vendor);
    const isSponsored = vendor.subscription_tier === 'sponsored';
    const isFeatured = vendor.subscription_tier === 'featured';
    const gradientClass = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
    const startingPrice = vendor.vendor_services?.[0]?.price;

    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.04, duration: 0.35, ease: "easeOut" }}
      >
        <Link to={`/vendors/${vendor.id}`} className="block group">
          <div className={cn(
            "relative p-4 rounded-3xl border transition-all duration-300 active:scale-[0.97]",
            isSponsored 
              ? "bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-md shadow-primary/5" 
              : "bg-card/80 backdrop-blur-sm border-border/40 hover:border-border/80 hover:shadow-md"
          )}>
            {/* Sponsored ribbon */}
            {isSponsored && (
              <div className="absolute -top-2 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-primary to-accent text-[10px] font-bold text-primary-foreground shadow-sm">
                ⭐ FEATURED
              </div>
            )}

            <div className="flex gap-3.5">
              {/* Avatar with image or gradient fallback */}
              {(() => {
                const imgUrl = vendor.logo_url || vendor.vendor_portfolio?.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))?.[0]?.image_url;
                return imgUrl ? (
                  <div className="w-14 h-14 shrink-0 rounded-2xl overflow-hidden shadow-sm">
                    <img src={imgUrl} alt={vendor.business_name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className={cn(
                    "w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-sm",
                    gradientClass
                  )}>
                    <span className="text-white text-lg font-bold drop-shadow-sm">
                      {vendor.business_name.charAt(0)}
                    </span>
                  </div>
                );
              })()}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="text-[15px] font-semibold text-foreground truncate leading-tight">
                    {vendor.business_name}
                  </h3>
                  {vendor.verified && (
                    <Shield className="h-3.5 w-3.5 text-primary shrink-0 fill-primary/10" />
                  )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-1 mb-2 leading-relaxed">
                  {vendor.description || `Professional ${vendor.category} services`}
                </p>

                {/* Stats row */}
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                      {vendor.average_rating || '0'}
                    </span>
                    <span className="text-[10px] text-amber-600/70 dark:text-amber-500/70">
                      ({vendor.total_reviews || 0})
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {vendor.cities?.name || 'India'}
                  </span>
                </div>
              </div>

              {/* Price & Arrow */}
              <div className="flex flex-col items-end justify-between shrink-0">
                {startingPrice && (
                  <span className="text-xs font-semibold text-foreground">
                    ₹{(startingPrice / 1000).toFixed(0)}k
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
              </div>
            </div>

            {/* Category & badge chips */}
            {(badge || isFeatured) && (
              <div className="flex gap-1.5 mt-3 pt-3 border-t border-border/30">
                {badge && (
                  <span className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                    badge.variant === 'premium' ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent-foreground"
                  )}>
                    {badge.text}
                  </span>
                )}
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground capitalize">
                  {vendor.category}
                </span>
              </div>
            )}
          </div>
        </Link>
      </motion.div>
    );
  };

  // ══════════════════════════════════
  // ══  MOBILE LAYOUT  ═════════════
  // ══════════════════════════════════
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* ── STICKY HEADER ── */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl">
          <div className="flex items-center h-14 px-4 gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-muted/50 active:scale-95 transition-all"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Find Vendors</h1>
          </div>

          {/* Search bar inside header */}
          <div className="px-4 pb-3">
            <div className="relative">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 pr-12 h-11 rounded-2xl bg-muted/30 border-border/30 text-sm placeholder:text-muted-foreground/60"
              />
              <button
                onClick={() => setShowCityFilter(!showCityFilter)}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-colors",
                  showCityFilter || selectedCity !== "all" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* City quick-filter (collapsible) */}
          <AnimatePresence>
            {showCityFilter && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-border/30"
              >
                <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2.5">
                  <button
                    onClick={() => { setSelectedCity("all"); setShowCityFilter(false); }}
                    className={cn(
                      "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                      selectedCity === "all" ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground"
                    )}
                  >
                    All Cities
                  </button>
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => { setSelectedCity(city.id); setShowCityFilter(false); }}
                      className={cn(
                        "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                        selectedCity === city.id ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground"
                      )}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-3">
            <button
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-medium transition-all border",
                selectedCategory === "all"
                  ? "bg-foreground text-background border-foreground shadow-sm"
                  : "bg-card border-border/40 text-muted-foreground active:scale-95"
              )}
            >
              ✨ All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug === selectedCategory ? "all" : cat.slug)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-medium transition-all border",
                  selectedCategory === cat.slug
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-card border-border/40 text-muted-foreground active:scale-95"
                )}
              >
                <span>{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        </header>

        {/* ── CONTENT ── */}
        <div className="px-4 pt-4 pb-24 space-y-4">

          {/* Results */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              </div>
              <p className="text-xs text-muted-foreground">Finding perfect vendors...</p>
            </div>
          ) : vendors.length === 0 ? (
            <EmptyState
              icon={SearchIcon}
              title="No Vendors Found"
              description="Try adjusting your filters or browse all vendors."
              actionText="Browse All"
              actionLink="/categories"
            />
          ) : (
            <div className="space-y-3">
              {/* Result count */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{vendors.length}</span> verified vendors
                </p>
                <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                  <Shield className="h-3 w-3" /> All verified
                </span>
              </div>

              {/* Vendor Cards */}
              {vendors.map((vendor, i) => (
                <MobileVendorCard key={vendor.id} vendor={vendor} i={i} />
              ))}
            </div>
          )}
        </div>

        <VendorComparisonToggle
          selectedVendors={selectedForComparison}
          onRemove={(vendorId) => setSelectedForComparison(selectedForComparison.filter(v => v.id !== vendorId))}
          onClear={() => setSelectedForComparison([])}
        />
      </div>
    );
  }

  // ══════════════════════════════════
  // ══  DESKTOP LAYOUT  ════════════
  // ══════════════════════════════════
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl font-bold mb-2 text-center text-foreground tracking-tight">
              Find Your Perfect Vendors
            </h1>
            <p className="text-center text-muted-foreground mb-8">Discover verified wedding professionals trusted by thousands</p>
            
            <div className="max-w-3xl mx-auto bg-card border border-border/50 rounded-2xl p-2 shadow-sm">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search vendors by name, service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10 h-12 border-0 bg-transparent focus-visible:ring-0 text-sm"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 w-44 border-0 bg-muted/30 rounded-xl">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        <span className="flex items-center gap-2">{cat.emoji} {cat.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="h-12 w-36 border-0 bg-muted/30 rounded-xl">
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="h-12 px-6 rounded-xl" onClick={handleSearch}>
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>


          {/* Results with Sidebar */}
          <div className="flex gap-6">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={() => setFilters(defaultFilters)}
              category={selectedCategory !== "all" ? selectedCategory : undefined}
            />

            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
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
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">
                      <span className="font-semibold text-foreground">{vendors.length}</span> verified vendor{vendors.length !== 1 ? "s" : ""}
                    </p>
                    <div className="flex items-center gap-1 border border-border/50 rounded-xl p-1">
                      <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8 rounded-lg" onClick={() => setViewMode('grid')}>
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                      <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8 rounded-lg" onClick={() => setViewMode('list')}>
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className={viewMode === 'grid' ? "grid grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
                    {vendors.map((vendor, i) => {
                      const badge = getVendorBadge(vendor as Vendor);
                      const isSponsored = vendor.subscription_tier === 'sponsored';
                      const isFeatured = vendor.subscription_tier === 'featured';
                      const isSelected = selectedForComparison.some(v => v.id === vendor.id);
                      const gradientClass = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
                      const startingPrice = vendor.vendor_services?.[0]?.price;

                      if (viewMode === 'grid') {
                        return (
                          <motion.div
                            key={vendor.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="relative group"
                          >
                            <Link to={`/vendors/${vendor.id}`}>
                              <div className={cn(
                                "p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
                                isSponsored ? "border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5" : "border-border/40 bg-card hover:border-border"
                              )}>
                                {isSponsored && (
                                  <div className="absolute -top-2 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-primary to-accent text-[10px] font-bold text-primary-foreground">
                                    ⭐ FEATURED
                                  </div>
                                )}

                                <div className={cn(
                                  "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-sm",
                                  gradientClass
                                )}>
                                  <span className="text-white text-xl font-bold">{vendor.business_name.charAt(0)}</span>
                                </div>

                                <h3 className="text-base font-semibold text-foreground mb-1 truncate flex items-center gap-1.5">
                                  {vendor.business_name}
                                  {vendor.verified && <Shield className="h-3.5 w-3.5 text-primary shrink-0 fill-primary/10" />}
                                </h3>

                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3 min-h-[2rem]">
                                  {vendor.description || `Professional ${vendor.category} services`}
                                </p>

                                <div className="flex items-center gap-2 mb-3">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20">
                                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">{vendor.average_rating || '0'}</span>
                                  </span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />{vendor.cities?.name || 'India'}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                                  {startingPrice ? (
                                    <span className="text-sm font-semibold text-foreground">₹{(startingPrice / 1000).toFixed(0)}k+</span>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">Get quote</span>
                                  )}
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground capitalize">{vendor.category}</span>
                                </div>
                              </div>
                            </Link>

                            {/* Compare checkbox */}
                            <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.preventDefault()}>
                              <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-1.5 shadow-sm">
                                <Checkbox
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
                              </div>
                            </div>
                          </motion.div>
                        );
                      }

                      // List view
                      return (
                        <motion.div
                          key={vendor.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="relative group"
                        >
                          <Link to={`/vendors/${vendor.id}`}>
                            <div className={cn(
                              "flex gap-5 p-5 rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-px",
                              isSponsored ? "border-primary/30 bg-gradient-to-r from-primary/5 to-transparent" : "border-border/40 bg-card hover:border-border"
                            )}>
                              <div className={cn(
                                "w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-sm",
                                gradientClass
                              )}>
                                <span className="text-white text-xl font-bold">{vendor.business_name.charAt(0)}</span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-base font-semibold text-foreground truncate">{vendor.business_name}</h3>
                                  {vendor.verified && <Shield className="h-3.5 w-3.5 text-primary shrink-0 fill-primary/10" />}
                                  {isSponsored && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">FEATURED</span>}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{vendor.description || `Professional ${vendor.category} services`}</p>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="inline-flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                    <span className="font-semibold">{vendor.average_rating || 0}</span>
                                    <span className="text-muted-foreground text-xs">({vendor.total_reviews || 0})</span>
                                  </span>
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5" />{vendor.cities?.name || 'India'}
                                  </span>
                                  {startingPrice && (
                                    <span className="font-semibold">₹{(startingPrice / 1000).toFixed(0)}k+</span>
                                  )}
                                </div>
                              </div>

                              <ChevronRight className="h-5 w-5 text-muted-foreground/30 self-center shrink-0 group-hover:text-foreground transition-colors" />
                            </div>
                          </Link>

                          <div className="absolute top-4 right-12 z-10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.preventDefault()}>
                            <div className="flex items-center gap-2 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg px-2.5 py-1.5 shadow-sm">
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
                              <label htmlFor={`compare-${vendor.id}`} className="text-xs font-medium cursor-pointer">Compare</label>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <VendorComparisonToggle
        selectedVendors={selectedForComparison}
        onRemove={(vendorId) => setSelectedForComparison(selectedForComparison.filter(v => v.id !== vendorId))}
        onClear={() => setSelectedForComparison([])}
      />
    </div>
  );
}
