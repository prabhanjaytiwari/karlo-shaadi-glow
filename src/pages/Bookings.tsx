import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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
  const isMobile = useIsMobile();

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      const { data, error } = await supabase.from("bookings").select(`*, vendor:vendors(business_name, category, id)`).eq("couple_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast({ title: "Error loading bookings", description: error.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-600";
      case "completed": return "bg-blue-600";
      case "cancelled": return "bg-red-500";
      default: return "bg-amber-500";
    }
  };

  const filteredBookings = filter === "all" ? bookings : bookings.filter(b => b.status === filter);
  const filters = ["all", "pending", "confirmed", "completed"];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MobilePageHeader title="My Bookings" />
      
      <main className={isMobile ? "flex-1 px-4 py-4 pb-24" : "flex-1 container mx-auto px-4 md:px-6 py-8 pt-20"}>
        <div className={isMobile ? "" : "max-w-6xl mx-auto"}>
          {!isMobile && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-1">My Bookings</h1>
              <p className="text-sm text-muted-foreground">Track and manage your vendor bookings</p>
            </div>
          )}

          {/* Filter chips */}
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
            {filters.map(f => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className={`rounded-full capitalize shrink-0 ${filter === f ? "" : "border-border/50"}`}
              >
                {f}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
            </div>
          ) : filteredBookings.length === 0 ? (
            <EmptyState icon={Calendar} title="No Bookings Yet" description="You haven't made any bookings yet. Start exploring our verified vendors and book your dream wedding services." actionText="Browse Vendors" actionLink="/search" />
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <Card 
                  key={booking.id} 
                  className={`rounded-2xl border-border/50 overflow-hidden hover:shadow-md transition-all ${isMobile ? 'active:scale-[0.98]' : ''}`}
                  onClick={isMobile ? () => navigate(`/booking/${booking.id}`) : undefined}
                >
                  <div className={isMobile ? 'flex' : ''}>
                    {isMobile && <div className={`w-1.5 shrink-0 ${getStatusColor(booking.status)}`} />}
                    <div className="flex-1">
                      <CardHeader className={isMobile ? 'p-3 pb-1' : 'pb-3'}>
                        <div className="flex justify-between items-start">
                          <div className="min-w-0 flex-1">
                            <CardTitle className={isMobile ? 'text-base truncate' : 'text-xl mb-1'}>
                              {booking.vendor.business_name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${getStatusColor(booking.status)} text-xs text-white`}>{booking.status}</Badge>
                              <span className="text-xs text-muted-foreground capitalize">{booking.vendor.category}</span>
                            </div>
                          </div>
                          {!isMobile && (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="rounded-full border-border/50" onClick={() => navigate(`/booking/${booking.id}`)}>View Details</Button>
                              <Button variant="outline" size="sm" className="rounded-full border-border/50" onClick={() => navigate(`/vendors/${booking.vendor.id}`)}>View Vendor</Button>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className={isMobile ? 'p-3 pt-1' : 'pt-0'}>
                        {isMobile ? (
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{format(new Date(booking.wedding_date), "MMM d, yyyy")}</span>
                            </div>
                            <span className="font-semibold text-foreground">₹{booking.total_amount.toLocaleString()}</span>
                          </div>
                        ) : (
                          <>
                            <div className="grid md:grid-cols-2 gap-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Wedding: {format(new Date(booking.wedding_date), "PPP")}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span>₹{booking.total_amount.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="capitalize">{booking.vendor.category}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                <span>Booked {format(new Date(booking.created_at), "PPP")}</span>
                              </div>
                            </div>
                            {booking.special_requirements && (
                              <div className="mt-3 p-3 bg-muted/50 rounded-xl">
                                <p className="text-sm font-medium mb-0.5">Special Requirements:</p>
                                <p className="text-sm text-muted-foreground">{booking.special_requirements}</p>
                              </div>
                            )}
                            {(booking.status === "pending" || booking.status === "confirmed" || booking.status === "completed") && (
                              <div className="mt-4 pt-3 border-t border-border/50 flex gap-2 flex-wrap">
                                {booking.status === "pending" && (
                                  <Button onClick={() => navigate(`/checkout/${booking.id}`)} className="flex-1 rounded-full">
                                    <DollarSign className="h-4 w-4 mr-2" /> Pay Advance
                                  </Button>
                                )}
                                {booking.status === "completed" && (
                                  <Button onClick={() => { setSelectedBooking(booking); setFinalPaymentDialogOpen(true); }} className="flex-1 rounded-full">
                                    <DollarSign className="h-4 w-4 mr-2" /> Pay Remaining
                                  </Button>
                                )}
                                <Button variant="outline" className="rounded-full border-border/50" onClick={() => navigate(`/messages?vendor=${booking.vendor.id}`)}>
                                  <MessageSquare className="h-4 w-4 mr-2" /> Message
                                </Button>
                                {booking.status !== "completed" && (
                                  <Button variant="outline" className="rounded-full text-destructive hover:bg-destructive/10 border-border/50" onClick={() => { setSelectedBooking(booking); setCancelDialogOpen(true); }}>
                                    <XCircle className="h-4 w-4 mr-2" /> Cancel
                                  </Button>
                                )}
                              </div>
                            )}
                          </>
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

      {selectedBooking && (
        <>
          <BookingCancellationDialog bookingId={selectedBooking.id} vendorName={selectedBooking.vendor.business_name} weddingDate={selectedBooking.wedding_date} totalAmount={selectedBooking.total_amount} paidAmount={(selectedBooking.total_amount * selectedBooking.advance_percentage) / 100} open={cancelDialogOpen} onOpenChange={setCancelDialogOpen} onSuccess={loadBookings} />
          <FinalPaymentDialog bookingId={selectedBooking.id} vendorName={selectedBooking.vendor.business_name} totalAmount={selectedBooking.total_amount} paidAmount={(selectedBooking.total_amount * selectedBooking.advance_percentage) / 100} weddingDate={selectedBooking.wedding_date} open={finalPaymentDialogOpen} onOpenChange={setFinalPaymentDialogOpen} onSuccess={loadBookings} />
        </>
      )}
    </div>
  );
}
