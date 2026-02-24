import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, DollarSign, MessageSquare, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingCancellationDialog } from "@/components/BookingCancellationDialog";
import { FinalPaymentDialog } from "@/components/FinalPaymentDialog";
import { EmptyState } from "@/components/EmptyState";

interface Booking {
  id: string;
  wedding_date: string;
  status: string;
  total_amount: number;
  advance_percentage: number;
  special_requirements: string;
  created_at: string;
  vendor: {
    business_name: string;
    category: string;
    id: string;
  };
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [finalPaymentDialogOpen, setFinalPaymentDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          vendor:vendors(business_name, category, id)
        `)
        .eq("couple_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading bookings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500";
      case "completed": return "bg-blue-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-yellow-500";
    }
  };

  const filteredBookings = filter === "all" 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60">
      <BhindiHeader />
      
      <main className="flex-1 container mx-auto px-4 py-4 sm:py-8 pt-16 sm:pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-1 sm:mb-2">My Bookings</h1>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 rounded-full" />
          </div>

          <div className="flex gap-2 mb-4 sm:mb-6 flex-wrap overflow-x-auto scrollbar-hide">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-accent hover:bg-accent/90" : "border-accent/30 hover:border-accent/50"}
            >
              All
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              onClick={() => setFilter("pending")}
              className={filter === "pending" ? "bg-accent hover:bg-accent/90" : "border-accent/30 hover:border-accent/50"}
            >
              Pending
            </Button>
            <Button
              variant={filter === "confirmed" ? "default" : "outline"}
              onClick={() => setFilter("confirmed")}
              className={filter === "confirmed" ? "bg-accent hover:bg-accent/90" : "border-accent/30 hover:border-accent/50"}
            >
              Confirmed
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              onClick={() => setFilter("completed")}
              className={filter === "completed" ? "bg-accent hover:bg-accent/90" : "border-accent/30 hover:border-accent/50"}
            >
              Completed
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No Bookings Yet"
              description="You haven't made any bookings yet. Start exploring our verified vendors and book your dream wedding services."
              actionText="Browse Vendors"
              actionLink="/search"
            />
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="bg-white/90 border border-accent/20 hover:border-accent/40 hover:shadow-lg transition-all">
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
                      <div>
                        <CardTitle className="text-lg sm:text-2xl mb-1 sm:mb-2">
                          {booking.vendor.business_name}
                        </CardTitle>
                        <Badge className={`${getStatusColor(booking.status)} text-[10px] sm:text-xs`}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => navigate(`/booking/${booking.id}`)}
                        >
                          Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => navigate(`/vendors/${booking.vendor.id}`)}
                        >
                          Vendor
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Wedding Date: {format(new Date(booking.wedding_date), "PPP")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>Amount: ₹{booking.total_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="capitalize">{booking.vendor.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span>Booked {format(new Date(booking.created_at), "PPP")}</span>
                      </div>
                    </div>
                    {booking.special_requirements && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Special Requirements:</p>
                        <p className="text-sm text-muted-foreground">{booking.special_requirements}</p>
                      </div>
                    )}
                    
                    {(booking.status === "pending" || booking.status === "confirmed" || booking.status === "completed") && (
                      <div className="mt-4 pt-4 border-t flex gap-3 flex-wrap">
                        {booking.status === "pending" && (
                          <Button
                            onClick={() => navigate(`/checkout/${booking.id}`)}
                            className="flex-1"
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Pay Advance
                          </Button>
                        )}
                        {booking.status === "completed" && (
                          <Button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setFinalPaymentDialogOpen(true);
                            }}
                            className="flex-1"
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Pay Remaining Amount
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/messages?vendor=${booking.vendor.id}`)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message Vendor
                        </Button>
                        {booking.status !== "completed" && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setCancelDialogOpen(true);
                            }}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <BhindiFooter />
      
      {selectedBooking && (
        <>
          <BookingCancellationDialog
            bookingId={selectedBooking.id}
            vendorName={selectedBooking.vendor.business_name}
            weddingDate={selectedBooking.wedding_date}
            totalAmount={selectedBooking.total_amount}
            paidAmount={(selectedBooking.total_amount * selectedBooking.advance_percentage) / 100}
            open={cancelDialogOpen}
            onOpenChange={setCancelDialogOpen}
            onSuccess={loadBookings}
          />
          <FinalPaymentDialog
            bookingId={selectedBooking.id}
            vendorName={selectedBooking.vendor.business_name}
            totalAmount={selectedBooking.total_amount}
            paidAmount={(selectedBooking.total_amount * selectedBooking.advance_percentage) / 100}
            weddingDate={selectedBooking.wedding_date}
            open={finalPaymentDialogOpen}
            onOpenChange={setFinalPaymentDialogOpen}
            onSuccess={loadBookings}
          />
        </>
      )}
    </div>
  );
}
