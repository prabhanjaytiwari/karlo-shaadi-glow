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
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";

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

  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60">
      <BhindiHeader />
      <MobilePageHeader title="My Bookings" />
      
      <main className={isMobile ? "flex-1 px-4 py-4" : "flex-1 container mx-auto px-4 py-8"}>
        <div className={isMobile ? "" : "max-w-6xl mx-auto"}>
          {!isMobile && (
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">My Bookings</h1>
              <div className="w-20 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 rounded-full" />
            </div>
          )}

          <div className={`flex gap-2 mb-4 ${isMobile ? 'overflow-x-auto scrollbar-hide pb-1' : 'flex-wrap mb-6'}`}>
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
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <Card 
                  key={booking.id} 
                  className={`bg-white/90 border-2 border-accent/20 hover:border-accent/40 hover:shadow-lg transition-all overflow-hidden ${isMobile ? 'active:scale-[0.98]' : ''}`}
                  onClick={isMobile ? () => navigate(`/booking/${booking.id}`) : undefined}
                >
                  {/* Mobile: colored status bar on left */}
                  <div className={isMobile ? 'flex' : ''}>
                    {isMobile && (
                      <div className={`w-1.5 shrink-0 ${getStatusColor(booking.status)}`} />
                    )}
                    <div className="flex-1">
                      <CardHeader className={isMobile ? 'p-3 pb-1' : ''}>
                        <div className="flex justify-between items-start">
                          <div className="min-w-0 flex-1">
                            <CardTitle className={isMobile ? 'text-base truncate' : 'text-2xl mb-2'}>
                              {booking.vendor.business_name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${getStatusColor(booking.status)} text-xs`}>
                                {booking.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground capitalize">{booking.vendor.category}</span>
                            </div>
                          </div>
                          {!isMobile && (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => navigate(`/booking/${booking.id}`)}>
                                View Details
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => navigate(`/vendors/${booking.vendor.id}`)}>
                                View Vendor
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className={isMobile ? 'p-3 pt-1' : ''}>
                        {isMobile ? (
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{format(new Date(booking.wedding_date), "MMM d, yyyy")}</span>
                            </div>
                            <span className="font-semibold text-foreground">₹{booking.total_amount.toLocaleString()}</span>
                          </div>
                        ) : (
                          <div className="grid md:grid-cols-2 gap-4">
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
                        )}
                    {booking.special_requirements && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Special Requirements:</p>
                        <p className="text-sm text-muted-foreground">{booking.special_requirements}</p>
                      </div>
                    )}
                    
                        {!isMobile && (booking.status === "pending" || booking.status === "confirmed" || booking.status === "completed") && (
                          <div className="mt-4 pt-4 border-t flex gap-3 flex-wrap">
                            {booking.status === "pending" && (
                              <Button onClick={() => navigate(`/checkout/${booking.id}`)} className="flex-1">
                                <DollarSign className="h-4 w-4 mr-2" /> Pay Advance
                              </Button>
                            )}
                            {booking.status === "completed" && (
                              <Button onClick={() => { setSelectedBooking(booking); setFinalPaymentDialogOpen(true); }} className="flex-1">
                                <DollarSign className="h-4 w-4 mr-2" /> Pay Remaining Amount
                              </Button>
                            )}
                            <Button variant="outline" onClick={() => navigate(`/messages?vendor=${booking.vendor.id}`)}>
                              <MessageSquare className="h-4 w-4 mr-2" /> Message Vendor
                            </Button>
                            {booking.status !== "completed" && (
                              <Button variant="outline" onClick={() => { setSelectedBooking(booking); setCancelDialogOpen(true); }} className="text-destructive hover:bg-destructive/10">
                                <XCircle className="h-4 w-4 mr-2" /> Cancel Booking
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </div>
                  </div>
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
