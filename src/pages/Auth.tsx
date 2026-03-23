import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Eye, EyeOff, Loader2, Gift, ArrowLeft, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { loginFormSchema, signupFormSchema, sanitizeInput } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { cdn } from "@/lib/cdnAssets";

type LoginFormData = z.infer<typeof loginFormSchema>;
type SignupFormData = z.infer<typeof signupFormSchema>;

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) setReferralCode(refCode);
  }, [searchParams]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      if (roles?.some(r => r.role === "admin")) navigate("/admin/dashboard", { replace: true });
      else if (roles?.some(r => r.role === "vendor")) navigate("/vendor/dashboard", { replace: true });
      else navigate("/dashboard", { replace: true });
    };
    checkSession();
  }, [navigate]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: { fullName: "", email: "", phone: "", password: "" },
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth` },
      });
      if (error) throw error;
      await trackEvent({ event_type: "user_login", metadata: { method: "google" } });
    } catch (error: any) {
      toast({ title: "Google sign-in failed", description: error.message || "Please try again.", variant: "destructive" });
      setIsLoading(false);
    }
  };

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: sanitizeInput(data.email),
        password: data.password,
      });
      if (error) throw error;
      if (authData.user) {
        await trackEvent({ event_type: "user_login", metadata: { method: "password" } });
        toast({ title: "Welcome back! 🎉", description: "You've successfully logged in." });
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", authData.user.id);
        if (roles?.some(r => r.role === "admin")) navigate("/admin/dashboard");
        else if (roles?.some(r => r.role === "vendor")) navigate("/vendor/dashboard");
        else navigate("/dashboard");
      }
    } catch (error: any) {
      toast({ title: "Login failed", description: error.message || "Please check your credentials.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: sanitizeInput(data.email),
        password: data.password,
        options: {
          data: { full_name: sanitizeInput(data.fullName), phone: data.phone || null, referred_by: referralCode || null },
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });
      if (error) throw error;
      if (authData.user) {
        const needsEmailConfirmation = authData.user.identities?.length === 0 ||
          (!authData.session && authData.user.email_confirmed_at === null);
        trackEvent({ event_type: "user_signup", metadata: { role: "couple", referred_by: referralCode || undefined } }).catch(() => {});
        supabase.functions.invoke('onboarding-email', {
          body: { user_id: authData.user.id, email: data.email, name: data.fullName, user_type: 'couple' }
        }).catch(() => {});
        const bonusMessage = referralCode ? " You got ₹500 referral bonus!" : "";
        if (needsEmailConfirmation || !authData.session) {
          toast({ title: "Account created! ✉️", description: `Please check your email to verify.${bonusMessage}` });
        } else {
          toast({ title: "Welcome to Karlo Shaadi! 🎊", description: `Your account is ready.${bonusMessage}` });
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      toast({ title: "Signup failed", description: error.message || "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const stagger = {
    container: { animate: { transition: { staggerChildren: 0.06 } } },
    item: { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
  };

  const authFormContent = (
    <motion.div className="w-full max-w-md" variants={stagger.container} initial="initial" animate="animate">
      {/* Referral Banner */}
      {referralCode && (
        <motion.div variants={stagger.item} className="mb-4">
          <div className="bg-accent/5 rounded-2xl p-4 flex items-center gap-3 border border-accent/10">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <Gift className="h-5 w-5 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm">You've been referred! 🎉</p>
              <p className="text-xs text-muted-foreground">Sign up & get ₹500 off your first booking</p>
            </div>
            <Badge className="ml-auto bg-accent text-accent-foreground shrink-0">₹500</Badge>
          </div>
        </motion.div>
      )}

      {/* Glassmorphism Auth Card */}
      <motion.div
        variants={stagger.item}
        className="rounded-3xl p-6 md:p-8 shadow-2xl"
        style={{
          background: isMobile ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.4)',
        }}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Welcome</h2>
          <p className="text-sm text-muted-foreground mt-1">Login or create your free account</p>
        </div>

        {/* Google Sign In */}
        <Button
          variant="outline"
          className="w-full mb-4 gap-2 rounded-xl h-12 hover:bg-muted/50 transition-all duration-200 border-border/50 text-foreground font-medium"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </Button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/40" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white/80 px-3 text-muted-foreground">or continue with email</span>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 rounded-xl bg-muted/40">
            <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Login</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <FormField control={loginForm.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" disabled={isLoading} className="rounded-xl h-12 bg-white/60 border-border/40 focus-visible:ring-primary/30 focus-visible:border-primary/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={loginForm.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? "text" : "password"} placeholder="••••••••" disabled={isLoading} className="rounded-xl h-12 pr-12 bg-white/60 border-border/40 focus-visible:ring-primary/30 focus-visible:border-primary/50" {...field} />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex items-center justify-end">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
                </div>
                <Button type="submit" className="w-full rounded-xl h-12 text-base font-semibold shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Logging in...</> : "Login →"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="signup">
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-3.5">
                <FormField control={signupForm.control} name="fullName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Your name" disabled={isLoading} className="rounded-xl h-12 bg-white/60 border-border/40" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={signupForm.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="9876543210" disabled={isLoading} className="rounded-xl h-12 bg-white/60 border-border/40" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={signupForm.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" disabled={isLoading} className="rounded-xl h-12 bg-white/60 border-border/40" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={signupForm.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? "text" : "password"} placeholder="••••••••" disabled={isLoading} className="rounded-xl h-12 pr-12 bg-white/60 border-border/40" {...field} />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                  </FormItem>
                )} />
                <Button type="submit" className="w-full rounded-xl h-12 text-base font-semibold shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</> : "Create Free Account →"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">By signing up, you agree to our Terms and Privacy Policy</p>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        {/* Vendor CTA */}
        <div className="mt-6 pt-4 border-t border-border/20">
          <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, hsl(38 80% 55% / 0.06), hsl(340 60% 55% / 0.04))', border: '1px solid hsl(38 60% 60% / 0.15)' }}>
            <p className="text-sm font-semibold text-foreground mb-1 text-center">Are you a wedding vendor? 💼</p>
            <p className="text-xs text-muted-foreground text-center mb-3">Join free — zero commission on bookings</p>
            <div className="grid grid-cols-2 gap-1.5 mb-3 text-[11px] text-muted-foreground">
              {["AI Contract & Invoice", "Smart CRM & Leads", "Portfolio Mini-Site", "Business Analytics", "Payment Tracker", "Verified Badge"].map(f => (
                <div key={f} className="flex items-start gap-1.5">
                  <span className="text-primary mt-0.5 shrink-0">✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <Link to="/vendor/onboarding">
              <Button variant="outline" className="w-full rounded-xl text-sm h-10 font-medium border-accent/30 hover:bg-accent/5 hover:border-accent/50">
                Register as Vendor →
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      <motion.div variants={stagger.item} className="text-center mt-4">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-dvh">
      {isMobile ? (
        <div className="flex flex-col min-h-dvh">
          {/* Full-bleed hero image */}
          <div className="relative h-52 overflow-hidden shrink-0">
            <img
              src={cdn.heroAuthCouple}
              alt="Wedding ceremony"
              className="w-full h-full object-cover"
              style={{ filter: 'contrast(1.03) saturate(1.08)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-background" />
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-1.5">
                <Heart className="h-5 w-5 text-white fill-white" />
                <span className="text-white font-bold text-lg tracking-tight">Karlo Shaadi</span>
              </Link>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-lg font-bold leading-tight">Your Dream Wedding Starts Here ✨</p>
              <p className="text-white/70 text-xs mt-0.5">Aap Shaadi Karo, Tension Hum Sambhal Lenge</p>
            </div>
          </div>

          <div
            className="flex-1 flex items-start justify-center px-4 py-5 overflow-y-auto -mt-4 relative z-10"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.25rem)' }}
          >
            {authFormContent}
          </div>
        </div>
      ) : (
        <div className="flex min-h-dvh">
          {/* Left: Cinematic hero */}
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
            <img
              src={cdn.heroAuthCouple}
              alt="Wedding ceremony"
              className="w-full h-full object-cover"
              style={{ filter: 'contrast(1.03) saturate(1.08)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-between p-12">
              <Link to="/" className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-white fill-white" />
                <span className="text-white font-bold text-2xl tracking-tight">Karlo Shaadi</span>
              </Link>
              <div>
                <p className="text-white/70 text-sm font-medium tracking-widest uppercase mb-3">India's Premium Wedding Platform</p>
                <h2 className="text-white text-4xl font-bold leading-tight mb-3">Your Dream Wedding<br />Starts Here</h2>
                <p className="text-white/75 text-base max-w-md mb-6">Aap Shaadi Karo, Tension Hum Sambhal Lenge</p>
                {/* Glassmorphism stat bar */}
                <div
                  className="inline-flex gap-6 rounded-2xl px-6 py-4"
                  style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  {[["50K+", "Vendors"], ["2L+", "Couples"], ["4.9★", "Rating"]].map(([num, label]) => (
                    <div key={label} className="text-center">
                      <div className="text-white font-bold text-xl">{num}</div>
                      <div className="text-white/50 text-xs">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Auth Form */}
          <motion.div
            className="flex-1 flex items-center justify-center p-8 pt-12 overflow-y-auto bg-muted/20"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {authFormContent}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Auth;
