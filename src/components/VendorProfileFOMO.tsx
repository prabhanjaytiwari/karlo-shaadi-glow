import { useState, useEffect } from "react";
import { Eye, TrendingUp, Shield, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VendorProfileFOMOProps {
  vendorId: string;
  vendorName: string;
}

export function VendorProfileFOMO({ vendorId, vendorName }: VendorProfileFOMOProps) {
  const [totalBookings, setTotalBookings] = useState<number | null>(null);
  const [upcomingAvailability, setUpcomingAvailability] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchVendorStats = async () => {
      try {
        // Fetch real vendor data
        const { data: vendor } = await supabase
          .from("vendors")
          .select("total_bookings, verified")
          .eq("id", vendorId)
          .single();

        if (vendor) {
          setTotalBookings(vendor.total_bookings || 0);
          setIsVerified(vendor.verified || false);
        }

        // Fetch upcoming availability
        const today = new Date().toISOString().split('T')[0];
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 2);
        const nextMonthStr = nextMonth.toISOString().split('T')[0];

        const { count } = await supabase
          .from("vendor_availability")
          .select("id", { count: "exact", head: true })
          .eq("vendor_id", vendorId)
          .eq("is_available", true)
          .gte("date", today)
          .lte("date", nextMonthStr);

        setUpcomingAvailability(count || null);
      } catch (error) {
        console.error("Error fetching vendor stats:", error);
      }
    };

    fetchVendorStats();
  }, [vendorId]);

  // Only show signals we have real data for
  const signals = [];

  // Verified badge - always show if verified
  if (isVerified) {
    signals.push(
      <div key="verified\" className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
        <Shield className="h-4 w-4 text-green-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800">Verified Vendor</p>
          <p className="text-xs text-green-600">Identity & credentials verified</p>
        </div>
      </div>
    );
  }

  // Total bookings - only show if > 0
  if (totalBookings && totalBookings > 0) {
    signals.push(
      <div key="bookings" className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <TrendingUp className="h-4 w-4 text-blue-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-800">
            {totalBookings} completed booking{totalBookings !== 1 ? "s" : ""}
          </p>
          <p className="text-xs text-blue-600">Trusted by couples</p>
        </div>
      </div>
    );
  }

  // Availability - only show if dates are set
  if (upcomingAvailability !== null && upcomingAvailability > 0) {
    signals.push(
      <div key="availability" className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <Calendar className="h-4 w-4 text-amber-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800">
            {upcomingAvailability} dates available
          </p>
          <p className="text-xs text-amber-600">In the next 2 months</p>
        </div>
      </div>
    );
  }

  // If no real data, show a simple prompt
  if (signals.length === 0) {
    return (
      <div className="flex items-center gap-3 p-3 bg-muted/50 border border-border rounded-lg">
        <Eye className="h-4 w-4 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Interested in {vendorName}?</p>
          <p className="text-xs text-muted-foreground">Send an inquiry to check availability</p>
        </div>
      </div>
    );
  }

  return <div className="space-y-3">{signals}</div>;
}
