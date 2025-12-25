import { useParams, Link } from "react-router-dom";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark } from "lucide-react";
import photographyImg from "@/assets/category-photography.jpg";
import venueImg from "@/assets/category-venue.jpg";
import decorationImg from "@/assets/category-decoration.jpg";
import cateringImg from "@/assets/category-catering.jpg";
import mehendiImg from "@/assets/category-mehendi.jpg";
import makeupImg from "@/assets/category-bridal-makeup.jpg";

// Blog post data - in production this would come from a CMS or database
const blogPosts: Record<string, {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}> = {
  "1": {
    id: 1,
    title: "The Ultimate Indian Wedding Planning Timeline: 12 Months to Your Dream Day",
    excerpt: "Planning an Indian wedding can be overwhelming. Follow our comprehensive month-by-month guide to ensure nothing falls through the cracks.",
    content: `
## Introduction

Planning an Indian wedding is a beautiful yet complex journey that typically spans multiple events, intricate traditions, and countless details. Whether you're orchestrating a grand celebration or an intimate gathering, having a structured timeline is crucial for a stress-free experience.

## 12 Months Before

**Set Your Budget**
The first and most crucial step is establishing your wedding budget. Indian weddings can range from modest ceremonies to lavish multi-day affairs. Consider:
- Venue costs (often the largest expense)
- Catering for multiple events
- Photography and videography
- Bridal and groom attire
- Jewelry and accessories
- Decoration and flowers
- Entertainment and music
- Invitations and stationery

**Create Your Guest List**
Start with a rough guest list. Indian weddings often have 300+ guests, so be realistic about numbers early on.

## 10-11 Months Before

**Book Your Venue**
Premium venues get booked 12-18 months in advance. Look for:
- Capacity for your guest count
- Multiple event spaces for sangeet, mehendi, ceremony
- Catering options and restrictions
- Accommodation availability

**Hire Key Vendors**
Start researching and booking:
- Photographer/Videographer
- Wedding Planner
- Caterer
- Decorator

## 8-9 Months Before

**Bridal Shopping**
Begin shopping for:
- Wedding lehenga/saree
- Reception outfit
- Mehendi and sangeet outfits
- Jewelry selection

**Finalize Entertainment**
Book your:
- DJ/Band for sangeet
- Dhol players
- Dance choreographer

## 6-7 Months Before

**Send Save the Dates**
Especially important for destination weddings or out-of-town guests.

**Book Pandit/Officiant**
Discuss muhurat dates and ceremony requirements.

**Plan Honeymoon**
Start researching destinations and booking flights/hotels.

## 4-5 Months Before

**Order Invitations**
Design and order your wedding invitations with enough time for:
- Design approval
- Printing
- Addressing
- Mailing (give guests 6-8 weeks notice)

**Finalize Menu**
Work with your caterer on:
- Welcome drinks and appetizers
- Main course options
- Desserts and mithai
- Special dietary requirements

## 2-3 Months Before

**Dress Fittings**
Schedule fittings for:
- Bridal lehenga alterations
- Groom's sherwani
- Family outfits

**Confirm All Vendors**
Reach out to every vendor to:
- Confirm dates and times
- Review contracts
- Discuss final details

**Beauty Prep**
Start your pre-wedding skincare routine and schedule:
- Facials
- Hair treatments
- Trial makeup session

## 1 Month Before

**Final Guest Count**
Confirm numbers with:
- Venue
- Caterer
- Transport

**Create Day-of Timeline**
Plan minute-by-minute schedules for each event.

**Break in Your Wedding Shoes**
Wear them around the house to avoid discomfort on your big day.

## 1 Week Before

**Final Vendor Meetings**
Touch base with all vendors one last time.

**Pack for Honeymoon**
Don't leave this for the last minute.

**Delegate Responsibilities**
Assign tasks to family members and wedding party.

## The Day Before

**Lay Out Everything**
Organize all outfits, jewelry, and accessories.

**Get Rest**
Try to sleep early and stay hydrated.

**Final Confirmations**
One last check with key vendors.

## Your Wedding Day

**Trust Your Planning**
You've done the work. Now relax and enjoy every moment of your special day!

---

*Need help with your wedding planning? Karlo Shaadi connects you with verified vendors who can make your dream wedding a reality.*
    `,
    author: "Priya Sharma",
    date: "March 15, 2025",
    readTime: "12 min read",
    category: "Planning Guide",
    image: venueImg
  },
  "2": {
    id: 2,
    title: "10 Questions to Ask Your Wedding Photographer Before Booking",
    excerpt: "Don't let poor communication ruin your wedding memories. Here are the essential questions every couple should ask.",
    content: `
## Why Choosing the Right Photographer Matters

Your wedding photographs are the only tangible memories you'll have of your special day. Choosing the right photographer is crucial – here are the 10 questions you must ask before booking.

## 1. What's Your Photography Style?

Understanding a photographer's style ensures alignment with your vision:
- **Traditional**: Posed, formal shots
- **Candid/Photojournalistic**: Natural, unposed moments
- **Fine Art**: Artistic, editorial-style images
- **Contemporary**: Mix of all styles

## 2. How Many Weddings Have You Shot?

Experience matters. Ask to see full wedding galleries, not just highlight reels.

## 3. Will You Personally Shoot Our Wedding?

Some studios send different photographers. Ensure you know who'll be there on your day.

## 4. What Equipment Do You Use?

Professional photographers should have:
- Multiple camera bodies
- Variety of lenses
- Backup equipment
- Professional lighting gear

## 5. How Do You Handle Low Light?

Indian weddings often have challenging lighting conditions – evening ceremonies, dimly lit mandaps, colorful lights during sangeet.

## 6. What's Included in Your Package?

Clarify:
- Hours of coverage
- Number of photographers
- Edited images count
- Albums and prints
- Engagement shoot inclusion

## 7. When Will We Receive Our Photos?

Typical timelines:
- Preview images: 1-2 weeks
- Full gallery: 6-8 weeks
- Albums: 2-3 months

## 8. Do You Have Insurance?

Professional photographers carry liability insurance. This protects you if equipment causes damage at your venue.

## 9. What's Your Cancellation Policy?

Understand:
- Deposit requirements
- Refund policies
- What happens if photographer is ill

## 10. Can We See a Full Wedding Gallery?

Instagram shows highlights. Ask to see a complete wedding to understand their consistency.

---

*Find verified wedding photographers on Karlo Shaadi with reviews from real couples.*
    `,
    author: "Rahul Khanna",
    date: "March 12, 2025",
    readTime: "8 min read",
    category: "Photography",
    image: photographyImg
  },
  "3": {
    id: 3,
    title: "Budget-Friendly Wedding Decor Ideas That Look Expensive",
    excerpt: "Create a stunning wedding atmosphere without breaking the bank. Expert decorators share their secrets.",
    content: `
## Creating Magic on a Budget

You don't need a massive budget to create a stunning wedding atmosphere. Here are expert tips from top decorators.

## 1. Choose Statement Pieces Wisely

Invest in 2-3 impactful elements:
- A stunning mandap
- Entrance decor
- Photo booth backdrop

Let these anchor your decor while keeping other areas simple.

## 2. Embrace Greenery

Foliage is cheaper than flowers:
- Eucalyptus garlands
- Fern arrangements
- Monstera leaves
- Banana leaves (traditional and affordable)

## 3. DIY Where Possible

Easy DIY projects:
- Mason jar centerpieces
- Photo displays
- Welcome signs
- Favor packaging

## 4. Reuse Across Events

Use the same decor elements for:
- Mehendi
- Sangeet
- Wedding ceremony

Just rearrange and add small touches.

## 5. Strategic Lighting

Lighting transforms spaces affordably:
- Fairy lights
- Candles
- Paper lanterns
- Uplighting (often included in venue packages)

## 6. Fabric Magic

Draped fabric creates drama:
- Ceiling swags
- Tent lining
- Chair covers
- Table runners

## 7. Focus on the Mandap

This is where all eyes will be. Invest here and simplify elsewhere.

## 8. Seasonal Flowers

Use in-season blooms to save 40-50% on florals.

## 9. Mix Real and Artificial

Combine fresh flowers with quality silk arrangements for areas photographed less.

## 10. Rent, Don't Buy

Most decor items can be rented at a fraction of purchase cost.

---

*Connect with budget-friendly decorators on Karlo Shaadi who can bring your vision to life.*
    `,
    author: "Anita Desai",
    date: "March 10, 2025",
    readTime: "10 min read",
    category: "Decoration",
    image: decorationImg
  },
  "4": {
    id: 4,
    title: "North Indian vs South Indian Weddings: Understanding the Beautiful Differences",
    excerpt: "Explore the rich traditions, rituals, and customs that make Indian weddings so diverse and spectacular.",
    content: `
## The Rich Tapestry of Indian Weddings

India's cultural diversity shines brightest in its wedding traditions. Let's explore the beautiful differences between North and South Indian ceremonies.

## Pre-Wedding Rituals

### North Indian
- **Roka**: Official engagement announcement
- **Sangeet**: Musical night with choreographed performances
- **Mehendi**: Elaborate henna ceremony
- **Haldi**: Turmeric paste application

### South Indian
- **Nischayathartham**: Engagement ceremony
- **Nalungu**: Equivalent to haldi, with oil and turmeric
- **Mehendi**: More intimate, less elaborate
- **Kalyanam Patrika**: Invitation ceremony

## Wedding Attire

### North Indian Bride
- Heavy lehenga or saree
- Extensive gold and kundan jewelry
- Chooda (red and white bangles)
- Kalire (hanging ornaments)

### South Indian Bride
- Kanjeevaram silk saree
- Temple jewelry
- Jasmine flowers in hair (gajra)
- Maang tikka and nose ring

## The Ceremony

### North Indian (Vedic)
- **Jaimala**: Exchange of garlands
- **Kanyadaan**: Giving away the bride
- **Saat Phere**: Seven rounds around fire
- **Sindoor Daan**: Vermillion application

### South Indian (Various traditions)
- **Muhurtham**: Auspicious moment
- **Mangalsutra Dharana**: Tying the sacred thread
- **Talambralu**: Showering with rice
- **Saptapadi**: Seven steps together

## Duration

- North Indian: Often multi-day celebrations
- South Indian: Usually completed in a few hours

## Food

### North Indian
- Elaborate multi-cuisine buffets
- Heavy focus on desserts
- Mughlai and Punjabi dishes

### South Indian
- Traditional banana leaf serving
- Sadya (vegetarian feast)
- Filter coffee essential

## Both Share

Despite differences, both traditions emphasize:
- Family blessings
- Fire as witness (Agni)
- Commitment for seven lifetimes
- Elaborate celebrations

---

*Whether North or South, find vendors who understand your traditions on Karlo Shaadi.*
    `,
    author: "Vikram Patel",
    date: "March 8, 2025",
    readTime: "15 min read",
    category: "Traditions",
    image: mehendiImg
  },
  "5": {
    id: 5,
    title: "How to Choose the Perfect Wedding Venue: Location, Capacity & More",
    excerpt: "Your venue sets the tone for your entire wedding. Here's a comprehensive guide to making the right choice.",
    content: `
## The Foundation of Your Wedding

Your venue is the canvas upon which your wedding story unfolds. Choose wisely.

## Key Considerations

### 1. Guest Count
- Always plan for 10-15% more than your list
- Consider separate spaces for different events

### 2. Location
- Accessibility for majority of guests
- Proximity to airports for outstation guests
- Availability of nearby hotels

### 3. Indoor vs Outdoor
**Outdoor Pros:**
- Natural beauty
- More space
- Great for photos

**Indoor Pros:**
- Weather-proof
- Better acoustics
- Climate controlled

### 4. Budget Breakdown
Typical venue costs include:
- Rental fee: 30-40%
- Catering: 40-50%
- Decor: 10-15%
- Misc: 5-10%

## Questions to Ask Venues

1. What's included in the rental?
2. Are there catering restrictions?
3. What's the noise/time curfew?
4. Is there a backup plan for weather?
5. How many events per day?

## Red Flags

- No written contract
- Hidden fees
- Poor reviews
- Inflexible policies
- No liability insurance

## Top Venue Types

### Palace Hotels
Perfect for royal-themed weddings

### Beach Resorts
Ideal for destination celebrations

### Farmhouses
Great for intimate, rustic weddings

### Banquet Halls
Classic choice for urban weddings

### Heritage Properties
For those wanting historical charm

---

*Browse verified venues on Karlo Shaadi with transparent pricing and real reviews.*
    `,
    author: "Meera Singh",
    date: "March 5, 2025",
    readTime: "11 min read",
    category: "Venues",
    image: venueImg
  },
  "6": {
    id: 6,
    title: "Wedding Catering 101: Menu Planning for 500+ Guests",
    excerpt: "From appetizers to desserts, learn how to plan a delicious menu that satisfies every palate.",
    content: `
## Feeding the Masses with Finesse

Large-scale wedding catering requires careful planning. Here's your complete guide.

## Understanding Quantities

For 500 guests, expect:
- 15-20 appetizer pieces per person
- 300g main course per person
- 100g dessert per person
- 3-4 drinks per person

## Menu Structure

### Welcome Drinks
- 2-3 mocktail options
- Fresh juices
- Traditional drinks (jaljeera, aam panna)

### Appetizers (Chaat Counter)
- Pani puri
- Bhel puri
- Dahi bhalla
- Papdi chaat

### Live Counters
- Dosa station
- Chaat counter
- Pasta/noodles
- Kulfi/ice cream

### Main Course
**Vegetarian:**
- 2 paneer dishes
- 2 vegetable dishes
- Dal
- Rice/biryani
- 3-4 bread varieties

**Non-Vegetarian:**
- 2 chicken dishes
- 1 mutton dish
- Fish (optional)

### Desserts
- Traditional mithai
- Gulab jamun
- Ice cream
- Wedding cake

## Dietary Considerations

Always plan for:
- Pure vegetarian section
- Jain food
- Vegan options
- Gluten-free alternatives
- Kids' menu

## Timing

- Appetizers: 45-60 minutes
- Main course: 90-120 minutes
- Dessert: 30-45 minutes

## Pro Tips

1. Do multiple tastings
2. Visit caterer during an event
3. Get everything in writing
4. Plan for 10% extra
5. Have dedicated service staff

---

*Find top-rated caterers for your wedding on Karlo Shaadi.*
    `,
    author: "Chef Ravi Kumar",
    date: "March 3, 2025",
    readTime: "9 min read",
    category: "Catering",
    image: cateringImg
  },
  "7": {
    id: 7,
    title: "Destination Weddings in India: Top 10 Locations & Cost Breakdown",
    excerpt: "Dreaming of a destination wedding? Discover the most beautiful locations and what they actually cost.",
    content: `
## Making Destination Dreams Reality

A destination wedding in India offers unparalleled beauty and culture. Here are the top locations and real costs.

## Top 10 Destinations

### 1. Udaipur, Rajasthan
- **Vibe**: Royal, palatial
- **Best for**: Grand celebrations
- **Budget**: ₹50L - ₹5Cr+
- **Season**: October - March

### 2. Goa
- **Vibe**: Beach, relaxed
- **Best for**: Fun, casual weddings
- **Budget**: ₹25L - ₹1Cr
- **Season**: November - February

### 3. Jaipur, Rajasthan
- **Vibe**: Heritage, cultural
- **Best for**: Traditional weddings
- **Budget**: ₹40L - ₹2Cr
- **Season**: October - March

### 4. Kerala Backwaters
- **Vibe**: Serene, natural
- **Best for**: Intimate ceremonies
- **Budget**: ₹20L - ₹75L
- **Season**: September - March

### 5. Rishikesh/Dehradun
- **Vibe**: Mountain, spiritual
- **Best for**: Nature lovers
- **Budget**: ₹15L - ₹50L
- **Season**: March - June, Sept - Nov

### 6. Mahabalipuram
- **Vibe**: Beachside heritage
- **Best for**: South Indian destination
- **Budget**: ₹30L - ₹1Cr
- **Season**: November - February

### 7. Jim Corbett
- **Vibe**: Jungle, adventure
- **Best for**: Unique experiences
- **Budget**: ₹25L - ₹80L
- **Season**: October - June

### 8. Mussoorie
- **Vibe**: Hill station charm
- **Best for**: Colonial elegance
- **Budget**: ₹20L - ₹60L
- **Season**: March - June

### 9. Agra
- **Vibe**: Mughal grandeur
- **Best for**: Historic backdrop
- **Budget**: ₹30L - ₹1Cr
- **Season**: October - March

### 10. Andaman Islands
- **Vibe**: Tropical paradise
- **Best for**: Beach lovers
- **Budget**: ₹35L - ₹1.5Cr
- **Season**: November - May

## Cost Breakdown

Typical destination wedding costs:
- Venue: 30-40%
- Catering: 20-25%
- Decor: 15-20%
- Photography: 8-10%
- Travel/Stay: 10-15%
- Entertainment: 5-8%

---

*Plan your destination wedding with Karlo Shaadi's curated vendor network.*
    `,
    author: "Kavita Reddy",
    date: "March 1, 2025",
    readTime: "13 min read",
    category: "Destinations",
    image: venueImg
  },
  "8": {
    id: 8,
    title: "Last-Minute Wedding Planning: Everything You Need in 3 Months",
    excerpt: "Short on time? Here's how to plan an amazing wedding in just 90 days without losing your mind.",
    content: `
## Yes, It's Possible!

Whether it's a surprise engagement or sudden venue availability, 3-month wedding planning is absolutely doable.

## Month 1: Foundation (Days 1-30)

### Week 1
- Set budget (be realistic!)
- Draft guest list (keep it tight)
- Book venue (take what's available)
- Hire a wedding planner (non-negotiable for short timelines)

### Week 2
- Book photographer/videographer
- Book caterer
- Start dress shopping

### Week 3-4
- Book DJ/entertainment
- Order invitations (digital saves time!)
- Book priest/officiant

## Month 2: Details (Days 31-60)

### Week 5-6
- Finalize guest list
- Send invitations
- Book florist/decorator
- Arrange transportation

### Week 7-8
- Dress fittings
- Beauty trial
- Menu tasting
- Book honeymoon

## Month 3: Execution (Days 61-90)

### Week 9-10
- Final dress fitting
- Confirm all vendors
- Create day-of timeline
- Finalize seating

### Week 11-12
- Final venue walkthrough
- Prepare wedding favors
- Pack for honeymoon
- Rehearsal dinner

## Shortcuts That Work

1. **Digital invites**: Faster and eco-friendly
2. **All-inclusive venues**: Less coordination
3. **Ready-made outfits**: Skip custom tailoring
4. **Pre-set packages**: Less decision fatigue
5. **Small guest list**: Quality over quantity

## What to Skip

- Elaborate sangeet choreography
- Custom-printed everything
- Multiple outfit changes
- Complicated DIY projects

## What Not to Skip

- Good photographer
- Great food
- Essential rituals
- Time to enjoy!

---

*Need vendors who can deliver fast? Karlo Shaadi has you covered.*
    `,
    author: "Arjun Malhotra",
    date: "February 28, 2025",
    readTime: "10 min read",
    category: "Planning Guide",
    image: makeupImg
  },
  "9": {
    id: 9,
    title: "Bridal Mehendi Designs: From Traditional to Contemporary",
    excerpt: "Explore the latest trends in bridal mehendi and find the perfect design for your special day.",
    content: `
## The Art of Bridal Mehendi

Mehendi is more than decoration – it's tradition, art, and blessing combined.

## Traditional Designs

### Rajasthani
- Dense, intricate patterns
- Full arm and leg coverage
- Peacock and paisley motifs
- Bride and groom figures

### Arabic
- Bold, flowing patterns
- More empty space
- Floral and vine designs
- Faster to apply

### Mughlai
- Fine, detailed work
- Geometric patterns
- Royal motifs
- Traditional borders

## Contemporary Trends

### 1. Portrait Mehendi
- Bride and groom faces
- Wedding scenes
- Love stories depicted

### 2. Minimalist
- Delicate lines
- Finger and wrist focus
- Modern aesthetic

### 3. Fusion
- Mix of Arabic and Indian
- Personalized elements
- Hidden initials/dates

### 4. Glitter/White
- Temporary additions
- Photo-perfect
- Modern twist

## Booking Your Artist

### Questions to Ask
1. Can I see your portfolio?
2. What's your preferred style?
3. How long will my design take?
4. Do you bring assistants?
5. What's included in the price?

### Pricing Guide
- Basic artist: ₹5,000-15,000
- Professional artist: ₹15,000-40,000
- Celebrity artist: ₹50,000+

## Care Tips

### Before
- Exfoliate hands/feet
- Skip moisturizer day-of
- Keep hands warm

### After
- Let dry naturally
- Apply lemon-sugar solution
- Avoid water for 6-8 hours
- No soap for 24 hours

### For Best Color
- Keep overnight
- Apply clove smoke
- Stay warm
- Avoid chlorine

---

*Find talented mehendi artists on Karlo Shaadi with verified portfolios.*
    `,
    author: "Shalini Iyer",
    date: "February 25, 2025",
    readTime: "7 min read",
    category: "Mehendi",
    image: mehendiImg
  }
};

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const post = id ? blogPosts[id] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-32 pb-8 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            {post.category}
          </Badge>
          
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-6">
            {post.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            {post.excerpt}
          </p>
          
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="px-4 sm:px-6 mb-12">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-64 sm:h-96 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="container mx-auto max-w-4xl">
          <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
            <div className="whitespace-pre-wrap">{post.content}</div>
          </article>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-primary to-accent">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4 text-white">
            Ready to Start Planning?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Connect with verified wedding vendors on Karlo Shaadi and make your dream wedding a reality.
          </p>
          <Link to="/search">
            <Button className="bg-white text-primary hover:bg-white/90 rounded-full px-8" size="lg">
              Find Vendors Now
            </Button>
          </Link>
        </div>
      </section>

      <BhindiFooter />
    </div>
  );
}
