import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Calendar, Download } from "lucide-react";
import { format } from "date-fns";
import { downloadReceipt } from "@/lib/receiptGenerator";
import { toast } from "sonner";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";

interface BookingDetails {
  id: string;
  wedding_date: string;
  total_amount: number;
  couple_id: string;
  vendor: {
    business_name: string;
    category: string;
  };
}

export default function PaymentSuccess() {
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("bookingId");
  const paymentId = searchParams.get("paymentId");
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [customerProfile, setCustomerProfile] = useState<any>(null);

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
          vendor:vendors(business_name, category)
        `)
        .eq("id", bookingId)
        .single();

      if (data) {
        setBooking(data);
        
        // Load customer profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("id", data.couple_id)
          .single();
        
        setCustomerProfile(profile);
      }
    } catch {
      // silently ignore — UI already shows empty state
    }
  };

  const handleDownloadReceipt = async () => {
    if (!booking || !customerProfile) {
      toast.error("Unable to generate receipt. Please try again.");
      return;
    }

    try {
      // Get user email
      const { data: { user } } = await supabase.auth.getUser();
      
      const receiptData = {
        bookingId: booking.id,
        vendorName: booking.vendor.business_name,
        customerName: customerProfile.full_name,
        customerEmail: user?.email || "",
        weddingDate: format(new Date(booking.wedding_date), "PPP"),
        totalAmount: booking.total_amount,
        paidAmount: (booking as any).advance_amount ?? booking.total_amount * 0.3,
        paymentDate: format(new Date(), "PPP"),
        transactionId: paymentId || "N/A",
      };

      downloadReceipt(receiptData);
      toast.success("Receipt downloaded successfully!");
    } catch {
      toast.error("Failed to generate receipt");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MobilePageHeader title="Payment Successful" />
      
      <main className={isMobile ? "flex-1 px-4 py-4 pb-24" : "flex-1 container mx-auto px-4 py-12"}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-3">Payment Successful!</h1>
            <p className="text-xl text-muted-foreground">
              Your booking has been confirmed
            </p>
          </div>

          {booking && (
            <Card className="mb-8 animate-fade-up">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-muted-foreground">Booking ID</span>
                    <span className="font-mono text-sm">{booking.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-muted-foreground">Vendor</span>
                    <span className="font-semibold">{booking.vendor.business_name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-semibold capitalize">{booking.vendor.category}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Wedding Date
                    </div>
                    <span className="font-semibold">{format(new Date(booking.wedding_date), "PPP")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="text-2xl font-bold">₹{booking.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-muted/20 mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">What's Next?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>A confirmation email has been sent to your registered email address</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>The vendor will contact you within 24 hours to discuss details</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>You can message the vendor anytime from your dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Balance payment will be due as per agreed milestones</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Shaadi Seva Social Share */}
          <Card className="bg-muted/20 mb-8 animate-fade-up " style={{ animationDelay: '0.15s' }}>
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border  mb-3">
                <span className="text-primary text-xs font-semibold">❤️ Shaadi Seva</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                10% of your payment goes to help someone in need get married
              </p>
              {booking && (
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `I just booked my ${booking.vendor.category} vendor on Karlo Shaadi! And 10% of my payment helps fund a wedding for someone in need. Plan yours: https://karloshaadi.com`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="rounded-full border-primary/30">
                    Share on WhatsApp 💚
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Button
              size="lg"
              onClick={() => navigate("/bookings")}
            >
              View All Bookings
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/messages")}
            >
              Message Vendor
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleDownloadReceipt}
              disabled={!booking || !customerProfile}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          </div>
        </div>
      </main>

      
    </div>
  );
}
