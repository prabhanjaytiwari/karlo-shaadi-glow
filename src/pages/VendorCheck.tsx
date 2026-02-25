import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Shield, ShieldAlert, ShieldCheck, Star, Clock, Share2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { BhindiFooter } from "@/components/BhindiFooter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface VendorResult {
  found: boolean;
  vendor?: {
    business_name: string;
    category: string;
    verified: boolean;
    average_rating: number;
    total_reviews: number;
    total_bookings: number;
    avg_response_time_hours: number | null;
    id: string;
  };
  trustScore: number;
}

function calculateTrustScore(vendor: any): number {
  let score = 20; // base for being registered
  if (vendor.verified) score += 30;
  if (vendor.total_reviews > 0) score += Math.min(vendor.total_reviews * 2, 20);
  if (vendor.average_rating >= 4) score += 15;
  if (vendor.total_bookings > 5) score += 10;
  if (vendor.avg_response_time_hours && vendor.avg_response_time_hours < 24) score += 5;
  return Math.min(score, 100);
}

export default function VendorCheck() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<VendorResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) { toast.error("Enter a vendor name or phone number"); return; }
    setIsSearching(true);
    setResult(null);
    setRequestSent(false);

    try {
      const { data: vendors } = await supabase
        .from("vendors")
        .select("id, business_name, category, verified, average_rating, total_reviews, total_bookings, avg_response_time_hours")
        .or(`business_name.ilike.%${query}%,phone_number.eq.${query},instagram_handle.ilike.%${query}%`)
        .limit(1);

      if (vendors && vendors.length > 0) {
        const v = vendors[0];
        const trustScore = calculateTrustScore(v);
        setResult({ found: true, vendor: v as any, trustScore });

        await supabase.from("vendor_check_requests").insert({
          search_query: query,
          search_type: query.match(/^\d+$/) ? "phone" : "name",
          vendor_found: true,
          vendor_id: v.id,
          trust_score: trustScore,
        });
      } else {
        setResult({ found: false, trustScore: 0 });
        await supabase.from("vendor_check_requests").insert({
          search_query: query,
          search_type: query.match(/^\d+$/) ? "phone" : "name",
          vendor_found: false,
          trust_score: 0,
        });
      }
    } catch (e) {
      console.error(e);
      toast.error("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const shareResult = () => {
    const text = result?.found
      ? `I checked "${result.vendor?.business_name}" on Karlo Shaadi — Trust Score: ${result.trustScore}/100 ${result.trustScore >= 70 ? '✅' : '⚠️'}\n\nCheck your vendor: ${window.location.origin}/vendor-check`
      : `I searched for "${query}" on Karlo Shaadi — NOT FOUND on the platform ⚠️\n\nCheck your vendor: ${window.location.origin}/vendor-check`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-amber-600";
    return "text-destructive";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-400";
    if (score >= 50) return "from-amber-500 to-yellow-400";
    return "from-red-500 to-orange-400";
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <SEO title="Ghost Vendor Detector — Check If Your Vendor Is Legit | Karlo Shaadi" description="Enter any vendor's name or phone number to check if they're verified and trustworthy. Free vendor background check." />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Shield className="h-4 w-4 text-accent" />
            <span className="text-accent text-sm font-semibold">Vendor Checker</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            Is Your Vendor<br />
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Actually Legit?</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter any vendor's name, phone number, or Instagram handle. We'll tell you if they're verified and trustworthy.
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-2 max-w-lg mx-auto mb-8">
          <Input
            placeholder="Vendor name, phone, or @instagram"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="h-12 text-base"
          />
          <Button onClick={handleSearch} disabled={isSearching} size="lg" className="rounded-xl h-12 px-6">
            {isSearching ? <span className="animate-spin">🔍</span> : <Search className="h-5 w-5" />}
          </Button>
        </div>

        {/* Result */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {result.found ? (
              <div className="space-y-6">
                {/* Trust Score Card */}
                <div className="p-6 sm:p-8 rounded-2xl bg-card border-2 border-border text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                      <circle cx="100" cy="100" r="85" fill="none" stroke="hsl(var(--muted))" strokeWidth="14" />
                      <motion.circle
                        cx="100" cy="100" r="85" fill="none"
                        stroke={result.trustScore >= 80 ? "#16a34a" : result.trustScore >= 50 ? "#d97706" : "#dc2626"}
                        strokeWidth="14" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 85}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 85 * (1 - result.trustScore / 100) }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`font-display text-3xl font-bold ${getScoreColor(result.trustScore)}`}>{result.trustScore}</span>
                      <span className="text-xs text-muted-foreground">/100</span>
                    </div>
                  </div>

                  <h2 className="font-display text-xl font-bold mb-1">{result.vendor?.business_name}</h2>
                  <p className="text-muted-foreground text-sm capitalize mb-4">{result.vendor?.category?.replace(/_/g, " ")}</p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-muted/50">
                      {result.vendor?.verified ? <ShieldCheck className="h-5 w-5 text-green-600 mx-auto mb-1" /> : <ShieldAlert className="h-5 w-5 text-amber-600 mx-auto mb-1" />}
                      <p className="text-xs font-medium">{result.vendor?.verified ? "Verified" : "Unverified"}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50">
                      <Star className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                      <p className="text-xs font-medium">{result.vendor?.average_rating || "N/A"} Rating</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50">
                      <p className="text-lg font-bold">{result.vendor?.total_reviews || 0}</p>
                      <p className="text-xs text-muted-foreground">Reviews</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50">
                      <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                      <p className="text-xs font-medium">{result.vendor?.avg_response_time_hours ? `${Math.round(result.vendor.avg_response_time_hours)}h` : "N/A"}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to={`/vendors/${result.vendor?.id}`}>
                      <Button className="rounded-full">View Full Profile</Button>
                    </Link>
                    <Button onClick={shareResult} variant="outline" className="rounded-full">
                      <Share2 className="mr-2 h-4 w-4" /> Share Result
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Not Found */
              <div className="p-6 sm:p-8 rounded-2xl bg-destructive/5 border-2 border-destructive/20 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h2 className="font-display text-xl font-bold mb-2">Vendor Not Found</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  "{query}" is not registered on Karlo Shaadi. This doesn't mean they're bad, but they haven't been verified by us.
                </p>

                {!requestSent ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Want us to verify this vendor?</p>
                    <Button
                      onClick={() => { setRequestSent(true); toast.success("We'll look into this vendor!"); }}
                      className="rounded-full"
                    >
                      Request Verification
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                    <p className="text-green-700 font-medium">Request submitted! We'll reach out to this vendor.</p>
                  </div>
                )}

                <div className="mt-6">
                  <Button onClick={shareResult} variant="outline" className="rounded-full">
                    <Share2 className="mr-2 h-4 w-4" /> Share This Check
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Trust Note */}
        <div className="mt-12 text-center text-xs text-muted-foreground max-w-md mx-auto">
          <p>Trust scores are based on verification status, reviews, response times, and booking history on our platform.</p>
        </div>
      </div>

      <BhindiFooter />
    </div>
  );
}
