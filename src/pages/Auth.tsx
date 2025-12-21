import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Eye, EyeOff, Phone, Mail, Loader2 } from "lucide-react";
import { loginFormSchema, signupFormSchema, phoneOtpSchema, otpCodeSchema, sanitizeInput } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type LoginFormData = z.infer<typeof loginFormSchema>;
type SignupFormData = z.infer<typeof signupFormSchema>;
type PhoneFormData = z.infer<typeof phoneOtpSchema>;
type OtpFormData = z.infer<typeof otpCodeSchema>;

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneStep, setPhoneStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneOtpSchema),
    defaultValues: {
      phone: "",
    },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      await trackEvent({
        event_type: "user_login",
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

  const handleSendOtp = async (data: PhoneFormData) => {
    setIsLoading(true);
    const formattedPhone = `+91${data.phone}`;
    setPhoneNumber(formattedPhone);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      toast({
        title: "OTP Sent!",
        description: "Check your phone for the verification code.",
      });
      setPhoneStep("otp");
    } catch (error: any) {
      toast({
        title: "Failed to send OTP",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (data: OtpFormData) => {
    setIsLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: data.code,
        type: "sms",
      });

      if (error) throw error;

      if (authData.user) {
        await trackEvent({
          event_type: "user_login",
          metadata: { method: "phone_otp" },
        });

        toast({
          title: "Welcome!",
          description: "You've successfully logged in.",
        });

        // Check user role and redirect
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", authData.user.id);

        if (roles && roles.length > 0) {
          if (roles.some((r) => r.role === "vendor")) {
            navigate("/vendor/dashboard");
          } else if (roles.some((r) => r.role === "admin")) {
            navigate("/admin/dashboard");
          } else {
            navigate("/dashboard");
          }
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
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
        await trackEvent({
          event_type: "user_login",
          metadata: { method: "password" },
        });

        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });

        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", authData.user.id);

        if (roles && roles.length > 0) {
          if (roles.some((r) => r.role === "vendor")) {
            navigate("/vendor/dashboard");
          } else if (roles.some((r) => r.role === "admin")) {
            navigate("/admin/dashboard");
          } else {
            navigate("/dashboard");
          }
        } else {
          navigate("/dashboard");
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

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: sanitizeInput(data.email),
        password: data.password,
        options: {
          data: {
            full_name: sanitizeInput(data.fullName),
            phone: data.phone || null,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      if (authData.user) {
        await trackEvent({
          event_type: "user_signup",
          metadata: { role: "couple" },
        });

        toast({
          title: "Account created!",
          description: "Welcome to Karlo Shaadi. Let's plan your perfect wedding!",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60 flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-md">
        <Card className="animate-fade-up bg-white/90 border-2 border-accent/20 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 rounded-full mb-4" />
            <CardTitle className="text-2xl text-foreground">Welcome</CardTitle>
            <CardDescription>Login or create your account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Google Sign In Button */}
            <Button
              variant="outline"
              className="w-full mb-4 gap-2"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-accent/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">or continue with</span>
              </div>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="login" className="gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="phone" className="gap-1">
                  <Phone className="h-4 w-4" />
                  Phone
                </TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Email Login Tab */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" disabled={isLoading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                disabled={isLoading}
                                {...field}
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between">
                      <Link
                        to="/forgot-password"
                        className="text-sm text-accent hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* Phone OTP Tab */}
              <TabsContent value="phone">
                {phoneStep === "phone" ? (
                  <Form {...phoneForm}>
                    <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-4">
                      <FormField
                        control={phoneForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                  +91
                                </span>
                                <Input
                                  type="tel"
                                  placeholder="9876543210"
                                  className="rounded-l-none"
                                  disabled={isLoading}
                                  maxLength={10}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-4">
                      <div className="text-center mb-4">
                        <p className="text-sm text-muted-foreground">
                          Enter the 6-digit code sent to{" "}
                          <span className="font-medium text-foreground">{phoneNumber}</span>
                        </p>
                      </div>

                      <FormField
                        control={otpForm.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-center">
                            <FormControl>
                              <InputOTP maxLength={6} {...field}>
                                <InputOTPGroup>
                                  <InputOTPSlot index={0} />
                                  <InputOTPSlot index={1} />
                                  <InputOTPSlot index={2} />
                                  <InputOTPSlot index={3} />
                                  <InputOTPSlot index={4} />
                                  <InputOTPSlot index={5} />
                                </InputOTPGroup>
                              </InputOTP>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify OTP"
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          setPhoneStep("phone");
                          otpForm.reset();
                        }}
                      >
                        Change phone number
                      </Button>
                    </form>
                  </Form>
                )}
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Your name" disabled={isLoading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="9876543210" disabled={isLoading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" disabled={isLoading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                disabled={isLoading}
                                {...field}
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
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By signing up, you agree to our Terms and Privacy Policy
                    </p>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-accent/20 text-center">
              <p className="text-sm text-muted-foreground">
                Are you a vendor?{" "}
                <Link to="/vendor-auth" className="text-accent hover:underline font-medium">
                  Join as a vendor
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-accent transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
