import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, TrendingUp, Award, Star, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-wedding.jpg";

const City = () => {
  const { slug } = useParams();
  const [vendors, setVendors] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");
  
  const cityData: Record<string, any> = {
    lucknow: {
      name: "Lucknow",
      tagline: "Nawabi Elegance Meets Modern Romance",
      description: "Plan your dream wedding in the city of tehzeeb with verified vendors, royal venues, and authentic Awadhi hospitality.",
      bestMonths: "October to March",
      avgCost: "₹8-15 lakhs",
      topVenues: ["La Palais Banquet", "Vivanta Gomti Nagar", "Clarks Awadh"],
    },
    delhi: {
      name: "Delhi",
      tagline: "Grand Celebrations in the Heart of India",
      description: "Experience magnificent weddings in India's capital with world-class venues, diverse vendors, and unmatched scale.",
      bestMonths: "November to February",
      avgCost: "₹12-25 lakhs",
      topVenues: ["The Lalit", "ITC Maurya", "Taj Palace"],
    },
    mumbai: {
      name: "Mumbai",
      tagline: "Bollywood Dreams & Coastal Charm",
      description: "Create unforgettable memories in the city of dreams with stunning venues, celebrity vendors, and magical seaside settings.",
      bestMonths: "November to February",
      avgCost: "₹15-30 lakhs",
      topVenues: ["Taj Mahal Palace", "The St. Regis", "Grand Hyatt"],
    }
  };

  const city = cityData[slug || "lucknow"];

  useEffect(() => {
    loadVendorsAndStories();
  }, [slug, selectedCategory, sortBy]);

  const loadVendorsAndStories = async () => {
    setLoading(true);
    try {
      // Fetch city ID
      const { data: cityRecord } = await supabase
        .from("cities")
        .select("id")
        .ilike("name", city.name)
        .maybeSingle();

      if (cityRecord) {
        // Fetch vendors for this city
        let query = supabase
          .from("vendors")
          .select("*")
          .eq("city_id", cityRecord.id)
          .eq("is_active", true);

        if (selectedCategory !== "all") {
          query = query.eq("category", selectedCategory as any);
        }

        // Apply sorting
        if (sortBy === "rating") {
          query = query.order("average_rating", { ascending: false });
        } else if (sortBy === "bookings") {
          query = query.order("total_bookings", { ascending: false });
        } else if (sortBy === "newest") {
          query = query.order("created_at", { ascending: false });
        }

        const { data: vendorsData } = await query.limit(12);
        if (vendorsData) setVendors(vendorsData);
      }

      // Mock stories data (in production, this would come from a stories table)
      setStories([
        { id: 1, couple: "Priya & Raj", theme: "Royal Nawabi", image: heroImage },
        { id: 2, couple: "Ananya & Vikram", theme: "Modern", image: heroImage },
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "venue", label: "Venues" },
    { value: "photography", label: "Photography" },
    { value: "catering", label: "Catering" },
    { value: "decoration", label: "Decoration" },
    { value: "makeup", label: "Makeup" },
    { value: "mehendi", label: "Mehendi" },
  ];

  const topPicks = [
    { title: "Budget-Friendly Top 10", description: "Best value vendors starting at ₹25,000", badge: "Popular" },
    { title: "Premium Experiences", description: "Luxury vendors for royal weddings", badge: "Exclusive" },
    { title: "Trending This Season", description: "Most booked vendors this month", badge: "Hot" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt={`Wedding in ${city.name}`}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/70 to-background/50" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl animate-fade-up">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-accent" />
              <span className="text-accent font-semibold">Planning in {city.name}</span>
            </div>
            <h1 className="font-display font-bold text-5xl md:text-6xl mb-4">
              {city.tagline}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {city.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg">
                Find Vendors Now
              </Button>
              <Button variant="outline" size="lg">
                View Real Weddings
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: "Verified Vendors", value: "500+" },
              { label: "Weddings Planned", value: "2,000+" },
              { label: "Best Season", value: city.bestMonths },
              { label: "Average Budget", value: city.avgCost },
            ].map((stat, i) => (
              <GlassCard 
                key={i} 
                className="p-6 text-center animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <p className="font-display font-bold text-3xl mb-2 text-accent">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Vendors Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="font-display font-bold text-4xl mb-2">
                  Top Vendors in {city.name}
                </h2>
                <p className="text-muted-foreground">
                  {vendors.length} verified vendors available
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="bookings">Most Booked</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading vendors...</p>
            </div>
          ) : vendors.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <p className="text-muted-foreground">
                No vendors found for this category. Try different filters!
              </p>
            </GlassCard>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor, i) => (
                <Link key={vendor.id} to={`/vendors/${vendor.id}`}>
                  <GlassCard
                    hover
                    className="overflow-hidden h-full animate-fade-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">{vendor.category}</Badge>
                        {vendor.verified && (
                          <Badge variant="default">
                            <Award className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="line-clamp-1">{vendor.business_name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {vendor.description || "Professional service provider"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="font-semibold">
                            {vendor.average_rating?.toFixed(1) || "5.0"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({vendor.total_reviews || 0})
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {vendor.total_bookings || 0} bookings
                        </div>
                      </div>
                    </CardContent>
                  </GlassCard>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/search">
              <Button variant="outline" size="lg">
                View All Vendors →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Wedding Stories */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-4xl mb-4">
              Real Weddings in {city.name}
            </h2>
            <p className="text-muted-foreground text-lg">
              Get inspired by couples who planned their dream weddings here
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {stories.map((story) => (
              <Link key={story.id} to={`/stories/${story.id}`}>
                <GlassCard hover className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={story.image}
                      alt={story.couple}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge>{story.theme}</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-semibold text-xl">
                      {story.couple}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Read their wedding story →
                    </p>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/stories">
              <Button variant="outline" size="lg">
                View All Stories →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Micro Guide */}
      <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <GlassCard className="max-w-4xl mx-auto p-8 md:p-12">
            <h2 className="font-display font-bold text-3xl mb-6">
              Wedding Planning Guide for {city.name}
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold text-lg">Best Time to Book</h3>
                </div>
                <p className="text-muted-foreground pl-7">
                  Peak wedding season in {city.name} runs from {city.bestMonths}. 
                  Book venues 6-12 months in advance for these dates. Off-season weddings (April-September) 
                  can save 20-30% on vendor costs.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold text-lg">Popular Venues</h3>
                </div>
                <p className="text-muted-foreground pl-7">
                  Top choices include {city.topVenues.join(", ")}. These venues book fast during 
                  wedding season. Pro tip: Visit venues on a weekday for better negotiation leverage.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold text-lg">Local Specialties</h3>
                </div>
                <p className="text-muted-foreground pl-7">
                  {city.name === "Lucknow" && "Don't miss authentic Awadhi cuisine catering, traditional chikankari decor, and nawabi-style welcome ceremonies."}
                  {city.name === "Delhi" && "Leverage Delhi's diverse vendor pool for fusion weddings, destination pre-wedding shoots at historical monuments, and royal palace venues."}
                  {city.name === "Mumbai" && "Take advantage of stunning beachfront venues, celebrity makeup artists, and Bollywood-style entertainment options."}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/50">
              <Link to="/categories">
                <Button variant="hero" size="lg" className="w-full md:w-auto">
                  Explore All Categories →
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default City;
