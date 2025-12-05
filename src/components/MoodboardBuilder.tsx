import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Image as ImageIcon, 
  Palette, 
  StickyNote, 
  Share2, 
  Trash2, 
  Globe, 
  Lock,
  Copy,
  Check,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MoodboardItem {
  id: string;
  item_type: "image" | "color" | "note";
  content: string;
  title?: string;
}

interface Moodboard {
  id: string;
  title: string;
  description?: string;
  cover_color: string;
  is_public: boolean;
  share_token: string;
  items?: MoodboardItem[];
}

interface MoodboardBuilderProps {
  moodboard: Moodboard;
  onUpdate: () => void;
}

const PRESET_COLORS = [
  "#D4A574", "#E8B4B8", "#A7C7E7", "#B8D4B8", "#DDA0DD",
  "#F5DEB3", "#FFB6C1", "#98D8C8", "#F0E68C", "#E6E6FA",
  "#FFDAB9", "#C9A0DC", "#87CEEB", "#F08080", "#90EE90"
];

export const MoodboardBuilder = ({ moodboard, onUpdate }: MoodboardBuilderProps) => {
  const { toast } = useToast();
  const [items, setItems] = useState<MoodboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addType, setAddType] = useState<"image" | "color" | "note">("image");
  const [newContent, setNewContent] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [moodboard.id]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("moodboard_items")
        .select("*")
        .eq("moodboard_id", moodboard.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setItems((data || []).map((item: any) => ({
        ...item,
        item_type: item.item_type as "image" | "color" | "note"
      })));
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!newContent.trim()) return;

    try {
      const { error } = await supabase
        .from("moodboard_items")
        .insert({
          moodboard_id: moodboard.id,
          item_type: addType,
          content: newContent,
          title: newTitle || null
        });

      if (error) throw error;

      toast({ title: "Item added to moodboard!" });
      setNewContent("");
      setNewTitle("");
      setAddDialogOpen(false);
      fetchItems();
      onUpdate();
    } catch (error: any) {
      toast({ title: "Error adding item", description: error.message, variant: "destructive" });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("moodboard_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      setItems(items.filter(i => i.id !== itemId));
      toast({ title: "Item removed" });
    } catch (error: any) {
      toast({ title: "Error removing item", description: error.message, variant: "destructive" });
    }
  };

  const togglePublic = async () => {
    try {
      const { error } = await supabase
        .from("moodboards")
        .update({ is_public: !moodboard.is_public })
        .eq("id", moodboard.id);

      if (error) throw error;
      toast({ 
        title: moodboard.is_public ? "Moodboard is now private" : "Moodboard is now public",
        description: !moodboard.is_public ? "Anyone with the link can view it" : undefined
      });
      onUpdate();
    } catch (error: any) {
      toast({ title: "Error updating visibility", description: error.message, variant: "destructive" });
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/moodboard/${moodboard.share_token}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Link copied to clipboard!" });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Badge variant={moodboard.is_public ? "default" : "secondary"} className="gap-1">
            {moodboard.is_public ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
            {moodboard.is_public ? "Public" : "Private"}
          </Badge>
          <Button variant="outline" size="sm" onClick={togglePublic}>
            Make {moodboard.is_public ? "Private" : "Public"}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyShareLink}>
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>

      {/* Add Item Buttons */}
      <div className="flex flex-wrap gap-2">
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => { setAddType("image"); setAddDialogOpen(true); }}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => { setAddType("color"); setAddDialogOpen(true); }}>
              <Palette className="h-4 w-4 mr-2" />
              Add Color
            </Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => { setAddType("note"); setAddDialogOpen(true); }}>
              <StickyNote className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Add {addType === "image" ? "Image" : addType === "color" ? "Color" : "Note"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {addType === "image" && (
                <>
                  <Input
                    placeholder="Image URL (paste from Pinterest, Unsplash, etc.)"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                  />
                  <Input
                    placeholder="Caption (optional)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </>
              )}
              
              {addType === "color" && (
                <>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          newContent === color ? "border-primary scale-110" : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewContent(color)}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={newContent || "#D4A574"}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      placeholder="Or enter hex code"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <Input
                    placeholder="Color name (optional)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </>
              )}
              
              {addType === "note" && (
                <>
                  <Input
                    placeholder="Note title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Your note..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={4}
                  />
                </>
              )}

              <Button onClick={addItem} className="w-full" disabled={!newContent.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add to Moodboard
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Moodboard Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="py-16 text-center">
          <CardContent>
            <Palette className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start Building Your Moodboard</h3>
            <p className="text-muted-foreground mb-4">
              Add images, colors, and notes to create your perfect wedding vision
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative">
              {item.item_type === "image" && (
                <div className="aspect-square rounded-xl overflow-hidden border-2 border-border hover:border-primary/50 transition-all">
                  <img 
                    src={item.content} 
                    alt={item.title || "Inspiration"} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519741497674-611481863552?w=400";
                    }}
                  />
                  {item.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-white text-sm truncate">{item.title}</p>
                    </div>
                  )}
                </div>
              )}
              
              {item.item_type === "color" && (
                <div 
                  className="aspect-square rounded-xl border-2 border-border hover:border-primary/50 transition-all flex flex-col items-center justify-center"
                  style={{ backgroundColor: item.content }}
                >
                  <span className="text-white text-sm font-medium drop-shadow-lg px-2 text-center">
                    {item.title || item.content}
                  </span>
                </div>
              )}
              
              {item.item_type === "note" && (
                <div className="aspect-square rounded-xl border-2 border-border hover:border-primary/50 transition-all bg-yellow-50 dark:bg-yellow-900/20 p-4 flex flex-col">
                  {item.title && (
                    <h4 className="font-semibold text-sm mb-2 truncate">{item.title}</h4>
                  )}
                  <p className="text-sm text-muted-foreground flex-1 overflow-hidden line-clamp-6">
                    {item.content}
                  </p>
                </div>
              )}

              {/* Delete Button */}
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
