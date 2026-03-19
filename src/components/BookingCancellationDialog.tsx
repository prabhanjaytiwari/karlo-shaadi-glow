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
  weddingDate: string;
  totalAmount: number;
  paidAmount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function BookingCancellationDialog({
  bookingId,
  vendorName,
  weddingDate,
  totalAmount,
  paidAmount,
  open,
  onOpenChange,
  onSuccess,
}: BookingCancellationDialogProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Calculate refund based on days until wedding
  const calculateRefund = () => {
    const now = new Date();
    const wedding = new Date(weddingDate);
    if (isNaN(wedding.getTime())) return { percentage: 0, amount: 0 };
    const daysUntilWedding = Math.floor((wedding.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilWedding >= 30) {
      return { percentage: 100, amount: paidAmount };
    } else if (daysUntilWedding >= 15) {
      return { percentage: 50, amount: paidAmount * 0.5 };
    } else if (daysUntilWedding >= 7) {
      return { percentage: 25, amount: paidAmount * 0.25 };
    } else {
      return { percentage: 0, amount: 0 };
    }
  };

  const refund = calculateRefund();

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
            This will cancel your booking with {vendorName}.
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Paid Amount:</span>
                <span className="font-semibold">₹{paidAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Refund ({refund.percentage}%):</span>
                <span className={`font-bold ${refund.percentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{refund.amount.toLocaleString()}
                </span>
              </div>
              {refund.percentage === 0 && (
                <p className="text-xs text-red-600 mt-2">
                  Cancellations within 7 days of the wedding are non-refundable as per our policy.
                </p>
              )}
            </div>
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
