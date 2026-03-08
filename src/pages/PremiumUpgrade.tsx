import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BhindiHeader } from "@/components/BhindiHeader";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, Crown, Zap, Shield, Loader2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = [
  {
    id: 'premium',
    name: 'Premium',
    icon: Zap,
    price: 2999,
    period: 'One-time payment',
    description: 'Everything you need to plan your perfect wedding',
    color: 'from-primary to-accent',
    features: [
      'Unlimited favorites & bookings',
      'Advanced filters & search',
      'Vendor comparison (unlimited)',
      'Priority booking & responses',
      'Wedding budget planner tool',
      'Guest list management',
      'Digital wedding checklist',
      'WhatsApp support (24hr response)',
    ]
  },
  {
    id: 'vip',
    name: 'VIP',
    icon: Crown,
    price: 9999,
    period: 'One-time payment',
    description: 'White-glove service for your dream wedding',
    color: 'from-yellow-500 to-orange-500',
    features: [
      'Everything in Premium',
      'Dedicated wedding manager',
      'Personal vendor recommendations',
      'Negotiation support',
      'On-ground coordination support',
      'Priority phone support (4hr response)',
      'Vendor contract review',
      'Custom timeline & schedule',
      'Exclusive vendor discounts'
    ]
  }
];

export default function PremiumUpgrade() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const selectedPlanId = searchParams.get('plan') || 'premium';

  useEffect(() => {
    checkAuth();
    loadRazorpayScript();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    setCurrentUser(session.user);
    
    // Load current subscription
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
    
    setCurrentSubscription(sub);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async (plan: typeof plans[0]) => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    setLoading(true);

    try {
      // Create payment order
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'create-payment',
        {
          body: {
            amount: plan.price,
            milestone: 'subscription',
            subscriptionPlan: plan.id,
          }
        }
      );

      if (orderError) throw orderError;

      const options = {
        key: orderData.keyId, // Use key from backend response
        amount: plan.price * 100,
        currency: 'INR',
        name: 'Karlo Shaadi',
        description: `${plan.name} Plan Upgrade`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          await verifyPayment(response, plan.id, orderData.paymentId);
        },
        prefill: {
          email: currentUser.email,
        },
        theme: {
          color: '#E91E63',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast({
              title: "Payment cancelled",
              description: "You can try again anytime.",
            });
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const verifyPayment = async (response: any, planId: string, paymentRecordId: string) => {
    try {
      const { error } = await supabase.functions.invoke('verify-payment', {
        body: {
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          subscriptionPlan: planId,
        }
      });

      if (error) throw error;

      // Create/update subscription
      const { error: subError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: currentUser.id,
          plan: planId as any,
          amount: plans.find(p => p.id === planId)?.price,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          status: 'active',
          activated_at: new Date().toISOString(),
        } as any);

      if (subError) throw subError;

      toast({
        title: "Upgrade successful!",
        description: `Welcome to ${planId === 'premium' ? 'Premium' : 'VIP'}! Enjoy all the features.`,
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0];

  return (
    <div className="min-h-screen bg-background">
      <BhindiHeader />
      
      <main className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              Upgrade Your Experience
            </Badge>
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
              Choose Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Plan</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              One-time payment. Lifetime access. No subscriptions.
            </p>
          </div>

          {currentSubscription && currentSubscription.plan !== 'free' && (
            <Card className="mb-8 border-primary/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <p className="text-sm">
                    You're currently on the <span className="font-bold capitalize">{currentSubscription.plan}</span> plan
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${
                  selectedPlanId === plan.id
                    ? 'border-primary shadow-xl scale-105'
                    : 'border-border/50'
                } transition-all`}
              >
                {plan.id === 'premium' && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}

                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  
                  <div className="flex items-baseline gap-2 pt-4">
                    <span className="font-display font-bold text-4xl">₹{plan.price.toLocaleString()}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <Button
                    className="w-full mb-6"
                    size="lg"
                    disabled={loading || (currentSubscription?.plan === plan.id)}
                    onClick={() => handleUpgrade(plan)}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : currentSubscription?.plan === plan.id ? (
                      'Current Plan'
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>

                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="inline-block">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Shield className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold">7-Day Money-Back Guarantee</p>
                    <p className="text-sm text-muted-foreground">
                      Not satisfied? Get a full refund, no questions asked.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BhindiFooter />
    </div>
  );
}
