import { useState } from "react";
import { Link } from "react-router-dom";
import { BhindiFooter } from "@/components/BhindiFooter";
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
  Gift, Trophy, Plane, Car, Smartphone, Laptop, Banknote,
  Users, ArrowRight, Sparkles, Star, CheckCircle2, Send, PartyPopper,
} from "lucide-react";
import { motion } from "framer-motion";

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
  { icon: Plane, label: "Trip to Maldives", color: "from-cyan-500 to-blue-600" },
  { icon: Plane, label: "Trip to Dubai", color: "from-amber-500 to-orange-600" },
  { icon: Car, label: "Tata Safari", color: "from-emerald-500 to-green-700" },
  { icon: Smartphone, label: "iPhone 17 Pro Max", color: "from-violet-500 to-purple-700" },
  { icon: Laptop, label: "MacBook M4", color: "from-slate-500 to-zinc-700" },
  { icon: Banknote, label: "₹1 Lakh Cash", color: "from-yellow-500 to-amber-600" },
  { icon: Banknote, label: "₹50,000 Cash", color: "from-rose-500 to-red-600" },
  { icon: Gift, label: "...and much more!", color: "from-pink-500 to-fuchsia-600" },
];

const steps = [
  { icon: Users, title: "Know Someone Getting Married?", desc: "Share the details of the couple through our simple form below" },
  { icon: CheckCircle2, title: "They Book Through Us", desc: "If the couple books any vendor via Karlo Shaadi, you become eligible" },
  { icon: Trophy, title: "Win Mega Prizes Monthly", desc: "Top referrers win trips, cars, gadgets, and cash prizes every month!" },
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50/60 via-white to-rose-50/40">
      <SEO
        title="Earn with Karlo Shaadi | Win Trips, Cars & Cash Prizes"
        description="Know someone getting married? Refer them to Karlo Shaadi and win trips to Maldives, Dubai, Tata Safari, iPhone 17 Pro Max, MacBook M4, and cash prizes every month!"
      />

      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(38_90%_55%/0.12)_0%,transparent_60%)]" />
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
              <PartyPopper className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Winners announced every month</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
              Earn with{" "}
              <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                Karlo Shaadi
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Turn your connections into incredible rewards. Refer couples getting married and win
              trips, cars, gadgets, and cash prizes — every single month.
            </p>
            <Button size="lg" className="rounded-full px-8 text-base" asChild>
              <a href="#referral-form">
                <span className="flex items-center gap-2">
                  Start Referring Now <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center space-y-4"
              >
                <div className="mx-auto w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <step.icon className="h-7 w-7 text-accent" />
                </div>
                <div className="text-2xl font-bold text-accent/60">0{i + 1}</div>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">Monthly Prizes</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              What You Can Win
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {prizes.map((prize, i) => (
              <motion.div
                key={prize.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-5 text-center space-y-3">
                    <div className={`mx-auto w-12 h-12 rounded-xl bg-gradient-to-br ${prize.color} flex items-center justify-center shadow-lg`}>
                      <prize.icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-semibold text-sm text-foreground">{prize.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            <Star className="inline h-4 w-4 text-accent mr-1" />
            Winners announced every month starting now. The more you refer, the higher your chances!
          </p>
        </div>
      </section>

      {/* Referral Form */}
      <section id="referral-form" className="py-20 bg-gradient-to-b from-white/50 to-amber-50/30">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {submitted ? "Thank You! 🎉" : "Submit a Referral"}
            </h2>
            <p className="text-muted-foreground">
              {submitted
                ? "Your referral has been recorded. Keep referring more to increase your chances!"
                : "Know someone who's getting married? Fill in the details below — no signup needed!"
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
                  Already a Karlo Shaadi user?{" "}
                  <Link to="/referrals" className="text-accent underline">Track your referrals</Link>
                </p>
              </div>
            </motion.div>
          ) : (
            <Card className="border-accent/20 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Your Details */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Users className="h-4 w-4 text-accent" /> Your Details
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="referrerName">Your Name *</Label>
                        <Input id="referrerName" placeholder="Your full name" value={form.referrerName} onChange={e => updateField("referrerName", e.target.value)} />
                        {errors.referrerName && <p className="text-xs text-destructive">{errors.referrerName}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="referrerPhone">Your Phone *</Label>
                        <Input id="referrerPhone" placeholder="10-digit number" value={form.referrerPhone} onChange={e => updateField("referrerPhone", e.target.value)} maxLength={10} />
                        {errors.referrerPhone && <p className="text-xs text-destructive">{errors.referrerPhone}</p>}
                      </div>
                      <div className="sm:col-span-2 space-y-1.5">
                        <Label htmlFor="referrerEmail">Your Email (optional)</Label>
                        <Input id="referrerEmail" type="email" placeholder="your@email.com" value={form.referrerEmail} onChange={e => updateField("referrerEmail", e.target.value)} />
                        {errors.referrerEmail && <p className="text-xs text-destructive">{errors.referrerEmail}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Referred Person */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Gift className="h-4 w-4 text-accent" /> Person Getting Married
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="referredName">Their Name *</Label>
                        <Input id="referredName" placeholder="Full name" value={form.referredName} onChange={e => updateField("referredName", e.target.value)} />
                        {errors.referredName && <p className="text-xs text-destructive">{errors.referredName}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="referredPhone">Their Phone *</Label>
                        <Input id="referredPhone" placeholder="10-digit number" value={form.referredPhone} onChange={e => updateField("referredPhone", e.target.value)} maxLength={10} />
                        {errors.referredPhone && <p className="text-xs text-destructive">{errors.referredPhone}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="weddingMonth">Wedding Month/Year</Label>
                        <Input id="weddingMonth" placeholder="e.g. March 2026" value={form.weddingMonth} onChange={e => updateField("weddingMonth", e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>How do you know them? *</Label>
                        <Select value={form.relation} onValueChange={v => updateField("relation", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relation" />
                          </SelectTrigger>
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
                    {loading ? (
                      <span className="flex items-center gap-2">Submitting...</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" /> Submit Referral & Enter Contest
                      </span>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
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

      {/* CTA for existing users */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground mb-4">
            Already a Karlo Shaadi user? Track all your referrals and earnings in one place.
          </p>
          <Button variant="outline" className="rounded-full" asChild>
            <Link to="/referrals">
              <span className="flex items-center gap-2">Go to Referral Dashboard <ArrowRight className="h-4 w-4" /></span>
            </Link>
          </Button>
        </div>
      </section>

      <BhindiFooter />
    </div>
  );
};

export default EarnWithUs;
