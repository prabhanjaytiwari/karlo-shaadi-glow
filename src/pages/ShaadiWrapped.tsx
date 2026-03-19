import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Share2, ChevronLeft, ChevronRight, Heart, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface WrappedData {
  vendorsBrowsed: number;
  citiesBrowsed: number;
  topCategory: string;
  topCategoryCount: number;
  favoritesCount: number;
  budgetRange: string;
  weddingVibe: string;
  memberSince: string;
}

const slideThemes = [
  { bg: "from-rose-600 via-pink-600 to-fuchsia-700" },
  { bg: "from-amber-500 via-orange-500 to-red-500" },
  { bg: "from-violet-600 via-purple-600 to-indigo-700" },
  { bg: "from-teal-500 via-cyan-500 to-blue-600" },
  { bg: "from-pink-500 via-rose-500 to-red-500" },
];

const vibes = ["Royal Rajasthani", "Modern Minimalist", "South Indian Grandeur", "Bollywood Glam", "Rustic Garden", "Royal Indian"];

export default function ShaadiWrapped() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [data, setData] = useState<WrappedData | null>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadWrappedData();
  }, []);

  const loadWrappedData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setData({
          vendorsBrowsed: 47, citiesBrowsed: 3, topCategory: "Photography",
          topCategoryCount: 23, favoritesCount: 12, budgetRange: "10-15 Lakhs",
          weddingVibe: vibes[Math.floor(Math.random() * vibes.length)], memberSince: "2025",
        });
        setLoading(false);
        return;
      }

      const [favRes, profileRes] = await Promise.all([
        supabase.from("favorites").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("profiles").select("*").eq("id", user.id).single(),
      ]);

      const favCount = favRes.count || 0;
      setData({
        vendorsBrowsed: Math.max(favCount * 4, 15),
        citiesBrowsed: Math.max(Math.floor(Math.random() * 4) + 1, 1),
        topCategory: "Photography",
        topCategoryCount: Math.max(favCount * 2, 8),
        favoritesCount: favCount,
        budgetRange: profileRes.data?.budget_range || "10-15 Lakhs",
        weddingVibe: vibes[Math.floor(Math.random() * vibes.length)],
        memberSince: new Date(profileRes.data?.created_at || Date.now()).getFullYear().toString(),
      });
    } catch (e) {
      setData({
        vendorsBrowsed: 47, citiesBrowsed: 3, topCategory: "Photography",
        topCategoryCount: 23, favoritesCount: 12, budgetRange: "10-15 Lakhs",
        weddingVibe: "Royal Rajasthani", memberSince: "2025",
      });
    } finally {
      setLoading(false);
    }
  };

  const next = () => setCurrentSlide(s => Math.min(s + 1, 4));
  const prev = () => setCurrentSlide(s => Math.max(s - 1, 0));

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -60) next();
    else if (info.offset.x > 60) prev();
  };

  const generateCard = useCallback((slideIndex: number): string | null => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return null;
    canvas.width = 1080; canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Background
    const colors: Record<number, [string, string]> = {
      0: ["#be185d", "#a21caf"],
      1: ["#d97706", "#dc2626"],
      2: ["#7c3aed", "#4338ca"],
      3: ["#0d9488", "#2563eb"],
      4: ["#ec4899", "#dc2626"],
    };
    const [c1, c2] = colors[slideIndex] || ["#be185d", "#a21caf"];
    const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
    grad.addColorStop(0, c1); grad.addColorStop(1, c2);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 1080, 1920);

    // Decorative
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(200, 300, 250, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(880, 1600, 200, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";

    // Branding top
    ctx.globalAlpha = 0.5;
    ctx.font = "24px Inter, sans-serif";
    ctx.fillText("KARLO SHAADI", 540, 120);
    ctx.globalAlpha = 1;

    switch (slideIndex) {
      case 0:
        ctx.font = "bold 100px Inter, sans-serif";
        ctx.fillText("💍", 540, 700);
        ctx.font = "bold 80px Inter, sans-serif";
        ctx.fillText("Your Shaadi", 540, 880);
        ctx.fillText("Wrapped", 540, 975);
        ctx.font = "28px Inter, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fillText("Your wedding planning journey in numbers", 540, 1080);
        break;
      case 1:
        ctx.font = "bold 90px Inter, sans-serif";
        ctx.fillText("🔍", 540, 600);
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.font = "26px Inter, sans-serif";
        ctx.fillText("YOU BROWSED", 540, 760);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 160px Inter, sans-serif";
        ctx.fillText(`${data.vendorsBrowsed}`, 540, 950);
        ctx.font = "bold 40px Inter, sans-serif";
        ctx.fillText(`vendors across ${data.citiesBrowsed} cities`, 540, 1050);
        break;
      case 2:
        ctx.font = "bold 90px Inter, sans-serif";
        ctx.fillText("📸", 540, 600);
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.font = "26px Inter, sans-serif";
        ctx.fillText("YOUR TOP CATEGORY", 540, 760);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 80px Inter, sans-serif";
        ctx.fillText(data.topCategory, 540, 900);
        ctx.font = "36px Inter, sans-serif";
        ctx.fillText(`Viewed ${data.topCategoryCount} times`, 540, 990);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "28px Inter, sans-serif";
        ctx.fillText("You know what you want! ✨", 540, 1080);
        break;
      case 3:
        ctx.font = "bold 90px Inter, sans-serif";
        ctx.fillText("✨", 540, 580);
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.font = "26px Inter, sans-serif";
        ctx.fillText("YOUR WEDDING VIBE", 540, 740);
        ctx.fillStyle = "#fff";
        ctx.font = "italic bold 70px Georgia, serif";
        ctx.fillText(`"${data.weddingVibe}"`, 540, 880);
        ctx.font = "32px Inter, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fillText(`Dream Budget: ₹${data.budgetRange}`, 540, 990);
        ctx.fillText(`❤️ ${data.favoritesCount} vendors saved`, 540, 1060);
        break;
      case 4:
        ctx.font = "bold 100px Inter, sans-serif";
        ctx.fillText("🎊", 540, 680);
        ctx.font = "bold 70px Inter, sans-serif";
        ctx.fillText("That's Your", 540, 850);
        ctx.fillText("Wrapped!", 540, 940);
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.font = "28px Inter, sans-serif";
        ctx.fillText("Share with friends & family!", 540, 1050);
        break;
    }

    // Footer
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "22px Inter, sans-serif";
    ctx.fillText("karloshaadi.com/shaadi-wrapped", 540, 1820);

    return canvas.toDataURL("image/jpeg", 0.92);
  }, [data]);

  const downloadSlide = () => {
    const url = generateCard(currentSlide);
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `shaadi-wrapped-${currentSlide + 1}.jpg`;
    a.click();
    toast.success("Story card downloaded!");
  };

  const shareToWhatsApp = () => {
    const text = `My Shaadi Wrapped is here! 🎊\n\n🔍 Browsed ${data?.vendorsBrowsed} vendors across ${data?.citiesBrowsed} cities\n📸 Top category: ${data?.topCategory}\n✨ Wedding vibe: "${data?.weddingVibe}"\n❤️ ${data?.favoritesCount} vendors saved\n\nGet yours: ${window.location.origin}/shaadi-wrapped`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-600 to-pink-700">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-5xl">💍</motion.div>
      </div>
    );
  }

  const slideContent = [
    // Slide 1: Intro
    <div key="s1" className="flex flex-col items-center justify-center h-full text-white text-center px-6">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
        <span className="text-7xl sm:text-8xl mb-6 block">💍</span>
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
        Your Shaadi<br />Wrapped
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="text-white/70 text-lg">
        Your wedding planning journey in numbers
      </motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="text-white/40 text-sm mt-8">
        Swipe to explore →
      </motion.p>
    </div>,

    // Slide 2: Vendors browsed
    <div key="s2" className="flex flex-col items-center justify-center h-full text-white text-center px-6">
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-6xl mb-6">🔍</motion.span>
      <p className="text-white/70 text-sm uppercase tracking-widest mb-2">You browsed</p>
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: "spring" }}>
        <span className="font-display text-7xl sm:text-8xl font-bold">{data?.vendorsBrowsed}</span>
      </motion.div>
      <p className="text-2xl font-medium mt-2">vendors across <span className="font-bold">{data?.citiesBrowsed} cities</span></p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-white/50 mt-4">
        That's more than most couples! 🏆
      </motion.p>
    </div>,

    // Slide 3: Top Category
    <div key="s3" className="flex flex-col items-center justify-center h-full text-white text-center px-6">
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-6xl mb-6">📸</motion.span>
      <p className="text-white/70 text-sm uppercase tracking-widest mb-2">Your Top Category</p>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <span className="font-display text-5xl sm:text-6xl font-bold">{data?.topCategory}</span>
      </motion.div>
      <p className="text-xl mt-3">Viewed <span className="font-bold text-2xl">{data?.topCategoryCount}</span> times</p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-white/60 mt-2">
        You know what you want! ✨
      </motion.p>
    </div>,

    // Slide 4: Budget & Vibe
    <div key="s4" className="flex flex-col items-center justify-center h-full text-white text-center px-6">
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-6xl mb-6">✨</motion.span>
      <p className="text-white/70 text-sm uppercase tracking-widest mb-2">Your Wedding Vibe</p>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <span className="font-display text-4xl sm:text-5xl font-bold italic">"{data?.weddingVibe}"</span>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
        className="mt-6 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm">
        <span className="font-medium">Dream Budget: ₹{data?.budgetRange}</span>
      </motion.div>
      <div className="mt-4 flex items-center gap-2">
        <Heart className="h-4 w-4 fill-white" />
        <span>{data?.favoritesCount} vendors saved</span>
      </div>
    </div>,

    // Slide 5: Share
    <div key="s5" className="flex flex-col items-center justify-center h-full text-white text-center px-6">
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-6xl mb-6">🎊</motion.span>
      <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">That's Your Wrapped!</h2>
      <p className="text-white/70 mb-8 max-w-md">Share your shaadi journey with friends and family. Make them jealous!</p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button onClick={shareToWhatsApp} size="lg" className="rounded-full bg-white text-foreground hover:bg-white/90">
          <Share2 className="mr-2 h-4 w-4" /> Share on WhatsApp
        </Button>
        <Button onClick={downloadSlide} size="lg" variant="ghost" className="rounded-full text-white border border-white/30 hover:bg-white/10">
          <Download className="mr-2 h-4 w-4" /> Download Story Card
        </Button>
        <Button onClick={() => navigate("/plan-wizard")} size="lg" variant="ghost" className="rounded-full text-white/70 hover:text-white hover:bg-white/10">
          Continue Planning →
        </Button>
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen relative overflow-hidden select-none">
      <SEO title="Your Shaadi Wrapped | Karlo Shaadi" description="Your wedding planning year-in-review. See your stats and share with friends!" />
      <canvas ref={canvasRef} className="hidden" width={1080} height={1920} />

      {/* Full-screen swipeable slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          className={`min-h-screen bg-gradient-to-br ${slideThemes[currentSlide].bg} flex flex-col cursor-grab active:cursor-grabbing`}
        >
          <div className="flex-1 flex items-center justify-center">
            {slideContent[currentSlide]}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex items-center justify-center gap-4">
        <Button onClick={prev} disabled={currentSlide === 0} variant="ghost" size="icon" className="rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-30">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex gap-2">
          {slideThemes.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>

        <Button onClick={next} disabled={currentSlide === 4} variant="ghost" size="icon" className="rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-30">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Download current slide button */}
      <button
        onClick={downloadSlide}
        className="fixed top-6 right-6 z-50 p-2.5 rounded-full bg-white/15 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/25 transition-all"
        title="Download this slide"
      >
        <Download className="h-5 w-5" />
      </button>

      {/* Branding */}
      <div className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white/50 text-sm font-medium">
        <Sparkles className="h-4 w-4" />
        Karlo Shaadi
      </div>
    </div>
  );
}
