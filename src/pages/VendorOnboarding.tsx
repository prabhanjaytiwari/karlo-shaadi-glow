import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, MapPin, Users, Calendar, Phone, Instagram, Facebook, 
  Upload, Loader2, Globe, Map, IndianRupee, MessageCircle, 
  Camera, Utensils, Music, Palette, Sparkles, Crown, Mic2, 
  Video, Gem, BookOpen, Car, Flower2, ChevronRight, ChevronLeft, 
  Check, Pen, Shield, Star, Zap, Heart, PartyPopper, ArrowRight
} from "lucide-react";
import { sanitizeInput } from "@/lib/validation";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Database } from "@/integrations/supabase/types";

// ── Validation Schemas ──
const step2Schema = z.object({
  businessName: z.string().trim().min(3, "Business name must be at least 3 characters").max(100),
  cityId: z.string().min(1, "City is required"),
});

const step3Schema = z.object({
  description: z.string().trim().min(20, "Description must be at least 20 characters").max(500),
});

// ── Category Config ──
type VendorCategory = Database["public"]["Enums"]["vendor_category"];

interface CategoryCard {
  value: VendorCategory;
  label: string;
  tagline: string;
  icon: React.ReactNode;
  color: string;
}

const CATEGORIES: CategoryCard[] = [
  { value: "photography", label: "Photography", tagline: "Capture the magic forever", icon: <Camera className="w-6 h-6" />, color: "from-rose-500/20 to-pink-500/20" },
  { value: "venues", label: "Venues", tagline: "The perfect backdrop", icon: <Building2 className="w-6 h-6" />, color: "from-amber-500/20 to-orange-500/20" },
  { value: "catering", label: "Catering", tagline: "Flavours they'll remember", icon: <Utensils className="w-6 h-6" />, color: "from-emerald-500/20 to-green-500/20" },
  { value: "decoration", label: "Decoration", tagline: "Transform any space", icon: <Flower2 className="w-6 h-6" />, color: "from-violet-500/20 to-purple-500/20" },
  { value: "makeup", label: "Makeup", tagline: "Bridal beauty experts", icon: <Sparkles className="w-6 h-6" />, color: "from-pink-500/20 to-rose-500/20" },
  { value: "mehendi", label: "Mehendi", tagline: "Intricate artistry", icon: <Palette className="w-6 h-6" />, color: "from-orange-500/20 to-amber-500/20" },
  { value: "music", label: "Music & DJ", tagline: "Set the vibe right", icon: <Music className="w-6 h-6" />, color: "from-blue-500/20 to-indigo-500/20" },
  { value: "cakes", label: "Cakes & Desserts", tagline: "Sweet celebrations", icon: <Heart className="w-6 h-6" />, color: "from-red-500/20 to-rose-500/20" },
  { value: "planning", label: "Wedding Planning", tagline: "Stress-free weddings", icon: <BookOpen className="w-6 h-6" />, color: "from-teal-500/20 to-cyan-500/20" },
  { value: "invitations", label: "Invitations", tagline: "First impressions count", icon: <Pen className="w-6 h-6" />, color: "from-fuchsia-500/20 to-pink-500/20" },
  { value: "choreography", label: "Choreography", tagline: "Dance to remember", icon: <Zap className="w-6 h-6" />, color: "from-yellow-500/20 to-amber-500/20" },
  { value: "transport", label: "Transport", tagline: "Arrive in style", icon: <Car className="w-6 h-6" />, color: "from-slate-500/20 to-gray-500/20" },
  { value: "jewelry", label: "Jewelry", tagline: "Adorn the occasion", icon: <Gem className="w-6 h-6" />, color: "from-yellow-500/20 to-orange-500/20" },
  { value: "pandit", label: "Pandit", tagline: "Sacred ceremonies", icon: <Crown className="w-6 h-6" />, color: "from-orange-500/20 to-red-500/20" },
  { value: "entertainment", label: "Entertainment", tagline: "Unforgettable moments", icon: <Star className="w-6 h-6" />, color: "from-indigo-500/20 to-blue-500/20" },
  { value: "anchor", label: "Anchor / Emcee", tagline: "Host the celebration", icon: <Mic2 className="w-6 h-6" />, color: "from-cyan-500/20 to-teal-500/20" },
  { value: "content-creator", label: "Content Creator", tagline: "Stories that trend", icon: <Video className="w-6 h-6" />, color: "from-pink-500/20 to-purple-500/20" },
  { value: "social-media-managers", label: "Social Media Manager", tagline: "Viral shaadi content", icon: <Instagram className="w-6 h-6" />, color: "from-gradient-500/20 to-rose-500/20" },
  { value: "influencer", label: "Influencer", tagline: "Amplify your reach", icon: <Sparkles className="w-6 h-6" />, color: "from-purple-500/20 to-fuchsia-500/20" },
];

