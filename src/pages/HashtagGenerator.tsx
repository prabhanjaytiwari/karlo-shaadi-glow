import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, Share2, Copy, Sparkles, Heart } from "lucide-react";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Hashtag {
  hashtag: string;
  category: string;
}

const categoryColors: Record<string, string> = {
  "Name Mashup": "bg-primary/10 text-primary border-primary/20",
  "Bollywood": "bg-accent/10 text-accent border-accent/20",
  "Hinglish": "bg-orange-100 text-orange-700 border-orange-200",
  "Classic": "bg-blue-50 text-blue-700 border-blue-200",
  "Trendy": "bg-purple-50 text-purple-700 border-purple-200",
  "Funny": "bg-green-50 text-green-700 border-green-200",
};

export default function HashtagGenerator() {
  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [surname, setSurname] = useState("");
  const [style, setStyle] = useState("mixed");
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!partner1.trim() || !partner2.trim()) {
      toast.error("Enter both partner names!");
      return;
    }
    setIsLoading(true);
    setHashtags([]);

    try {
      const { data, error } = await supabase.functions.invoke("generate-hashtags", {
        body: { partner1: partner1.trim(), partner2: partner2.trim(), surname: surname.trim(), style },
      });

      if (error) throw new Error(error.message);
      if (data?.hashtags) {
        setHashtags(data.hashtags);
      } else {
        throw new Error("No hashtags returned");
      }
    } catch (e) {
      console.error(e);
      toast.error("Could not generate hashtags. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const copyHashtag = (tag: string, index: number) => {
    navigator.clipboard.writeText(tag);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyAll = () => {
    const all = hashtags.map(h => h.hashtag).join(" ");
    navigator.clipboard.writeText(all);
    toast.success("All hashtags copied!");
  };

  const shareToWhatsApp = () => {
    const text = `Check out our wedding hashtags! 💍✨\n\n${hashtags.map(h => h.hashtag).join("\n")}\n\nGenerate yours free: ${window.location.origin}/hashtag-generator`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <MobilePageHeader title="Hashtag Generator" />
      <SEO
        title="Wedding Hashtag Generator — Free & Creative | Karlo Shaadi"
        description="Generate unique, creative wedding hashtags for your Instagram & social media. Enter your names and get 12+ personalized hashtags instantly — free!"
        keywords="wedding hashtag generator, Indian wedding hashtags, shaadi hashtag, wedding instagram hashtag, couple hashtag generator"
      />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Hash className="h-4 w-4 text-primary" />
            <span className="text-primary text-sm font-semibold">Wedding Hashtags</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            Your Wedding<br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Deserves a Hashtag</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter your names and get 12 unique, creative hashtags — perfect for Instagram, WhatsApp, and your wedding invites.
          </p>
        </div>

        {/* Form */}
        {hashtags.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 max-w-md mx-auto"
          >
            <div>
              <label className="text-sm font-medium mb-1.5 block">Partner 1 Name</label>
              <Input
                placeholder="e.g. Rahul"
                value={partner1}
                onChange={(e) => setPartner1(e.target.value)}
                className="h-12"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Partner 2 Name</label>
              <Input
                placeholder="e.g. Priya"
                value={partner2}
                onChange={(e) => setPartner2(e.target.value)}
                className="h-12"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Surname (optional)</label>
              <Input
                placeholder="e.g. Sharma"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="h-12"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Hashtag Style</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Mixed (Best of all)</SelectItem>
                  <SelectItem value="funny">Funny & Punny</SelectItem>
                  <SelectItem value="traditional">Elegant & Traditional</SelectItem>
                  <SelectItem value="trendy">Trendy & Modern</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              size="lg"
              className="w-full rounded-full h-12 mt-4"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-spin" /> Generating hashtags...
                </span>
              ) : (
                <>
                  <Hash className="mr-2 h-5 w-5" /> Generate Hashtags
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">Free • No signup • Instant results</p>
          </motion.div>
        )}

        {/* Results */}
        {hashtags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <Heart className="inline h-3.5 w-3.5 text-primary mr-1" />
                Hashtags for <span className="font-semibold text-foreground">{partner1} & {partner2}</span>
              </p>
              <Button variant="outline" size="sm" onClick={copyAll} className="rounded-full text-xs">
                <Copy className="h-3 w-3 mr-1" /> Copy All
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <AnimatePresence>
                {hashtags.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => copyHashtag(h.hashtag, i)}
                    className="group flex items-center justify-between p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-sm cursor-pointer transition-all"
                  >
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {h.hashtag}
                      </p>
                      <Badge variant="outline" className={`mt-1.5 text-[10px] ${categoryColors[h.category] || ""}`}>
                        {h.category}
                      </Badge>
                    </div>
                    <Copy className={`h-4 w-4 flex-shrink-0 transition-colors ${copiedIndex === i ? "text-green-500" : "text-muted-foreground/40 group-hover:text-muted-foreground"}`} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={shareToWhatsApp} size="lg" className="rounded-full bg-green-600 hover:bg-green-700">
                  <Share2 className="mr-2 h-4 w-4" /> Share on WhatsApp
                </Button>
                <Button onClick={() => { setHashtags([]); }} size="lg" variant="outline" className="rounded-full">
                  Try Different Names
                </Button>
              </div>

              {/* CTA */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-center">
                <p className="font-semibold text-lg mb-2">Now plan the rest of your wedding</p>
                <p className="text-muted-foreground text-sm mb-4">Get a complete wedding plan with budget, vendors & timeline</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/plan-wizard">
                    <Button className="rounded-full">
                      <Sparkles className="mr-2 h-4 w-4" /> Get Your Wedding Plan
                    </Button>
                  </Link>
                  <Link to="/invite-creator">
                    <Button variant="outline" className="rounded-full">
                      Create Wedding Invite 💌
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
