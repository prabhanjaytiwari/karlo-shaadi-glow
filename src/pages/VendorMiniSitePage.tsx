import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Camera, IndianRupee, MessageSquare, ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LocalBusinessJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

const THEME_STYLES: Record<string, { bg: string; accent: string; text: string; card: string }> = {
  "elegant-rose": { bg: "from-rose-50 to-pink-50", accent: "text-rose-700", text: "text-rose-900", card: "border-rose-200 bg-white/90" },
  "royal-gold": { bg: "from-amber-50 to-orange-50", accent: "text-amber-700", text: "text-amber-900", card: "border-amber-200 bg-white/90" },
  "modern-slate": { bg: "from-slate-50 to-gray-100", accent: "text-slate-700", text: "text-slate-900", card: "border-slate-200 bg-white/90" },
};

export default function VendorMiniSitePage() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<any>(null);
  const [miniSite, setMiniSite] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) loadSite(slug);
  }, [slug]);

  const loadSite = async (siteSlug: string) => {
    setLoading(true);

    const { data: site } = await (supabase as any)
      .from("vendor_mini_sites")
      .select("*")
      .eq("slug", siteSlug)
      .eq("is_published", true)
      .maybeSingle();

    if (!site) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setMiniSite(site);
    const sections = (site.sections_config || {}) as Record<string, boolean>;

    const { data: vendorData } = await supabase
      .from("vendors")
      .select("*")
      .eq("id", site.vendor_id)
      .single();

    setVendor(vendorData);

    if (sections.portfolio) {
      const { data: portfolioData } = await supabase.from("vendor_portfolio").select("*").eq("vendor_id", site.vendor_id).order("display_order");
      setPortfolio(portfolioData || []);
    }
    if (sections.services) {
      const { data: servicesData } = await supabase.from("vendor_services").select("*").eq("vendor_id", site.vendor_id).eq("is_active", true);
      setServices(servicesData || []);
    }
    if (sections.reviews) {
      const { data: reviewsData } = await supabase.from("reviews").select("*").eq("vendor_id", site.vendor_id).order("created_at", { ascending: false }).limit(6);
      setReviews(reviewsData || []);
    }

    
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="xl" /></div>;

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Site Not Found</h1>
        <p className="text-muted-foreground">This vendor mini-site doesn't exist or isn't published.</p>
        <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const themeStyle = THEME_STYLES[miniSite?.theme] || THEME_STYLES["elegant-rose"];
  const sections = (miniSite?.sections_config || {}) as Record<string, boolean>;

  return (
    <>
      <SEO
        title={`${vendor?.business_name} — Wedding ${vendor?.category} ${vendor?.city ? `in ${vendor.city}` : 'in India'}`}
        description={vendor?.description?.slice(0, 160) || `${vendor?.business_name} — Verified wedding ${vendor?.category?.toLowerCase() || 'vendor'}${vendor?.city ? ` in ${vendor.city}` : ''}. View portfolio, services, pricing and book on Karlo Shaadi.`}
        keywords={`${vendor?.business_name}, ${vendor?.category} ${vendor?.city || 'India'}, wedding ${vendor?.category?.toLowerCase()} near me, ${vendor?.city || ''} wedding vendor`}
        url={`/vendor-site/${slug}`}
        breadcrumbs={[{ name: vendor?.business_name || "Vendor", url: `/vendor-site/${slug}` }]}
      />
      <LocalBusinessJsonLd city={vendor?.city || "India"} category={vendor?.category} />
      <BreadcrumbJsonLd items={[{ name: vendor?.business_name || "Vendor", url: `/vendor-site/${slug}` }]} />

      <div className={`min-h-screen bg-gradient-to-b ${themeStyle.bg}`}>
        <header className="relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
            {vendor?.logo_url && (
              <img src={vendor.logo_url} alt={vendor.business_name} className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-4 border-white shadow-lg" />
            )}
            <h1 className={`text-4xl md:text-5xl font-bold mb-3 ${themeStyle.text}`} style={{ fontFamily: "'Playfair Display', serif" }}>
              {vendor?.business_name}
            </h1>
            {miniSite?.custom_tagline && (
              <p className={`text-lg ${themeStyle.accent} mb-4`}>{miniSite.custom_tagline}</p>
            )}
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground flex-wrap">
              {vendor?.category && <Badge variant="secondary">{vendor.category}</Badge>}
              {vendor?.city && (
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{vendor.city}</span>
              )}
              {vendor?.average_rating > 0 && (
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />{vendor.average_rating} ({vendor.total_reviews} reviews)</span>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 pb-16 space-y-12">
          {sections.about && vendor?.description && (
            <section>
              <h2 className={`text-2xl font-bold mb-4 ${themeStyle.text}`}>About</h2>
              <div className={`rounded-xl p-6 ${themeStyle.card}`}>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{vendor.description}</p>
              </div>
            </section>
          )}

          {sections.portfolio && portfolio.length > 0 && (
            <section>
              <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${themeStyle.text}`}>
                <Camera className="h-6 w-6" /> Portfolio
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {portfolio.map(item => (
                  <div key={item.id} className="aspect-square rounded-xl overflow-hidden shadow-md">
                    <img src={item.image_url} alt={item.title || ""} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {sections.services && services.length > 0 && (
            <section>
              <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${themeStyle.text}`}>
                <IndianRupee className="h-6 w-6" /> Services & Pricing
              </h2>
              <div className="grid gap-3">
                {services.map(svc => (
                  <div key={svc.id} className={`rounded-xl p-5 ${themeStyle.card}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{svc.service_name}</h3>
                        {svc.description && <p className="text-sm text-muted-foreground mt-1">{svc.description}</p>}
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        {svc.base_price && (
                          <span className={`font-bold ${themeStyle.accent}`}>₹{Number(svc.base_price).toLocaleString("en-IN")}</span>
                        )}
                        {svc.price_range_min && svc.price_range_max && (
                          <span className="text-sm text-muted-foreground block">
                            ₹{Number(svc.price_range_min).toLocaleString("en-IN")} — ₹{Number(svc.price_range_max).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {sections.reviews && reviews.length > 0 && (
            <section>
              <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${themeStyle.text}`}>
                <Star className="h-6 w-6" /> Client Reviews
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {reviews.map(rev => (
                  <div key={rev.id} className={`rounded-xl p-5 ${themeStyle.card}`}>
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                      ))}
                    </div>
                    {rev.comment && <p className="text-sm text-muted-foreground">{rev.comment}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {sections.whatsapp_cta && vendor?.whatsapp_number && (
            <section className="text-center">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white gap-2 text-lg px-8 py-6 rounded-full shadow-lg"
                onClick={() => window.open(`https://wa.me/91${vendor.whatsapp_number}?text=Hi! I found you on Karlo Shaadi and would like to discuss my wedding.`, "_blank")}
              >
                <MessageSquare className="h-5 w-5" /> Chat on WhatsApp
              </Button>
            </section>
          )}
        </main>

        <footer className="text-center py-8 text-xs text-muted-foreground border-t">
          Powered by <a href="/" className={`font-semibold ${themeStyle.accent} hover:underline`}>Karlo Shaadi</a>
        </footer>
      </div>
    </>
  );
}
