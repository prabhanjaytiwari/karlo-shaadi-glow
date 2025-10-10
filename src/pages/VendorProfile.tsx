import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { 
  MapPin, 
  Clock, 
  Star, 
  Shield, 
  MessageCircle,
  Calendar,
  IndianRupee,
  Award,
  CheckCircle2
} from "lucide-react";
import heroImage from "@/assets/hero-wedding.jpg";
import photographyImage from "@/assets/category-photography.jpg";
import venueImage from "@/assets/category-venue.jpg";

const VendorProfile = () => {
  const { id } = useParams();

  // Mock vendor data
  const vendor = {
    id: 1,
    name: "Lucknow Lens Photography",
    category: "Photography",
    city: "Lucknow",
    rating: 4.9,
    reviewCount: 128,
    responseTime: "2 hours",
    yearsActive: 8,
    weddingsDone: 450,
    badges: ["Verified", "Top Rated", "Fast Response", "On-time Pro"],
    description: "Award-winning wedding photography team specializing in candid moments and cinematic storytelling. We capture the essence of your special day with artistic flair and technical excellence.",
    whyMatched: [
      { factor: "Budget Fit", score: 95, reason: "Within your ₹50k-2L range" },
      { factor: "Availability", score: 100, reason: "Available on your date" },
      { factor: "Style Match", score: 88, reason: "Candid + Traditional mix" },
      { factor: "Location", score: 92, reason: "Based in Lucknow" }
    ],
    packages: [
      {
        name: "Essential",
        price: "₹50,000",
        features: ["1 Photographer", "1 Videographer", "8 Hours Coverage", "300+ Edited Photos", "Highlight Video", "Online Gallery"]
      },
      {
        name: "Premium",
        price: "₹1,20,000",
        features: ["2 Photographers", "2 Videographers", "Full Day Coverage", "600+ Edited Photos", "Cinematic Film", "Albums + Frames", "Pre-wedding Shoot", "Drone Coverage"]
      },
      {
        name: "Royal",
        price: "₹2,00,000",
        features: ["3 Photographers", "3 Videographers", "Multi-day Coverage", "1000+ Edited Photos", "Feature Film", "Premium Albums", "2 Pre-wedding Shoots", "Live Streaming", "Same Day Edit"]
      }
    ],
    gallery: [heroImage, photographyImage, venueImage],
    customerReviews: [
      {
        name: "Priya S.",
        rating: 5,
        date: "Dec 2024",
        comment: "Absolutely loved working with Lucknow Lens! They captured every emotion perfectly and were so professional throughout our wedding.",
        verified: true
      },
      {
        name: "Rahul M.",
        rating: 5,
        date: "Nov 2024",
        comment: "Best decision we made for our wedding! The photos are stunning and they delivered everything on time as promised.",
        verified: true
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Gallery Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <img 
          src={vendor.gallery[0]} 
          alt={vendor.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </section>

      {/* Sticky Action Bar (Mobile) */}
      <div className="lg:hidden sticky top-16 z-40 glass border-b border-border/50 p-4">
        <div className="flex gap-3">
          <Button variant="hero" className="flex-1">
            Check Availability
          </Button>
          <Button variant="outline" size="icon">
            <MessageCircle className="h-4 w-4" />
          </Button>
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
                  {vendor.badges.map((badge, i) => (
                    <span 
                      key={i}
                      className="glass-subtle px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                    >
                      {badge === "Verified" && <Shield className="h-3 w-3" />}
                      {badge}
                    </span>
                  ))}
                </div>

                <h1 className="font-display font-bold text-4xl mb-2">{vendor.name}</h1>
                <p className="text-muted-foreground text-lg mb-4">{vendor.category}</p>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span>{vendor.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-accent fill-accent" />
                    <span className="font-semibold">{vendor.rating}</span>
                    <span className="text-muted-foreground">({vendor.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent" />
                    <span>Responds in {vendor.responseTime}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
                  <div className="text-center">
                    <p className="font-display font-bold text-2xl text-accent">{vendor.yearsActive}+</p>
                    <p className="text-sm text-muted-foreground">Years Active</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-2xl text-accent">{vendor.weddingsDone}+</p>
                    <p className="text-sm text-muted-foreground">Weddings</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-2xl text-accent">100%</p>
                    <p className="text-sm text-muted-foreground">On Time</p>
                  </div>
                </div>
              </GlassCard>

              {/* About */}
              <GlassCard className="p-6 md:p-8 animate-fade-up">
                <h2 className="font-display font-bold text-2xl mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed">{vendor.description}</p>
              </GlassCard>

              {/* Why Matched */}
              <GlassCard className="p-6 md:p-8 animate-fade-up">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="h-6 w-6 text-accent" />
                  <h2 className="font-display font-bold text-2xl">Why We Matched You</h2>
                </div>
                
                <div className="space-y-4">
                  {vendor.whyMatched.map((match, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{match.factor}</span>
                        <span className="text-accent font-bold">{match.score}%</span>
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

              {/* Packages */}
              <GlassCard className="p-6 md:p-8 animate-fade-up">
                <h2 className="font-display font-bold text-2xl mb-6">Packages & Pricing</h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {vendor.packages.map((pkg, i) => (
                    <div 
                      key={i}
                      className={`glass-subtle p-6 rounded-2xl ${i === 1 ? 'ring-2 ring-accent' : ''}`}
                    >
                      {i === 1 && (
                        <span className="inline-block bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full mb-3">
                          POPULAR
                        </span>
                      )}
                      <h3 className="font-display font-bold text-xl mb-2">{pkg.name}</h3>
                      <p className="font-display font-bold text-3xl text-accent mb-6">{pkg.price}</p>
                      <ul className="space-y-3">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground mt-6 text-center">
                  💳 Milestone payments available • 🔒 Escrow protection • 📝 E-contract included
                </p>
              </GlassCard>

              {/* Reviews */}
              <GlassCard className="p-6 md:p-8 animate-fade-up">
                <h2 className="font-display font-bold text-2xl mb-6">
                  Verified Reviews ({vendor.customerReviews.length})
                </h2>
                
                <div className="space-y-6">
                  {vendor.customerReviews.map((review, i) => (
                    <div key={i} className="pb-6 border-b border-border/50 last:border-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{review.name}</p>
                            {review.verified && (
                              <span className="text-xs glass-subtle px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-accent fill-accent" />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Right Column - Actions (Desktop) */}
            <div className="hidden lg:block">
              <GlassCard className="p-6 sticky top-24 space-y-4">
                <Button variant="hero" size="lg" className="w-full">
                  <Calendar className="h-4 w-4" />
                  Check Availability
                </Button>
                <Button variant="secondary" size="lg" className="w-full">
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </Button>
                <Button variant="outline" size="lg" className="w-full">
                  View Contract Preview
                </Button>

                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground text-center">
                    ✓ Response within {vendor.responseTime}<br />
                    ✓ Milestone payment protection<br />
                    ✓ SLA guarantee
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VendorProfile;