// ── Step Config ──
const STEPS = [
  { num: 1, label: "Category", icon: <Palette className="w-4 h-4" /> },
  { num: 2, label: "Business", icon: <Building2 className="w-4 h-4" /> },
  { num: 3, label: "Story", icon: <Pen className="w-4 h-4" /> },
  { num: 4, label: "Contact", icon: <Phone className="w-4 h-4" /> },
  { num: 5, label: "Review", icon: <Check className="w-4 h-4" /> },
];

const PRICE_SUGGESTIONS: Record<string, string> = {
  photography: "25,000",
  venues: "2,00,000",
  catering: "800/plate",
  decoration: "50,000",
  makeup: "15,000",
  mehendi: "5,000",
  music: "20,000",
  cakes: "5,000",
  planning: "1,00,000",
  invitations: "50/card",
  choreography: "15,000",
  transport: "10,000",
  jewelry: "50,000",
  pandit: "11,000",
  entertainment: "25,000",
  anchor: "20,000",
  "content-creator": "15,000",
  "social-media-managers": "20,000",
  influencer: "25,000",
};

const STORAGE_KEY = "ks_vendor_onboarding_draft";

const GENDER_CATEGORIES = ["makeup", "photography", "mehendi"];

export default function VendorOnboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [cities, setCities] = useState<any[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [sameAsPhone, setSameAsPhone] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    businessName: "",
    cityId: "",
    yearsExperience: "",
    startingPrice: "",
    genderPreference: "",
    description: "",
    teamSize: "",
    phoneNumber: "",
    whatsappNumber: "",
    instagramHandle: "",
    facebookPage: "",
    googleMapsLink: "",
    websiteUrl: "",
    address: "",
  });

  const totalSteps = 5;

  // ── Load saved draft ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      }
    } catch {}
  }, []);

  // ── Auto-save to localStorage ──
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch {}
  }, [formData]);

  useEffect(() => {
    checkExistingVendor();
    loadCities();
  }, []);

  const checkExistingVendor = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: vendorData } = await supabase
      .from("vendors").select("id").eq("user_id", user.id).maybeSingle();
    if (vendorData) {
      toast({ title: "Already Registered", description: "Redirecting to your dashboard." });
      navigate("/vendor/dashboard");
    }
  };

  const loadCities = async () => {
    const { data } = await supabase.from("cities").select("*").eq("is_active", true);
    if (data) setCities(data);
  };

  const updateField = useCallback((field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === "phoneNumber" && sameAsPhone) {
        updated.whatsappNumber = value;
      }
      return updated;
    });
  }, [sameAsPhone]);

  // ── Logo ──
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ title: "File too large", description: "Logo must be under 2MB", variant: "destructive" });
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (userId: string): Promise<string | null> => {
    if (!logoFile) return null;
    const fileExt = logoFile.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('vendor-logos').upload(fileName, logoFile);
    if (error) { console.error("Logo upload error:", error); return null; }
    const { data: { publicUrl } } = supabase.storage.from('vendor-logos').getPublicUrl(fileName);
    return publicUrl;
  };

  // ── AI Description Template ──
  const generateDescription = () => {
    const cat = CATEGORIES.find(c => c.value === formData.category);
    const city = cities.find(c => c.id === formData.cityId);
    const exp = formData.yearsExperience ? `${formData.yearsExperience} years` : "several years";
    const template = `We are a professional ${cat?.label || "wedding"} service provider based in ${city?.name || "India"} with ${exp} of experience in the wedding industry. Our team is dedicated to making every celebration special with personalised attention to detail and creative excellence. We take pride in understanding each couple's unique vision and bringing it to life beautifully.`;
    updateField("description", template);
  };

  // ── Navigation ──
  const nextStep = () => {
    if (step === 1 && !formData.category) {
      toast({ title: "Select a category", description: "Tap on your service type to continue", variant: "destructive" });
      return;
    }
    if (step === 2) {
      const result = step2Schema.safeParse({ businessName: formData.businessName, cityId: formData.cityId });
      if (!result.success) {
        toast({ title: "Missing info", description: result.error.errors[0]?.message, variant: "destructive" });
        return;
      }
    }
    if (step === 3) {
      const result = step3Schema.safeParse({ description: formData.description });
      if (!result.success) {
        toast({ title: "Missing info", description: result.error.errors[0]?.message, variant: "destructive" });
        return;
      }
    }
    setDirection(1);
    setStep(s => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(s => Math.max(s - 1, 1));
  };

  const jumpToStep = (target: number) => {
    setDirection(target > step ? 1 : -1);
    setStep(target);
  };

  // ── Submit ──
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let logoUrl = null;
      if (logoFile) logoUrl = await uploadLogo(user.id);

      const { error: vendorError } = await supabase.from("vendors").insert([{
        user_id: user.id,
        business_name: sanitizeInput(formData.businessName.trim()),
        category: formData.category as VendorCategory,
        city_id: formData.cityId || null,
        description: sanitizeInput(formData.description.trim()),
        years_experience: parseInt(formData.yearsExperience) || 0,
        team_size: parseInt(formData.teamSize) || null,
        website_url: formData.websiteUrl ? sanitizeInput(formData.websiteUrl.trim()) : null,
        instagram_handle: formData.instagramHandle ? sanitizeInput(formData.instagramHandle.trim()) : null,
        facebook_page: formData.facebookPage ? sanitizeInput(formData.facebookPage.trim()) : null,
        google_maps_link: formData.googleMapsLink ? sanitizeInput(formData.googleMapsLink.trim()) : null,
        phone_number: formData.phoneNumber ? sanitizeInput(formData.phoneNumber.trim()) : null,
        whatsapp_number: formData.whatsappNumber ? sanitizeInput(formData.whatsappNumber.trim()) : null,
        address: formData.address ? sanitizeInput(formData.address.trim()) : null,
        starting_price: formData.startingPrice ? parseInt(formData.startingPrice.replace(/,/g, "")) : null,
        gender_preference: formData.genderPreference || null,
        logo_url: logoUrl,
        verification_status: 'pending',
      }]);

      if (vendorError) throw vendorError;

      localStorage.removeItem(STORAGE_KEY);
      setShowSuccess(true);
      setTimeout(() => navigate("/vendor/dashboard"), 3000);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ──
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-accent/10 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6"
          >
            <PartyPopper className="w-12 h-12 text-primary-foreground" />
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-3xl font-bold text-foreground mb-3">
            Welcome Aboard! 🎉
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-muted-foreground mb-6">
            Your vendor profile has been created successfully. Our team will verify your profile within <strong>24–48 hours</strong>.
          </motion.p>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-primary" /> Free forever</span>
            <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-accent" /> Zero commission</span>
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-primary" /> Priority leads</span>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
            <Button onClick={() => navigate("/vendor/dashboard")} className="mt-8" size="lg">
              Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const selectedCategory = CATEGORIES.find(c => c.value === formData.category);
  const selectedCity = cities.find(c => c.id === formData.cityId);

  // ── Slide animation ──
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-accent/10">
      <MobilePageHeader title="Become a Vendor" />
      <div className={isMobile ? "px-4 pt-4 pb-36" : "py-10 px-4"}>
        <div className="max-w-2xl mx-auto">

          {/* ── Header ── */}
          <div className="text-center mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">For Wedding Professionals</p>
            <h1 className={`font-bold mb-1 ${isMobile ? "text-2xl" : "text-3xl"}`}>
              Register Your Business
            </h1>
            <p className="text-sm text-muted-foreground">
              Join 10,000+ vendors already growing with Karlo Shaadi
            </p>
          </div>

          {/* ── Stepper ── */}
          <div className="flex items-center justify-between mb-8 px-1">
            {STEPS.map((s, i) => {
              const isActive = step === s.num;
              const isDone = step > s.num;
              return (
                <div key={s.num} className="flex items-center">
                  <button
                    onClick={() => isDone && jumpToStep(s.num)}
                    disabled={!isDone}
                    className={`flex flex-col items-center gap-1 transition-all ${isDone ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110"
                        : isDone
                          ? "bg-emerald-500 text-white"
                          : "bg-muted text-muted-foreground"
                    }`}>
                      {isDone ? <Check className="w-4 h-4" /> : s.icon}
                    </div>
                    <span className={`text-[10px] font-medium ${isActive ? "text-primary" : isDone ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {s.label}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 mx-1 transition-all duration-300 ${isMobile ? "w-6" : "w-12"} ${step > s.num ? "bg-emerald-400" : "bg-muted"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Step Content ── */}
          <div className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-2xl shadow-lg overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="p-5 md:p-8"
              >
                {/* ═══ STEP 1: Category Selection ═══ */}
                {step === 1 && (
                  <div>
                    <h2 className="text-lg font-bold mb-1">What do you do best?</h2>
                    <p className="text-sm text-muted-foreground mb-5">Select the service you offer at weddings</p>
                    <div className={`grid gap-3 ${isMobile ? "grid-cols-2" : "grid-cols-3"}`}>
                      {CATEGORIES.map((cat) => {
                        const selected = formData.category === cat.value;
                        return (
                          <motion.button
                            key={cat.value}
                            type="button"
                            whileTap={{ scale: 0.97 }}
                            onClick={() => updateField("category", cat.value)}
                            className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                              selected
                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                : "border-border hover:border-primary/30 bg-card"
                            }`}
                          >
                            {selected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                              >
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </motion.div>
                            )}
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2`}>
                              {cat.icon}
                            </div>
                            <p className="text-sm font-semibold leading-tight">{cat.label}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{cat.tagline}</p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ═══ STEP 2: Business Identity ═══ */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-lg font-bold mb-1">Your Business Identity</h2>
                      <p className="text-sm text-muted-foreground">The essentials about your {selectedCategory?.label || "wedding"} business</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="businessName" placeholder="e.g., Royal Click Studio" className="pl-10" value={formData.businessName} onChange={(e) => updateField("businessName", e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>City *</Label>
                        <Select value={formData.cityId} onValueChange={(v) => updateField("cityId", v)}>
                          <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="experience" type="number" placeholder="e.g., 5" className="pl-10" value={formData.yearsExperience} onChange={(e) => updateField("yearsExperience", e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startingPrice">Starting Price (₹)</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="startingPrice" placeholder={PRICE_SUGGESTIONS[formData.category] || "25,000"} className="pl-10" value={formData.startingPrice} onChange={(e) => updateField("startingPrice", e.target.value)} />
                      </div>
                      <p className="text-xs text-muted-foreground">Helps couples filter by budget · You can change this later</p>
                    </div>

                    {GENDER_CATEGORIES.includes(formData.category) && (
                      <div className="space-y-2">
                        <Label>Service Provider Gender</Label>
                        <Select value={formData.genderPreference} onValueChange={(v) => updateField("genderPreference", v)}>
                          <SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="female">Female Only</SelectItem>
                            <SelectItem value="male">Male Only</SelectItem>
                            <SelectItem value="any">Both Available</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}

                {/* ═══ STEP 3: Tell Your Story ═══ */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-lg font-bold mb-1">Tell Your Story</h2>
                      <p className="text-sm text-muted-foreground">Help couples fall in love with your work</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="description">Business Description *</Label>
                        <Button type="button" variant="ghost" size="sm" onClick={generateDescription} className="text-xs text-primary h-7">
                          <Sparkles className="w-3 h-3 mr-1" /> Write for me
                        </Button>
                      </div>
                      <Textarea
                        id="description"
                        placeholder="Tell couples about your services, your USP, the kind of weddings you love working on…"
                        rows={6}
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        className="resize-none"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formData.description.length < 20 ? `${20 - formData.description.length} more characters needed` : "Looks great ✓"}</span>
                        <span>{formData.description.length}/500</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teamSize">Team Size</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="teamSize" type="number" placeholder="e.g., 10" className="pl-10" value={formData.teamSize} onChange={(e) => updateField("teamSize", e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ STEP 4: Contact & Social ═══ */}
                {step === 4 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-lg font-bold mb-1">Contact & Social</h2>
                      <p className="text-sm text-muted-foreground">How couples and our team will reach you</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" type="tel" placeholder="+91 98765 43210" className="pl-10" value={formData.phoneNumber} onChange={(e) => updateField("phoneNumber", e.target.value)} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 -mt-2">
                      <Checkbox
                        id="sameAsPhone"
                        checked={sameAsPhone}
                        onCheckedChange={(checked) => {
                          const val = checked === true;
                          setSameAsPhone(val);
                          if (val) updateField("whatsappNumber", formData.phoneNumber);
                        }}
                      />
                      <Label htmlFor="sameAsPhone" className="text-xs text-muted-foreground cursor-pointer">Same number for WhatsApp</Label>
                    </div>

                    {!sameAsPhone && (
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp Number</Label>
                        <div className="relative">
                          <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="whatsapp" type="tel" placeholder="+91 98765 43210" className="pl-10" value={formData.whatsappNumber} onChange={(e) => updateField("whatsappNumber", e.target.value)} />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="address">Business Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="address" placeholder="Full business address" className="pl-10" value={formData.address} onChange={(e) => updateField("address", e.target.value)} />
                      </div>
                    </div>

                    <div className="border-t border-border pt-4 space-y-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Social & Web (Optional)</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Instagram profile URL" className="pl-10" value={formData.instagramHandle} onChange={(e) => updateField("instagramHandle", e.target.value)} />
                        </div>
                        <div className="relative">
                          <Facebook className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Facebook page URL" className="pl-10" value={formData.facebookPage} onChange={(e) => updateField("facebookPage", e.target.value)} />
                        </div>
                        <div className="relative">
                          <Map className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Google Maps link" className="pl-10" value={formData.googleMapsLink} onChange={(e) => updateField("googleMapsLink", e.target.value)} />
                        </div>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Website URL" className="pl-10" value={formData.websiteUrl} onChange={(e) => updateField("websiteUrl", e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <Label>Business Logo</Label>
                      <div className="border-2 border-dashed border-border rounded-xl p-5 text-center hover:border-primary/40 transition-colors">
                        {logoPreview ? (
                          <div className="flex items-center gap-4">
                            <img src={logoPreview} alt="Logo preview" className="w-16 h-16 object-contain rounded-lg" />
                            <div className="text-left flex-1">
                              <p className="text-sm font-medium">{logoFile?.name}</p>
                              <Button type="button" variant="ghost" size="sm" className="text-xs text-destructive h-7 mt-1" onClick={() => { setLogoFile(null); setLogoPreview(null); }}>
                                Remove
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <Upload className="h-7 w-7 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Click to upload logo</p>
                            <p className="text-[10px] text-muted-foreground mt-1">PNG or JPG, up to 2MB</p>
                            <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ STEP 5: Review & Submit ═══ */}
                {step === 5 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-lg font-bold mb-1">Review & Submit</h2>
                      <p className="text-sm text-muted-foreground">Everything looks good? Let's get you started!</p>
                    </div>

                    {/* Summary Sections */}
                    <div className="space-y-3">
                      {/* Category */}
                      <SummarySection title="Category" onEdit={() => jumpToStep(1)}>
                        <div className="flex items-center gap-2">
                          {selectedCategory?.icon}
                          <span className="font-medium">{selectedCategory?.label || "—"}</span>
                        </div>
                      </SummarySection>

                      {/* Business */}
                      <SummarySection title="Business" onEdit={() => jumpToStep(2)}>
                        <SummaryRow label="Name" value={formData.businessName} />
                        <SummaryRow label="City" value={selectedCity?.name} />
                        <SummaryRow label="Experience" value={formData.yearsExperience ? `${formData.yearsExperience} years` : undefined} />
                        <SummaryRow label="Starting Price" value={formData.startingPrice ? `₹${formData.startingPrice}` : undefined} />
                        {formData.genderPreference && <SummaryRow label="Gender" value={formData.genderPreference} />}
                      </SummarySection>

                      {/* Story */}
                      <SummarySection title="Story" onEdit={() => jumpToStep(3)}>
                        <p className="text-sm text-muted-foreground line-clamp-3">{formData.description || "No description added"}</p>
                        {formData.teamSize && <SummaryRow label="Team Size" value={formData.teamSize} />}
                      </SummarySection>

                      {/* Contact */}
                      <SummarySection title="Contact" onEdit={() => jumpToStep(4)}>
                        <SummaryRow label="Phone" value={formData.phoneNumber} />
                        <SummaryRow label="WhatsApp" value={formData.whatsappNumber} />
                        <SummaryRow label="Address" value={formData.address} />
                        {formData.instagramHandle && <SummaryRow label="Instagram" value={formData.instagramHandle} />}
                        {logoPreview && (
                          <div className="flex items-center gap-2 mt-2">
                            <img src={logoPreview} alt="Logo" className="w-10 h-10 rounded object-contain" />
                            <span className="text-xs text-muted-foreground">Logo uploaded</span>
                          </div>
                        )}
                      </SummarySection>
                    </div>

                    {/* Trust Signals */}
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex flex-wrap gap-4 text-xs">
                      <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-600" /> <strong>100% Free</strong> — No charges ever</span>
                      <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> <strong>Zero Commission</strong> — Keep all earnings</span>
                      <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-blue-500" /> <strong>Verified in 24–48 hrs</strong></span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Sticky Bottom Navigation ── */}
          <div className={`flex gap-3 mt-6 ${isMobile ? "fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border p-4 z-50" : ""}`}>
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            {step < totalSteps ? (
              <Button type="button" onClick={nextStep} className={step === 1 ? "w-full" : "flex-1"}>
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} className="flex-1" disabled={loading}>
                {loading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating Profile...</>
                ) : (
                  <>Complete Registration <PartyPopper className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Summary Components ──
function SummarySection({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="bg-muted/40 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onEdit} className="text-xs text-primary h-7">
          <Pen className="w-3 h-3 mr-1" /> Edit
        </Button>
      </div>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between text-sm py-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right max-w-[60%] truncate">{value}</span>
    </div>
  );
}
