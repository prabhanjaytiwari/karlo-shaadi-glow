import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface FavoritesButtonProps {
  vendorId: string;
}

export function FavoritesButton({ vendorId }: FavoritesButtonProps) {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, [vendorId]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      checkFavoriteStatus(user.id);
    }
  };

  const checkFavoriteStatus = async (userId: string) => {
    // For now, we'll use localStorage since we don't have a favorites table
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || "[]");
    setIsFavorite(favorites.includes(vendorId));
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to save favorites",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || "[]");
      
      if (isFavorite) {
        const updated = favorites.filter((id: string) => id !== vendorId);
        localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updated));
        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
        });
      } else {
        favorites.push(vendorId);
        localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
        setIsFavorite(true);
        toast({
          title: "Added to favorites",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleFavorite}
      disabled={loading}
      className={`transition-all duration-300 ${isFavorite ? "text-red-500 border-red-500" : ""}`}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
    </Button>
  );
}