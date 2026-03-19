import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Eye, EyeOff, Loader2, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { loginFormSchema, signupFormSchema, sanitizeInput } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import heroAuthImage from "@/assets/hero-auth-mandap.jpg";

type LoginFormData = z.infer<typeof loginFormSchema>;
type SignupFormData = z.infer<typeof signupFormSchema>;

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [authMethod, setAuthMethod] = useState<'password' | 'magic'>('password');
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Extract referral code from URL
  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setReferralCode(refCode);
    }
  }, [searchParams]);

  // Redirect already-authenticated users
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
      const { lovable } = await import("@/integrations/lovable/index");
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/auth`,
      });
      if (result?.error) throw result.error;
      await trackEvent({ event_type: "user_login", metadata: { method: "google" } });
    } catch (error: any) {
      toast({ title: "Google sign-in failed", description: error.message || "Please try again.", variant: "destructive" });
      setIsLoading(false);
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const trimmedEmail = magicLinkEmail.trim();
    if (!trimmedEmail) {
      toast({ title: "Email required", description: "Please enter your email address.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: sanitizeInput(trimmedEmail),
        options: { emailRedirectTo: `${window.location.origin}/auth` },
      });
      if (error) throw error;
      await trackEvent({ event_type: "user_login", metadata: { method: "magic_link" } });
      setMagicLinkSent(true);
      toast({ title: "Magic link sent!", description: "Check your email for a login link." });
    } catch (error: any) {
      toast({ title: "Failed to send magic link", description: error.message || "Please try again.", variant: "destructive" });
    } finally {
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
        toast({ title: "Welcome back!", description: "You've successfully logged in." });
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", authData.user.id);
        if (roles && roles.length > 0) {
          if (roles.some((r) => r.role === "vendor")) navigate("/vendor/dashboard");
          else if (roles.some((r) => r.role === "admin")) navigate("/admin/dashboard");
          else navigate("/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      toast({ title: "Login failed", description: error.message || "Please check your credentials and try again.", variant: "destructive" });
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
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      if (authData.user) {
        const needsEmailConfirmation = authData.user.identities?.length === 0 || 
          (!authData.session && authData.user.email_confirmed_at === null);

        // referred_by is now handled automatically by the handle_new_user trigger
        trackEvent({ event_type: "user_signup", metadata: { role: "couple", referred_by: referralCode || undefined } }).catch(() => {});
        supabase.functions.invoke('onboarding-email', {
          body: { user_id: authData.user.id, email: data.email, name: data.fullName, user_type: 'couple' }
        }).catch(() => { /* best-effort */ });

        const bonusMessage = referralCode ? " You got ₹500 referral bonus!" : "";

        if (needsEmailConfirmation || !authData.session) {
          toast({ title: "Account created! ✉️", description: `Please check your email to verify your account.${bonusMessage}` });
        } else {
          toast({ title: "Account created!", description: `Welcome to Karlo Shaadi.${bonusMessage} Let's plan your perfect wedding!` });
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      toast({ title: "Signup failed", description: error.message || "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const authFormContent = (
    <>
      {/* Referral Banner */}
      {referralCode && (
        <div className="mb-4">
          <div className="bg-gradient-to-r from-accent/20 via-emerald-100/50 to-accent/20 border border-accent/30 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
              <Gift className="h-5 w-5 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm">You've been referred! 🎉</p>
              <p className="text-xs text-muted-foreground">Sign up & get ₹500 off your first booking</p>
            </div>
            <Badge className="ml-auto bg-accent text-accent-foreground shrink-0">₹500</Badge>
          </div>
        </div>
      )}

      <Card className="rounded-2xl border border-border/50 shadow-xl bg-background/95 backdrop-blur-sm ring-1 ring-accent/10">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-0.5 bg-gradient-to-r from-accent/50 via-accent to-accent/50 rounded-full mb-3" />
          <CardTitle className={isMobile ? "text-xl" : "text-2xl"}>Welcome</CardTitle>
          <CardDescription className="text-sm">Login or create your account</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Google Sign In */}
          <Button variant="outline" className="w-full mb-4 gap-2 rounded-xl h-11" onClick={handleGoogleSignIn} disabled={isLoading}>
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
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {/* Auth Method Toggle */}
          <div className="flex justify-center gap-2 mb-4">
            <Button type="button" variant={authMethod === 'password' ? 'default' : 'outline'} size="sm" className="rounded-full" onClick={() => { setAuthMethod('password'); setMagicLinkSent(false); }}>
              Password
            </Button>
            <Button type="button" variant={authMethod === 'magic' ? 'default' : 'outline'} size="sm" className="rounded-full" onClick={() => { setAuthMethod('magic'); setMagicLinkSent(false); }}>
              Magic Link
            </Button>
          </div>

          {authMethod === 'magic' ? (
            <div className="space-y-4">
              {magicLinkSent ? (
                <div className="text-center p-6 bg-accent/5 rounded-2xl">
                  <div className="text-4xl mb-2">✉️</div>
                  <h3 className="font-semibold text-lg mb-1">Check your email</h3>
                  <p className="text-sm text-muted-foreground mb-4">We sent a magic link to <strong>{magicLinkEmail}</strong></p>
                  <Button variant="outline" size="sm" className="rounded-full" onClick={() => { setMagicLinkSent(false); setMagicLinkEmail(""); }}>Use different email</Button>
                </div>
              ) : (
                <form onSubmit={handleMagicLinkLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="magic-email">Email</Label>
                    <Input id="magic-email" type="email" placeholder="you@example.com" value={magicLinkEmail} onChange={(e) => setMagicLinkEmail(e.target.value)} disabled={isLoading} required className="rounded-xl" />
                  </div>
                  <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : "Send Magic Link"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">We'll send you a link to login without a password</p>
                </form>
              )}
            </div>
          ) : (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 rounded-xl">
                <TabsTrigger value="login" className="rounded-lg">Login</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField control={loginForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" placeholder="you@example.com" disabled={isLoading} className="rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={loginForm.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showPassword ? "text" : "password"} placeholder="••••••••" disabled={isLoading} className="rounded-xl" {...field} />
                            <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex items-center justify-between">
                      <Link to="/forgot-password" className="text-sm text-accent hover:underline">Forgot password?</Link>
                    </div>
                    <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Logging in...</> : "Login"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                    <FormField control={signupForm.control} name="fullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input type="text" placeholder="Your name" disabled={isLoading} className="rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={signupForm.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input type="tel" placeholder="9876543210" disabled={isLoading} className="rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={signupForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" placeholder="you@example.com" disabled={isLoading} className="rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={signupForm.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showPassword ? "text" : "password"} placeholder="••••••••" disabled={isLoading} className="rounded-xl" {...field} />
                            <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</> : "Create Account"}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">By signing up, you agree to our Terms and Privacy Policy</p>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          )}

          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="bg-gradient-to-br from-accent/5 via-primary/5 to-accent/10 rounded-2xl p-4 border border-accent/15">
              <p className="text-sm font-semibold text-foreground mb-1.5 text-center">Are you a wedding vendor? 💼</p>
              <p className="text-xs text-muted-foreground text-center mb-3">Join 100% free — zero commission on bookings</p>

              <div className="grid grid-cols-2 gap-2 mb-3 text-[11px] text-muted-foreground">
                <div className="flex items-start gap-1.5">
                  <span className="text-accent mt-0.5 shrink-0">✓</span>
                  <span>AI Contract & Invoice Generator</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-accent mt-0.5 shrink-0">✓</span>
                  <span>Smart CRM & Lead Pipeline</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-accent mt-0.5 shrink-0">✓</span>
                  <span>Portfolio Mini-Site with QR</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-accent mt-0.5 shrink-0">✓</span>
                  <span>Business Intelligence Suite</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-accent mt-0.5 shrink-0">✓</span>
                  <span>Payment & Milestone Tracker</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-accent mt-0.5 shrink-0">✓</span>
                  <span>Verified Badge & Top Placement</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="text-[10px] text-muted-foreground">
                  <span className="font-medium text-foreground">Plans from ₹0</span> · Silver ₹4,999 · Gold ₹9,999
                </div>
              </div>

              <Link to="/vendor/onboarding" className="block">
                <Button variant="outline" className="w-full rounded-xl border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground text-sm h-9 font-medium transition-all">
                  Register as Vendor →
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-4">
        <Link to="/" className="text-sm text-muted-foreground hover:text-accent transition-colors">← Back to home</Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title="Login" />
      
      {/* Mobile: hero banner on top + form below */}
      {isMobile ? (
        <div className="flex flex-col min-h-[calc(100dvh-3rem)] pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] overflow-hidden">
          {/* Compact Hero Banner */}
          <div className="relative h-32 overflow-hidden border-b border-border/40 shrink-0">
            <img src={heroAuthImage} alt="Wedding ceremony" className="w-full h-full object-cover" style={{ filter: 'contrast(1.03) saturate(1.08)' }} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-background" />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-white text-base font-semibold leading-tight">Your Dream Wedding Starts Here</p>
            </div>
          </div>

          <motion.div
            className="flex-1 flex items-center justify-center px-3 py-4 overflow-y-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="w-full max-w-md">
              {authFormContent}
            </div>
          </motion.div>
        </div>
      ) : (
        /* Desktop: split layout - image left, form right */
        <div className="flex min-h-screen">
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
            <img src={heroAuthImage} alt="Wedding ceremony" className="w-full h-full object-cover" style={{ filter: 'contrast(1.03) saturate(1.08)' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12">
              <p className="text-white/80 text-sm font-medium tracking-widest uppercase mb-2">Karlo Shaadi</p>
              <h2 className="text-white text-4xl font-bold leading-tight mb-3">Your Dream Wedding<br />Starts Here</h2>
              <p className="text-white/70 text-base max-w-md">Aap Shaadi Karo, Tension Hum Sambhal Lenge</p>
            </div>
          </div>
          <motion.div 
            className="flex-1 flex items-center justify-center p-8 pt-24"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="w-full max-w-md">
              {authFormContent}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Auth;
