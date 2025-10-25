import { supabase } from "@/integrations/supabase/client";

export interface PaymentOptions {
  amount: number;
  description: string;
  subscriptionPlan?: string;
  bookingId?: string;
  milestone?: string;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/**
 * Initialize Razorpay payment
 */
export const initiatePayment = async (options: PaymentOptions) => {
  try {
    const { data: orderData, error: orderError } = await supabase.functions.invoke(
      "create-payment",
      {
        body: {
          amount: options.amount,
          subscriptionPlan: options.subscriptionPlan,
          bookingId: options.bookingId,
          milestone: options.milestone
        }
      }
    );

    if (orderError) throw orderError;
    return orderData;
  } catch (error: any) {
    console.error("Payment initiation error:", error);
    throw new Error(error.message || "Failed to initiate payment");
  }
};

/**
 * Verify Razorpay payment
 */
export const verifyPayment = async (
  response: RazorpayResponse,
  subscriptionPlan?: string,
  bookingId?: string
) => {
  try {
    const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
      "verify-payment",
      {
        body: {
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          subscriptionPlan,
          bookingId
        }
      }
    );

    if (verifyError) throw verifyError;
    return verifyData;
  } catch (error: any) {
    console.error("Payment verification error:", error);
    throw new Error(error.message || "Payment verification failed");
  }
};

/**
 * Create Razorpay checkout instance
 */
export const createRazorpayCheckout = (
  orderData: any,
  options: {
    description: string;
    email?: string;
    onSuccess: (response: RazorpayResponse) => void;
    onFailure?: (error: any) => void;
    onDismiss?: () => void;
  }
) => {
  if (!window.Razorpay) {
    throw new Error("Razorpay SDK not loaded");
  }

  const razorpayOptions = {
    key: orderData.keyId,
    amount: orderData.amount,
    currency: orderData.currency,
    name: "Karlo Shaadi",
    description: options.description,
    order_id: orderData.orderId,
    handler: options.onSuccess,
    modal: {
      ondismiss: options.onDismiss || (() => {})
    },
    prefill: {
      email: options.email
    },
    theme: {
      color: "#D946EF"
    }
  };

  const razorpay = new window.Razorpay(razorpayOptions);
  razorpay.on('payment.failed', options.onFailure || (() => {}));
  return razorpay;
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Calculate platform fee
 */
export const calculatePlatformFee = (amount: number, tierFeePercentage: number = 0): number => {
  return (amount * tierFeePercentage) / 100;
};

/**
 * Get payment status badge variant
 */
export const getPaymentStatusVariant = (status: string): "default" | "secondary" | "success" | "destructive" => {
  switch (status) {
    case 'completed':
    case 'paid':
      return 'success';
    case 'pending':
      return 'secondary';
    case 'failed':
    case 'cancelled':
      return 'destructive';
    default:
      return 'default';
  }
};

/**
 * Get subscription status badge variant
 */
export const getSubscriptionStatusVariant = (status: string): "default" | "secondary" | "success" | "destructive" => {
  switch (status) {
    case 'active':
      return 'success';
    case 'pending':
      return 'secondary';
    case 'cancelled':
    case 'expired':
      return 'destructive';
    default:
      return 'default';
  }
};
