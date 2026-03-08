import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Shield,
  MapPin,
  Facebook,
  Instagram,
  Phone,
  Image,
  FileText,
  Loader2,
  ArrowRight,
} from "lucide-react";

interface VerificationItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  isComplete: boolean;
  field: string;
}

export default function VendorVerificationStatus() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/vendor-auth");
        return;
      }

      const { data: vendorData, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setVendor(vendorData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not load vendor data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">No vendor profile found</p>
        <Button onClick={() => navigate("/vendor-onboarding")}>
          Create Vendor Profile
        </Button>
      </div>
    );
  }

  const verificationItems: VerificationItem[] = [
    {
      id: "business_name",
      label: "Business Name",
      description: "Your registered business name",
      icon: FileText,
      isComplete: !!vendor.business_name,
      field: "business_name",
    },
    {
      id: "phone_number",
      label: "Phone Number",
      description: "Business contact number for verification",
      icon: Phone,
      isComplete: !!vendor.phone_number,
      field: "phone_number",
    },
    {
      id: "address",
      label: "Business Address",
      description: "Complete address of your business",
      icon: MapPin,
      isComplete: !!vendor.address,
      field: "address",
    },
    {
      id: "logo_url",
      label: "Business Logo",
      description: "Upload your business logo",
      icon: Image,
      isComplete: !!vendor.logo_url,
      field: "logo_url",
    },
    {
      id: "google_maps_link",
      label: "Google Maps Link",
      description: "Link to your Google Business Profile",
      icon: MapPin,
      isComplete: !!vendor.google_maps_link,
      field: "google_maps_link",
    },
    {
      id: "instagram_handle",
      label: "Instagram Profile",
      description: "Your business Instagram handle",
      icon: Instagram,
      isComplete: !!vendor.instagram_handle,
      field: "instagram_handle",
    },
    {
      id: "facebook_page",
      label: "Facebook Page",
      description: "Your business Facebook page link",
      icon: Facebook,
      isComplete: !!vendor.facebook_page,
      field: "facebook_page",
    },
  ];

  const completedCount = verificationItems.filter((item) => item.isComplete).length;
  const totalCount = verificationItems.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  const getStatusBadge = () => {
    switch (vendor.verification_status) {
      case "verified":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "under_review":
        return (
          <Badge className="bg-amber-500 text-white">
            <Clock className="h-3 w-3 mr-1" />
            Under Review
          </Badge>
        );
      case "documents_submitted":
        return (
          <Badge className="bg-blue-500 text-white">
            <FileText className="h-3 w-3 mr-1" />
            Documents Submitted
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500 text-white">
            <AlertCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Circle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-rose-50/50 via-white to-amber-50/30">
      <SEO
        title="Vendor Verification Status"
        description="Check your vendor verification status and complete required documents"
      />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mb-4">
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Verification Status</h1>
            <p className="text-muted-foreground">
              Complete your profile to get verified and start receiving bookings
            </p>
          </div>

          {/* Status Card */}
          <GlassCard className="p-6 mb-6 bg-white border-2 border-accent/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-lg">{vendor.business_name}</h2>
                <p className="text-sm text-muted-foreground capitalize">{vendor.category}</p>
              </div>
              {getStatusBadge()}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Profile Completion</span>
                <span className="font-semibold">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {completedCount} of {totalCount} items completed
              </p>
            </div>

            {vendor.verification_status === "verified" && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Your profile is verified!</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  You can now receive bookings from couples.
                </p>
              </div>
            )}

            {vendor.verification_status === "pending" && progressPercentage === 100 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">All documents submitted</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  Your profile is being reviewed. This usually takes 1-2 business days.
                </p>
              </div>
            )}
          </GlassCard>

          {/* Checklist */}
          <GlassCard className="p-6 bg-white border-2 border-accent/20">
            <h2 className="font-semibold text-lg mb-4">Verification Checklist</h2>
            <div className="space-y-3">
              {verificationItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-colors ${
                    item.isComplete
                      ? "bg-green-50/50 border-green-200"
                      : "bg-rose-50/50 border-accent/20"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.isComplete
                        ? "bg-green-100 text-green-600"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {item.isComplete ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <item.icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  {item.isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>

            {progressPercentage < 100 && (
              <Button
                className="w-full mt-6"
                onClick={() => navigate("/vendor/dashboard")}
              >
                Complete Your Profile
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </GlassCard>

          {/* Help Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need help with verification?{" "}
              <button
                className="text-primary font-medium hover:underline"
                onClick={() => navigate("/support")}
              >
                Contact Support
              </button>
            </p>
          </div>
        </div>
      </main>

      
    </div>
  );
}
