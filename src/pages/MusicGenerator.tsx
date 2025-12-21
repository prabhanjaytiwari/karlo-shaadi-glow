import { useState, useRef } from "react";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Music, 
  Play, 
  Pause, 
  Download, 
  Share2, 
  Sparkles,
  Heart,
  Users,
  Gift,
  Crown,
  PartyPopper,
  Cake,
  Loader2,
  Volume2,
  SkipBack,
  SkipForward,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MusicCategory {
  id: string;
  name: string;
  nameHindi: string;
  icon: React.ElementType;
  description: string;
  prompts: string[];
  color: string;
}

interface GeneratedTrack {
  id: string;
  title: string;
  audio_url: string;
  duration: number;
  prompt: string;
  category: string;
  created_at: string;
}

const musicCategories: MusicCategory[] = [
  {
    id: "couples",
    name: "Couple's Song",
    nameHindi: "जोड़ी का गाना",
    icon: Heart,
    description: "Romantic songs for the bride and groom",
    prompts: [
      "Romantic Bollywood wedding song for couple's first dance",
      "Love ballad celebrating eternal bond of marriage",
      "Sweet romantic melody for bride and groom entry"
    ],
    color: "from-pink-500 to-rose-600"
  },
  {
    id: "shaadi-joda",
    name: "Shaadi Ka Joda",
    nameHindi: "शादी का जोड़ा",
    icon: Crown,
    description: "Grand entry songs for the wedding couple",
    prompts: [
      "Grand Bollywood style couple entry with dhol beats",
      "Royal rajasthani wedding procession music",
      "Majestic entry song for dulha dulhan"
    ],
    color: "from-amber-500 to-orange-600"
  },
  {
    id: "family",
    name: "Wedding Family",
    nameHindi: "परिवार के लिए",
    icon: Users,
    description: "Emotional songs for family moments",
    prompts: [
      "Emotional bidaai song for daughter's wedding",
      "Heartfelt family celebration song",
      "Parents blessing song for wedding ceremony"
    ],
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: "didi-jiju",
    name: "Didi Jiju",
    nameHindi: "दीदी जीजू",
    icon: Gift,
    description: "Fun songs for sister and brother-in-law",
    prompts: [
      "Playful teasing song for sister's wedding",
      "Fun Bollywood song for didi jiju dance",
      "Cheerful celebration for sister's new journey"
    ],
    color: "from-purple-500 to-violet-600"
  },
  {
    id: "sangeet",
    name: "Sangeet Night",
    nameHindi: "संगीत रात",
    icon: PartyPopper,
    description: "Energetic songs for sangeet performances",
    prompts: [
      "High energy Bollywood dance number for sangeet",
      "Peppy wedding sangeet performance song",
      "Groovy party song for sangeet night"
    ],
    color: "from-green-500 to-emerald-600"
  },
  {
    id: "mehendi",
    name: "Mehendi Ceremony",
    nameHindi: "मेहंदी",
    icon: Sparkles,
    description: "Festive songs for mehendi celebrations",
    prompts: [
      "Traditional mehendi ceremony song with folk beats",
      "Colorful rajasthani mehendi celebration music",
      "Festive mehendi song for bride and friends"
    ],
    color: "from-yellow-500 to-amber-600"
  },
  {
    id: "reception",
    name: "Reception Party",
    nameHindi: "रिसेप्शन",
    icon: Cake,
    description: "Elegant songs for reception events",
    prompts: [
      "Elegant reception entry song for couple",
      "Sophisticated wedding reception background music",
      "Classy cocktail party music for wedding reception"
    ],
    color: "from-teal-500 to-cyan-600"
  },
  {
    id: "invitation",
    name: "Wedding Invite",
    nameHindi: "शादी का निमंत्रण",
    icon: Music,
    description: "Beautiful background music for invitations",
    prompts: [
      "Soft instrumental for wedding invitation video",
      "Beautiful shehnai melody for digital invite",
      "Elegant background music for wedding card"
    ],
    color: "from-red-500 to-pink-600"
  }
];

const musicStyles = [
  "Bollywood Wedding",
  "Classical Fusion",
  "Rajasthani Folk",
  "Punjabi Bhangra",
  "Sufi Romantic",
  "Modern Pop",
  "Instrumental",
  "Ghazal Style"
];

