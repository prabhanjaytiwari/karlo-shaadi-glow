import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Check, Pen, Shield, Star, Zap, Heart, PartyPopper, ArrowRight,
  CheckCircle, X, Eye, EyeOff, Mail, Lock, UserPlus
} from "lucide-react";
import { sanitizeInput } from "@/lib/validation";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Database } from "@/integrations/supabase/types";
import { VendorSubscriptionCheckout } from "@/components/vendor/VendorSubscriptionCheckout";
import { CountdownBanner, isOfferActive, getDiscountedPrice } from "@/components/CountdownBanner";
import { useAnalytics } from "@/hooks/useAnalytics";

// Hero images
import heroStep1 from "@/assets/onboarding-step-1.jpg";
import heroStep2 from "@/assets/onboarding-step-2.jpg";
import heroStep3 from "@/assets/onboarding-step-3.jpg";
import heroStep4 from "@/assets/onboarding-step-4.jpg";
import heroStep5 from "@/assets/onboarding-step-5.jpg";
import heroStep6 from "@/assets/onboarding-step-6.jpg";

// Hero for Step 0 (auth) — reuse the main shaadi hero
import heroAuth from "@/assets/hero-auth-mandap.jpg";

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
}

const CATEGORIES: CategoryCard[] = [
  { value: "photography", label: "Photography", tagline: "Capture the magic forever", icon: <Camera className="w-6 h-6" /> },
  { value: "venues", label: "Venues", tagline: "The perfect backdrop", icon: <Building2 className="w-6 h-6" /> },
  { value: "catering", label: "Catering", tagline: "Flavours they'll remember", icon: <Utensils className="w-6 h-6" /> },
  { value: "decoration", label: "Decoration", tagline: "Transform any space", icon: <Flower2 className="w-6 h-6" /> },
  { value: "makeup", label: "Makeup", tagline: "Bridal beauty experts", icon: <Sparkles className="w-6 h-6" /> },
  { value: "mehendi", label: "Mehendi", tagline: "Intricate artistry", icon: <Palette className="w-6 h-6" /> },
  { value: "music", label: "Music & DJ", tagline: "Set the vibe right", icon: <Music className="w-6 h-6" /> },
  { value: "cakes", label: "Cakes & Desserts", tagline: "Sweet celebrations", icon: <Heart className="w-6 h-6" /> },
  { value: "planning", label: "Wedding Planning", tagline: "Stress-free weddings", icon: <BookOpen className="w-6 h-6" /> },
  { value: "invitations", label: "Invitations", tagline: "First impressions count", icon: <Pen className="w-6 h-6" /> },
  { value: "choreography", label: "Choreography", tagline: "Dance to remember", icon: <Zap className="w-6 h-6" /> },
  { value: "transport", label: "Transport", tagline: "Arrive in style", icon: <Car className="w-6 h-6" /> },
  { value: "jewelry", label: "Jewelry", tagline: "Adorn the occasion", icon: <Gem className="w-6 h-6" /> },
  { value: "pandit", label: "Pandit", tagline: "Sacred ceremonies", icon: <Crown className="w-6 h-6" /> },
  { value: "entertainment", label: "Entertainment", tagline: "Unforgettable moments", icon: <Star className="w-6 h-6" /> },
  { value: "anchor", label: "Anchor / Emcee", tagline: "Host the celebration", icon: <Mic2 className="w-6 h-6" /> },
  { value: "content-creator", label: "Content Creator", tagline: "Stories that trend", icon: <Video className="w-6 h-6" /> },
  { value: "social-media-managers", label: "Social Media Manager", tagline: "Viral shaadi content", icon: <Instagram className="w-6 h-6" /> },
  { value: "influencer", label: "Influencer", tagline: "Amplify your reach", icon: <Sparkles className="w-6 h-6" /> },
];

// ── Step Config (Steps 1-6 displayed to user; Step 0 = auth, hidden from stepper) ──
const STEPS = [
  { num: 1, label: "Category", hindiLabel: "Apka Kaam", icon: <Palette className="w-4 h-4" /> },
  { num: 2, label: "Business", hindiLabel: "Business", icon: <Building2 className="w-4 h-4" /> },
  { num: 3, label: "Story", hindiLabel: "Kahani", icon: <Pen className="w-4 h-4" /> },
  { num: 4, label: "Contact", hindiLabel: "Sampark", icon: <Phone className="w-4 h-4" /> },
  { num: 5, label: "Review", hindiLabel: "Review", icon: <Check className="w-4 h-4" /> },
  { num: 6, label: "Plan", hindiLabel: "Plan", icon: <Crown className="w-4 h-4" /> },
];

