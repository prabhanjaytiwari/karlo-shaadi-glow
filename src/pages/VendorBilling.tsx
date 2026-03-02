import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, CreditCard, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: string;
  amount: number;
  payment_type: string;
  status: string;
  razorpay_payment_id: string | null;
  invoice_number: string | null;
  description: string | null;
  created_at: string;
  paid_at: string | null;
}

export default function VendorBilling() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<any>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: vendorData } = await supabase
        .from("vendors")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!vendorData) {
        navigate("/vendor/onboarding");
        return;
      }

      setVendor(vendorData);

      // Load payments
      const { data: paymentsData } = await supabase
        .from("vendor_payments")
        .select("*")
        .eq("vendor_id", vendorData.id)
        .order("created_at", { ascending: false });

      setPayments(paymentsData || []);

      // Load subscription
      const { data: subData } = await supabase
        .from("vendor_subscriptions")
        .select("*")
        .eq("vendor_id", vendorData.id)
        .single();

      setSubscription(subData);
    } catch (error) {
      console.error("Error loading billing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (payment: Payment) => {
    // Generate a simple invoice download
    toast({
      title: "Invoice Download",
      description: `Invoice ${payment.invoice_number || payment.id.slice(0, 8)} will be downloaded shortly`,
    });
    
    // In production, this would call an edge function to generate PDF
    const invoiceData = {
      invoiceNumber: payment.invoice_number || `INV-${payment.id.slice(0, 8).toUpperCase()}`,
      date: new Date(payment.paid_at || payment.created_at).toLocaleDateString(),
      amount: payment.amount,
      description: payment.description || payment.payment_type,
      status: payment.status,
      paymentId: payment.razorpay_payment_id,
    };
    
    // Create a simple text invoice for now
    const invoiceText = `
KARLO SHAADI - TAX INVOICE
================================
Invoice Number: ${invoiceData.invoiceNumber}
Date: ${invoiceData.date}
--------------------------------
Description: ${invoiceData.description}
Amount: ₹${invoiceData.amount.toLocaleString()}
Status: ${invoiceData.status.toUpperCase()}
Payment ID: ${invoiceData.paymentId || 'N/A'}
--------------------------------
Thank you for your business!
    `;
    
    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceData.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Paid</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case "failed":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    const configs: Record<string, { label: string; className: string }> = {
      free: { label: "Silver (Free)", className: "bg-muted text-muted-foreground" },
      featured: { label: "Gold ⭐", className: "bg-gradient-to-r from-yellow-400/20 to-amber-500/20 text-amber-700" },
      sponsored: { label: "Diamond 💎", className: "bg-gradient-to-r from-primary/20 to-accent/20 text-primary" },
    };
    return configs[tier] || configs.free;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading billing history..." />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Billing History"
        description="View your payment history and download invoices"
        keywords="billing, payments, invoices, vendor"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60">
        
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-5xl">
            <Button
              variant="ghost"
              onClick={() => navigate("/vendor/settings")}
              className="mb-6 hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
            </Button>

            <div className="mb-8">
              <Badge className="bg-accent text-accent-foreground mb-2">Vendor Portal</Badge>
              <h1 className="text-3xl font-bold text-foreground">Billing History</h1>
              <p className="text-muted-foreground mt-2">
                View all your payments and download invoices
              </p>
            </div>

            {/* Current Subscription */}
            <Card className="mb-8 bg-white/90 border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-accent" />
                  Current Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <Badge className={getTierBadge(vendor?.subscription_tier || "free").className}>
                      {getTierBadge(vendor?.subscription_tier || "free").label}
                    </Badge>
                  </div>
                  
                  {subscription?.status === "active" && (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Monthly Amount</p>
                        <p className="font-semibold">₹{subscription.amount?.toLocaleString() || 0}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Next Billing Date</p>
                        <p className="font-semibold">
                          {subscription.expires_at 
                            ? new Date(subscription.expires_at).toLocaleDateString()
                            : "N/A"
                          }
                        </p>
                      </div>
                    </>
                  )}
                  
                  <Button onClick={() => navigate("/vendor-pricing")} variant="outline">
                    {vendor?.subscription_tier === "free" ? "Upgrade Plan" : "Change Plan"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card className="bg-white/90 border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Payment History
                </CardTitle>
                <CardDescription>
                  All your subscription and upgrade payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No payments yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Your payment history will appear here once you make a purchase
                    </p>
                    <Button onClick={() => navigate("/vendor-pricing")}>
                      View Plans
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Invoice</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>
                              {new Date(payment.paid_at || payment.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <span className="capitalize">
                                {payment.description || payment.payment_type.replace("_", " ")}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium">
                              ₹{payment.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(payment.status)}
                            </TableCell>
                            <TableCell>
                              {payment.status === "paid" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => downloadInvoice(payment)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        
      </div>
    </>
  );
}
