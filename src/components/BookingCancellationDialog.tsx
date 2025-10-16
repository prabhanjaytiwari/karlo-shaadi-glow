import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookingCancellationDialogProps {
  bookingId: string;
  vendorName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function BookingCancellationDialog({
  bookingId,
  vendorName,
  open,
  onOpenChange,
  onSuccess,
}: BookingCancellationDialogProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCancel = async () => {
    if (!reason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for cancellation",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "cancelled",
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString(),
        })
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully",
      });

      onOpenChange(false);
      setReason("");
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error cancelling booking",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel your booking with {vendorName}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-2 py-4">
          <Label htmlFor="reason">Cancellation Reason *</Label>
          <Textarea
            id="reason"
            placeholder="Please provide a reason for cancellation..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Keep Booking</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={loading || !reason.trim()}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? "Cancelling..." : "Cancel Booking"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
