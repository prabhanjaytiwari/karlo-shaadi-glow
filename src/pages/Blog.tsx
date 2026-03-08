import { Button } from "@/components/ui/button";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import photographyImg from "@/assets/category-photography.jpg";
import venueImg from "@/assets/category-venue.jpg";
import decorationImg from "@/assets/category-decoration.jpg";
import cateringImg from "@/assets/category-catering.jpg";
import mehendiImg from "@/assets/category-mehendi.jpg";
import makeupImg from "@/assets/category-bridal-makeup.jpg";
import cakeImg from "@/assets/category-cake.jpg";
import musicImg from "@/assets/category-music.jpg";

const featuredArticle = {
  id: 1,
  title: "The Ultimate Indian Wedding Planning Timeline: 12 Months to Your Dream Day",
  excerpt: "Planning an Indian wedding can be overwhelming. Follow our comprehensive month-by-month guide to ensure nothing falls through the cracks.",
  author: "Priya Sharma",
  date: "March 15, 2025",
  readTime: "12 min read",
  category: "Planning Guide",
  image: venueImg,
  featured: true
};

const articles = [
  {
    id: 2,
    title: "10 Questions to Ask Your Wedding Photographer Before Booking",
    excerpt: "Don't let poor communication ruin your wedding memories. Here are the essential questions every couple should ask.",
    author: "Rahul Khanna",
    date: "March 12, 2025",
    readTime: "8 min read",
    category: "Photography",
    image: photographyImg
  },
  {
    id: 3,
    title: "Budget-Friendly Wedding Decor Ideas That Look Expensive",
    excerpt: "Create a stunning wedding atmosphere without breaking the bank. Expert decorators share their secrets.",
    author: "Anita Desai",
    date: "March 10, 2025",
    readTime: "10 min read",
    category: "Decoration",
    image: decorationImg
  },
  {
    id: 4,
    title: "North Indian vs South Indian Weddings: Understanding the Beautiful Differences",
    excerpt: "Explore the rich traditions, rituals, and customs that make Indian weddings so diverse and spectacular.",
    author: "Vikram Patel",
    date: "March 8, 2025",
    readTime: "15 min read",
    category: "Traditions",
    image: mehendiImg
  },
  {
    id: 5,
    title: "How to Choose the Perfect Wedding Venue: Location, Capacity & More",
    excerpt: "Your venue sets the tone for your entire wedding. Here's a comprehensive guide to making the right choice.",
    author: "Meera Singh",
    date: "March 5, 2025",
    readTime: "11 min read",
    category: "Venues",
    image: venueImg
  },
  {
    id: 6,
    title: "Wedding Catering 101: Menu Planning for 500+ Guests",
    excerpt: "From appetizers to desserts, learn how to plan a delicious menu that satisfies every palate.",
    author: "Chef Ravi Kumar",
    date: "March 3, 2025",
    readTime: "9 min read",
    category: "Catering",
    image: cateringImg
  },
  {
    id: 7,
    title: "Destination Weddings in India: Top 10 Locations & Cost Breakdown",
    excerpt: "Dreaming of a destination wedding? Discover the most beautiful locations and what they actually cost.",
    author: "Kavita Reddy",
    date: "March 1, 2025",
    readTime: "13 min read",
    category: "Destinations",
    image: venueImg
  },
  {
    id: 8,
    title: "Last-Minute Wedding Planning: Everything You Need in 3 Months",
    excerpt: "Short on time? Here's how to plan an amazing wedding in just 90 days without losing your mind.",
    author: "Arjun Malhotra",
    date: "February 28, 2025",
    readTime: "10 min read",
    category: "Planning Guide",
    image: makeupImg
  },
  {
    id: 9,
    title: "Bridal Mehendi Designs: From Traditional to Contemporary",
    excerpt: "Explore the latest trends in bridal mehendi and find the perfect design for your special day.",
    author: "Shalini Iyer",
    date: "February 25, 2025",
    readTime: "7 min read",
    category: "Mehendi",
    image: mehendiImg
  }
];

const categories = [
  "All Articles",
  "Planning Guide",
  "Photography",
  "Decoration",
  "Catering",
  "Venues",
  "Traditions",
  "Mehendi",
  "Destinations"
];

export default function Blog() {
  const isMobile = useIsMobile();
  return (
    <div className={`min-h-screen bg-background ${isMobile ? 'pb-24' : ''}`}>
      <MobilePageHeader title="Blog" />
      {/* Hero Section */}
      <section className={isMobile ? "pt-4 pb-6 px-4 bg-gradient-to-br from-primary/5 to-accent/5" : "pt-32 pb-16 px-4 sm:px-6 bg-gradient-to-br from-primary/5 to-accent/5"}>
        <div className="container mx-auto max-w-6xl text-center">
          {!isMobile && (
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              Wedding Planning Tips & Guides
            </Badge>
          )}
          <h1 className={isMobile ? "font-display font-bold text-2xl mb-3" : "font-display font-bold text-4xl sm:text-5xl md:text-6xl mb-6"}>
            Karlo Shaadi <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Blog</span>
          </h1>
          {!isMobile && (
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Expert advice, real stories, and practical tips to plan your perfect Indian wedding.
            </p>
          )}
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-4 sm:px-6 border-b border-border/50 sticky top-20 bg-background/95 backdrop-blur-md z-40">
        <div className="container mx-auto max-w-6xl">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category, idx) => (
              <Button
                key={idx}
                variant={idx === 0 ? "default" : "outline"}
                className="whitespace-nowrap rounded-full"
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="relative rounded-3xl overflow-hidden bg-card border-2 border-border/50 hover:border-primary/30 transition-all group">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Image */}
              <div className="relative h-80 lg:h-auto overflow-hidden">
                <img 
                  src={featuredArticle.image} 
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent" />
                <Badge className="absolute top-6 left-6 bg-accent text-accent-foreground">
                  Featured
                </Badge>
              </div>
              
              {/* Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <Badge className="w-fit mb-4 bg-primary/10 text-primary border-primary/20">
                  {featuredArticle.category}
                </Badge>
                <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4 group-hover:text-primary transition-colors">
                  {featuredArticle.title}
                </h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{featuredArticle.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredArticle.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{featuredArticle.readTime}</span>
                  </div>
                </div>
                
                <Link to={`/blog/${featuredArticle.id}`}>
                  <Button className="w-fit group/btn">
                    Read Full Article
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group bg-card border-2 border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm">
                    {article.category}
                  </Badge>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  
                  <Link to={`/blog/${article.id}`}>
                    <Button variant="ghost" className="w-full group/btn justify-between">
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="rounded-full px-8">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-primary to-accent">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4 text-white">
            Get Wedding Tips in Your Inbox
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Join 50,000+ couples receiving expert wedding planning advice every week.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 focus:outline-none focus:border-white/40"
            />
            <Button className="bg-white text-primary hover:bg-white/90 rounded-full px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
