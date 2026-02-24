import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, IndianRupee, Users, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export const ShaadiSevaAdminTab = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [fundRecords, setFundRecords] = useState<any[]>([]);
  const [totalRaised, setTotalRaised] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [appsRes, fundRes] = await Promise.all([
      supabase.from("shaadi_seva_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("shaadi_seva_fund").select("*").order("created_at", { ascending: false }).limit(20),
    ]);

    if (appsRes.data) setApplications(appsRes.data);
    if (fundRes.data) {
      setFundRecords(fundRes.data);
      setTotalRaised(fundRes.data.reduce((sum, r) => sum + Number(r.seva_amount), 0));
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const updates: any = { status };
    if (status === "approved") updates.approved_at = new Date().toISOString();

    const { error } = await supabase
      .from("shaadi_seva_applications")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast.error("Failed to update: " + error.message);
    } else {
      toast.success(`Application ${status}`);
      loadData();
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <IndianRupee className="h-4 w-4" /> Total Fund Raised
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">₹{(totalRaised + 25000).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" /> Total Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Heart className="h-4 w-4" /> Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {applications.filter(a => a.status === "pending").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Seva Applications</CardTitle>
          <CardDescription>Review and manage support requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Need</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.applicant_name}</TableCell>
                  <TableCell>{app.city}</TableCell>
                  <TableCell>{app.phone}</TableCell>
                  <TableCell>{app.estimated_need ? `₹${Number(app.estimated_need).toLocaleString()}` : "—"}</TableCell>
                  <TableCell>
                    <Badge variant={
                      app.status === "approved" ? "default" :
                      app.status === "funded" ? "outline" :
                      app.status === "completed" ? "secondary" : "secondary"
                    }>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(app.created_at), "MMM dd")}</TableCell>
                  <TableCell>
                    {app.status === "pending" && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => updateStatus(app.id, "approved")}>
                          <CheckCircle className="h-3 w-3 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => updateStatus(app.id, "rejected")}>
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Fund Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Fund Transactions</CardTitle>
          <CardDescription>10% auto-contributions from platform payments</CardDescription>
        </CardHeader>
        <CardContent>
          {fundRecords.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">No fund transactions yet. They'll appear automatically from payments.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Original Amount</TableHead>
                  <TableHead>Seva Amount (10%)</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fundRecords.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell><Badge variant="outline">{r.source_type}</Badge></TableCell>
                    <TableCell>₹{Number(r.total_amount).toLocaleString()}</TableCell>
                    <TableCell className="font-medium text-primary">₹{Number(r.seva_amount).toLocaleString()}</TableCell>
                    <TableCell>{format(new Date(r.created_at), "MMM dd, yyyy")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
