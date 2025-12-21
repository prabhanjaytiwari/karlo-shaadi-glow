import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Music, Play, Pause, Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface SavedSong {
  id: string;
  title: string;
  audio_url: string;
  category: string;
  created_at: string;
  duration: number;
}

interface DashboardMusicSectionProps {
  userId: string;
}

export function DashboardMusicSection({ userId }: DashboardMusicSectionProps) {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<SavedSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadSongs();
  }, [userId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateProgress = () => {
        if (audio.duration) {
          setAudioProgress((audio.currentTime / audio.duration) * 100);
        }
      };
      const handleEnded = () => {
        setIsPlaying(false);
        setAudioProgress(0);
      };
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('ended', handleEnded);
      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentlyPlaying]);

  const loadSongs = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_songs')
        .select('id, title, audio_url, category, created_at, duration')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      setSongs(data || []);
    } catch (error) {
      console.error('Error loading songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async (song: SavedSong) => {
    if (currentlyPlaying === song.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = song.audio_url;
        await audioRef.current.play();
      }
      setCurrentlyPlaying(song.id);
      setIsPlaying(true);
    }
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      couples: "💕",
      "shaadi-joda": "👑",
      family: "👨‍👩‍👧‍👦",
      "didi-jiju": "🎁",
      sangeet: "🎉",
      mehendi: "✨",
      reception: "🎂",
      invitation: "💌"
    };
    return emojis[category] || "🎵";
  };

  if (loading) {
    return (
      <Card className="bg-white/90 border-2 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            My Music
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 border-2 border-accent/20">
      <audio ref={audioRef} />
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-pink-200/50 flex items-center justify-center">
            <Music className="h-4 w-4 text-primary" />
          </div>
          My Music
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/music-generator")}
          className="border-primary/30 hover:border-primary/50"
        >
          <Plus className="h-4 w-4 mr-1" />
          Create Song
        </Button>
      </CardHeader>
      <CardContent>
        {songs.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center">
              <Music className="h-8 w-8 text-primary/50" />
            </div>
            <p className="text-muted-foreground mb-4">No songs created yet</p>
            <Button 
              onClick={() => navigate("/music-generator")}
              className="bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
            >
              Create Your First Song
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {songs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  currentlyPlaying === song.id 
                    ? "bg-primary/10 border border-primary/20" 
                    : "bg-muted/30 hover:bg-muted/50"
                }`}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 shrink-0 rounded-full bg-primary/10 hover:bg-primary/20"
                  onClick={() => handlePlay(song)}
                >
                  {currentlyPlaying === song.id && isPlaying ? (
                    <Pause className="h-4 w-4 text-primary" />
                  ) : (
                    <Play className="h-4 w-4 text-primary ml-0.5" />
                  )}
                </Button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryEmoji(song.category)}</span>
                    <p className="font-medium text-sm truncate">{song.title}</p>
                  </div>
                  {currentlyPlaying === song.id && (
                    <Progress value={audioProgress} className="h-1 mt-1" />
                  )}
                </div>
              </motion.div>
            ))}
            
            {songs.length > 0 && (
              <Button 
                variant="ghost" 
                className="w-full mt-2 text-primary hover:text-primary/80"
                onClick={() => navigate("/music-generator")}
              >
                View All Songs →
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
