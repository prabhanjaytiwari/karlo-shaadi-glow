import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BhindiHeader } from "@/components/BhindiHeader";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, Clock, Phone, MessageCircle, Sparkles, ArrowLeft, Heart, Calendar, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MessagingDialog } from "@/components/MessagingDialog";
import { BookingDialog } from "@/components/BookingDialog";

interface MatchedVendor {
  id: string;
  business_name: string;
  category: string;
  description: string;
  average_rating: number;
  total_reviews: number;
  years_experience: number;
  logo_url: string;
  verified: boolean;
  subscription_tier: string;
  matchScore: number;
  matchReasons: string[];
  cities?: { name: string; state: string };
  vendor_services?: Array<{ base_price: number; price_range_min: number; price_range_max: number }>;
}

export default function AIMatchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<MatchedVendor[]>([]);
  const [preferences, setPreferences] = useState<any>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadMatchResults();
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("favorites")
        .select("vendor_id")
        .eq("user_id", user.id);
      if (data) {
        setFavorites(new Set(data.map(f => f.vendor_id)));
      }
    }
  };

  const loadMatchResults = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Get preferences from URL params
      const category = searchParams.get("category") || "";
      const city = searchParams.get("city") || "";
      const budgetMin = parseInt(searchParams.get("budgetMin") || "0");
      const budgetMax = parseInt(searchParams.get("budgetMax") || "10000000");
      const guestCount = parseInt(searchParams.get("guestCount") || "0");
      const weddingDate = searchParams.get("weddingDate") || "";
      const weddingStyle = searchParams.get("weddingStyle") || "";
      const services = searchParams.get("services")?.split(",").filter(Boolean) || [];

      setPreferences({
        category,
        city,
        budget: { min: budgetMin, max: budgetMax },
        guestCount,
        weddingDate,
        weddingStyle,
        services
      });

      // Call the smart matching function
      const { data, error } = await supabase.functions.invoke("smart-vendor-matching", {
        body: {
          userId: user.id,
          category: services[0] || category,
          budget: { min: budgetMin, max: budgetMax },
          city,
          preferences: {
            guestCount,
            weddingDate,
            weddingStyle,
            services
          }
        }
      });

      if (error) throw error;

      // Process vendor results with match scores
      const matchedVendors = (data.vendors || []).map((vendor: any, index: number) => {
        // Calculate match score based on position and attributes
        const baseScore = 100 - (index * 5);
        const ratingBonus = (vendor.average_rating || 0) * 2;
        const experienceBonus = Math.min((vendor.years_experience || 0), 10);
        const tierBonus = vendor.subscription_tier === 'sponsored' ? 10 : 
                          vendor.subscription_tier === 'featured' ? 5 : 0;
        
        const matchScore = Math.min(100, Math.max(60, baseScore + ratingBonus + experienceBonus + tierBonus));

        // Generate match reasons
        const matchReasons: string[] = [];
        if (vendor.verified) matchReasons.push("Verified vendor");
        if (vendor.average_rating >= 4.5) matchReasons.push("Top rated");
        if (vendor.years_experience >= 5) matchReasons.push(`${vendor.years_experience}+ years experience`);
        if (vendor.subscription_tier === 'sponsored') matchReasons.push("Premium vendor");
        if (vendor.total_reviews >= 10) matchReasons.push("Popular choice");
        
        return {
          ...vendor,
          matchScore: Math.round(matchScore),
          matchReasons: matchReasons.slice(0, 3)
        };
      });

      setVendors(matchedVendors);
    } catch (error: any) {
      console.error("Error loading match results:", error);
      toast({
        title: "Error",
        description: "Failed to load vendor matches. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (vendorId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to save favorites",
        variant: "destructive"
      });
      return;
    }

    if (favorites.has(vendorId)) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("vendor_id", vendorId);
      setFavorites(prev => {
        const next = new Set(prev);
        next.delete(vendorId);
        return next;
      });
      toast({ title: "Removed from favorites" });
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, vendor_id: vendorId });
      setFavorites(prev => new Set(prev).add(vendorId));
      toast({ title: "Added to favorites" });
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 75) return "bg-emerald-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'sponsored':
        return <Badge className="bg-gradient-to-r from-primary to-accent text-white">Diamond</Badge>;
      case 'featured':
        return <Badge className="bg-accent/20 text-accent border-accent">Gold</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BhindiHeader />
      
      <main className="flex-1 bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Your Perfect Matches</h1>
                <p className="text-muted-foreground">
                  AI-powered recommendations based on your preferences
                </p>
              </div>
            </div>

            {/* Preference Summary */}
            {preferences && (
              <div className="flex flex-wrap gap-2 mt-4">
                {preferences.city && (
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="h-3 w-3" /> {preferences.city}
                  </Badge>
                )}
                {preferences.guestCount > 0 && (
                  <Badge variant="outline">{preferences.guestCount} guests</Badge>
                )}
                {preferences.weddingDate && (
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" /> {new Date(preferences.weddingDate).toLocaleDateString()}
                  </Badge>
                )}
                {preferences.services.map((service: string) => (
                  <Badge key={service} variant="secondary" className="capitalize">
                    {service.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="p-6">
                  <div className="flex gap-6">
                    <Skeleton className="h-32 w-32 rounded-xl" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : vendors.length === 0 ? (
            <Card className="p-12 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No matches found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find vendors matching your criteria. Try adjusting your preferences.
              </p>
              <Button onClick={() => navigate("/search")}>
                Browse All Vendors
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6">
              {vendors.map((vendor, index) => (
                <Card 
                  key={vendor.id} 
                  className={`overflow-hidden transition-all hover:shadow-lg ${
                    index === 0 ? 'border-2 border-primary/30 bg-primary/5' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Vendor Image */}
                      <div className="relative">
                        <div className="h-32 w-32 rounded-xl overflow-hidden bg-muted">
                          {vendor.logo_url ? (
                            <img 
                              src={vendor.logo_url} 
                              alt={vendor.business_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                              <span className="text-3xl font-bold text-primary">
                                {vendor.business_name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        {index === 0 && (
                          <Badge className="absolute -top-2 -left-2 bg-primary text-primary-foreground">
                            Best Match
                          </Badge>
                        )}
                      </div>

                      {/* Vendor Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-semibold">{vendor.business_name}</h3>
                              {vendor.verified && (
                                <CheckCircle className="h-5 w-5 text-green-500 fill-green-500/20" />
                              )}
                              {getTierBadge(vendor.subscription_tier)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <Badge variant="outline" className="capitalize">
                                {vendor.category}
                              </Badge>
                              {vendor.cities && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {vendor.cities.name}
                                </span>
                              )}
                              {vendor.years_experience > 0 && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {vendor.years_experience} yrs
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Match Score */}
                          <div className="text-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getMatchScoreColor(vendor.matchScore)} text-white font-bold text-lg`}>
                              {vendor.matchScore}%
                            </div>
                            <span className="text-xs text-muted-foreground mt-1">Match</span>
                          </div>
                        </div>

                        {/* Description */}
                        {vendor.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {vendor.description}
                          </p>
                        )}

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-semibold">{vendor.average_rating?.toFixed(1) || 'New'}</span>
                            <span className="text-sm text-muted-foreground">
                              ({vendor.total_reviews || 0} reviews)
                            </span>
                          </div>
                        </div>

                        {/* Match Reasons */}
                        {vendor.matchReasons.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {vendor.matchReasons.map((reason, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            onClick={() => navigate(`/vendor/${vendor.id}`)}
                          >
                            View Profile
                          </Button>
                          <BookingDialog vendorId={vendor.id}>
                            <Button size="sm" variant="outline">
                              <Calendar className="h-4 w-4 mr-2" />
                              Book Now
                            </Button>
                          </BookingDialog>
                          <MessagingDialog vendorId={vendor.id} vendorName={vendor.business_name}>
                            <Button size="sm" variant="ghost">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          </MessagingDialog>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleFavorite(vendor.id)}
                          >
                            <Heart 
                              className={`h-4 w-4 ${favorites.has(vendor.id) ? 'fill-red-500 text-red-500' : ''}`} 
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* CTA */}
          {vendors.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">
                Not finding what you need?
              </p>
              <Button variant="outline" onClick={() => navigate("/search")}>
                Browse All Vendors
              </Button>
            </div>
          )}
        </div>
      </main>

      
    </div>
  );
}