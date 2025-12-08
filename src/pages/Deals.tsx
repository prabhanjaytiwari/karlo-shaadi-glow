import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tag, 
  Percent, 
  Clock, 
  Gift, 
  Star, 
  ArrowRight,
  Calendar,
  IndianRupee,
  Heart,
  Zap,
  CheckCircle
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
    validUntil: "March 31, 2025",
  },
  {
    title: "Early Bird Discount",
    description: "Plan ahead! Book 6+ months before your wedding date",
    discount: "15% OFF",
    badge: "Early Bird",
    icon: Calendar,
    validUntil: "Ongoing",
  },
  {
    title: "Monsoon Wedding Offer",
    description: "Special rates for weddings during July-September",
    discount: "Up to 20% OFF",
    badge: "Seasonal",
    icon: Tag,
    validUntil: "September 30, 2025",
  },
];

const cashbackOffers = [
  {
    title: "First Booking Cashback",
    description: "Get ₹2,000 cashback on your first vendor booking",
    amount: "₹2,000",
    condition: "Min. ₹50,000 booking",
    icon: Gift,
  },
  {
    title: "Premium Member Bonus",
    description: "Extra 5% cashback for premium plan subscribers",
    amount: "5% Extra",
    condition: "Premium members only",
    icon: Star,
  },
  {
    title: "Refer & Earn",
    description: "Refer a friend and both get ₹1,000 credit",
    amount: "₹1,000",
    condition: "Per successful referral",
    icon: Zap,
  },
];

const exclusiveDeals = [
  {
    category: "Photography",
    title: "Pre-Wedding Shoot Free",
    description: "Complimentary pre-wedding shoot with full-day wedding coverage",
    originalPrice: "₹1,50,000",
    dealPrice: "₹1,20,000",
    savings: "30,000",
    vendorCount: 12,
  },
  {
    category: "Catering",
    title: "Welcome Drink Upgrade",
    description: "Free welcome drink station with 300+ guest bookings",
    originalPrice: "₹25,000",
    dealPrice: "FREE",
    savings: "25,000",
    vendorCount: 8,
  },
  {
    category: "Decoration",
    title: "Mandap Upgrade",
    description: "Premium mandap decoration at standard package price",
    originalPrice: "₹2,00,000",
    dealPrice: "₹1,50,000",
    savings: "50,000",
    vendorCount: 15,
  },
  {
    category: "Venues",
    title: "DJ Night Included",
    description: "Complimentary DJ setup with 2-day venue booking",
    originalPrice: "₹50,000",
    dealPrice: "FREE",
    savings: "50,000",
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
    <div className="min-h-screen bg-background pt-16 sm:pt-20">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-rose-50/80 via-white to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 border-accent/40 text-accent">
              <Tag className="h-3 w-3 mr-1.5" />
              Exclusive Offers
            </Badge>
            <h1 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl mb-4 text-foreground">
              Wedding Deals & Discounts
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              Save on your dream wedding with exclusive deals from verified vendors
            </p>
          </div>
        </div>
      </section>

      {/* Seasonal Offers */}
      <section className="py-10 sm:py-14">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-semibold text-xl sm:text-2xl mb-6">Seasonal Offers</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {seasonalOffers.map((offer, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl border border-border p-5 sm:p-6 hover:border-accent/40 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <offer.icon className="h-5 w-5 text-accent" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {offer.badge}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-base sm:text-lg mb-1">{offer.title}</h3>
                <p className="text-2xl sm:text-3xl font-bold text-accent mb-3">{offer.discount}</p>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{offer.description}</p>
                
                <div className="flex items-center text-xs text-muted-foreground pt-3 border-t border-border">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  Valid until {offer.validUntil}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Category Deals */}
      <section className="py-10 sm:py-14 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-xl sm:text-2xl">Category Deals</h2>
            <Link to="/search">
              <Button variant="ghost" size="sm" className="text-accent hover:text-accent">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {exclusiveDeals.map((deal, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl border border-border p-5 hover:border-accent/40 hover:shadow-md transition-all duration-300"
              >
                <Badge className="mb-3 bg-primary/10 text-primary border-0 text-xs">
                  {deal.category}
                </Badge>
                <h3 className="font-semibold text-base mb-2">{deal.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{deal.description}</p>
                
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-sm text-muted-foreground line-through">{deal.originalPrice}</span>
                  <span className="text-lg font-bold text-primary">{deal.dealPrice}</span>
                </div>
                
                <div className="flex items-center text-accent text-sm font-medium mb-4">
                  <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                  Save {deal.savings}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">{deal.vendorCount} vendors</span>
                  <Link to={`/category/${deal.category.toLowerCase()}`}>
                    <Button size="sm" variant="ghost" className="h-7 text-xs px-2">
                      Explore
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cashback Offers */}
      <section className="py-10 sm:py-14">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-semibold text-xl sm:text-2xl mb-6">Cashback & Rewards</h2>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {cashbackOffers.map((offer, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl border border-border p-5 sm:p-6 hover:border-accent/40 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/15 to-primary/15 flex items-center justify-center flex-shrink-0">
                    <offer.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1">{offer.title}</h3>
                    <p className="text-xl sm:text-2xl font-bold text-accent mb-2">{offer.amount}</p>
                    <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>
                    <span className="inline-block text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                      {offer.condition}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Vendor Discounts */}
      {vendorDiscounts.length > 0 && (
        <section className="py-10 sm:py-14 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <Percent className="h-5 w-5 text-accent" />
              <h2 className="font-display font-semibold text-xl sm:text-2xl">Live Vendor Discounts</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendorDiscounts.map((discount) => {
                const daysRemaining = getDaysRemaining(discount.valid_until);
                return (
                  <div 
                    key={discount.id} 
                    className="bg-white rounded-xl border border-border p-5 hover:border-accent/40 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-xs capitalize">
                        {discount.discount_type}
                      </Badge>
                      {daysRemaining !== null && daysRemaining <= 7 && (
                        <Badge variant="destructive" className="text-xs">
                          {daysRemaining} days left
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-base mb-1">{discount.vendor?.business_name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 capitalize">
                      {discount.vendor?.category} • {discount.vendor?.city?.name || "India"}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-accent">
                        {discount.discount_percentage}%
                      </span>
                      <span className="text-muted-foreground text-sm">OFF</span>
                    </div>
                    {discount.valid_until && (
                      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                        Valid until {format(new Date(discount.valid_until), "MMM dd, yyyy")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-10 sm:py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-center mb-8">
              How to Redeem Offers
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { step: "1", title: "Browse", desc: "Explore offers" },
                { step: "2", title: "Select", desc: "Choose vendor" },
                { step: "3", title: "Book", desc: "Complete booking" },
                { step: "4", title: "Save", desc: "Auto-applied" },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent text-accent-foreground font-bold text-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base mb-0.5">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-rose-50/80 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-semibold text-2xl sm:text-3xl mb-3">
            Ready to Save?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm sm:text-base">
            Explore verified vendors and book with confidence. Discounts applied automatically.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/search">
              <Button size="lg">
                Find Vendors
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">
                View Premium
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <BhindiFooter />
    </div>
  );
}
