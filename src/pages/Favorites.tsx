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
import { Star, Heart, StickyNote, Scale, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { VendorComparison } from "@/components/vendor/VendorComparison";
import { EmptyState } from "@/components/EmptyState";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  useEffect(() => { loadFavorites(); }, []);

  const loadFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      const { data, error } = await supabase
        .from("favorites")
        .select(`id, vendor:vendors(id, business_name, category, average_rating, total_reviews, city_id, description)`)
        .eq("user_id", user.id);
      if (error) throw error;
      setFavorites(data || []);
    } catch (error: any) {
      toast({ title: "Error loading favorites", description: error.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase.from("favorites").delete().eq("id", favoriteId);
      if (error) throw error;
      setFavorites(favorites.filter(f => f.id !== favoriteId));
      setSelectedForCompare(selectedForCompare.filter(id => id !== favoriteId));
      toast({ title: "Removed from favorites" });
    } catch (error: any) {
      toast({ title: "Error removing favorite", description: error.message, variant: "destructive" });
    }
  };

  const saveNotes = async (favoriteId: string) => {
    toast({ title: "Notes saved", description: "Your notes have been saved" });
    setNotesDialog(null);
    setNotes("");
  };

  const toggleCompareSelection = (favoriteId: string) => {
    if (selectedForCompare.includes(favoriteId)) {
      setSelectedForCompare(selectedForCompare.filter(id => id !== favoriteId));
    } else if (selectedForCompare.length < 3) {
      setSelectedForCompare([...selectedForCompare, favoriteId]);
    } else {
      toast({ title: "Maximum reached", description: "You can compare up to 3 vendors at a time", variant: "destructive" });
    }
  };

  const getComparisonVendors = () => favorites.filter(f => selectedForCompare.includes(f.id)).map(f => f.vendor);

  const exportToPDF = () => {
    const text = favorites.map(f => `${f.vendor.business_name} (${f.vendor.category})\nRating: ${f.vendor.average_rating}\nDescription: ${f.vendor.description}\n\n`).join('---\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'my-favorite-vendors.txt'; a.click();
    toast({ title: "Favorites exported", description: "Your favorites list has been downloaded" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MobilePageHeader title="My Favorites" />
      
      <main className={isMobile ? "flex-1 px-4 py-4 pb-24" : "flex-1 container mx-auto px-4 py-8 pt-24"}>
        <div className={isMobile ? "" : "max-w-6xl mx-auto"}>
          {!isMobile && (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold">My Favorites</h1>
                <p className="text-sm text-muted-foreground mt-1">Your saved vendors collection</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCompareMode(!compareMode)} className={`rounded-full border-border/50 ${compareMode ? "bg-primary text-primary-foreground" : ""}`}>
                  <Scale className="h-4 w-4 mr-2" /> {compareMode ? "Exit Compare" : "Compare"}
                </Button>
                {selectedForCompare.length > 0 && (
                  <Button onClick={() => setComparisonOpen(true)} className="rounded-full">Compare ({selectedForCompare.length})</Button>
                )}
                {favorites.length > 0 && (
                  <Button variant="outline" onClick={exportToPDF} className="rounded-full border-border/50">
                    <Download className="h-4 w-4 mr-2" /> Export
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Mobile action bar */}
          {isMobile && favorites.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
              <Button variant="outline" size="sm" onClick={() => setCompareMode(!compareMode)} className={`rounded-full border-border/50 shrink-0 ${compareMode ? "bg-primary text-primary-foreground" : ""}`}>
                <Scale className="h-3.5 w-3.5 mr-1.5" /> {compareMode ? "Exit" : "Compare"}
              </Button>
              {selectedForCompare.length > 0 && (
                <Button size="sm" onClick={() => setComparisonOpen(true)} className="rounded-full shrink-0">Compare ({selectedForCompare.length})</Button>
              )}
              <Button variant="outline" size="sm" onClick={exportToPDF} className="rounded-full border-border/50 shrink-0">
                <Download className="h-3.5 w-3.5 mr-1.5" /> Export
              </Button>
            </div>
          )}

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-52 w-full rounded-2xl" />)}
            </div>
          ) : favorites.length === 0 ? (
            <EmptyState icon={Heart} title="No Favorites Yet" description="Start adding vendors to your favorites list to easily compare them and make the perfect choice for your wedding." actionText="Browse Vendors" actionLink="/search" />
          ) : (
            <div className={isMobile ? "space-y-3" : "grid md:grid-cols-2 lg:grid-cols-3 gap-4"}>
              {favorites.map((favorite) => (
                <Card 
                  key={favorite.id} 
                  className={`rounded-2xl border transition-all ${
                    compareMode && selectedForCompare.includes(favorite.id) 
                      ? "ring-2 ring-primary border-primary/50" 
                      : "border-border/50 hover:border-primary/30 hover:shadow-md"
                  }`}
                >
                  <CardHeader className="pb-2 p-4">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base line-clamp-1">{favorite.vendor.business_name}</CardTitle>
                        <Badge variant="outline" className="mt-1.5 text-xs capitalize">{favorite.vendor.category}</Badge>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {compareMode && (
                          <Button variant={selectedForCompare.includes(favorite.id) ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => toggleCompareSelection(favorite.id)}>
                            <Scale className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFavorite(favorite.id)}>
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{favorite.vendor.description || "Professional wedding vendor"}</p>
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                      <span className="font-semibold text-sm">{favorite.vendor.average_rating?.toFixed(1) || "New"}</span>
                      <span className="text-xs text-muted-foreground">({favorite.vendor.total_reviews || 0})</span>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={notesDialog === favorite.id} onOpenChange={(open) => !open && setNotesDialog(null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1 rounded-full border-border/50 text-xs" onClick={() => setNotesDialog(favorite.id)}>
                            <StickyNote className="h-3.5 w-3.5 mr-1.5" /> Notes
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Notes for {favorite.vendor.business_name}</DialogTitle>
                            <DialogDescription>Add personal notes about this vendor</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div><Label>Your Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add your thoughts..." rows={5} /></div>
                            <Button onClick={() => saveNotes(favorite.id)} className="w-full rounded-full">Save Notes</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" className="flex-1 rounded-full text-xs" onClick={() => navigate(`/vendors/${favorite.vendor.id}`)}>View Profile</Button>
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
          if (favorite) toggleCompareSelection(favorite.id);
        }}
      />
    </div>
  );
}
