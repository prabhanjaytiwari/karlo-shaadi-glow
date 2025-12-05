import { useState, useEffect } from "react";
import { BhindiFooter } from "@/components/BhindiFooter";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewsList } from "@/components/ReviewsList";
import { BookingDialog } from "@/components/BookingDialog";
import { MessagingDialog } from "@/components/MessagingDialog";
import { FavoritesButton } from "@/components/FavoritesButton";
import { 
  MapPin, 
  Clock, 
  Star, 
  Shield, 
  Award,
  CheckCircle2,
  Loader2,
  MessageCircle
} from "lucide-react";

const VendorProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const [vendor, setVendor] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userBooking, setUserBooking] = useState<any>(null);

  useEffect(() => {
    loadVendorData();
    checkUserAuth();
  }, [id]);

  const checkUserAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user && id) {
      // Check if user has a completed booking with this vendor
      const { data: booking } = await supabase
        .from("bookings")
        .select("*")
        .eq("couple_id", user.id)
        .eq("vendor_id", id)
        .eq("status", "completed")
        .single();
      
      setUserBooking(booking);
    }
  };

  const loadVendorData = async () => {
    try {
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select(`
          *,
          cities (name, state)
        `)
        .eq("id", id)
        .single();

      if (vendorError) throw vendorError;
      setVendor(vendorData);

      const { data: servicesData } = await supabase
        .from("vendor_services")
        .select("*")
        .eq("vendor_id", id)
        .eq("is_active", true);
      
      setServices(servicesData || []);

      const { data: portfolioData } = await supabase
        .from("vendor_portfolio")
        .select("*")
        .eq("vendor_id", id)
        .order("display_order", { ascending: true });
      
      setPortfolio(portfolioData || []);

      // Track vendor profile view
      if (id) {
        trackEvent({
          event_type: 'vendor_profile_viewed',
          vendor_id: id,
          metadata: {
            business_name: vendorData?.business_name,
            category: vendorData?.category,
          },
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Vendor not found</p>
      </div>
    );
  }

  const badges = [];
  if (vendor.verified) badges.push("Verified");
  if (vendor.average_rating >= 4.5) badges.push("Top Rated");
  if (vendor.years_experience >= 5) badges.push("Experienced");

  const mockData = {
    whyMatched: [
      { factor: "Verified Vendor", score: vendor.verified ? 100 : 50, reason: vendor.verified ? "Background verified by Karlo Shaadi" : "Verification pending" },
      { factor: "Experience", score: Math.min(100, (vendor.years_experience / 10) * 100), reason: `${vendor.years_experience}+ years in business` },
      { factor: "Rating", score: (vendor.average_rating / 5) * 100, reason: `${vendor.average_rating} stars from ${vendor.total_reviews} reviews` },
      { factor: "Success Rate", score: 95, reason: "High completion rate with couples" }
    ]
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Gallery Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <img 
          src={portfolio[0]?.image_url || "/placeholder.svg"} 
          alt={vendor.business_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </section>

      {/* Sticky Action Bar (Mobile) */}
      <div className="lg:hidden sticky top-16 z-40 glass border-b border-border/50 p-4 animate-fade-in">
        <div className="flex gap-3">
          <BookingDialog vendorId={id!}>
            <Button variant="hero" className="flex-1">
              Check Availability
            </Button>
          </BookingDialog>
          <FavoritesButton vendorId={id!} />
          <MessagingDialog vendorId={id!} vendorName={vendor.business_name}>
            <Button variant="outline" size="icon">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </MessagingDialog>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12 -mt-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <GlassCard className="p-6 md:p-8 animate-fade-up">
                <div className="flex flex-wrap gap-2 mb-4">
                  {badges.map((badge, i) => (
                    <span 
                      key={i}
                      className="glass-subtle px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                    >
                      {badge === "Verified" && <Shield className="h-3 w-3" />}
                      {badge}
                    </span>
                  ))}
                </div>

                <h1 className="font-display font-bold text-4xl mb-2">{vendor.business_name}</h1>
                <p className="text-muted-foreground text-lg mb-4">{vendor.category}</p>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span>{vendor.cities?.name || "India"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-accent fill-accent" />
                    <span className="font-semibold">{vendor.average_rating || 0}</span>
                    <span className="text-muted-foreground">({vendor.total_reviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent" />
                    <span>Responds in 2 hours</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
                  <div className="text-center">
                    <p className="font-display font-bold text-2xl text-accent">{vendor.years_experience}+</p>
                    <p className="text-sm text-muted-foreground">Years Active</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-2xl text-accent">{vendor.total_bookings || 0}+</p>
                    <p className="text-sm text-muted-foreground">Weddings</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-2xl text-accent">{vendor.team_size || 1}</p>
                    <p className="text-sm text-muted-foreground">Team Size</p>
                  </div>
                </div>
              </GlassCard>

              {/* About */}
              <GlassCard className="p-6 md:p-8 animate-fade-up">
                <h2 className="font-display font-bold text-2xl mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {vendor.description || `Professional ${vendor.category} services for your special day.`}
                </p>
                {vendor.instagram_handle && (
                  <p className="mt-4 text-sm text-accent">
                    📷 Instagram: @{vendor.instagram_handle}
                  </p>
                )}
                {vendor.website_url && (
                  <p className="mt-2 text-sm text-accent">
                    🌐 Website: {vendor.website_url}
                  </p>
                )}
              </GlassCard>

              {/* Why Matched */}
              <GlassCard className="p-6 md:p-8 animate-fade-up">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="h-6 w-6 text-accent" />
                  <h2 className="font-display font-bold text-2xl">Why This Vendor Stands Out</h2>
                </div>
                
                <div className="space-y-4">
                  {mockData.whyMatched.map((match, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{match.factor}</span>
                        <span className="text-accent font-bold">{Math.round(match.score)}%</span>
                      </div>
                      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-accent to-secondary rounded-full transition-all duration-500"
                          style={{ width: `${match.score}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">{match.reason}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Services & Pricing */}
              {services.length > 0 && (
                <GlassCard className="p-6 md:p-8 animate-fade-up">
                  <h2 className="font-display font-bold text-2xl mb-6">Services & Pricing</h2>
                  
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div 
                        key={service.id}
                        className="glass-subtle p-6 rounded-2xl"
                      >
                        <h3 className="font-display font-bold text-xl mb-2">{service.service_name}</h3>
                        <p className="text-muted-foreground mb-4">{service.description}</p>
                        <div className="flex items-center gap-2">
                          {service.base_price && (
                            <p className="font-display font-bold text-2xl text-accent">
                              ₹{Number(service.base_price).toLocaleString()}
                            </p>
                          )}
                          {service.price_range_min && service.price_range_max && (
                            <p className="font-display font-bold text-2xl text-accent">
                              ₹{Number(service.price_range_min).toLocaleString()} - ₹{Number(service.price_range_max).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground mt-6 text-center">
                    💳 Milestone payments available • 🔒 Escrow protection • 📝 E-contract included
                  </p>
                </GlassCard>
              )}

              {/* Reviews */}
              <GlassCard className="p-6 md:p-8 animate-fade-up">
                <h2 className="font-display font-bold text-2xl mb-6">
                  Reviews & Ratings
                </h2>
                
                {/* Review Form - Only show if user has completed booking */}
                {user && userBooking && (
                  <div className="mb-8 p-6 glass-subtle rounded-xl">
                    <h3 className="font-semibold mb-4">Share Your Experience</h3>
                    <ReviewForm 
                      vendorId={id!} 
                      bookingId={userBooking.id}
                      onSuccess={loadVendorData}
                    />
                  </div>
                )}
                
                {/* Reviews List */}
                <ReviewsList vendorId={id!} />
              </GlassCard>
            </div>

            {/* Right Column - Actions (Desktop) */}
            <div className="hidden lg:block">
              <GlassCard className="p-6 sticky top-24 space-y-4 animate-fade-in">
                <BookingDialog vendorId={id!}>
                  <Button variant="hero" size="lg" className="w-full">
                    Check Availability
                  </Button>
                </BookingDialog>
                
                <MessagingDialog vendorId={id!} vendorName={vendor.business_name}>
                  <Button variant="secondary" size="lg" className="w-full">
                    Chat with Vendor
                  </Button>
                </MessagingDialog>

                <div className="flex gap-2">
                  <FavoritesButton vendorId={id!} />
                  <Button variant="outline" size="lg" className="flex-1">
                    View Contract Preview
                  </Button>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground text-center">
                    ✓ Response within 2 hours<br />
                    ✓ Milestone payment protection<br />
                    ✓ SLA guarantee
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      <BhindiFooter />
    </div>
  );
};

export default VendorProfile;
