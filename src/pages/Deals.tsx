import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BhindiFooter } from "@/components/BhindiFooter";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tag, 
  Percent, 
  Clock, 
  Gift, 
  Sparkles, 
  Star, 
  ArrowRight,
  Calendar,
  BadgePercent,
  IndianRupee,
  Heart,
  Zap
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

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
  {
    title: "Shaadi Season Special",
    description: "Book any 3 vendors together and get 10% off on total booking",
    discount: "10% OFF",
    badge: "Bundle Deal",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    validUntil: "March 31, 2025",
  },
  {
    title: "Early Bird Discount",
    description: "Plan ahead! Book 6+ months before your wedding date",
    discount: "15% OFF",
    badge: "Early Bird",
    icon: Calendar,
    color: "from-amber-500 to-orange-500",
    validUntil: "Ongoing",
  },
  {
    title: "Monsoon Wedding Offer",
    description: "Special rates for weddings during July-September",
    discount: "Up to 20% OFF",
    badge: "Seasonal",
    icon: Sparkles,
    color: "from-emerald-500 to-teal-500",
    validUntil: "September 30, 2025",
  },
];

const cashbackOffers = [
  {
    title: "First Booking Cashback",
    description: "Get ₹2,000 cashback on your first vendor booking",
    cashback: "₹2,000",
    minOrder: "Min. ₹50,000 booking",
    icon: Gift,
  },
  {
    title: "Premium Member Bonus",
    description: "Extra 5% cashback for premium plan subscribers",
    cashback: "5% Extra",
    minOrder: "Premium members only",
    icon: Star,
  },
  {
    title: "Refer & Earn",
    description: "Refer a friend and both get ₹1,000 credit",
    cashback: "₹1,000",
    minOrder: "Per successful referral",
    icon: Zap,
  },
];

const exclusiveDeals = [
  {
    category: "Photography",
    title: "Pre-Wedding Shoot Free",
    description: "Get a complimentary pre-wedding shoot with full-day wedding coverage",
    originalPrice: "₹1,50,000",
    dealPrice: "₹1,20,000",
    savings: "₹30,000",
    vendorCount: 12,
  },
  {
    category: "Catering",
    title: "Welcome Drink Upgrade",
    description: "Free welcome drink station upgrade with 300+ guest bookings",
    originalPrice: "₹25,000",
    dealPrice: "FREE",
    savings: "₹25,000",
    vendorCount: 8,
  },
  {
    category: "Decoration",
    title: "Mandap Upgrade",
    description: "Premium mandap decoration at standard package price",
    originalPrice: "₹2,00,000",
    dealPrice: "₹1,50,000",
    savings: "₹50,000",
    vendorCount: 15,
  },
  {
    category: "Venues",
    title: "DJ Night Included",
    description: "Complimentary DJ setup with 2-day venue booking",
    originalPrice: "₹50,000",
    dealPrice: "FREE",
    savings: "₹50,000",
    vendorCount: 6,
  },
];

