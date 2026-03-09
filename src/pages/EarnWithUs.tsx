import { useState } from "react";
import { Link } from "react-router-dom";

import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import {
  Gift, Trophy, Plane, Smartphone, Laptop, Banknote,
  Users, ArrowRight, Sparkles, Star, CheckCircle2, Send, PartyPopper,
  Megaphone, QrCode, Building2, Instagram, Copy, Share2, MessageCircle,
  TrendingUp, HandCoins, MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";

import prizeMaldives from "@/assets/prize-maldives.png";
import prizeDubai from "@/assets/prize-dubai.png";
import prizeSafari from "@/assets/prize-safari.png";
import prizeIphone from "@/assets/prize-iphone.png";
import prizeMacbook from "@/assets/prize-macbook.png";
import prizeCash1L from "@/assets/prize-cash-1l.png";
import prizeCash50K from "@/assets/prize-cash-50k.png";
import prizeMore from "@/assets/prize-more.png";

const leadSchema = z.object({
  referrerName: z.string().trim().min(2, "Name is required").max(100),
  referrerPhone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit phone number"),
  referrerEmail: z.string().trim().email("Enter valid email").max(255).optional().or(z.literal("")),
  referredName: z.string().trim().min(2, "Name is required").max(100),
  referredPhone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit phone number"),
  weddingMonth: z.string().optional(),
  relation: z.string().min(1, "Select how you know them"),
});

const prizes = [
  { image: prizeMaldives, label: "Trip to Maldives" },
  { image: prizeDubai, label: "Trip to Dubai" },
  { image: prizeSafari, label: "Tata Safari" },
  { image: prizeIphone, label: "iPhone 17 Pro Max" },
  { image: prizeMacbook, label: "MacBook M4" },
  { image: prizeCash1L, label: "₹1 Lakh Cash" },
  { image: prizeCash50K, label: "₹50,000 Cash" },
  { image: prizeMore, label: "...and much more!" },
];

const earningMethods = [
  {
    icon: Gift,
    tag: "Easiest",
    tagColor: "bg-green-100 text-green-700",
    title: "Refer a Couple",
    hindiHook: "Shaadi ho rahi hai? Batao aur kamao!",
    earning: "₹500–₹2,000 per conversion",
    desc: "Know someone getting married? Just share their details — if they book through Karlo Shaadi, you earn cash + enter monthly mega prize draw.",
    steps: ["Fill the form below with couple's details", "We reach out and help them plan", "They book → you earn ₹500-₹2,000"],
  },
  {
    icon: QrCode,
    tag: "Creative",
    tagColor: "bg-accent/15 text-accent-foreground",
    title: "Promote at Shaadi",
    hindiHook: "Shaadi attend karo, promote karo, earn karo!",
    earning: "₹100 per scan/signup",
    desc: "Attending a wedding? Share your unique QR code or branded content. Every guest who scans and signs up = money in your pocket.",
    steps: ["Get your personal QR code from dashboard", "Share at weddings, WhatsApp groups, Instagram", "Earn ₹100 for every new signup"],
  },
  {
    icon: Building2,
    tag: "High Earner",
    tagColor: "bg-primary/10 text-primary",
    title: "Become a Local Partner",
    hindiHook: "₹20,000–₹50,000 mahine kamao ghar baithe",
    earning: "₹20K–₹50K/month",
    desc: "Know local wedding vendors — photographers, decorators, caterers? Connect them to Karlo Shaadi and earn a recurring commission on every vendor you onboard.",
    steps: ["Apply as a City Partner (free)", "Connect local vendors to the platform", "Earn ₹500-₹2,000 per vendor onboarded + recurring %"],
  },
];

const reelScripts = [
  {
    hook: "₹20,000-50,000 mahine kamao ghar baithe",
    script: "Suno, agar tumhare area mein photographers, decorators, caterers hain — toh unko Karlo Shaadi pe register karwao. Har vendor pe commission milega, recurring! Link bio mein hai. 💰",
    hashtags: "#KarloShaadi #EarnFromHome #WeddingBusiness #SideHustle",
  },
  {
    hook: "Shaadi mein jaake paise kamao? Haan, seriously!",
    script: "Next shaadi mein QR code share karo, har scan pe ₹100 kamao. Plus, agar couple book karta hai toh ₹2,000 tak milega. Free mein start karo — link bio mein! 🎉",
    hashtags: "#ShaadiSeason #EarnOnline #PassiveIncome #KarloShaadi",
  },
  {
    hook: "Tumhare dost ki shaadi hone wali hai? Paisa kamao!",
    script: "Kisi ki shaadi ho rahi hai? Unka naam aur number share karo Karlo Shaadi pe. Agar woh book karte hain, tumhe milega ₹500-₹2,000 PLUS monthly prizes mein Maldives trip! 🏝️",
    hashtags: "#ReferAndEarn #WeddingPlanning #FreeMoney #KarloShaadi",
  },
];

const relations = [
  { value: "friend", label: "Friend" },
  { value: "family", label: "Family / Relative" },
  { value: "neighbor", label: "Neighbor" },
  { value: "colleague", label: "Colleague" },
  { value: "acquaintance", label: "Acquaintance" },
  { value: "other", label: "Other" },
];

const EarnWithUs = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [form, setForm] = useState({
    referrerName: "",
    referrerPhone: "",
    referrerEmail: "",
    referredName: "",
    referredPhone: "",
    weddingMonth: "",
    relation: "",
  });

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const copyScript = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast({ title: "Copied! 📋", description: "Reel script copied to clipboard" });
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = leadSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from("lead_referrals" as any).insert({
        referrer_name: form.referrerName.trim(),
        referrer_phone: form.referrerPhone.trim(),
        referrer_email: form.referrerEmail.trim() || null,
        referred_name: form.referredName.trim(),
        referred_phone: form.referredPhone.trim(),
        wedding_month: form.weddingMonth || null,
        relation: form.relation,
        user_id: user?.id || null,
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Referral Submitted! 🎉",
        description: "You're now in the running for mega prizes!",
      });
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: err.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/5 via-background to-primary/5 pb-24">
      <MobilePageHeader title="Earn with Karlo Shaadi" />
      <SEO
        title="Shaadi Promote Karo, Paisa Kamao | Karlo Shaadi"
        description="3 ways to earn with Karlo Shaadi — refer couples, promote at shaadis, become a local partner. Win Maldives trips, iPhones, cars & cash every month!"
      />

      {/* Hero */}
      <section className="relative pt-20 md:pt-28 pb-12 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(38_90%_55%/0.15)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-5">
              <HandCoins className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">3 Ways to Earn</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
              Shaadi Promote Karo,{" "}
              <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                Paisa Kamao
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-3">
              Shaadi attend karo, promote karo, earn karo — ₹500 se lekar ₹50,000/month tak kamao.
              Plus monthly mega prizes mein Maldives trip, iPhone, MacBook aur bahut kuch!
            </p>
            <p className="text-xs text-muted-foreground/70 mb-6">No signup needed · 100% free · Start in 2 minutes</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="rounded-full px-8" asChild>
                <a href="#referral-form">
                  <Send className="h-4 w-4 mr-2" /> Refer a Couple Now
                </a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                <a href="#earning-methods">
                  <TrendingUp className="h-4 w-4 mr-2" /> See All Earning Ways
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3 Earning Methods */}
      <section id="earning-methods" className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-3xl font-bold text-foreground mb-2">
              Choose Your Earning Style
            </h2>
            <p className="text-sm text-muted-foreground">Pick one, or do all three — it's up to you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {earningMethods.map((method, i) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <Card className="h-full border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
                        <method.icon className="h-5 w-5 text-accent" />
                      </div>
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${method.tagColor}`}>
                        {method.tag}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base">{method.title}</h3>
                      <p className="text-xs text-accent font-medium italic mt-0.5">"{method.hindiHook}"</p>
                    </div>
                    <div className="text-xs font-bold text-primary bg-primary/8 px-3 py-1.5 rounded-lg w-fit">
                      {method.earning}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{method.desc}</p>
                    <div className="space-y-2 pt-2 border-t border-border/50">
                      {method.steps.map((step, si) => (
                        <div key={si} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="w-5 h-5 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center shrink-0 text-[10px]">
                            {si + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Showcase */}
      <section className="py-12 md:py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Monthly Mega Prizes</span>
            </div>
            <h2 className="text-xl md:text-3xl font-bold text-foreground">
              Refer Karo, Jeetne Ka Mauka Pao
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {prizes.map((prize, i) => (
              <motion.div
                key={prize.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-4 text-center space-y-2">
                    <img src={prize.image} alt={prize.label} className="mx-auto w-14 h-14 object-contain" />
                    <p className="font-semibold text-xs text-foreground">{prize.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            <Star className="inline h-3.5 w-3.5 text-accent mr-1" />
            Winners announced every month. More referrals = higher chances!
          </p>
        </div>
      </section>

      {/* Instagram Reel Scripts */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Instagram className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Ready-Made Content</span>
            </div>
            <h2 className="text-xl md:text-3xl font-bold text-foreground mb-2">
              Instagram Reel Scripts — Copy & Post
            </h2>
            <p className="text-sm text-muted-foreground">
              Use these viral hooks to promote and earn. Just copy, record, post!
            </p>
          </div>
          <div className="space-y-4">
            {reelScripts.map((reel, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-border/50 hover:border-primary/20 transition-colors">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-primary mb-1">Hook #{i + 1}</p>
                        <p className="font-bold text-foreground text-sm">"{reel.hook}"</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="shrink-0"
                        onClick={() => copyScript(i, `${reel.hook}\n\n${reel.script}\n\n${reel.hashtags}`)}
                      >
                        {copiedIdx === i ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{reel.script}</p>
                    <p className="text-[10px] text-accent font-medium">{reel.hashtags}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Form */}
      <section id="referral-form" className="py-12 md:py-20 bg-gradient-to-b from-card/50 to-accent/5">
        <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-3xl font-bold text-foreground mb-2">
              {submitted ? "Referral Submitted! 🎉" : "Kisi Ki Shaadi Ho Rahi Hai?"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {submitted
                ? "Your referral has been recorded. Keep referring to increase your chances!"
                : "Fill the form — no signup needed. Takes 30 seconds!"
              }
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <div className="space-y-3">
                <Button onClick={() => { setSubmitted(false); setForm({ referrerName: "", referrerPhone: "", referrerEmail: "", referredName: "", referredPhone: "", weddingMonth: "", relation: "" }); }}>
                  Refer Another Person
                </Button>
                <p className="text-sm text-muted-foreground">
                  Already a user?{" "}
                  <Link to="/referrals" className="text-accent underline">Track your referrals</Link>
                </p>
              </div>
            </motion.div>
          ) : (
            <Card className="border-accent/20 shadow-lg">
              <CardContent className="p-5 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-accent" /> Your Details
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="referrerName" className="text-xs">Your Name *</Label>
                        <Input id="referrerName" placeholder="Your full name" value={form.referrerName} onChange={e => updateField("referrerName", e.target.value)} />
                        {errors.referrerName && <p className="text-xs text-destructive">{errors.referrerName}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="referrerPhone" className="text-xs">Your Phone *</Label>
                        <Input id="referrerPhone" placeholder="10-digit number" value={form.referrerPhone} onChange={e => updateField("referrerPhone", e.target.value)} maxLength={10} />
                        {errors.referrerPhone && <p className="text-xs text-destructive">{errors.referrerPhone}</p>}
                      </div>
                      <div className="sm:col-span-2 space-y-1.5">
                        <Label htmlFor="referrerEmail" className="text-xs">Your Email (optional)</Label>
                        <Input id="referrerEmail" type="email" placeholder="your@email.com" value={form.referrerEmail} onChange={e => updateField("referrerEmail", e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
                      <Gift className="h-4 w-4 text-accent" /> Person Getting Married
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="referredName" className="text-xs">Their Name *</Label>
                        <Input id="referredName" placeholder="Full name" value={form.referredName} onChange={e => updateField("referredName", e.target.value)} />
                        {errors.referredName && <p className="text-xs text-destructive">{errors.referredName}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="referredPhone" className="text-xs">Their Phone *</Label>
                        <Input id="referredPhone" placeholder="10-digit number" value={form.referredPhone} onChange={e => updateField("referredPhone", e.target.value)} maxLength={10} />
                        {errors.referredPhone && <p className="text-xs text-destructive">{errors.referredPhone}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="weddingMonth" className="text-xs">Wedding Month/Year</Label>
                        <Input id="weddingMonth" placeholder="e.g. March 2026" value={form.weddingMonth} onChange={e => updateField("weddingMonth", e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">How do you know them? *</Label>
                        <Select value={form.relation} onValueChange={v => updateField("relation", v)}>
                          <SelectTrigger><SelectValue placeholder="Select relation" /></SelectTrigger>
                          <SelectContent>
                            {relations.map(r => (
                              <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.relation && <p className="text-xs text-destructive">{errors.relation}</p>}
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full rounded-full" size="lg" disabled={loading}>
                    {loading ? "Submitting..." : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" /> Submit Referral & Enter Contest
                      </span>
                    )}
                  </Button>

                  <p className="text-[10px] text-center text-muted-foreground">
                    By submitting, you agree to our{" "}
                    <Link to="/legal" className="underline">Terms</Link> &{" "}
                    <Link to="/privacy" className="underline">Privacy Policy</Link>.
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center space-y-4">
          <p className="text-muted-foreground text-sm">
            Already a Karlo Shaadi user? Track your referrals and earnings.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" className="rounded-full px-6" asChild>
              <Link to="/referrals">
                <TrendingUp className="h-4 w-4 mr-2" /> Referral Dashboard
              </Link>
            </Button>
            <Button variant="ghost" className="rounded-full px-6" asChild>
              <Link to="/for-vendors">
                <Building2 className="h-4 w-4 mr-2" /> Register Your Business
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EarnWithUs;
