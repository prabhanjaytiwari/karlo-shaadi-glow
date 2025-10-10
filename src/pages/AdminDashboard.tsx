import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, CheckCircle, XCircle, TrendingUp, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVendors: 0,
    pendingVerification: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [pendingVendors, setPendingVendors] = useState<any[]>([]);
  const [allVendors, setAllVendors] = useState<any[]>([]);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const isAdmin = roles?.some(r => r.role === "admin");
      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      await loadDashboardData();
    } catch (error) {
      console.error("Error:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    const { data: vendors } = await supabase.from("vendors").select("*");
    const { data: bookings } = await supabase.from("bookings").select("*");

    if (vendors) {
      setAllVendors(vendors);
      setPendingVendors(vendors.filter(v => !v.verified));
      setStats(prev => ({
        ...prev,
        totalVendors: vendors.length,
        pendingVerification: vendors.filter(v => !v.verified).length,
      }));
    }

    if (bookings) {
      const revenue = bookings
        .filter(b => b.status === "completed")
        .reduce((sum, b) => sum + Number(b.total_amount), 0);
      
      setStats(prev => ({
        ...prev,
        totalBookings: bookings.length,
        totalRevenue: revenue,
      }));
    }
  };

  const handleVerifyVendor = async (vendorId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("vendors")
      .update({
        verified: true,
        verification_date: new Date().toISOString(),
        verified_by: user?.id,
      })
      .eq("id", vendorId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Vendor verified successfully",
      });
      loadDashboardData();
    }
  };

  const handleRejectVendor = async (vendorId: string) => {
    const { error } = await supabase
      .from("vendors")
      .update({ is_active: false })
      .eq("id", vendorId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Vendor rejected",
      });
      loadDashboardData();
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BhindiHeader />
      
      <main className="flex-1 bg-gradient-to-br from-background via-background/95 to-primary/5 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage platform operations and vendors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Vendors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalVendors}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Pending Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.pendingVerification}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Total Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalBookings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="verification" className="space-y-6">
            <TabsList>
              <TabsTrigger value="verification">Vendor Verification</TabsTrigger>
              <TabsTrigger value="vendors">All Vendors</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="verification">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Vendor Verification</CardTitle>
                  <CardDescription>Review and verify new vendor applications</CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingVendors.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No pending verifications</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Business Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Experience</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingVendors.map((vendor) => (
                          <TableRow key={vendor.id}>
                            <TableCell className="font-medium">{vendor.business_name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{vendor.category}</Badge>
                            </TableCell>
                            <TableCell>{vendor.years_experience} years</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleVerifyVendor(vendor.id)}
                                  className="gap-1"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Verify
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRejectVendor(vendor.id)}
                                  className="gap-1"
                                >
                                  <XCircle className="h-4 w-4" />
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vendors">
              <Card>
                <CardHeader>
                  <CardTitle>All Vendors</CardTitle>
                  <CardDescription>Complete vendor directory</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Bookings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allVendors.map((vendor) => (
                        <TableRow key={vendor.id}>
                          <TableCell className="font-medium">{vendor.business_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{vendor.category}</Badge>
                          </TableCell>
                          <TableCell>
                            {vendor.verified ? (
                              <Badge className="bg-green-500">Verified</Badge>
                            ) : (
                              <Badge variant="secondary">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell>{vendor.average_rating || 0} ⭐</TableCell>
                          <TableCell>{vendor.total_bookings || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>Key metrics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <BhindiFooter />
    </div>
  );
}
