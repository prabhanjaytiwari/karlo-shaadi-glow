

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Calendar, Users, IndianRupee, Camera, Sparkles } from "lucide-react";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";

const featuredStory = {
  id: 1,
  couple: "Ananya & Rohan",
  tagline: "From College Sweethearts to Forever",
  city: "Udaipur, Rajasthan",
  date: "December 15, 2024",
  guests: 600,
  budget: "₹45 Lakhs",
  theme: "Royal Rajasthani with Modern Twist",
  coverImage: "/placeholder.svg",
  photos: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  story: "We met in college, became best friends, and fell in love over late-night chai and study sessions. Eight years later, we wanted a wedding that honored our roots while celebrating our modern love story. Udaipur's City Palace provided the perfect royal backdrop, and thanks to Karlo Shaadi, we found incredible vendors who understood our vision perfectly.",
  highlights: [
    "Three-day celebration with pre-wedding festivities",
    "Traditional Rajasthani folk performances",
    "Customized fusion menu with regional specialties",
    "Vintage car entry for the groom",
    "Boat ride photoshoot on Lake Pichola"
  ],
  vendors: [
    { type: "Photography", name: "Moments by Mehta" },
    { type: "Decoration", name: "Royal Bloom Events" },
    { type: "Catering", name: "Spice Symphony" },
    { type: "Mehendi", name: "Henna Magic by Priya" }
  ]
};

const stories = [
  {
    id: 2,
    couple: "Priya & Vikram",
    tagline: "A Grand Delhi Wedding",
    city: "New Delhi",
    date: "January 2025",
    guests: 1000,
    theme: "Classic Elegance",
    coverImage: "/placeholder.svg",
    budget: "₹80 Lakhs"
  },
  {
    id: 3,
    couple: "Neha & Arjun",
    tagline: "Intimate Beach Ceremony",
    city: "Goa",
    date: "November 2024",
    guests: 150,
    theme: "Bohemian Beach",
    coverImage: "/placeholder.svg",
    budget: "₹25 Lakhs"
  },
  {
    id: 4,
    couple: "Kavita & Aditya",
    tagline: "Heritage Palace Wedding",
    city: "Jaipur",
    date: "February 2025",
    guests: 800,
    theme: "Royal Heritage",
    coverImage: "/placeholder.svg",
    budget: "₹1.2 Crores"
  },
  {
    id: 5,
    couple: "Shalini & Karan",
    tagline: "Garden Paradise Wedding",
    city: "Bangalore",
    date: "March 2024",
    guests: 400,
    theme: "Garden Romance",
    coverImage: "/placeholder.svg",
    budget: "₹35 Lakhs"
  },
  {
    id: 6,
    couple: "Riya & Sahil",
    tagline: "Mountain Destination Wedding",
    city: "Mussoorie",
    date: "October 2024",
    guests: 200,
    theme: "Mountain Magic",
    coverImage: "/placeholder.svg",
    budget: "₹30 Lakhs"
  },
  {
    id: 7,
    couple: "Meera & Rahul",
    tagline: "Traditional Meets Contemporary",
    city: "Mumbai",
    date: "December 2024",
    guests: 700,
    theme: "Modern Traditional",
    coverImage: "/placeholder.svg",
    budget: "₹65 Lakhs"
  }
];

export default function SuccessStories() {
  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title="Success Stories" />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 bg-muted/20">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
            <Sparkles className="w-3 h-3 mr-1" />
            Real Weddings, Real Inspiration
          </Badge>
          <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-6">
            Wedding Success <span className="text-primary">Stories</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Get inspired by real couples who planned their dream weddings using Karlo Shaadi. From intimate celebrations to grand affairs, every love story is unique.
          </p>
        </div>
      </section>

      {/* Featured Story */}
      <section className="py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <Badge className="mb-6 bg-primary text-primary-foreground">
            Featured Story
          </Badge>
          
          <div className="bg-card shadow-[var(--shadow-sm)] rounded-3xl overflow-hidden">
            {/* Cover Image */}
            <div className="relative h-96 bg-primary/10" />
            
            {/* Content */}
            <div className="p-8 md:p-12">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Story */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl mb-2">
                      {featuredStory.couple}
                    </h2>
                    <p className="text-xl text-muted-foreground italic">
                      {featuredStory.tagline}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{featuredStory.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{featuredStory.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{featuredStory.guests} Guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <IndianRupee className="w-4 h-4 text-primary" />
                      <span>{featuredStory.budget}</span>
                    </div>
                  </div>

                  {/* Theme */}
                  <div>
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      Theme: {featuredStory.theme}
                    </Badge>
                  </div>

                  {/* Story */}
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {featuredStory.story}
                  </p>

                  {/* Highlights */}
                  <div>
                    <h3 className="font-bold text-xl mb-4">Wedding Highlights</h3>
                    <ul className="space-y-2">
                      {featuredStory.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Heart className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Photo Gallery */}
                  <div>
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-primary" />
                      Photo Gallery
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {featuredStory.photos.map((photo, idx) => (
                        <div key={idx} className="aspect-square rounded-2xl bg-primary/10" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar - Vendors */}
                <div className="space-y-6">
                  <div className="bg-muted/20 rounded-2xl p-6 shadow-[var(--shadow-sm)]">
                    <h3 className="font-bold text-xl mb-4">Vendors Used</h3>
                    <div className="space-y-4">
                      {featuredStory.vendors.map((vendor, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="text-sm font-semibold text-primary">
                            {vendor.type}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {vendor.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    View Full Story
                  </Button>
                  
                  <Button variant="outline" className="w-full" size="lg">
                    Share Your Story
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Stories Grid */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-8">
            More Success Stories
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <article
                key={story.id}
                className="group bg-card shadow-[var(--shadow-sm)] rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-64 bg-primary/10" />
                
                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                    {story.couple}
                  </h3>
                  <p className="text-muted-foreground italic text-sm">
                    {story.tagline}
                  </p>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{story.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{story.guests} Guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      <span>{story.budget}</span>
                    </div>
                  </div>

                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {story.theme}
                  </Badge>

                  <Button variant="ghost" className="w-full mt-4">
                    Read Story
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Story CTA */}
      <section className="py-16 px-4 sm:px-6 bg-primary">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-6 text-white">
            Share Your Wedding Story
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Did you plan your dream wedding using Karlo Shaadi? Inspire other couples by sharing your beautiful journey!
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8">
            Submit Your Story
          </Button>
        </div>
      </section>

      
    </div>
  );
}