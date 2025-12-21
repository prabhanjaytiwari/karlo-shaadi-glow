import { useState, useRef, useEffect } from "react";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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
  RefreshCw,
  Mic2,
  FileText,
  Wand2,
  Music2,
  Music4,
  HeartHandshake,
  Send,
  ChevronDown,
  ChevronUp,
  Save,
  Trash2,
  Library
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MusicCategory {
  id: string;
  name: string;
  nameHindi: string;
  icon: React.ElementType;
  description: string;
  defaultPrompt: string;
  color: string;
  gradient: string;
}

interface GeneratedTrack {
  id: string;
  title: string;
  audio_url: string;
  duration: number;
  prompt: string;
  lyrics?: string;
  category: string;
  names?: {
    bride?: string;
    groom?: string;
    family?: string;
  };
  created_at: string;
}

const musicCategories: MusicCategory[] = [
  {
    id: "couples",
    name: "Couple's Love Song",
    nameHindi: "जोड़ी का प्यार गाना",
    icon: Heart,
    description: "Romantic personalized song with bride & groom names",
    defaultPrompt: "A romantic Bollywood wedding love song celebrating the eternal bond of marriage",
    color: "text-pink-500",
    gradient: "from-pink-500 to-rose-600"
  },
  {
    id: "shaadi-joda",
    name: "Grand Entry Song",
    nameHindi: "शादी का जोड़ा",
    icon: Crown,
    description: "Majestic couple entry with personalized lyrics",
    defaultPrompt: "Grand Bollywood style couple entry song with dhol beats and shehnai",
    color: "text-amber-500",
    gradient: "from-amber-500 to-orange-600"
  },
  {
    id: "family",
    name: "Family Celebration",
    nameHindi: "परिवार का गाना",
    icon: Users,
    description: "Emotional family song with your family name",
    defaultPrompt: "Emotional Indian wedding family celebration song with heartfelt vocals",
    color: "text-blue-500",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    id: "didi-jiju",
    name: "Didi Jiju Special",
    nameHindi: "दीदी जीजू",
    icon: Gift,
    description: "Fun song for sister's wedding",
    defaultPrompt: "Playful Bollywood song for sister and brother-in-law wedding celebration",
    color: "text-purple-500",
    gradient: "from-purple-500 to-violet-600"
  },
  {
    id: "sangeet",
    name: "Sangeet Dance",
    nameHindi: "संगीत नाइट",
    icon: PartyPopper,
    description: "High-energy dance number for performances",
    defaultPrompt: "High energy Bollywood dance number for sangeet night performance",
    color: "text-green-500",
    gradient: "from-green-500 to-emerald-600"
  },
  {
    id: "mehendi",
    name: "Mehendi Celebration",
    nameHindi: "मेहंदी",
    icon: Sparkles,
    description: "Festive mehendi ceremony song",
    defaultPrompt: "Traditional mehendi ceremony song with folk beats and festive vibes",
    color: "text-yellow-500",
    gradient: "from-yellow-500 to-amber-600"
  },
  {
    id: "reception",
    name: "Reception Party",
    nameHindi: "रिसेप्शन",
    icon: Cake,
    description: "Elegant cocktail party music",
    defaultPrompt: "Elegant wedding reception song with sophisticated vibes",
    color: "text-teal-500",
    gradient: "from-teal-500 to-cyan-600"
  },
  {
    id: "invitation",
    name: "Invite Music",
    nameHindi: "निमंत्रण संगीत",
    icon: Send,
    description: "Beautiful instrumental for wedding invites",
    defaultPrompt: "Soft beautiful instrumental for wedding invitation video",
    color: "text-red-500",
    gradient: "from-red-500 to-pink-600"
  }
];

const musicStyles = [
  { id: "bollywood", name: "Bollywood Wedding", emoji: "🎬" },
  { id: "classical", name: "Classical Fusion", emoji: "🎻" },
  { id: "rajasthani", name: "Rajasthani Folk", emoji: "🏜️" },
  { id: "punjabi", name: "Punjabi Bhangra", emoji: "💪" },
  { id: "sufi", name: "Sufi Romantic", emoji: "💫" },
  { id: "modern", name: "Modern Pop", emoji: "🎤" },
  { id: "ghazal", name: "Ghazal Style", emoji: "🌙" },
  { id: "edm", name: "Wedding EDM", emoji: "🎧" }
];

const generationSteps = [
  { id: 1, label: "Analyzing your preferences", emoji: "🎯" },
  { id: 2, label: "Writing personalized lyrics", emoji: "✍️" },
  { id: 3, label: "Composing melody", emoji: "🎼" },
  { id: 4, label: "Adding vocals & instruments", emoji: "🎤" },
  { id: 5, label: "Final mastering", emoji: "🎧" }
];

