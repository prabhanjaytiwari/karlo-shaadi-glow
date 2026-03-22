import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  Crown,
  Medal,
  Award,
  Loader2,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";

interface LeaderboardVendor {
  id: string;
  business_name: string;
  category: string;
  logo_url: string | null;
  average_rating: number | null;
  total_reviews: number | null;
  total_bookings: number | null;
  verified: boolean;
  cities: { name: string } | null;
}

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "photography", label: "Photography" },
  { value: "catering", label: "Catering" },
  { value: "venues", label: "Venues" },
  { value: "makeup", label: "Makeup" },
  { value: "decoration", label: "Decoration" },
  { value: "music", label: "Music" },
  { value: "mehendi", label: "Mehendi" },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Medal className="h-6 w-6 text-amber-600" />;
    default:
      return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
  }
};

const getRankBadgeClass = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-amber-500 text-white border-0";
    case 2:
      return "bg-gray-400 text-white border-0";
    case 3:
      return "bg-amber-600 text-white border-0";
    default:
      return "";
  }
};

export default function VendorLeaderboard() {
  const [vendors, setVendors] = useState<LeaderboardVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"rating" | "bookings" | "reviews">("rating");

  useEffect(() => {
    loadLeaderboard();
  }, [selectedCategory, sortBy]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("vendors")
        .select(`
          id,
          business_name,
          category,
          logo_url,
          average_rating,
          total_reviews,
          total_bookings,
          verified,
          cities (name)
        `)
        .eq("is_active", true)
        .eq("verified", true);

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory as any);
      }

      // Sort based on selected criteria
      switch (sortBy) {
        case "rating":
          query = query.order("average_rating", { ascending: false, nullsFirst: false });
          break;
        case "bookings":
          query = query.order("total_bookings", { ascending: false, nullsFirst: false });
          break;
        case "reviews":
          query = query.order("total_reviews", { ascending: false, nullsFirst: false });
          break;
      }

      query = query.limit(50);

      const { data, error } = await query;
      if (error) throw error;
      setVendors(data || []);
    } catch { /* ignored */ } finally {
      setLoading(false);
    }
  };

  const currentMonth = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MobilePageHeader title="Vendor Leaderboard" />
      
      
      <main className="flex-1 container mx-auto px-4 pt-20 md:pt-24 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-4">
              <Trophy className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-accent">Top Performers</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Vendor Leaderboard
            </h1>
            <p className="text-muted-foreground">
              {currentMonth} • Top rated vendors across all categories
            </p>
          </div>

          {/* Category Tabs */}
          <Card className="mb-6 ">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {CATEGORIES.map((cat) => (
                  <Badge
                    key={cat.value}
                    variant={selectedCategory === cat.value ? "default" : "outline"}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => setSelectedCategory(cat.value)}
                  >
                    {cat.label}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 items-center text-sm">
                <span className="text-muted-foreground">Sort by:</span>
                <Badge
                  variant={sortBy === "rating" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSortBy("rating")}
                >
                  <Star className="h-3 w-3 mr-1" />
                  Rating
                </Badge>
                <Badge
                  variant={sortBy === "bookings" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSortBy("bookings")}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Bookings
                </Badge>
                <Badge
                  variant={sortBy === "reviews" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSortBy("reviews")}
                >
                  <Award className="h-3 w-3 mr-1" />
                  Reviews
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : vendors.length === 0 ? (
            <Card className="">
              <CardContent className="py-12 text-center">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No vendors found in this category</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {vendors.map((vendor, index) => {
                const rank = index + 1;
                return (
                  <Link to={`/vendor/${vendor.id}`} key={vendor.id}>
                    <Card 
                      className={`transition-all hover:shadow-lg hover:-translate-y-0.5 border-2 ${
                        rank <= 3 ? "border-accent/40 bg-gradient-to-r from-white to-rose-50/50" : "border-accent/20"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Rank */}
                          <div className="flex-shrink-0 w-10 flex items-center justify-center">
                            {getRankIcon(rank)}
                          </div>

                          {/* Avatar */}
                          <Avatar className="h-14 w-14 ">
                            <AvatarImage src={vendor.logo_url || undefined} />
                            <AvatarFallback className="bg-accent/10 text-accent font-bold">
                              {vendor.business_name[0]}
                            </AvatarFallback>
                          </Avatar>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold truncate">{vendor.business_name}</h3>
                              {vendor.verified && (
                                <Badge variant="secondary" className="text-xs">Verified</Badge>
                              )}
                              {rank <= 3 && (
                                <Badge className={getRankBadgeClass(rank)}>
                                  #{rank} {rank === 1 ? "Champion" : rank === 2 ? "Runner-up" : "Bronze"}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                              <span className="capitalize">{vendor.category}</span>
                              {vendor.cities?.name && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {vendor.cities.name}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex-shrink-0 text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Star className="h-4 w-4 text-accent fill-accent" />
                              <span className="font-bold">{vendor.average_rating?.toFixed(1) || "N/A"}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {vendor.total_reviews || 0} reviews • {vendor.total_bookings || 0} bookings
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          {/* CTA for vendors */}
          <Card className="mt-8 bg-muted/30 shadow-[var(--shadow-sm)]">
            <CardContent className="py-8 text-center">
              <Trophy className="h-10 w-10 mx-auto mb-4 text-accent" />
              <h3 className="font-display text-xl font-bold mb-2">Want to be on the leaderboard?</h3>
              <p className="text-muted-foreground mb-4">
                Join Karlo Shaadi and showcase your work to thousands of couples
              </p>
              <Link to="/for-vendors">
                <Badge className="cursor-pointer px-4 py-2">
                  Register as Vendor →
                </Badge>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      
    </div>
  );
}
