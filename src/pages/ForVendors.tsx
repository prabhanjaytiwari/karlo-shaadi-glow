import { BhindiFooter } from "@/components/BhindiFooter";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle2, TrendingUp, Users, Shield, Star, Zap, IndianRupee, Camera, Utensils, MapPin, Palette, Sparkles, ArrowRight, BadgeCheck, BarChart3, MessageSquare, Phone } from "lucide-react";
import { SEO } from "@/components/SEO";
import { FAQPageJsonLd } from "@/components/JsonLd";
import { CinematicImage } from "@/components/CinematicImage";
import sectionVendors from "@/assets/section-vendors.jpg";
import weddingFriends from "@/assets/wedding-friends.jpg";

const vendorFaqs = [
  { question: "Is it free to register as a vendor on Karlo Shaadi?", answer: "Yes, registration is completely free. You can create your vendor profile, upload your portfolio, and start receiving inquiries at zero cost. We never charge commission on your bookings." },
  { question: "How does Karlo Shaadi help me get more wedding bookings?", answer: "We use AI-powered matching to connect you with couples whose requirements match your services, budget range, and location. Couples can send you direct inquiries, view your portfolio, and book you — all through the platform." },
  { question: "What is the Karlo Shaadi Verified Badge?", answer: "The Verified Badge is earned after completing our verification process — including identity verification, portfolio review, and reference checks. Verified vendors appear higher in search results and receive 3x more inquiries on average." },
  { question: "Does Karlo Shaadi charge commission on bookings?", answer: "No. Unlike WedMeGood, Shaadidukaan, or other platforms that charge 15-20% commission, Karlo Shaadi charges zero commission. We monetize through optional premium subscription tiers that give you extra visibility and features." },
  { question: "What categories of wedding vendors can register?", answer: "We accept all wedding service categories: Photography, Videography, Venues, Catering, Decoration, Makeup Artists, Mehendi Artists, Music & DJ, Entertainment, Invitations, Choreography, Transport, Jewelry, Pandit Services, and more." },
  { question: "How do I manage my bookings and inquiries?", answer: "Your vendor dashboard gives you a complete overview of all inquiries, bookings, payments, and reviews. You can respond to inquiries, manage your calendar availability, update pricing, and track your business analytics — all in one place." },
  { question: "What are the premium subscription plans?", answer: "We offer Silver (₹4,999/year), Gold (₹9,999/year), and Diamond (₹19,999/year) plans. Premium vendors get priority listing, featured placement, advanced analytics, bulk portfolio uploads, and dedicated account support." },
  { question: "Which cities does Karlo Shaadi operate in?", answer: "We serve 20+ cities across India including Delhi, Mumbai, Lucknow, Bangalore, Hyderabad, Kolkata, Chennai, Pune, Jaipur, Ahmedabad, Chandigarh, Udaipur, and more. We're expanding rapidly to new cities every month." },
];

const vendorCategories = [
  { name: "Photographers", icon: Camera, count: "800+" },
  { name: "Caterers", icon: Utensils, count: "600+" },
  { name: "Venues", icon: MapPin, count: "500+" },
  { name: "Decorators", icon: Palette, count: "400+" },
  { name: "Makeup Artists", icon: Sparkles, count: "700+" },
  { name: "DJs & Music", icon: Zap, count: "300+" },
];

