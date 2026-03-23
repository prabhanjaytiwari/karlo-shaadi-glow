import { useEffect, useState } from "react";

import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, TrendingUp, Award, Star, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { LocalBusinessJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { cdn } from "@/lib/cdnAssets";

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
      seoDescription: "Find the best wedding vendors in Lucknow. 500+ verified photographers, venues, caterers, decorators & mehendi artists. Zero commission. Book your dream Nawabi wedding on Karlo Shaadi.",
      keywords: "wedding vendors Lucknow, wedding photographer Lucknow, wedding venue Lucknow, caterer Lucknow, mehendi artist Lucknow, bridal makeup Lucknow, wedding planner Lucknow, shaadi Lucknow",
    },
    delhi: {
      name: "Delhi",
      tagline: "Grand Celebrations in the Heart of India",
      description: "Experience magnificent weddings in India's capital with world-class venues, diverse vendors, and unmatched scale.",
      bestMonths: "November to February",
      avgCost: "₹12-25 lakhs",
      topVenues: ["The Lalit", "ITC Maurya", "Taj Palace"],
      seoDescription: "Find the best wedding vendors in Delhi. 1000+ verified photographers, venues, caterers, decorators & bridal makeup artists. Zero commission. Book your dream Delhi wedding on Karlo Shaadi.",
      keywords: "wedding vendors Delhi, wedding photographer Delhi, wedding venue Delhi, caterer Delhi, mehendi artist Delhi, bridal makeup Delhi, wedding planner Delhi NCR, shaadi Delhi",
    },
    mumbai: {
      name: "Mumbai",
      tagline: "Bollywood Dreams & Coastal Charm",
      description: "Create unforgettable memories in the city of dreams with stunning venues, celebrity vendors, and magical seaside settings.",
      bestMonths: "November to February",
      avgCost: "₹15-30 lakhs",
      topVenues: ["Taj Mahal Palace", "The St. Regis", "Grand Hyatt"],
      seoDescription: "Find the best wedding vendors in Mumbai. 800+ verified photographers, venues, caterers, decorators & bridal makeup artists. Zero commission. Book your dream Mumbai wedding on Karlo Shaadi.",
      keywords: "wedding vendors Mumbai, wedding photographer Mumbai, wedding venue Mumbai, caterer Mumbai, bridal makeup Mumbai, wedding planner Mumbai, shaadi Mumbai, Bollywood wedding",
    },
    jaipur: {
      name: "Jaipur",
      tagline: "Royal Rajputana Romance",
      description: "Get married in the Pink City's palaces and forts with royal heritage venues, traditional Rajasthani vendors, and magical desert settings.",
      bestMonths: "October to February",
      avgCost: "₹10-20 lakhs",
      topVenues: ["Jai Mahal Palace", "Samode Palace", "City Palace"],
      seoDescription: "Find the best wedding vendors in Jaipur. Verified palace wedding venues, photographers, caterers & decorators for royal Rajputana weddings. Zero commission on Karlo Shaadi.",
      keywords: "wedding vendors Jaipur, palace wedding Jaipur, wedding photographer Jaipur, wedding venue Jaipur, Rajasthani wedding, royal wedding Jaipur, destination wedding Jaipur",
    },
    bangalore: {
      name: "Bangalore",
      tagline: "Tech City's Perfect Romance",
      description: "Plan a modern wedding in India's Silicon Valley with chic venues, innovative vendors, and perfect weather year-round.",
      bestMonths: "October to February",
      avgCost: "₹10-20 lakhs",
      topVenues: ["Taj West End", "ITC Windsor", "The Leela Palace"],
      seoDescription: "Find the best wedding vendors in Bangalore. Verified photographers, venues, caterers & bridal makeup artists for modern Bangalore weddings. Zero commission on Karlo Shaadi.",
      keywords: "wedding vendors Bangalore, wedding photographer Bangalore, wedding venue Bangalore, caterer Bangalore, bridal makeup Bangalore, wedding planner Bengaluru",
    },
    hyderabad: {
      name: "Hyderabad",
      tagline: "Nizami Grandeur & Timeless Elegance",
      description: "Celebrate with Nawabi splendor in the City of Pearls with iconic venues, traditional Hyderabadi cuisine, and opulent decor.",
      bestMonths: "November to February",
      avgCost: "₹10-18 lakhs",
      topVenues: ["Taj Falaknuma Palace", "ITC Kakatiya", "Novotel Hyderabad"],
      seoDescription: "Find the best wedding vendors in Hyderabad. Verified photographers, palace venues, Hyderabadi caterers & bridal artists. Zero commission on Karlo Shaadi.",
      keywords: "wedding vendors Hyderabad, wedding photographer Hyderabad, wedding venue Hyderabad, Nizami wedding, caterer Hyderabad, bridal makeup Hyderabad",
    },
    kolkata: {
      name: "Kolkata",
      tagline: "Cultured Elegance by the Hooghly",
      description: "Celebrate Bengali wedding traditions with heritage venues, delicious cuisine, and the artistic soul of the City of Joy.",
      bestMonths: "October to March",
      avgCost: "₹8-15 lakhs",
      topVenues: ["ITC Royal Bengal", "Taj Bengal", "The Park Hotel"],
      seoDescription: "Find the best wedding vendors in Kolkata. Verified photographers, heritage venues, Bengali wedding caterers & decorators. Zero commission on Karlo Shaadi.",
      keywords: "wedding vendors Kolkata, wedding photographer Kolkata, wedding venue Kolkata, Bengali wedding, caterer Kolkata, bridal makeup Kolkata",
    },
    chennai: {
      name: "Chennai",
      tagline: "Dravidian Traditions, Modern Celebrations",
      description: "Honor Tamil wedding traditions with stunning venues, traditional cuisine, and warm South Indian hospitality.",
      bestMonths: "November to February",
      avgCost: "₹8-18 lakhs",
      topVenues: ["ITC Grand Chola", "Taj Coromandel", "The Leela Palace"],
      seoDescription: "Find the best wedding vendors in Chennai. Verified photographers, Kalyanamandapam venues, traditional caterers & bridal makeup artists. Zero commission on Karlo Shaadi.",
      keywords: "wedding vendors Chennai, wedding photographer Chennai, Kalyanamandapam Chennai, Tamil wedding vendors, caterer Chennai, bridal makeup Chennai",
    },
    pune: {
      name: "Pune",
      tagline: "Cultural Capital of Maharashtra",
      description: "Combine Marathi traditions with modern flair in the Oxford of the East with beautiful outdoor venues and creative vendors.",
      bestMonths: "October to February",
      avgCost: "₹8-15 lakhs",
      topVenues: ["Westin Koregaon Park", "JW Marriott Pune", "Hyatt Regency Pune"],
      seoDescription: "Find the best wedding vendors in Pune. Verified photographers, venues, Maharashtrian caterers & bridal artists. Zero commission on Karlo Shaadi.",
      keywords: "wedding vendors Pune, wedding photographer Pune, wedding venue Pune, Marathi wedding, caterer Pune, bridal makeup Pune",
    },
    ahmedabad: {
      name: "Ahmedabad",
      tagline: "Vibrant Gujarati Celebrations",
      description: "Experience the vibrant energy of Gujarati weddings with stunning venues, dhol beats, and warm community celebrations.",
      bestMonths: "November to February",
      avgCost: "₹8-15 lakhs",
      topVenues: ["The Hyatt Ahmedabad", "Marriott Ahmedabad", "Novotel GIFT City"],
      seoDescription: "Find the best wedding vendors in Ahmedabad. Verified photographers, Gujarati wedding venues, caterers & bridal makeup artists. Zero commission on Karlo Shaadi.",
      keywords: "wedding vendors Ahmedabad, wedding photographer Ahmedabad, Gujarati wedding vendors, wedding venue Ahmedabad, caterer Ahmedabad",
    },
    udaipur: {
      name: "Udaipur",
      tagline: "The City of Lakes — India's Finest Destination Wedding",
      description: "Live your fairytale at Udaipur's stunning lake palaces with world-class hospitality and breathtaking Aravalli views.",
      bestMonths: "October to March",
      avgCost: "₹20-50 lakhs",
      topVenues: ["Taj Lake Palace", "Oberoi Udaivilas", "Fateh Garh"],
      seoDescription: "Find the best destination wedding vendors in Udaipur. Lake palace venues, photographers, decorators & caterers for royal Udaipur weddings. Zero commission on Karlo Shaadi.",
      keywords: "destination wedding Udaipur, lake palace wedding Udaipur, wedding photographer Udaipur, wedding venue Udaipur, royal wedding Udaipur",
    },
    chandigarh: {
      name: "Chandigarh",
      tagline: "The City Beautiful's Perfect Celebrations",
      description: "Plan your wedding in India's cleanest city with modern venues, Punjabi hospitality, and vibrant celebrations.",
      bestMonths: "October to February",
      avgCost: "₹8-15 lakhs",
      topVenues: ["Lalit Chandigarh", "Taj Chandigarh", "JW Marriott Chandigarh"],
      seoDescription: "Find the best wedding vendors in Chandigarh. Verified photographers, venues, Punjabi caterers & bridal makeup artists. Zero commission on Karlo Shaadi.",
      keywords: "wedding vendors Chandigarh, wedding photographer Chandigarh, Punjabi wedding Chandigarh, wedding venue Chandigarh, bridal makeup Chandigarh",
    },
    varanasi: {
      name: "Varanasi",
      tagline: "Sacred Ghats, Timeless Traditions",
      description: "Celebrate your union in the spiritual capital of India with sacred ghats, traditional ceremonies, and divine blessings.",
      bestMonths: "October to March",
      avgCost: "₹6-12 lakhs",
      topVenues: ["Taj Gateway Ganges", "Ramada Plaza", "BrijRama Palace"],
      seoDescription: "Find the best wedding vendors in Varanasi. Verified photographers, ghat wedding venues, traditional caterers & pandit services. Zero commission on Karlo Shaadi.",
      keywords: "wedding vendors Varanasi, wedding photographer Varanasi, ghat wedding Varanasi, traditional wedding Varanasi, pandit Varanasi",
    },
    agra: {
      name: "Agra",
      tagline: "Love Stories Near the Taj Mahal",
      description: "Exchange vows near the world's greatest monument to love with stunning heritage venues and unforgettable photo opportunities.",
      bestMonths: "October to March",
      avgCost: "₹8-15 lakhs",
      topVenues: ["Taj Hotel & Convention Centre", "ITC Mughal", "Radisson Agra"],
      seoDescription: "Find the best wedding vendors in Agra. Verified photographers for Taj Mahal pre-wedding shoots, venues, caterers & decorators. Zero commission on Karlo Shaadi.",
      keywords: "wedding vendors Agra, wedding photographer Agra, Taj Mahal wedding photography, destination wedding Agra, wedding venue Agra",
    },
    indore: {
      name: "Indore",
      tagline: "The Food Capital's Grand Celebrations",
      description: "Celebrate in Madhya Pradesh's commercial capital with impressive banquet halls, renowned catering, and warm hospitality.",
      bestMonths: "October to February",
      avgCost: "₹7-12 lakhs",
      topVenues: ["Sayaji Hotel", "Radisson Blu Indore", "WelcomHotel"],
      seoDescription: "Find the best wedding vendors in Indore. Verified photographers, banquet venues, caterers & bridal makeup artists. Zero commission on Karlo Shaadi.",
      keywords: "wedding vendors Indore, wedding photographer Indore, wedding venue Indore, caterer Indore, bridal makeup Indore, shaadi Indore",
    },
    goa: {
      name: "Goa",
      tagline: "Sun, Sea & Happily Ever After",
      description: "Say 'I do' on pristine Goa beaches with stunning sea views, vibrant parties, and unforgettable destination wedding experiences.",
      bestMonths: "November to February",
      avgCost: "₹15-30 lakhs",
      topVenues: ["Taj Exotica", "W Goa", "Leela Goa"],
      seoDescription: "Find the best destination wedding vendors in Goa. Beach wedding venues, photographers, caterers & DJs for your perfect Goa destination wedding. Zero commission on Karlo Shaadi.",
      keywords: "beach wedding Goa, destination wedding Goa, wedding photographer Goa, wedding venue Goa, beach wedding packages Goa",
    },
    surat: {
      name: "Surat",
      tagline: "Diamond City's Sparkling Celebrations",
      description: "Plan an opulent wedding in India's diamond city with magnificent venues, exquisite catering, and generous Gujarati hospitality.",
      bestMonths: "October to February",
      avgCost: "₹8-15 lakhs",
      topVenues: ["Courtyard Marriott Surat", "Lords Inn Surat", "Ramada Surat"],
      seoDescription: "Find the best wedding vendors in Surat. Verified photographers, banquet venues, Gujarati caterers & bridal makeup artists. Zero commission on Karlo Shaadi.",
      keywords: "wedding vendors Surat, wedding photographer Surat, wedding venue Surat, Gujarati wedding Surat, caterer Surat",
    },
    bhopal: {
      name: "Bhopal",
      tagline: "City of Lakes & Loving Unions",
      description: "Get married in the City of Lakes with beautiful lakeside venues, traditional Madhya Pradesh hospitality, and vibrant celebrations.",
      bestMonths: "October to February",
      avgCost: "₹6-12 lakhs",
      topVenues: ["Jehan Numa Palace", "Hotel Palash Residency", "Noor-Us-Sabah Palace"],
      seoDescription: "Find the best wedding vendors in Bhopal. Verified photographers, palace venues, caterers & bridal makeup artists. Zero commission on Karlo Shaadi.",
      keywords: "wedding vendors Bhopal, wedding photographer Bhopal, wedding venue Bhopal, palace wedding Bhopal, caterer Bhopal",
    },
    patna: {
      name: "Patna",
      tagline: "Ancient Bihar, Modern Celebrations",
      description: "Celebrate your union in the capital of Bihar with traditional ceremonies, warm community hospitality, and modern amenities.",
      bestMonths: "October to February",
      avgCost: "₹5-10 lakhs",
      topVenues: ["Patna Hotel", "Hotel Maurya", "Chanakya Hotel"],
      seoDescription: "Find the best wedding vendors in Patna. Verified photographers, banquet venues, caterers & bridal makeup artists. Zero commission on Karlo Shaadi.",
      keywords: "wedding vendors Patna, wedding photographer Patna, wedding venue Patna, caterer Patna, bridal makeup Patna, shaadi Patna",
    },
    nagpur: {
      name: "Nagpur",
      tagline: "Heart of India's Grand Celebrations",
      description: "Plan your wedding in Orange City with excellent venues, Vidarbha-style hospitality, and vibrant community celebrations.",
      bestMonths: "October to February",
      avgCost: "₹6-12 lakhs",
      topVenues: ["Le Meridien Nagpur", "Radisson Blu Nagpur", "Pride Hotel Nagpur"],
      seoDescription: "Find the best wedding vendors in Nagpur. Verified photographers, banquet venues, caterers & bridal makeup artists. Zero commission on Karlo Shaadi.",
      keywords: "wedding vendors Nagpur, wedding photographer Nagpur, wedding venue Nagpur, caterer Nagpur, shaadi Nagpur",
    },
    kanpur: {
      name: "Kanpur",
      tagline: "Leather City's Proud Celebrations",
      description: "Celebrate your wedding in UP's industrial heart with grand banquet halls, traditional Awadhi cuisine, and warm hospitality.",
      bestMonths: "October to February",
      avgCost: "₹6-12 lakhs",
      topVenues: ["Landmark Hotel", "Hotel Geet", "Vijay Vilas Palace"],
      seoDescription: "Find the best wedding vendors in Kanpur. Verified photographers, banquet venues, caterers & bridal makeup artists. Zero commission on Karlo Shaadi.",
      keywords: "wedding vendors Kanpur, wedding photographer Kanpur, wedding venue Kanpur, caterer Kanpur, shaadi Kanpur, bridal makeup Kanpur",
    },
  };

  const city = cityData[slug || "lucknow"] || cityData["lucknow"];

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
        { id: 1, couple: "Priya & Raj", theme: "Royal Nawabi", image: cdn.heroWedding },
        { id: 2, couple: "Ananya & Vikram", theme: "Modern", image: cdn.heroWedding },
      ]);
    } catch { /* ignored */ } finally {
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
      <SEO
        title={`Wedding Vendors in ${city.name} | Best Photographers, Venues & Caterers`}
        description={city.seoDescription || `Find the best wedding vendors in ${city.name}. Verified photographers, venues, caterers, decorators & more. Zero commission. Book on Karlo Shaadi.`}
        keywords={city.keywords
          ? `${city.keywords}, ${city.name} में शादी, ${city.name} वेडिंग फोटोग्राफर, ${city.name} शादी वेंडर`
          : `wedding vendors ${city.name}, wedding photographer ${city.name}, wedding venue ${city.name}, ${city.name} mein shaadi, ${city.name} wedding planner, best caterer ${city.name}, mehendi artist ${city.name}`}
        url={`/city/${slug}`}
        breadcrumbs={[{ name: `Wedding Vendors in ${city.name}`, url: `/city/${slug}` }]}
      />
      <LocalBusinessJsonLd city={city.name} />
      <BreadcrumbJsonLd items={[{ name: `Wedding Vendors in ${city.name}`, url: `/city/${slug}` }]} />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={cdn.heroWedding} 
            alt={`Wedding in ${city.name}`}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/70 to-background/50" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl ">
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
                className="p-6 text-center "
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
                    className="overflow-hidden h-full "
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
      <section className="py-20 bg-background">
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

      
    </div>
  );
};

export default City;
