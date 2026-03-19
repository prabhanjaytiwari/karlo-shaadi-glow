import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";

interface BookingDetails {
  id: string;
  vendor: {
    business_name: string;
  };
}

export default function PaymentFailure() {
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<BookingDetails | null>(null);

  useEffect(() => {
    if (bookingId) {
      loadBooking();
    }
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const { data } = await supabase
        .from("bookings")
        .select(`
          *,
          vendor:vendors(business_name)
        `)
        .eq("id", bookingId)
        .single();

      if (data) setBooking(data);
    } catch { /* ignored */ }
  };

  const handleRetry = () => {
    if (bookingId) {
      navigate(`/checkout/${bookingId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MobilePageHeader title="Payment Failed" />
      
      <main className={isMobile ? "flex-1 px-4 py-4 pb-24" : "flex-1 container mx-auto px-4 pt-20 md:pt-24 pb-12"}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className={isMobile ? "text-2xl font-bold mb-3" : "text-4xl font-bold mb-3"}>Payment Failed</h1>
            <p className="text-xl text-muted-foreground">
              We couldn't process your payment
            </p>
          </div>

          {booking && (
            <Card className="mb-8 animate-fade-up">
              <CardContent className="p-8">
                <p className="text-center text-muted-foreground mb-4">
                  Your booking with <span className="font-semibold">{booking.vendor.business_name}</span> is still pending payment.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Booking ID:</span> {booking.id.slice(0, 8)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-900 mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Common reasons for payment failure:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Insufficient balance in your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Incorrect card details or CVV</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Payment declined by your bank</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Network or connectivity issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Card not enabled for online transactions</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">What should you do?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <span>Check your account balance and card details</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <span>Ensure your card is enabled for online payments</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <span>Try again with a different payment method</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">4</span>
                  </div>
                  <span>Contact your bank if the issue persists</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button
              size="lg"
              onClick={handleRetry}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/bookings")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bookings
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/support")}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Get Help
            </Button>
          </div>
        </div>
      </main>

      
    </div>
  );
}
