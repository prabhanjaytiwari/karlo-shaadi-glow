import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Eye, EyeOff, Building2, TrendingUp, Users, Award, Loader2, ArrowRight } from "lucide-react";
import { sanitizeInput } from "@/lib/validation";

const VendorAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [authMethod, setAuthMethod] = useState<'password' | 'magic'>('password');
  const [checkingSession, setCheckingSession] = useState(true);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Check if already signed in on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: vendorProfile } = await supabase
          .from("vendors")
          .select("id")
          .eq("user_id", session.user.id)
          .maybeSingle();
        if (vendorProfile) {
          navigate("/vendor/dashboard", { replace: true });
        } else {
          navigate("/vendor/onboarding", { replace: true });
        }
        return;
      }
      setCheckingSession(false);
    };
    checkSession();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { lovable } = await import("@/integrations/lovable/index");
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/vendor-auth`,
      });

      if (result?.error) throw result.error;

      await trackEvent({
        event_type: "vendor_login",
        metadata: { method: "google" },
      });
    } catch (error: any) {
      toast({
        title: "Google sign-in failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const trimmedEmail = magicLinkEmail.trim();
    if (!trimmedEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: sanitizeInput(trimmedEmail),
        options: {
          emailRedirectTo: `${window.location.origin}/vendor/onboarding`,
        },
      });

      if (error) throw error;

      await trackEvent({
        event_type: "vendor_login",
        metadata: { method: "magic_link" },
      });

      setMagicLinkSent(true);
      toast({
        title: "Magic link sent!",
        description: "Check your email for a login link.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to send magic link",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!loginEmail.trim() || !loginPassword) {
      toast({
        title: "Validation error",
        description: "Email and password are required",
        variant: "destructive",
      });
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
        await trackEvent({
          event_type: "vendor_login",
          metadata: { method: "password" },
        });

        toast({
          title: "Welcome back!",
          description: "Redirecting to your dashboard...",
        });

        // Check if user already has a vendor profile
        const { data: vendorProfile } = await supabase
          .from("vendors")
          .select("id")
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (vendorProfile) {
          navigate("/vendor/dashboard");
        } else {
          // New vendor - redirect to onboarding (will skip Step 0 since authenticated)
          navigate("/vendor/onboarding");
        }
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Benefits */}
          <div className="hidden md:block space-y-6 animate-fade-up">
            <div className="space-y-2">
              <h1 className="font-display font-bold text-4xl">Welcome Back, Vendor!</h1>
              <p className="text-xl text-muted-foreground">Login to manage your wedding business</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 glass-subtle rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Verified Platform</h3>
                  <p className="text-sm text-muted-foreground">
                    Get verified badge and build trust with 50,000+ couples
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 glass-subtle rounded-lg">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">More Bookings</h3>
                  <p className="text-sm text-muted-foreground">Get 3-5x more inquiries than traditional marketing</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 glass-subtle rounded-lg">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Secure Payments</h3>
                  <p className="text-sm text-muted-foreground">
                    Milestone-based payments with zero commission on bookings
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 glass-subtle rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Premium Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Portfolio showcase, reviews management, and analytics dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <Card className="animate-fade-up">
            <CardHeader>
              <CardTitle>Vendor Login</CardTitle>
              <CardDescription>Access your vendor dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              {/* New vendor CTA */}
              <div className="mb-5 p-4 rounded-xl bg-accent/5 border border-accent/20">
                <p className="text-sm font-semibold text-foreground mb-1">New to Karlo Shaadi?</p>
                <p className="text-xs text-muted-foreground mb-3">Create your vendor profile in minutes and start getting bookings.</p>
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="sm">
                  <Link to="/vendor/onboarding">
                    Start Your Journey <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* Google Sign In Button */}
              <Button variant="outline" className="w-full mb-4 gap-2" onClick={handleGoogleSignIn} disabled={isLoading}>
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
                  <span className="w-full border-t border-accent/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or login with email</span>
                </div>
              </div>

              {/* Auth Method Toggle */}
              <div className="flex justify-center gap-2 mb-4">
                <Button
                  type="button"
                  variant={authMethod === 'password' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => { setAuthMethod('password'); setMagicLinkSent(false); }}
                >
                  Password
                </Button>
                <Button
                  type="button"
                  variant={authMethod === 'magic' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => { setAuthMethod('magic'); setMagicLinkSent(false); }}
                >
                  Magic Link
                </Button>
              </div>

              {authMethod === 'magic' ? (
                <div className="space-y-4">
                  {magicLinkSent ? (
                    <div className="text-center p-6 bg-accent/5 rounded-lg">
                      <div className="text-4xl mb-2">✉️</div>
                      <h3 className="font-semibold text-lg mb-1">Check your email</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        We sent a magic link to <strong>{magicLinkEmail}</strong>
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setMagicLinkSent(false); setMagicLinkEmail(""); }}
                      >
                        Use different email
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleMagicLinkLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="magic-email">Business Email</Label>
                        <Input
                          id="magic-email"
                          type="email"
                          placeholder="business@example.com"
                          value={magicLinkEmail}
                          onChange={(e) => setMagicLinkEmail(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Magic Link"
                        )}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        We'll send you a link to login without a password
                      </p>
                    </form>
                  )}
                </div>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="business@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-accent hover:underline block"
                  >
                    Forgot password?
                  </Link>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login to Dashboard"
                    )}
                  </Button>
                </form>
              )}

              {/* Couple Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Looking for vendors?{" "}
                  <Link to="/auth" className="text-accent hover:underline font-medium">
                    Sign up as couple
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VendorAuth;
