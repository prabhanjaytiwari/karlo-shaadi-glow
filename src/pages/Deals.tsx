import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Percent, Clock, Gift, Star, ArrowRight, Calendar, IndianRupee, Heart, Zap } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import dealMonsoonImg from "@/assets/deal-monsoon-wedding.jpg";
import dealWinterImg from "@/assets/deal-winter-wedding.jpg";
import dealEarlyImg from "@/assets/deal-early-bird.jpg";

interface VendorDiscount {
  id: string;
  vendor_id: string;
  discount_percentage: number;
  discount_type: string;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  vendor: {
    business_name: string;
    category: string;
    city: { name: string } | null;
  };
}

const seasonalOffers = [
  { title: "Shaadi Season Special", description: "Book any 3 vendors together and get 10% off", discount: "10% OFF", badge: "Bundle Deal", icon: Heart, validUntil: "March 31, 2025", image: dealMonsoonImg },
  { title: "Early Bird Discount", description: "Plan ahead! Book 6+ months before your wedding", discount: "15% OFF", badge: "Early Bird", icon: Calendar, validUntil: "Ongoing", image: dealEarlyImg },
  { title: "Winter Wedding Offer", description: "Special rates for winter weddings Nov-Feb", discount: "Up to 20% OFF", badge: "Seasonal", icon: Tag, validUntil: "February 28, 2026", image: dealWinterImg },
];

const cashbackOffers = [
  { title: "First Booking Cashback", description: "Get ₹2,000 cashback on your first vendor booking", amount: "₹2,000", condition: "Min. ₹50,000 booking", icon: Gift },
  { title: "Premium Member Bonus", description: "Extra 5% cashback for premium plan subscribers", amount: "5% Extra", condition: "Premium members only", icon: Star },
  { title: "Refer & Earn", description: "Refer a friend and both get ₹1,000 credit", amount: "₹1,000", condition: "Per successful referral", icon: Zap },
];

const exclusiveDeals = [
  { category: "Photography", title: "Pre-Wedding Shoot Free", description: "Complimentary pre-wedding shoot with full-day wedding coverage", originalPrice: "₹1,50,000", dealPrice: "₹1,20,000", savings: "30,000", vendorCount: 12 },
  { category: "Catering", title: "Welcome Drink Upgrade", description: "Free welcome drink station with 300+ guest bookings", originalPrice: "₹25,000", dealPrice: "FREE", savings: "25,000", vendorCount: 8 },
  { category: "Decoration", title: "Mandap Upgrade", description: "Premium mandap decoration at standard package price", originalPrice: "₹2,00,000", dealPrice: "₹1,50,000", savings: "50,000", vendorCount: 15 },
  { category: "Venues", title: "DJ Night Included", description: "Complimentary DJ setup with 2-day venue booking", originalPrice: "₹50,000", dealPrice: "FREE", savings: "50,000", vendorCount: 6 },
];

