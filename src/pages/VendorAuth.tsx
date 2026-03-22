import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Eye, EyeOff, Loader2, ArrowRight, Crown, TrendingUp, Shield, Sparkles } from "lucide-react";
import { sanitizeInput } from "@/lib/validation";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import heroVendor from "@/assets/hero-auth-vendor.jpg";

const VendorAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: vendorProfile } = await supabase
          .from("vendors").select("id").eq("user_id", session.user.id).maybeSingle();
        navigate(vendorProfile ? "/vendor/dashboard" : "/vendor/onboarding", { replace: true });
        return;
      }
      setCheckingSession(false);
    };
    checkSession();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/vendor-auth` },
      });
      if (error) throw error;
      await trackEvent({ event_type: "vendor_login", metadata: { method: "google" } });
    } catch (error: any) {
      toast({ title: "Google sign-in failed", description: error.message || "Please try again.", variant: "destructive" });
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!loginEmail.trim() || !loginPassword) {
      toast({ title: "Validation error", description: "Email and password are required", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizeInput(loginEmail.trim()),
        password: loginPassword,
      });
      if (error) throw error;
      if (data.user) {
        await trackEvent({ event_type: "vendor_login", metadata: { method: "password" } });
        toast({ title: "Welcome back!", description: "Redirecting to your dashboard..." });
        const { data: vendorProfile } = await supabase.from("vendors").select("id").eq("user_id", data.user.id).maybeSingle();
        navigate(vendorProfile ? "/vendor/dashboard" : "/vendor/onboarding");
      }
    } catch (error: any) {
      toast({ title: "Login failed", description: error.message || "Please check your credentials.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(260 15% 8%)' }}>
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  const benefits = [
    { icon: Crown, label: "Verified Platform", desc: "Get verified badge and build trust with 50,000+ couples", color: "text-amber-400" },
    { icon: TrendingUp, label: "More Bookings", desc: "Get 3-5x more inquiries than traditional marketing", color: "text-emerald-400" },
    { icon: Shield, label: "Secure Payments", desc: "Milestone-based payments with zero commission", color: "text-blue-400" },
    { icon: Sparkles, label: "Premium Features", desc: "Portfolio showcase, reviews & analytics dashboard", color: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(165deg, hsl(260 15% 8%) 0%, hsl(270 20% 10%) 50%, hsl(38 15% 10%) 100%)' }}>
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-16 right-8 w-40 h-40 rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(38 80% 50% / 0.12), transparent)' }}
        />
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-32 left-4 w-28 h-28 rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(280 50% 40% / 0.1), transparent)' }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero banner */}
        <div className="relative h-48 md:h-64 overflow-hidden">
          <img src={heroVendor} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'contrast(1.05) saturate(1.1)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, hsl(260 15% 8%) 100%)' }} />
          <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-xs font-bold tracking-[0.15em] uppercase">Vendor Portal</span>
              </div>
              <h1 className="text-white font-bold text-2xl md:text-3xl leading-tight">Welcome Back, Partner</h1>
              <p className="text-white/50 text-sm mt-1">Login to manage your wedding business</p>
            </motion.div>
          </div>
        </div>

        <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left: Benefits (desktop) */}
            <div className="hidden md:block space-y-3">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <b.icon className={`h-5 w-5 ${b.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white/90 text-sm">{b.label}</h3>
                    <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{b.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right: Login Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl p-6 shadow-2xl"
              style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {/* Register CTA */}
              <div className="mb-5 p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, hsl(38 80% 50% / 0.1), hsl(38 70% 45% / 0.05))', border: '1px solid hsl(38 60% 50% / 0.2)' }}>
                <p className="text-sm font-semibold text-white mb-1">🚀 Naye vendor hain?</p>
                <p className="text-xs text-white/40 mb-3">Apna vendor profile banayein minutes mein — aaj hi bookings paana shuru karein.</p>
                <Button asChild className="w-full font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-xl h-10" size="sm">
                  <Link to="/vendor/onboarding">
                    Register karein <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* Google */}
              <Button
                variant="outline"
                className="w-full mb-4 gap-2 border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white rounded-xl h-12"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
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
                  <span className="px-3 text-white/30" style={{ background: 'hsl(260 15% 10%)' }}>or login with email</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-white/60 text-sm">Email</Label>
                  <Input
                    id="login-email" type="email" placeholder="business@example.com"
                    value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required disabled={isLoading}
                    className="rounded-xl h-12 bg-white/[0.05] border-white/10 text-white placeholder:text-white/25 focus-visible:ring-amber-400/30 focus-visible:border-amber-400/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-white/60 text-sm">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                      value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required disabled={isLoading}
                      className="rounded-xl h-12 bg-white/[0.05] border-white/10 text-white placeholder:text-white/25 focus-visible:ring-amber-400/30 focus-visible:border-amber-400/40"
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 text-white/30 hover:text-white/60 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Link to="/forgot-password" className="text-sm text-amber-400/80 hover:text-amber-400 hover:underline block">Forgot password?</Link>
                <Button type="submit" className="w-full bg-amber-500 text-black hover:bg-amber-400 font-semibold rounded-xl h-12 shadow-lg shadow-amber-500/20" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Logging in...</> : "Login to Dashboard"}
                </Button>
              </form>

              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-sm text-white/30">
                  Looking for vendors?{" "}
                  <Link to="/auth" className="text-amber-400/80 hover:text-amber-400 font-medium">Sign up as couple</Link>
                </p>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-white/30 hover:text-white/60 transition-colors">← Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorAuth;
