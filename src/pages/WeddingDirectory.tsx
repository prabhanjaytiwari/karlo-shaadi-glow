import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import { SEO } from "@/components/SEO";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Camera, UtensilsCrossed, Music, Palette, Sparkles, Star, ArrowRight, Users } from "lucide-react";
import { FAQPageJsonLd } from "@/components/JsonLd";

const CITIES = [
  "Lucknow", "Delhi", "Mumbai", "Bangalore", "Jaipur", "Hyderabad",
  "Chennai", "Kolkata", "Pune", "Ahmedabad", "Udaipur", "Goa",
  "Chandigarh", "Kochi", "Indore", "Agra", "Bhopal", "Surat", "Nagpur",
];

const CATEGORIES = [
  { slug: "photography", name: "Wedding Photographers", icon: Camera, desc: "Capture every precious moment of your special day" },
  { slug: "venues", name: "Wedding Venues", icon: MapPin, desc: "Find the perfect venue for your dream wedding" },
  { slug: "catering", name: "Wedding Caterers", icon: UtensilsCrossed, desc: "Delight your guests with amazing food" },
  { slug: "decoration", name: "Wedding Decorators", icon: Palette, desc: "Transform your venue into a fairy tale" },
  { slug: "music", name: "DJs & Bands", icon: Music, desc: "Set the mood with the perfect music" },
  { slug: "makeup", name: "Makeup Artists", icon: Sparkles, desc: "Look your absolute best on your big day" },
  { slug: "mehendi", name: "Mehendi Artists", icon: Sparkles, desc: "Beautiful henna designs for the bride" },
];

const SEO_CONTENT: Record<string, Record<string, { title: string; intro: string; tips: string[] }>> = {};

// Generate SEO content dynamically
CITIES.forEach(city => {
  SEO_CONTENT[city.toLowerCase()] = {};
  CATEGORIES.forEach(cat => {
    SEO_CONTENT[city.toLowerCase()][cat.slug] = {
      title: `${CITIES.length > 0 ? "Top" : "Best"} ${cat.name} in ${city} (2025-2026)`,
      intro: `Looking for the best ${cat.name.toLowerCase()} in ${city}? Karlo Shaadi has verified and rated ${cat.name.toLowerCase()} who have been trusted by hundreds of couples. Browse portfolios, compare prices, read real reviews, and book with confidence — all for free.`,
      tips: [
        `Book your ${cat.name.toLowerCase()} in ${city} at least 3-6 months before your wedding date`,
        `Always check verified reviews from real couples on Karlo Shaadi`,
        `Compare at least 3 ${cat.name.toLowerCase()} before making a decision`,
        `Ask for a detailed quotation and clarify what's included`,
        `Use Karlo Shaadi's milestone payment system for fraud protection`,
      ],
    };
  });
});

const WeddingDirectory = () => {
  const [vendorCounts, setVendorCounts] = useState<Record<string, number>>({});
  const [topCities, setTopCities] = useState<Array<{ city: string; count: number }>>([]);

  useEffect(() => {
    loadVendorCounts();
  }, []);

  const loadVendorCounts = async () => {
    try {
      const { data } = await supabase
        .from("vendors")
        .select("category, cities(name)")
        .eq("is_active", true)
        .eq("verified", true);

      if (data) {
        const counts: Record<string, number> = {};
        const cityCounts: Record<string, number> = {};
        data.forEach((v: any) => {
          counts[v.category] = (counts[v.category] || 0) + 1;
          const cityName = v.cities?.name;
          if (cityName) {
            cityCounts[cityName] = (cityCounts[cityName] || 0) + 1;
          }
        });
        setVendorCounts(counts);
        setTopCities(
          Object.entries(cityCounts)
            .map(([city, count]) => ({ city, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 12)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const citySlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-rose-50/30 via-white to-amber-50/20">
      <MobilePageHeader title="Wedding Directory" />
      <SEO
        title="Wedding Vendors Directory – Every City, Every Category | Karlo Shaadi"
        description="Find verified wedding vendors across 20+ Indian cities. Photographers, venues, caterers, decorators, DJs, makeup artists & more. Compare prices, read reviews, book free."
        keywords="wedding vendors india, wedding directory, wedding photographers near me, wedding venues, wedding caterers, shaadi vendors"
      />
      <FAQPageJsonLd faqs={[
        { question: "How many cities does Karlo Shaadi cover?", answer: "We have verified wedding vendors across 20+ cities including Delhi, Mumbai, Lucknow, Bangalore, Jaipur, Hyderabad, Chennai, Kolkata, and more." },
        { question: "Is it free to browse and book vendors?", answer: "Yes! Browsing vendors, reading reviews, and booking is 100% free. We never charge couples any commission or hidden fees." },
        { question: "Are all vendors verified?", answer: "Every vendor on Karlo Shaadi goes through our verification process including identity checks, portfolio review, and past work validation." },
        { question: "How do I compare wedding vendors?", answer: "Use our comparison feature to compare up to 4 vendors side-by-side on price, ratings, reviews, and portfolio quality." },
      ]} />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-rose-50/60 to-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            <Star className="h-3 w-3 mr-1 fill-primary" /> Complete Wedding Directory
          </Badge>
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-4">
            Find <span className="text-primary">Verified Wedding Vendors</span> Near You
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Browse {Object.values(vendorCounts).reduce((a, b) => a + b, 0) || "hundreds of"} verified vendors across {CITIES.length} cities. 
            Compare prices, read reviews, and book with confidence.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-center mb-8">
            Browse by <span className="text-primary">Category</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {CATEGORIES.map((cat) => (
              <Card key={cat.slug} className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <cat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{cat.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {CITIES.slice(0, 4).map((city) => (
                          <Link key={city} to={`/vendors/${citySlug(city)}/${cat.slug}`}>
                            <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-primary/10 transition-colors">
                              {city}
                            </Badge>
                          </Link>
                        ))}
                        <Badge variant="outline" className="text-[10px] text-primary">
                          +{CITIES.length - 4} more
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* City x Category Matrix */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-center mb-3">
            Wedding Vendors by <span className="text-primary">City</span>
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-xl mx-auto text-sm">
            Click any combination to find the perfect vendor for your city and category
          </p>
          
          <div className="max-w-6xl mx-auto space-y-6">
            {CITIES.map((city) => (
              <div key={city} className="bg-white rounded-xl p-4 sm:p-5 border border-border/50 hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <Link to={`/vendors/${citySlug(city)}`} className="font-display font-semibold text-base hover:text-primary transition-colors">
                    {city}
                  </Link>
                  {topCities.find(c => c.city === city) && (
                    <Badge variant="secondary" className="text-[10px]">
                      {topCities.find(c => c.city === city)?.count}+ vendors
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <Link key={cat.slug} to={`/vendors/${citySlug(city)}/${cat.slug}`}>
                      <Badge 
                        variant="outline" 
                        className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                      >
                        {cat.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl mb-4">
            Can't Decide? Let <span className="text-primary">AI Help</span>
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Get a complete wedding plan with vendor recommendations, budget breakdown, and timeline in just 2 minutes
          </p>
          <Link to="/plan-wizard">
            <Button size="lg" className="gap-2 rounded-full">
              <Sparkles className="h-5 w-5" />
              Get Your Free AI Wedding Plan
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      
    </div>
  );
};

export default WeddingDirectory;
