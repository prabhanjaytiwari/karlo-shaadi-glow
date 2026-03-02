import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  FileText,
  MessageCircle,
  Download,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { MessagingDialog } from "@/components/MessagingDialog";
import { BookingDocumentUpload } from "@/components/BookingDocumentUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BookingDetailsData {
  id: string;
  status: string;
  wedding_date: string;
  total_amount: number;
  advance_percentage: number;
  special_requirements: string | null;
  created_at: string;
  confirmed_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  vendor: {
    id: string;
    business_name: string;
    user_id: string;
    cities: {
      name: string;
      state: string;
    };
  };
  service: {
    service_name: string;
  } | null;
}

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<BookingDetailsData | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadBookingData();
    }
  }, [id, user]);

  const checkAuth = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      navigate('/auth');
      return;
    }
    setUser(authUser);
  };

  const loadBookingData = async () => {
    try {
      // Load booking details
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .select(`
          *,
          vendor:vendors(
            id,
            business_name,
            user_id,
            cities(name, state)
          ),
          service:vendor_services(service_name)
        `)
        .eq("id", id)
        .single();

      if (bookingError) throw bookingError;

      // Check if user has access to this booking
      if (bookingData.couple_id !== user.id && bookingData.vendor.user_id !== user.id) {
        toast({
          title: "Access denied",
          description: "You don't have permission to view this booking",
          variant: "destructive",
        });
        navigate('/bookings');
        return;
      }

      setBooking(bookingData);

      // Load payments
      const { data: paymentsData } = await supabase
        .from("payments")
        .select("*")
        .eq("booking_id", id)
        .order("created_at", { ascending: true });

      setPayments(paymentsData || []);

      // Load documents
      const { data: documentsData } = await supabase
        .from("booking_documents")
        .select("*")
        .eq("booking_id", id)
        .order("created_at", { ascending: false });

      setDocuments(documentsData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      pending: { variant: "secondary", icon: Clock, label: "Pending" },
      confirmed: { variant: "default", icon: CheckCircle2, label: "Confirmed" },
      completed: { variant: "default", icon: CheckCircle2, label: "Completed" },
      cancelled: { variant: "destructive", icon: XCircle, label: "Cancelled" },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getTimelineSteps = () => {
    if (!booking) return [];

    const steps = [
      {
        label: "Booking Requested",
        date: booking.created_at,
        completed: true,
        icon: CheckCircle2,
      },
      {
        label: "Confirmed",
        date: booking.confirmed_at,
        completed: !!booking.confirmed_at,
        icon: booking.confirmed_at ? CheckCircle2 : Clock,
      },
      {
        label: "Completed",
        date: booking.completed_at,
        completed: !!booking.completed_at,
        icon: booking.completed_at ? CheckCircle2 : Clock,
      },
    ];

    if (booking.cancelled_at) {
      steps.push({
        label: "Cancelled",
        date: booking.cancelled_at,
        completed: true,
        icon: XCircle,
      });
    }

    return steps;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container mx-auto px-4 py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Booking not found</AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  const advanceAmount = (booking.total_amount * booking.advance_percentage) / 100;
  const remainingAmount = booking.total_amount - advanceAmount;
  const isCouple = booking.vendor.user_id !== user?.id;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/bookings')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{booking.vendor.business_name}</h1>
              <p className="text-muted-foreground">Booking ID: {booking.id.slice(0, 8)}</p>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(booking.status)}
              <MessagingDialog
                vendorId={booking.vendor.id}
                vendorName={booking.vendor.business_name}
              >
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </MessagingDialog>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Booking Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Wedding Date</p>
                      <p className="font-medium">
                        {format(new Date(booking.wedding_date), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  {booking.service && (
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Service</p>
                        <p className="font-medium">{booking.service.service_name}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">
                        {booking.vendor.cities.name}, {booking.vendor.cities.state}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Booked On</p>
                      <p className="font-medium">
                        {format(new Date(booking.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-bold text-xl">₹{booking.total_amount.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Advance ({booking.advance_percentage}%)</span>
                    <span className="font-medium">₹{advanceAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Remaining</span>
                    <span className="font-medium">₹{remainingAmount.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Special Requirements */}
            {booking.special_requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Special Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {booking.special_requirements}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Cancellation Info */}
            {booking.status === "cancelled" && booking.cancellation_reason && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Cancellation Reason:</strong> {booking.cancellation_reason}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Booking Timeline</CardTitle>
                <CardDescription>Track the progress of your booking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {getTimelineSteps().map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`rounded-full p-2 ${
                              step.completed
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          {index < getTimelineSteps().length - 1 && (
                            <div className="h-12 w-px bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <p className="font-medium">{step.label}</p>
                          {step.date && (
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(step.date), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View all payment transactions for this booking</CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No payments recorded yet</p>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium capitalize">{payment.milestone} Payment</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(payment.created_at), "MMM d, yyyy")}
                          </p>
                          {payment.transaction_id && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Transaction ID: {payment.transaction_id}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{payment.amount.toLocaleString()}</p>
                          <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <BookingDocumentUpload 
              bookingId={booking.id} 
              onUploadComplete={loadBookingData}
            />

            <Card>
              <CardHeader>
                <CardTitle>Uploaded Documents</CardTitle>
                <CardDescription>All documents related to this booking</CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No documents uploaded yet</p>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium capitalize">{doc.document_type}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(doc.created_at), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(doc.file_url, "_blank")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      
    </div>
  );
}
