import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface City {
  id: string;
  name: string;
  state: string;
}

const FALLBACK_CATEGORIES: Category[] = [
  { id: "fb-1", name: "Photography", slug: "photography" },
  { id: "fb-2", name: "Wedding Venues", slug: "venues" },
  { id: "fb-3", name: "Catering", slug: "catering" },
  { id: "fb-4", name: "Decoration", slug: "decoration" },
  { id: "fb-5", name: "Mehendi", slug: "mehendi" },
  { id: "fb-6", name: "Makeup", slug: "makeup" },
  { id: "fb-7", name: "Music & DJ", slug: "music" },
  { id: "fb-8", name: "Wedding Planning", slug: "planning" },
  { id: "fb-9", name: "Invitations", slug: "invitations" },
  { id: "fb-10", name: "Choreography", slug: "choreography" },
  { id: "fb-11", name: "Transport", slug: "transport" },
  { id: "fb-12", name: "Jewelry", slug: "jewelry" },
  { id: "fb-13", name: "Pandit & Priests", slug: "pandit" },
  { id: "fb-14", name: "Entertainment", slug: "entertainment" },
  { id: "fb-15", name: "Cakes & Desserts", slug: "cakes-desserts" },
  { id: "fb-16", name: "Wedding Social Media Managers", slug: "social-media-managers" },
];

const FALLBACK_CITIES: City[] = [
  { id: "fc-1", name: "Delhi", state: "Delhi" },
  { id: "fc-2", name: "Mumbai", state: "Maharashtra" },
  { id: "fc-3", name: "Bangalore", state: "Karnataka" },
  { id: "fc-4", name: "Jaipur", state: "Rajasthan" },
  { id: "fc-5", name: "Hyderabad", state: "Telangana" },
  { id: "fc-6", name: "Chennai", state: "Tamil Nadu" },
  { id: "fc-7", name: "Kolkata", state: "West Bengal" },
  { id: "fc-8", name: "Pune", state: "Maharashtra" },
  { id: "fc-9", name: "Ahmedabad", state: "Gujarat" },
  { id: "fc-10", name: "Lucknow", state: "Uttar Pradesh" },
  { id: "fc-11", name: "Chandigarh", state: "Punjab" },
  { id: "fc-12", name: "Udaipur", state: "Rajasthan" },
  { id: "fc-13", name: "Goa", state: "Goa" },
  { id: "fc-14", name: "Indore", state: "Madhya Pradesh" },
  { id: "fc-15", name: "Bhopal", state: "Madhya Pradesh" },
];

const popularSearches = [
  { label: "Wedding Venues Delhi", category: "venues", city: "Delhi" },
  { label: "Photographers Mumbai", category: "photography", city: "Mumbai" },
  { label: "Caterers Bangalore", category: "catering", city: "Bangalore" },
  { label: "Mehendi Artists Jaipur", category: "mehendi", city: "Jaipur" },
];

export const HeroSearchWidget = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [cities, setCities] = useState<City[]>(FALLBACK_CITIES);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, citiesRes] = await Promise.all([
          supabase.from("categories").select("id, name, slug").eq("is_active", true).order("display_order"),
          supabase.from("cities").select("id, name, state").eq("is_active", true).order("name"),
        ]);
        
        if (categoriesRes.data && categoriesRes.data.length > 0) setCategories(categoriesRes.data);
        if (citiesRes.data && citiesRes.data.length > 0) setCities(citiesRes.data);
      } catch (error) {
        console.warn("Using fallback data for search widget:", error);
      }
    };
    loadData();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedCity) params.set("city", selectedCity);
    if (searchQuery) params.set("q", searchQuery);
    navigate(`/search?${params.toString()}`);
  };

  const handlePopularSearch = (category: string, city: string) => {
    const params = new URLSearchParams();
    params.set("category", category);
    params.set("city", city);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Widget */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-accent/20 p-3 sm:p-4 md:p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {/* Category Select */}
          <div className="col-span-1">
            <label className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1 block">
              Service
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm border-border/50 bg-background hover:border-accent/50 transition-colors">
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City Select */}
          <div className="col-span-1">
            <label className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1 block">
              City
            </label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="h-9 sm:h-10 md:h-11 text-xs sm:text-sm border-border/50 bg-background hover:border-accent/50 transition-colors">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <SelectValue placeholder="Select" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.name}>
                    {city.name}, {city.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Input - hidden on mobile, shown on md+ */}
          <div className="hidden md:block md:col-span-1">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Name
            </label>
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 text-sm border-border/50 bg-background hover:border-accent/50 transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* Search Button */}
          <div className="col-span-2 md:col-span-1 flex items-end mt-1 sm:mt-0">
            <Button
              onClick={handleSearch}
              className="w-full h-9 sm:h-10 md:h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs sm:text-sm"
            >
              <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
              Find Vendors
            </Button>
          </div>
        </div>
      </div>

      {/* Popular Searches - more compact on mobile */}
      <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <span className="text-xs sm:text-sm text-white/80 flex items-center gap-1">
          <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          Popular:
        </span>
        {popularSearches.slice(0, 3).map((search, index) => (
          <button
            key={index}
            onClick={() => handlePopularSearch(search.category, search.city)}
            className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-colors border border-white/20"
          >
            {search.label}
          </button>
        ))}
        <button
          onClick={() => handlePopularSearch(popularSearches[3].category, popularSearches[3].city)}
          className="hidden sm:inline-flex px-3 py-1.5 text-xs bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-colors border border-white/20"
        >
          {popularSearches[3].label}
        </button>
      </div>
    </div>
  );
};
