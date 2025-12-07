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

const popularSearches = [
  { label: "Wedding Venues Delhi", category: "venues", city: "Delhi" },
  { label: "Photographers Mumbai", category: "photography", city: "Mumbai" },
  { label: "Caterers Bangalore", category: "catering", city: "Bangalore" },
  { label: "Mehendi Artists Jaipur", category: "mehendi", city: "Jaipur" },
];

export const HeroSearchWidget = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const [categoriesRes, citiesRes] = await Promise.all([
        supabase.from("categories").select("id, name, slug").eq("is_active", true).order("display_order"),
        supabase.from("cities").select("id, name, state").eq("is_active", true).order("name"),
      ]);
      
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (citiesRes.data) setCities(citiesRes.data);
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
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-accent/20 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
          {/* Category Select */}
          <div className="md:col-span-1">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Service Type
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-12 border-border/50 bg-background hover:border-accent/50 transition-colors">
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
          <div className="md:col-span-1">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              City
            </label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="h-12 border-border/50 bg-background hover:border-accent/50 transition-colors">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select City" />
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

          {/* Search Input */}
          <div className="md:col-span-1">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Vendor Name
            </label>
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 border-border/50 bg-background hover:border-accent/50 transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* Search Button */}
          <div className="md:col-span-1 flex items-end">
            <Button
              onClick={handleSearch}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              size="lg"
            >
              <Search className="h-4 w-4 mr-2" />
              Find Vendors
            </Button>
          </div>
        </div>
      </div>

      {/* Popular Searches */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm text-white/80 flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          Popular:
        </span>
        {popularSearches.map((search, index) => (
          <button
            key={index}
            onClick={() => handlePopularSearch(search.category, search.city)}
            className="px-3 py-1.5 text-sm bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-colors border border-white/20"
          >
            {search.label}
          </button>
        ))}
      </div>
    </div>
  );
};
