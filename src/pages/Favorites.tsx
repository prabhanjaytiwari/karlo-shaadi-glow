import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Favorite {
  id: string;
  vendor: {
    id: string;
    business_name: string;
    category: string;
    average_rating: number;
    total_reviews: number;
    city_id: string;
    description: string;
  };
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select(`
          id,
          vendor:vendors(
            id,
            business_name,
            category,
            average_rating,
            total_reviews,
            city_id,
            description
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      setFavorites(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading favorites",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", favoriteId);

      if (error) throw error;

      setFavorites(favorites.filter(f => f.id !== favoriteId));
      toast({
        title: "Removed from favorites",
      });
    } catch (error: any) {
      toast({
        title: "Error removing favorite",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <BhindiHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">My Favorites</h1>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl font-semibold mb-2">No favorites yet</p>
                <p className="text-muted-foreground mb-4">
                  Start adding vendors to your favorites list
                </p>
                <Button onClick={() => navigate("/search")}>Browse Vendors</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl line-clamp-1">
                        {favorite.vendor.business_name}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFavorite(favorite.id)}
                      >
                        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                    <Badge variant="outline" className="w-fit capitalize">
                      {favorite.vendor.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {favorite.vendor.description || "Professional wedding vendor"}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">
                          {favorite.vendor.average_rating?.toFixed(1) || "New"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({favorite.vendor.total_reviews || 0})
                        </span>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => navigate(`/vendor/${favorite.vendor.id}`)}
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <BhindiFooter />
    </div>
  );
}
