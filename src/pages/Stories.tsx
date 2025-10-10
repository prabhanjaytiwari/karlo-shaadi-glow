import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { Heart, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-wedding.jpg";
import photographyImage from "@/assets/category-photography.jpg";
import venueImage from "@/assets/category-venue.jpg";
import mehendiImage from "@/assets/category-mehendi.jpg";

const Stories = () => {
  const stories = [
    {
      id: 1,
      couple: "Priya & Raj",
      city: "Lucknow",
      date: "December 2024",
      budget: "₹8-12 lakhs",
      guests: 400,
      theme: "Royal Nawabi",
      image: heroImage,
      quote: "Karlo Shaadi made our dream wedding stress-free. Every vendor was verified and professional!",
      highlights: ["Photography by Lucknow Lens", "Venue: La Palais", "Decor: Marigold Dreams"]
    },
    {
      id: 2,
      couple: "Ananya & Vikram",
      city: "Delhi",
      date: "November 2024",
      budget: "₹15-20 lakhs",
      guests: 600,
      theme: "Modern Minimalist",
      image: photographyImage,
      quote: "The milestone payment system gave us complete peace of mind throughout planning.",
      highlights: ["Photography by Capital Captures", "Venue: ITC Maurya", "Catering: Spice Route"]
    },
    {
      id: 3,
      couple: "Kavya & Arjun",
      city: "Mumbai",
      date: "January 2025",
      budget: "₹20-25 lakhs",
      guests: 500,
      theme: "Coastal Romance",
      image: venueImage,
      quote: "AI matchmaking helped us find vendors that perfectly matched our style and budget.",
      highlights: ["Photography by Marine Drive Studios", "Venue: Taj Mahal Palace", "Makeup: Glam Squad"]
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="font-display font-bold text-5xl mb-4">
              Real Wedding Stories
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get inspired by couples who planned their dream weddings with Karlo Shaadi
            </p>
            
            {/* Filter Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {["All Stories", "Budget Friendly", "Luxury", "Destination", "Traditional", "Modern"].map((filter, i) => (
                <button
                  key={i}
                  className="glass-subtle px-4 py-2 rounded-full text-sm hover:glass-intense transition-all"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, i) => (
              <Link key={story.id} to={`/stories/${story.id}`}>
                <GlassCard 
                  hover
                  className="overflow-hidden h-full animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Image */}
                  <div className="aspect-[4/3] relative overflow-hidden group">
                    <img 
                      src={story.image} 
                      alt={story.couple}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="glass-intense px-3 py-1 rounded-full text-xs font-semibold">
                        {story.theme}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-display font-semibold text-2xl mb-2">{story.couple}</h3>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{story.city}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{story.guests} guests</span>
                      </div>
                    </div>

                    <p className="font-quote italic text-muted-foreground mb-4 line-clamp-2">
                      "{story.quote}"
                    </p>

                    <div className="pt-4 border-t border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">Budget: {story.budget}</p>
                      <div className="flex flex-wrap gap-2">
                        {story.highlights.slice(0, 2).map((highlight, idx) => (
                          <span 
                            key={idx}
                            className="text-xs bg-accent/10 text-accent-foreground px-2 py-1 rounded-full"
                          >
                            {highlight.split(":")[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="glass-subtle px-8 py-3 rounded-full font-semibold hover:glass-intense transition-all">
              Load More Stories
            </button>
          </div>
        </div>
      </section>

      {/* Share Your Story CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <GlassCard variant="intense" className="max-w-2xl mx-auto p-12 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-accent" />
            <h2 className="font-display font-bold text-3xl mb-4">
              Share Your Wedding Story
            </h2>
            <p className="text-muted-foreground mb-6">
              Inspire other couples and help vendors showcase their amazing work
            </p>
            <button className="glass-subtle px-8 py-3 rounded-full font-semibold hover:glass-intense transition-all">
              Submit Your Story →
            </button>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Stories;
