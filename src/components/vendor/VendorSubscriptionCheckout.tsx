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

const PLAN_DETAILS: Record<string, {
  name: string;
  price: number;
  icon: typeof Star;
  color: string;
  bgColor: string;
  tierValue: "free" | "featured" | "sponsored" | "starter" | "pro" | "elite";
}> = {
  starter: { name: "Starter", price: 999, icon: Star, color: "text-slate-500", bgColor: "bg-slate-100", tierValue: "starter" },
  pro: { name: "Pro", price: 2999, icon: Sparkles, color: "text-amber-600", bgColor: "bg-amber-100", tierValue: "pro" },
  elite: { name: "Elite", price: 6999, icon: Crown, color: "text-primary", bgColor: "bg-primary/10", tierValue: "elite" },
};

export function VendorSubscriptionCheckout({
  open, onOpenChange, vendorId, planId, onSuccess,
}: VendorSubscriptionCheckoutProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const offerActive = isOfferActive();

  const plan = planId && PLAN_DETAILS[planId] ? PLAN_DETAILS[planId] : null;
  const discountedPrice = offerActive && plan ? getDiscountedPrice(plan.price) : null;
  const finalPrice = discountedPrice || (plan?.price ?? 0);
  const savings = discountedPrice && plan ? plan.price - discountedPrice : 0;

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

  const handlePayment = async () => {
    if (!plan) return;

    setLoading(true);
    try {
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        "create-payment",
        { body: { amount: finalPrice, subscriptionPlan: planId, vendorId } }
      );
      if (orderError) throw orderError;

      if (!window.Razorpay) {
        throw new Error("Payment system not loaded. Please refresh and try again.");
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Karlo Shaadi",
        description: `${plan.name} Plan Subscription`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              "verify-payment",
              { body: { orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id, signature: response.razorpay_signature, subscriptionPlan: planId, vendorId } }
            );
            if (verifyError) throw verifyError;

            // FIX 5: Idempotency check — skip if payment already recorded
            const { data: existingSub } = await supabase
              .from("vendor_subscriptions")
              .select("id")
              .eq("razorpay_payment_id", response.razorpay_payment_id)
              .maybeSingle();

            if (existingSub) {
              // Already recorded, just succeed
              toast({ title: "Subscription Already Active!", description: `You're on the ${plan.name} plan.` });
              onSuccess();
              onOpenChange(false);
              return;
            }

            // Update vendor subscription tier
            const { error: updateError } = await supabase
              .from("vendors")
              .update({ subscription_tier: plan.tierValue as any })
              .eq("id", vendorId);
            if (updateError) throw updateError;

            // FIX 5: Store finalPrice (not plan.price) and discount_amount
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 1);

            const { error: subError } = await supabase
              .from("vendor_subscriptions")
              .upsert([{
                vendor_id: vendorId,
                plan: plan.tierValue as any,
                status: "active",
                amount: finalPrice,
                discount_amount: plan.price - finalPrice,
                razorpay_payment_id: response.razorpay_payment_id,
                started_at: new Date().toISOString(),
                expires_at: expiresAt.toISOString(),
              }], { onConflict: "vendor_id" });
            if (subError) throw subError;

            toast({ title: "Subscription Activated!", description: `You're now on the ${plan.name} plan. Enjoy your premium features!` });
            onSuccess();
            onOpenChange(false);
          } catch (error: any) {
            console.error("Payment verification error:", error);
            toast({ title: "Payment Verification Failed", description: error.message || "Please contact support.", variant: "destructive" });
          }
        },
        modal: { ondismiss: () => { setLoading(false); } },
        theme: { color: "#D946EF" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response: any) => {
        toast({ title: "Payment Failed", description: response.error?.description || "Please try again.", variant: "destructive" });
        setLoading(false);
      });
      razorpay.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({ title: "Error", description: error.message || "Failed to initiate payment.", variant: "destructive" });
      setLoading(false);
    }
  };

  if (!plan) {
    if (open) console.warn('VendorSubscriptionCheckout: Invalid planId:', planId);
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
          <DialogDescription>Complete your subscription to unlock premium features</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {offerActive && <CountdownBanner compact className="mb-2" />}

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">{plan.name} Plan</span>
              <Badge className={plan.bgColor + " " + plan.color}>{offerActive ? "50% OFF" : "Monthly"}</Badge>
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
              <>{offerActive && <Zap className="mr-1 h-4 w-4" />}Pay ₹{finalPrice.toLocaleString()} & Activate</>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 mt-2">
            <Shield className="h-3 w-3 text-green-500" />
            <p className="text-[10px] text-green-600 font-semibold">100% money-back if no 3 leads in 30 days</p>
          </div>
          <p className="text-xs text-center text-muted-foreground">Secure payment powered by Razorpay. Cancel anytime.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}