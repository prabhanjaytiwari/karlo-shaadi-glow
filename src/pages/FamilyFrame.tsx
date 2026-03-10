import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Upload, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import FamilyFrameWizard from "@/components/family-frame/FamilyFrameWizard";
import FamilyFrameResult from "@/components/family-frame/FamilyFrameResult";

type Step = "hero" | "wizard" | "generating" | "result";

export default function FamilyFrame() {
  const [step, setStep] = useState<Step>("hero");
  const [weddingImage, setWeddingImage] = useState<File | null>(null);
  const [lovedOneImage, setLovedOneImage] = useState<File | null>(null);
  const [weddingPreview, setWeddingPreview] = useState("");
  const [lovedOnePreview, setLovedOnePreview] = useState("");
  const [placement, setPlacement] = useState("auto");
  const [resultUrl, setResultUrl] = useState("");

  const handleStartOver = () => {
    setStep("hero");
    setWeddingImage(null);
    setLovedOneImage(null);
    setWeddingPreview("");
    setLovedOnePreview("");
    setPlacement("auto");
    setResultUrl("");
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(170deg, #FDF8F0 0%, #FAF0E6 40%, #F5E6D3 70%, #FDF8F0 100%)" }}>
      <MobilePageHeader title="Family Frame" />
      <SEO
        title="Complete Your Wedding Family Photo | Karlo Shaadi"
        description="Add a loved one who couldn't attend your wedding into your family photo with AI. Create an emotional, seamless family portrait."
        keywords="wedding family photo, AI photo editing, wedding memories, family frame"
      />

      <div className="container mx-auto px-4 pt-20 pb-16 max-w-3xl">
        <AnimatePresence mode="wait">
          {step === "hero" && (
            <HeroSection key="hero" onStart={() => setStep("wizard")} />
          )}

          {step === "wizard" && (
            <FamilyFrameWizard
              key="wizard"
              weddingImage={weddingImage}
              setWeddingImage={setWeddingImage}
              lovedOneImage={lovedOneImage}
              setLovedOneImage={setLovedOneImage}
              weddingPreview={weddingPreview}
              setWeddingPreview={setWeddingPreview}
              lovedOnePreview={lovedOnePreview}
              setLovedOnePreview={setLovedOnePreview}
              placement={placement}
              setPlacement={setPlacement}
              onGenerate={() => setStep("generating")}
              onResult={(url) => {
                setResultUrl(url);
                setStep("result");
              }}
              onError={() => setStep("wizard")}
            />
          )}

          {step === "generating" && <GeneratingLoader key="generating" />}

          {step === "result" && (
            <FamilyFrameResult
              key="result"
              resultUrl={resultUrl}
              originalUrl={weddingPreview}
              onStartOver={handleStartOver}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center py-12 md:py-20"
    >
      {/* Decorative element */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8"
        style={{ background: "linear-gradient(135deg, #C5A572 0%, #E8D5B5 50%, #C5A572 100%)" }}
      >
        <Heart className="w-9 h-9 text-white" fill="white" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight"
      >
        Complete Your Wedding
        <br />
        <span style={{ color: "#C5A572" }}>Family Photo</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
      >
        Upload your wedding picture and a photo of a loved one who couldn't attend.
        AI will seamlessly place them into the family frame.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          onClick={onStart}
          size="lg"
          className="rounded-full h-14 px-10 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ background: "linear-gradient(135deg, #C5A572, #B8956A)", color: "white" }}
        >
          <Sparkles className="mr-2.5 h-5 w-5" />
          Create My Photo
        </Button>
      </motion.div>

      {/* Steps preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground"
      >
        {[
          { num: "1", label: "Upload Wedding Photo" },
          { num: "2", label: "Upload Loved One" },
          { num: "3", label: "Choose Placement" },
          { num: "4", label: "Generate Photo" },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "#C5A572" }}
            >
              {s.num}
            </span>
            <span>{s.label}</span>
            {i < 3 && <ArrowRight className="h-3.5 w-3.5 hidden sm:block ml-2 text-muted-foreground/40" />}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function GeneratingLoader() {
  const messages = [
    "Analyzing your wedding photograph...",
    "Matching lighting and color grading...",
    "Placing your loved one into the frame...",
    "Blending shadows and background...",
    "Rebuilding your family memory with AI...",
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      {/* Pulsing golden ring */}
      <div className="relative w-28 h-28 mb-10">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, #C5A57240 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-2 border-transparent"
          style={{ borderTopColor: "#C5A572", borderRightColor: "#C5A57260" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart className="w-10 h-10" style={{ color: "#C5A572" }} fill="#C5A572" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-foreground font-medium text-lg mb-3"
        >
          {messages[msgIndex]}
        </motion.p>
      </AnimatePresence>

      <p className="text-muted-foreground text-sm">
        This usually takes 15–30 seconds
      </p>
    </motion.div>
  );
}
