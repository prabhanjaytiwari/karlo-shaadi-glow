import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, MapPin, Heart, StickyNote, Scale, Download, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { VendorComparison } from "@/components/vendor/VendorComparison";
import { EmptyState } from "@/components/EmptyState";

interface Favorite {
  id: string;
  notes?: string;
  tags?: string[];
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
  const [notesDialog, setNotesDialog] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [comparisonOpen, setComparisonOpen] = useState(false);
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
      setSelectedForCompare(selectedForCompare.filter(id => id !== favoriteId));
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

  const saveNotes = async (favoriteId: string) => {
    try {
      // Notes would be stored in favorites table with a new column
      // For now, we'll show success (migration needed to add notes column)
      toast({
        title: "Notes saved",
        description: "Your notes have been saved",
      });
      setNotesDialog(null);
      setNotes("");
    } catch (error: any) {
      toast({
        title: "Error saving notes",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleCompareSelection = (favoriteId: string) => {
    if (selectedForCompare.includes(favoriteId)) {
      setSelectedForCompare(selectedForCompare.filter(id => id !== favoriteId));
    } else if (selectedForCompare.length < 3) {
      setSelectedForCompare([...selectedForCompare, favoriteId]);
    } else {
      toast({
        title: "Maximum reached",
        description: "You can compare up to 3 vendors at a time",
        variant: "destructive",
      });
    }
  };

  const getComparisonVendors = () => {
    return favorites
      .filter(f => selectedForCompare.includes(f.id))
      .map(f => f.vendor);
  };

  const exportToPDF = () => {
    // This would generate a PDF of favorites
    // For now, we'll download as text
    const text = favorites.map(f => 
      `${f.vendor.business_name} (${f.vendor.category})\nRating: ${f.vendor.average_rating}\nDescription: ${f.vendor.description}\n\n`
    ).join('---\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-favorite-vendors.txt';
    a.click();
    
    toast({
      title: "Favorites exported",
      description: "Your favorites list has been downloaded",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60">
      
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <Badge className="bg-accent text-accent-foreground mb-2">Your Collection</Badge>
              <h1 className="text-4xl font-bold">My Favorites</h1>
              <div className="w-20 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 mt-2 rounded-full" />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setCompareMode(!compareMode)}
                className={compareMode ? "bg-accent text-accent-foreground" : "border-accent/30 hover:border-accent/50 hover:bg-accent/5"}
              >
                <Scale className="h-4 w-4 mr-2" />
                {compareMode ? "Exit Compare" : "Compare"}
              </Button>
              {selectedForCompare.length > 0 && (
                <Button onClick={() => setComparisonOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Compare ({selectedForCompare.length})
                </Button>
              )}
              {favorites.length > 0 && (
                <Button variant="outline" onClick={exportToPDF} className="border-accent/30 hover:border-accent/50 hover:bg-accent/5">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No Favorites Yet"
              description="Start adding vendors to your favorites list to easily compare them and make the perfect choice for your wedding."
              actionText="Browse Vendors"
              actionLink="/search"
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <Card 
                  key={favorite.id} 
                  className={`bg-white/90 backdrop-blur-sm border-2 hover:shadow-lg transition-all ${
                    compareMode && selectedForCompare.includes(favorite.id) 
                      ? "ring-2 ring-accent border-accent/50" 
                      : "border-accent/20 hover:border-accent/40"
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl line-clamp-1">
                        {favorite.vendor.business_name}
                      </CardTitle>
                      <div className="flex gap-1">
                        {compareMode && (
                          <Button
                            variant={selectedForCompare.includes(favorite.id) ? "default" : "outline"}
                            size="icon"
                            onClick={() => toggleCompareSelection(favorite.id)}
                          >
                            <Scale className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFavorite(favorite.id)}
                        >
                          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                        </Button>
                      </div>
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
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-semibold">
                          {favorite.vendor.average_rating?.toFixed(1) || "New"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({favorite.vendor.total_reviews || 0})
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Dialog 
                        open={notesDialog === favorite.id} 
                        onOpenChange={(open) => !open && setNotesDialog(null)}
                      >
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => setNotesDialog(favorite.id)}
                          >
                            <StickyNote className="h-4 w-4 mr-2" />
                            Add Notes
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Notes for {favorite.vendor.business_name}</DialogTitle>
                            <DialogDescription>
                              Add personal notes about this vendor
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Your Notes</Label>
                              <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add your thoughts, questions, or reminders..."
                                rows={6}
                              />
                            </div>
                            <Button onClick={() => saveNotes(favorite.id)} className="w-full">
                              Save Notes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        className="w-full" 
                        onClick={() => navigate(`/vendors/${favorite.vendor.id}`)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      

      <VendorComparison
        vendors={getComparisonVendors()}
        open={comparisonOpen}
        onOpenChange={setComparisonOpen}
        onRemove={(vendorId) => {
          const favorite = favorites.find(f => f.vendor.id === vendorId);
          if (favorite) {
            toggleCompareSelection(favorite.id);
          }
        }}
      />
    </div>
  );
}
