import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Eye, EyeOff, Building2, TrendingUp, Users, Award } from "lucide-react";
import { sanitizeInput } from "@/lib/validation";

const VendorAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");

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
          event_type: 'vendor_login',
          metadata: { method: 'password' },
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
          // New vendor - redirect to onboarding
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const trimmedOwnerName = ownerName.trim();
    const trimmedBusinessName = businessName.trim();
    const trimmedEmail = signupEmail.trim();

    if (!trimmedOwnerName || trimmedOwnerName.length < 2 || trimmedOwnerName.length > 100) {
      toast({
        title: "Validation error",
        description: "Owner name must be between 2-100 characters",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!trimmedBusinessName || trimmedBusinessName.length < 3 || trimmedBusinessName.length > 100) {
      toast({
        title: "Validation error",
        description: "Business name must be between 3-100 characters",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!trimmedEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({
        title: "Validation error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: "Validation error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/vendor/onboarding`;

      const { data, error } = await supabase.auth.signUp({
        email: sanitizeInput(trimmedEmail),
        password: signupPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: sanitizeInput(trimmedOwnerName),
            business_name: sanitizeInput(trimmedBusinessName),
            phone: phone ? sanitizeInput(phone.trim()) : null,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        await trackEvent({
          event_type: 'vendor_signup',
          metadata: { method: 'password' },
        });

        // Create vendor role
        await supabase.from("user_roles").insert([{
          user_id: data.user.id,
          role: "vendor",
        }]);

        toast({
          title: "Account created!",
          description: "Redirecting to vendor onboarding...",
        });

        // Redirect to onboarding
        navigate("/vendor/onboarding");
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Unable to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Benefits */}
          <div className="hidden md:block space-y-6 animate-fade-up">
            <div className="space-y-2">
              <h1 className="font-display font-bold text-4xl">
                Grow Your Wedding Business
              </h1>
              <p className="text-xl text-muted-foreground">
                Join 10,000+ vendors earning ₹5-20 lakhs annually
              </p>
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
                  <p className="text-sm text-muted-foreground">
                    Get 3-5x more inquiries than traditional marketing
                  </p>
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

          {/* Right Side - Auth Form */}
          <Card className="animate-fade-up">
            <CardHeader>
              <CardTitle>Vendor Registration</CardTitle>
              <CardDescription>
                Start growing your wedding business today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signup" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  <TabsTrigger value="login">Login</TabsTrigger>
                </TabsList>

                {/* Signup Tab */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="owner-name">Your Name</Label>
                      <Input
                        id="owner-name"
                        type="text"
                        placeholder="Owner/Manager name"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business-name">Business Name</Label>
                      <Input
                        id="business-name"
                        type="text"
                        placeholder="Your business name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone Number</Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Business Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="business@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                          minLength={6}
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
                      <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Vendor Account"}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By signing up, you agree to our Terms and Privacy Policy
                    </p>
                  </form>
                </TabsContent>

                {/* Login Tab */}
                <TabsContent value="login">
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

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login to Dashboard"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

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
