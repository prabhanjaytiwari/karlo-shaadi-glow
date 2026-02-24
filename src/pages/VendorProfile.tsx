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
import { VendorProfileTabs } from "@/components/vendor/VendorProfileTabs";
import { VendorAvailabilityWidget } from "@/components/vendor/VendorAvailabilityWidget";
import { VendorQuickInfo } from "@/components/vendor/VendorQuickInfo";
import { VendorFAQ } from "@/components/vendor/VendorFAQ";
import { DealBadge } from "@/components/vendor/DealBadge";
import { VendorProfileFOMO } from "@/components/VendorProfileFOMO";
import { VendorShareButton } from "@/components/vendor/VendorShareButton";
import { WhatsAppChatButton } from "@/components/vendor/WhatsAppChatButton";
import { QuickInquiryDialog } from "@/components/QuickInquiryDialog";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Clock, 
  Star, 
  Shield, 
  Award,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Navigation,
  User
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
  const [selectedBookingDate, setSelectedBookingDate] = useState<Date | undefined>();

  useEffect(() => {
    loadVendorData();
    checkUserAuth();
  }, [id]);

  const checkUserAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user && id) {
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
  if (vendor.gender_preference === 'female') badges.push("Female Artist");
  if (vendor.gender_preference === 'male') badges.push("Male Artist");

  const mockData = {
    whyMatched: [
      { factor: "Verified Vendor", score: vendor.verified ? 100 : 50, reason: vendor.verified ? "Background verified by Karlo Shaadi" : "Verification pending" },
      { factor: "Experience", score: Math.min(100, (vendor.years_experience / 10) * 100), reason: `${vendor.years_experience}+ years in business` },
      { factor: "Rating", score: (vendor.average_rating / 5) * 100, reason: `${vendor.average_rating} stars from ${vendor.total_reviews} reviews` },
      { factor: "Success Rate", score: 95, reason: "High completion rate with couples" }
    ]
  };

  // Tab content components
  const DetailsContent = () => (
    <>
      {/* About */}
      <GlassCard className="p-6 bg-white border-2 border-accent/20">
        <h2 className="font-display font-bold text-xl mb-3">About</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-full mb-4" />
        <p className="text-muted-foreground leading-relaxed">
          {vendor.description || `Professional ${vendor.category} services for your special day.`}
        </p>
        {vendor.instagram_handle && (
          <p className="mt-4 text-sm text-primary font-medium">
            Instagram: @{vendor.instagram_handle}
          </p>
        )}
        {vendor.website_url && (
          <p className="mt-2 text-sm text-primary font-medium">
            Website: {vendor.website_url}
          </p>
        )}
      </GlassCard>

      {/* Quick Info */}
      <GlassCard className="p-6 bg-white border-2 border-accent/20">
        <h2 className="font-display font-bold text-xl mb-3">Quick Info</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-full mb-4" />
        <VendorQuickInfo vendor={vendor} />
      </GlassCard>

      {/* Why Matched */}
      <GlassCard className="p-6 bg-white border-2 border-accent/20">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-accent" />
          <h2 className="font-display font-bold text-xl">Why This Vendor Stands Out</h2>
        </div>
        <div className="w-12 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-full mb-4" />
        
        <div className="space-y-4">
          {mockData.whyMatched.map((match, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{match.factor}</span>
                <span className="text-accent font-bold text-sm">{Math.round(match.score)}%</span>
              </div>
              <div className="h-2 bg-accent/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
                  style={{ width: `${match.score}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{match.reason}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* FAQ */}
      <GlassCard className="p-6 bg-white border-2 border-accent/20">
        <VendorFAQ vendorName={vendor.business_name} category={vendor.category} />
      </GlassCard>
    </>
  );

  const PricingContent = () => (
    <>
      {services.length > 0 ? (
        <GlassCard className="p-6 bg-white border-2 border-accent/20">
          <h2 className="font-display font-bold text-xl mb-3">Services & Pricing</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-full mb-4" />
          
          <div className="space-y-4">
            {services.map((service) => (
              <div 
                key={service.id}
                className="bg-rose-50/50 border-2 border-accent/20 p-5 rounded-xl"
              >
                <h3 className="font-display font-bold text-lg mb-2">{service.service_name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{service.description}</p>
                <div className="flex items-center gap-2">
                  {service.base_price && (
                    <p className="font-display font-bold text-xl text-accent">
                      ₹{Number(service.base_price).toLocaleString()}
                    </p>
                  )}
                  {service.price_range_min && service.price_range_max && (
                    <p className="font-display font-bold text-xl text-accent">
                      ₹{Number(service.price_range_min).toLocaleString()} - ₹{Number(service.price_range_max).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            Milestone payments available • Escrow protection • E-contract included
          </p>
        </GlassCard>
      ) : (
        <GlassCard className="p-6 bg-white border-2 border-accent/20 text-center">
          <p className="text-muted-foreground">Contact vendor for pricing details</p>
        </GlassCard>
      )}

      {/* Deal Badge */}
      <DealBadge className="w-full" />
    </>
  );

  const LocationContent = () => (
    <>
      <GlassCard className="p-6 bg-white border-2 border-accent/20">
        <div className="flex items-center gap-2 mb-4">
          <Navigation className="h-5 w-5 text-accent" />
          <h2 className="font-display font-bold text-xl">Location</h2>
        </div>
        <div className="w-12 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-full mb-4" />

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
            <MapPin className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <p className="font-medium">{vendor.cities?.name || "India"}</p>
              <p className="text-sm text-muted-foreground">{vendor.cities?.state || "Pan India Services"}</p>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center border border-border/50">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Map view coming soon</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <p className="text-sm">
              <span className="font-medium">Service Area:</span>{" "}
              <span className="text-muted-foreground">
                {vendor.cities?.name ? `${vendor.cities.name} and surrounding areas` : "Available across India"}
              </span>
            </p>
          </div>
        </div>
      </GlassCard>
    </>
  );

  const ReviewsContent = () => (
    <>
      <GlassCard className="p-6 bg-white border-2 border-accent/20">
        <h2 className="font-display font-bold text-xl mb-3">Reviews & Ratings</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-full mb-4" />
        
        {/* Review Form - Only show if user has completed booking */}
        {user && userBooking && (
          <div className="mb-6 p-4 bg-rose-50/50 border border-accent/20 rounded-xl">
            <h3 className="font-semibold mb-3 text-sm">Share Your Experience</h3>
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
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 via-white to-amber-50/30">

      {/* Gallery Section */}
      <section className="relative h-[35vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
        <img 
          src={portfolio[0]?.image_url || "/placeholder.svg"} 
          alt={vendor.business_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
      </section>

      {/* Sticky Action Bar (Mobile) */}
      <div className="lg:hidden sticky top-14 z-40 bg-white/95 backdrop-blur-xl border-b border-accent/20 p-3">
        <div className="flex gap-2">
          <QuickInquiryDialog vendorId={id!} vendorName={vendor.business_name}>
            <Button className="flex-1 h-10 text-sm">
              Get Quote
            </Button>
          </QuickInquiryDialog>
          <FavoritesButton vendorId={id!} />
          {vendor.whatsapp_number && (
            <WhatsAppChatButton 
              whatsappNumber={vendor.whatsapp_number} 
              vendorName={vendor.business_name}
              variant="icon"
            />
          )}
          <VendorShareButton vendorId={id!} vendorName={vendor.business_name} variant="icon" />
        </div>
      </div>

      {/* Main Content */}
      <section className="py-4 sm:py-8 md:py-12 -mt-12 sm:-mt-16 md:-mt-20 relative z-10">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <GlassCard className="p-4 sm:p-5 md:p-6 animate-fade-up bg-white border border-accent/20">
                <div className="flex flex-wrap gap-2 mb-3">
                  {badges.map((badge, i) => (
                    <span 
                      key={i}
                      className="bg-accent/15 border border-accent/30 px-2.5 py-1 rounded-full text-xs font-semibold text-accent flex items-center gap-1"
                    >
                      {badge === "Verified" && <Shield className="h-3 w-3" />}
                      {badge}
                    </span>
                  ))}
                </div>

                <h1 className="font-display font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-1">{vendor.business_name}</h1>
                <p className="text-muted-foreground text-sm sm:text-base mb-3 sm:mb-4 capitalize">{vendor.category}</p>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
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

                <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-accent/20">
                  <div className="text-center">
                    <p className="font-display font-bold text-lg sm:text-xl text-accent">{vendor.years_experience}+</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Years Active</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-lg sm:text-xl text-accent">{vendor.total_bookings || 0}+</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Weddings</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-lg sm:text-xl text-accent">{vendor.team_size || 1}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Team Size</p>
                  </div>
                </div>
              </GlassCard>

              {/* Deal Badge - Mobile */}
              <div className="lg:hidden">
                <DealBadge className="w-full" />
              </div>

              {/* Tabbed Content */}
              <GlassCard className="p-3 sm:p-5 md:p-6 animate-fade-up bg-white border border-accent/20">
                <VendorProfileTabs 
                  children={{
                    details: <DetailsContent />,
                    pricing: <PricingContent />,
                    location: <LocationContent />,
                    reviews: <ReviewsContent />,
                  }}
                />
              </GlassCard>
            </div>

            {/* Right Column - Actions (Desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <GlassCard className="p-5 space-y-4 animate-fade-in bg-white border-2 border-accent/20">
                  {/* Availability Calendar */}
                  <VendorAvailabilityWidget 
                    vendorId={id!} 
                    onDateSelect={setSelectedBookingDate}
                  />

                  <div className="pt-4 border-t border-accent/20 space-y-3">
                    <QuickInquiryDialog vendorId={id!} vendorName={vendor.business_name}>
                      <Button size="lg" className="w-full">
                        Get Quote
                      </Button>
                    </QuickInquiryDialog>
                    
                    {vendor.whatsapp_number && (
                      <WhatsAppChatButton 
                        whatsappNumber={vendor.whatsapp_number} 
                        vendorName={vendor.business_name}
                        variant="full"
                      />
                    )}

                    <BookingDialog vendorId={id!} initialDate={selectedBookingDate}>
                      <Button variant="secondary" size="lg" className="w-full">
                        Check Availability & Book
                      </Button>
                    </BookingDialog>

                    <div className="flex gap-2">
                      <FavoritesButton vendorId={id!} />
                      <VendorShareButton vendorId={id!} vendorName={vendor.business_name} className="flex-1" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-accent/20">
                    <p className="text-xs text-muted-foreground text-center space-y-1">
                      <span className="flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-accent" /> Response within 2 hours
                      </span>
                      <span className="flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-accent" /> Milestone payment protection
                      </span>
                      <span className="flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-accent" /> SLA guarantee
                      </span>
                    </p>
                  </div>
                </GlassCard>

                {/* FOMO Elements */}
                <GlassCard className="p-5 bg-white border-2 border-accent/20">
                  <VendorProfileFOMO vendorId={id!} vendorName={vendor.business_name} />
                </GlassCard>

                {/* Deal Badge - Desktop */}
                <DealBadge className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <BhindiFooter />
    </div>
  );
};

export default VendorProfile;
