import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Download, CreditCard, FileText, CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";

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

const PLAN_PRICES: Record<string, number> = {
  free: 0,
  silver: 499,
  gold: 999,
  diamond: 1999,
};

const GST_RATE = 0.18;

function generateGSTInvoiceHTML(payment: Payment, vendor: any): string {
  const invoiceNumber = payment.invoice_number || `INV-${payment.id.slice(0, 8).toUpperCase()}`;
  const invoiceDate = new Date(payment.paid_at || payment.created_at).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });
  const baseAmount = +(payment.amount / (1 + GST_RATE)).toFixed(2);
  const gstAmount = +(payment.amount - baseAmount).toFixed(2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Tax Invoice ${invoiceNumber}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; background: #fff; padding: 40px; max-width: 760px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #db2777; padding-bottom: 20px; margin-bottom: 24px; }
  .brand { font-size: 22px; font-weight: 800; color: #db2777; }
  .brand-sub { font-size: 11px; color: #666; margin-top: 2px; }
  .invoice-title { text-align: right; }
  .invoice-title h1 { font-size: 18px; font-weight: 700; color: #db2777; }
  .invoice-title p { font-size: 12px; color: #555; margin-top: 3px; }
  .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
  .meta-box h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin-bottom: 6px; }
  .meta-box p { font-size: 13px; color: #222; line-height: 1.5; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  thead { background: #fdf2f8; }
  thead th { padding: 10px 12px; text-align: left; font-size: 12px; font-weight: 600; color: #555; border-bottom: 1px solid #f0abcc; }
  tbody td { padding: 12px; font-size: 13px; border-bottom: 1px solid #f5f5f5; }
  .text-right { text-align: right; }
  .totals { margin-left: auto; width: 260px; }
  .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
  .totals-row.total { border-top: 2px solid #db2777; margin-top: 6px; padding-top: 10px; font-weight: 700; font-size: 15px; color: #db2777; }
  .gst-note { font-size: 11px; color: #777; margin-top: 4px; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: flex-end; }
  .footer-note { font-size: 11px; color: #999; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; background: #dcfce7; color: #16a34a; }
  @media print {
    body { padding: 20px; }
    button { display: none !important; }
  }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="brand">Karlo Shaadi</div>
    <div class="brand-sub">India's #1 Wedding Planning Platform</div>
    <div class="brand-sub">GSTIN: 09AAICS1234B1ZF · CIN: U74999UP2025PTC123456</div>
    <div class="brand-sub">support@karloshaadi.com · karloshaadi.com</div>
  </div>
  <div class="invoice-title">
    <h1>TAX INVOICE</h1>
    <p>Invoice No: <strong>${invoiceNumber}</strong></p>
    <p>Date: ${invoiceDate}</p>
    ${payment.status === "paid" ? '<p style="margin-top:6px"><span class="badge">✓ PAID</span></p>' : ''}
  </div>
</div>

<div class="meta-grid">
  <div class="meta-box">
    <h3>Billed To</h3>
    <p><strong>${vendor?.business_name || "Vendor"}</strong></p>
    <p>${vendor?.category ? vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1) : ""}</p>
    ${vendor?.city ? `<p>${vendor.city}</p>` : ""}
  </div>
  <div class="meta-box">
    <h3>Payment Details</h3>
    <p>Payment ID: ${payment.razorpay_payment_id || "N/A"}</p>
    <p>Type: ${(payment.description || payment.payment_type || "").replace(/_/g, " ").toUpperCase()}</p>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Description</th>
      <th class="text-right">Amount (₹)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>${payment.description || "Karlo Shaadi Subscription"}</td>
      <td class="text-right">₹${baseAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
    </tr>
  </tbody>
</table>

<div class="totals">
  <div class="totals-row"><span>Subtotal</span><span>₹${baseAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
  <div class="totals-row"><span>GST @18% (IGST)</span><span>₹${gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
  <div class="totals-row total"><span>Total</span><span>₹${payment.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
  <div class="gst-note">Amount in words: ${amountInWords(payment.amount)}</div>
</div>

<div class="footer">
  <div class="footer-note">
    <p>This is a computer-generated invoice and does not require a signature.</p>
    <p>For support: support@karloshaadi.com</p>
  </div>
  <button onclick="window.print()" style="background:#db2777;color:#fff;border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;">
    Print / Save PDF
  </button>
</div>
</body>
</html>`;
}

function amountInWords(amount: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  const numToWords = (n: number): string => {
    if (n === 0) return "";
    if (n < 20) return ones[n] + " ";
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "") + " ";
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred " + numToWords(n % 100);
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + "Thousand " + numToWords(n % 1000);
    return numToWords(Math.floor(n / 100000)) + "Lakh " + numToWords(n % 100000);
  };

  let result = `Indian Rupees ${numToWords(rupees).trim()}`;
  if (paise > 0) result += ` and ${numToWords(paise).trim()} Paise`;
  return result + " Only";
}

export default function VendorBilling() {
  const isMobile = useIsMobile();
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
      if (!user) { navigate("/auth"); return; }

      const { data: vendorData } = await supabase
        .from("vendors").select("*").eq("user_id", user.id).single();
      if (!vendorData) { navigate("/vendor/onboarding"); return; }
      setVendor(vendorData);

      const { data: paymentsData } = await supabase
        .from("vendor_payments").select("*").eq("vendor_id", vendorData.id)
        .order("created_at", { ascending: false });
      setPayments(paymentsData || []);

      const { data: subData } = await supabase
        .from("vendor_subscriptions").select("*").eq("vendor_id", vendorData.id).single();
      setSubscription(subData);
    } catch { /* ignored */ } finally { setLoading(false); }
  };

  const downloadInvoice = (payment: Payment) => {
    const html = generateGSTInvoiceHTML(payment, vendor);
    const win = window.open("", "_blank", "width=800,height=700");
    if (win) {
      win.document.write(html);
      win.document.close();
    } else {
      // Fallback: download as HTML file
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${payment.invoice_number || payment.id.slice(0, 8)}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "Invoice downloaded", description: "Open the HTML file in your browser and print to PDF." });
    }
  };

  // Prorated upgrade calculation
  const calculateProration = (targetPlan: string): { credit: number; charge: number } | null => {
    if (!subscription?.expires_at || !subscription?.amount) return null;
    const now = new Date();
    const expiresAt = new Date(subscription.expires_at);
    const totalDays = 30;
    const daysRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const credit = Math.round((daysRemaining / totalDays) * subscription.amount);
    const newPrice = PLAN_PRICES[targetPlan] || 0;
    const charge = Math.max(0, newPrice - credit);
    return { credit, charge };
  };

  // Renewal reminder — within 7 days
  const daysUntilRenewal = subscription?.expires_at
    ? Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const showRenewalReminder = daysUntilRenewal !== null && daysUntilRenewal >= 0 && daysUntilRenewal <= 7;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":   return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Paid</Badge>;
      case "pending": return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case "failed":  return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      default:        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    const configs: Record<string, { label: string; className: string }> = {
      free:      { label: "Silver (Free)",  className: "bg-muted text-muted-foreground" },
      featured:  { label: "Gold ⭐",         className: "bg-gradient-to-r from-yellow-400/20 to-amber-500/20 text-amber-700" },
      sponsored: { label: "Diamond 💎",     className: "bg-gradient-to-r from-primary/20 to-accent/20 text-primary" },
    };
    return configs[tier] || configs.free;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="xl" text="Loading billing history…" /></div>;
  }

  return (
    <>
      <SEO
        title="Billing History"
        description="View your payment history and download GST invoices"
        keywords="billing, payments, invoices, GST, vendor"
      />

      <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60">
        <MobilePageHeader title="Billing History" />

        <main className={isMobile ? "px-4 py-4 pb-24" : "pt-24 pb-16"}>
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <Button variant="ghost" onClick={() => navigate("/vendor/settings")} className="mb-6 hover:text-accent">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Settings
            </Button>

            <div className="mb-8">
              <Badge className="bg-accent text-accent-foreground mb-2">Vendor Portal</Badge>
              <h1 className="text-3xl font-bold text-foreground">Billing History</h1>
              <p className="text-muted-foreground mt-2">View payments and download GST-compliant invoices</p>
            </div>

            {/* Renewal reminder */}
            {showRenewalReminder && (
              <Alert className="mb-6 border-amber-300 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="flex items-center justify-between flex-wrap gap-3">
                  <span className="text-amber-800 font-medium">
                    Your subscription renews in <strong>{daysUntilRenewal} day{daysUntilRenewal !== 1 ? "s" : ""}</strong> on{" "}
                    {new Date(subscription.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}.
                  </span>
                  <Button size="sm" onClick={() => navigate("/vendor-pricing")} className="shrink-0">
                    Manage Plan
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Current Subscription */}
            <Card className="mb-8 bg-white/90 border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-accent" /> Current Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-start justify-between gap-4">
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
                        <p className="text-xs text-muted-foreground">incl. 18% GST</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Next Billing Date</p>
                        <p className="font-semibold">
                          {subscription.expires_at
                            ? new Date(subscription.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                            : "N/A"}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="flex flex-col gap-2">
                    <Button onClick={() => navigate("/vendor-pricing")} variant="outline">
                      {vendor?.subscription_tier === "free" ? "Upgrade Plan" : "Change Plan"}
                    </Button>
                    {/* Proration info */}
                    {subscription?.status === "active" && vendor?.subscription_tier !== "free" && (() => {
                      const proration = calculateProration("gold");
                      if (!proration) return null;
                      return (
                        <p className="text-xs text-muted-foreground text-center max-w-[160px]">
                          Upgrading will credit ~₹{proration.credit} for unused days
                        </p>
                      );
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card className="bg-white/90 border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" /> Payment History
                </CardTitle>
                <CardDescription>
                  All your payments — click Download to get a GST-compliant tax invoice
                </CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No payments yet</h3>
                    <p className="text-muted-foreground mb-4">Your payment history will appear here once you make a purchase</p>
                    <Button onClick={() => navigate("/vendor-pricing")}>View Plans</Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>GST (18%)</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Invoice</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => {
                          const base = +(payment.amount / (1 + GST_RATE)).toFixed(2);
                          const gst = +(payment.amount - base).toFixed(2);
                          return (
                            <TableRow key={payment.id}>
                              <TableCell>
                                {new Date(payment.paid_at || payment.created_at).toLocaleDateString("en-IN")}
                              </TableCell>
                              <TableCell>
                                <span className="capitalize">{payment.description || payment.payment_type.replace(/_/g, " ")}</span>
                              </TableCell>
                              <TableCell className="font-medium">₹{payment.amount.toLocaleString()}</TableCell>
                              <TableCell className="text-muted-foreground text-sm">₹{gst.toLocaleString()}</TableCell>
                              <TableCell>{getStatusBadge(payment.status)}</TableCell>
                              <TableCell>
                                {payment.status === "paid" && (
                                  <Button variant="ghost" size="sm" onClick={() => downloadInvoice(payment)}>
                                    <Download className="h-4 w-4 mr-1" /> PDF
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
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
