import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DollarSign, Loader2, Calendar, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface FinalPaymentDialogProps {
  bookingId: string;
  vendorName: string;
  totalAmount: number;
  paidAmount: number;
  weddingDate: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const FinalPaymentDialog = ({
  bookingId,
  vendorName,
  totalAmount,
  paidAmount,
  weddingDate,
  open,
  onOpenChange,
  onSuccess,
}: FinalPaymentDialogProps) => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const remainingAmount = totalAmount - paidAmount;
  const isPastWedding = new Date(weddingDate) < new Date();

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Create payment order
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        "create-payment",
        {
          body: {
            bookingId,
            amount: remainingAmount,
            milestone: "final",
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
        description: `Final payment for ${vendorName}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          try {
            const { error: verifyError } = await supabase.functions.invoke(
              "verify-payment",
              {
                body: {
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  bookingId,
                },
              }
            );

            if (verifyError) throw verifyError;

            toast({
              title: "Payment Successful!",
              description: "Final payment completed. Thank you for using Karlo Shaadi!",
            });
            onSuccess();
            onOpenChange(false);
          } catch (error: any) {
            toast({
              title: "Payment verification failed",
              description: error.message,
              variant: "destructive",
            });
          }
        },
        theme: {
          color: "#e91e63",
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast({
        title: "Error initiating payment",
        description: error.message,
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Final Payment</DialogTitle>
          <DialogDescription>
            Complete the remaining payment for your booking with {vendorName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Wedding Date: {format(new Date(weddingDate), "PPP")}</span>
          </div>

          {isPastWedding && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-400">
                Wedding completed! Time to settle the final payment.
              </span>
            </div>
          )}

          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Booking Amount</span>
              <span className="font-semibold">₹{totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Already Paid</span>
              <span className="text-green-600">₹{paidAmount.toLocaleString()}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between">
              <span className="font-semibold">Remaining Amount</span>
              <span className="text-2xl font-bold text-accent">
                ₹{remainingAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={processing}
            className="w-full sm:w-auto"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <DollarSign className="h-4 w-4 mr-2" />
                Pay ₹{remainingAmount.toLocaleString()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
