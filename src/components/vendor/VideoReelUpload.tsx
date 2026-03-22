import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VideoEmbed } from "@/components/vendor/VideoEmbed";
import { Loader2, Plus, Trash2, Film, Link2, Play } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface VideoReelUploadProps {
  vendorId: string;
  portfolio: any[];
  onSuccess: () => void;
}

export function VideoReelUpload({ vendorId, portfolio, onSuccess }: VideoReelUploadProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");

  const videoItems = portfolio.filter(item => item.video_url);

  const handleAddVideo = async () => {
    if (!videoUrl.trim()) {
      toast({ title: "Please enter a video URL", variant: "destructive" });
      return;
    }

    // Validate URL is YouTube or Vimeo
    const isYouTube = /(?:youtube\.com|youtu\.be)/.test(videoUrl);
    const isVimeo = /vimeo\.com/.test(videoUrl);
    const isInstagramReel = /instagram\.com\/reel/.test(videoUrl);

    if (!isYouTube && !isVimeo && !isInstagramReel) {
      toast({ 
        title: "Unsupported video platform", 
        description: "Please use YouTube, Vimeo, or Instagram Reel links",
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("vendor_portfolio")
        .insert({
          vendor_id: vendorId,
          video_url: videoUrl.trim(),
          title: title.trim() || "Video Reel",
          image_url: "/placeholder.svg", // Required field, will show video embed instead
          display_order: portfolio.length,
        });

      if (error) throw error;

      toast({ title: "Video reel added!", description: "Your video is now visible on your profile" });
      setVideoUrl("");
      setTitle("");
      setDialogOpen(false);
      onSuccess();
    } catch (error: any) {
      toast({ title: "Error adding video", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (itemId: string) => {
    const { error } = await supabase
      .from("vendor_portfolio")
      .delete()
      .eq("id", itemId);

    if (!error) {
      toast({ title: "Video removed" });
      onSuccess();
    }
  };

  return (
    <Card className="border-dashed border-accent/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Film className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-base">Video Reels</CardTitle>
              <CardDescription className="text-xs">
                Showcase 30-second reels from YouTube, Vimeo, or Instagram
              </CardDescription>
            </div>
          </div>
          <Button size="sm" onClick={() => setDialogOpen(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Reel
          </Button>
        </div>
      </CardHeader>

      {videoItems.length > 0 && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoItems.map((item) => (
              <div key={item.id} className="relative group">
                <VideoEmbed
                  videoUrl={item.video_url}
                  title={item.title}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={() => deleteVideo(item.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      )}

      {videoItems.length === 0 && (
        <CardContent className="pt-0">
          <div className="text-center py-8 text-muted-foreground">
            <Play className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No video reels yet</p>
            <p className="text-xs mt-1">Add your best 30-second wedding reels to stand out</p>
          </div>
        </CardContent>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Film className="h-5 w-5 text-accent" />
              Add Video Reel
            </DialogTitle>
            <DialogDescription>
              Paste a YouTube, Vimeo, or Instagram Reel link
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Video URL</Label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Title (optional)</Label>
              <Input
                placeholder="e.g., Sharma Wedding Highlights"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <Button onClick={handleAddVideo} disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Video Reel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
