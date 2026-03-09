import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { motion } from "framer-motion";
import {
  Mic, Shirt, Bell, ArrowRight, CheckCircle2,
  Sparkles, Headphones, ShoppingBag,
} from "lucide-react";

const merchConcepts = [
  {
    name: '"?" T-shirt',
    desc: "The iconic Karlo Shaadi question mark — wear the mystery, start conversations",
    color: "bg-foreground text-background",
    symbol: "?",
  },
  {
    name: '"Ho Gayi Shaadi?" T-shirt',
    desc: "The ultimate flex after your wedding day — let everyone know it's done!",
    color: "bg-primary text-primary-foreground",
    symbol: "💍",
  },
  {
    name: '"Karlo Shaadi" T-shirt',
    desc: "Classic brand tee — bold, simple, iconic. Perfect for the wedding season",
    color: "bg-accent text-accent-foreground",
    symbol: "❤️",
  },
  {
    name: '"Shaadi Ka Season" Hoodie',
    desc: "Cozy merch for winter wedding season — gifting & event crew essential",
    color: "bg-secondary text-secondary-foreground",
    symbol: "🎊",
  },
];

const podcastHighlights = [
  "Real stories from newlywed couples & influencers",
  "Behind-the-scenes of India's biggest weddings",
  "Vendor secrets: what they don't tell you",
  "Budget breakdowns that actually help",
  "Celebrity guest episodes every month",
];

const ComingSoon = () => {
  const { toast } = useToast();
  const [podcastEmail, setPodcastEmail] = useState("");
  const [merchEmail, setMerchEmail] = useState("");
  const [podcastSubmitted, setPodcastSubmitted] = useState(false);
  const [merchSubmitted, setMerchSubmitted] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleWaitlist = async (type: "podcast" | "merch") => {
    const email = type === "podcast" ? podcastEmail : merchEmail;
    if (!email || !email.includes("@")) {
      toast({ title: "Enter a valid email", variant: "destructive" });
      return;
    }
    setLoading(type);
    try {
      await supabase.from("contact_inquiries" as any).insert({
        name: `Waitlist: ${type}`,
        email,
        message: `${type === "podcast" ? "Podcast" : "Merch"} waitlist signup`,
      });
      if (type === "podcast") setPodcastSubmitted(true);
      else setMerchSubmitted(true);
      toast({ title: "You're on the list! 🎉", description: "We'll notify you as soon as we launch." });
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-foreground/[0.02] via-background to-primary/5 pb-24">
      <MobilePageHeader title="Coming Soon" />
      <SEO
        title="Coming Soon — Podcast & Merch | Karlo Shaadi"
        description="Karlo Shaadi Podcast with celeb/influencer guests & exclusive merch collection. Join the waitlist!"
      />

      {/* Hero */}
      <section className="relative pt-20 md:pt-28 pb-10 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(340_75%_50%/0.06)_0%,transparent_50%)]" />
        <div className="container mx-auto px-4 sm:px-6 relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Coming Soon</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
              Something{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Exciting
              </span>{" "}
              Is Brewing
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Two brand-new ways to experience Karlo Shaadi — beyond wedding planning.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Podcast Section */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-primary/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center">
                      <Headphones className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-foreground">Karlo Shaadi Podcast</h2>
                      <p className="text-xs text-muted-foreground">Real stories from real shaadis</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-5">
                    Unfiltered conversations with newly married celebrity & influencer couples,
                    top wedding vendors, and real couples sharing their wildest wedding stories.
                  </p>

                  <div className="space-y-2 mb-6">
                    {podcastHighlights.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <Mic className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {podcastSubmitted ? (
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-3 rounded-xl">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm font-medium">You're on the waitlist! We'll email you when we launch.</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="your@email.com"
                        type="email"
                        value={podcastEmail}
                        onChange={e => setPodcastEmail(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleWaitlist("podcast")}
                        disabled={loading === "podcast"}
                        className="rounded-full shrink-0"
                      >
                        <Bell className="h-4 w-4 mr-1" />
                        {loading === "podcast" ? "..." : "Notify Me"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Merch Section */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
                <ShoppingBag className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent">Merch Collection</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-foreground">Karlo Shaadi Merch</h2>
              <p className="text-sm text-muted-foreground">Wear the vibe. Start conversations.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {merchConcepts.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full border-border/50 hover:border-accent/30 transition-colors overflow-hidden">
                    <CardContent className="p-0">
                      <div className={`${item.color} h-28 flex items-center justify-center`}>
                        <span className="text-4xl font-black">{item.symbol}</span>
                      </div>
                      <div className="p-3 space-y-1">
                        <h3 className="font-bold text-foreground text-xs">{item.name}</h3>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {merchSubmitted ? (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-3 rounded-xl justify-center">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">You're on the merch waitlist!</span>
              </div>
            ) : (
              <Card className="border-accent/20">
                <CardContent className="p-4">
                  <p className="text-sm text-foreground font-medium mb-3 text-center">
                    <Shirt className="h-4 w-4 inline mr-1 text-accent" />
                    Get notified when merch drops
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="your@email.com"
                      type="email"
                      value={merchEmail}
                      onChange={e => setMerchEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleWaitlist("merch")}
                      disabled={loading === "merch"}
                      variant="accent"
                      className="rounded-full shrink-0"
                    >
                      <Bell className="h-4 w-4 mr-1" />
                      {loading === "merch" ? "..." : "Notify Me"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ComingSoon;