export default function Deals() {
  const [vendorDiscounts, setVendorDiscounts] = useState<VendorDiscount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    try {
      const { data } = await supabase
        .from("vendor_discounts")
        .select(`
          *,
          vendor:vendors(
            business_name,
            category,
            city:cities(name)
          )
        `)
        .eq("is_active", true)
        .gte("valid_until", new Date().toISOString())
        .order("discount_percentage", { ascending: false })
        .limit(10);

      if (data) {
        setVendorDiscounts(data as unknown as VendorDiscount[]);
      }
    } catch (error) {
      console.error("Error loading discounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (validUntil: string | null) => {
    if (!validUntil) return null;
    const days = differenceInDays(new Date(validUntil), new Date());
    return days > 0 ? days : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 via-white to-amber-50/30 pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-rose-50/80 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <Badge className="bg-accent text-accent-foreground mb-4">
              <Tag className="h-3 w-3 mr-1" />
              Exclusive Offers
            </Badge>
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
              Wedding Deals & <span className="text-accent">Discounts</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 mx-auto rounded-full mb-6" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Save thousands on your dream wedding with exclusive deals, cashback offers, 
              and seasonal discounts from our verified vendors.
            </p>
          </div>
        </div>
      </section>

      {/* Seasonal Offers */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <BadgePercent className="h-6 w-6 text-accent" />
            <h2 className="font-display font-bold text-2xl">Seasonal Offers</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {seasonalOffers.map((offer, index) => (
              <GlassCard 
                key={index} 
                hover 
                className="relative overflow-hidden bg-white border-2 border-accent/20 hover:border-accent/50 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${offer.color} opacity-10 rounded-bl-full`} />
                <Badge className="mb-3 bg-accent/15 text-accent border-accent/30">
                  {offer.badge}
                </Badge>
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${offer.color} flex items-center justify-center`}>
                    <offer.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{offer.title}</h3>
                    <p className="text-2xl font-bold text-accent">{offer.discount}</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{offer.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Valid until {offer.validUntil}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Category Deals */}
      <section className="py-12 bg-gradient-to-b from-white to-rose-50/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent" />
              <h2 className="font-display font-bold text-2xl">Exclusive Deals by Category</h2>
            </div>
            <Link to="/search">
              <Button variant="outline" className="gap-2">
                View All Vendors
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {exclusiveDeals.map((deal, index) => (
              <GlassCard 
                key={index} 
                hover 
                className="bg-white border-2 border-accent/20 hover:border-accent/50 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Badge variant="outline" className="mb-3 text-xs">
                  {deal.category}
                </Badge>
                <h3 className="font-semibold text-lg mb-2">{deal.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{deal.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground line-through">{deal.originalPrice}</span>
                    <span className="font-bold text-primary">{deal.dealPrice}</span>
                  </div>
                  <div className="flex items-center gap-1 text-accent text-sm font-medium">
                    <IndianRupee className="h-3 w-3" />
                    <span>Save {deal.savings}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{deal.vendorCount} vendors offering</span>
                  <Link to={`/category/${deal.category.toLowerCase()}`}>
                    <Button size="sm" variant="ghost" className="h-8 text-xs">
                      Explore
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Cashback Offers */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <Gift className="h-6 w-6 text-accent" />
            <h2 className="font-display font-bold text-2xl">Cashback & Rewards</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {cashbackOffers.map((offer, index) => (
              <GlassCard 
                key={index} 
                hover 
                className="bg-gradient-to-br from-white to-amber-50/50 border-2 border-accent/20 hover:border-accent/50 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                    <offer.icon className="h-7 w-7 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{offer.title}</h3>
                    <p className="text-2xl font-bold text-accent mb-2">{offer.cashback}</p>
                    <p className="text-sm text-muted-foreground mb-2">{offer.description}</p>
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                      {offer.minOrder}
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Live Vendor Discounts */}
      {vendorDiscounts.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-rose-50/30 to-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <Percent className="h-6 w-6 text-accent" />
              <h2 className="font-display font-bold text-2xl">Live Vendor Discounts</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendorDiscounts.map((discount, index) => {
                const daysRemaining = getDaysRemaining(discount.valid_until);
                return (
                  <GlassCard 
                    key={discount.id} 
                    hover 
                    className="bg-white border-2 border-accent/20 hover:border-accent/50 animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-primary/15 text-primary">
                        {discount.discount_type}
                      </Badge>
                      {daysRemaining !== null && daysRemaining <= 7 && (
                        <Badge variant="destructive" className="text-xs">
                          {daysRemaining} days left
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{discount.vendor?.business_name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 capitalize">
                      {discount.vendor?.category} • {discount.vendor?.city?.name || "India"}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-accent">
                        {discount.discount_percentage}%
                      </span>
                      <span className="text-muted-foreground">OFF</span>
                    </div>
                    {discount.valid_until && (
                      <p className="text-xs text-muted-foreground mt-3">
                        Valid until {format(new Date(discount.valid_until), "MMM dd, yyyy")}
                      </p>
                    )}
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="font-display font-bold text-2xl mb-4">How to Redeem Offers</h2>
            <p className="text-muted-foreground">
              Availing these deals is simple. Follow these steps to save on your wedding.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Browse Deals", desc: "Explore available offers and discounts" },
              { step: "2", title: "Select Vendor", desc: "Choose a vendor with active offers" },
              { step: "3", title: "Book Service", desc: "Complete your booking through Karlo Shaadi" },
              { step: "4", title: "Save Money", desc: "Discount applied automatically at checkout" },
            ].map((item, index) => (
              <div 
                key={index} 
                className="text-center animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary text-white font-bold text-xl flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-rose-50/80 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Explore our verified vendors and book with confidence. All deals are applied automatically.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/search">
              <Button size="lg" className="gap-2">
                Find Vendors
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="gap-2">
                View Premium Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <BhindiFooter />
    </div>
  );
}