export default function MusicGenerator() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<MusicCategory | null>(null);
  const [activeTab, setActiveTab] = useState("quick");
  
  // Names for personalization
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [familyName, setFamilyName] = useState("");
  
  // Song customization
  const [customPrompt, setCustomPrompt] = useState("");
  const [customLyrics, setCustomLyrics] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("bollywood");
  const [isInstrumental, setIsInstrumental] = useState(false);
  
  // Lyrics preview state
  const [showLyricsPreview, setShowLyricsPreview] = useState(false);
  const [previewLyrics, setPreviewLyrics] = useState("");
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedTracks, setGeneratedTracks] = useState<GeneratedTrack[]>([]);
  const [savedSongs, setSavedSongs] = useState<GeneratedTrack[]>([]);
  const [expandedLyrics, setExpandedLyrics] = useState<string | null>(null);
  const [savingTrackId, setSavingTrackId] = useState<string | null>(null);
  
  // Audio playback
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load saved songs on mount
  useEffect(() => {
    if (user) {
      loadSavedSongs();
    }
  }, [user]);

  const loadSavedSongs = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('generated_songs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const tracks: GeneratedTrack[] = data.map((song: any) => ({
          id: song.id,
          title: song.title,
          audio_url: song.audio_url,
          duration: song.duration || 180,
          prompt: song.prompt || '',
          lyrics: song.lyrics,
          category: song.category,
          names: song.names as GeneratedTrack['names'],
          created_at: song.created_at,
        }));
        setSavedSongs(tracks);
      }
    } catch (error) {
      console.error('Error loading saved songs:', error);
    }
  };

  const saveSong = async (track: GeneratedTrack) => {
    if (!user) {
      toast.error("Please sign in to save songs");
      return;
    }

    setSavingTrackId(track.id);
    
    try {
      const { error } = await supabase
        .from('generated_songs')
        .insert({
          user_id: user.id,
          title: track.title,
          audio_url: track.audio_url,
          lyrics: track.lyrics,
          prompt: track.prompt,
          category: track.category,
          style: selectedStyle,
          duration: track.duration,
          names: track.names,
          suno_track_id: track.id,
        });

      if (error) throw error;
      
      toast.success("Song saved to your library!");
      loadSavedSongs();
    } catch (error) {
      console.error('Error saving song:', error);
      toast.error("Failed to save song");
    } finally {
      setSavingTrackId(null);
    }
  };

  const deleteSong = async (songId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('generated_songs')
        .delete()
        .eq('id', songId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setSavedSongs(prev => prev.filter(s => s.id !== songId));
      toast.success("Song removed from library");
    } catch (error) {
      console.error('Error deleting song:', error);
      toast.error("Failed to delete song");
    }
  };

  // Simulate progress during generation
  useEffect(() => {
    if (isGenerating) {
      const stepDuration = 100000 / generationSteps.length; // Total ~100 seconds max
      let currentStep = 0;
      let progress = 0;
      
      const interval = setInterval(() => {
        progress += 2;
        setGenerationProgress(Math.min(progress, 95));
        
        const newStep = Math.floor(progress / (100 / generationSteps.length));
        if (newStep !== currentStep && newStep < generationSteps.length) {
          currentStep = newStep;
          setGenerationStep(currentStep);
        }
      }, 2000);

      return () => clearInterval(interval);
    } else {
      setGenerationProgress(0);
      setGenerationStep(0);
    }
  }, [isGenerating]);

  // Audio progress tracking
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateProgress = () => {
        if (audio.duration) {
          setAudioProgress((audio.currentTime / audio.duration) * 100);
        }
      };
      audio.addEventListener('timeupdate', updateProgress);
      return () => audio.removeEventListener('timeupdate', updateProgress);
    }
  }, [currentlyPlaying]);

  const handleCategorySelect = (category: MusicCategory) => {
    setSelectedCategory(category);
    setCustomPrompt(category.defaultPrompt);
    setIsInstrumental(category.id === 'invitation');
    setShowLyricsPreview(false);
    setPreviewLyrics("");
  };

  // Generate lyrics preview for user to edit
  const generateLyricsPreview = async () => {
    if (!selectedCategory) {
      toast.error("Please select a song category first");
      return;
    }

    if (!brideName && !groomName && !familyName && activeTab === "quick") {
      toast.error("Please enter at least one name for personalization");
      return;
    }

    if (isInstrumental) {
      toast.info("Instrumental songs don't have lyrics");
      return;
    }

    setIsGeneratingLyrics(true);
    
    try {
      // Generate lyrics locally using the same logic as the edge function
      const lyrics = createPersonalizedLyricsLocal(selectedCategory.id, {
        bride: brideName,
        groom: groomName,
        family: familyName
      });
      
      setPreviewLyrics(lyrics);
      setShowLyricsPreview(true);
      toast.success("Lyrics generated! You can now edit them before creating your song.");
    } catch (error) {
      console.error('Error generating lyrics preview:', error);
      toast.error("Failed to generate lyrics preview");
    } finally {
      setIsGeneratingLyrics(false);
    }
  };

  // Local lyrics generation function (mirrors the edge function logic)
  const createPersonalizedLyricsLocal = (category: string, names: { bride?: string; groom?: string; family?: string }): string => {
    const bride = names?.bride || 'Dulhaniya';
    const groom = names?.groom || 'Raja';
    const family = names?.family || 'Parivaar';

    const lyricsTemplates: Record<string, string> = {
      'couples': `[Verse 1]
In the garden where our stories first began
${bride} met ${groom}, fate's perfect plan
Every heartbeat whispers only your name
Through the fire and the rain, we burn the same flame

[Pre-Chorus]
Tumse mili toh zindagi badal gayi
Har khwahish meri tujhse jaa mili
You're the answer to my silent prayer
The one I'll love beyond compare

[Chorus]
${bride} aur ${groom} - yeh ishq hai sachcha
Saaton janam ka vaada hai pakka
Chandni raat mein dil ye gaaye
Do dil ek raaste pe mil jaaye
Oh-oh, ${bride} aur ${groom}
Forever and always, forever and always

[Verse 2]
Hand in hand through seasons we'll dance
${groom} promised ${bride} a lifetime romance
From haldi to pheras, every ritual we share
Is a testament to love, beyond compare`,

      'shaadi-joda': `[Intro - Dhol Beat]
Balle balle! Shaadi hai aaj!

[Verse 1]
Sehra bandh ke aa gaya raja ${groom}
Ghodi pe sawaar, chamke jaisa sooraj
Dulhan ${bride} tayyar, sharmaaye nazrein jhuka
Mehendi waale haathon mein chhupa pyaar ka naksha

[Pre-Chorus]
Shehnai pe chad gayi khushiyon ki dhun
Band baaje bajenge har gali har nukkad mein
Rishtey naye banenge, duaayein milegi sabki
${groom} aur ${bride} ki jodi hai sabse sachchi

[Chorus]
Jodi kamaal ki - rab ne banayi
${groom} ke dil mein ${bride} samayi
Nachho gaao, khushiyan manao
Shaadi ka jashn hai, sab mil ke aao!
Ho-ho, jodi number one
Forever together, our journey's begun

[Bridge]
Phere saat, vaade saat
Janmo janmo ka hai yeh saath!`,

      'family': `[Verse 1]
${family} ke aangan mein mehfil saji hai
${bride} aur ${groom} ki khushiyon ki gadi aaji hai
Nani ki duaayein, dadi ka aashirwaad
Mummy papa ki aankhon mein sapno ki baaraat

[Pre-Chorus]
Bade bhaiya muskuraye, choti behen ne gaana gaaya
Chacha chachi ne dance kiya, ghar mein rang jamaya
Every cousin, every uncle, every maasi here tonight
${family} together, everything feels right

[Chorus]
Ghar mein aaj jashn hai, roshni hai har taraf
${family} ki aan baan shaan, pyaar hai beshumaar
${bride} ki bidaai mein, aankhein bhi muskuraayi
Kyunki ${groom} ke ghar mein nayi khushiyaan aayi
Parivaar parivaar, pyaara parivaar!

[Verse 2]
Rishtey nibhaane ki hai yeh khushi
${family} ke saath, zindagi lagti hai nayi
From generation to generation, love passes on
In ${family}'s embrace, forever we belong`,

      'didi-jiju': `[Verse 1]
Yaad hai wo din jab didi ne rakhi bandhi thi
Bhai behen ki woh mithi yaadein, sab yaad aati hain
Aaj ${bride} didi dulhan bani, ${groom} jiju le jaayenge
Par dil ke kone mein hamesha didi reh jaayengi

[Pre-Chorus]
Ladaai jhagde, manaana maafi
Didi ki daant, aur phir pyaar wali chai
Jiju ${groom} sunlo yeh baat, didi ki izzat rakhna
Warna bhai aa jayega, yeh waada hai pakka!

[Chorus]
Didi meri jaan, jiju mera yaar
${bride} didi, ${groom} jiju, sabse pyaara pair
Vidaai ki raat mein, aankhein bhi ro rahi
Par dil mein khushi hai, nayi zindagi jo basi
Didi-jiju, didi-jiju, always in my heart!

[Bridge]
Raksha bandhan ki woh yaadein
Aaj shaadi ki hai yeh duaayein
Didi aap khush raho, yahi meri farmaish
${groom} jiju, didi ki hamesha rakhna laaj`,

      'sangeet': `[Intro - Beat Drop]
Let's go! Sangeet night!

[Verse 1]
DJ drop that beat, floor's getting hot
${bride} ke moves dekho, sabko kar de shocked
${groom} bhi kuch kam nahi, breaking it down
Saari mehfil nachti hai, we're painting the town

[Pre-Chorus]
Aunties in the corner, trying to keep up
Uncles doing bhangra, they never stop
${family} together on the dance floor tonight
Sangeet ki raat hai, everything feels right

[Chorus]
Nachle nachle, saari raat nachle
${bride} aur ${groom} ke liye pawein thapakle
Dham dham dham, bajti hai dholki
Sangeet mein aaj, har khushi hai dolki
One more time! Nachle nachle!
Hands up high, let's celebrate!

[Verse 2]
From Bollywood moves to the trending reels
${family} ne milke, sabko kiya heal
Haseen raat hai yeh, music is loud
${bride} and ${groom} dancing, making everyone proud

[Outro]
This is how we party, Indian style
Sangeet night, making memories worthwhile!`,

      'mehendi': `[Verse 1]
Mehendi lagi ${bride} ke haathon mein
${groom} ka naam chhupa hai lakeeron mein
Haldi ki khushboo, hawa mein ghuli
Dulhan ki khushiyon ki kitab khuli

[Pre-Chorus]
Sakhi sab mili, geet sunaye
Nani ke nuske se mehendi lagaye
Rangeen ratein, sapno ki baatein
${bride} ki aankhon mein chamkein sitaarein

[Chorus]
Mehendi tere naam ki, rang gehra laaye
${groom} ki yaad mein, dil ye gaaye
Haathon mein likhi, prem ki kahaani
${bride} bani dulhan, sabse suhani
Mehendi mehendi, rang la mehendi!

[Verse 2]
Cone se likhe patterns, intricate and fine
Every swirl and every dot, a love that's divine
${groom} dhundhega naam, haathon mein ${bride} ke
Yeh rasmein pyaari, nibhaye sadiyon ke

[Bridge]
Jitni gehri mehendi, utna gehra pyaar
${bride} aur ${groom} ka, permanent ikraar!`,

      'reception': `[Verse 1]
Welcome everyone to the grandest night
${bride} and ${groom}, under crystal lights
Dressed to impress, they walk hand in hand
The most beautiful couple across the land

[Pre-Chorus]
Champagne flowing, music playing soft
${family} gathered, spirits aloft
Every table decorated, every heart is full
Tonight we celebrate love, beautiful and wonderful

[Chorus]
Raise your glass to ${bride} and ${groom}
Love that blossomed, love that bloomed
Reception night, stars align
Cheers to forever, cheers to divine
To the couple! To the love!
Blessings shower from above!

[Verse 2]
From the first dance to the cake cutting sweet
Every moment magical, every memory complete
${groom} holds ${bride}, whispers in her ear
"I'll love you forever, year after year"

[Outro]
Thank you all for being here tonight
To witness love so pure and bright!`,

      'invitation': `[Verse 1]
A celebration awaits, so grand and divine
${family} invites you, please do make time
${bride} and ${groom} are tying the knot
Your presence is the blessing we've always sought

[Chorus]
Aapka aashirwaad chahiye, aapki duaayein
${bride} aur ${groom} ki khushiyon mein, shamil ho jaayein
Mark your calendars, save the date
For love and laughter, please don't be late!

[Outro]
With love and warmth, we welcome you
To be part of our dreams coming true!`,
    };

    return lyricsTemplates[category] || lyricsTemplates['couples'];
  };

  const handleGenerate = async () => {
    if (!selectedCategory) {
      toast.error("Please select a song category first");
      return;
    }

    if (!brideName && !groomName && !familyName && activeTab === "quick") {
      toast.error("Please enter at least one name for personalization");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStep(0);
    
    try {
      const style = musicStyles.find(s => s.id === selectedStyle)?.name || "Bollywood Wedding";
      
      // Use edited preview lyrics if available, otherwise use custom lyrics or let backend generate
      const lyricsToUse = showLyricsPreview && previewLyrics 
        ? previewLyrics 
        : (activeTab === "custom" ? customLyrics : undefined);
      
      const { data, error } = await supabase.functions.invoke('generate-wedding-music', {
        body: {
          prompt: customPrompt || selectedCategory.defaultPrompt,
          category: selectedCategory.id,
          style: style,
          instrumental: isInstrumental,
          lyrics: lyricsToUse,
          title: customTitle || undefined,
          names: {
            bride: brideName,
            groom: groomName,
            family: familyName
          }
        }
      });

      if (error) throw error;

      setGenerationProgress(100);
      
      if (data?.tracks) {
        setGeneratedTracks(prev => [...data.tracks, ...prev]);
        toast.success("🎵 Your personalized wedding song is ready!");
        
        // Reset lyrics preview state
        setShowLyricsPreview(false);
        setPreviewLyrics("");
        
        // Auto-save songs to library if user is logged in
        if (user) {
          for (const track of data.tracks) {
            try {
              await supabase
                .from('generated_songs')
                .insert({
                  user_id: user.id,
                  title: track.title,
                  audio_url: track.audio_url,
                  lyrics: track.lyrics || lyricsToUse,
                  prompt: track.prompt || customPrompt || selectedCategory.defaultPrompt,
                  category: selectedCategory.id,
                  style: selectedStyle,
                  duration: track.duration || 180,
                  names: { bride: brideName, groom: groomName, family: familyName },
                  suno_track_id: track.id,
                });
            } catch (saveError) {
              console.error('Error auto-saving song:', saveError);
            }
          }
          loadSavedSongs();
          toast.success("Songs automatically saved to your library!");
        }
      }
    } catch (error) {
      console.error('Error generating music:', error);
      toast.error("Failed to generate music. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlay = async (track: GeneratedTrack) => {
    if (!track.audio_url) {
      toast.error("Audio not available. The song may still be generating.");
      return;
    }
    
    if (currentlyPlaying === track.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      try {
        setIsLoadingAudio(true);
        setCurrentlyPlaying(track.id);
        
        if (audioRef.current) {
          // Stop any currently playing audio first
          audioRef.current.pause();
          audioRef.current.src = track.audio_url;
          
          // Add error handler for audio loading
          audioRef.current.onerror = (e) => {
            console.error('Audio load error:', e);
            toast.error("Failed to load audio. The URL may be invalid.");
            setIsPlaying(false);
            setIsLoadingAudio(false);
          };
          
          audioRef.current.oncanplay = () => {
            setIsLoadingAudio(false);
          };
          
          await audioRef.current.play();
        }
        setIsPlaying(true);
        setIsLoadingAudio(false);
      } catch (error) {
        console.error('Error playing audio:', error);
        toast.error("Failed to play audio. Please try again.");
        setIsPlaying(false);
        setIsLoadingAudio(false);
      }
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
      toast.success("Song downloaded!");
    } catch (error) {
      toast.error("Failed to download. Please try again.");
    }
  };

  const handleShare = async (track: GeneratedTrack) => {
    const shareText = `🎵 Listen to our personalized wedding song "${track.title}" created on Karlo Shaadi!\n\nCreate your own: ${window.location.href}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: track.title,
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled
      }
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <BhindiHeader />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-pink-500/20 text-primary px-6 py-3 rounded-full mb-6 border border-primary/20"
          >
            <Music2 className="h-5 w-5 animate-pulse" />
            <span className="font-semibold">AI Wedding Song Creator</span>
            <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">Powered by Suno V5</Badge>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Create Your{" "}
            <span className="bg-gradient-to-r from-primary via-pink-500 to-rose-500 bg-clip-text text-transparent">
              Personalized
            </span>
            <br />
            Wedding Song
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Enter your names and let AI create a unique, personalized song with your names in the lyrics.
            Perfect for couple entries, sangeet performances, invitation videos, and more!
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mic2 className="h-4 w-4 text-primary" />
              <span>Personalized Lyrics</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Music4 className="h-4 w-4 text-primary" />
              <span>8 Music Styles</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <HeartHandshake className="h-4 w-4 text-primary" />
              <span>Names in Songs</span>
            </div>
          </div>
        </motion.div>

        {/* Hidden Audio Element */}
        <audio 
          ref={audioRef} 
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Categories */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                Choose Song Type
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {musicCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg group ${
                        selectedCategory?.id === category.id 
                          ? 'ring-2 ring-primary shadow-lg bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleCategorySelect(category)}
                    >
                      <CardContent className="p-3 text-center">
                        <div className={`w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                          <category.icon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-medium text-foreground text-xs leading-tight">{category.name}</h3>
                        <p className="text-[10px] text-primary font-medium mt-0.5">{category.nameHindi}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Music Style */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-primary" />
                  Music Style
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {musicStyles.map((style) => (
                    <Badge 
                      key={style.id}
                      variant={selectedStyle === style.id ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedStyle === style.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-primary/10'
                      }`}
                      onClick={() => setSelectedStyle(style.id)}
                    >
                      <span className="mr-1">{style.emoji}</span>
                      {style.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Customization */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedCategory ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="border-primary/20 overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${selectedCategory.gradient}`} />
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedCategory.gradient} flex items-center justify-center`}>
                          <selectedCategory.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">Create Your {selectedCategory.name}</CardTitle>
                          <CardDescription>{selectedCategory.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="quick" className="gap-2">
                            <Sparkles className="h-4 w-4" />
                            Quick Create
                          </TabsTrigger>
                          <TabsTrigger value="custom" className="gap-2">
                            <FileText className="h-4 w-4" />
                            Custom Lyrics
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="quick" className="space-y-4 mt-4">
                          {/* Names Input */}
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="brideName" className="flex items-center gap-2 mb-2">
                                <Heart className="h-3 w-3 text-pink-500" />
                                Bride's Name
                              </Label>
                              <Input
                                id="brideName"
                                value={brideName}
                                onChange={(e) => setBrideName(e.target.value)}
                                placeholder="e.g., Priya"
                                className="border-pink-200 focus:border-pink-400"
                              />
                            </div>
                            <div>
                              <Label htmlFor="groomName" className="flex items-center gap-2 mb-2">
                                <Crown className="h-3 w-3 text-amber-500" />
                                Groom's Name
                              </Label>
                              <Input
                                id="groomName"
                                value={groomName}
                                onChange={(e) => setGroomName(e.target.value)}
                                placeholder="e.g., Rahul"
                                className="border-amber-200 focus:border-amber-400"
                              />
                            </div>
                            <div>
                              <Label htmlFor="familyName" className="flex items-center gap-2 mb-2">
                                <Users className="h-3 w-3 text-blue-500" />
                                Family Name
                              </Label>
                              <Input
                                id="familyName"
                                value={familyName}
                                onChange={(e) => setFamilyName(e.target.value)}
                                placeholder="e.g., Sharma"
                                className="border-blue-200 focus:border-blue-400"
                              />
                            </div>
                          </div>

                          {/* Song Description */}
                          <div>
                            <Label htmlFor="prompt" className="mb-2 block">Song Description (Optional)</Label>
                            <Textarea
                              id="prompt"
                              value={customPrompt}
                              onChange={(e) => setCustomPrompt(e.target.value)}
                              placeholder="Describe the mood, style, or any special elements you want..."
                              className="min-h-[80px]"
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="custom" className="space-y-4 mt-4">
                          {/* Custom Title */}
                          <div>
                            <Label htmlFor="customTitle" className="mb-2 block">Song Title</Label>
                            <Input
                              id="customTitle"
                              value={customTitle}
                              onChange={(e) => setCustomTitle(e.target.value)}
                              placeholder="Enter your song title"
                            />
                          </div>

                          {/* Custom Lyrics */}
                          <div>
                            <Label htmlFor="customLyrics" className="mb-2 block">
                              Write Your Own Lyrics
                              <span className="text-xs text-muted-foreground ml-2">(Use [Verse], [Chorus], [Hook] tags)</span>
                            </Label>
                            <Textarea
                              id="customLyrics"
                              value={customLyrics}
                              onChange={(e) => setCustomLyrics(e.target.value)}
                              placeholder={`[Verse 1]\nWrite your verse here...\n\n[Chorus]\nWrite your chorus here...`}
                              className="min-h-[200px] font-mono text-sm"
                            />
                          </div>

                          {/* Names for custom lyrics */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="brideName2">Bride's Name</Label>
                              <Input
                                id="brideName2"
                                value={brideName}
                                onChange={(e) => setBrideName(e.target.value)}
                                placeholder="Optional"
                              />
                            </div>
                            <div>
                              <Label htmlFor="groomName2">Groom's Name</Label>
                              <Input
                                id="groomName2"
                                value={groomName}
                                onChange={(e) => setGroomName(e.target.value)}
                                placeholder="Optional"
                              />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>

                      {/* Instrumental Toggle */}
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <Label htmlFor="instrumental" className="font-medium">Instrumental Only</Label>
                          <p className="text-sm text-muted-foreground">Generate music without vocals</p>
                        </div>
                        <Switch
                          id="instrumental"
                          checked={isInstrumental}
                          onCheckedChange={(checked) => {
                            setIsInstrumental(checked);
                            if (checked) {
                              setShowLyricsPreview(false);
                              setPreviewLyrics("");
                            }
                          }}
                        />
                      </div>

                      {/* Lyrics Preview Section */}
                      <AnimatePresence>
                        {showLyricsPreview && !isInstrumental && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <Label className="flex items-center gap-2 text-base font-semibold">
                                <FileText className="h-4 w-4 text-primary" />
                                Preview & Edit Lyrics
                              </Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setShowLyricsPreview(false);
                                  setPreviewLyrics("");
                                }}
                              >
                                <ChevronUp className="h-4 w-4 mr-1" />
                                Hide
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Edit the lyrics below before generating your song. Changes will be used in the final song.
                            </p>
                            <Textarea
                              value={previewLyrics}
                              onChange={(e) => setPreviewLyrics(e.target.value)}
                              placeholder="Your personalized lyrics will appear here..."
                              className="min-h-[300px] font-mono text-sm border-primary/30 focus:border-primary"
                            />
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (selectedCategory) {
                                    const freshLyrics = createPersonalizedLyricsLocal(selectedCategory.id, {
                                      bride: brideName,
                                      groom: groomName,
                                      family: familyName
                                    });
                                    setPreviewLyrics(freshLyrics);
                                    toast.success("Lyrics regenerated!");
                                  }
                                }}
                              >
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Regenerate Lyrics
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {/* Preview Lyrics Button - Only show for quick mode and non-instrumental */}
                        {activeTab === "quick" && !isInstrumental && !showLyricsPreview && (
                          <Button 
                            onClick={generateLyricsPreview}
                            disabled={isGeneratingLyrics || isGenerating}
                            variant="outline"
                            className="flex-1 h-14 text-lg border-primary/30 hover:bg-primary/10"
                            size="lg"
                          >
                            {isGeneratingLyrics ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Generating Lyrics...</span>
                              </div>
                            ) : (
                              <>
                                <FileText className="h-5 w-5 mr-2" />
                                Preview & Edit Lyrics
                              </>
                            )}
                          </Button>
                        )}

                        {/* Generate Button */}
                        <Button 
                          onClick={handleGenerate}
                          disabled={isGenerating}
                          className={`h-14 text-lg bg-gradient-to-r from-primary via-pink-500 to-rose-500 hover:opacity-90 transition-opacity ${
                            (activeTab === "quick" && !isInstrumental && !showLyricsPreview) ? 'flex-1' : 'w-full'
                          }`}
                          size="lg"
                        >
                          {isGenerating ? (
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <div className="absolute inset-0 animate-ping opacity-30">
                                  <Music className="h-6 w-6" />
                                </div>
                              </div>
                              <span>Creating Your Song...</span>
                            </div>
                          ) : (
                            <>
                              <Wand2 className="h-6 w-6 mr-2" />
                              {showLyricsPreview ? 'Generate Song with These Lyrics' : 'Generate Personalized Song'}
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Generation Progress */}
                      <AnimatePresence>
                        {isGenerating && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                          >
                            <div className="relative">
                              <Progress value={generationProgress} className="h-3" />
                              <span className="absolute right-0 top-4 text-xs text-muted-foreground">
                                {Math.round(generationProgress)}%
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-5 gap-2">
                              {generationSteps.map((step, index) => (
                                <motion.div
                                  key={step.id}
                                  initial={{ opacity: 0.3 }}
                                  animate={{ 
                                    opacity: index <= generationStep ? 1 : 0.3,
                                    scale: index === generationStep ? 1.05 : 1
                                  }}
                                  className={`text-center p-3 rounded-lg transition-all ${
                                    index === generationStep 
                                      ? 'bg-primary/20 ring-2 ring-primary/50' 
                                      : index < generationStep 
                                        ? 'bg-green-500/10' 
                                        : 'bg-muted/50'
                                  }`}
                                >
                                  <div className="text-2xl mb-1">
                                    {index < generationStep ? '✅' : step.emoji}
                                  </div>
                                  <p className="text-[10px] font-medium leading-tight">{step.label}</p>
                                </motion.div>
                              ))}
                            </div>

                            <p className="text-center text-sm text-muted-foreground animate-pulse">
                              {generationSteps[generationStep]?.label}...
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-full min-h-[400px]"
                >
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-pink-500/20 flex items-center justify-center">
                      <Music2 className="h-12 w-12 text-primary animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground mb-3">
                      Select a Song Type
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Choose a category from the left to start creating your personalized wedding song
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Generated Tracks */}
        {generatedTracks.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Volume2 className="h-6 w-6 text-primary" />
                Your Generated Songs
              </h2>
              <Badge variant="secondary" className="text-sm">
                {generatedTracks.length} Song{generatedTracks.length > 1 ? 's' : ''}
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
                  <Card className={`overflow-hidden transition-all ${
                    currentlyPlaying === track.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                  }`}>
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Play Button & Info */}
                        <div className="flex items-center gap-4 p-4 md:p-6 flex-1">
                          <Button
                            size="icon"
                            className={`h-16 w-16 rounded-full shrink-0 transition-all ${
                              currentlyPlaying === track.id && isPlaying
                                ? 'bg-primary'
                                : 'bg-gradient-to-br from-primary to-pink-600'
                            }`}
                            onClick={() => handlePlay(track)}
                            disabled={isLoadingAudio && currentlyPlaying === track.id}
                          >
                            {currentlyPlaying === track.id && isLoadingAudio ? (
                              <Loader2 className="h-7 w-7 text-white animate-spin" />
                            ) : currentlyPlaying === track.id && isPlaying ? (
                              <Pause className="h-7 w-7 text-white" />
                            ) : (
                              <Play className="h-7 w-7 text-white ml-1" />
                            )}
                          </Button>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-lg truncate">{track.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">{track.prompt}</p>
                            
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge variant="outline" className="text-xs capitalize">
                                {track.category.replace('-', ' ')}
                              </Badge>
                              {track.names?.bride && track.names?.groom && (
                                <Badge variant="secondary" className="text-xs">
                                  {track.names.bride} & {track.names.groom}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {track.duration}s
                              </span>
                              {track.lyrics && (
                                <Badge 
                                  variant="outline" 
                                  className="text-xs cursor-pointer hover:bg-primary/10"
                                  onClick={() => setExpandedLyrics(expandedLyrics === track.id ? null : track.id)}
                                >
                                  <FileText className="h-3 w-3 mr-1" />
                                  Lyrics
                                </Badge>
                              )}
                            </div>

                            {/* Progress bar when playing */}
                            {currentlyPlaying === track.id && (
                              <div className="mt-3">
                                <Progress value={audioProgress} className="h-1" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Visualizer when playing */}
                        {currentlyPlaying === track.id && isPlaying && (
                          <div className="hidden md:flex items-center gap-1 px-6 bg-primary/5">
                            {[...Array(8)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-1.5 bg-gradient-to-t from-primary to-pink-500 rounded-full"
                                animate={{
                                  height: [12, 40, 20, 35, 12],
                                }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Infinity,
                                  delay: i * 0.08,
                                }}
                              />
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-1 p-4 border-t md:border-t-0 md:border-l border-border bg-muted/30">
                          {user && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => saveSong(track)}
                              disabled={savingTrackId === track.id}
                              title="Save to Library"
                              className="h-10 w-10"
                            >
                              {savingTrackId === track.id ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <Save className="h-5 w-5" />
                              )}
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDownload(track)}
                            title="Download"
                            className="h-10 w-10"
                          >
                            <Download className="h-5 w-5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleShare(track)}
                            title="Share on WhatsApp"
                            className="h-10 w-10"
                          >
                            <Share2 className="h-5 w-5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setSelectedCategory(musicCategories.find(c => c.id === track.category) || null);
                              if (track.names) {
                                setBrideName(track.names.bride || '');
                                setGroomName(track.names.groom || '');
                                setFamilyName(track.names.family || '');
                              }
                            }}
                            title="Regenerate"
                            className="h-10 w-10"
                          >
                            <RefreshCw className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>

                      {/* Lyrics Panel */}
                      <Collapsible open={expandedLyrics === track.id}>
                        <CollapsibleContent>
                          {track.lyrics && (
                            <div className="border-t border-border bg-muted/20 p-4 md:p-6">
                              <div className="flex items-center gap-2 mb-3">
                                <FileText className="h-4 w-4 text-primary" />
                                <h4 className="font-medium text-foreground">Personalized Lyrics</h4>
                              </div>
                              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed bg-background/50 p-4 rounded-lg max-h-64 overflow-y-auto">
                                {track.lyrics}
                              </pre>
                            </div>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Saved Songs Library */}
        {user && savedSongs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Library className="h-6 w-6 text-primary" />
                Your Music Library
              </h2>
              <Badge variant="outline" className="text-sm">
                {savedSongs.length} Saved
              </Badge>
            </div>
            
            <div className="grid gap-4">
              {savedSongs.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`overflow-hidden transition-all ${
                    currentlyPlaying === track.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                  }`}>
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Play Button & Info */}
                        <div className="flex items-center gap-4 p-4 md:p-6 flex-1">
                          <Button
                            size="icon"
                            className={`h-14 w-14 rounded-full shrink-0 transition-all ${
                              currentlyPlaying === track.id && isPlaying
                                ? 'bg-primary'
                                : 'bg-gradient-to-br from-primary/80 to-pink-600/80'
                            }`}
                            onClick={() => handlePlay(track)}
                            disabled={isLoadingAudio && currentlyPlaying === track.id}
                          >
                            {currentlyPlaying === track.id && isLoadingAudio ? (
                              <Loader2 className="h-6 w-6 text-white animate-spin" />
                            ) : currentlyPlaying === track.id && isPlaying ? (
                              <Pause className="h-6 w-6 text-white" />
                            ) : (
                              <Play className="h-6 w-6 text-white ml-1" />
                            )}
                          </Button>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">{track.title}</h3>
                            
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge variant="outline" className="text-xs capitalize">
                                {track.category.replace('-', ' ')}
                              </Badge>
                              {track.names?.bride && track.names?.groom && (
                                <Badge variant="secondary" className="text-xs">
                                  {track.names.bride} & {track.names.groom}
                                </Badge>
                              )}
                              {track.lyrics && (
                                <Badge 
                                  variant="outline" 
                                  className="text-xs cursor-pointer hover:bg-primary/10"
                                  onClick={() => setExpandedLyrics(expandedLyrics === track.id ? null : track.id)}
                                >
                                  <FileText className="h-3 w-3 mr-1" />
                                  Lyrics
                                </Badge>
                              )}
                            </div>

                            {currentlyPlaying === track.id && (
                              <div className="mt-2">
                                <Progress value={audioProgress} className="h-1" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 p-4 border-t md:border-t-0 md:border-l border-border bg-muted/30">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDownload(track)}
                            title="Download"
                            className="h-10 w-10"
                          >
                            <Download className="h-5 w-5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleShare(track)}
                            title="Share"
                            className="h-10 w-10"
                          >
                            <Share2 className="h-5 w-5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteSong(track.id)}
                            title="Remove from Library"
                            className="h-10 w-10 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>

                      {/* Lyrics Panel */}
                      <Collapsible open={expandedLyrics === track.id}>
                        <CollapsibleContent>
                          {track.lyrics && (
                            <div className="border-t border-border bg-muted/20 p-4 md:p-6">
                              <div className="flex items-center gap-2 mb-3">
                                <FileText className="h-4 w-4 text-primary" />
                                <h4 className="font-medium text-foreground">Personalized Lyrics</h4>
                              </div>
                              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed bg-background/50 p-4 rounded-lg max-h-64 overflow-y-auto">
                                {track.lyrics}
                              </pre>
                            </div>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Features Section */}
        <section className="py-12 border-t border-border">
          <h2 className="text-2xl font-semibold text-center mb-8">Why Create Songs with Karlo Shaadi?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Names in Lyrics", desc: "Your names beautifully woven into every song" },
              { icon: Music2, title: "8 Music Styles", desc: "From Bollywood to Sufi to Modern Pop" },
              { icon: Mic2, title: "AI Vocals", desc: "Professional quality vocals and instruments" },
              { icon: Download, title: "Download & Share", desc: "Get MP3 files, share on WhatsApp instantly" }
            ].map((feature, i) => (
              <Card key={i} className="text-center p-6 bg-muted/30 border-0">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <BhindiFooter />
    </div>
  );
}
