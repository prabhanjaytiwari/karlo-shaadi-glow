import { useState, useEffect } from "react";
import { Eye, Users, Clock, TrendingUp } from "lucide-react";

interface VendorProfileFOMOProps {
  vendorId: string;
  vendorName: string;
}

export function VendorProfileFOMO({ vendorId, vendorName }: VendorProfileFOMOProps) {
  const [viewCount, setViewCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);
  const [lastBookedAgo, setLastBookedAgo] = useState("");

  useEffect(() => {
    // Generate realistic-looking random numbers based on vendorId hash
    const hash = vendorId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseViews = (hash % 20) + 5;
    const baseInquiries = (hash % 8) + 2;
    
    setViewCount(baseViews);
    setInquiryCount(baseInquiries);
    
    // Generate random "booked X ago" time
    const times = ["2 hours ago", "5 hours ago", "yesterday", "2 days ago"];
    setLastBookedAgo(times[hash % times.length]);

    // Simulate live updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setViewCount((prev) => prev + 1);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [vendorId]);

  return (
    <div className="space-y-3">
      {/* Viewing Now */}
      <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="relative">
          <Eye className="h-4 w-4 text-amber-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800">
            {viewCount} people viewing now
          </p>
          <p className="text-xs text-amber-600">High demand vendor</p>
        </div>
      </div>

      {/* Inquiries Today */}
      <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <Users className="h-4 w-4 text-blue-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-800">
            {inquiryCount} inquiries today
          </p>
          <p className="text-xs text-blue-600">Book before dates fill up</p>
        </div>
      </div>

      {/* Last Booked */}
      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
        <Clock className="h-4 w-4 text-green-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800">
            Last booked {lastBookedAgo}
          </p>
          <p className="text-xs text-green-600">Trusted by couples</p>
        </div>
      </div>

      {/* Trending */}
      <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <TrendingUp className="h-4 w-4 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium text-primary">
            Trending in your area
          </p>
          <p className="text-xs text-muted-foreground">Top 10% most viewed</p>
        </div>
      </div>
    </div>
  );
}
