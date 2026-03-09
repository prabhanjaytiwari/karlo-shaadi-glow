import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, Star, Sparkles, Crown, Shield, Zap } from "lucide-react";
import { CountdownBanner, isOfferActive, getDiscountedPrice } from "@/components/CountdownBanner";

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

// Plan tiers mapping to vendor_subscription_plan enum values
// Note: The database enum has: free, featured, sponsored
// We map Silver->free (with paid benefits), Gold->featured, Diamond->sponsored
const PLAN_DETAILS: Record<string, {
  name: string;
  price: number;
  icon: typeof Star;
  color: string;
  bgColor: string;
  tierValue: "free" | "featured" | "sponsored";
}> = {
  silver: {
    name: "Silver",
    price: 4999,
    icon: Star,
    color: "text-slate-500",
    bgColor: "bg-slate-100",
    tierValue: "free", // Silver uses 'free' tier value in DB
  },
  gold: {
    name: "Gold",
    price: 9999,
    icon: Sparkles,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    tierValue: "featured",
  },
  diamond: {
    name: "Diamond",
    price: 19999,
    icon: Crown,
    color: "text-primary",
    bgColor: "bg-primary/10",
    tierValue: "sponsored",
  },
};

export function VendorSubscriptionCheckout({
  open,
  onOpenChange,
  vendorId,
  planId,
  onSuccess,
}: VendorSubscriptionCheckoutProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const offerActive = isOfferActive();

  // Get plan details safely
  const plan = planId && PLAN_DETAILS[planId] ? PLAN_DETAILS[planId] : null;
  const discountedPrice = offerActive && plan ? getDiscountedPrice(plan.price) : null;
  const finalPrice = discountedPrice || (plan?.price ?? 0);
  const savings = discountedPrice && plan ? plan.price - discountedPrice : 0;

  useEffect(() => {
    // Load Razorpay script
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

  const handlePayment = async () => {
    if (!plan) return;

    setLoading(true);
    try {
      // Create payment order
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        "create-payment",
        {
          body: {
            amount: finalPrice,
            subscriptionPlan: planId,
            vendorId: vendorId,
          },
        }
      );

      if (orderError) throw orderError;

      if (!window.Razorpay) {
        throw new Error("Payment system not loaded. Please refresh and try again.");
      }

      // Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Karlo Shaadi",
        description: `${plan.name} Plan Subscription`,
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
                  subscriptionPlan: planId,
                  vendorId: vendorId,
                },
              }
            );

            if (verifyError) throw verifyError;

            // Update vendor subscription tier
            const { error: updateError } = await supabase
              .from("vendors")
              .update({ subscription_tier: plan.tierValue })
              .eq("id", vendorId);

            if (updateError) throw updateError;

            // Create/update vendor subscription record
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 1);

            const { error: subError } = await supabase
              .from("vendor_subscriptions")
              .upsert({
                vendor_id: vendorId,
                plan: plan.tierValue,
                status: "active",
                amount: plan.price,
                razorpay_payment_id: response.razorpay_payment_id,
                started_at: new Date().toISOString(),
                expires_at: expiresAt.toISOString(),
              }, { onConflict: "vendor_id" });

            if (subError) throw subError;

            toast({
              title: "Subscription Activated!",
              description: `You're now on the ${plan.name} plan. Enjoy your premium features!`,
            });

            onSuccess();
            onOpenChange(false);
          } catch (error: any) {
            console.error("Payment verification error:", error);
            toast({
              title: "Payment Verification Failed",
              description: error.message || "Please contact support.",
              variant: "destructive",
            });
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        theme: {
          color: "#D946EF",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response: any) => {
        toast({
          title: "Payment Failed",
          description: response.error?.description || "Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      });
      razorpay.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to initiate payment.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Don't render dialog if plan is invalid
  if (!plan) {
    // Close dialog if it's open but plan is invalid
    if (open) {
      console.warn('VendorSubscriptionCheckout: Invalid planId:', planId);
    }
    return null;
  }

  const PlanIcon = plan.icon;

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
          <DialogDescription>
            Complete your subscription to unlock premium features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Countdown */}
          {offerActive && <CountdownBanner compact className="mb-2" />}

          {/* Plan Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">{plan.name} Plan</span>
              <Badge className={plan.bgColor + " " + plan.color}>
                {offerActive ? "50% OFF" : "Monthly"}
              </Badge>
            </div>
            <div className="flex justify-between items-baseline">
              {discountedPrice ? (
                <div>
                  <span className="text-lg line-through text-muted-foreground mr-2">₹{plan.price.toLocaleString()}</span>
                  <span className="text-3xl font-black text-primary">₹{discountedPrice.toLocaleString()}</span>
                </div>
              ) : (
                <span className="text-3xl font-bold">₹{plan.price.toLocaleString()}</span>
              )}
              <span className="text-muted-foreground">{discountedPrice ? "first month" : "per month"}</span>
            </div>
            {savings > 0 && (
              <p className="text-xs text-green-600 font-bold">💰 You save ₹{savings.toLocaleString()}! Then ₹{plan.price.toLocaleString()}/month</p>
            )}
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <p className="text-sm font-medium">What you'll get:</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {planId === "silver" && (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Top 10 search placement
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Silver badge on profile
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    12% transaction fee (save 3%)
                  </li>
                </>
              )}
              {planId === "gold" && (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Top 5 search placement
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Gold Verified badge
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    8% transaction fee (save 7%)
                  </li>
                </>
              )}
              {planId === "diamond" && (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Homepage featured placement
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Diamond Premium badge
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Zero transaction fees!
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Payment Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handlePayment}
            disabled={loading || !razorpayLoaded}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {offerActive && <Zap className="mr-1 h-4 w-4" />}
                Pay ₹{finalPrice.toLocaleString()} & Activate
              </>
            )}
          </Button>

          {/* Risk reversal */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <Shield className="h-3 w-3 text-green-500" />
            <p className="text-[10px] text-green-600 font-semibold">
              100% money-back if no 3 leads in 30 days
            </p>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Secure payment powered by Razorpay. Cancel anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
