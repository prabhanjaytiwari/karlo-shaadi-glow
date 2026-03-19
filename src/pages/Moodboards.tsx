import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Palette, 
  Globe, 
  Lock, 
  Trash2, 
  Eye,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MoodboardBuilder } from "@/components/MoodboardBuilder";
import { SEO } from "@/components/SEO";

interface Moodboard {
  id: string;
  title: string;
  description?: string;
  cover_color: string;
  is_public: boolean;
  share_token: string;
  created_at: string;
  item_count?: number;
}

const Moodboards = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [moodboards, setMoodboards] = useState<Moodboard[]>([]);
  const [selectedMoodboard, setSelectedMoodboard] = useState<Moodboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newColor, setNewColor] = useState("#D4A574");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    fetchMoodboards(user.id);
  };

  const fetchMoodboards = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("moodboards")
        .select(`
          *,
          moodboard_items (id)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const boardsWithCount = (data || []).map((board: any) => ({
        ...board,
        item_count: board.moodboard_items?.length || 0,
        moodboard_items: undefined
      }));

      setMoodboards(boardsWithCount);
    } catch (err) {
      console.error("Failed to load moodboards:", err);
    } finally {
      setLoading(false);
    }
  };

  const createMoodboard = async () => {
    if (!newTitle.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from("moodboards")
        .insert({
          user_id: user.id,
          title: newTitle,
          description: newDescription || null,
          cover_color: newColor
        })
        .select()
        .single();

      if (error) throw error;

      toast({ title: "Moodboard created!" });
      setNewTitle("");
      setNewDescription("");
      setNewColor("#D4A574");
      setCreateDialogOpen(false);
      fetchMoodboards(user.id);
    } catch (error: any) {
      toast({ title: "Error creating moodboard", description: error.message, variant: "destructive" });
    }
  };

  const deleteMoodboard = async (id: string) => {
    if (!confirm("Are you sure you want to delete this moodboard?")) return;

    try {
      const { error } = await supabase
        .from("moodboards")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Moodboard deleted" });
      setMoodboards(moodboards.filter(m => m.id !== id));
      if (selectedMoodboard?.id === id) {
        setSelectedMoodboard(null);
      }
    } catch (error: any) {
      toast({ title: "Error deleting moodboard", description: error.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Wedding Moodboards - Karlo Shaadi"
        description="Create beautiful moodboards for your wedding. Save inspiration images, color palettes, and notes. Share your vision with vendors."
      />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <Palette className="h-8 w-8 text-primary" />
                Wedding Moodboards
              </h1>
              <p className="text-muted-foreground">
                Create and share your wedding vision
              </p>
            </div>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="premium">
                  <Plus className="h-4 w-4 mr-2" />
                  New Moodboard
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Moodboard</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Moodboard title (e.g., 'Rustic Garden Theme')"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={3}
                  />
                  <div>
                    <label className="text-sm font-medium mb-2 block">Cover Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer border border-border"
                      />
                      <Input
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <Button onClick={createMoodboard} className="w-full" disabled={!newTitle.trim()}>
                    Create Moodboard
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {selectedMoodboard ? (
            /* Moodboard Builder View */
            <div className="space-y-6">
              <Button variant="outline" onClick={() => setSelectedMoodboard(null)}>
                ← Back to All Moodboards
              </Button>
              
              <div 
                className="p-6 rounded-2xl"
                style={{ backgroundColor: `${selectedMoodboard.cover_color}20` }}
              >
                <h2 className="text-2xl font-bold mb-2">{selectedMoodboard.title}</h2>
                {selectedMoodboard.description && (
                  <p className="text-muted-foreground">{selectedMoodboard.description}</p>
                )}
              </div>

              <MoodboardBuilder 
                moodboard={selectedMoodboard} 
                onUpdate={() => fetchMoodboards(user.id)}
              />
            </div>
          ) : (
            /* Moodboards List */
            <>
              {moodboards.length === 0 ? (
                <Card className="py-16 text-center">
                  <CardContent>
                    <Sparkles className="h-16 w-16 mx-auto text-primary/30 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Create Your First Moodboard</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Moodboards help you visualize your dream wedding. Save inspiration images, 
                      color palettes, and notes to share with vendors.
                    </p>
                    <Button variant="premium" onClick={() => setCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Moodboard
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {moodboards.map((board) => (
                    <Card 
                      key={board.id} 
                      className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedMoodboard(board)}
                    >
                      {/* Cover */}
                      <div 
                        className="h-32 relative"
                        style={{ backgroundColor: board.cover_color }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Badge variant="secondary" className="bg-white/90 text-foreground">
                            {board.is_public ? <Globe className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                            {board.is_public ? "Public" : "Private"}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <h3 className="text-white font-bold text-lg drop-shadow-lg">{board.title}</h3>
                        </div>
                      </div>

                      <CardContent className="pt-4">
                        {board.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {board.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {board.item_count || 0} items
                          </span>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMoodboard(board);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteMoodboard(board.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      
    </div>
  );
};

export default Moodboards;
