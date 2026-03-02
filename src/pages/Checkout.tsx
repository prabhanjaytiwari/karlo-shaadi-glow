import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, Calendar, DollarSign, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { trackPaymentInitiated, trackPaymentCompleted, trackPaymentFailed } from "@/lib/analytics";
import { TrustBadges } from "@/components/TrustBadges";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface BookingDetails {
  id: string;
  wedding_date: string;
  status: string;
  total_amount: number;
  advance_percentage: number;
  special_requirements: string;
  vendor: {
    id: string;
    business_name: string;
    category: string;
  };
  couple: {
    full_name: string;
    phone: string | null;
  };
}

export default function Checkout() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (bookingId) {
      loadBookingDetails();
    }
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          vendor:vendors(id, business_name, category)
        `)
        .eq("id", bookingId)
        .eq("couple_id", user.id)
        .single();
      
      if (error) throw error;
      
      // Get user profile separately
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .single();

      if (!data) {
        toast({
          title: "Booking not found",
          description: "The booking you're looking for doesn't exist",
          variant: "destructive",
        });
        navigate("/bookings");
        return;
      }

      setBooking({
        ...data,
        couple: profile || { full_name: "User", phone: null }
      });
    } catch (error: any) {
      toast({
        title: "Error loading booking",
        description: error.message,
        variant: "destructive",
      });
      navigate("/bookings");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!booking) return;

    setProcessing(true);
    try {
      const advanceAmount = (booking.total_amount * booking.advance_percentage) / 100;
      trackPaymentInitiated(advanceAmount, "booking");

      // Create payment order via edge function
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        "create-payment",
        {
          body: {
            bookingId: booking.id,
            amount: advanceAmount,
            milestone: "advance",
          },
        }
      );

      if (orderError) throw orderError;

      // Initialize Razorpay
      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.order.amount,
        currency: "INR",
        name: "Karlo Shaadi",
        description: `Advance payment for ${booking.vendor.business_name}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          // Verify payment
          try {
            const { error: verifyError } = await supabase.functions.invoke(
              "verify-payment",
              {
                body: {
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  bookingId: booking.id,
                },
              }
            );

            if (verifyError) throw verifyError;

            trackPaymentCompleted(advanceAmount, response.razorpay_payment_id, "booking");
            toast({
              title: "Payment Successful!",
              description: "Your booking has been confirmed",
            });
            navigate(`/payment-success?bookingId=${booking.id}`);
          } catch (error: any) {
            trackPaymentFailed(advanceAmount, error.message);
            toast({
              title: "Payment verification failed",
              description: error.message,
              variant: "destructive",
            });
            navigate(`/payment-failure?bookingId=${booking.id}`);
          }
        },
        prefill: {
          name: booking.couple.full_name,
          contact: booking.couple.phone || undefined,
        },
        theme: {
          color: "#e91e63",
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process",
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast({
          title: "Payment Failed",
          description: response.error.description,
          variant: "destructive",
        });
        navigate(`/payment-failure?bookingId=${booking.id}`);
      });

      rzp.open();
    } catch (error: any) {
      toast({
        title: "Error initiating payment",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (!booking) return null;

  const advanceAmount = (booking.total_amount * booking.advance_percentage) / 100;
  const balanceAmount = booking.total_amount - advanceAmount;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Payment Checkout</h1>
            <p className="text-muted-foreground">Complete your booking payment</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Booking Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">Vendor</span>
                    <span className="font-semibold">{booking.vendor.business_name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-semibold capitalize">{booking.vendor.category}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Wedding Date
                    </div>
                    <span className="font-semibold">{format(new Date(booking.wedding_date), "PPP")}</span>
                  </div>
                  {booking.special_requirements && (
                    <div className="pt-3">
                      <p className="text-sm font-medium mb-2">Special Requirements:</p>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        {booking.special_requirements}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Security Badge */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-900">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Shield className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Secure Payment</h3>
                      <p className="text-sm text-muted-foreground">
                        Your payment is secured with industry-standard encryption. We never store your card details.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <Card>
                <CardContent className="p-4">
                  <TrustBadges />
                </CardContent>
              </Card>
            </div>

            {/* Payment Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Amount</span>
                      <span>₹{booking.total_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Advance ({booking.advance_percentage}%)</span>
                      <span className="font-semibold text-accent">₹{advanceAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Balance Due Later</span>
                      <span>₹{balanceAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold">Pay Now</span>
                      <span className="text-2xl font-bold text-accent">
                        ₹{advanceAmount.toLocaleString()}
                      </span>
                    </div>

                    <Button
                      onClick={handlePayment}
                      disabled={processing}
                      className="w-full"
                      size="lg"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4 mr-2" />
                          Proceed to Payment
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>Instant booking confirmation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>Milestone-based payment protection</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>24/7 customer support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
}
