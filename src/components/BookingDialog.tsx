import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Loader2, AlertCircle, CheckCircle, WifiOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { bookingFormSchema, sanitizeInput } from "@/lib/validation";
import { SuccessAnimation } from "@/components/SuccessAnimation";

interface BookingDialogProps {
  vendorId: string;
  serviceId?: string;
  initialDate?: Date;
  children?: React.ReactNode;
}

export function BookingDialog({ vendorId, serviceId, initialDate, children }: BookingDialogProps) {
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const { isOnline, queueBooking } = useOfflineSync();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState(serviceId || "");
  const [servicePrice, setServicePrice] = useState(0);
  const [weddingDate, setWeddingDate] = useState("");
  const [amount, setAmount] = useState("");
  const [requirements, setRequirements] = useState("");
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [isDateAvailable, setIsDateAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      loadServices();
      loadUnavailableDates();
      // Set initial date if provided
      if (initialDate) {
        const formattedDate = initialDate.toISOString().split('T')[0];
        setWeddingDate(formattedDate);
      }
    }
  }, [open, initialDate]);

  useEffect(() => {
    if (selectedService) {
      const service = services.find(s => s.id === selectedService);
      if (service) {
        setServicePrice(service.base_price);
        setAmount(service.base_price.toString());
      }
    }
  }, [selectedService, services]);

  useEffect(() => {
    if (weddingDate) {
      checkDateAvailability();
    }
  }, [weddingDate]);

  const loadServices = async () => {
    try {
      // Check if vendor is verified
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("verified, business_name")
        .eq("id", vendorId)
        .single();

      if (vendorError) throw vendorError;

      if (!vendorData?.verified) {
        toast({
          title: "Vendor Not Verified",
          description: `${vendorData?.business_name || "This vendor"} is pending verification. Only verified vendors can accept bookings.`,
          variant: "destructive",
        });
        setOpen(false);
        return;
      }

      const { data } = await supabase
        .from("vendor_services")
        .select("*")
        .eq("vendor_id", vendorId)
        .eq("is_active", true);
    
      if (data) {
        setServices(data);
        if (data.length === 1 && !selectedService) {
          setSelectedService(data[0].id);
        }
      }
    } catch (error: any) {
      console.error("Error loading services:", error);
    }
  };

  const loadUnavailableDates = async () => {
    const { data } = await supabase
      .from("vendor_availability")
      .select("date")
      .eq("vendor_id", vendorId)
      .eq("is_available", false);
    
    if (data) {
      setUnavailableDates(data.map(d => d.date));
    }
  };

  const checkDateAvailability = async () => {
    setCheckingAvailability(true);
    try {
      const isUnavailable = unavailableDates.includes(weddingDate);
      
      // Also check existing bookings
      const { data: bookings } = await supabase
        .from("bookings")
        .select("id")
        .eq("vendor_id", vendorId)
        .eq("wedding_date", weddingDate)
        .in("status", ["pending", "confirmed"]);
      
      const hasBookings = (bookings?.length || 0) > 0;
      setIsDateAvailable(!isUnavailable && !hasBookings);
    } catch (error) {
      console.error("Error checking availability:", error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const advancePercentage = 30;
  const advanceAmount = parseFloat(amount) * (advancePercentage / 100);
  const remainingAmount = parseFloat(amount) - advanceAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isDateAvailable === false) {
      toast({
        title: "Date unavailable",
        description: "This date is not available. Please choose another date.",
        variant: "destructive",
      });
      return;
    }

    // Zod validation
    const amountNum = parseFloat(amount);
    const trimmedRequirements = requirements.trim();

    const parseResult = bookingFormSchema.safeParse({
      weddingDate: weddingDate ? new Date(weddingDate) : undefined,
      guestCount: undefined,
      specialRequirements: trimmedRequirements || undefined,
    });

    if (!parseResult.success) {
      toast({
        title: "Validation error",
        description: parseResult.error.errors[0]?.message || "Invalid input",
        variant: "destructive",
      });
      return;
    }

    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Validation error",
        description: "Please enter a valid budget amount",
        variant: "destructive",
      });
      return;
    }

    if (amountNum > 10000000) {
      toast({
        title: "Validation error",
        description: "Budget amount seems too high",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to make a booking",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        coupleId: user.id,
        vendorId: vendorId,
        serviceId: selectedService || null,
        weddingDate: weddingDate,
        totalAmount: amountNum,
        specialRequirements: trimmedRequirements ? sanitizeInput(trimmedRequirements) : null,
        advancePercentage: advancePercentage,
      };

      // Use offline-aware queue
      const result = await queueBooking(bookingData);

      if (result.success) {
        // Track booking creation event (only if online)
        if (!result.offline) {
          await trackEvent({
            event_type: 'booking_created',
            vendor_id: vendorId,
            metadata: {
              service_id: selectedService,
              amount: amountNum,
              wedding_date: weddingDate,
            },
          });
        }

        setShowSuccess(true);
        setOpen(false);
        setWeddingDate("");
        setAmount("");
        setRequirements("");
        setSelectedService("");

        if (result.offline) {
          toast({
            title: "Booking queued",
            description: "Your booking request will be sent when you're back online",
          });
        } else {
          // Get the newly created booking ID for navigation
          const { data: newBooking } = await supabase
            .from("bookings")
            .select("id")
            .eq("couple_id", user.id)
            .eq("vendor_id", vendorId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          // Navigate to confirmation page after animation
          setTimeout(() => {
            if (newBooking) {
              window.location.href = `/booking-confirmation?bookingId=${newBooking.id}`;
            }
          }, 2000);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showSuccess && (
        <SuccessAnimation 
          message="Booking Request Sent! 🎉" 
          onComplete={() => setShowSuccess(false)}
        />
      )}
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="hero" size="lg">
            <Calendar className="h-4 w-4 mr-2" />
            Check Availability
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Request Booking
            {!isOnline && <WifiOff className="h-4 w-4 text-muted-foreground" />}
          </DialogTitle>
          <DialogDescription>
            {isOnline 
              ? "Send a booking request to the vendor. They'll get back to you with availability and quote."
              : "You're offline. Your booking will be saved and sent when you're back online."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {services.length > 1 && (
            <div>
              <Label htmlFor="service">Select Service *</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.service_name} - ₹{Number(service.base_price).toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="wedding-date">Wedding Date *</Label>
            <Input
              id="wedding-date"
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              required
              min={new Date().toISOString().split("T")[0]}
            />
            {checkingAvailability && (
              <p className="text-sm text-muted-foreground mt-1">Checking availability...</p>
            )}
            {weddingDate && isDateAvailable === true && (
              <Alert className="mt-2">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  This date is available!
                </AlertDescription>
              </Alert>
            )}
            {weddingDate && isDateAvailable === false && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This date is not available. Please choose another date.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div>
            <Label htmlFor="amount">Expected Budget (₹) *</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={servicePrice ? servicePrice.toString() : "50000"}
              required
              min="0"
              step="1000"
            />
            {servicePrice > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Base price: ₹{servicePrice.toLocaleString()}
              </p>
            )}
          </div>

          {amount && parseFloat(amount) > 0 && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-semibold">Payment Breakdown</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Advance Payment ({advancePercentage}%):</span>
                  <span className="font-semibold">₹{advanceAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining Amount:</span>
                  <span>₹{remainingAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold">₹{parseFloat(amount).toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                * Pay {advancePercentage}% advance to confirm booking. Remaining amount due before event.
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="requirements">Special Requirements</Label>
            <Textarea
              id="requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Tell us about any specific needs or preferences..."
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || isDateAvailable === false} 
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Request"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}