export default function MusicGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<MusicCategory | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Bollywood Wedding");
  const [isInstrumental, setIsInstrumental] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<GeneratedTrack[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleCategorySelect = (category: MusicCategory) => {
    setSelectedCategory(category);
    // Set a random prompt from the category
    const randomPrompt = category.prompts[Math.floor(Math.random() * category.prompts.length)];
    setCustomPrompt(randomPrompt);
  };

  const handleGenerate = async () => {
    if (!selectedCategory || !customPrompt.trim()) {
      toast.error("Please select a category and enter a description");
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-wedding-music', {
        body: {
          prompt: customPrompt,
          category: selectedCategory.id,
          style: selectedStyle,
          instrumental: isInstrumental
        }
      });

      if (error) throw error;

      if (data?.tracks) {
        setGeneratedTracks(prev => [...data.tracks, ...prev]);
        toast.success("🎵 Music generated successfully!");
      }
    } catch (error) {
      console.error('Error generating music:', error);
      toast.error("Failed to generate music. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlay = (track: GeneratedTrack) => {
    if (currentlyPlaying === track.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.audio_url;
        audioRef.current.play();
      }
      setCurrentlyPlaying(track.id);
      setIsPlaying(true);
    }
  };

  const handleDownload = async (track: GeneratedTrack) => {
    try {
      const response = await fetch(track.audio_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${track.title.replace(/\s+/g, '-')}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download. Please try again.");
    }
  };

  const handleShare = async (track: GeneratedTrack) => {
    const shareText = `🎵 Check out this wedding music I created on Karlo Shaadi!\n\n${track.title}\n\nCreate your own wedding music: ${window.location.href}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: track.title,
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      // Fallback to WhatsApp share
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <BhindiHeader />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Music className="h-5 w-5" />
            <span className="font-medium">AI Wedding Music Generator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Create Your Perfect{" "}
            <span className="bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
              Wedding Music
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate personalized music for every wedding moment - from couple's entry to bidaai. 
            Listen, download, and share your unique wedding soundtrack!
          </p>
        </motion.div>

        {/* Hidden Audio Element */}
        <audio 
          ref={audioRef} 
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />

        {/* Category Selection */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
            Choose Your Wedding Moment
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {musicCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedCategory?.id === category.id 
                      ? 'ring-2 ring-primary shadow-lg scale-105' 
                      : 'hover:scale-102'
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{category.name}</h3>
                    <p className="text-xs text-primary font-medium">{category.nameHindi}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{category.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Generation Form */}
        <AnimatePresence>
          {selectedCategory && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12"
            >
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-pink-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <selectedCategory.icon className="h-6 w-6 text-primary" />
                    Customize Your {selectedCategory.name} Music
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Prompt Suggestions */}
                  <div>
                    <Label className="mb-2 block">Quick Prompts</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory.prompts.map((prompt, index) => (
                        <Badge 
                          key={index}
                          variant={customPrompt === prompt ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => setCustomPrompt(prompt)}
                        >
                          {prompt}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Custom Description */}
                  <div>
                    <Label htmlFor="customPrompt">Describe Your Music</Label>
                    <Textarea
                      id="customPrompt"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Describe the mood, style, and feeling you want in your music..."
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  {/* Style Selection */}
                  <div>
                    <Label className="mb-2 block">Music Style</Label>
                    <div className="flex flex-wrap gap-2">
                      {musicStyles.map((style) => (
                        <Badge 
                          key={style}
                          variant={selectedStyle === style ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => setSelectedStyle(style)}
                        >
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Instrumental Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="instrumental">Instrumental Only</Label>
                      <p className="text-sm text-muted-foreground">Generate music without vocals</p>
                    </div>
                    <Switch
                      id="instrumental"
                      checked={isInstrumental}
                      onCheckedChange={setIsInstrumental}
                    />
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !customPrompt.trim()}
                    className="w-full bg-gradient-to-r from-primary to-pink-600 hover:from-primary/90 hover:to-pink-600/90"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Generating Your Music...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Generate Wedding Music
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Generated Tracks */}
        {generatedTracks.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Your Generated Music
              </h2>
              <Badge variant="secondary" className="text-sm">
                {generatedTracks.length} Track{generatedTracks.length > 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="grid gap-4">
              {generatedTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Play Button & Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-14 w-14 rounded-full shrink-0 bg-gradient-to-br from-primary to-pink-600 text-white border-0 hover:opacity-90"
                            onClick={() => handlePlay(track)}
                          >
                            {currentlyPlaying === track.id && isPlaying ? (
                              <Pause className="h-6 w-6" />
                            ) : (
                              <Play className="h-6 w-6 ml-1" />
                            )}
                          </Button>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">{track.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">{track.prompt}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {track.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {track.duration}s
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Audio Visualizer (Placeholder) */}
                        {currentlyPlaying === track.id && isPlaying && (
                          <div className="flex items-center gap-1 px-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <motion.div
                                key={i}
                                className="w-1 bg-primary rounded-full"
                                animate={{
                                  height: [10, 30, 15, 25, 10],
                                }}
                                transition={{
                                  duration: 0.5,
                                  repeat: Infinity,
                                  delay: i * 0.1,
                                }}
                              />
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDownload(track)}
                            title="Download"
                          >
                            <Download className="h-5 w-5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleShare(track)}
                            title="Share"
                          >
                            <Share2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Empty State */}
        {generatedTracks.length === 0 && !selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Music className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Start Creating Your Wedding Music
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Select a category above to begin generating personalized music for your special moments
            </p>
          </motion.div>
        )}
      </main>

      <BhindiFooter />
    </div>
  );
}
