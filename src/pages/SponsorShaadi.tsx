import { useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { motion } from "framer-motion";
import {
  Handshake, Gift, Camera, Wine, Flower2, PartyPopper, Music,
  ArrowRight, CheckCircle2, Star, Users, Building2, Sparkles,
  Heart, Crown, Megaphone,
} from "lucide-react";

const sponsorshipPackages = [
  {
    icon: Wine,
    name: "Welcome Drinks",
    range: "₹10K–₹50K",
    desc: "Brand your welcome drinks station — logos on glasses, standees, branded napkins",
    example: "e.g. Coca-Cola, Paper Boat, local juice brand",
  },
  {
    icon: Camera,
    name: "Photo Booth",
    range: "₹25K–₹1L",
    desc: "Branded selfie booth with props, instant prints, and digital sharing with brand watermark",
    example: "e.g. Samsung, Fujifilm, Snapchat",
  },
  {
    icon: Flower2,
    name: "Decor Upgrade",
    range: "₹50K–₹3L",
    desc: "Sponsor premium floral decor, lighting, or a signature installation at the venue",
    example: "e.g. FNP, local decor studios, paint brands",
  },
  {
    icon: Music,
    name: "Entertainment",
    range: "₹30K–₹2L",
    desc: "Sponsor the DJ, live band, or a dance floor setup with branded backdrops",
    example: "e.g. JBL, Spotify, energy drink brands",
  },
  {
    icon: Gift,
    name: "Gift Hampers",
    range: "₹15K–₹75K",
    desc: "Provide branded return gifts, welcome kits, or trousseau items for guests",
    example: "e.g. Forest Essentials, Mamaearth, jewelry brands",
  },
  {
    icon: PartyPopper,
    name: "Full Shaadi Sponsor",
    range: "₹2L–₹5L+",
    desc: "Sponsor an entire wedding element — stage, food, or the complete event for brand visibility",
    example: "e.g. Major FMCG, telecom, or fintech brands",
  },
];

type FormTab = "couple" | "brand";

const SponsorShaadi = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<FormTab>("couple");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [coupleForm, setCoupleForm] = useState({ name: "", phone: "", city: "", weddingDate: "", guestCount: "", interests: "" });
  const [brandForm, setBrandForm] = useState({ brandName: "", contactName: "", phone: "", email: "", budget: "", message: "" });

  const handleCoupleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupleForm.name || !coupleForm.phone || !coupleForm.city) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await supabase.from("contact_inquiries" as any).insert({
        name: coupleForm.name,
        phone: coupleForm.phone,
        email: `sponsor-couple-${coupleForm.city}`,
        message: `Sponsor Shaadi Interest (Couple) | City: ${coupleForm.city} | Date: ${coupleForm.weddingDate} | Guests: ${coupleForm.guestCount} | Interests: ${coupleForm.interests}`,
      });
      setSubmitted(true);
      toast({ title: "Interest Registered! 🎉", description: "We'll connect you with potential sponsors soon." });
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandForm.brandName || !brandForm.contactName || !brandForm.phone) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await supabase.from("contact_inquiries" as any).insert({
        name: brandForm.contactName,
        phone: brandForm.phone,
        email: brandForm.email || `sponsor-brand-${brandForm.brandName}`,
        message: `Sponsor Shaadi Interest (Brand) | Brand: ${brandForm.brandName} | Budget: ${brandForm.budget} | Message: ${brandForm.message}`,
      });
      setSubmitted(true);
      toast({ title: "Thank you! 🤝", description: "Our team will reach out within 24 hours." });
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <MobilePageHeader title="Sponsor Your Shaadi" />
      <SEO
        title="Sponsor Your Shaadi | Get Your Wedding Sponsored | Karlo Shaadi"
        description="Get your wedding sponsored by brands! Free drinks, photo booths, decor upgrades, entertainment & more. Or sponsor weddings to reach 500+ engaged consumers."
      />

      {/* Hero */}
      <section className="relative pt-20 md:pt-28 pb-12 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(340_75%_50%/0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <Crown className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">India's First Wedding Sponsorship Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
              Sponsor Your{" "}
              <span className="text-foreground">
                Shaadi
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-6">
              Couples: Get your wedding elements sponsored by brands — free drinks, decor upgrades, photo booths & more.
              <br className="hidden sm:block" />
              Brands: Reach 500+ engaged consumers at life's most memorable events.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="rounded-full px-8" asChild>
                <a href="#interest-form"><Heart className="h-4 w-4 mr-2" /> I'm a Couple</a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                <a href="#interest-form"><Building2 className="h-4 w-4 mr-2" /> I'm a Brand</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-xl md:text-2xl font-bold text-center text-foreground mb-8">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Couple side */}
            <Card className="border-primary/20">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">For Couples</h3>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "List your wedding details (city, date, guest count)",
                    "Choose what you'd like sponsored (drinks, decor, photo booth...)",
                    "Brands browse & sponsor — you get upgrades for FREE",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[10px]">{i + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Brand side */}
            <Card className="border-accent/20">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Megaphone className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-bold text-foreground">For Brands</h3>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "Browse upcoming weddings by city, size & budget",
                    "Choose a sponsorship package that fits your brand",
                    "Get direct access to 500+ consumers at a single event",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center shrink-0 text-[10px]">{i + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sponsorship Packages */}
      <section className="py-10 md:py-16 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Sponsorship Packages</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">What Can Be Sponsored</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {sponsorshipPackages.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="h-full border-border/50 hover:border-accent/30 hover:shadow-md transition-all">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <pkg.icon className="h-5 w-5 text-accent" />
                      </div>
                      <span className="text-xs font-bold text-primary">{pkg.range}</span>
                    </div>
                    <h3 className="font-bold text-foreground text-sm">{pkg.name}</h3>
                    <p className="text-xs text-muted-foreground">{pkg.desc}</p>
                    <p className="text-[10px] text-accent/80 italic">{pkg.example}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interest Form */}
      <section id="interest-form" className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-lg">
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-5">
              <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Interest Registered!</h2>
              <p className="text-sm text-muted-foreground">Our team will reach out within 24 hours to discuss next steps.</p>
              <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-full">Submit Another</Button>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Register Your Interest</h2>
                <p className="text-sm text-muted-foreground">Tell us who you are — we'll take it from there</p>
              </div>

              {/* Tab toggle */}
              <div className="flex bg-muted rounded-full p-1 mb-6">
                <button
                  onClick={() => setActiveTab("couple")}
                  className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === "couple" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  <Heart className="h-3.5 w-3.5 inline mr-1" /> I'm a Couple
                </button>
                <button
                  onClick={() => setActiveTab("brand")}
                  className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === "brand" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
                >
                  <Building2 className="h-3.5 w-3.5 inline mr-1" /> I'm a Brand
                </button>
              </div>

              {activeTab === "couple" ? (
                <Card className="border-primary/20 shadow-lg">
                  <CardContent className="p-5">
                    <form onSubmit={handleCoupleSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Your Name *</Label>
                        <Input placeholder="Full name" value={coupleForm.name} onChange={e => setCoupleForm(p => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Phone *</Label>
                        <Input placeholder="10-digit number" value={coupleForm.phone} onChange={e => setCoupleForm(p => ({ ...p, phone: e.target.value }))} maxLength={10} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Wedding City *</Label>
                        <Input placeholder="e.g. Delhi, Mumbai" value={coupleForm.city} onChange={e => setCoupleForm(p => ({ ...p, city: e.target.value }))} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Wedding Date</Label>
                          <Input placeholder="e.g. March 2026" value={coupleForm.weddingDate} onChange={e => setCoupleForm(p => ({ ...p, weddingDate: e.target.value }))} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Guest Count</Label>
                          <Input placeholder="e.g. 500" value={coupleForm.guestCount} onChange={e => setCoupleForm(p => ({ ...p, guestCount: e.target.value }))} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">What would you like sponsored?</Label>
                        <Textarea placeholder="e.g. Welcome drinks, Photo booth, Return gifts..." value={coupleForm.interests} onChange={e => setCoupleForm(p => ({ ...p, interests: e.target.value }))} rows={3} />
                      </div>
                      <Button type="submit" className="w-full rounded-full" disabled={loading}>
                        {loading ? "Submitting..." : "Register Interest"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-accent/20 shadow-lg">
                  <CardContent className="p-5">
                    <form onSubmit={handleBrandSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Brand / Company Name *</Label>
                        <Input placeholder="Your brand name" value={brandForm.brandName} onChange={e => setBrandForm(p => ({ ...p, brandName: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Contact Person *</Label>
                        <Input placeholder="Full name" value={brandForm.contactName} onChange={e => setBrandForm(p => ({ ...p, contactName: e.target.value }))} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Phone *</Label>
                          <Input placeholder="10-digit" value={brandForm.phone} onChange={e => setBrandForm(p => ({ ...p, phone: e.target.value }))} maxLength={10} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Email</Label>
                          <Input type="email" placeholder="you@brand.com" value={brandForm.email} onChange={e => setBrandForm(p => ({ ...p, email: e.target.value }))} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Sponsorship Budget Range</Label>
                        <Input placeholder="e.g. ₹50K-₹2L" value={brandForm.budget} onChange={e => setBrandForm(p => ({ ...p, budget: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">What are you looking to sponsor?</Label>
                        <Textarea placeholder="Tell us about your goals..." value={brandForm.message} onChange={e => setBrandForm(p => ({ ...p, message: e.target.value }))} rows={3} />
                      </div>
                      <Button type="submit" className="w-full rounded-full" disabled={loading}>
                        {loading ? "Submitting..." : "Register as Sponsor"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </section>

      {/* Stats / Social Proof */}
      <section className="py-10 md:py-16 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-lg font-bold text-foreground mb-6">Why Sponsor at Weddings?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { stat: "500+", label: "Avg guests per wedding" },
              { stat: "4-5 hrs", label: "Brand exposure time" },
              { stat: "High", label: "Emotional engagement" },
              { stat: "₹10K", label: "Starts from" },
            ].map((item, i) => (
              <div key={i} className="text-center p-4">
                <p className="text-2xl font-bold text-accent">{item.stat}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SponsorShaadi;