const STEP_HEROES = [heroStep1, heroStep2, heroStep3, heroStep4, heroStep5, heroStep6];

const STEP_STORYTELLING = [
  { hindi: "Apka Kaam, Apki Pehchaan", english: "Your Work, Your Identity", subtitle: "Select the service that defines you" },
  { hindi: "Apna Business Batao", english: "Tell Us About Your Business", subtitle: "The essentials about your wedding business" },
  { hindi: "Apni Kahani Sunao", english: "Tell Your Story", subtitle: "Help couples fall in love with your work" },
  { hindi: "Jude Rahiye", english: "Stay Connected", subtitle: "How couples and our team will reach you" },
  { hindi: "Sab Sahi Hai?", english: "Everything Look Good?", subtitle: "Review your profile before we publish it" },
  { hindi: "Apna Plan Chuniye", english: "Choose Your Plan", subtitle: "Grow faster with premium tools" },
];

const PRICE_SUGGESTIONS: Record<string, string> = {
  photography: "25,000", venues: "2,00,000", catering: "800/plate", decoration: "50,000",
  makeup: "15,000", mehendi: "5,000", music: "20,000", cakes: "5,000",
  planning: "1,00,000", invitations: "50/card", choreography: "15,000", transport: "10,000",
  jewelry: "50,000", pandit: "11,000", entertainment: "25,000", anchor: "20,000",
  "content-creator": "15,000", "social-media-managers": "20,000", influencer: "25,000",
};

const STORAGE_KEY = "ks_vendor_onboarding_draft";
const GENDER_CATEGORIES = ["makeup", "photography", "mehendi"];

// Gradient backgrounds per step (index 0 = step 1)
const STEP_GRADIENTS = [
  "from-rose-950/90 via-amber-950/70 to-rose-950/90",
  "from-amber-950/90 via-orange-950/70 to-amber-950/90",
  "from-emerald-950/90 via-teal-950/70 to-emerald-950/90",
  "from-blue-950/90 via-indigo-950/70 to-blue-950/90",
  "from-violet-950/90 via-purple-950/70 to-violet-950/90",
  "from-amber-950/90 via-yellow-950/70 to-amber-950/90",
];

// Subscription plans
const SUBSCRIPTION_PLANS = [
  {
    id: "silver",
    name: "Silver",
    price: 4999,
    icon: Star,
    popular: false,
    features: [
      "Top 10 search placement",
      "Silver badge on profile",
      "12% transaction fee (save 3%)",
      "Priority lead notifications",
      "Basic analytics dashboard",
    ],
    missing: ["Business Intelligence suite", "Portfolio Mini-Site", "Homepage featured spot"],
  },
  {
    id: "gold",
    name: "Gold",
    price: 9999,
    icon: Sparkles,
    popular: true,
    features: [
      "Top 5 search placement",
      "Gold Verified badge",
      "8% transaction fee (save 7%)",
      "Business Intelligence suite",
      "Portfolio Mini-Site builder",
      "Priority WhatsApp support",
      "Contract & Invoice tools",
    ],
    missing: ["Homepage featured spot"],
  },
  {
    id: "diamond",
    name: "Diamond",
    price: 19999,
    icon: Crown,
    popular: false,
    features: [
      "Homepage featured placement",
      "Diamond Premium badge",
      "Zero transaction fees!",
      "Full Business Intelligence",
      "Portfolio Mini-Site builder",
      "Dedicated account manager",
      "Priority lead matching",
      "All premium tools unlocked",
    ],
    missing: [],
  },
];

