import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface AvailabilityCalendarProps {
  vendorId: string;
}

export function AvailabilityCalendar({ vendorId }: AvailabilityCalendarProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentNote, setCurrentNote] = useState("");

  useEffect(() => {
    loadAvailability();
  }, [vendorId]);

  useEffect(() => {
    if (selectedDate) {
      loadNotesForDate(selectedDate);
    }
  }, [selectedDate]);

  const loadAvailability = async () => {
    const { data, error } = await supabase
      .from("vendor_availability")
      .select("*")
      .eq("vendor_id", vendorId)
      .eq("is_available", false);

    if (error) {
      console.error("Error loading availability:", error);
      return;
    }

    if (data) {
      const dates = data.map((item) => new Date(item.date));
      setUnavailableDates(dates);
    }
  };

  const loadNotesForDate = async (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const { data } = await supabase
      .from("vendor_availability")
      .select("notes")
      .eq("vendor_id", vendorId)
      .eq("date", dateStr)
      .maybeSingle();

    setCurrentNote(data?.notes || "");
    setNotes(data?.notes || "");
  };

  const toggleAvailability = async () => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const isCurrentlyUnavailable = unavailableDates.some(
        (d) => format(d, "yyyy-MM-dd") === dateStr
      );

      const { data: existing } = await supabase
        .from("vendor_availability")
        .select("id")
        .eq("vendor_id", vendorId)
        .eq("date", dateStr)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("vendor_availability")
          .update({
            is_available: isCurrentlyUnavailable,
            notes: notes || null,
          })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("vendor_availability")
          .insert({
            vendor_id: vendorId,
            date: dateStr,
            is_available: false,
            notes: notes || null,
          });

        if (error) throw error;
      }

      toast({
        title: isCurrentlyUnavailable ? "Date marked as available" : "Date marked as unavailable",
      });

      loadAvailability();
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error updating availability", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(
      (d) => format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
          <CardDescription>Click on a date to manage availability</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{
              unavailable: unavailableDates,
            }}
            modifiersStyles={{
              unavailable: {
                backgroundColor: "hsl(var(--destructive))",
                color: "hsl(var(--destructive-foreground))",
              },
            }}
            className="pointer-events-auto rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Availability</CardTitle>
          <CardDescription>
            {selectedDate ? format(selectedDate, "PPP") : "Select a date to manage"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedDate && (
            <>
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder="Add notes about this date..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                onClick={toggleAvailability}
                disabled={loading}
                variant={isDateUnavailable(selectedDate) ? "default" : "outline"}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isDateUnavailable(selectedDate)
                  ? "Mark as Available"
                  : "Mark as Unavailable"}
              </Button>

              {currentNote && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">Current note:</p>
                  <p className="text-sm mt-1">{currentNote}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
