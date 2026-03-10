import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Share2, RefreshCw, Heart, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  resultUrl: string;
  originalUrl: string;
  onStartOver: () => void;
}

export default function FamilyFrameResult({ resultUrl, originalUrl, onStartOver }: Props) {
  const [showComparison, setShowComparison] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleDownload = async () => {
    try {
      const res = await fetch(resultUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "family-frame-photo.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Photo downloaded!");
    } catch {
      toast.error("Download failed. Try right-clicking the image to save.");
    }
  };

  const handleShare = async (platform?: string) => {
    const shareText = "Sometimes love deserves one more place in the frame. 💛 Created with Karlo Shaadi's Family Frame";
    const shareUrl = `${window.location.origin}/family-frame`;

    if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
    } else if (navigator.share) {
      try {
        await navigator.share({ title: "Family Frame", text: shareText, url: shareUrl });
      } catch { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!");
    }
  };

  const handleSliderMove = useCallback((clientX: number) => {
    if (!sliderRef.current || !isDragging.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(2, Math.min(98, pos)));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      {/* Success header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
          style={{ background: "linear-gradient(135deg, #C5A572, #E8D5B5)" }}
        >
          <Heart className="w-7 h-7 text-white" fill="white" />
        </motion.div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Your Family Frame is Ready
        </h2>
        <p className="text-muted-foreground text-sm">Together again, even if only in a frame</p>
      </div>

      {/* Result image or comparison */}
      <div className="rounded-2xl overflow-hidden shadow-xl border border-[#C5A572]/20 mb-6 bg-white">
        {showComparison && originalUrl ? (
          <div
            ref={sliderRef}
            className="relative select-none cursor-col-resize aspect-video"
            onMouseDown={() => { isDragging.current = true; }}
            onMouseMove={(e) => handleSliderMove(e.clientX)}
            onMouseUp={() => { isDragging.current = false; }}
            onMouseLeave={() => { isDragging.current = false; }}
            onTouchStart={() => { isDragging.current = true; }}
            onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
            onTouchEnd={() => { isDragging.current = false; }}
          >
            <img src={resultUrl} alt="Result" className="absolute inset-0 w-full h-full object-contain" />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img src={originalUrl} alt="Original" className="absolute inset-0 w-full h-full object-contain" style={{ width: `${100 / (sliderPos / 100)}%`, maxWidth: "none" }} />
            </div>
            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-3 rounded-full" style={{ background: "#C5A572" }} />
                  <div className="w-0.5 h-3 rounded-full" style={{ background: "#C5A572" }} />
                </div>
              </div>
            </div>
            {/* Labels */}
            <span className="absolute top-3 left-3 px-2 py-1 rounded bg-black/50 text-white text-xs font-medium">Before</span>
            <span className="absolute top-3 right-3 px-2 py-1 rounded bg-black/50 text-white text-xs font-medium">After</span>
          </div>
        ) : (
          <img src={resultUrl} alt="Your completed family photo" className="w-full" />
        )}
      </div>

      {/* Toggle comparison */}
      {originalUrl && (
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="text-sm font-medium px-4 py-2 rounded-full border transition-all"
            style={{
              borderColor: showComparison ? "#C5A572" : "#ddd",
              color: showComparison ? "#C5A572" : "#888",
              background: showComparison ? "#C5A57210" : "transparent",
            }}
          >
            {showComparison ? "Hide Comparison" : "Before vs After"}
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
        <Button
          onClick={handleDownload}
          size="lg"
          className="rounded-full font-semibold shadow-md"
          style={{ background: "linear-gradient(135deg, #C5A572, #B8956A)" }}
        >
          <Download className="mr-2 h-4 w-4" /> Download Photo
        </Button>
        <Button onClick={() => handleShare()} size="lg" variant="outline" className="rounded-full font-semibold">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
        <Button onClick={onStartOver} size="lg" variant="outline" className="rounded-full">
          <RefreshCw className="mr-2 h-4 w-4" /> Generate Again
        </Button>
      </div>

      {/* Share platforms */}
      <div className="flex justify-center gap-3 mb-10">
        <button
          onClick={() => handleShare("whatsapp")}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
        >
          WhatsApp
        </button>
        <button
          onClick={() => handleShare("twitter")}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-black/80 transition-colors"
        >
          Twitter
        </button>
      </div>

      {/* Emotional quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center p-8 rounded-2xl"
        style={{ background: "linear-gradient(135deg, #C5A57215, #E8D5B510)" }}
      >
        <Heart className="w-6 h-6 mx-auto mb-3" style={{ color: "#C5A572" }} fill="#C5A572" />
        <p className="font-display text-lg sm:text-xl italic text-foreground/80">
          "Sometimes love deserves one more place in the frame."
        </p>
      </motion.div>

      {/* Premium HD upsell */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-6 rounded-2xl border-2 border-[#C5A572]/30 bg-white/80 text-center"
      >
        <p className="font-semibold text-foreground mb-1">Want Full HD Quality?</p>
        <p className="text-sm text-muted-foreground mb-4">
          Download your family frame in full resolution for printing
        </p>
        <Button
          className="rounded-full px-8 font-semibold"
          style={{ background: "linear-gradient(135deg, #C5A572, #B8956A)" }}
          onClick={() => toast.info("HD downloads coming soon! 🎉")}
        >
          Unlock HD — ₹199
        </Button>
      </motion.div>
    </motion.div>
  );
}
