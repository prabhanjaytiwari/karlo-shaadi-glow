import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Loader2 } from "lucide-react";

interface BookingDialogProps {
  vendorId: string;
  serviceId?: string;
  children?: React.ReactNode;
}

export function BookingDialog({ vendorId, serviceId, children }: BookingDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weddingDate, setWeddingDate] = useState("");
  const [amount, setAmount] = useState("");
  const [requirements, setRequirements] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const { error } = await supabase.from("bookings").insert([{
        couple_id: user.id,
        vendor_id: vendorId,
        service_id: serviceId || null,
        wedding_date: weddingDate,
        total_amount: parseFloat(amount),
        special_requirements: requirements || null,
        status: "pending",
      }]);

      if (error) throw error;

      toast({
        title: "Booking request sent!",
        description: "The vendor will respond to your request soon.",
      });

      setOpen(false);
      setWeddingDate("");
      setAmount("");
      setRequirements("");
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
          <DialogTitle>Request Booking</DialogTitle>
          <DialogDescription>
            Send a booking request to the vendor. They'll get back to you with availability and quote.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          </div>
          
          <div>
            <Label htmlFor="amount">Expected Budget (₹) *</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50000"
              required
              min="0"
              step="1000"
            />
          </div>

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
            <Button type="submit" disabled={loading} className="flex-1">
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
  );
}