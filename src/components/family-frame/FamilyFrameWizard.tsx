import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  Upload, ArrowRight, ArrowLeft, User, Users, Sparkles, Heart,
  ImagePlus, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface Props {
  weddingImage: File | null;
  setWeddingImage: (f: File | null) => void;
  lovedOneImage: File | null;
  setLovedOneImage: (f: File | null) => void;
  weddingPreview: string;
  setWeddingPreview: (s: string) => void;
  lovedOnePreview: string;
  setLovedOnePreview: (s: string) => void;
  placement: string;
  setPlacement: (s: string) => void;
  onGenerate: () => void;
  onResult: (url: string) => void;
  onError: () => void;
}

const placementOptions = [
  { id: "next-to-bride", label: "Next to Bride", icon: User, description: "Place beside the bride" },
  { id: "next-to-groom", label: "Next to Groom", icon: User, description: "Place beside the groom" },
  { id: "anywhere", label: "Anywhere in Frame", icon: Users, description: "Best open spot" },
  { id: "auto", label: "Auto AI Placement", icon: Sparkles, description: "Recommended", recommended: true },
];

export default function FamilyFrameWizard({
  weddingImage, setWeddingImage,
  lovedOneImage, setLovedOneImage,
  weddingPreview, setWeddingPreview,
  lovedOnePreview, setLovedOnePreview,
  placement, setPlacement,
  onGenerate, onResult, onError,
}: Props) {
  const [wizardStep, setWizardStep] = useState(0); // 0: wedding, 1: loved one, 2: placement
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileSelect = useCallback(
    (file: File, type: "wedding" | "loved") => {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "wedding") {
          setWeddingImage(file);
          setWeddingPreview(reader.result as string);
        } else {
          setLovedOneImage(file);
          setLovedOnePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    },
    [setWeddingImage, setWeddingPreview, setLovedOneImage, setLovedOnePreview]
  );

  const handleGenerate = async () => {
    if (!weddingImage || !lovedOneImage) {
      toast.error("Please upload both images");
      return;
    }

    setIsGenerating(true);
    onGenerate();

    try {
      // Upload both images to storage
      const weddingName = `uploads/${uuidv4()}-wedding.${weddingImage.name.split(".").pop()}`;
      const lovedName = `uploads/${uuidv4()}-loved.${lovedOneImage.name.split(".").pop()}`;

      const [weddingUpload, lovedUpload] = await Promise.all([
        supabase.storage.from("family-frame").upload(weddingName, weddingImage, { contentType: weddingImage.type }),
        supabase.storage.from("family-frame").upload(lovedName, lovedOneImage, { contentType: lovedOneImage.type }),
      ]);

      if (weddingUpload.error) throw new Error("Failed to upload wedding photo");
      if (lovedUpload.error) throw new Error("Failed to upload loved one's photo");

      const weddingUrl = supabase.storage.from("family-frame").getPublicUrl(weddingName).data.publicUrl;
      const lovedUrl = supabase.storage.from("family-frame").getPublicUrl(lovedName).data.publicUrl;

      // Call the AI generation function
      const { data, error } = await supabase.functions.invoke("generate-family-frame", {
        body: {
          weddingImageUrl: weddingUrl,
          lovedOneImageUrl: lovedUrl,
          placement,
        },
      });

      if (error) throw new Error(error.message || "Generation failed");
      if (data?.error) throw new Error(data.error);

      onResult(data.imageUrl);
    } catch (e: any) {
      console.error("Family frame generation error:", e);
      toast.error(e.message || "Something went wrong. Please try again.");
      onError();
    } finally {
      setIsGenerating(false);
    }
  };

  const steps = [
    { label: "Wedding Photo", active: wizardStep >= 0 },
    { label: "Loved One", active: wizardStep >= 1 },
    { label: "Placement", active: wizardStep >= 2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="py-8"
    >
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => { if (i < wizardStep) setWizardStep(i); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                wizardStep === i
                  ? "text-white shadow-md"
                  : wizardStep > i
                  ? "text-white/90"
                  : "bg-black/5 text-muted-foreground"
              }`}
              style={
                wizardStep >= i
                  ? { background: wizardStep === i ? "#C5A572" : "#C5A572AA" }
                  : {}
              }
            >
              {wizardStep > i ? <Check className="w-3 h-3" /> : null}
              {s.label}
            </button>
            {i < steps.length - 1 && (
              <div className="w-6 h-px" style={{ background: wizardStep > i ? "#C5A572" : "#ddd" }} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {wizardStep === 0 && (
          <StepContent key="step-0" title="Upload Your Wedding Photo" subtitle="Choose a clear family or group photo from your wedding">
            <UploadZone
              onFile={(f) => handleFileSelect(f, "wedding")}
              preview={weddingPreview}
              onClear={() => { setWeddingImage(null); setWeddingPreview(""); }}
              label="Drop wedding photo here or click to browse"
            />
            <div className="flex justify-end mt-8">
              <Button
                onClick={() => setWizardStep(1)}
                disabled={!weddingImage}
                className="rounded-full px-8"
                style={{ background: "#C5A572" }}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </StepContent>
        )}

        {wizardStep === 1 && (
          <StepContent key="step-1" title="Upload Loved One's Photo" subtitle="A clear portrait of the family member who couldn't attend">
            <UploadZone
              onFile={(f) => handleFileSelect(f, "loved")}
              preview={lovedOnePreview}
              onClear={() => { setLovedOneImage(null); setLovedOnePreview(""); }}
              label="Drop portrait photo here or click to browse"
            />
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setWizardStep(0)} className="rounded-full px-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={() => setWizardStep(2)}
                disabled={!lovedOneImage}
                className="rounded-full px-8"
                style={{ background: "#C5A572" }}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </StepContent>
        )}

        {wizardStep === 2 && (
          <StepContent key="step-2" title="Choose Placement" subtitle="Where should your loved one appear in the photo?">
            <div className="grid grid-cols-2 gap-3 mb-8">
              {placementOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPlacement(opt.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                    placement === opt.id
                      ? "border-[#C5A572] bg-[#C5A572]/5 shadow-md"
                      : "border-black/10 hover:border-[#C5A572]/40 bg-white/60"
                  }`}
                >
                  {opt.recommended && (
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: "#C5A572" }}>
                      RECOMMENDED
                    </span>
                  )}
                  <opt.icon className="w-5 h-5 mb-2" style={{ color: placement === opt.id ? "#C5A572" : "#888" }} />
                  <p className="font-semibold text-sm text-foreground">{opt.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                </button>
              ))}
            </div>

            {/* Preview thumbnails */}
            <div className="flex items-center justify-center gap-4 mb-8 p-4 rounded-xl bg-white/60 border border-black/5">
              {weddingPreview && (
                <img src={weddingPreview} alt="Wedding" className="w-24 h-24 object-cover rounded-lg shadow-sm" />
              )}
              <Heart className="w-5 h-5 flex-shrink-0" style={{ color: "#C5A572" }} fill="#C5A572" />
              {lovedOnePreview && (
                <img src={lovedOnePreview} alt="Loved one" className="w-24 h-24 object-cover rounded-lg shadow-sm" />
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setWizardStep(1)} className="rounded-full px-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="rounded-full px-8 font-semibold shadow-lg"
                style={{ background: "linear-gradient(135deg, #C5A572, #B8956A)" }}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Family Photo
              </Button>
            </div>
          </StepContent>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StepContent({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-1.5">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </motion.div>
  );
}

function UploadZone({
  onFile,
  preview,
  onClear,
  label,
}: {
  onFile: (f: File) => void;
  preview: string;
  onClear: () => void;
  label: string;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
    onDrop: (files) => {
      if (files[0]) onFile(files[0]);
    },
  });

  if (preview) {
    return (
      <div className="relative rounded-2xl overflow-hidden border-2 border-[#C5A572]/30 bg-white shadow-sm">
        <img src={preview} alt="Preview" className="w-full max-h-80 object-contain bg-black/5" />
        <button
          onClick={onClear}
          className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-medium hover:bg-black/80 transition-colors"
        >
          Change Photo
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`relative rounded-2xl border-2 border-dashed p-12 sm:p-16 text-center cursor-pointer transition-all ${
        isDragActive
          ? "border-[#C5A572] bg-[#C5A572]/5 scale-[1.01]"
          : "border-black/15 hover:border-[#C5A572]/50 bg-white/40 hover:bg-white/60"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: isDragActive ? "#C5A572" : "#C5A57230" }}
        >
          <ImagePlus className="w-6 h-6" style={{ color: isDragActive ? "white" : "#C5A572" }} />
        </div>
        <p className="text-sm font-medium text-foreground">{isDragActive ? "Drop your photo here" : label}</p>
        <p className="text-xs text-muted-foreground">JPG, PNG or WebP • Max 20MB</p>
      </div>
    </div>
  );
}
