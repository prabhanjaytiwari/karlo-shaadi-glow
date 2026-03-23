import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, Star, Sparkles, Crown, Shield, Tag, AlertTriangle, MessageCircle } from "lucide-react";
import { validatePromoCode, applyPromoDiscount, type PromoCode } from "@/lib/promoCodes";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface VendorSubscriptionCheckoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorId: string;
  planId: string;
  onSuccess: () => void;
}

const PLAN_DETAILS: Record<string, {
  name: string;
  price: number;
  icon: typeof Star;
  color: string;
  bgColor: string;
  tierValue: "starter" | "pro" | "elite";
}> = {
  starter: { name: "Starter", price: 999, icon: Star, color: "text-slate-500", bgColor: "bg-slate-100", tierValue: "starter" },
  pro: { name: "Pro", price: 2999, icon: Sparkles, color: "text-amber-600", bgColor: "bg-amber-100", tierValue: "pro" },
  elite: { name: "Elite", price: 6999, icon: Crown, color: "text-primary", bgColor: "bg-primary/10", tierValue: "elite" },
};

async function logClientEvent(data: {
  vendor_id: string;
  event_type: string;
  plan?: string;
  amount?: number;
  status: string;
  error_message?: string;
  razorpay_payment_id?: string;
  razorpay_subscription_id?: string;
  metadata?: any;
}) {
  try {
    await supabase.from("payment_logs").insert([{
      vendor_id: data.vendor_id,
      event_type: data.event_type,
      plan: data.plan || null,
      amount: data.amount || null,
      status: data.status,
      error_message: data.error_message || null,
      razorpay_payment_id: data.razorpay_payment_id || null,
      razorpay_subscription_id: data.razorpay_subscription_id || null,
      metadata: data.metadata || {},
    }]);
  } catch (e) {
    console.error("Failed to log client event:", e);
  }
}

