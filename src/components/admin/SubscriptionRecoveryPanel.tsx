import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Search, RefreshCw, Shield, AlertTriangle, CheckCircle, Loader2, Database } from "lucide-react";
import { format } from "date-fns";

export function SubscriptionRecoveryPanel() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [paymentLogs, setPaymentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Manual activate form
  const [manualPlan, setManualPlan] = useState("starter");
  const [manualPaymentId, setManualPaymentId] = useState("");
  const [activating, setActivating] = useState(false);

  const searchVendors = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select("id, business_name, category, city, subscription_tier, user_id, verified")
        .or(`business_name.ilike.%${searchQuery}%,id.eq.${searchQuery.length === 36 ? searchQuery : '00000000-0000-0000-0000-000000000000'}`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
      setSelectedVendor(null);
      setSyncResult(null);
    } catch (err: any) {
      toast({ title: "Search failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const selectVendor = async (vendor: any) => {
    setSelectedVendor(vendor);
    setSyncResult(null);

    // Fetch subscription and payment logs
    const [subRes, logsRes] = await Promise.all([
      supabase
        .from("vendor_subscriptions")
        .select("*")
        .eq("vendor_id", vendor.id)
        .maybeSingle(),
      supabase
        .from("payment_logs")
        .select("*")
        .eq("vendor_id", vendor.id)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    setSelectedVendor({ ...vendor, subscription: subRes.data });
    setPaymentLogs(logsRes.data || []);
  };

  const syncFromRazorpay = async () => {
    if (!selectedVendor) return;
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-vendor-subscription", {
        body: { vendorId: selectedVendor.id },
      });
      if (error) throw error;
      setSyncResult(data);

      if (data?.synced) {
        toast({ title: "Synced ✓", description: "Subscription status updated from Razorpay." });
        await selectVendor(selectedVendor); // Refresh
      } else {
        toast({ title: "Verified", description: "Local status matches Razorpay. No changes needed." });
      }
    } catch (err: any) {
      toast({ title: "Sync failed", description: err.message, variant: "destructive" });
    } finally {
      setSyncing(false);
    }
  };

  const manualActivate = async () => {
    if (!selectedVendor) return;
    setActivating(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-vendor-subscription", {
        body: {
          vendorId: selectedVendor.id,
          action: "manual_activate",
          plan: manualPlan,
          paymentId: manualPaymentId || undefined,
        },
      });
      if (error) throw error;
      toast({ title: "Subscription Activated ✓", description: `${manualPlan} plan activated manually.` });
      await selectVendor(selectedVendor); // Refresh
      setManualPaymentId("");
    } catch (err: any) {
      toast({ title: "Activation failed", description: err.message, variant: "destructive" });
    } finally {
      setActivating(false);
    }
  };

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-emerald-100 text-emerald-700",
      success: "bg-emerald-100 text-emerald-700",
      created: "bg-blue-100 text-blue-700",
      pending: "bg-amber-100 text-amber-700",
      received: "bg-blue-100 text-blue-700",
      cancelled: "bg-red-100 text-red-700",
      failed: "bg-red-100 text-red-700",
      expired: "bg-gray-100 text-gray-700",
      synced: "bg-purple-100 text-purple-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="border border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-600" />
            Subscription Recovery
          </CardTitle>
          <CardDescription className="text-xs">
            Search vendor, verify Razorpay status, fix mismatches, or manually activate subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by business name or vendor ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchVendors()}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Button size="sm" onClick={searchVendors} disabled={loading} className="gap-1.5">
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
              Search
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-4 border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs">Business</TableHead>
                    <TableHead className="text-xs">Category</TableHead>
                    <TableHead className="text-xs">Tier</TableHead>
                    <TableHead className="text-xs">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((v) => (
                    <TableRow key={v.id} className="hover:bg-muted/20">
                      <TableCell className="text-sm font-medium">{v.business_name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px] capitalize">{v.category}</Badge></TableCell>
                      <TableCell><Badge className={`text-[10px] ${statusColor(v.subscription_tier || "free")}`}>{v.subscription_tier || "free"}</Badge></TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => selectVendor(v)}>
                          Inspect
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Vendor Detail */}
      {selectedVendor && (
        <>
          <Card className="border border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{selectedVendor.business_name}</CardTitle>
              <CardDescription className="text-xs font-mono">{selectedVendor.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Status */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">DB Tier</p>
                  <p className="text-sm font-semibold capitalize">{selectedVendor.subscription_tier || "free"}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Sub Status</p>
                  <Badge className={`text-[10px] mt-0.5 ${statusColor(selectedVendor.subscription?.status || "none")}`}>
                    {selectedVendor.subscription?.status || "none"}
                  </Badge>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Plan</p>
                  <p className="text-sm font-semibold capitalize">{selectedVendor.subscription?.plan || "—"}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Expires</p>
                  <p className="text-sm font-semibold">
                    {selectedVendor.subscription?.expires_at
                      ? format(new Date(selectedVendor.subscription.expires_at), "dd MMM yyyy")
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Sync Result */}
              {syncResult && (
                <div className="p-3 rounded-lg border bg-muted/20 text-xs space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    {syncResult.synced ? (
                      <><AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Mismatch Fixed</>
                    ) : (
                      <><CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Status Matches</>
                    )}
                  </p>
                  <p>Razorpay: <Badge variant="outline" className="text-[10px]">{syncResult.razorpay?.status}</Badge></p>
                  <p>Local: <Badge variant="outline" className="text-[10px]">{syncResult.local?.status}</Badge></p>
                  {syncResult.syncDetails && <p className="text-muted-foreground">{syncResult.syncDetails}</p>}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={syncFromRazorpay} disabled={syncing} className="gap-1.5">
                  {syncing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                  Sync from Razorpay
                </Button>
              </div>

              {/* Manual Activate */}
              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5" /> Manual Activation
                </h4>
                <p className="text-xs text-muted-foreground">
                  Use when payment succeeded on Razorpay but subscription isn't reflected in the system.
                </p>
                <div className="flex flex-wrap gap-2 items-end">
                  <div>
                    <label className="text-[10px] text-muted-foreground">Plan</label>
                    <Select value={manualPlan} onValueChange={setManualPlan}>
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="elite">Elite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] text-muted-foreground">Razorpay Payment ID (optional)</label>
                    <Input
                      placeholder="pay_xxxxxxxxxxxx"
                      value={manualPaymentId}
                      onChange={(e) => setManualPaymentId(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <Button size="sm" onClick={manualActivate} disabled={activating} className="gap-1.5 h-8">
                    {activating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                    Activate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Logs */}
          <Card className="border border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payment Logs</CardTitle>
              <CardDescription className="text-xs">
                Full audit trail for {selectedVendor.business_name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paymentLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No payment events recorded yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="text-[10px]">Time</TableHead>
                        <TableHead className="text-[10px]">Event</TableHead>
                        <TableHead className="text-[10px]">Status</TableHead>
                        <TableHead className="text-[10px]">Plan</TableHead>
                        <TableHead className="text-[10px]">Amount</TableHead>
                        <TableHead className="text-[10px]">Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentLogs.map((log) => (
                        <TableRow key={log.id} className="hover:bg-muted/10">
                          <TableCell className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {format(new Date(log.created_at), "dd MMM HH:mm:ss")}
                          </TableCell>
                          <TableCell className="text-[10px] font-mono">{log.event_type}</TableCell>
                          <TableCell>
                            <Badge className={`text-[9px] ${statusColor(log.status)}`}>{log.status}</Badge>
                          </TableCell>
                          <TableCell className="text-[10px] capitalize">{log.plan || "—"}</TableCell>
                          <TableCell className="text-[10px]">{log.amount ? `₹${log.amount}` : "—"}</TableCell>
                          <TableCell className="text-[10px] text-red-500 max-w-[200px] truncate">
                            {log.error_message || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
