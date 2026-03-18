import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { VendorCard } from "@/components/VendorCard";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin, Star, Users, ArrowRight, Bell } from "lucide-react";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import { useToast } from "@/hooks/use-toast";

const CATEGORY_NAMES: Record<string, string> = {
  photography: "Photographers", venues: "Wedding Venues", catering: "Caterers",
  decoration: "Decorators", mehendi: "Mehendi Artists", music: "DJs & Bands",
  cakes: "Cake Designers", planning: "Wedding Planners", makeup: "Makeup Artists",
  invitations: "Invitation Designers", choreography: "Choreographers",
  transport: "Car Rentals", jewelry: "Jewellers", pandit: "Pandits & Priests",
  entertainment: "Entertainment",
};

const CityVendors = () => {
  const { city, category } = useParams();
  const { toast } = useToast();
  const [vendors, setVendors] = useState<any[]>([]);
  const [cityData, setCityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allCities, setAllCities] = useState<any[]>([]);
  const [relatedCategories, setRelatedCategories] = useState<string[]>([]);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [submittingWaitlist, setSubmittingWaitlist] = useState(false);

  useEffect(() => { loadData(); }, [city, category]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: cityInfo } = await supabase.from("cities").select("*").ilike("name", city?.replace(/-/g, " ") || "").single();
      if (cityInfo) {
        setCityData(cityInfo);
        let query = supabase.from("vendors").select(`*, cities (name, state), vendor_portfolio (image_url)`).eq("city_id", cityInfo.id).eq("is_active", true).eq("verified", true).order("subscription_tier", { ascending: false }).order("average_rating", { ascending: false });
        if (category && category !== "all") query = query.eq("category", category as any);
        const { data: vendorsData } = await query;
        setVendors(vendorsData || []);
        const { data: categories } = await supabase.from("vendors").select("category").eq("city_id", cityInfo.id).eq("is_active", true).eq("verified", true);
        setRelatedCategories([...new Set(categories?.map(c => c.category) || [])]);
      }
      const { data: cities } = await supabase.from("cities").select("*").eq("is_active", true).order("name");
      setAllCities(cities || []);
    } catch (error) { console.error("Error loading data:", error); }
    finally { setLoading(false); }
  };

  const formatCityName = (name: string) => name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  const handleWaitlistSubmit = async () => {
    if (!waitlistEmail.trim()) return;
    setSubmittingWaitlist(true);
    try {
      const { error } = await supabase.from("contact_inquiries").insert({
        name: "City Waitlist",
        email: waitlistEmail.trim(),
        message: `Interested in vendors for ${formatCityName(city || "")}${category && category !== "all" ? ` - ${CATEGORY_NAMES[category] || category}` : ""}`,
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

  const pageTitle = category && category !== "all"
    ? `Best ${CATEGORY_NAMES[category] || category} in ${formatCityName(city || "")} | Karlo Shaadi`
    : `Wedding Vendors in ${formatCityName(city || "")} | Karlo Shaadi`;

  const pageDescription = category && category !== "all"
    ? `Find the top rated ${CATEGORY_NAMES[category]?.toLowerCase() || category} in ${formatCityName(city || "")}. Compare prices, read reviews, and book verified wedding vendors.`
    : `Discover ${vendors.length}+ verified wedding vendors in ${formatCityName(city || "")}. Photographers, decorators, caterers & more. Book with confidence.`;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-rose-50/50 via-white to-amber-50/30">
      <SEO title={pageTitle} description={pageDescription} keywords={`wedding vendors ${formatCityName(city || "")}, ${category ? CATEGORY_NAMES[category] + " " + formatCityName(city || "") : "wedding services"}, marriage vendors`} />
      <LocalBusinessJsonLd city={formatCityName(city || "")} category={category && CATEGORY_NAMES[category] ? CATEGORY_NAMES[category] : undefined} />

      <section className="pt-24 pb-12 bg-gradient-to-b from-rose-50/60 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-accent/15 text-accent border border-accent/30 mb-4"><MapPin className="h-3 w-3 mr-1" />{formatCityName(city || "")}</Badge>
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
              {category && category !== "all" ? (<>Best <span className="text-primary">{CATEGORY_NAMES[category]}</span> in {formatCityName(city || "")}</>) : (<>Wedding Vendors in <span className="text-primary">{formatCityName(city || "")}</span></>)}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 mx-auto rounded-full mb-4" />
            <p className="text-lg text-muted-foreground mb-8">Discover {vendors.length}+ verified vendors • Compare prices • Read real reviews</p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Link to={`/vendors/${city?.toLowerCase()}`}><Badge variant={!category || category === "all" ? "default" : "outline"} className="cursor-pointer hover:bg-primary/10">All Categories</Badge></Link>
              {relatedCategories.slice(0, 8).map((cat) => (
                <Link key={cat} to={`/vendors/${city?.toLowerCase()}/${cat}`}><Badge variant={category === cat ? "default" : "outline"} className="cursor-pointer hover:bg-primary/10 capitalize">{CATEGORY_NAMES[cat] || cat}</Badge></Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-accent/20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-8 md:gap-16">
            <div className="text-center"><p className="font-display font-bold text-2xl text-primary">{vendors.length}+</p><p className="text-sm text-muted-foreground">Verified Vendors</p></div>
            <div className="text-center"><p className="font-display font-bold text-2xl text-primary">4.8</p><p className="text-sm text-muted-foreground">Avg Rating</p></div>
            <div className="text-center"><p className="font-display font-bold text-2xl text-primary">500+</p><p className="text-sm text-muted-foreground">Happy Couples</p></div>
          </div>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : vendors.length === 0 ? (
            /* FIX 7: Couple-facing waitlist empty state */
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Vendors aa rahe hain {formatCityName(city || "")} mein!
              </h3>
              <p className="text-muted-foreground mb-6">
                Hum is sheher mein {category && CATEGORY_NAMES[category] ? CATEGORY_NAMES[category].toLowerCase() : "vendors"} onboard kar rahe hain. Notify ho jaao jab pehle vendors available hon.
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
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Link to="/categories"><Button variant="outline" size="lg">Browse All Categories</Button></Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} imageUrl={vendor.logo_url || vendor.vendor_portfolio?.[0]?.image_url} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl text-center mb-8">Browse Vendors in Other Cities</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {allCities.filter(c => c.name.toLowerCase() !== city?.replace(/-/g, " ").toLowerCase()).slice(0, 12).map((otherCity) => (
              <Link key={otherCity.id} to={`/vendors/${otherCity.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 py-2 px-4"><MapPin className="h-3 w-3 mr-1" />{otherCity.name}</Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-sm">
            <h2>{category && category !== "all" ? `Why Choose Karlo Shaadi for ${CATEGORY_NAMES[category]} in ${formatCityName(city || "")}?` : `Find Your Perfect Wedding Vendors in ${formatCityName(city || "")}`}</h2>
            <p>Planning a wedding in {formatCityName(city || "")}? Karlo Shaadi connects you with the best{category ? ` ${CATEGORY_NAMES[category]?.toLowerCase()}` : " wedding vendors"} in your city. Every vendor on our platform is verified, ensuring you get quality service for your special day.</p>
            <h3>Why Couples Love Us</h3>
            <ul>
              <li>100% verified vendors with real reviews from couples</li>
              <li>Transparent pricing - see starting prices upfront</li>
              <li>Direct WhatsApp chat with vendors</li>
              <li>Milestone-based payment protection</li>
              <li>Free consultation booking</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CityVendors;