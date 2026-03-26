import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Native selects used to avoid Radix Select + AnimatePresence crash on mobile
import { useToast } from "@/hooks/use-toast";
import {
  Building2, MapPin, Phone, Loader2, ChevronRight,
  Camera, Utensils, Music, Palette, Sparkles, Crown, Mic2,
  Video, Gem, BookOpen, Car, Flower2, Check, Star, Zap,
  Heart, PartyPopper, ArrowRight, CheckCircle, X, Eye, EyeOff,
  Mail, Lock, UserPlus, Shield, Instagram
} from "lucide-react";
import { sanitizeInput } from "@/lib/validation";
import { cdn } from "@/lib/cdnAssets";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Database } from "@/integrations/supabase/types";
import { VendorSubscriptionCheckout } from "@/components/vendor/VendorSubscriptionCheckout";
import { useAnalytics } from "@/hooks/useAnalytics";
import vendorRegisterHero from "@/assets/vendor-register-hero.jpg";
import vendorOnboardHero1 from "@/assets/vendor-onboard-hero-1.jpg";
import vendorOnboardHero2 from "@/assets/vendor-onboard-hero-2.jpg";

// ── Category Config ──
type VendorCategory = Database["public"]["Enums"]["vendor_category"];

interface CategoryOption {
  value: VendorCategory;
  label: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryOption[] = [
  { value: "photography", label: "Photography", icon: <Camera className="w-4 h-4" /> },
  { value: "venues", label: "Venues", icon: <Building2 className="w-4 h-4" /> },
  { value: "catering", label: "Catering", icon: <Utensils className="w-4 h-4" /> },
  { value: "decoration", label: "Decoration", icon: <Flower2 className="w-4 h-4" /> },
  { value: "makeup", label: "Makeup", icon: <Sparkles className="w-4 h-4" /> },
  { value: "mehendi", label: "Mehendi", icon: <Palette className="w-4 h-4" /> },
  { value: "music", label: "Music & DJ", icon: <Music className="w-4 h-4" /> },
  { value: "cakes", label: "Cakes & Desserts", icon: <Heart className="w-4 h-4" /> },
  { value: "planning", label: "Wedding Planning", icon: <BookOpen className="w-4 h-4" /> },
  { value: "invitations", label: "Invitations", icon: <Mail className="w-4 h-4" /> },
  { value: "choreography", label: "Choreography", icon: <Zap className="w-4 h-4" /> },
  { value: "transport", label: "Transport", icon: <Car className="w-4 h-4" /> },
  { value: "jewelry", label: "Jewelry", icon: <Gem className="w-4 h-4" /> },
  { value: "pandit", label: "Pandit", icon: <Crown className="w-4 h-4" /> },
  { value: "entertainment", label: "Entertainment", icon: <Star className="w-4 h-4" /> },
  { value: "anchor", label: "Anchor / Emcee", icon: <Mic2 className="w-4 h-4" /> },
  { value: "content-creator", label: "Content Creator", icon: <Video className="w-4 h-4" /> },
  { value: "social-media-managers", label: "Social Media", icon: <Instagram className="w-4 h-4" /> },
  { value: "influencer", label: "Influencer", icon: <Sparkles className="w-4 h-4" /> },
];

// Subscription plans
const SUBSCRIPTION_PLANS = [
  {
    id: "starter", name: "Starter", price: 999, icon: Star, popular: false,
    features: ["Top 10 search placement", "Silver verified badge", "7% transaction fee (save 3%)", "Priority lead notifications", "Basic analytics dashboard"],
    missing: ["Business Intelligence suite", "Portfolio Mini-Site", "Homepage featured spot"],
  },
  {
    id: "pro", name: "Pro", price: 2999, icon: Sparkles, popular: true,
    features: ["Top 5 search placement", "Gold Verified badge", "3% transaction fee (save 7%)", "Business Intelligence suite", "Portfolio Mini-Site builder", "Priority WhatsApp support", "Contract & Invoice tools"],
    missing: ["Homepage featured spot"],
  },
  {
    id: "elite", name: "Elite", price: 6999, icon: Crown, popular: false,
    features: ["Homepage featured placement", "Diamond Premium badge", "Zero transaction fees!", "Full Business Intelligence", "Portfolio Mini-Site builder", "Dedicated account manager", "Priority lead matching", "All premium tools unlocked"],
    missing: [],
  },
];

export default function VendorOnboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const isMobile = useIsMobile();

  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"register" | "plan" | "congrats">("register");
  const [cities, setCities] = useState<any[]>([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [createdVendorId, setCreatedVendorId] = useState<string | null>(null);
  const [showSubscriptionCheckout, setShowSubscriptionCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [subscribedPlan, setSubscribedPlan] = useState<string | null>(null);

  // Form fields — all on one page
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [cityId, setCityId] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");

  // ── Check auth on mount ──
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: vendorData } = await supabase
          .from("vendors").select("id").eq("user_id", session.user.id).maybeSingle();
        if (vendorData) {
          toast({ title: "Already Registered", description: "Redirecting to your dashboard." });
          navigate("/vendor/dashboard");
          return;
        }
        setIsLoggedIn(true);
        // Pre-fill name/email from session
        setFullName(session.user.user_metadata?.full_name || "");
        setEmail(session.user.email || "");
      }
      setAuthChecked(true);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setIsLoggedIn(true);
        setFullName(session.user.user_metadata?.full_name || fullName);
        setEmail(session.user.email || email);
        setEmailSent(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { loadCities(); }, []);

  // Fetch vendor ID for plan phase
  useEffect(() => {
    const fetchVendorId = async () => {
      if (phase === "plan" && !createdVendorId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: vendorData } = await supabase
            .from("vendors").select("id").eq("user_id", user.id).maybeSingle();
          if (vendorData) setCreatedVendorId(vendorData.id);
        }
      }
    };
    fetchVendorId();
  }, [phase, createdVendorId]);

  const loadCities = async () => {
    const { data } = await supabase.from("cities").select("*").eq("is_active", true);
    if (data) setCities(data);
  };

  // ── Google Sign In ──
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/vendor/onboarding` },
      });
      if (error) throw error;
      trackEvent({ event_type: "vendor_signup", metadata: { method: "google" } }).catch(() => {});
    } catch (error: any) {
      toast({ title: "Google sign-in failed", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  };

  // ── Submit Registration ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!businessName.trim() || businessName.trim().length < 3) {
      toast({ title: "Business name required", description: "At least 3 characters", variant: "destructive" });
      return;
    }
    if (!cityId) {
      toast({ title: "City required", description: "Please select your city", variant: "destructive" });
      return;
    }
    if (!category) {
      toast({ title: "Category required", description: "Please select your vendor type", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      let userId: string;

      if (!isLoggedIn) {
        // Validate auth fields
        if (!fullName.trim() || fullName.trim().length < 2) {
          toast({ title: "Name required", description: "At least 2 characters", variant: "destructive" });
          setLoading(false);
          return;
        }
        if (!email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          toast({ title: "Invalid email", description: "Please enter a valid email", variant: "destructive" });
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          toast({ title: "Weak password", description: "At least 6 characters", variant: "destructive" });
          setLoading(false);
          return;
        }

        // Create account
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: sanitizeInput(email.trim()),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/vendor/onboarding`,
            data: { full_name: sanitizeInput(fullName.trim()) },
          },
        });

        if (signupError) throw signupError;
        if (!signupData.user) throw new Error("Account creation failed");

        trackEvent({ event_type: "vendor_signup", metadata: { method: "password" } }).catch(() => {});

        supabase.functions.invoke('onboarding-email', {
          body: { user_id: signupData.user.id, email: email.trim(), name: fullName.trim(), user_type: 'vendor' }
        }).catch(() => {});

        const needsEmailConfirmation = signupData.user.identities?.length === 0 ||
          (!signupData.session && signupData.user.email_confirmed_at === null);

        if (needsEmailConfirmation || !signupData.session) {
          setEmailSent(true);
          toast({ title: "Check your email ✉️", description: "Verify your account to complete registration." });
          setLoading(false);
          return;
        }

        userId = signupData.user.id;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");
        userId = user.id;
      }

      // Auto-generate description
      const catLabel = CATEGORIES.find(c => c.value === category)?.label || "wedding";
      const cityName = cities.find(c => c.id === cityId)?.name || "India";
      const autoDesc = `We are a professional ${catLabel} service provider based in ${cityName}. Our team is dedicated to making every celebration special with personalised attention and creative excellence.`;

      // Create vendor profile
      const { data: vendorData, error: vendorError } = await supabase.from("vendors").insert([{
        user_id: userId,
        business_name: sanitizeInput(businessName.trim()),
        category: category as VendorCategory,
        city_id: cityId || null,
        description: autoDesc,
        phone_number: phone ? sanitizeInput(phone.trim()) : null,
        verification_status: 'pending',
      }]).select("id").single();

      if (vendorError) throw vendorError;

      // Assign vendor role
      await supabase.from("user_roles").upsert(
        { user_id: userId, role: "vendor" as any },
        { onConflict: "user_id,role" }
      );

      // Create storefront (mini-site) automatically
      const slug = sanitizeInput(businessName.trim())
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 60);
      const uniqueSlug = `${slug}-${vendorData.id.substring(0, 6)}`;
      try {
        await supabase.from("vendor_mini_sites").insert({
          vendor_id: vendorData.id,
          slug: uniqueSlug,
          is_published: true,
          theme: "elegant-rose",
          custom_tagline: `Professional ${catLabel} services in ${cityName}`,
          sections_config: { about: true, services: true, portfolio: true, reviews: true, whatsapp_cta: true },
        });
      } catch (_) {
        console.warn("Mini-site creation skipped");
      }

      // Notify admin
      try {
        await supabase.functions.invoke("send-email", {
          body: {
            to: "prabhanjaytiwari@gmail.com",
            subject: `🆕 New Vendor Registration: ${businessName}`,
            html: `
              <h2 style="color: #1a0a2e;">New Vendor Registration</h2>
              <p>A new vendor has registered and needs review.</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: 600;">Business Name</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${businessName}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: 600;">Category</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${category}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: 600;">Phone</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${phone || "N/A"}</td></tr>
              </table>
              <a href="https://karloshaadi.com/admin" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #D946EF, #f43f5e); color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Review & Approve</a>
            `,
            type: "admin_vendor_registration",
          },
        });
      } catch (_) {}

      // Telegram admin alert
      supabase.functions.invoke("telegram-admin-alert", {
        body: {
          event_type: "vendor_registered",
          data: {
            business_name: businessName,
            city: cities.find(c => c.id === cityId)?.name || "N/A",
            category,
            email: email.trim(),
            phone,
            plan: "pending",
          },
        },
      }).catch(() => {});

      setCreatedVendorId(vendorData.id);
      localStorage.removeItem("ks_vendor_onboarding_draft");
      toast({ title: "Profile Created! 🎉", description: "Now choose a plan to grow faster." });
      setPhase("plan");
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
    setSubscribedPlan("Free");
    setPhase("congrats");
  };

  const handleSubscriptionSuccess = () => {
    setShowSubscriptionCheckout(false);
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan);
    setSubscribedPlan(plan?.name || "Premium");
    setPhase("congrats");
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ═══ CONGRATULATIONS ═══
  if (phase === "congrats") {
    return (
      <div className="min-h-screen relative overflow-hidden bg-background">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['hsl(var(--accent))', 'hsl(var(--primary))', 'hsl(160 60% 50%)', 'hsl(38 80% 55%)'][i % 4],
                left: `${Math.random() * 100}%`,
                top: '-5%',
              }}
              animate={{ y: ['0vh', '110vh'], x: [0, Math.random() * 100 - 50], rotate: [0, 720], opacity: [1, 0.5, 0] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2, ease: 'easeIn' }}
            />
          ))}
        </div>
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-8"
          >
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Welcome to Karlo Shaadi! 🎉
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-muted-foreground text-base mb-8 max-w-sm">
            Your vendor profile is live. Couples will start discovering you soon.
          </motion.p>
          {subscribedPlan && subscribedPlan !== "Free" && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
              className="mb-6 px-5 py-3 rounded-2xl flex items-center gap-3 bg-accent/10 border border-accent/20">
              <Crown className="w-5 h-5 text-accent" />
              <div className="text-left">
                <p className="text-sm font-semibold text-accent">{subscribedPlan} Plan Activated</p>
                <p className="text-xs text-muted-foreground">Premium features unlocked</p>
              </div>
            </motion.div>
          )}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="flex flex-col gap-3 w-full max-w-xs">
            <Button onClick={() => navigate("/vendor/dashboard")}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-2xl h-14 text-base shadow-xl">
              Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-xs text-muted-foreground">Verification typically completes in 24-48 hours</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // ═══ PLAN SELECTION ═══
  if (phase === "plan") {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">Profile Created Successfully!</p>
              <p className="text-sm text-emerald-600/70 dark:text-emerald-400/60">Verification in 24-48 hours • Choose a plan to grow faster</p>
            </div>
          </motion.div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">Choose Your Plan</h2>
          <p className="text-muted-foreground text-center mb-8">Grow faster with premium tools and priority placement</p>

          <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
            {SUBSCRIPTION_PLANS.map((plan, idx) => {
              const PlanIcon = plan.icon;
              const perDay = Math.round(plan.price / 30);
              return (
                <motion.div key={plan.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }}
                  className={`relative rounded-2xl border p-6 transition-all hover:scale-[1.02] cursor-pointer ${
                    plan.popular ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/10" : "border-border bg-card"
                  }`}
                  onClick={() => handleSelectPlan(plan.id)}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.popular ? "bg-primary/20" : "bg-muted"}`}>
                      <PlanIcon className={`w-5 h-5 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
                  </div>
                  <div className="mb-5">
                    <span className="text-3xl font-black text-foreground">₹{plan.price.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                    <p className="text-xs text-muted-foreground mt-1">₹{perDay}/day · Cancel anytime</p>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                    {plan.missing.map((f, i) => (
                      <li key={`m-${i}`} className="flex items-start gap-2 text-sm text-muted-foreground/50">
                        <X className="w-4 h-4 text-muted-foreground/30 shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-foreground hover:bg-muted/80"}`}
                    onClick={(e) => { e.stopPropagation(); handleSelectPlan(plan.id); }}>
                    Choose {plan.name}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-6">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> 100% money-back guarantee</span>
            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Cancel anytime</span>
          </div>

          <div className="text-center mt-6">
            <Button variant="ghost" onClick={handleSkipPlan} className="text-muted-foreground hover:text-foreground text-sm">
              Skip — Continue with Free Plan <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

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

  // ═══ MAIN REGISTRATION PAGE ═══
  const BENEFITS = [
    { icon: <Camera className="w-5 h-5" />, title: "Portfolio Mini-Site", desc: "Your own SEO-optimized wedding page" },
    { icon: <Star className="w-5 h-5" />, title: "Smart CRM", desc: "Kanban pipeline with lead scoring" },
    { icon: <Shield className="w-5 h-5" />, title: "Digital Contracts", desc: "Legal templates with PDF generation" },
    { icon: <Zap className="w-5 h-5" />, title: "Business Intelligence", desc: "Pricing benchmarks & inquiry trends" },
    { icon: <Heart className="w-5 h-5" />, title: "Invoice & Payments", desc: "Milestone tracking with Razorpay" },
    { icon: <Building2 className="w-5 h-5" />, title: "Verified Badge", desc: "Build trust with couples instantly" },
  ];

  const STATS = [
    { num: "10,000+", label: "Active Vendors" },
    { num: "5 Lakh+", label: "Monthly Couples" },
    { num: "0%", label: "Commission" },
    { num: "20+", label: "Cities" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 20% 30%, hsl(var(--primary) / 0.04) 0%, transparent 50%), radial-gradient(circle at 80% 70%, hsl(var(--accent) / 0.03) 0%, transparent 50%)',
      }} />

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* ═══ LEFT PANEL — Benefits (desktop) ═══ */}
        {!isMobile && (
          <div className="hidden lg:flex w-[50%] relative overflow-hidden" style={{
            background: 'linear-gradient(170deg, hsl(350 72% 12%) 0%, hsl(350 60% 18%) 40%, hsl(350 50% 14%) 100%)',
          }}>
            {/* Decorative gold orbs */}
            <motion.div animate={{ y: [0, -20, 0], x: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-16 right-16 w-44 h-44 rounded-full"
              style={{ background: "radial-gradient(circle, hsl(38 80% 50% / 0.15), transparent)" }} />
            <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-28 left-8 w-36 h-36 rounded-full"
              style={{ background: "radial-gradient(circle, hsl(350 70% 45% / 0.12), transparent)" }} />

            <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
              <div>
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
                  <img src={cdn.logo} alt="Karlo Shaadi" className="h-9 object-contain" />
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full border" style={{ background: 'hsl(350 72% 40% / 0.2)', borderColor: 'hsl(350 72% 40% / 0.4)', color: 'hsl(350 72% 65%)' }}>For Vendors</span>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1] mb-4" style={{ fontFamily: "'Georgia', serif" }}>
                    Apna Business<br />
                    <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, hsl(38 80% 60%), hsl(38 90% 50%), hsl(350 70% 55%))' }}>
                      Grow Karo
                    </span>
                  </h1>
                  <p className="text-white/50 text-base mb-6 max-w-md leading-relaxed">
                    Free mein register karo, lakhs couples tak pahuncho. India ka #1 wedding vendor platform.
                  </p>
                </motion.div>

                {/* Hero images mosaic */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="grid grid-cols-2 gap-3 mb-8">
                  <div className="rounded-2xl overflow-hidden h-32 xl:h-40 border-2" style={{ borderColor: 'hsl(38 75% 50% / 0.3)' }}>
                    <img src={vendorOnboardHero1} alt="Wedding mandap" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-32 xl:h-40 border-2" style={{ borderColor: 'hsl(350 72% 40% / 0.3)' }}>
                    <img src={vendorOnboardHero2} alt="Wedding photographer" className="w-full h-full object-cover" />
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="grid grid-cols-4 gap-3 mb-8">
                  {STATS.map((stat, i) => (
                    <div key={i} className="text-center px-2 py-3 rounded-xl" style={{ background: 'hsl(350 60% 20% / 0.5)', border: '1px solid hsl(38 75% 50% / 0.15)' }}>
                      <p className="text-lg xl:text-xl font-black text-white">{stat.num}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'hsl(38 60% 60%)' }}>{stat.label}</p>
                    </div>
                  ))}
                </motion.div>

                <div className="grid grid-cols-2 gap-3">
                  {BENEFITS.map((b, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}
                      className="flex items-start gap-3 p-3 rounded-xl transition-colors" style={{ background: 'hsl(350 50% 18% / 0.6)', border: '1px solid hsl(38 75% 50% / 0.1)' }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, hsl(38 80% 50% / 0.2), hsl(350 70% 40% / 0.2))', color: 'hsl(38 80% 55%)' }}>
                        {b.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/90">{b.title}</p>
                        <p className="text-xs text-white/40 leading-snug">{b.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="flex items-center gap-6 mt-8 pt-6" style={{ borderTop: '1px solid hsl(38 75% 50% / 0.15)' }}>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'hsl(38 60% 55%)' }}>
                  <Shield className="w-4 h-4" style={{ color: 'hsl(160 60% 45%)' }} /> <span>100% Free to Join</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'hsl(38 60% 55%)' }}>
                  <Zap className="w-4 h-4" style={{ color: 'hsl(38 80% 55%)' }} /> <span>0% Commission</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'hsl(38 60% 55%)' }}>
                  <CheckCircle className="w-4 h-4" style={{ color: 'hsl(350 60% 55%)' }} /> <span>Verified in 24hrs</span>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* ═══ RIGHT PANEL — Form ═══ */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {isMobile && (
            <div className="relative overflow-hidden" style={{
              background: 'linear-gradient(170deg, hsl(350 72% 12%) 0%, hsl(350 50% 16%) 100%)',
            }}>
              <div className="relative z-10 px-5 pt-8 pb-6">
                <div className="flex items-center gap-2 mb-5">
                  <img src={cdn.logo} alt="Karlo Shaadi" className="h-7 object-contain" />
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: 'hsl(350 72% 40% / 0.2)', border: '1px solid hsl(350 72% 40% / 0.4)', color: 'hsl(350 72% 65%)' }}>For Vendors</span>
                </div>
                <h1 className="text-2xl font-bold text-white leading-tight mb-2" style={{ fontFamily: "'Georgia', serif" }}>
                  Apna Business <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, hsl(38 80% 60%), hsl(38 90% 50%))' }}>Grow Karo</span>
                </h1>
                <p className="text-white/50 text-sm mb-4">Free mein register karo, lakhs couples tak pahuncho.</p>
                {/* Mobile hero image strip */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="rounded-xl overflow-hidden h-24" style={{ border: '1px solid hsl(38 75% 50% / 0.25)' }}>
                    <img src={vendorOnboardHero1} alt="Wedding mandap" className="w-full h-full object-cover" loading="lazy" width={320} height={192} />
                  </div>
                  <div className="rounded-xl overflow-hidden h-24" style={{ border: '1px solid hsl(350 72% 40% / 0.25)' }}>
                    <img src={vendorOnboardHero2} alt="Wedding photographer" className="w-full h-full object-cover" loading="lazy" width={320} height={192} />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {STATS.map((stat, i) => (
                    <div key={i} className="text-center py-2 rounded-lg" style={{ background: 'hsl(350 60% 20% / 0.5)', border: '1px solid hsl(38 75% 50% / 0.15)' }}>
                      <p className="text-sm font-bold text-white">{stat.num}</p>
                      <p className="text-[9px]" style={{ color: 'hsl(38 60% 60%)' }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                  {BENEFITS.slice(0, 4).map((b, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg shrink-0" style={{ background: 'hsl(350 50% 18% / 0.6)', border: '1px solid hsl(38 75% 50% / 0.1)' }}>
                      <div className="shrink-0" style={{ color: 'hsl(38 80% 55%)' }}>{b.icon}</div>
                      <span className="text-xs text-white/70 whitespace-nowrap">{b.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className={`${isMobile ? "px-4 py-6" : "flex-1 flex items-start justify-center px-8 xl:px-16 py-10"}`}>
            <div className={`w-full ${isMobile ? "" : "max-w-lg"}`}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className={`${isMobile ? "" : "bg-card border border-border rounded-3xl shadow-xl shadow-black/5 p-8"}`}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Georgia', serif" }}>
                    Register Your Business
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">Create your storefront — it takes less than 2 minutes.</p>
                </div>

                {emailSent ? (
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-10 px-4 rounded-2xl border border-border bg-muted/30">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Check Your Email ✉️</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      We sent a verification link to <strong className="text-foreground">{email}</strong>. Click it to continue.
                    </p>
                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10"
                      onClick={() => { setEmailSent(false); setEmail(""); setPassword(""); setFullName(""); }}>
                      Use a different email
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Button type="button" variant="outline"
                      className="w-full h-12 gap-3 text-base font-medium border-border hover:bg-muted/50 rounded-xl"
                      onClick={handleGoogleSignIn} disabled={loading || isLoggedIn}>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      {isLoggedIn ? "Signed in with Google ✓" : "Continue with Google"}
                    </Button>

                    {!isLoggedIn && (
                      <>
                        <div className="relative my-1">
                          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className={`${isMobile ? "bg-background" : "bg-card"} px-3 text-muted-foreground`}>or register with email</span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="fullName" className="text-foreground font-medium text-sm">Your Name *</Label>
                          <div className="relative">
                            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="fullName" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)}
                              required disabled={loading} className="pl-10 h-12 text-base rounded-xl" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-foreground font-medium text-sm">Email *</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input id="email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                                required disabled={loading} className="pl-10 h-12 text-base rounded-xl" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-foreground font-medium text-sm">Password *</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min. 6 chars"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                required minLength={6} disabled={loading} className="pl-10 pr-10 h-12 text-base rounded-xl" />
                              <Button type="button" variant="ghost" size="icon"
                                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="relative pt-3">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className={`${isMobile ? "bg-background" : "bg-card"} px-3 text-muted-foreground font-medium`}>Business Details</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="businessName" className="text-foreground font-medium text-sm">Business / Brand Name *</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="businessName" placeholder="e.g., Royal Click Studio" value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)} required disabled={loading}
                          className="pl-10 h-12 text-base rounded-xl" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-foreground font-medium text-sm">City *</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                          <select
                            value={cityId}
                            onChange={(e) => setCityId(e.target.value)}
                            className="w-full h-12 pl-10 pr-4 text-base rounded-xl border border-input bg-background text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            style={{ fontSize: '16px' }}
                          >
                            <option value="" disabled>Select city</option>
                            {cities.map((city) => (
                              <option key={city.id} value={city.id}>{city.name}</option>
                            ))}
                          </select>
                          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rotate-90 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-foreground font-medium text-sm">Vendor Type *</Label>
                        <div className="relative">
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full h-12 pl-4 pr-8 text-base rounded-xl border border-input bg-background text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            style={{ fontSize: '16px' }}
                          >
                            <option value="" disabled>Select category</option>
                            {CATEGORIES.map((cat) => (
                              <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                          </select>
                          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rotate-90 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-foreground font-medium text-sm">Phone / WhatsApp Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" type="tel" placeholder="+91 98765 43210" value={phone}
                          onChange={(e) => setPhone(e.target.value)} disabled={loading}
                          className="pl-10 h-12 text-base rounded-xl" />
                      </div>
                    </div>

                    <Button type="submit"
                      className="w-full h-14 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 mt-2"
                      disabled={loading}>
                      {loading ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating Profile...</>
                      ) : (
                        <>{isLoggedIn ? "Complete Registration" : "Create Account & Register"} <ArrowRight className="w-5 h-5 ml-2" /></>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-4 flex-wrap text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-500" /> 100% Free</span>
                      <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-500" /> 0% Commission</span>
                      <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-blue-500" /> Verified in 24hrs</span>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">By registering, you agree to our Terms and Privacy Policy</p>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Already registered?{" "}
                        <Link to="/vendor-auth" className="text-primary hover:text-primary/80 font-semibold">Login</Link>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <Link to="/auth" className="text-primary/70 hover:text-primary">Couple? Sign up</Link>
                      </p>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
