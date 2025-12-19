import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Eye, Clock, MapPin, Phone, Mail, Instagram, Facebook, Globe, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface VendorVerificationPanelProps {
  pendingVendors: any[];
  onUpdate: () => void;
}

export function VendorVerificationPanel({ pendingVendors, onUpdate }: VendorVerificationPanelProps) {
  const { toast } = useToast();
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  const loadVendorDetails = async (vendor: any) => {
    setSelectedVendor(vendor);
    setDetailsOpen(true);
    
    // Load portfolio
    const { data: portfolioData } = await supabase
      .from("vendor_portfolio")
      .select("*")
      .eq("vendor_id", vendor.id)
      .order("display_order", { ascending: true })
      .limit(6);
    
    setPortfolio(portfolioData || []);

    // Load services
    const { data: servicesData } = await supabase
      .from("vendor_services")
      .select("*")
      .eq("vendor_id", vendor.id);
    
    setServices(servicesData || []);
  };

  const handleVerify = async (vendorId: string) => {
    setProcessing(vendorId);
    const { data: { user } } = await supabase.auth.getUser();
    
    try {
      const { error } = await supabase
        .from("vendors")
        .update({
          verified: true,
          verification_status: "approved",
          verification_date: new Date().toISOString(),
          verified_by: user?.id,
        })
        .eq("id", vendorId);

      if (error) throw error;

      // Create notification for vendor
      const { data: vendorData } = await supabase
        .from("vendors")
        .select("user_id, business_name")
        .eq("id", vendorId)
        .single();

      if (vendorData) {
        await supabase.from("notifications").insert({
          user_id: vendorData.user_id,
          type: "verification_approved",
          title: "Verification Approved! 🎉",
          message: `Congratulations! Your business "${vendorData.business_name}" has been verified. You can now receive bookings.`,
          link: "/vendor/dashboard"
        });
      }

      toast({
        title: "Vendor Verified",
        description: "The vendor has been approved and notified",
      });
      
      setDetailsOpen(false);
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (vendorId: string) => {
    if (!rejectReason.trim()) {
      toast({
        title: "Rejection reason required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    setProcessing(vendorId);
    
    try {
      const { error } = await supabase
        .from("vendors")
        .update({
          verification_status: "rejected",
          is_active: false,
        })
        .eq("id", vendorId);

      if (error) throw error;

      // Create notification for vendor
      const { data: vendorData } = await supabase
        .from("vendors")
        .select("user_id, business_name")
        .eq("id", vendorId)
        .single();

      if (vendorData) {
        await supabase.from("notifications").insert({
          user_id: vendorData.user_id,
          type: "verification_rejected",
          title: "Verification Update",
          message: `Your business "${vendorData.business_name}" verification was not approved. Reason: ${rejectReason}`,
          link: "/vendor/verification"
        });
      }

      toast({
        title: "Vendor Rejected",
        description: "The vendor has been notified of the rejection",
      });
      
      setDetailsOpen(false);
      setRejectReason("");
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Pending Vendor Verification
          </CardTitle>
          <CardDescription>
            Review and verify new vendor applications ({pendingVendors.length} pending)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingVendors.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-muted-foreground">No pending verifications</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {vendor.logo_url ? (
                            <img src={vendor.logo_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <span className="font-semibold text-primary">{vendor.business_name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{vendor.business_name}</p>
                          {vendor.address && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {vendor.address.substring(0, 30)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{vendor.category}</Badge>
                    </TableCell>
                    <TableCell>{vendor.years_experience || 0} years</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {vendor.phone_number && <Phone className="h-4 w-4 text-muted-foreground" />}
                        {vendor.instagram_handle && <Instagram className="h-4 w-4 text-muted-foreground" />}
                        {vendor.website_url && <Globe className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(vendor.created_at), "MMM dd, yyyy")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => loadVendorDetails(vendor)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleVerify(vendor.id)}
                          disabled={processing === vendor.id}
                        >
                          {processing === vendor.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </>
                          )}
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

      {/* Vendor Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vendor Review: {selectedVendor?.business_name}</DialogTitle>
            <DialogDescription>
              Review vendor details before approving or rejecting
            </DialogDescription>
          </DialogHeader>

          {selectedVendor && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Business Name</Label>
                    <p className="font-medium">{selectedVendor.business_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Category</Label>
                    <p className="capitalize">{selectedVendor.category}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Experience</Label>
                    <p>{selectedVendor.years_experience || 0} years</p>
                  </div>
                  {selectedVendor.team_size && (
                    <div>
                      <Label className="text-muted-foreground">Team Size</Label>
                      <p>{selectedVendor.team_size} members</p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {selectedVendor.phone_number && (
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {selectedVendor.phone_number}
                      </p>
                    </div>
                  )}
                  {selectedVendor.address && (
                    <div>
                      <Label className="text-muted-foreground">Address</Label>
                      <p className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        {selectedVendor.address}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-3">
                    {selectedVendor.website_url && (
                      <a href={selectedVendor.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                        <Globe className="h-4 w-4" /> Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {selectedVendor.instagram_handle && (
                      <a href={`https://instagram.com/${selectedVendor.instagram_handle}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                        <Instagram className="h-4 w-4" /> Instagram
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {selectedVendor.facebook_page && (
                      <a href={selectedVendor.facebook_page} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                        <Facebook className="h-4 w-4" /> Facebook
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedVendor.description && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1 text-sm bg-muted p-3 rounded-lg">{selectedVendor.description}</p>
                </div>
              )}

              {/* Services */}
              {services.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Services ({services.length})</Label>
                  <div className="grid sm:grid-cols-2 gap-2 mt-2">
                    {services.map(service => (
                      <div key={service.id} className="p-3 bg-muted rounded-lg">
                        <p className="font-medium">{service.service_name}</p>
                        {service.base_price && (
                          <p className="text-sm text-muted-foreground">₹{Number(service.base_price).toLocaleString()}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio */}
              {portfolio.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Portfolio ({portfolio.length} images)</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {portfolio.map(item => (
                      <div key={item.id} className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img src={item.image_url} alt={item.title || ""} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              <div>
                <Label htmlFor="reject-reason">Rejection Reason (if rejecting)</Label>
                <Textarea
                  id="reject-reason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Provide reason for rejection..."
                  className="mt-2"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => handleReject(selectedVendor.id)}
                  disabled={processing === selectedVendor.id}
                >
                  {processing === selectedVendor.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Reject
                </Button>
                <Button
                  onClick={() => handleVerify(selectedVendor.id)}
                  disabled={processing === selectedVendor.id}
                >
                  {processing === selectedVendor.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Approve Vendor
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}