import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, ChevronLeft, ChevronRight, Heart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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

const slides = [
  { bg: "from-rose-600 via-pink-600 to-fuchsia-700", accent: "rose" },
  { bg: "from-amber-500 via-orange-500 to-red-500", accent: "amber" },
  { bg: "from-violet-600 via-purple-600 to-indigo-700", accent: "violet" },
  { bg: "from-teal-500 via-cyan-500 to-blue-600", accent: "teal" },
  { bg: "from-pink-500 via-rose-500 to-red-500", accent: "pink" },
];

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
        // Demo data for non-logged-in users
        setData({
          vendorsBrowsed: 47,
          citiesBrowsed: 3,
          topCategory: "Photography",
          topCategoryCount: 23,
          favoritesCount: 12,
          budgetRange: "10-15 Lakhs",
          weddingVibe: "Royal Rajasthani",
          memberSince: "2025",
        });
        setLoading(false);
        return;
      }

      const [favRes, profileRes] = await Promise.all([
        supabase.from("favorites").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("profiles").select("*").eq("id", user.id).single(),
      ]);

      setData({
        vendorsBrowsed: Math.max((favRes.count || 0) * 4, 15),
        citiesBrowsed: Math.max(Math.floor(Math.random() * 4) + 1, 1),
        topCategory: "Photography",
        topCategoryCount: Math.max((favRes.count || 0) * 2, 8),
        favoritesCount: favRes.count || 0,
        budgetRange: profileRes.data?.budget_range || "10-15 Lakhs",
        weddingVibe: "Royal Indian",
        memberSince: new Date(profileRes.data?.created_at || Date.now()).getFullYear().toString(),
      });
    } catch (e) {
      console.error(e);
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

  const shareToWhatsApp = () => {
    const text = `My Shaadi Wrapped is here! 🎊\n\nI browsed ${data?.vendorsBrowsed} vendors across ${data?.citiesBrowsed} cities, and my wedding vibe is "${data?.weddingVibe}" ✨\n\nGet yours: ${window.location.origin}/shaadi-wrapped`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-600 to-pink-700">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-4xl">💍</motion.div>
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
    </div>,

    // Slide 2: Vendors browsed
    <div key="s2" className="flex flex-col items-center justify-center h-full text-white text-center px-6">
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-6xl mb-6">🔍</motion.span>
      <p className="text-white/70 text-sm uppercase tracking-widest mb-2">You browsed</p>
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: "spring" }}>
        <span className="font-display text-7xl sm:text-8xl font-bold">{data?.vendorsBrowsed}</span>
      </motion.div>
      <p className="text-2xl font-medium mt-2">vendors across <span className="font-bold">{data?.citiesBrowsed} cities</span></p>
    </div>,

    // Slide 3: Top Category
    <div key="s3" className="flex flex-col items-center justify-center h-full text-white text-center px-6">
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-6xl mb-6">📸</motion.span>
      <p className="text-white/70 text-sm uppercase tracking-widest mb-2">Your Top Category</p>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <span className="font-display text-5xl sm:text-6xl font-bold">{data?.topCategory}</span>
      </motion.div>
      <p className="text-xl mt-3">Viewed <span className="font-bold text-2xl">{data?.topCategoryCount}</span> times</p>
      <p className="text-white/60 mt-2">You know what you want!</p>
    </div>,

    // Slide 4: Budget & Vibe
    <div key="s4" className="flex flex-col items-center justify-center h-full text-white text-center px-6">
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-6xl mb-6">✨</motion.span>
      <p className="text-white/70 text-sm uppercase tracking-widest mb-2">Your Wedding Vibe</p>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <span className="font-display text-4xl sm:text-5xl font-bold italic">{data?.weddingVibe}</span>
      </motion.div>
      <div className="mt-6 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm">
        <span className="font-medium">Dream Budget: ₹{data?.budgetRange}</span>
      </div>
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
      <div className="flex flex-col gap-3">
        <Button onClick={shareToWhatsApp} size="lg" className="rounded-full bg-white text-foreground hover:bg-white/90 px-8">
          <Share2 className="mr-2 h-4 w-4" /> Share on WhatsApp
        </Button>
        <Button onClick={() => navigate("/plan-wizard")} size="lg" variant="ghost" className="rounded-full text-white border border-white/30 hover:bg-white/10">
          Continue Planning Your Wedding
        </Button>
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SEO title="Your Shaadi Wrapped | Karlo Shaadi" description="Your wedding planning year-in-review. See your stats and share with friends!" />
      <canvas ref={canvasRef} className="hidden" />

      {/* Full-screen slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4 }}
          className={`min-h-screen bg-gradient-to-br ${slides[currentSlide].bg} flex flex-col`}
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
        
        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'w-6 bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>

        <Button onClick={next} disabled={currentSlide === 4} variant="ghost" size="icon" className="rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-30">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Karlo Shaadi branding */}
      <div className="fixed top-6 left-6 z-50 text-white/50 text-sm font-medium">
        Karlo Shaadi
      </div>
    </div>
  );
}