export default function VendorOnboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // Start at 0 (auth step)
  const [direction, setDirection] = useState(1);
  const [cities, setCities] = useState<any[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [sameAsPhone, setSameAsPhone] = useState(false);
  const [createdVendorId, setCreatedVendorId] = useState<string | null>(null);
  const [showSubscriptionCheckout, setShowSubscriptionCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [authChecked, setAuthChecked] = useState(false);

  // Auth step state
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const [formData, setFormData] = useState({
    category: "", businessName: "", cityId: "", yearsExperience: "", startingPrice: "",
    genderPreference: "", description: "", teamSize: "", phoneNumber: "", whatsappNumber: "",
    instagramHandle: "", facebookPage: "", googleMapsLink: "", websiteUrl: "", address: "",
  });

  const totalSteps = 6; // Steps 1-6 displayed to user
  const offerActive = isOfferActive();

  // ── Check auth on mount — skip Step 0 if already logged in ──
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Already authenticated — check if they have a vendor profile
        const { data: vendorData } = await supabase
          .from("vendors").select("id").eq("user_id", session.user.id).maybeSingle();
        if (vendorData) {
          toast({ title: "Already Registered", description: "Redirecting to your dashboard." });
          navigate("/vendor/dashboard");
          return;
        }
        // No vendor profile — skip to Step 1
        setStep(1);
      }
      // else stay on Step 0 (auth)
      setAuthChecked(true);
    };
    checkAuth();

    // Listen for auth changes (e.g., returning from email confirmation)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user && step === 0) {
        setStep(1);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Load saved draft ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setFormData(prev => ({ ...prev, ...JSON.parse(saved) }));
    } catch (_e) {
      // Ignore invalid stored data
    }
  }, []);

  // ── Auto-save to localStorage ──
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(formData)); } catch (_e) { /* ignore storage errors */ }
  }, [formData]);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    const { data } = await supabase.from("cities").select("*").eq("is_active", true);
    if (data) setCities(data);
  };

  const updateField = useCallback((field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === "phoneNumber" && sameAsPhone) updated.whatsappNumber = value;
      return updated;
    });
  }, [sameAsPhone]);

  // ── Auth Handlers ──
  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    try {
      const { lovable } = await import("@/integrations/lovable/index");
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/vendor/onboarding`,
      });
      if (result?.error) throw result.error;
      trackEvent({ event_type: "vendor_signup", metadata: { method: "google" } }).catch(() => {});
    } catch (error: any) {
      toast({ title: "Google sign-in failed", description: error.message || "Please try again.", variant: "destructive" });
      setAuthLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    const trimmedName = signupName.trim();
    const trimmedEmail = signupEmail.trim();

    if (!trimmedName || trimmedName.length < 2) {
      toast({ title: "Name required", description: "Please enter your name (at least 2 characters)", variant: "destructive" });
      setAuthLoading(false);
      return;
    }

    if (!trimmedEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address", variant: "destructive" });
      setAuthLoading(false);
      return;
    }

    if (signupPassword.length < 6) {
      toast({ title: "Weak password", description: "Password must be at least 6 characters", variant: "destructive" });
      setAuthLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: sanitizeInput(trimmedEmail),
        password: signupPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/vendor/onboarding`,
          data: {
            full_name: sanitizeInput(trimmedName),
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        trackEvent({ event_type: "vendor_signup", metadata: { method: "password" } }).catch(() => {});

        supabase.functions.invoke('onboarding-email', {
          body: { user_id: data.user.id, email: trimmedEmail, name: trimmedName, user_type: 'vendor' }
        }).catch(err => console.error('Welcome email failed:', err));

        const needsEmailConfirmation = data.user.identities?.length === 0 ||
          (!data.session && data.user.email_confirmed_at === null);

        if (needsEmailConfirmation || !data.session) {
          setEmailSent(true);
          toast({ title: "Check your email ✉️", description: "Click the link to verify your account, then you'll continue here." });
        } else {
          // Auto-confirmed — skip to step 1
          setStep(1);
          toast({ title: "Account created! 🎉", description: "Let's set up your vendor profile." });
        }
      }
    } catch (error: any) {
      toast({ title: "Signup failed", description: error.message || "Unable to create account.", variant: "destructive" });
    } finally {
      setAuthLoading(false);
    }
  };

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
    setStep(s => Math.min(s + 1, 6));
  };

  const prevStep = () => {
    if (step === 6 || step <= 1) return;
    setDirection(-1);
    setStep(s => Math.max(s - 1, 1));
  };

  const jumpToStep = (target: number) => {
    if (step === 6 || target < 1) return;
    setDirection(target > step ? 1 : -1);
    setStep(target);
  };

  // ── Submit (Step 5) ──
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let logoUrl = null;
      if (logoFile) logoUrl = await uploadLogo(user.id);

      const { data: vendorData, error: vendorError } = await supabase.from("vendors").insert([{
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
      }]).select("id").single();

      if (vendorError) throw vendorError;

      // Assign vendor role so ProtectedRoute grants access to /vendor/dashboard
      await supabase.from("user_roles").upsert(
        { user_id: user.id, role: "vendor" as any },
        { onConflict: "user_id,role" }
      );

      localStorage.removeItem(STORAGE_KEY);
      setCreatedVendorId(vendorData.id);
      
      toast({ title: "Profile Created! 🎉", description: "Now choose a plan to grow faster." });
      
      setDirection(1);
      setStep(6);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowSubscriptionCheckout(true);
  };

  const handleSkipPlan = () => {
    navigate("/vendor/dashboard");
  };

  const handleSubscriptionSuccess = () => {
    setShowSubscriptionCheckout(false);
    toast({ title: "Subscription Activated! 🚀", description: "Welcome to the premium experience." });
    navigate("/vendor/dashboard");
  };

  const selectedCategory = CATEGORIES.find(c => c.value === formData.category);
  const selectedCity = cities.find(c => c.id === formData.cityId);

  // For steps 1-6, map to storytelling/hero arrays (index 0-5)
  const currentStory = step >= 1 ? STEP_STORYTELLING[step - 1] : null;
  const currentHero = step >= 1 ? STEP_HEROES[step - 1] : heroAuth;

  // ── Slide animation ──
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  // Don't render until auth check completes
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-foreground flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  // ═══ STEP 0: Create Account ═══
  if (step === 0) {
    return (
      <div className="min-h-screen bg-foreground relative overflow-hidden">
        {/* Floating decorative orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-10 w-32 h-32 rounded-full"
            style={{ background: "radial-gradient(circle, hsl(38 90% 55% / 0.15), transparent)" }}
          />
          <motion.div
            animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-40 left-5 w-24 h-24 rounded-full"
            style={{ background: "radial-gradient(circle, hsl(340 75% 50% / 0.12), transparent)" }}
          />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Hero Banner */}
          <div className="relative h-48 md:h-64 overflow-hidden">
            <img src={heroAuth} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "contrast(1.05) saturate(1.1)" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-accent font-bold text-xs tracking-[0.2em] uppercase mb-1"
              >
                Vendor Registration
              </motion.p>
              <motion.h1
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white font-bold text-2xl md:text-3xl leading-tight"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Apni Shaadi Business Shuru Karo
              </motion.h1>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/70 text-sm mt-1"
              >
                Start Your Wedding Business Journey — Create your account in 30 seconds
              </motion.p>
            </div>
          </div>

          {/* Auth Form */}
          <div className="flex-1 max-w-md mx-auto w-full px-4 py-6">
            <div className="bg-white/[0.07] backdrop-blur-xl border border-white/[0.12] rounded-2xl shadow-2xl p-6">
              
              {emailSent ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Check Your Email ✉️</h2>
                  <p className="text-white/50 text-sm mb-6">
                    We sent a verification link to <strong className="text-white/80">{signupEmail}</strong>. 
                    Click it to continue your onboarding.
                  </p>
                  <p className="text-white/30 text-xs mb-4">
                    After verifying, you'll be automatically redirected here to complete your profile setup.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent hover:bg-accent/10"
                    onClick={() => { setEmailSent(false); setSignupEmail(""); setSignupPassword(""); setSignupName(""); }}
                  >
                    Use a different email
                  </Button>
                </motion.div>
              ) : (
                <>
                  {/* Google OAuth */}
                  <Button
                    variant="outline"
                    className="w-full mb-4 gap-2 border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white"
                    onClick={handleGoogleSignIn}
                    disabled={authLoading}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </Button>

                  <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-foreground px-3 text-white/30">or create with email</span>
                    </div>
                  </div>

                  {/* Signup Form */}
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-white/70">Your Name</Label>
                      <div className="relative">
                        <UserPlus className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Your full name"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          required
                          disabled={authLoading}
                          className="pl-10 bg-white/[0.06] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent/30 focus-visible:border-accent/40"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-white/70">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="business@example.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          required
                          disabled={authLoading}
                          className="pl-10 bg-white/[0.06] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent/30 focus-visible:border-accent/40"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-white/70">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Min. 6 characters"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                          minLength={6}
                          disabled={authLoading}
                          className="pl-10 pr-10 bg-white/[0.06] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent/30 focus-visible:border-accent/40"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 text-white/30 hover:text-white/60 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                      disabled={authLoading}
                    >
                      {authLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</>
                      ) : (
                        <>Create Account & Start <ArrowRight className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>

                    <p className="text-[10px] text-center text-white/25">
                      By signing up, you agree to our Terms and Privacy Policy
                    </p>
                  </form>
                </>
              )}

              {/* Login link */}
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-sm text-white/40">
                  Already have an account?{" "}
                  <Link to="/vendor-auth" className="text-accent hover:text-accent/80 font-semibold">
                    Login here
                  </Link>
                </p>
              </div>
            </div>

            {/* Couple link */}
            <div className="text-center mt-4">
              <p className="text-xs text-white/25">
                Looking for vendors?{" "}
                <Link to="/auth" className="text-accent/60 hover:text-accent">Sign up as couple</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══ STEPS 1-6: Onboarding Wizard ═══
  return (
    <div className="min-h-screen bg-foreground relative overflow-hidden">
      {/* Floating decorative orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-32 h-32 rounded-full"
          style={{ background: "radial-gradient(circle, hsl(38 90% 55% / 0.15), transparent)" }}
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-40 left-5 w-24 h-24 rounded-full"
          style={{ background: "radial-gradient(circle, hsl(340 75% 50% / 0.12), transparent)" }}
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full"
          style={{ background: "radial-gradient(circle, hsl(38 90% 55% / 0.1), transparent)" }}
        />
      </div>

      <div className={`relative z-10 ${isMobile ? "pb-32" : "py-6"}`}>
        <div className="max-w-3xl mx-auto px-4">

          {/* ── Hero Banner ── */}
          <motion.div
            key={`hero-${step}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden mb-6 h-44 md:h-56"
          >
            <img
              src={currentHero}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "contrast(1.05) saturate(1.1)" }}
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${STEP_GRADIENTS[step - 1]}`} />
            <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-accent font-bold text-xs tracking-[0.2em] uppercase mb-1"
              >
                Step {step} of {totalSteps}
              </motion.p>
              <motion.h1
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white font-bold text-2xl md:text-3xl leading-tight"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {currentStory?.hindi}
              </motion.h1>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/70 text-sm mt-1"
              >
                {currentStory?.english} — {currentStory?.subtitle}
              </motion.p>
            </div>
          </motion.div>

          {/* ── Glass Progress Stepper ── */}
          <div className="flex items-center justify-center gap-1.5 mb-6 flex-wrap">
            {STEPS.map((s, i) => {
              const isActive = step === s.num;
              const isDone = step > s.num;
              return (
                <div key={s.num} className="flex items-center gap-1.5">
                  <button
                    onClick={() => isDone && s.num < 6 && jumpToStep(s.num)}
                    disabled={!isDone || step === 6}
                    className="flex items-center gap-1.5 transition-all"
                  >
                    <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 backdrop-blur-sm border ${
                      isActive
                        ? "bg-accent/20 text-accent border-accent/40 ring-2 ring-accent/20"
                        : isDone
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 cursor-pointer"
                          : "bg-white/5 text-white/40 border-white/10"
                    }`}>
                      {isDone ? <Check className="w-3 h-3" /> : s.icon}
                      {!isMobile && <span>{s.label}</span>}
                    </div>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={`h-px w-4 transition-all duration-300 ${step > s.num ? "bg-emerald-400/50" : "bg-white/10"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Step Content Glass Container ── */}
          <div className="bg-white/[0.07] backdrop-blur-xl border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="p-5 md:p-8"
              >
                {/* ═══ STEP 1: Category Selection ═══ */}
                {step === 1 && (
                  <div>
                    <p className="text-white/50 text-xs mb-5 flex items-center gap-2">
                      <Users className="w-3.5 h-3.5" />
                      Join 10,000+ vendors already growing with Karlo Shaadi
                    </p>
                    <div className={`grid gap-2.5 ${isMobile ? "grid-cols-2" : "grid-cols-3"}`}>
                      {CATEGORIES.map((cat) => {
                        const selected = formData.category === cat.value;
                        return (
                          <motion.button
                            key={cat.value}
                            type="button"
                            whileTap={{ scale: 0.96 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => updateField("category", cat.value)}
                            className={`relative p-3.5 rounded-xl border text-left transition-all duration-200 backdrop-blur-sm ${
                              selected
                                ? "border-accent/50 bg-accent/10 ring-2 ring-accent/20"
                                : "border-white/10 hover:border-white/20 bg-white/[0.04]"
                            }`}
                          >
                            {selected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center"
                              >
                                <Check className="w-3 h-3 text-accent-foreground" />
                              </motion.div>
                            )}
                            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mb-2 text-white/80">
                              {cat.icon}
                            </div>
                            <p className="text-sm font-semibold text-white/90 leading-tight">{cat.label}</p>
                            <p className="text-[10px] text-white/40 mt-0.5 leading-tight">{cat.tagline}</p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ═══ STEP 2: Business Identity ═══ */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="text-white/70">Business Name *</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                        <Input id="businessName" placeholder="e.g., Royal Click Studio" className="pl-10 bg-white/[0.06] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent/30 focus-visible:border-accent/40" value={formData.businessName} onChange={(e) => updateField("businessName", e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white/70">City *</Label>
                        <Select value={formData.cityId} onValueChange={(v) => updateField("cityId", v)}>
                          <SelectTrigger className="bg-white/[0.06] border-white/10 text-white"><SelectValue placeholder="Select city" /></SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-white/70">Years of Experience</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                          <Input id="experience" type="number" placeholder="e.g., 5" className="pl-10 bg-white/[0.06] border-white/10 text-white placeholder:text-white/30" value={formData.yearsExperience} onChange={(e) => updateField("yearsExperience", e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startingPrice" className="text-white/70">Starting Price (₹)</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                        <Input id="startingPrice" placeholder={PRICE_SUGGESTIONS[formData.category] || "25,000"} className="pl-10 bg-white/[0.06] border-white/10 text-white placeholder:text-white/30" value={formData.startingPrice} onChange={(e) => updateField("startingPrice", e.target.value)} />
                      </div>
                      <p className="text-xs text-white/30">Helps couples filter by budget · You can change this later</p>
                    </div>

                    {GENDER_CATEGORIES.includes(formData.category) && (
                      <div className="space-y-2">
                        <Label className="text-white/70">Service Provider Gender</Label>
                        <Select value={formData.genderPreference} onValueChange={(v) => updateField("genderPreference", v)}>
                          <SelectTrigger className="bg-white/[0.06] border-white/10 text-white"><SelectValue placeholder="Select preference" /></SelectTrigger>
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
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="description" className="text-white/70">Business Description *</Label>
                        <Button type="button" variant="ghost" size="sm" onClick={generateDescription} className="text-xs text-accent h-7 hover:bg-accent/10">
                          <Sparkles className="w-3 h-3 mr-1" /> Write for me
                        </Button>
                      </div>
                      <Textarea
                        id="description"
                        placeholder="Tell couples about your services, your USP, the kind of weddings you love working on…"
                        rows={6}
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        className="resize-none bg-white/[0.06] border-white/10 text-white placeholder:text-white/30"
                      />
                      <div className="flex justify-between text-xs text-white/30">
                        <span>{formData.description.length < 20 ? `${20 - formData.description.length} more characters needed` : <span className="text-emerald-400">Looks great ✓</span>}</span>
                        <span>{formData.description.length}/500</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teamSize" className="text-white/70">Team Size</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                        <Input id="teamSize" type="number" placeholder="e.g., 10" className="pl-10 bg-white/[0.06] border-white/10 text-white placeholder:text-white/30" value={formData.teamSize} onChange={(e) => updateField("teamSize", e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ STEP 4: Contact & Social ═══ */}
                {step === 4 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white/70">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                        <Input id="phone" type="tel" placeholder="+91 98765 43210" className="pl-10 bg-white/[0.06] border-white/10 text-white placeholder:text-white/30" value={formData.phoneNumber} onChange={(e) => updateField("phoneNumber", e.target.value)} />
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
                        className="border-white/20 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                      />
                      <Label htmlFor="sameAsPhone" className="text-xs text-white/40 cursor-pointer">Same number for WhatsApp</Label>
                    </div>

                    {!sameAsPhone && (
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp" className="text-white/70">WhatsApp Number</Label>
                        <div className="relative">
                          <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                          <Input id="whatsapp" type="tel" placeholder="+91 98765 43210" className="pl-10 bg-white/[0.06] border-white/10 text-white placeholder:text-white/30" value={formData.whatsappNumber} onChange={(e) => updateField("whatsappNumber", e.target.value)} />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-white/70">Business Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                        <Input id="address" placeholder="Full business address" className="pl-10 bg-white/[0.06] border-white/10 text-white placeholder:text-white/30" value={formData.address} onChange={(e) => updateField("address", e.target.value)} />
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4 space-y-4">
                      <p className="text-xs font-semibold text-white/40 uppercase tracking-wide">Social & Web (Optional)</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative">
                          <Instagram className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                          <Input placeholder="Instagram profile URL" className="pl-10 bg-white/[0.06] border-white/10 text-white placeholder:text-white/30" value={formData.instagramHandle} onChange={(e) => updateField("instagramHandle", e.target.value)} />
                        </div>
                        <div className="relative">
                          <Facebook className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                          <Input placeholder="Facebook page URL" className="pl-10 bg-white/[0.06] border-white/10 text-white placeholder:text-white/30" value={formData.facebookPage} onChange={(e) => updateField("facebookPage", e.target.value)} />
                        </div>
                        <div className="relative">
                          <Map className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                          <Input placeholder="Google Maps link" className="pl-10 bg-white/[0.06] border-white/10 text-white placeholder:text-white/30" value={formData.googleMapsLink} onChange={(e) => updateField("googleMapsLink", e.target.value)} />
                        </div>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                          <Input placeholder="Website URL" className="pl-10 bg-white/[0.06] border-white/10 text-white placeholder:text-white/30" value={formData.websiteUrl} onChange={(e) => updateField("websiteUrl", e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <Label className="text-white/70">Business Logo</Label>
                      <div className="border-2 border-dashed border-white/10 rounded-xl p-5 text-center hover:border-accent/30 transition-colors">
                        {logoPreview ? (
                          <div className="flex items-center gap-4">
                            <img src={logoPreview} alt="Logo preview" className="w-16 h-16 object-contain rounded-lg" />
                            <div className="text-left flex-1">
                              <p className="text-sm font-medium text-white/80">{logoFile?.name}</p>
                              <Button type="button" variant="ghost" size="sm" className="text-xs text-red-400 h-7 mt-1 hover:bg-red-500/10" onClick={() => { setLogoFile(null); setLogoPreview(null); }}>
                                Remove
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <Upload className="h-7 w-7 mx-auto text-white/30 mb-2" />
                            <p className="text-sm text-white/50">Click to upload logo</p>
                            <p className="text-[10px] text-white/30 mt-1">PNG or JPG, up to 2MB</p>
                            <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ STEP 5: Review & Submit ═══ */}
                {step === 5 && (
                  <div className="space-y-4">
                    <ReviewBlock title="Category" onEdit={() => jumpToStep(1)}>
                      <div className="flex items-center gap-2 text-white/80">
                        {selectedCategory?.icon}
                        <span className="font-medium">{selectedCategory?.label || "—"}</span>
                      </div>
                    </ReviewBlock>

                    <ReviewBlock title="Business" onEdit={() => jumpToStep(2)}>
                      <ReviewRow label="Name" value={formData.businessName} />
                      <ReviewRow label="City" value={selectedCity?.name} />
                      <ReviewRow label="Experience" value={formData.yearsExperience ? `${formData.yearsExperience} years` : undefined} />
                      <ReviewRow label="Starting Price" value={formData.startingPrice ? `₹${formData.startingPrice}` : undefined} />
                    </ReviewBlock>

                    <ReviewBlock title="Story" onEdit={() => jumpToStep(3)}>
                      <p className="text-sm text-white/50 line-clamp-3">{formData.description || "No description added"}</p>
                      <ReviewRow label="Team Size" value={formData.teamSize} />
                    </ReviewBlock>

                    <ReviewBlock title="Contact" onEdit={() => jumpToStep(4)}>
                      <ReviewRow label="Phone" value={formData.phoneNumber} />
                      <ReviewRow label="WhatsApp" value={formData.whatsappNumber} />
                      <ReviewRow label="Address" value={formData.address} />
                      {logoPreview && (
                        <div className="flex items-center gap-2 mt-2">
                          <img src={logoPreview} alt="Logo" className="w-8 h-8 rounded object-contain" />
                          <span className="text-xs text-white/40">Logo uploaded</span>
                        </div>
                      )}
                    </ReviewBlock>

                    <div className="bg-accent/[0.08] border border-accent/20 rounded-xl p-4 flex flex-wrap gap-4 text-xs text-white/70">
                      <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-accent" /> <strong className="text-white/90">100% Free</strong></span>
                      <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-accent" /> <strong className="text-white/90">Zero Commission</strong></span>
                      <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-accent" /> <strong className="text-white/90">Verified in 24–48 hrs</strong></span>
                    </div>
                  </div>
                )}

                {/* ═══ STEP 6: Subscription Upsell ═══ */}
                {step === 6 && (
                  <div className="space-y-6">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-300">Profile Created Successfully!</p>
                        <p className="text-xs text-emerald-400/60">Verification in 24-48 hours</p>
                      </div>
                    </motion.div>

                    {offerActive && <CountdownBanner compact className="rounded-xl" />}

                    <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
                      {SUBSCRIPTION_PLANS.map((plan, idx) => {
                        const PlanIcon = plan.icon;
                        const discounted = offerActive ? getDiscountedPrice(plan.price) : null;
                        const perDay = Math.round((discounted || plan.price) / 30);
                        return (
                          <motion.div
                            key={plan.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative rounded-xl border p-5 backdrop-blur-sm transition-all hover:scale-[1.02] cursor-pointer ${
                              plan.popular
                                ? "border-accent/40 bg-accent/[0.08] ring-1 ring-accent/20"
                                : "border-white/10 bg-white/[0.04]"
                            }`}
                            onClick={() => handleSelectPlan(plan.id)}
                          >
                            {plan.popular && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full uppercase tracking-wider">
                                Most Popular
                              </div>
                            )}
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${plan.popular ? "bg-accent/20" : "bg-white/10"}`}>
                                <PlanIcon className={`w-4 h-4 ${plan.popular ? "text-accent" : "text-white/60"}`} />
                              </div>
                              <h3 className="font-bold text-white">{plan.name}</h3>
                            </div>

                            <div className="mb-4">
                              {discounted ? (
                                <div className="flex items-baseline gap-2">
                                  <span className="text-lg line-through text-white/30">₹{plan.price.toLocaleString()}</span>
                                  <span className="text-2xl font-black text-accent">₹{discounted.toLocaleString()}</span>
                                </div>
                              ) : (
                                <span className="text-2xl font-black text-white">₹{plan.price.toLocaleString()}</span>
                              )}
                              <p className="text-[10px] text-white/30 mt-0.5">₹{perDay}/day · Cancel anytime</p>
                            </div>

                            <ul className="space-y-1.5 mb-4">
                              {plan.features.map((f, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  {f}
                                </li>
                              ))}
                              {plan.missing.map((f, i) => (
                                <li key={`m-${i}`} className="flex items-start gap-2 text-xs text-white/20">
                                  <X className="w-3.5 h-3.5 text-white/15 shrink-0 mt-0.5" />
                                  {f}
                                </li>
                              ))}
                            </ul>

                            <Button
                              className={`w-full ${plan.popular ? "bg-accent text-accent-foreground hover:bg-accent/90" : "bg-white/10 text-white hover:bg-white/20"}`}
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleSelectPlan(plan.id); }}
                            >
                              Choose {plan.name}
                            </Button>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-center gap-4 text-[10px] text-white/30">
                      <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> 100% money-back guarantee</span>
                      <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Cancel anytime</span>
                    </div>

                    <div className="text-center">
                      <Button
                        variant="ghost"
                        onClick={handleSkipPlan}
                        className="text-white/40 hover:text-white/60 hover:bg-white/5 text-sm"
                      >
                        Skip — Continue with Free Plan <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Sticky Bottom Navigation (Steps 1-5 only) ── */}
          {step >= 1 && step < 6 && (
            <div className={`flex gap-3 mt-6 ${isMobile ? "fixed bottom-0 left-0 right-0 bg-foreground/95 backdrop-blur-md border-t border-white/10 p-4 z-50" : ""}`}>
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep} className="flex-1 border-white/10 text-white/70 hover:bg-white/5 hover:text-white">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
              )}
              {step < 5 ? (
                <Button type="button" onClick={nextStep} className={`bg-accent text-accent-foreground hover:bg-accent/90 ${step === 1 ? "w-full" : "flex-1"}`}>
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating Profile...</>
                  ) : (
                    <>Complete Registration <PartyPopper className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Subscription Checkout Dialog */}
      {createdVendorId && (
        <VendorSubscriptionCheckout
          open={showSubscriptionCheckout}
          onOpenChange={setShowSubscriptionCheckout}
          vendorId={createdVendorId}
          planId={selectedPlan}
          onSuccess={handleSubscriptionSuccess}
        />
      )}
    </div>
  );
}

// ── Review Components ──
function ReviewBlock({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-white/80">{title}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onEdit} className="text-xs text-accent h-7 hover:bg-accent/10">
          <Pen className="w-3 h-3 mr-1" /> Edit
        </Button>
      </div>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between text-sm py-0.5">
      <span className="text-white/40">{label}</span>
      <span className="font-medium text-white/70 text-right max-w-[60%] truncate">{value}</span>
    </div>
  );
}
