import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareButton } from "@/components/ShareButton";
import { CheckCircle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";

interface BookingDetails {
  id: string;
  wedding_date: string;
  total_amount: number;
  advance_percentage: number;
  special_requirements?: string;
  vendor: {
    business_name: string;
    category: string;
    city_id: string;
  };
  profiles: {
    full_name: string;
    phone?: string;
  };
}

const BookingConfirmation = () => {
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      loadBooking();
    }
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          wedding_date,
          total_amount,
          advance_percentage,
          special_requirements,
          couple_id,
          vendor:vendors (
            business_name,
            category,
            city_id
          )
        `)
        .eq("id", bookingId)
        .single();

      if (error) throw error;

      // Get couple profile separately
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", data.couple_id)
        .single();

      setBooking({
        ...data,
        profiles: profileData || { full_name: "User", phone: undefined },
      });

    } catch (error) {
      console.error("Error loading booking:", error);
      toast.error("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCalendar = () => {
    if (!booking) return;
    
    // Create iCal format event
    const event = {
      start: new Date(booking.wedding_date),
      duration: { hours: 24 },
      title: `Wedding - ${booking.vendor.business_name}`,
      description: `Vendor: ${booking.vendor.business_name}\nCategory: ${booking.vendor.category}`,
      location: "Wedding Venue",
      status: "CONFIRMED",
    };

    // For now, just show a toast. Full implementation would use the 'ics' library
    toast.success("Calendar feature coming soon!");
  };

  if (loading) {
    return (
      <>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-center">
            <div className="h-8 w-64 bg-muted rounded mx-auto mb-4" />
            <div className="h-4 w-48 bg-muted rounded mx-auto" />
          </div>
        </div>
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </>
    );
  }

  const advanceAmount = (booking.total_amount * booking.advance_percentage) / 100;
  const balanceAmount = booking.total_amount - advanceAmount;

  return (
    <>
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your booking request has been sent to {booking.vendor.business_name}
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
                <p className="font-mono text-sm">{booking.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Vendor</p>
                <p className="font-medium">{booking.vendor.business_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Category</p>
                <p className="capitalize">{booking.vendor.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Wedding Date</p>
                <p>{format(new Date(booking.wedding_date), "PPP")}</p>
              </div>
            </div>

            {booking.special_requirements && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Special Requirements</p>
                <p className="text-sm">{booking.special_requirements}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-bold">₹{booking.total_amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Advance Payment ({booking.advance_percentage}%)</span>
              <span className="font-semibold">₹{advanceAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Balance Amount</span>
              <span className="font-semibold">₹{balanceAmount.toLocaleString('en-IN')}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 list-decimal list-inside">
              <li className="text-sm">The vendor will review your booking request and respond within 24 hours</li>
              <li className="text-sm">Once the vendor confirms, you'll receive a payment link to pay the advance</li>
              <li className="text-sm">After payment, your booking will be confirmed</li>
              <li className="text-sm">You can communicate with the vendor through our messaging system</li>
            </ol>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            onClick={() => navigate("/bookings")}
            className="w-full"
          >
            View My Bookings
          </Button>
          <Button 
            onClick={() => navigate(`/vendor/${booking.vendor.business_name}`)}
            variant="outline"
            className="w-full"
          >
            Message Vendor
          </Button>
          <Button 
            onClick={handleAddToCalendar}
            variant="outline"
            className="w-full"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Add to Calendar
          </Button>
          <ShareButton
            path={`/booking/${booking.id}`}
            title={`Booking with ${booking.vendor.business_name}`}
            description={`I just booked ${booking.vendor.business_name} for my wedding on Karlo Shaadi!`}
            className="w-full"
          />
        </div>
      </main>
      
    </>
  );
};

export default BookingConfirmation;
