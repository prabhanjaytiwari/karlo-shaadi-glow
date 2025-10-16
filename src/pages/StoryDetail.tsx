import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, DollarSign, Heart, Share2, Camera, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-wedding.jpg";
import photographyImage from "@/assets/category-photography.jpg";
import venueImage from "@/assets/category-venue.jpg";
import decorImage from "@/assets/category-decoration.jpg";
import mehendiImage from "@/assets/category-mehendi.jpg";

const StoryDetail = () => {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);

  // In production, fetch from Supabase
  const stories: Record<string, any> = {
    "1": {
      id: 1,
      couple: "Priya & Raj",
      city: "Lucknow",
      date: "December 15, 2024",
      budget: "₹8-12 lakhs",
      guests: 400,
      theme: "Royal Nawabi",
      images: [heroImage, photographyImage, venueImage, decorImage, mehendiImage],
      story: `Our wedding was a dream come true, thanks to Karlo Shaadi's incredible platform. 
      We found all our vendors in one place, and the milestone payment system gave us complete peace of mind.
      
      The AI matchmaking helped us discover vendors we wouldn't have found otherwise, and every single one 
      exceeded our expectations. From the stunning venue to the magical decor, everything was perfect.
      
      Planning a wedding can be stressful, but Karlo Shaadi made it feel effortless. The vendor verification 
      gave us confidence, and the platform's organization kept us on track throughout the entire journey.`,
      quote: "Karlo Shaadi made our dream wedding stress-free. Every vendor was verified and professional!",
      vendors: [
        { category: "Photography", name: "Lucknow Lens", link: "/vendors/1", price: "₹80,000" },
        { category: "Venue", name: "La Palais Banquet", link: "/vendors/2", price: "₹3,50,000" },
        { category: "Decoration", name: "Marigold Dreams", link: "/vendors/3", price: "₹2,00,000" },
        { category: "Catering", name: "Royal Awadhi Kitchen", link: "/vendors/4", price: "₹1,50,000" },
        { category: "Makeup", name: "Bridal Glow Studio", link: "/vendors/5", price: "₹45,000" },
        { category: "Mehendi", name: "Henna Artistry", link: "/vendors/6", price: "₹25,000" },
      ],
      budgetBreakdown: [
        { category: "Venue", amount: 350000, percentage: 40 },
        { category: "Catering", amount: 150000, percentage: 17 },
        { category: "Decoration", amount: 200000, percentage: 23 },
        { category: "Photography", amount: 80000, percentage: 9 },
        { category: "Makeup & Mehendi", amount: 70000, percentage: 8 },
        { category: "Other", amount: 30000, percentage: 3 },
      ],
      timeline: [
        { month: "6 months before", task: "Booked venue and photographer" },
        { month: "4 months before", task: "Selected decorator and caterer" },
        { month: "2 months before", task: "Finalized makeup artist and mehendi" },
        { month: "1 month before", task: "Final vendor meetings and confirmations" },
      ],
      tips: [
        "Book your venue at least 6 months in advance during peak season",
        "Use milestone payments to manage your budget effectively",
        "Have a backup plan for outdoor events",
        "Trust your vendors - they're professionals!",
      ],
    },
  };

  const story = stories[id || "1"];

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Story not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={story.images[0]}
            alt={story.couple}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </div>

        <div className="container mx-auto px-4 relative z-10 pb-12">
          <div className="max-w-4xl animate-fade-up">
            <Badge className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              {story.theme}
            </Badge>
            <h1 className="font-display font-bold text-5xl md:text-6xl mb-4">
              {story.couple}
            </h1>
            <div className="flex flex-wrap gap-4 text-lg mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" />
                <span>{story.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                <span>{story.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                <span>{story.guests} guests</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant={liked ? "default" : "outline"}
                onClick={() => setLiked(!liked)}
                className="gap-2"
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                {liked ? "Liked" : "Like"}
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Story */}
            <GlassCard className="p-8">
              <h2 className="font-display font-bold text-3xl mb-6">Our Story</h2>
              <div className="prose prose-lg max-w-none">
                {story.story.split('\n\n').map((paragraph: string, i: number) => (
                  <p key={i} className="text-muted-foreground mb-4 leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>

              <div className="mt-8 p-6 bg-accent/5 border border-accent/20 rounded-lg">
                <Camera className="h-8 w-8 text-accent mb-3" />
                <p className="font-quote italic text-lg">
                  "{story.quote}"
                </p>
                <p className="text-sm text-muted-foreground mt-2">— {story.couple}</p>
              </div>
            </GlassCard>

            {/* Photo Gallery */}
            <GlassCard className="p-8">
              <h2 className="font-display font-bold text-3xl mb-6">Photo Gallery</h2>
              <div className="grid grid-cols-2 gap-4">
                {story.images.slice(1).map((image: string, i: number) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg overflow-hidden hover-lift cursor-pointer"
                  >
                    <img
                      src={image}
                      alt={`Wedding moment ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Vendors */}
            <GlassCard className="p-8">
              <h2 className="font-display font-bold text-3xl mb-6">Our Dream Team</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {story.vendors.map((vendor: any, i: number) => (
                  <Link key={i} to={vendor.link}>
                    <div className="glass-subtle p-4 rounded-lg hover:glass-intense transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-muted-foreground">{vendor.category}</p>
                          <h3 className="font-semibold group-hover:text-accent transition-colors">
                            {vendor.name}
                          </h3>
                        </div>
                        <Badge variant="secondary">{vendor.price}</Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 All vendors are verified by Karlo Shaadi with 100% payment protection
                </p>
              </div>
            </GlassCard>

            {/* Planning Timeline */}
            <GlassCard className="p-8">
              <h2 className="font-display font-bold text-3xl mb-6">Planning Timeline</h2>
              <div className="space-y-4">
                {story.timeline.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-32 text-sm font-semibold text-accent">
                      {item.month}
                    </div>
                    <div className="flex-1 pb-4 border-b border-border/50 last:border-0">
                      <p className="text-muted-foreground">{item.task}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget Breakdown */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-accent" />
                <h3 className="font-display font-bold text-xl">Budget Breakdown</h3>
              </div>
              <p className="text-2xl font-bold mb-4">{story.budget}</p>
              <div className="space-y-3">
                {story.budgetBreakdown.map((item: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{item.category}</span>
                      <span className="font-semibold">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      ₹{item.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Pro Tips */}
            <GlassCard className="p-6">
              <h3 className="font-display font-bold text-xl mb-4">Pro Tips from {story.couple.split(' &')[0]}</h3>
              <ul className="space-y-3">
                {story.tips.map((tip: string, i: number) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-accent flex-shrink-0">✓</span>
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* CTA */}
            <GlassCard variant="intense" className="p-6 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-3 text-accent" />
              <h3 className="font-bold text-lg mb-2">Start Your Story</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Find your perfect vendors on Karlo Shaadi
              </p>
              <Link to="/categories">
                <Button variant="hero" className="w-full">
                  Browse Vendors
                </Button>
              </Link>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Related Stories */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-3xl mb-8 text-center">
            More Wedding Stories
          </h2>
          <div className="text-center">
            <Link to="/stories">
              <Button variant="outline" size="lg">
                View All Stories →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StoryDetail;
