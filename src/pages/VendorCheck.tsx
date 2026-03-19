import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, ShieldAlert, ShieldCheck, Star, Clock, Share2, AlertTriangle, Phone, Instagram, CheckCircle, XCircle, ExternalLink, Download } from "lucide-react";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";

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
    phone_number: string | null;
    instagram_handle: string | null;
  };
  trustScore: number;
}

function calculateTrustScore(vendor: any): number {
  let score = 20;
  if (vendor.verified) score += 30;
  if (vendor.total_reviews > 0) score += Math.min(vendor.total_reviews * 2, 20);
  if (vendor.average_rating >= 4) score += 15;
  if (vendor.total_bookings > 5) score += 10;
  if (vendor.avg_response_time_hours && vendor.avg_response_time_hours < 24) score += 5;
  return Math.min(score, 100);
}

function getTrustLabel(score: number) {
  if (score >= 80) return { label: "Highly Trusted", emoji: "🛡️", color: "text-green-600" };
  if (score >= 60) return { label: "Moderately Trusted", emoji: "✅", color: "text-amber-600" };
  if (score >= 30) return { label: "Needs Verification", emoji: "⚠️", color: "text-orange-600" };
  return { label: "Not Verified", emoji: "🚩", color: "text-destructive" };
}

function getBreakdown(vendor: any) {
  return [
    { label: "Registered on Platform", passed: true, points: 20 },
    { label: "Identity Verified", passed: vendor.verified, points: 30 },
    { label: "Has Customer Reviews", passed: vendor.total_reviews > 0, points: Math.min(vendor.total_reviews * 2, 20) },
    { label: "Rating Above 4.0", passed: vendor.average_rating >= 4, points: 15 },
    { label: "5+ Completed Bookings", passed: vendor.total_bookings > 5, points: 10 },
    { label: "Responds Within 24h", passed: vendor.avg_response_time_hours && vendor.avg_response_time_hours < 24, points: 5 },
  ];
}

