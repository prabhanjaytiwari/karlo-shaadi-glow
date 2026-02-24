import { SEO } from "@/components/SEO";
import { SpeechWriter } from "@/components/SpeechWriter";
import { Badge } from "@/components/ui/badge";
import { Mic, Heart, Sparkles } from "lucide-react";

const SpeechWriterPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="AI Wedding Speech Writer - Free Personalized Speeches | Karlo Shaadi"
        description="Create the perfect wedding speech in seconds. Free AI-powered speech writer for best man, maid of honor, parents & friends. English, Hindi & Hinglish."
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background py-6 sm:py-12 md:py-20">
        <div className="container max-w-3xl mx-auto px-3 sm:px-4 text-center">
          <Badge className="mb-3 sm:mb-4 bg-accent/20 text-accent-foreground border-accent/30 gap-1">
            <Sparkles className="w-3 h-3" /> Free AI Tool
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-2 sm:mb-4">
            AI Wedding <span className="text-primary">Speech Writer</span> 🎤
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-xl mx-auto mb-2">
            Craft the perfect speech for any shaadi
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
            <span className="flex items-center gap-1"><Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Personalized</span>
            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Authentic</span>
            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> AI</span>
          </div>
        </div>
      </section>

      {/* Speech Writer */}
      <section className="py-4 sm:py-10 md:py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <SpeechWriter />
        </div>
      </section>
    </div>
  );
};

export default SpeechWriterPage;