export default function Deals() {
  const isMobile = useIsMobile();
  const [vendorDiscounts, setVendorDiscounts] = useState<VendorDiscount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDiscounts(); }, []);

  const loadDiscounts = async () => {
    try {
      const { data } = await supabase.from("vendor_discounts").select(`*, vendor:vendors(business_name, category, city:cities(name))`).eq("is_active", true).gte("valid_until", new Date().toISOString()).order("discount_percentage", { ascending: false }).limit(10);
      if (data) setVendorDiscounts(data as unknown as VendorDiscount[]);
    } catch (error) { console.error("Error loading discounts:", error); }
    finally { setLoading(false); }
  };

  const getDaysRemaining = (validUntil: string | null) => {
    if (!validUntil) return null;
    const days = differenceInDays(new Date(validUntil), new Date());
    return days > 0 ? days : 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title="Deals & Offers" />

      {/* Hero Banner */}
      <div className={`relative overflow-hidden ${isMobile ? 'h-44' : 'h-64 mt-16'}`}>
        <img src={dealMonsoonImg} alt="Wedding deals" className="w-full h-full object-cover" style={{ filter: 'contrast(1.03) saturate(1.08)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className={`absolute bottom-5 ${isMobile ? 'left-4 right-4' : 'left-12'}`}>
          <Badge variant="outline" className="mb-2 border-white/40 text-white text-xs"><Tag className="h-3 w-3 mr-1" />Exclusive Offers</Badge>
          <h1 className={`text-white font-bold ${isMobile ? 'text-2xl' : 'text-4xl'}`}>Wedding Deals & Discounts</h1>
        </div>
      </div>

      {/* Seasonal Offers - Horizontal scroll on mobile */}
      <section className={isMobile ? "py-5" : "py-10 px-4"}>
        <div className={isMobile ? "px-4" : "container mx-auto max-w-6xl"}>
          <h2 className={`font-bold ${isMobile ? 'text-lg mb-3' : 'text-2xl mb-6'}`}>Seasonal Offers</h2>
        </div>
        {isMobile ? (
          <div className="overflow-x-auto scrollbar-hide px-4">
            <div className="flex gap-3" style={{ width: 'max-content' }}>
              {seasonalOffers.map((offer, i) => (
                <div key={i} className="w-72 rounded-2xl border border-border/50 overflow-hidden shrink-0">
                  <div className="relative h-32">
                    <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" style={{ filter: 'contrast(1.03) saturate(1.08)' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <p className="text-white font-bold text-lg">{offer.discount}</p>
                      <p className="text-white/80 text-xs">{offer.title}</p>
                    </div>
                    <Badge className="absolute top-2 right-2 text-[10px]" variant="secondary">{offer.badge}</Badge>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-muted-foreground mb-2">{offer.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />Valid until {offer.validUntil}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-4">
              {seasonalOffers.map((offer, i) => (
                <div key={i} className="rounded-2xl border border-border/50 overflow-hidden hover:border-accent/30 hover:shadow-md transition-all">
                  <div className="relative h-40">
                    <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" style={{ filter: 'contrast(1.03) saturate(1.08)' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <p className="text-white font-bold text-2xl">{offer.discount}</p>
                      <p className="text-white/80 text-sm">{offer.title}</p>
                    </div>
                    <Badge className="absolute top-3 right-3" variant="secondary">{offer.badge}</Badge>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />Valid until {offer.validUntil}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Category Deals */}
      <section className={isMobile ? "px-4 py-5" : "py-10 px-4 bg-muted/20"}>
        <div className={isMobile ? "" : "container mx-auto max-w-6xl"}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>Category Deals</h2>
            <Link to="/search"><Button variant="ghost" size="sm" className="text-accent text-xs">View All<ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
          </div>
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'lg:grid-cols-4 gap-4'}`}>
            {exclusiveDeals.map((deal, i) => (
              <div key={i} className="rounded-2xl border border-border/50 p-4 hover:border-accent/30 hover:shadow-md transition-all bg-background">
                <Badge className="mb-2 bg-primary/10 text-primary border-0 text-[10px]">{deal.category}</Badge>
                <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'} mb-1`}>{deal.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{deal.description}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs text-muted-foreground line-through">{deal.originalPrice}</span>
                  <span className={`font-bold text-primary ${isMobile ? 'text-sm' : 'text-base'}`}>{deal.dealPrice}</span>
                </div>
                <div className="flex items-center text-accent text-xs font-medium">
                  <IndianRupee className="h-3 w-3 mr-0.5" />Save {deal.savings}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cashback */}
      <section className={isMobile ? "px-4 py-5" : "py-10 px-4"}>
        <div className={isMobile ? "" : "container mx-auto max-w-6xl"}>
          <h2 className={`font-bold ${isMobile ? 'text-lg mb-3' : 'text-2xl mb-6'}`}>Cashback & Rewards</h2>
          <div className={`grid ${isMobile ? 'gap-3' : 'sm:grid-cols-3 gap-4'}`}>
            {cashbackOffers.map((offer, i) => (
              <div key={i} className="rounded-2xl border border-border/50 p-4 hover:border-accent/30 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/15 to-primary/15 flex items-center justify-center shrink-0">
                    <offer.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm mb-0.5">{offer.title}</h3>
                    <p className="text-lg font-bold text-accent mb-1">{offer.amount}</p>
                    <p className="text-xs text-muted-foreground mb-2">{offer.description}</p>
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{offer.condition}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Vendor Discounts */}
      {vendorDiscounts.length > 0 && (
        <section className={isMobile ? "px-4 py-5" : "py-10 px-4 bg-muted/20"}>
          <div className={isMobile ? "" : "container mx-auto max-w-6xl"}>
            <div className="flex items-center gap-2 mb-4">
              <Percent className="h-4 w-4 text-accent" />
              <h2 className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>Live Vendor Discounts</h2>
            </div>
            <div className={`grid ${isMobile ? 'gap-3' : 'sm:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
              {vendorDiscounts.map((discount) => {
                const daysRemaining = getDaysRemaining(discount.valid_until);
                return (
                  <div key={discount.id} className="rounded-2xl border border-border/50 p-4 hover:border-accent/30 transition-all bg-background">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-[10px] capitalize">{discount.discount_type}</Badge>
                      {daysRemaining !== null && daysRemaining <= 7 && <Badge variant="destructive" className="text-[10px]">{daysRemaining}d left</Badge>}
                    </div>
                    <h3 className="font-semibold text-sm mb-0.5">{discount.vendor?.business_name}</h3>
                    <p className="text-xs text-muted-foreground mb-2 capitalize">{discount.vendor?.category} • {discount.vendor?.city?.name || "India"}</p>
                    <span className="text-2xl font-bold text-accent">{discount.discount_percentage}%</span>
                    <span className="text-muted-foreground text-xs ml-1">OFF</span>
                    {discount.valid_until && <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border/50">Valid until {format(new Date(discount.valid_until), "MMM dd, yyyy")}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden py-10 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="relative container mx-auto max-w-3xl text-center">
          <h2 className={`font-bold ${isMobile ? 'text-xl' : 'text-3xl'} mb-3`}>Ready to Save?</h2>
          <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto">Explore verified vendors and book with confidence. Discounts applied automatically.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/search"><Button size="lg" className="rounded-full">Find Vendors<ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
            <Link to="/pricing"><Button size="lg" variant="outline" className="rounded-full">View Premium</Button></Link>
          </div>
        </div>
      </section>

      
    </div>
  );
}
