import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Phone, Mail, Users, IndianRupee, Clock, CheckCircle, XCircle, MessageSquare, Eye } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface VendorInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  wedding_date: string | null;
  guest_count: number | null;
  budget_range: string | null;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface VendorInquiryManagementProps {
  vendorId: string;
}

export function VendorInquiryManagement({ vendorId }: VendorInquiryManagementProps) {
  const [inquiries, setInquiries] = useState<VendorInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    loadInquiries();
  }, [vendorId]);

  const loadInquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("vendor_inquiries")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading inquiries:", error);
      toast({
        title: "Error",
        description: "Failed to load inquiries",
        variant: "destructive",
      });
    } else {
      setInquiries(data || []);
    }
    setLoading(false);
  };

  const updateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    const { error } = await supabase
      .from("vendor_inquiries")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", inquiryId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Status updated",
        description: `Inquiry marked as ${newStatus}`,
      });
      loadInquiries();
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-300", label: "New" },
      contacted: { color: "bg-blue-100 text-blue-800 border-blue-300", label: "Contacted" },
      converted: { color: "bg-green-100 text-green-800 border-green-300", label: "Converted" },
      closed: { color: "bg-gray-100 text-gray-800 border-gray-300", label: "Closed" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={`${config.color} border`}>{config.label}</Badge>;
  };

  const filteredInquiries = filter === "all" 
    ? inquiries 
    : inquiries.filter(i => i.status === filter);

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === "pending").length,
    contacted: inquiries.filter(i => i.status === "contacted").length,
    converted: inquiries.filter(i => i.status === "converted").length,
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-32" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Inquiries</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-100 to-yellow-50 border-yellow-200">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
            <p className="text-sm text-yellow-600">New / Pending</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-700">{stats.contacted}</div>
            <p className="text-sm text-blue-600">Contacted</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-100 to-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-700">{stats.converted}</div>
            <p className="text-sm text-green-600">Converted</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="pending">New ({stats.pending})</TabsTrigger>
          <TabsTrigger value="contacted">Contacted ({stats.contacted})</TabsTrigger>
          <TabsTrigger value="converted">Converted ({stats.converted})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Inquiries List */}
      {filteredInquiries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No inquiries yet</h3>
            <p className="text-muted-foreground">
              {filter === "all" 
                ? "When couples send you quote requests, they'll appear here."
                : `No ${filter} inquiries at the moment.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {inquiry.name}
                      {getStatusBadge(inquiry.status)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  <Select
                    value={inquiry.status}
                    onValueChange={(value) => updateInquiryStatus(inquiry.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <a 
                    href={`tel:${inquiry.phone}`}
                    className="flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {inquiry.phone}
                  </a>
                  <a 
                    href={`mailto:${inquiry.email}`}
                    className="flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    {inquiry.email}
                  </a>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                  {inquiry.wedding_date && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Wedding Date</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(inquiry.wedding_date), "MMM dd, yyyy")}
                      </p>
                    </div>
                  )}
                  {inquiry.guest_count && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Guest Count</p>
                      <p className="font-medium flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {inquiry.guest_count} guests
                      </p>
                    </div>
                  )}
                  {inquiry.budget_range && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Budget</p>
                      <p className="font-medium flex items-center gap-1">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {inquiry.budget_range}
                      </p>
                    </div>
                  )}
                </div>

                {/* Message */}
                {inquiry.message && (
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-sm italic">"{inquiry.message}"</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    onClick={() => window.open(`https://wa.me/91${inquiry.phone.replace(/\D/g, '')}?text=Hi ${inquiry.name}, thank you for your inquiry on Karlo Shaadi! I'd love to discuss your wedding requirements.`, '_blank')}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    WhatsApp
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.href = `tel:${inquiry.phone}`}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.href = `mailto:${inquiry.email}?subject=Re: Your Wedding Inquiry on Karlo Shaadi`}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  {inquiry.status === "pending" && (
                    <Button
                      size="sm"
                      className="ml-auto"
                      onClick={() => updateInquiryStatus(inquiry.id, "contacted")}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Contacted
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
