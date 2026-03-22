import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Crown, Shield, Check, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { 
  trackPaymentInitiated, 
  trackPaymentCompleted, 
  trackPaymentFailed, 
  trackSubscriptionStarted 
} from "@/lib/analytics";
import { validatePromoCode, applyPromoDiscount, type PromoCode } from "@/lib/promoCodes";
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SubscriptionCheckout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [session, setSession] = useState<any>(null);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth?redirect=/subscription-checkout?plan=" + plan);
        return;
      }
      setSession(session);
    } catch {
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState("");

  const currentPlan = plan === "ai_premium" ? planDetails.ai_premium : null;
  const finalPrice = appliedPromo && currentPlan ? applyPromoDiscount(currentPlan.price, appliedPromo) : (currentPlan?.price ?? 0);
  const savings = currentPlan ? currentPlan.price - finalPrice : 0;

  const handleApplyPromo = () => {
    setPromoError("");
    if (!promoCode.trim()) return;
    const promo = validatePromoCode(promoCode, 'couple');
    if (promo) {
      setAppliedPromo(promo);
      toast.success(`${promo.discountPercent}% discount applied!`);
    } else {
      setAppliedPromo(null);
      setPromoError("Invalid promo code");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
  };

  const handlePayment = async () => {
    if (!currentPlan || !session) return;

    setProcessing(true);
    trackPaymentInitiated(finalPrice, "subscription");
    
    try {
      // Create Razorpay order
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        "create-payment",
        {
          body: {
            amount: finalPrice,
            subscriptionPlan: plan
          }
        }
      );

      if (orderError) throw orderError;

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Karlo Shaadi",
        description: `${currentPlan.name} Subscription`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              "verify-payment",
              {
                body: {
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  subscriptionPlan: plan
                }
              }
            );

            if (verifyError) throw verifyError;

            trackPaymentCompleted(finalPrice, response.razorpay_payment_id, "subscription");
            trackSubscriptionStarted(plan, finalPrice);
            toast.success("Subscription activated successfully!");
            navigate("/premium-dashboard");
          } catch (error: any) {
            trackPaymentFailed(finalPrice, error.message);
            toast.error(error.message || "Payment verification failed");
            navigate("/payment-failure");
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            toast.info("Payment cancelled");
          }
        },
        prefill: {
          email: session.user.email,
        },
        theme: {
          color: "#D946EF"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.error(error.message || "Payment failed");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentPlan) {
    return (
      <div className="min-h-screen flex flex-col">
        
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Invalid Plan</CardTitle>
              <CardDescription>Please select a valid subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/pricing")}>View Plans</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">


      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="premium" className="mb-4">
              <Crown className="h-3 w-3 mr-1" />
              Premium Subscription
            </Badge>
            <h1 className="text-4xl font-bold mb-2">Complete Your Subscription</h1>
            <p className="text-muted-foreground">
              Start your AI-powered wedding planning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Plan Details */}
            <Card className="animate-fade-up">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <currentPlan.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{currentPlan.name}</CardTitle>
                    <CardDescription>Monthly Subscription</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {currentPlan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card className="animate-fade-up" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subscription</span>
                    <div className="text-right">
                      {savings > 0 ? (
                        <div>
                          <span className="line-through text-muted-foreground mr-2">₹{currentPlan.price}</span>
                        </div>
                      ) : (
                        <span className="font-medium">₹{currentPlan.price}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Billing Cycle</span>
                    <span className="font-medium">Monthly</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 font-semibold">Promo Discount</span>
                      <span className="text-green-600 font-bold">- ₹{savings}</span>
                    </div>
                  )}

                  {/* Promo Code */}
                  <div className="pt-2 space-y-2">
                    <label className="text-xs font-medium flex items-center gap-1"><Tag className="h-3 w-3" />Promo Code</label>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 border border-green-200">
                        <span className="text-xs font-semibold text-green-700">{appliedPromo.code} — {appliedPromo.discountPercent}% off</span>
                        <button onClick={handleRemovePromo} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input placeholder="Enter code" value={promoCode} onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(""); }} className="h-8 text-xs uppercase" />
                        <Button variant="outline" size="sm" onClick={handleApplyPromo} className="h-8 text-xs px-3">Apply</Button>
                      </div>
                    )}
                    {promoError && <p className="text-xs text-destructive">{promoError}</p>}
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total Today</span>
                      <span className="text-2xl font-bold text-primary">₹{finalPrice}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recurring monthly until cancelled. Cancel anytime.
                    </p>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <LoadingSpinner />
                      Processing...
                    </>
                  ) : (
                    <>
                      {offerActive ? <Zap className="h-4 w-4 mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                      {offerActive ? `Pay ₹${finalPrice} — 50% OFF` : "Proceed to Payment"}
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  Secure payment via Razorpay
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Terms */}
          <Card className="mt-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                By subscribing, you agree to our Terms of Service and Privacy Policy. 
                Your subscription will automatically renew monthly until cancelled. 
                You can cancel anytime from your dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      
    </div>
  );
}
