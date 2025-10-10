import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { Link, useParams } from "react-router-dom";
import { 
  Camera, 
  Home as HomeIcon, 
  UtensilsCrossed, 
  Palette, 
  Sparkles, 
  Heart,
  Music,
  Users,
  Mail,
  Truck,
  User,
  BookOpen,
  Flower2
} from "lucide-react";
import photographyImage from "@/assets/category-photography.jpg";
import venueImage from "@/assets/category-venue.jpg";
import mehendiImage from "@/assets/category-mehendi.jpg";

const Categories = () => {
  const { category } = useParams();

  const allCategories = [
    { id: "photography", name: "Photography", icon: Camera, image: photographyImage, description: "Capture your special moments with verified professional photographers" },
    { id: "venues", name: "Venues", icon: HomeIcon, image: venueImage, description: "Find the perfect location for your dream wedding celebration" },
    { id: "catering", name: "Catering", icon: UtensilsCrossed, image: mehendiImage, description: "Delicious cuisine that delights your guests" },
    { id: "decor", name: "Decor", icon: Palette, image: venueImage, description: "Transform your venue into a magical wonderland" },
    { id: "makeup", name: "Makeup", icon: Sparkles, image: photographyImage, description: "Look stunning on your special day" },
    { id: "mehendi", name: "Mehendi", icon: Heart, image: mehendiImage, description: "Beautiful henna art for brides and guests" },
    { id: "music", name: "Music/DJ", icon: Music, image: photographyImage, description: "Keep the energy high with professional entertainment" },
    { id: "pandit", name: "Pandit", icon: User, image: venueImage, description: "Experienced priests for traditional ceremonies" },
    { id: "invites", name: "Invitations", icon: Mail, image: mehendiImage, description: "Elegant cards that set the tone for your wedding" },
    { id: "baraat", name: "Baraat", icon: Users, image: photographyImage, description: "Grand procession vehicles and arrangements" },
    { id: "hospitality", name: "Hospitality", icon: HomeIcon, image: venueImage, description: "Comfortable stays for your wedding guests" },
    { id: "logistics", name: "Logistics", icon: Truck, image: photographyImage, description: "Seamless coordination and transportation" },
  ];

  const currentCategory = category 
    ? allCategories.find(c => c.id === category)
    : null;

  // Mock vendor data
  const vendors = [
    { 
      id: 1, 
      name: "Lucknow Lens Photography", 
      city: "Lucknow",
      rating: 4.9,
      reviews: 128,
      priceRange: "₹50,000 - ₹2,00,000",
      responseTime: "2 hours",
      badges: ["Verified", "Top Rated", "Fast Response"],
      image: photographyImage
    },
    { 
      id: 2, 
      name: "Royal Palace Banquets", 
      city: "Lucknow",
      rating: 4.8,
      reviews: 96,
      priceRange: "₹3,00,000 - ₹10,00,000",
      responseTime: "4 hours",
      badges: ["Verified", "Premium"],
      image: venueImage
    },
    { 
      id: 3, 
      name: "Spice Route Catering", 
      city: "Delhi",
      rating: 4.7,
      reviews: 84,
      priceRange: "₹800 - ₹2,500/plate",
      responseTime: "3 hours",
      badges: ["Verified", "Budget Friendly"],
      image: mehendiImage
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4">
          {currentCategory ? (
            <div className="max-w-4xl mx-auto text-center animate-fade-up">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/60 rounded-full flex items-center justify-center mx-auto mb-6">
                <currentCategory.icon className="h-10 w-10 text-primary" />
              </div>
              <h1 className="font-display font-bold text-5xl mb-4">{currentCategory.name}</h1>
              <p className="text-xl text-muted-foreground mb-8">{currentCategory.description}</p>
              
              {/* SEO Copy */}
              <GlassCard className="p-6 text-left">
                <p className="text-muted-foreground leading-relaxed">
                  Find the best {currentCategory.name.toLowerCase()} vendors in Lucknow, Delhi, and Mumbai. 
                  All our vendors are verified, with transparent pricing and milestone payment protection. 
                  Compare packages, read verified reviews, and book with confidence for your dream wedding.
                </p>
              </GlassCard>
            </div>
          ) : (
            <div className="text-center animate-fade-up">
              <h1 className="font-display font-bold text-5xl mb-4">Explore All Categories</h1>
              <p className="text-xl text-muted-foreground">
                Find verified vendors across every wedding service
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Grid or Vendor List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {currentCategory ? (
            // Vendor List View
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <p className="text-muted-foreground">
                  Showing {vendors.length} verified vendors
                </p>
                <select className="glass px-4 py-2 rounded-full text-sm">
                  <option>Sort by: Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Highest Rated</option>
                  <option>Fastest Response</option>
                </select>
              </div>

              <div className="space-y-6">
                {vendors.map((vendor, i) => (
                  <Link key={vendor.id} to={`/vendors/${vendor.id}`}>
                    <GlassCard 
                      hover
                      className="overflow-hidden animate-fade-up"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="aspect-square md:aspect-auto">
                          <img 
                            src={vendor.image} 
                            alt={vendor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:col-span-2 p-6">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {vendor.badges.map((badge, idx) => (
                              <span 
                                key={idx}
                                className="glass-subtle px-3 py-1 rounded-full text-xs font-medium"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                          <h3 className="font-display font-semibold text-2xl mb-2">{vendor.name}</h3>
                          <p className="text-muted-foreground mb-4">{vendor.city}</p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Rating</p>
                              <p className="font-semibold">⭐ {vendor.rating} ({vendor.reviews} reviews)</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Response Time</p>
                              <p className="font-semibold">{vendor.responseTime}</p>
                            </div>
                          </div>
                          
                          <div className="border-t border-border/50 pt-4">
                            <p className="text-sm text-muted-foreground mb-1">Price Range</p>
                            <p className="font-display font-semibold text-xl text-accent">{vendor.priceRange}</p>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            // All Categories Grid
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {allCategories.map((cat, i) => (
                <Link 
                  key={cat.id}
                  to={`/category/${cat.id}`}
                >
                  <GlassCard 
                    hover
                    className="overflow-hidden animate-fade-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="aspect-square relative overflow-hidden group">
                      <img 
                        src={cat.image} 
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                    </div>
                    <div className="p-4 text-center">
                      <cat.icon className="h-6 w-6 mx-auto mb-2 text-accent" />
                      <h3 className="font-display font-semibold text-lg">{cat.name}</h3>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Categories;