export default function VendorCheck() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<VendorResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requesterPhone, setRequesterPhone] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSearch = async () => {
    if (!query.trim()) { toast.error("Enter a vendor name or phone number"); return; }
    setIsSearching(true);
    setResult(null);
    setRequestSent(false);

    try {
      const { data: vendors } = await supabase
        .from("vendors")
        .select("id, business_name, category, verified, average_rating, total_reviews, total_bookings, avg_response_time_hours, phone_number, instagram_handle")
        .or(`business_name.ilike.%${query}%,phone_number.eq.${query},instagram_handle.ilike.%${query}%`)
        .limit(1);

      if (vendors && vendors.length > 0) {
        const v = vendors[0];
        const trustScore = calculateTrustScore(v);
        setResult({ found: true, vendor: v as any, trustScore });
        await supabase.from("vendor_check_requests").insert({
          search_query: query, search_type: query.match(/^\d+$/) ? "phone" : "name",
          vendor_found: true, vendor_id: v.id, trust_score: trustScore,
        });
      } else {
        setResult({ found: false, trustScore: 0 });
        await supabase.from("vendor_check_requests").insert({
          search_query: query, search_type: query.match(/^\d+$/) ? "phone" : "name",
          vendor_found: false, trust_score: 0,
        });
      }
    } catch (e) {
      toast.error("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const generateShareCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result) return null;

    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    if (result.found && result.trustScore >= 70) {
      grad.addColorStop(0, "#064e3b");
      grad.addColorStop(1, "#065f46");
    } else if (result.found) {
      grad.addColorStop(0, "#78350f");
      grad.addColorStop(1, "#92400e");
    } else {
      grad.addColorStop(0, "#7f1d1d");
      grad.addColorStop(1, "#991b1b");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    // Decorative circles
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(900, 150, 200, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(180, 900, 150, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // Header
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(80, 80, 920, 90);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 28px Inter, sans-serif";
    ctx.fillText("🔍 VENDOR TRUST CHECK", 120, 138);

    if (result.found) {
      // Score circle
      ctx.beginPath();
      ctx.arc(540, 420, 160, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(540, 420, 140, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * result.trustScore / 100));
      ctx.strokeStyle = result.trustScore >= 70 ? "#34d399" : result.trustScore >= 50 ? "#fbbf24" : "#ef4444";
      ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.stroke();

      ctx.fillStyle = "#fff";
      ctx.font = "bold 80px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${result.trustScore}`, 540, 440);
      ctx.font = "24px Inter, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillText("/ 100 TRUST SCORE", 540, 480);

      // Vendor name
      ctx.font = "bold 42px Inter, sans-serif";
      ctx.fillStyle = "#fff";
      ctx.fillText(result.vendor?.business_name || "", 540, 640);
      ctx.font = "24px Inter, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText((result.vendor?.category || "").replace(/_/g, " ").toUpperCase(), 540, 685);

      const trust = getTrustLabel(result.trustScore);
      ctx.font = "bold 32px Inter, sans-serif";
      ctx.fillStyle = result.trustScore >= 70 ? "#34d399" : "#fbbf24";
      ctx.fillText(`${trust.emoji} ${trust.label}`, 540, 780);
    } else {
      ctx.fillStyle = "#fff";
      ctx.font = "bold 52px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("⚠️ NOT FOUND", 540, 400);
      ctx.font = "28px Inter, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText(`"${query}"`, 540, 460);
      ctx.fillText("is not registered on Karlo Shaadi", 540, 510);
    }

    // Footer
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "22px Inter, sans-serif";
    ctx.fillText("Check your vendor → karloshaadi.com/vendor-check", 540, 1010);

    return canvas.toDataURL("image/jpeg", 0.92);
  }, [result, query]);

  const shareResult = () => {
    const text = result?.found
      ? `I checked "${result.vendor?.business_name}" on Karlo Shaadi — Trust Score: ${result.trustScore}/100 ${result.trustScore >= 70 ? '✅' : '⚠️'}\n\nCheck your vendor: ${window.location.origin}/vendor-check`
      : `I searched for "${query}" on Karlo Shaadi — NOT FOUND on the platform ⚠️\n\nCheck your vendor: ${window.location.origin}/vendor-check`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const downloadCard = () => {
    const dataUrl = generateShareCard();
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `vendor-check-${query.replace(/\s+/g, "-")}.jpg`;
    a.click();
    toast.success("Trust report downloaded!");
  };

  const handleRequestVerification = async () => {
    setRequestSent(true);
    toast.success("We'll look into this vendor and reach out to verify them!");
    // Update the check request with phone if provided
    if (requesterPhone.trim()) {
      await supabase.from("vendor_check_requests").update({ requester_phone: requesterPhone }).eq("search_query", query).order("created_at", { ascending: false }).limit(1);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <MobilePageHeader title="Vendor Check" />
      <SEO title="Ghost Vendor Detector — Check If Your Vendor Is Legit | Karlo Shaadi" description="Enter any vendor's name or phone number to check if they're verified and trustworthy. Free vendor background check." />
      <canvas ref={canvasRef} className="hidden" width={1080} height={1080} />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Shield className="h-4 w-4 text-accent" />
            <span className="text-accent text-sm font-semibold">Vendor Trust Checker</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            Is Your Vendor<br />
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Actually Legit?</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter any vendor's name, phone number, or Instagram handle. We'll generate a trust report instantly.
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
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {result.found && result.vendor ? (
                <div className="space-y-4">
                  {/* Trust Score Card */}
                  <div className="p-6 sm:p-8 rounded-2xl bg-card border-2 border-border text-center">
                    {/* Animated Score Ring */}
                    <div className="relative w-36 h-36 mx-auto mb-4">
                      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                        <circle cx="100" cy="100" r="85" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
                        <motion.circle
                          cx="100" cy="100" r="85" fill="none"
                          stroke={result.trustScore >= 80 ? "#16a34a" : result.trustScore >= 50 ? "#d97706" : "#dc2626"}
                          strokeWidth="12" strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 85}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 85 * (1 - result.trustScore / 100) }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                          className={`font-display text-4xl font-bold ${getTrustLabel(result.trustScore).color}`}
                        >
                          {result.trustScore}
                        </motion.span>
                        <span className="text-xs text-muted-foreground">/100</span>
                      </div>
                    </div>

                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 ${
                      result.trustScore >= 70 ? 'bg-green-100 text-green-700' : result.trustScore >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <span className="font-semibold text-sm">{getTrustLabel(result.trustScore).emoji} {getTrustLabel(result.trustScore).label}</span>
                    </div>

                    <h2 className="font-display text-xl font-bold mb-1">{result.vendor.business_name}</h2>
                    <p className="text-muted-foreground text-sm capitalize mb-4">{result.vendor.category?.replace(/_/g, " ")}</p>

                    {/* Trust Breakdown */}
                    <div className="text-left space-y-2 mt-6 mb-6">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3">TRUST BREAKDOWN</h3>
                      {getBreakdown(result.vendor).map((item, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            {item.passed ? (
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${item.passed ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {item.label}
                            </span>
                          </div>
                          <span className={`text-xs font-medium ${item.passed ? 'text-green-600' : 'text-muted-foreground/40'}`}>
                            +{item.passed ? item.points : 0}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-6">
                      <div className="p-3 rounded-xl bg-muted/50">
                        {result.vendor.verified ? <ShieldCheck className="h-5 w-5 text-green-600 mx-auto mb-1" /> : <ShieldAlert className="h-5 w-5 text-amber-600 mx-auto mb-1" />}
                        <p className="text-xs font-medium">{result.vendor.verified ? "Verified" : "Unverified"}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/50">
                        <Star className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                        <p className="text-xs font-medium">{result.vendor.average_rating || "N/A"} Rating</p>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/50">
                        <p className="text-lg font-bold">{result.vendor.total_reviews || 0}</p>
                        <p className="text-xs text-muted-foreground">Reviews</p>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/50">
                        <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                        <p className="text-xs font-medium">{result.vendor.avg_response_time_hours ? `${Math.round(result.vendor.avg_response_time_hours)}h` : "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link to={`/vendors/${result.vendor.id}`}>
                        <Button className="rounded-full w-full sm:w-auto">
                          <ExternalLink className="mr-2 h-4 w-4" /> View Full Profile
                        </Button>
                      </Link>
                      <Button onClick={downloadCard} variant="outline" className="rounded-full">
                        <Download className="mr-2 h-4 w-4" /> Download Report
                      </Button>
                      <Button onClick={shareResult} variant="outline" className="rounded-full">
                        <Share2 className="mr-2 h-4 w-4" /> Share on WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Not Found — The Growth Engine */
                <div className="space-y-4">
                  <div className="p-6 sm:p-8 rounded-2xl bg-destructive/5 border-2 border-destructive/20 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                      <AlertTriangle className="h-14 w-14 text-destructive mx-auto mb-4" />
                    </motion.div>
                    <h2 className="font-display text-xl font-bold mb-2">Vendor Not Found on Platform</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      "<strong>{query}</strong>" is not registered or verified on Karlo Shaadi. This doesn't necessarily mean they're bad — but they haven't been through our verification process.
                    </p>

                    {/* Risk indicators */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-left max-w-lg mx-auto">
                      {[
                        { icon: Shield, label: "No identity verification" },
                        { icon: Star, label: "No verified reviews" },
                        { icon: Phone, label: "No response tracking" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-destructive/5 border border-destructive/10">
                          <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{item.label}</span>
                        </div>
                      ))}
                    </div>

                    {!requestSent ? (
                      <div className="space-y-4 max-w-sm mx-auto">
                        <p className="text-sm font-medium">Want us to verify this vendor?</p>
                        <Input
                          placeholder="Your phone (optional, for updates)"
                          value={requesterPhone}
                          onChange={(e) => setRequesterPhone(e.target.value)}
                          className="text-center"
                        />
                        <Button onClick={handleRequestVerification} className="rounded-full w-full">
                          Request Verification Check
                        </Button>
                        <p className="text-xs text-muted-foreground">We'll reach out to this vendor and invite them to get verified</p>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-xl bg-green-50 border border-green-200">
                        <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <p className="text-green-700 font-medium">Request submitted!</p>
                        <p className="text-green-600 text-sm mt-1">We'll reach out to this vendor and verify their credentials.</p>
                      </motion.div>
                    )}

                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                      <Button onClick={downloadCard} variant="outline" className="rounded-full">
                        <Download className="mr-2 h-4 w-4" /> Download Report
                      </Button>
                      <Button onClick={shareResult} variant="outline" className="rounded-full">
                        <Share2 className="mr-2 h-4 w-4" /> Share This Check
                      </Button>
                    </div>
                  </div>

                  {/* Vendor CTA */}
                  <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20 text-center">
                    <p className="font-semibold mb-2">Are you this vendor?</p>
                    <p className="text-sm text-muted-foreground mb-4">Get verified on Karlo Shaadi to improve your trust score and attract more clients.</p>
                    <Link to="/vendor-profile-setup">
                      <Button variant="default" className="rounded-full">Get Verified — It's Free</Button>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* How Trust Score Works */}
        {!result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12 max-w-lg mx-auto">
            <h3 className="font-display font-semibold text-lg text-center mb-4">How Trust Score Works</h3>
            <div className="space-y-3">
              {[
                { label: "Platform Registration", points: "+20", desc: "Vendor is listed on Karlo Shaadi" },
                { label: "Identity Verification", points: "+30", desc: "Business docs verified by our team" },
                { label: "Customer Reviews", points: "+20", desc: "Real reviews from verified bookings" },
                { label: "High Rating (4+)", points: "+15", desc: "Consistently rated above 4 stars" },
                { label: "Booking Track Record", points: "+10", desc: "5+ completed bookings" },
                { label: "Fast Response", points: "+5", desc: "Responds within 24 hours" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <span className="text-accent font-bold text-sm">{item.points}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-12 text-center text-xs text-muted-foreground max-w-md mx-auto">
          <p>Trust scores are based on verification status, reviews, response times, and booking history on our platform.</p>
        </div>
      </div>

      
    </div>
  );
}
