import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { trackFavoriteAdded, trackFavoriteRemoved } from "@/lib/analytics";

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
    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("vendor_id", vendorId)
      .maybeSingle();
    
    setIsFavorite(!!data);
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
      if (isFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("vendor_id", vendorId);

        if (error) throw error;
        
        setIsFavorite(false);
        trackFavoriteRemoved(vendorId);
        toast({
          title: "Removed from favorites",
        });
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({
            user_id: user.id,
            vendor_id: vendorId,
          });

        if (error) throw error;
        
        setIsFavorite(true);
        trackFavoriteAdded(vendorId);
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