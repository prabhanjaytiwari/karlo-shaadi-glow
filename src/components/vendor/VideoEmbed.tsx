import { useState } from "react";
import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface VideoEmbedProps {
  videoUrl: string;
  title?: string;
  thumbnail?: string;
}

export function VideoEmbed({ videoUrl, title, thumbnail }: VideoEmbedProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Extract video ID and determine platform
  const getEmbedUrl = (url: string): { embedUrl: string; platform: string } | null => {
    // YouTube
    const youtubeMatch = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    if (youtubeMatch) {
      return {
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`,
        platform: "YouTube"
      };
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) {
      return {
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
        platform: "Vimeo"
      };
    }

    return null;
  };

  const embedData = getEmbedUrl(videoUrl);
  
  if (!embedData) {
    return null;
  }

  // Generate thumbnail for YouTube if not provided
  const getThumbnail = () => {
    if (thumbnail) return thumbnail;
    
    const youtubeMatch = videoUrl.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
    }
    
    return "/placeholder.svg";
  };

  return (
    <>
      <div 
        className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
        onClick={() => setIsOpen(true)}
      >
        <img 
          src={getThumbnail()} 
          alt={title || "Video thumbnail"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity group-hover:bg-black/40">
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
            <Play className="h-8 w-8 text-accent ml-1" fill="currentColor" />
          </div>
        </div>
        {title && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
            <p className="text-white text-sm font-medium truncate">{title}</p>
          </div>
        )}
        <span className="absolute top-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded">
          {embedData.platform}
        </span>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="aspect-video w-full">
            <iframe
              src={embedData.embedUrl}
              title={title || "Video player"}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
