import { Button } from "@/components/ui/button";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { cdn } from "@/lib/cdnAssets";

const featuredArticle = {
  id: 1,
  slug: "ultimate-indian-wedding-planning-timeline",
  title: "The Ultimate Indian Wedding Planning Timeline: 12 Months to Your Dream Day",
  excerpt: "Planning an Indian wedding can be overwhelming. Follow our comprehensive month-by-month guide to ensure nothing falls through the cracks.",
  author: "Priya Sharma",
  date: "March 15, 2025",
  readTime: "12 min read",
  category: "Planning Guide",
  image: cdn.categoryVenue,
  featured: true
};

const articles = [
  {
    id: 2,
    slug: "10-questions-ask-wedding-photographer",
    title: "10 Questions to Ask Your Wedding Photographer Before Booking",
    excerpt: "Don't let poor communication ruin your wedding memories. Here are the essential questions every couple should ask.",
    author: "Rahul Khanna",
    date: "March 12, 2025",
    readTime: "8 min read",
    category: "Photography",
    image: cdn.categoryPhotography
  },
  {
    id: 3,
    slug: "budget-friendly-wedding-decor-ideas",
    title: "Budget-Friendly Wedding Decor Ideas That Look Expensive",
    excerpt: "Create a stunning wedding atmosphere without breaking the bank. Expert decorators share their secrets.",
    author: "Anita Desai",
    date: "March 10, 2025",
    readTime: "10 min read",
    category: "Decoration",
    image: cdn.categoryDecoration
  },
  {
    id: 4,
    slug: "north-indian-vs-south-indian-weddings",
    title: "North Indian vs South Indian Weddings: Understanding the Beautiful Differences",
    excerpt: "Explore the rich traditions, rituals, and customs that make Indian weddings so diverse and spectacular.",
    author: "Vikram Patel",
    date: "March 8, 2025",
    readTime: "15 min read",
    category: "Traditions",
    image: cdn.categoryMehendi
  },
  {
    id: 5,
    slug: "how-to-choose-perfect-wedding-venue",
    title: "How to Choose the Perfect Wedding Venue: Location, Capacity & More",
    excerpt: "Your venue sets the tone for your entire wedding. Here's a comprehensive guide to making the right choice.",
    author: "Meera Singh",
    date: "March 5, 2025",
    readTime: "11 min read",
    category: "Venues",
    image: cdn.categoryVenue
  },
  {
    id: 6,
    slug: "wedding-catering-menu-planning-500-guests",
    title: "Wedding Catering 101: Menu Planning for 500+ Guests",
    excerpt: "From appetizers to desserts, learn how to plan a delicious menu that satisfies every palate.",
    author: "Chef Ravi Kumar",
    date: "March 3, 2025",
    readTime: "9 min read",
    category: "Catering",
    image: cdn.categoryCatering
  },
  {
    id: 7,
    slug: "destination-weddings-india-top-locations",
    title: "Destination Weddings in India: Top 10 Locations & Cost Breakdown",
    excerpt: "Dreaming of a destination wedding? Discover the most beautiful locations and what they actually cost.",
    author: "Kavita Reddy",
    date: "March 1, 2025",
    readTime: "13 min read",
    category: "Destinations",
    image: cdn.categoryVenue
  },
  {
    id: 8,
    slug: "last-minute-wedding-planning-3-months",
    title: "Last-Minute Wedding Planning: Everything You Need in 3 Months",
    excerpt: "Short on time? Here's how to plan an amazing wedding in just 90 days without losing your mind.",
    author: "Arjun Malhotra",
    date: "February 28, 2025",
    readTime: "10 min read",
    category: "Planning Guide",
    image: cdn.categoryBridalMakeup
  },
  {
    id: 9,
    slug: "bridal-mehendi-designs-traditional-contemporary",
    title: "Bridal Mehendi Designs: From Traditional to Contemporary",
    excerpt: "Explore the latest trends in bridal mehendi and find the perfect design for your special day.",
    author: "Shalini Iyer",
    date: "February 25, 2025",
    readTime: "7 min read",
    category: "Mehendi",
    image: cdn.categoryMehendi
  },
  {
    id: 10,
    slug: "5-best-luxury-wedding-hotels-lucknow",
    title: "5 Best Luxury Wedding Hotels in Lucknow for a Royal Celebration",
    excerpt: "Discover Lucknow's most stunning wedding venues — from Taj to Vivanta — with pricing, capacity, and what makes each special.",
    author: "Priya Sharma",
    date: "March 26, 2026",
    readTime: "8 min read",
    category: "Venues",
    image: cdn.categoryVenue
  },
  {
    id: 11,
    slug: "top-5-wedding-planners-lucknow-2026",
    title: "Top 5 Wedding Planners in Lucknow You Can Trust in 2026",
    excerpt: "Looking for reliable wedding planners in Lucknow? Here are the top 5 options including modern AI-powered alternatives.",
    author: "Rahul Khanna",
    date: "March 25, 2026",
    readTime: "9 min read",
    category: "Planning Guide",
    image: cdn.categoryDecoration
  },
  {
    id: 12,
    slug: "how-karlo-shaadi-monetising-indian-weddings",
    title: "How Karlo Shaadi is Revolutionising the ₹10 Lakh Crore Wedding Industry",
    excerpt: "From AI wedding plans to Shaadi Seva, discover how Karlo Shaadi is disrupting India's massive wedding market.",
    author: "Prabhanjay Tiwari",
    date: "March 24, 2026",
    readTime: "10 min read",
    category: "Industry",
    image: cdn.categoryPhotography
  },
  {
    id: 13,
    slug: "plan-wedding-under-10-lakhs-2026",
    title: "Complete Guide to Planning a Wedding Under ₹10 Lakhs in 2026",
    excerpt: "Think a beautiful wedding needs a huge budget? Here's your complete breakdown for a stunning celebration under ₹10 lakhs.",
    author: "Anita Desai",
    date: "March 23, 2026",
    readTime: "11 min read",
    category: "Budget",
    image: cdn.categoryCatering
  },
  {
    id: 14,
    slug: "muhurat-dates-wedding-2026",
    title: "Best Muhurat Dates for Wedding in 2026: Month-by-Month Guide",
    excerpt: "Find the most auspicious wedding dates in 2026 according to Hindu calendar, nakshatra, and panchangam.",
    author: "Vikram Patel",
    date: "March 22, 2026",
    readTime: "12 min read",
    category: "Traditions",
    image: cdn.categoryMehendi
  },
  {
    id: 15,
    slug: "pre-wedding-shoot-locations-lucknow",
    title: "7 Stunning Pre-Wedding Shoot Locations in Lucknow",
    excerpt: "From Bara Imambara to Gomti Riverfront, explore Lucknow's most photogenic spots for your pre-wedding shoot.",
    author: "Meera Singh",
    date: "March 21, 2026",
    readTime: "8 min read",
    category: "Destinations",
    image: cdn.categoryVenue
  },
  {
    id: 16,
    slug: "wedding-decoration-trends-2026",
    title: "Wedding Decoration Trends 2026: Minimalist to Maximalist",
    excerpt: "Stay ahead with the hottest decor trends — from sustainable florals to LED installations and pastel palettes.",
    author: "Kavita Reddy",
    date: "March 20, 2026",
    readTime: "9 min read",
    category: "Planning Guide",
    image: cdn.categoryDecoration
  },
  {
    id: 17,
    slug: "choose-right-wedding-photographer-guide",
    title: "How to Choose the Right Wedding Photographer: A Data-Driven Guide",
    excerpt: "Stop guessing and start comparing. A practical framework to find your perfect wedding photographer.",
    author: "Arjun Malhotra",
    date: "March 19, 2026",
    readTime: "10 min read",
    category: "Photography",
    image: cdn.categoryPhotography
  },
  {
    id: 18,
    slug: "indian-wedding-guest-list-management-playbook",
    title: "Indian Wedding Guest List Management: The Complete Playbook",
    excerpt: "Managing 500+ guests across multiple events? Here's the definitive system for stress-free guest management.",
    author: "Shalini Iyer",
    date: "March 18, 2026",
    readTime: "11 min read",
    category: "Planning Guide",
    image: cdn.categoryDecoration
  },
  {
    id: 19,
    slug: "why-wedding-vendors-need-online-presence-2026",
    title: "Why Every Wedding Vendor Needs an Online Presence in 2026",
    excerpt: "87% of couples search online first. Here's why vendors who go digital are winning — and how to get started.",
    author: "Rohit Gupta",
    date: "March 17, 2026",
    readTime: "12 min read",
    category: "Industry",
    image: cdn.categoryPhotography
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
  "Destinations",
  "Budget",
  "Industry",
  "Lucknow"
];

export default function Blog() {
  const isMobile = useIsMobile();
  return (
    <div className={`min-h-screen bg-background ${isMobile ? 'pb-24' : ''}`}>
      <SEO
        title="Wedding Planning Blog | Tips, Guides & Ideas for Indian Weddings"
        description="Expert wedding planning advice for Indian couples. Guides on wedding photography, venues, catering, mehendi, decoration, budgeting & more. Real tips from wedding pros across India."
        keywords="indian wedding planning blog, wedding tips India, wedding planning guide, wedding photography tips, wedding decoration ideas, wedding budget India, bridal mehendi, wedding venue guide, destination wedding India, शादी टिप्स, विवाह गाइड, शादी की तैयारी, dulhan tips, shaadi ki taiyari guide, wedding tips Hindi"
        url="/blog"
        breadcrumbs={[{ name: "Wedding Planning Blog", url: "/blog" }]}
      />
      <MobilePageHeader title="Blog" />
      {/* Hero Section */}
      <section className={isMobile ? "pt-4 pb-6 px-4 bg-muted/20" : "pt-32 pb-16 px-4 sm:px-6 bg-muted/20"}>
        <div className="container mx-auto max-w-6xl text-center">
          {!isMobile && (
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              Wedding Planning Tips & Guides
            </Badge>
          )}
          <h1 className={isMobile ? "font-display font-bold text-2xl mb-3" : "font-display font-bold text-4xl sm:text-5xl md:text-6xl mb-6"}>
            Karlo Shaadi Blog
          </h1>
          {!isMobile && (
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Expert advice, real stories, and practical tips to plan your perfect Indian wedding.
            </p>
          )}
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-4 sm:px-6 border-b border-border/30 sticky top-20 bg-background z-40">
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
          <div className="relative rounded-3xl overflow-hidden bg-card shadow-[var(--shadow-sm)] hover:border-primary/30 transition-all group">
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
                
                <Link to={`/blog/${featuredArticle.slug}`}>
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
                className="group bg-card shadow-[var(--shadow-sm)] rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className="absolute top-4 left-4 bg-background/90 ">
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
                  
                  <Link to={`/blog/${article.slug}`}>
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
      <section className="py-16 px-4 sm:px-6 bg-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4 text-background">
            Get Wedding Tips in Your Inbox
          </h2>
          <p className="text-background/70 text-lg mb-8">
            Join couples receiving expert wedding planning advice every week.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full border border-background/20 bg-background/10 text-background placeholder:text-background/50 focus:outline-none focus:border-background/40"
            />
            <Button className="bg-background text-foreground hover:bg-background/90 rounded-full px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
