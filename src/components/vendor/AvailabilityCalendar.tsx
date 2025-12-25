import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, CalendarDays, Clock, CheckCircle2, XCircle } from "lucide-react";

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
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Calendar Card - Takes 3 columns */}
      <Card className="lg:col-span-3 bg-white/90 backdrop-blur-sm border-2 border-accent/20 shadow-lg">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <CalendarDays className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">Availability Calendar</CardTitle>
                <CardDescription>Click on dates to mark them unavailable</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {unavailableDates.length} blocked
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{
                unavailable: unavailableDates,
              }}
              modifiersClassNames={{
                unavailable: "bg-rose-500 text-white hover:bg-rose-600 font-medium",
              }}
              className="rounded-xl border-2 border-border/50 p-4 bg-background shadow-sm"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-base font-semibold",
                nav: "space-x-1 flex items-center",
                nav_button: "h-8 w-8 bg-transparent p-0 hover:bg-muted rounded-lg transition-colors",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-10 font-medium text-xs uppercase",
                row: "flex w-full mt-2",
                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                day: "h-10 w-10 p-0 font-normal rounded-lg hover:bg-accent/20 transition-colors",
                day_selected: "bg-accent text-accent-foreground hover:bg-accent/90 font-semibold",
                day_today: "border-2 border-accent font-semibold",
                day_outside: "text-muted-foreground/40",
                day_disabled: "text-muted-foreground/30",
              }}
            />
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-4 w-4 rounded bg-accent" />
              <span className="text-muted-foreground">Selected</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-4 w-4 rounded bg-rose-500" />
              <span className="text-muted-foreground">Unavailable</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-4 w-4 rounded border-2 border-accent" />
              <span className="text-muted-foreground">Today</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Management Panel - Takes 2 columns */}
      <Card className="lg:col-span-2 bg-white/90 backdrop-blur-sm border-2 border-accent/20 shadow-lg">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {selectedDate ? format(selectedDate, "EEEE, MMM d") : "Select a Date"}
              </CardTitle>
              <CardDescription>
                {selectedDate 
                  ? isDateUnavailable(selectedDate) 
                    ? "Currently marked as unavailable" 
                    : "Currently available for bookings"
                  : "Click a date on the calendar"
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          {selectedDate ? (
            <>
              {/* Current Status */}
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                isDateUnavailable(selectedDate) 
                  ? "bg-rose-50 border border-rose-200" 
                  : "bg-emerald-50 border border-emerald-200"
              }`}>
                {isDateUnavailable(selectedDate) ? (
                  <XCircle className="h-5 w-5 text-rose-500" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                )}
                <div>
                  <p className={`font-medium text-sm ${
                    isDateUnavailable(selectedDate) ? "text-rose-700" : "text-emerald-700"
                  }`}>
                    {isDateUnavailable(selectedDate) ? "Unavailable" : "Available"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isDateUnavailable(selectedDate) 
                      ? "No new bookings can be made" 
                      : "Open for new bookings"
                    }
                  </p>
                </div>
              </div>

              {/* Notes Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Notes (Optional)</Label>
                <Textarea
                  placeholder="E.g., Already booked for wedding, Personal leave..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="resize-none border-border/50 focus:border-accent"
                />
              </div>

              {/* Action Button */}
              <Button
                onClick={toggleAvailability}
                disabled={loading}
                variant={isDateUnavailable(selectedDate) ? "default" : "destructive"}
                className="w-full h-11"
                size="lg"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isDateUnavailable(selectedDate)
                  ? "Mark as Available"
                  : "Mark as Unavailable"}
              </Button>

              {/* Current Note Display */}
              {currentNote && (
                <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Saved Note:</p>
                  <p className="text-sm">{currentNote}</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <CalendarDays className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                Select a date from the calendar to manage its availability
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
