import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewsList } from "@/components/ReviewsList";
import { BookingDialog } from "@/components/BookingDialog";
import { FavoritesButton } from "@/components/FavoritesButton";
import { VendorAvailabilityWidget } from "@/components/vendor/VendorAvailabilityWidget";
import { VendorQuickInfo } from "@/components/vendor/VendorQuickInfo";
import { VendorFAQ } from "@/components/vendor/VendorFAQ";
import { DealBadge } from "@/components/vendor/DealBadge";
import { VendorProfileFOMO } from "@/components/VendorProfileFOMO";
import { VendorShareButton } from "@/components/vendor/VendorShareButton";
import { WhatsAppChatButton } from "@/components/vendor/WhatsAppChatButton";
import { QuickInquiryDialog } from "@/components/QuickInquiryDialog";
import { Badge } from "@/components/ui/badge";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { SEO } from "@/components/SEO";
import { LocalBusinessJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { 
  MapPin, Clock, Star, Shield, Award, CheckCircle2, Loader2, 
  MessageCircle, ChevronLeft, ChevronRight, Camera, Heart
} from "lucide-react";

const VendorProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const isMobile = useIsMobile();
  const [vendor, setVendor] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userBooking, setUserBooking] = useState<any>(null);
  const [selectedBookingDate, setSelectedBookingDate] = useState<Date | undefined>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
        .select(`*, cities (name, state)`)
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
          metadata: { business_name: vendorData?.business_name, category: vendorData?.category },
        });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Vendor not found</p>
      </div>
    );
  }

  const images = portfolio.length > 0
    ? portfolio.map(p => p.image_url)
    : ["/placeholder.svg"];

  const nextImage = () => setCurrentImageIndex((i) => (i + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((i) => (i - 1 + images.length) % images.length);

  const cityName = vendor.cities?.name || "India";
  const categoryLabel = vendor.category
    ? vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)
    : "Wedding Vendor";
  const seoTitle = `${vendor.business_name} — ${categoryLabel} in ${cityName} | Karlo Shaadi`;
  const seoDescription = vendor.description
    ? `${vendor.description.slice(0, 140)}… Book ${vendor.business_name}, a verified ${categoryLabel.toLowerCase()} in ${cityName} on Karlo Shaadi.`
    : `Book ${vendor.business_name}, a top-rated verified ${categoryLabel.toLowerCase()} in ${cityName}. ${vendor.total_reviews || 0}+ reviews, ${vendor.years_experience || 0}+ years experience. Zero commission booking on Karlo Shaadi.`;
  const seoKeywords = [
    `${vendor.business_name}`,
    `${vendor.category} in ${cityName}`,
    `${vendor.category} ${cityName}`,
    `wedding ${vendor.category} ${cityName}`,
    `best ${vendor.category} ${cityName}`,
    `${vendor.category} near me`,
    `${cityName} wedding vendors`,
    `hire ${vendor.category} ${cityName}`,
    `wedding ${vendor.category} India`,
    `verified ${vendor.category}`,
  ].join(", ");

  const breadcrumbItems = [
    { name: "Home", url: "https://karloshaadi.com/" },
    { name: "Wedding Vendors", url: `https://karloshaadi.com/city/${cityName.toLowerCase()}` },
    { name: categoryLabel, url: `https://karloshaadi.com/category/${vendor.category}` },
    { name: vendor.business_name, url: `https://karloshaadi.com/vendors/${id}` },
  ];

  // ─── MOBILE LAYOUT ─────────────────────────────────
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <SEO
          title={seoTitle}
          description={seoDescription}
          keywords={seoKeywords}
          url={`/vendors/${id}`}
          breadcrumbs={breadcrumbItems}
        />
        <LocalBusinessJsonLd city={cityName} category={vendor.category} />
        <BreadcrumbJsonLd items={breadcrumbItems} />
        <MobilePageHeader
          title={vendor.business_name} 
          rightActions={
            <div className="flex items-center gap-1">
              <FavoritesButton vendorId={id!} />
              <VendorShareButton vendorId={id!} vendorName={vendor.business_name} variant="icon" />
            </div>
          }
        />

        {/* Photo Carousel */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <img 
            src={images[currentImageIndex]} 
            alt={`${vendor.business_name} photo ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            style={{ filter: 'contrast(1.03) saturate(1.08)' }}
          />
          {images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <ChevronRight className="h-4 w-4" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.slice(0, 5).map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === currentImageIndex ? 'bg-background' : 'bg-background/50'}`} />
                ))}
              </div>
            </>
          )}
          {/* Photo count badge */}
          <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 text-xs font-medium">
            <Camera className="h-3 w-3" />
            {images.length}
          </div>
        </div>

        {/* Vendor Header */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-foreground leading-tight">{vendor.business_name}</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(vendor.average_rating || 0) ? 'text-accent fill-accent' : 'text-muted-foreground/30'}`} />
                  ))}
                </div>
                <span className="text-sm font-semibold">{vendor.average_rating || 0}</span>
                <span className="text-sm text-muted-foreground">({vendor.total_reviews || 0} reviews)</span>
              </div>
            </div>
            {vendor.verified && (
              <div className="shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-accent" />
              </div>
            )}
          </div>

          {/* Location & Experience */}
          <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>{vendor.cities?.name || "India"}</span>
            </div>
            <span>•</span>
            <span>{vendor.years_experience}+ yrs exp</span>
            <span>•</span>
            <span className="capitalize">{vendor.category}</span>
          </div>
        </div>

        {/* Services Section */}
        {services.length > 0 && (
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-foreground">Services</h2>
              <span className="text-xs text-primary font-medium">See All &gt;</span>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
              {services.map((service) => (
                <div 
                  key={service.id} 
                  className="shrink-0 w-36 bg-card border border-border/50 rounded-2xl p-3 text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Camera className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight">{service.service_name}</p>
                  {service.base_price && (
                    <p className="text-xs text-muted-foreground mt-1">₹{Number(service.base_price).toLocaleString('en-IN')} onwards</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deal Badge */}
        <div className="px-4 py-2">
          <DealBadge className="w-full rounded-xl" />
        </div>

        {/* Reviews Preview */}
        <div className="px-4 py-3">
          <h2 className="text-base font-bold text-foreground mb-3">Reviews Preview</h2>
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-3 pb-1">
              <ReviewsList vendorId={id!} />
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="px-4 py-3">
          <h2 className="text-base font-bold text-foreground mb-3">Calendar</h2>
          <div className="bg-card border border-border/50 rounded-2xl p-4">
            <VendorAvailabilityWidget vendorId={id!} onDateSelect={setSelectedBookingDate} />
          </div>
        </div>

        {/* Quick Info */}
        <div className="px-4 py-3">
          <h2 className="text-base font-bold text-foreground mb-3">Quick Info</h2>
          <div className="bg-card border border-border/50 rounded-2xl p-4">
            <VendorQuickInfo vendor={vendor} />
          </div>
        </div>

        {/* About */}
        <div className="px-4 py-3">
          <h2 className="text-base font-bold text-foreground mb-2">About</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {vendor.description || `Professional ${vendor.category} services for your special day.`}
          </p>
        </div>

        {/* FAQ */}
        <div className="px-4 py-3">
          <VendorFAQ vendorName={vendor.business_name} category={vendor.category} />
        </div>

        {/* Sticky Bottom CTA — WhatsApp Primary */}
        <div className="fixed bottom-16 left-0 right-0 z-50 px-4 py-3 bg-background/95 backdrop-blur-xl border-t border-border/50">
          <div className="flex gap-2">
            {vendor.whatsapp_number ? (
              <>
                <WhatsAppChatButton 
                  whatsappNumber={vendor.whatsapp_number} 
                  vendorName={vendor.business_name}
                  variant="full"
                  className="flex-1 h-12 text-base font-semibold rounded-xl"
                />
                <QuickInquiryDialog vendorId={id!} vendorName={vendor.business_name}>
                  <Button variant="outline" className="h-12 rounded-xl px-4">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                </QuickInquiryDialog>
              </>
            ) : (
              <QuickInquiryDialog vendorId={id!} vendorName={vendor.business_name}>
                <Button className="flex-1 h-12 text-base font-semibold rounded-xl">
                  <MessageCircle className="h-5 w-5 mr-2" /> Send Inquiry
                </Button>
              </QuickInquiryDialog>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── DESKTOP LAYOUT ─────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        url={`/vendors/${id}`}
        breadcrumbs={breadcrumbItems}
      />
      <LocalBusinessJsonLd city={cityName} category={vendor.category} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {/* Gallery Section */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img 
          src={images[currentImageIndex]} 
          alt={vendor.business_name}
          className="w-full h-full object-cover"
          style={{ filter: 'contrast(1.03) saturate(1.08)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.slice(0, 5).map((_, i) => (
                <button key={i} onClick={() => setCurrentImageIndex(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentImageIndex ? 'bg-background' : 'bg-background/50'}`} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12 -mt-16 md:-mt-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <div className="bg-card border border-border/50 rounded-2xl p-6 animate-fade-up">
                <div className="flex flex-wrap gap-2 mb-3">
                  {vendor.verified && (
                    <Badge variant="outline" className="gap-1 border-accent/30 text-accent">
                      <Shield className="h-3 w-3" /> Verified
                    </Badge>
                  )}
                  {vendor.average_rating >= 4.5 && (
                    <Badge variant="secondary">Top Rated</Badge>
                  )}
                  <Badge variant="secondary" className="capitalize">{vendor.category}</Badge>
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1">{vendor.business_name}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm mt-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{vendor.cities?.name || "India"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-accent fill-accent" />
                    <span className="font-semibold">{vendor.average_rating || 0}</span>
                    <span className="text-muted-foreground">({vendor.total_reviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Responds in 2 hours</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">{vendor.years_experience}+</p>
                    <p className="text-xs text-muted-foreground">Years Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">{vendor.total_bookings || 0}+</p>
                    <p className="text-xs text-muted-foreground">Weddings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">{vendor.team_size || 1}</p>
                    <p className="text-xs text-muted-foreground">Team Size</p>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {vendor.description || `Professional ${vendor.category} services for your special day.`}
                </p>
              </div>

              {/* Services */}
              {services.length > 0 && (
                <div className="bg-card border border-border/50 rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-4">Services & Pricing</h2>
                  <div className="space-y-3">
                    {services.map((service) => (
                      <div key={service.id} className="p-4 rounded-xl bg-muted/30 border border-border/30">
                        <h3 className="font-semibold text-base mb-1">{service.service_name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                        {service.base_price && (
                          <p className="font-bold text-primary text-lg">₹{Number(service.base_price).toLocaleString('en-IN')}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Info */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-3">Quick Info</h2>
                <VendorQuickInfo vendor={vendor} />
              </div>

              {/* Reviews */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Reviews & Ratings</h2>
                {user && userBooking && (
                  <div className="mb-6 p-4 bg-muted/30 border border-border/30 rounded-xl">
                    <h3 className="font-semibold mb-3 text-sm">Share Your Experience</h3>
                    <ReviewForm vendorId={id!} bookingId={userBooking.id} onSuccess={loadVendorData} />
                  </div>
                )}
                <ReviewsList vendorId={id!} />
              </div>

              {/* FAQ */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <VendorFAQ vendorName={vendor.business_name} category={vendor.category} />
              </div>
            </div>

            {/* Right Column - Desktop Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-4">
                  <VendorAvailabilityWidget vendorId={id!} onDateSelect={setSelectedBookingDate} />

                  <div className="pt-4 border-t border-border/50 space-y-3">
                    {/* WhatsApp is the PRIMARY CTA */}
                    {vendor.whatsapp_number && (
                      <WhatsAppChatButton whatsappNumber={vendor.whatsapp_number} vendorName={vendor.business_name} variant="full" />
                    )}

                    <QuickInquiryDialog vendorId={id!} vendorName={vendor.business_name}>
                      <Button size="lg" variant={vendor.whatsapp_number ? "outline" : "default"} className="w-full rounded-xl">
                        <MessageCircle className="h-4 w-4 mr-2" /> Get Quote
                      </Button>
                    </QuickInquiryDialog>

                    <BookingDialog vendorId={id!} initialDate={selectedBookingDate}>
                      <Button variant="secondary" size="lg" className="w-full rounded-xl">Check Availability & Book</Button>
                    </BookingDialog>

                    <div className="flex gap-2">
                      <FavoritesButton vendorId={id!} />
                      <VendorShareButton vendorId={id!} vendorName={vendor.business_name} className="flex-1" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="text-xs text-muted-foreground text-center space-y-1">
                      <span className="flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-accent" /> Response within 2 hours
                      </span>
                      <span className="flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-accent" /> Milestone payment protection
                      </span>
                      <span className="flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-accent" /> SLA guarantee
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border/50 rounded-2xl p-5">
                  <VendorProfileFOMO vendorId={id!} vendorName={vendor.business_name} />
                </div>

                <DealBadge className="w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VendorProfile;
