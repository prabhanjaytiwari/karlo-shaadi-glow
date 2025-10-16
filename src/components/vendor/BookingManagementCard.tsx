import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, User, DollarSign, CheckCircle, XCircle, Clock } from "lucide-react";

interface BookingManagementCardProps {
  booking: any;
  onUpdate: () => void;
}

export function BookingManagementCard({ booking, onUpdate }: BookingManagementCardProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const updateBookingStatus = async (status: string) => {
    setLoading(true);
    try {
      const updateData: any = { status };

      if (status === "confirmed") {
        updateData.confirmed_at = new Date().toISOString();
      } else if (status === "completed") {
        updateData.completed_at = new Date().toISOString();
      } else if (status === "cancelled") {
        updateData.cancelled_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", booking.id);

      if (error) throw error;

      toast({ title: `Booking ${status}` });
      onUpdate();
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error updating booking", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: "outline", icon: Clock },
      confirmed: { variant: "default", icon: CheckCircle },
      completed: { variant: "secondary", icon: CheckCircle },
      cancelled: { variant: "destructive", icon: XCircle },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">Booking #{booking.id.slice(0, 8)}</span>
        </div>
        {getStatusBadge(booking.status)}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(booking.wedding_date), "PPP")}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">₹{Number(booking.total_amount).toLocaleString()}</span>
          <span className="text-muted-foreground">
            ({booking.advance_percentage}% advance)
          </span>
        </div>

        {booking.special_requirements && (
          <div className="text-sm p-2 bg-muted rounded">
            <p className="text-muted-foreground text-xs mb-1">Special Requirements:</p>
            <p>{booking.special_requirements}</p>
          </div>
        )}

        {booking.status === "pending" && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => updateBookingStatus("confirmed")}
              disabled={loading}
              size="sm"
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Accept
            </Button>
            <Button
              onClick={() => updateBookingStatus("cancelled")}
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex-1 text-destructive hover:bg-destructive/10"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        )}

        {booking.status === "confirmed" && (
          <Button
            onClick={() => updateBookingStatus("completed")}
            disabled={loading}
            size="sm"
            className="w-full"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Mark as Completed
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
