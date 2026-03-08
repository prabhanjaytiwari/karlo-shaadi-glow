import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BhindiHeader } from "@/components/BhindiHeader";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, TrendingUp, Users, Calendar, Award, 
  ArrowRight, Sparkles, Quote, IndianRupee 
} from "lucide-react";

interface TopVendor {
  id: string;
  business_name: string;
  category: string;
  city_name?: string;
  average_rating: number;
  total_reviews: number;
  total_bookings: number;
  years_experience: number;
  logo_url?: string;
  description?: string;
  verified: boolean;
}

const VendorSuccessStories = () => {
  const navigate = useNavigate();
  const [topVendors, setTopVendors] = useState<TopVendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopVendors();
  }, []);

  const fetchTopVendors = async () => {
    try {
      const { data } = await supabase
        .from("vendors")
        .select(`
          id,
          business_name,
          category,
          average_rating,
          total_reviews,
          total_bookings,
          years_experience,
          logo_url,
          description,
          verified,
          cities!vendors_city_id_fkey(name)
        `)
        .eq("is_active", true)
        .eq("verified", true)
        .order("average_rating", { ascending: false })
        .order("total_bookings", { ascending: false })
        .limit(6);

      if (data) {
        const formattedVendors = data.map((v: any) => ({
          ...v,
          city_name: v.cities?.name,
        }));
        setTopVendors(formattedVendors);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const successMetrics = [
    { label: "Vendors Joined", value: "500+", icon: Users },
    { label: "Weddings Served", value: "2,000+", icon: Calendar },
    { label: "Revenue Generated", value: "₹50Cr+", icon: IndianRupee },
    { label: "Average Rating", value: "4.8★", icon: Star },
  ];

  const testimonials = [
    {
      name: "Royal Bloom Events",
      category: "Decoration",
      quote: "Karlo Shaadi transformed our business. We went from 5 bookings a month to 25+ within 6 months of joining!",
      growth: "400%",
      image: null,
    },
    {
      name: "Moments by Mehta",
      category: "Photography",
      quote: "The verified badge and premium listing helped us stand out. Our inquiry rate tripled!",
      growth: "300%",
      image: null,
    },
    {
      name: "Spice Symphony Caterers",
      category: "Catering",
      quote: "The platform's reach across India helped us expand to 5 new cities. Best decision for our business.",
      growth: "250%",
      image: null,
    },
  ];

  const formatCategory = (cat: string) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, " ");
  };

  return (
    <div className="min-h-screen bg-background">
      <BhindiHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
            <Sparkles className="w-3 h-3 mr-1" />
            Vendor Success Stories
          </Badge>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl mb-6">
            Grow Your Wedding <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Business</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join 500+ successful vendors who have transformed their wedding business with Karlo Shaadi. 
            Get more bookings, build your reputation, and grow your revenue.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/vendor/auth")}
            className="rounded-full px-8"
          >
            Join as Vendor
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {successMetrics.map((metric, idx) => (
              <Card key={idx} className="text-center border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <metric.icon className="h-6 w-6 text-accent" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor Testimonials */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Hear From Our <span className="text-accent">Top Vendors</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real stories from vendors who have grown their business with Karlo Shaadi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="border-2 border-border/50 hover:border-accent/30 transition-all">
                <CardContent className="pt-6 space-y-4">
                  <Quote className="h-8 w-8 text-accent/30" />
                  <p className="text-muted-foreground italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.category}</p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {testimonial.growth} Growth
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Performing Vendors */}
      <section className="py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Award className="w-3 h-3 mr-1" />
              Top Performers
            </Badge>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Meet Our Star Vendors
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These vendors have achieved exceptional ratings and bookings on our platform
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="pt-6">
                    <div className="h-16 w-16 bg-muted rounded-xl mx-auto mb-4" />
                    <div className="h-6 bg-muted rounded w-3/4 mx-auto mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {topVendors.map((vendor) => (
                <Card 
                  key={vendor.id} 
                  className="border-2 border-border/50 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => navigate(`/vendor/${vendor.id}`)}
                >
                  <CardContent className="pt-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mx-auto overflow-hidden">
                      {vendor.logo_url ? (
                        <img 
                          src={vendor.logo_url} 
                          alt={vendor.business_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-accent">
                          {vendor.business_name[0]}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {vendor.business_name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {formatCategory(vendor.category)}
                        </Badge>
                        {vendor.verified && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span>{vendor.average_rating?.toFixed(1) || "New"}</span>
                      </div>
                      <div>{vendor.total_bookings || 0} bookings</div>
                    </div>

                    {vendor.city_name && (
                      <p className="text-sm text-muted-foreground">{vendor.city_name}</p>
                    )}

                    <Button variant="outline" className="w-full mt-4">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {topVendors.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Be one of our first featured vendors!
              </p>
              <Button 
                className="mt-4"
                onClick={() => navigate("/vendor/auth")}
              >
                Join Now
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-primary to-accent">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-6 text-white">
            Ready to Grow Your Business?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join Karlo Shaadi today and connect with thousands of couples looking for 
            their perfect wedding vendors. Start your success story now!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 rounded-full px-8"
              onClick={() => navigate("/vendor/auth")}
            >
              Start Free Listing
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10 rounded-full px-8"
              onClick={() => navigate("/vendor/pricing")}
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      <BhindiFooter />
    </div>
  );
};

export default VendorSuccessStories;