export function VendorSubscriptionCheckout({
  open, onOpenChange, vendorId, planId, onSuccess,
}: VendorSubscriptionCheckoutProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState("");
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [failedRef, setFailedRef] = useState<string | null>(null);

  const plan = planId && PLAN_DETAILS[planId] ? PLAN_DETAILS[planId] : null;
  const finalPrice = appliedPromo && plan ? applyPromoDiscount(plan.price, appliedPromo) : (plan?.price ?? 0);
  const savings = plan ? plan.price - finalPrice : 0;

  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
    } else {
      setRazorpayLoaded(true);
    }
  }, []);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setPaymentState("idle");
      setFailedRef(null);
    }
  }, [open]);

  const handleApplyPromo = () => {
    setPromoError("");
    if (!promoCode.trim()) return;
    const promo = validatePromoCode(promoCode, 'vendor');
    if (promo) {
      setAppliedPromo(promo);
      setPromoError("");
      toast({ title: "Promo code applied!", description: `${promo.discountPercent}% discount activated.` });
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
    if (!plan) return;

    setLoading(true);
    setPaymentState("processing");

    // Log checkout initiated
    await logClientEvent({
      vendor_id: vendorId,
      event_type: "checkout_initiated",
      plan: planId,
      amount: finalPrice,
      status: "pending",
      metadata: { promo_code: appliedPromo?.code || null },
    });

    try {
      const { data: subData, error: subError } = await supabase.functions.invoke(
        "create-vendor-subscription",
        {
          body: {
            vendorId,
            plan: planId,
            promoCode: appliedPromo?.code || null,
            finalAmount: finalPrice,
          },
        }
      );
      if (subError) throw subError;

      if (!window.Razorpay) {
        throw new Error("Payment system not loaded. Please refresh and try again.");
      }

      const options = {
        key: subData.keyId,
        subscription_id: subData.subscriptionId,
        name: "Karlo Shaadi",
        description: `${plan.name} Plan — Monthly Subscription`,
        handler: async (response: any) => {
          try {
            // Log razorpay callback
            await logClientEvent({
              vendor_id: vendorId,
              event_type: "razorpay_callback_success",
              plan: planId,
              amount: finalPrice,
              status: "success",
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: subData.subscriptionId,
            });

            // Write client-side subscription data as fallback
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 1);

            await supabase
              .from("vendor_subscriptions")
              .upsert([{
                vendor_id: vendorId,
                plan: plan.tierValue as any,
                status: "active",
                amount: finalPrice,
                discount_amount: savings,
                razorpay_subscription_id: subData.subscriptionId,
                razorpay_payment_id: response.razorpay_payment_id,
                started_at: new Date().toISOString(),
                expires_at: expiresAt.toISOString(),
              }], { onConflict: "vendor_id" });

            await supabase
              .from("vendors")
              .update({ subscription_tier: plan.tierValue as any })
              .eq("id", vendorId);

            setPaymentState("success");
            setLoading(false);

            toast({
              title: "Subscription Activated! 🎉",
              description: `Your ${plan.name} plan is active. Auto-renews monthly.`,
            });

            // Delay closing to show success state
            setTimeout(() => {
              onSuccess();
              onOpenChange(false);
            }, 2000);
          } catch (error: any) {
            console.error("Post-payment error:", error);

            await logClientEvent({
              vendor_id: vendorId,
              event_type: "client_db_write_failed",
              plan: planId,
              amount: finalPrice,
              status: "failed",
              error_message: error.message,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: subData.subscriptionId,
            });

            // Payment was captured — show success with caveat
            setPaymentState("success");
            setLoading(false);
            toast({
              title: "Payment Received ✓",
              description: "Your payment was captured. Plan will activate within minutes.",
            });
            setTimeout(() => {
              onSuccess();
              onOpenChange(false);
            }, 2000);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setPaymentState("idle");
          },
        },
        theme: { color: "#D946EF" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", async (response: any) => {
        const errorDesc = response.error?.description || "Payment failed. Please try again.";
        const refId = response.error?.metadata?.payment_id || "";

        await logClientEvent({
          vendor_id: vendorId,
          event_type: "razorpay_payment_failed",
          plan: planId,
          amount: finalPrice,
          status: "failed",
          error_message: errorDesc,
          razorpay_payment_id: refId,
          razorpay_subscription_id: subData.subscriptionId,
          metadata: { error_code: response.error?.code, error_reason: response.error?.reason },
        });

        setFailedRef(refId);
        setPaymentState("failed");
        setLoading(false);
      });
      razorpay.open();
    } catch (error: any) {
      console.error("Payment error:", error);

      await logClientEvent({
        vendor_id: vendorId,
        event_type: "checkout_error",
        plan: planId,
        amount: finalPrice,
        status: "failed",
        error_message: error.message,
      });

      setPaymentState("failed");
      setFailedRef(null);
      toast({ title: "Error", description: error.message || "Failed to initiate payment.", variant: "destructive" });
      setLoading(false);
    }
  };

  if (!plan) {
    if (open) console.warn('VendorSubscriptionCheckout: Invalid planId:', planId);
    return null;
  }

  const PlanIcon = plan.icon;

  // Success state
  if (paymentState === "success") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md text-center py-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold">Your {plan.name} Plan is Active! 🎉</h3>
            <p className="text-sm text-muted-foreground">
              Monthly subscription activated. Auto-renews every month. Cancel anytime from Settings.
            </p>
            <Badge className="bg-emerald-100 text-emerald-700 text-sm px-4 py-1.5">
              ₹{finalPrice.toLocaleString()}/month
            </Badge>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Failed state
  if (paymentState === "failed") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold">Payment Failed</h3>
            <p className="text-sm text-muted-foreground">
              Your payment could not be processed. No amount has been deducted.
            </p>
            {failedRef && (
              <p className="text-[10px] text-muted-foreground font-mono bg-muted/50 px-3 py-1.5 rounded">
                Ref: {failedRef}
              </p>
            )}
            <div className="flex gap-3 w-full">
              <Button
                className="flex-1"
                onClick={() => {
                  setPaymentState("idle");
                  setFailedRef(null);
                }}
              >
                Retry Payment
              </Button>
              <Button
                variant="outline"
                className="gap-1.5"
                onClick={() => window.open("https://wa.me/919876543210?text=Payment%20issue%20for%20vendor%20subscription", "_blank")}
              >
                <MessageCircle className="h-4 w-4" />
                Support
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${plan.bgColor}`}>
              <PlanIcon className={`h-5 w-5 ${plan.color}`} />
            </div>
            Upgrade to {plan.name}
          </DialogTitle>
          <DialogDescription>Monthly subscription — auto-renews, cancel anytime</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">{plan.name} Plan</span>
              <Badge className={plan.bgColor + " " + plan.color}>Monthly</Badge>
            </div>
            <div className="flex justify-between items-baseline">
              {savings > 0 ? (
                <div>
                  <span className="text-lg line-through text-muted-foreground mr-2">₹{plan.price.toLocaleString()}</span>
                  <span className="text-3xl font-black text-primary">₹{finalPrice.toLocaleString()}</span>
                </div>
              ) : (
                <span className="text-3xl font-bold">₹{plan.price.toLocaleString()}</span>
              )}
              <span className="text-muted-foreground">per month</span>
            </div>
            {savings > 0 && (
              <p className="text-xs text-green-600 font-bold">💰 You save ₹{savings.toLocaleString()} on first month!</p>
            )}
          </div>

          {/* Promo Code Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              Promo Code
            </label>
            {appliedPromo ? (
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">{appliedPromo.code}</span>
                  <span className="text-xs text-green-600">— {appliedPromo.discountPercent}% off</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleRemovePromo} className="text-xs h-7 text-red-500 hover:text-red-700">
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(""); }}
                  className="flex-1 uppercase"
                />
                <Button variant="outline" size="sm" onClick={handleApplyPromo} className="px-4">
                  Apply
                </Button>
              </div>
            )}
            {promoError && <p className="text-xs text-destructive">{promoError}</p>}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">What you'll get:</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {planId === "starter" && (
                <>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Top 10 search placement</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Silver verified badge</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />7% transaction fee (save 3%)</li>
                </>
              )}
              {planId === "pro" && (
                <>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Top 5 search placement</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Gold Verified badge</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />3% transaction fee (save 7%)</li>
                </>
              )}
              {planId === "elite" && (
                <>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Homepage featured placement</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Diamond Premium badge</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Zero transaction fees!</li>
                </>
              )}
            </ul>
          </div>

          <Button className="w-full" size="lg" onClick={handlePayment} disabled={loading || !razorpayLoaded}>
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
            ) : (
              <>Subscribe ₹{finalPrice.toLocaleString()}/month</>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 mt-2">
            <Shield className="h-3 w-3 text-green-500" />
            <p className="text-[10px] text-green-600 font-semibold">100% money-back if no 3 leads in 30 days</p>
          </div>
          <p className="text-xs text-center text-muted-foreground">Secure recurring payment via Razorpay. Cancel anytime from Settings.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