const ForVendors = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Register as Wedding Vendor"
        description="Join India's fastest-growing wedding vendor platform. Zero commission, verified badge, AI-powered couple matching. Free registration for photographers, caterers, venues, decorators, and all wedding service providers across 20+ cities."
        keywords="wedding vendor registration, list wedding business, wedding photographer platform, wedding vendor marketplace India, zero commission wedding platform, register catering business, wedding venue listing, makeup artist registration"
      />
      <FAQPageJsonLd faqs={vendorFaqs} />
      
      {/* JSON-LD for Vendor Registration page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Register as Wedding Vendor - Karlo Shaadi",
            "description": "Free vendor registration on India's zero-commission wedding platform",
            "url": "https://karloshaadi.com/for-vendors",
            "mainEntity": {
              "@type": "Service",
              "name": "Karlo Shaadi Vendor Registration",
              "serviceType": "Wedding Vendor Marketplace",
              "provider": {
                "@type": "Organization",
                "name": "Karlo Shaadi",
                "url": "https://karloshaadi.com"
              },
              "areaServed": { "@type": "Country", "name": "India" },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR",
                "description": "Free vendor registration with zero commission"
              }
            }
          })
        }}
      />
      
      <main className="pt-20 pb-0">
        {/* Hero Section - Vendor Focused */}
        <section className="relative py-16 sm:py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="absolute top-[20%] right-[10%] w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-[10%] left-[5%] w-48 h-48 rounded-full bg-accent/10 blur-3xl" />
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-7xl mx-auto">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30">
                  <BadgeCheck className="h-4 w-4 text-accent" />
                  <span className="text-accent text-xs font-semibold">Zero Commission Platform</span>
                </div>
                
                <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
                  Grow Your Wedding Business <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">10x Faster</span>
                </h1>
                
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl">
                  Join 5,000+ verified wedding vendors across India. Get matched with ready-to-book couples via AI. 
                  <strong className="text-foreground"> Zero commission. Free registration.</strong>
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    size="lg" 
                    onClick={() => navigate("/vendor-auth")}
                    className="text-base px-8 py-6 rounded-full"
                  >
                    Register Free Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <a href="tel:+917011460321">
                    <Button size="lg" variant="outline" className="text-base px-6 py-6 rounded-full border-accent/30 hover:border-accent w-full sm:w-auto">
                      <Phone className="mr-2 h-4 w-4" />
                      Talk to Us
                    </Button>
                  </a>
                </div>

                {/* Trust metrics */}
                <div className="flex flex-wrap gap-6 pt-2">
                  {[
                    { value: "5,000+", label: "Vendors" },
                    { value: "0%", label: "Commission" },
                    { value: "20+", label: "Cities" },
                    { value: "4.8★", label: "Rating" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Image */}
              <div className="hidden lg:block">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border-2 border-accent/20 shadow-2xl">
                  <CinematicImage src={sectionVendors} alt="Successful wedding vendors on Karlo Shaadi platform" className="w-full h-full" cinematic />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Vendors Choose Us - vs Competitors */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-rose-50/30 to-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-3">
                Why <span className="text-primary">5,000+ Vendors</span> Choose Us
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Unlike WedMeGood or Shaadidukaan, we don't eat into your profits
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {[
                { icon: IndianRupee, title: "Zero Commission", desc: "Keep 100% of your booking revenue. We never take a cut — competitors charge 15-20%.", highlight: true },
                { icon: Zap, title: "AI Couple Matching", desc: "Our AI matches you with couples whose budget, location, and style fit your services perfectly." },
                { icon: BadgeCheck, title: "Verified Badge", desc: "Earn a trust badge after verification. Verified vendors get 3x more inquiries." },
                { icon: BarChart3, title: "Business Dashboard", desc: "Track inquiries, bookings, payments, reviews, and revenue analytics in one place." },
                { icon: MessageSquare, title: "Direct Inquiries", desc: "Couples contact you directly via WhatsApp or the platform. No middleman, no lead quality issues." },
                { icon: Star, title: "Reviews & Ratings", desc: "Build your reputation with verified reviews from real couples who booked you." },
              ].map((item, i) => (
                <div key={i} className={`relative p-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.highlight ? 'border-primary/40 bg-primary/5' : 'border-accent/20 bg-white'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.highlight ? 'bg-primary/15' : 'bg-accent/10'}`}>
                    <item.icon className={`h-6 w-6 ${item.highlight ? 'text-primary' : 'text-accent'}`} />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories We Accept */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-3">
                All Wedding Categories Welcome
              </h2>
              <p className="text-muted-foreground">Join the fastest-growing category on India's #1 wedding platform</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-4xl mx-auto">
              {vendorCategories.map((cat) => (
                <div key={cat.name} className="text-center p-4 rounded-xl border border-accent/20 bg-white hover:border-primary/40 hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center mx-auto mb-3">
                    <cat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground">{cat.count}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Also: Mehendi, Invitations, Choreography, Entertainment, Transport, Jewelry, Pandit, Bridal Wear, and more
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-amber-50/30 to-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
              <div className="hidden lg:block">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border-2 border-accent/20">
                  <CinematicImage src={weddingFriends} alt="Wedding vendor team celebrating" className="w-full h-full" cinematic />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl">
                  Start Getting Bookings in <span className="text-accent">4 Simple Steps</span>
                </h2>

                <div className="space-y-6">
                  {[
                    { num: "01", title: "Register Free", desc: "Create your account in 2 minutes. No fees, no credit card required." },
                    { num: "02", title: "Build Your Profile", desc: "Add your portfolio, pricing, services, and availability calendar." },
                    { num: "03", title: "Get Verified", desc: "Complete verification for the trusted badge — appear higher in search results." },
                    { num: "04", title: "Receive Bookings", desc: "Couples find you via AI matching and send direct inquiries. Manage everything from your dashboard." },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 items-start group">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-accent font-bold">{step.num}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                        <p className="text-muted-foreground text-sm">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  size="lg" 
                  onClick={() => navigate("/vendor-auth")}
                  className="rounded-full px-8"
                >
                  Create Free Profile
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Vendor Testimonials */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-3">
                Vendors Love <span className="text-primary">Karlo Shaadi</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {[
                { name: "Rajesh Photography", city: "Delhi", quote: "We got 40+ inquiries in our first month. The zero commission model means we keep every rupee we earn.", rating: 5 },
                { name: "Ananya Mehendi Arts", city: "Lucknow", quote: "The AI matching sends us couples who actually fit our budget range. No more time wasted on mismatched leads.", rating: 5 },
                { name: "Royal Caterers", city: "Jaipur", quote: "Unlike other platforms, Karlo Shaadi doesn't take a cut from our bookings. Our revenue increased by 35% after joining.", rating: 5 },
              ].map((testimonial, i) => (
                <div key={i} className="p-6 rounded-2xl border border-accent/20 bg-white">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-accent fill-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.city}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/vendor-success-stories">
                <Button variant="outline" className="rounded-full border-primary/30">
                  Read More Success Stories
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-rose-50/20 to-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-center mb-8">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                {vendorFaqs.map((faq, i) => (
                  <details key={i} className="group p-4 rounded-xl border border-accent/20 bg-white">
                    <summary className="font-semibold text-sm sm:text-base cursor-pointer list-none flex items-center justify-between">
                      <span>{faq.question}</span>
                      <span className="text-accent ml-2 group-open:rotate-45 transition-transform text-xl">+</span>
                    </summary>
                    <p className="text-muted-foreground text-sm mt-3 leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl">
                Ready to Get More <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Wedding Bookings?</span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
                Join 5,000+ vendors who grew their wedding business with zero commission and AI-powered matching.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" onClick={() => navigate("/vendor-auth")} className="text-base px-10 py-6 rounded-full">
                  Register Free Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link to="/vendor-pricing">
                  <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-full border-primary/30 w-full sm:w-auto">
                    View Plans & Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BhindiFooter />
    </div>
  );
};

export default ForVendors;