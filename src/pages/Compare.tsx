import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  Shield, 
  Check, 
  X, 
  Plus,
  ArrowRight,
  Scale,
  Trash2,
  ExternalLink,
  MessageSquare,
  Heart,
  Globe,
  Instagram
} from "lucide-react";
import { Loader2 } from "lucide-react";

interface VendorData {
  id: string;
  business_name: string;
  category: string;
  description: string | null;
  average_rating: number | null;
  total_reviews: number | null;
  total_bookings: number | null;
  years_experience: number | null;
  team_size: number | null;
  verified: boolean;
  website_url: string | null;
  instagram_handle: string | null;
  city: { name: string; state: string } | null;
  services: {
    service_name: string;
    base_price: number | null;
    price_range_min: number | null;
    price_range_max: number | null;
  }[];
}

const comparisonFeatures = [
  { key: "rating", label: "Rating", icon: Star },
  { key: "reviews", label: "Total Reviews", icon: MessageSquare },
  { key: "bookings", label: "Completed Bookings", icon: Calendar },
  { key: "experience", label: "Years of Experience", icon: Calendar },
  { key: "team", label: "Team Size", icon: Users },
  { key: "verified", label: "Verified Status", icon: Shield },
  { key: "location", label: "Location", icon: MapPin },
  { key: "website", label: "Website", icon: Globe },
  { key: "instagram", label: "Instagram", icon: Instagram },
];

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [allVendors, setAllVendors] = useState<VendorData[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const vendorIds = searchParams.get("vendors")?.split(",").filter(Boolean) || [];

  useEffect(() => {
    if (vendorIds.length > 0) {
      loadVendors();
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const loadVendors = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("vendors")
        .select(`
          id,
          business_name,
          category,
          description,
          average_rating,
          total_reviews,
          total_bookings,
          years_experience,
          team_size,
          verified,
          website_url,
          instagram_handle,
          city:cities(name, state),
          services:vendor_services(service_name, base_price, price_range_min, price_range_max)
        `)
        .in("id", vendorIds)
        .eq("is_active", true);

      if (data) {
        setVendors(data as unknown as VendorData[]);
      }
    } catch { /* ignored */ } finally {
      setLoading(false);
    }
  };

  const loadAllVendors = async () => {
    const { data } = await supabase
      .from("vendors")
      .select(`
        id,
        business_name,
        category,
        description,
        average_rating,
        total_reviews,
        total_bookings,
        years_experience,
        team_size,
        verified,
        website_url,
        instagram_handle,
        city:cities(name, state),
        services:vendor_services(service_name, base_price, price_range_min, price_range_max)
      `)
      .eq("is_active", true)
      .eq("verified", true)
      .order("average_rating", { ascending: false })
      .limit(20);

    if (data) {
      setAllVendors(data.filter(v => !vendorIds.includes(v.id)) as unknown as VendorData[]);
    }
    setShowAddModal(true);
  };

  const addVendor = (vendorId: string) => {
    if (vendorIds.length >= 4) return;
    const newIds = [...vendorIds, vendorId];
    setSearchParams({ vendors: newIds.join(",") });
    setShowAddModal(false);
  };

  const removeVendor = (vendorId: string) => {
    const newIds = vendorIds.filter(id => id !== vendorId);
    if (newIds.length > 0) {
      setSearchParams({ vendors: newIds.join(",") });
    } else {
      setSearchParams({});
    }
  };

  const clearAll = () => {
    setSearchParams({});
    setVendors([]);
  };

  const getFeatureValue = (vendor: VendorData, key: string) => {
    switch (key) {
      case "rating":
        return vendor.average_rating ? (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-semibold">{vendor.average_rating.toFixed(1)}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        );
      case "reviews":
        return <span>{vendor.total_reviews || 0}</span>;
      case "bookings":
        return <span>{vendor.total_bookings || 0}</span>;
      case "experience":
        return vendor.years_experience ? (
          <span>{vendor.years_experience}+ years</span>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        );
      case "team":
        return vendor.team_size ? (
          <span>{vendor.team_size} members</span>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        );
      case "verified":
        return vendor.verified ? (
          <div className="flex items-center gap-1 text-green-600">
            <Check className="h-4 w-4" />
            <span>Verified</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-muted-foreground">
            <X className="h-4 w-4" />
            <span>Not Verified</span>
          </div>
        );
      case "location":
        return vendor.city ? (
          <span>{vendor.city.name}, {vendor.city.state}</span>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        );
      case "website":
        return vendor.website_url ? (
          <a 
            href={vendor.website_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1"
          >
            Visit <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        );
      case "instagram":
        return vendor.instagram_handle ? (
          <a 
            href={`https://instagram.com/${vendor.instagram_handle.replace("@", "")}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {vendor.instagram_handle}
          </a>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        );
      default:
        return null;
    }
  };

  const getLowestPrice = (vendor: VendorData) => {
    if (!vendor.services || vendor.services.length === 0) return null;
    const prices = vendor.services
      .map(s => s.base_price || s.price_range_min)
      .filter((p): p is number => p !== null);
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "Contact for price";
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 via-rose-50/50 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-accent text-accent-foreground mb-4">
              <Scale className="h-3 w-3 mr-1" />
              Comparison Tool
            </Badge>
            <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Compare <span className="text-accent">Vendors</span> Side by Side
            </h1>
            <div className="w-24 h-1 bg-primary/30 mx-auto rounded-full mb-4" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select up to 4 vendors to compare their ratings, pricing, services, and more. 
              Make an informed decision for your wedding.
            </p>
          </div>
        </div>
      </section>

      {/* Main Comparison Area */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : vendors.length === 0 ? (
            /* Empty State */
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <Scale className="h-10 w-10 text-accent" />
              </div>
              <h2 className="font-display font-semibold text-2xl mb-4">
                No Vendors Selected
              </h2>
              <p className="text-muted-foreground mb-8">
                Start by adding vendors to compare. You can add vendors from the search results 
                or browse our categories.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button onClick={loadAllVendors} size="lg" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Vendors to Compare
                </Button>
                <Link to="/search">
                  <Button variant="outline" size="lg" className="gap-2">
                    Browse Vendors
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Actions Bar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Comparing {vendors.length} vendor{vendors.length > 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-2">
                  {vendors.length < 4 && (
                    <Button variant="outline" size="sm" onClick={loadAllVendors} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Vendor
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={clearAll} className="gap-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </Button>
                </div>
              </div>

              {/* Comparison Table */}
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1 md:hidden">
                <span>←</span> Scroll horizontally to compare <span>→</span>
              </p>
              <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <div className="min-w-[600px] md:min-w-[800px]">
                  {/* Vendor Headers */}
                  <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${vendors.length}, 1fr)` }}>
                    <div className="p-4" />
                    {vendors.map((vendor) => (
                      <Card key={vendor.id} className="p-4 bg-white shadow-[var(--shadow-sm)] relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => removeVendor(vendor.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl font-bold text-accent">
                              {vendor.business_name.charAt(0)}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-1">{vendor.business_name}</h3>
                          <Badge variant="outline" className="capitalize mb-3">
                            {vendor.category}
                          </Badge>
                          <div className="text-xl font-bold text-primary mb-3">
                            {formatPrice(getLowestPrice(vendor))}
                            {getLowestPrice(vendor) && (
                              <span className="text-xs font-normal text-muted-foreground block">
                                starting price
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2 justify-center">
                            <Link to={`/vendors/${vendor.id}`}>
                              <Button size="sm" className="gap-1">
                                View Profile
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Features Comparison */}
                  <div className="mt-6 space-y-2">
                    {comparisonFeatures.map((feature, index) => (
                      <div 
                        key={feature.key} 
                        className="grid gap-4 items-center py-3 px-4 rounded-lg hover:bg-muted/30 transition-colors"
                        style={{ 
                          gridTemplateColumns: `200px repeat(${vendors.length}, 1fr)`,
                          backgroundColor: index % 2 === 0 ? "transparent" : "hsl(var(--muted) / 0.2)"
                        }}
                      >
                        <div className="flex items-center gap-2 font-medium text-sm">
                          <feature.icon className="h-4 w-4 text-muted-foreground" />
                          {feature.label}
                        </div>
                        {vendors.map((vendor) => (
                          <div key={vendor.id} className="text-sm">
                            {getFeatureValue(vendor, feature.key)}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Services Comparison */}
                  <div className="mt-8">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-accent" />
                      Services & Pricing
                    </h3>
                    <div 
                      className="grid gap-4"
                      style={{ gridTemplateColumns: `200px repeat(${vendors.length}, 1fr)` }}
                    >
                      <div className="p-4 font-medium text-sm">Available Services</div>
                      {vendors.map((vendor) => (
                        <Card key={vendor.id} className="p-4 bg-white/50">
                          {vendor.services && vendor.services.length > 0 ? (
                            <ul className="space-y-2">
                              {vendor.services.slice(0, 5).map((service, idx) => (
                                <li key={idx} className="flex items-start justify-between text-sm">
                                  <span>{service.service_name}</span>
                                  <span className="font-medium text-primary">
                                    {service.base_price 
                                      ? `₹${service.base_price.toLocaleString("en-IN")}`
                                      : service.price_range_min
                                        ? `₹${service.price_range_min.toLocaleString("en-IN")}+`
                                        : "Contact"
                                    }
                                  </span>
                                </li>
                              ))}
                              {vendor.services.length > 5 && (
                                <li className="text-xs text-muted-foreground">
                                  +{vendor.services.length - 5} more services
                                </li>
                              )}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">No services listed</p>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Description Comparison */}
                  <div className="mt-8">
                    <h3 className="font-semibold text-lg mb-4">About the Vendors</h3>
                    <div 
                      className="grid gap-4"
                      style={{ gridTemplateColumns: `200px repeat(${vendors.length}, 1fr)` }}
                    >
                      <div className="p-4 font-medium text-sm">Description</div>
                      {vendors.map((vendor) => (
                        <Card key={vendor.id} className="p-4 bg-white/50">
                          <p className="text-sm text-muted-foreground line-clamp-4">
                            {vendor.description || "No description available"}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden bg-white">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="font-semibold text-lg">Add Vendor to Compare</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {allVendors.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No more vendors available to compare
                </p>
              ) : (
                <div className="space-y-3">
                  {allVendors.map((vendor) => (
                    <div 
                      key={vendor.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:border-accent/50 hover:bg-accent/5 transition-colors cursor-pointer"
                      onClick={() => addVendor(vendor.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-accent">
                            {vendor.business_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{vendor.business_name}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {vendor.category} • {vendor.city?.name || "India"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {vendor.average_rating && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-accent text-accent" />
                            {vendor.average_rating.toFixed(1)}
                          </div>
                        )}
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Tips Section */}
      <section className="py-12 bg-gradient-to-b from-white to-rose-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display font-semibold text-xl mb-6 text-center">
              Tips for Choosing the Right Vendor
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Check Reviews",
                  desc: "Read detailed reviews from real couples who booked the vendor",
                },
                {
                  title: "Compare Pricing",
                  desc: "Ensure services match your budget and expectations",
                },
                {
                  title: "Verify Experience",
                  desc: "Look for vendors with experience in your wedding style",
                },
              ].map((tip, index) => (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-3">
                    <Check className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-medium mb-1">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}