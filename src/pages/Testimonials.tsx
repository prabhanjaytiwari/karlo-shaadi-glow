import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Star, Quote, MapPin, Calendar, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    id: 1,
    couple: "Priya & Rahul",
    city: "Mumbai",
    date: "December 2024",
    rating: 5,
    category: "Photography",
    vendor: "Pixel Perfect Studios",
    image: "/placeholder.svg",
    quote: "The photos came out absolutely stunning! Our photographer captured every emotion perfectly. We couldn't have asked for better memories of our special day.",
    story: "We were so nervous about finding the right photographer, but Karlo Shaadi made it incredibly easy. The vendor was professional, creative, and made us feel so comfortable. Every single shot tells our love story beautifully."
  },
  {
    id: 2,
    couple: "Anjali & Vikram",
    city: "Delhi",
    date: "November 2024",
    rating: 5,
    category: "Catering",
    vendor: "Royal Feast Caterers",
    image: "/placeholder.svg",
    quote: "Our guests are still talking about the food! Absolutely delicious and beautifully presented. Worth every rupee.",
    story: "We had 800 guests and were worried about managing such a large catering order. The vendor we found through Karlo Shaadi was phenomenal - professional, punctual, and the food quality was consistently excellent throughout the 3-day celebration."
  },
  {
    id: 3,
    couple: "Meera & Arjun",
    city: "Bangalore",
    date: "October 2024",
    rating: 5,
    category: "Decoration",
    vendor: "Bloom Decorators",
    image: "/placeholder.svg",
    quote: "They transformed our venue into a fairy tale! The attention to detail was incredible. Everyone was amazed by the decor.",
    story: "We had a very specific vision for our wedding decor - a blend of traditional and contemporary. The decorator we booked understood our vision perfectly and executed it beyond our expectations. The mandap was breathtaking!"
  },
  {
    id: 4,
    couple: "Kavita & Rohan",
    city: "Pune",
    date: "January 2025",
    rating: 5,
    category: "Mehendi",
    vendor: "Henna Heritage",
    image: "/placeholder.svg",
    quote: "The most intricate and beautiful bridal mehendi! It lasted so long and everyone loved it. Highly recommend this artist!",
    story: "Finding a skilled mehendi artist who could do both traditional and modern designs was challenging. Thanks to Karlo Shaadi, we found an amazing artist who created a custom design incorporating both our names and our love story. Simply perfect!"
  },
  {
    id: 5,
    couple: "Shalini & Karan",
    city: "Jaipur",
    date: "February 2025",
    rating: 5,
    category: "Venue",
    vendor: "Palace Heritage Resort",
    image: "/placeholder.svg",
    quote: "Our dream destination wedding came true! The venue was spectacular, staff was amazing, and everything was seamless.",
    story: "We wanted a royal Rajasthani wedding, and the venue we found on Karlo Shaadi was perfect. The heritage property, the hospitality, the arrangements - everything exceeded our expectations. Our guests had the time of their lives!"
  },
  {
    id: 6,
    couple: "Neha & Aditya",
    city: "Hyderabad",
    date: "March 2024",
    rating: 5,
    category: "Music",
    vendor: "Beats & Rhythm Band",
    image: "/placeholder.svg",
    quote: "The band kept everyone on their feet all night! Amazing energy, great song selection, and super professional. Best decision ever!",
    story: "We wanted live music instead of a DJ, and finding the right band was tough. The band we booked through Karlo Shaadi was phenomenal. They played everything from Bollywood hits to romantic classics, and the dance floor was never empty!"
  }
];

const stats = [
  { number: "50,000+", label: "Happy Couples" },
  { number: "4.9/5", label: "Average Rating" },
  { number: "98%", label: "Would Recommend" },
  { number: "10,000+", label: "Verified Reviews" }
];

export default function Testimonials() {
  return (
    <div className="min-h-screen bg-background">
      <BhindiHeader />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Heart className="w-4 h-4 text-accent" />
            <span className="text-accent font-semibold text-sm">Real Stories, Real Weddings</span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl mb-6">
            What Couples Say About <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Their Dream Weddings</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Hear from thousands of couples who found their perfect vendors through Karlo Shaadi.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-card border-2 border-border/50">
                <div className="font-display font-bold text-3xl sm:text-4xl text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="relative bg-card border-2 border-border/50 rounded-3xl p-8 hover:border-primary/30 hover:shadow-xl transition-all group"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Quote className="w-6 h-6 text-primary" />
                </div>

                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-1">{testimonial.couple}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{testimonial.city}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{testimonial.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* Category & Vendor */}
                <div className="flex items-center gap-2 mb-6">
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {testimonial.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    via {testimonial.vendor}
                  </span>
                </div>

                {/* Quote */}
                <blockquote className="text-lg font-medium mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Full Story */}
                <p className="text-muted-foreground leading-relaxed">
                  {testimonial.story}
                </p>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
              Load More Stories
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-primary to-accent">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-6 text-white">
            Ready to Create Your Own Success Story?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Join thousands of happy couples who found their perfect vendors through Karlo Shaadi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/categories" className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary rounded-full font-semibold hover:bg-white/90 transition-colors">
              Explore Vendors
            </a>
            <a href="/auth" className="inline-flex items-center justify-center px-8 py-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 rounded-full font-semibold hover:bg-white/20 transition-colors">
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      <BhindiFooter />
    </div>
  );
}