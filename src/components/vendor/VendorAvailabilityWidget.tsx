import { useState, useEffect } from "react";
import { format, addMonths, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { CalendarCheck, CalendarX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VendorAvailabilityWidgetProps {
  vendorId: string;
  onDateSelect?: (date: Date) => void;
}

interface AvailabilityData {
  date: string;
  is_available: boolean;
  notes?: string;
}

export const VendorAvailabilityWidget = ({ vendorId, onDateSelect }: VendorAvailabilityWidgetProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAvailability();
  }, [vendorId]);

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const threeMonthsLater = addMonths(today, 3);

      const { data } = await supabase
        .from("vendor_availability")
        .select("date, is_available, notes")
        .eq("vendor_id", vendorId)
        .gte("date", format(today, "yyyy-MM-dd"))
        .lte("date", format(threeMonthsLater, "yyyy-MM-dd"));

      if (data) {
        setAvailability(data);
      }
    } catch (error) {
      console.error("Error loading availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDateStatus = (date: Date): "available" | "booked" | "unknown" => {
    const dateStr = format(date, "yyyy-MM-dd");
    const entry = availability.find((a) => a.date === dateStr);
    if (!entry) return "unknown";
    return entry.is_available ? "available" : "booked";
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };

  const modifiers = {
    booked: availability
      .filter((a) => !a.is_available)
      .map((a) => new Date(a.date)),
    available: availability
      .filter((a) => a.is_available)
      .map((a) => new Date(a.date)),
  };

  const modifiersStyles = {
    booked: {
      backgroundColor: "hsl(var(--destructive) / 0.15)",
      color: "hsl(var(--destructive))",
      borderRadius: "50%",
    },
    available: {
      backgroundColor: "hsl(var(--accent) / 0.15)",
      color: "hsl(var(--accent-foreground))",
      borderRadius: "50%",
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  const selectedStatus = selectedDate ? getDateStatus(selectedDate) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Check Availability</h3>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-accent/20 border border-accent/30" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-destructive/20 border border-destructive/30" />
            <span className="text-muted-foreground">Booked</span>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 rounded-xl p-4 flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          disabled={(date) => date < new Date()}
          className={cn("p-3 pointer-events-auto")}
          fromMonth={new Date()}
          toMonth={addMonths(new Date(), 6)}
        />
      </div>

      {selectedDate && (
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
              <div className="flex items-center gap-2 mt-1">
                {selectedStatus === "available" && (
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                    <CalendarCheck className="h-3 w-3 mr-1" />
                    Available
                  </Badge>
                )}
                {selectedStatus === "booked" && (
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                    <CalendarX className="h-3 w-3 mr-1" />
                    Booked
                  </Badge>
                )}
                {selectedStatus === "unknown" && (
                  <Badge variant="secondary">
                    Status Unknown - Contact Vendor
                  </Badge>
                )}
              </div>
            </div>
            {selectedStatus !== "booked" && (
              <Button size="sm" onClick={() => onDateSelect?.(selectedDate)}>
                Book This Date
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
