import { SEO } from "@/components/SEO";
import { SpeechWriter } from "@/components/SpeechWriter";
import { Badge } from "@/components/ui/badge";
import { Mic, Heart, Sparkles } from "lucide-react";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";

const SpeechWriterPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title="Speech Writer" />
      <SEO
        title="AI Wedding Speech Writer - Free Personalized Speeches | Karlo Shaadi"
        description="Create the perfect wedding speech in seconds. Free AI-powered speech writer for best man, maid of honor, parents & friends. English, Hindi & Hinglish."
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background py-16 md:py-24">
        <div className="container max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-primary text-sm font-medium">Free Tool</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold text-foreground mb-4">
            Wedding <span className="text-primary">Speech Writer</span> 🎤
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-2">
            Craft the perfect speech for any shaadi — whether you're the best man, maid of honor, or a proud parent.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-4">
            <span className="flex items-center gap-1"><Mic className="w-4 h-4" /> Personalized</span>
            <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> Culturally Authentic</span>
            <span className="flex items-center gap-1"><Sparkles className="w-4 h-4" /> Powered by AI</span>
          </div>
        </div>
      </section>

      {/* Speech Writer */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SpeechWriter />
        </div>
      </section>
    </div>
  );
};

export default SpeechWriterPage;
