import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Star, Shield, Bell } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { SEO } from "@/components/SEO";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cdn } from "@/lib/cdnAssets";

const Categories = () => {
  const { category } = useParams();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [vendors, setVendors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [submittingWaitlist, setSubmittingWaitlist] = useState(false);

  const categoryImages: Record<string, string> = {
    photography: cdn.categoryPhotography, venue: cdn.categoryVenue, venues: cdn.categoryVenue,
    mehendi: cdn.categoryMehendi, catering: cdn.categoryCatering, decoration: cdn.categoryDecoration,
    decor: cdn.categoryDecoration, music: cdn.categoryMusic, cake: cdn.categoryCake, cakes: cdn.categoryCake,
    'cakes-desserts': cdn.categoryCake, planning: cdn.categoryPhotography, makeup: cdn.categoryBridalMakeup,
    invitations: cdn.categoryInvitations, choreography: cdn.categoryChoreography,
    transport: cdn.categoryTransport, jewelry: cdn.categoryJewelry, pandit: cdn.categoryPandit,
    entertainment: cdn.categoryEntertainment, 'social-media-managers': cdn.categoryPhotography,
    'influencer': cdn.categoryPhotography, 'anchor': cdn.categoryEntertainment, 'content-creator': cdn.categoryPhotography,
  };

  useEffect(() => { loadData(); }, [category]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: categoriesData } = await supabase.from("categories").select("*").eq("is_active", true).order("display_order");
      if (categoriesData) setCategories(categoriesData);
      if (category) {
        const { data: vendorsData } = await supabase.from("vendors").select(`*, cities (name, state), vendor_services (*)`).eq("is_active", true).eq("category", category as any).order("verified", { ascending: false }).order("average_rating", { ascending: false });
        if (vendorsData) setVendors(vendorsData);
      }
    } catch { /* ignored */ }
    finally { setLoading(false); }
  };

  const handleWaitlistSubmit = async () => {
    if (!waitlistEmail.trim()) return;
    setSubmittingWaitlist(true);
    try {
      const { error } = await supabase.from("contact_inquiries").insert({
        name: "Category Waitlist",
        email: waitlistEmail.trim(),
        message: `Interested in vendors for category: ${category}`,
        status: "new",
      });
      if (error) throw error;
      toast({ title: "Done! Aapko notify karenge. 🎉", description: "Jab vendors available honge, hum aapko email karenge." });
      setWaitlistEmail("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmittingWaitlist(false);
    }
  };

  const currentCategory = category ? categories.find(c => c.slug === category) : null;

  const categoryKeywords: Record<string, string> = {
    photography: "wedding photographer India, wedding photography near me, candid wedding photographer, wedding photographer price",
    venue: "wedding venue India, wedding hall booking, banquet hall wedding, palace wedding venue",
    venues: "wedding venue India, wedding hall booking, banquet hall wedding, palace wedding venue",
    catering: "wedding caterer India, wedding catering services, wedding food India, catering for 500 guests",
    decoration: "wedding decoration India, wedding decor ideas, mandap decoration, wedding floral decoration",
    makeup: "bridal makeup artist India, wedding makeup near me, bridal makeup price India",
    mehendi: "mehendi artist wedding, bridal mehendi designs, henna artist India, mehendi ceremony",
    music: "wedding DJ India, wedding band, dhol player, sangeet music",
    cake: "wedding cake India, custom wedding cake, cake designer India",
    choreography: "wedding choreography India, sangeet choreography, dance performance wedding",
    transport: "wedding car rental India, wedding transportation, baraat bus",
    jewelry: "bridal jewelry India, wedding jewellery rental, bridal set India",
    pandit: "wedding pandit India, Hindu wedding priest, wedding muhurat",
    entertainment: "wedding entertainment India, wedding performers, wedding anchor",
    invitations: "wedding invitation design India, digital wedding invite, shaadi card",
  };

  const seoTitle = currentCategory
    ? `${currentCategory.name} | Best Wedding ${currentCategory.name} in India`
    : "Wedding Vendor Categories | Photography, Venues, Catering & More";
  const seoDesc = currentCategory
    ? `Find the best ${currentCategory.name?.toLowerCase()} for your wedding. Verified vendors with real reviews, portfolio, and secure booking on Karlo Shaadi.`
    : "Browse all wedding vendor categories on Karlo Shaadi. Find photographers, venues, caterers, decorators, makeup artists, mehendi artists, DJs & more across 20+ cities in India.";
  const seoKeywords = currentCategory
    ? categoryKeywords[currentCategory.slug] || `${currentCategory.name} wedding India, best ${currentCategory.name?.toLowerCase()} wedding`
    : "wedding vendors India, wedding photography, wedding venue, wedding catering, bridal makeup, mehendi artist, wedding DJ, wedding decoration";

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        url={currentCategory ? `/category/${currentCategory.slug}` : "/categories"}
        breadcrumbs={currentCategory ? [
          { name: "Categories", url: "/categories" },
          { name: currentCategory.name, url: `/category/${currentCategory.slug}` },
        ] : [{ name: "Wedding Vendor Categories", url: "/categories" }]}
      />
      {currentCategory && (
        <ServiceJsonLd
          serviceName={currentCategory.name}
          serviceDescription={currentCategory.description || `Find verified ${currentCategory.name?.toLowerCase()} for your wedding on Karlo Shaadi`}
        />
      )}
      <BreadcrumbJsonLd items={currentCategory ? [
        { name: "Categories", url: "/categories" },
        { name: currentCategory.name, url: `/category/${currentCategory.slug}` },
      ] : [{ name: "Wedding Vendor Categories", url: "/categories" }]} />
      <MobilePageHeader title={currentCategory?.name || "Categories"} />

      {/* Hero Banner */}
      {!currentCategory && (
        <div className={`relative overflow-hidden ${isMobile ? 'h-44' : 'h-64 mt-20'}`}>
          <img src={cdn.heroCategoriesMosaic} alt="Wedding categories" className="w-full h-full object-cover" style={{ filter: 'contrast(1.03) saturate(1.08)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 md:left-12">
            <p className="text-white/80 text-xs font-medium tracking-widest uppercase mb-1">Browse All</p>
            <h1 className={`text-white font-bold ${isMobile ? 'text-2xl' : 'text-4xl'}`}>Explore Categories</h1>
          </div>
        </div>
      )}

      {currentCategory && !isMobile && (
        <div className="pt-20 pb-8 px-4 md:px-6">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <p className="text-xs font-medium text-accent uppercase tracking-widest mb-2">Category</p>
            <h1 className="text-3xl font-bold text-foreground mb-2">{currentCategory.name}</h1>
            <p className="text-muted-foreground">{currentCategory.description}</p>
          </div>
        </div>
      )}

      <section className={isMobile ? "px-4 py-5" : "py-10"}>
        <div className={isMobile ? "" : "container mx-auto px-4 md:px-6 max-w-6xl"}>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : currentCategory ? (
            vendors.length === 0 ? (
              /* FIX 7: Empty state with waitlist */
              <div className="text-center py-16 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Bell className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Vendors aa rahe hain!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Hum {currentCategory.name} category mein vendors onboard kar rahe hain. Notify ho jaao jab pehle vendors available hon.
                </p>
                <div className="flex gap-2 max-w-sm mx-auto">
                  <Input
                    type="email"
                    placeholder="Apna email daalein"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleWaitlistSubmit} disabled={submittingWaitlist || !waitlistEmail.trim()}>
                    {submittingWaitlist ? <Loader2 className="h-4 w-4 animate-spin" /> : "Notify Me"}
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  {vendors.length} verified vendor{vendors.length !== 1 ? "s" : ""}
                </p>
                <div className="space-y-3">
                  {vendors.map((vendor) => (
                    <Link key={vendor.id} to={`/vendors/${vendor.id}`}>
                      <div className="rounded-2xl border border-border/50 bg-background p-4 hover:border-accent/30 hover:shadow-md transition-all">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 ">
                            <span className="text-2xl font-bold text-accent">{vendor.business_name?.charAt(0) || "V"}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground truncate">{vendor.business_name}</h3>
                              {vendor.verified && <Shield className="h-4 w-4 text-accent shrink-0" />}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{vendor.cities?.name || "India"}</p>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 text-accent fill-accent" />
                                <span className="font-medium">{vendor.average_rating || 0}</span>
                                <span className="text-muted-foreground">({vendor.total_reviews || 0})</span>
                              </span>
                              <span className="text-muted-foreground">{vendor.years_experience}+ yrs</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'}`}>
              {categories.map((cat) => (
                <Link key={cat.id} to={`/category/${cat.slug}`}>
                  <div className="group relative overflow-hidden rounded-2xl border border-border/50 hover:border-accent/30 hover:shadow-lg transition-all">
                    <div className={`relative ${isMobile ? 'h-36' : 'h-48'}`}>
                      {categoryImages[cat.slug] ? (
                        <img src={categoryImages[cat.slug]} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ filter: 'contrast(1.03) saturate(1.08)' }} />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <span className="text-4xl font-bold text-accent/30">{cat.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className={`font-semibold text-white ${isMobile ? 'text-sm' : 'text-base'}`}>{cat.name}</h3>
                        {!isMobile && cat.description && (
                          <p className="text-white/70 text-xs mt-0.5 line-clamp-1">{cat.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Categories;