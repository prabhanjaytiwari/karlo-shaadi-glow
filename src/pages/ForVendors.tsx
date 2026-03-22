
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle2, TrendingUp, Users, Shield, Star, Zap, IndianRupee, Camera, Utensils, MapPin, Palette, Sparkles, ArrowRight, BadgeCheck, BarChart3, MessageSquare, Phone } from "lucide-react";
import { SEO } from "@/components/SEO";
import { FAQPageJsonLd } from "@/components/JsonLd";
import { CinematicImage } from "@/components/CinematicImage";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroVendorsImg from "@/assets/hero-vendors-success.jpg";
import sectionVendors from "@/assets/section-vendors.jpg";
import weddingFriends from "@/assets/wedding-friends.jpg";

const vendorCategoryDefs = [
  { name: "Photographers", icon: Camera, dbCategory: "photography" },
  { name: "Caterers", icon: Utensils, dbCategory: "catering" },
  { name: "Venues", icon: MapPin, dbCategory: "venues" },
  { name: "Decorators", icon: Palette, dbCategory: "decoration" },
  { name: "Makeup Artists", icon: Sparkles, dbCategory: "makeup" },
  { name: "DJs & Music", icon: Zap, dbCategory: "music" },
];

const ForVendors = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Register as Wedding Vendor"
        description="Join India's fastest-growing wedding vendor platform. Zero commission, verified badge, AI-powered couple matching. Free registration for photographers, caterers, venues, decorators, and all wedding service providers across 20+ cities."
        keywords="wedding vendor registration, list wedding business, wedding photographer platform, wedding vendor marketplace India, zero commission wedding platform, register catering business, wedding venue listing, makeup artist registration"
      />
      <FAQPageJsonLd faqs={vendorFaqs} />

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
              "provider": { "@type": "Organization", "name": "Karlo Shaadi", "url": "https://karloshaadi.com" },
              "areaServed": { "@type": "Country", "name": "India" },
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "description": "Free vendor registration with zero commission" }
            }
          })
        }}
      />

      <MobilePageHeader title="For Vendors" />

      <main className={isMobile ? "pb-24" : "pt-20"}>
        {/* Hero - Immersive (text on image stays white) */}
        <section className="relative overflow-hidden">
          <div className="relative h-[70vh] min-h-[480px] max-h-[600px]">
            <img
              src={heroVendorsImg}
              alt="Wedding vendors celebrating"
              className="w-full h-full object-cover"
              style={{ filter: 'contrast(1.05) saturate(1.1) brightness(0.7)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-4">
                    <BadgeCheck className="h-4 w-4 text-accent" />
                    <span className="text-white/80 text-xs font-semibold">Zero Commission Platform</span>
                  </div>

                  <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl leading-tight text-white mb-4">
                    Grow Your Wedding Business
                  </h1>

                  <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-lg mb-6">
                    Join India's fastest-growing zero-commission wedding platform. Get matched with ready-to-book couples. <span className="text-white/80 font-medium">Zero commission. Free registration.</span>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      size="lg"
                      onClick={() => navigate("/vendor/onboarding")}
                      className="rounded-full px-8 font-semibold"
                    >
                      Register Free Now
                    </Button>
                    <a href="tel:+917011460321">
                      <Button size="lg" variant="outline" className="rounded-full px-8 bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 w-full sm:w-auto">
                        <Phone className="mr-2 h-4 w-4" /> Talk to Us
                      </Button>
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-center gap-8 md:gap-16">
              {[
                { value: `${totalVendors}+`, label: "Vendors" },
                { value: "0%", label: "Commission" },
                { value: `${totalCities}+`, label: "Cities" },
                { value: "4.8★", label: "Rating" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Vendors Choose Us */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="font-display font-bold text-xl md:text-3xl text-foreground mb-2">
                Why Vendors Choose Us
              </h2>
              <p className="text-muted-foreground text-sm">Unlike others, we don't eat into your profits</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto">
              {[
                { icon: IndianRupee, title: "Zero Commission", desc: "Keep 100% of your booking revenue. Competitors charge 15-20%.", highlight: true },
                { icon: Zap, title: "Couple Matching", desc: "Smart matching connects you with couples whose budget and style fit." },
                { icon: BadgeCheck, title: "Verified Badge", desc: "Earn a trust badge. Verified vendors get 3x more inquiries." },
                { icon: BarChart3, title: "Business Dashboard", desc: "Track inquiries, bookings, payments, reviews in one place." },
                { icon: MessageSquare, title: "Direct Inquiries", desc: "Couples contact you directly. No middleman involved." },
                { icon: Star, title: "Reviews & Ratings", desc: "Build reputation with verified reviews from real couples." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                    item.highlight
                      ? 'bg-accent/5 border-accent/20'
                      : 'bg-card border-border'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
                    item.highlight ? 'bg-accent/15' : 'bg-muted'
                  }`}>
                    <item.icon className={`h-5 w-5 ${item.highlight ? 'text-accent' : 'text-muted-foreground'}`} />
                  </div>
                  <h3 className="font-semibold text-base text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-xl md:text-3xl text-foreground mb-2">All Categories Welcome</h2>
              <p className="text-muted-foreground text-sm">Join the fastest-growing wedding platform in India</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
              {vendorCategories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="text-center p-4 rounded-2xl bg-card border border-border hover:bg-muted hover:shadow-sm transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                    <cat.icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground">{cat.count}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground/60 mt-5">
              Also: Mehendi, Invitations, Choreography, Entertainment, Transport, Jewelry, Pandit, Bridal Wear, and more
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
              <div className="hidden lg:block">
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                  <img src={weddingFriends} alt="Wedding vendor team" className="w-full h-full object-cover" style={{ filter: 'contrast(1.03) saturate(1.08) brightness(0.9)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              </div>

              <div className="space-y-5">
                <h2 className="font-display font-bold text-xl md:text-3xl text-foreground">
                  Start Getting Bookings in <span className="text-accent">4 Steps</span>
                </h2>

                <div className="space-y-4">
                  {[
                    { num: "01", title: "Register Free", desc: "Create your account in 2 minutes. No fees, no credit card." },
                    { num: "02", title: "Build Your Profile", desc: "Add portfolio, pricing, services, and availability." },
                    { num: "03", title: "Get Verified", desc: "Complete verification for the trusted badge." },
                    { num: "04", title: "Receive Bookings", desc: "Couples find you via smart matching and send direct inquiries." },
                  ].map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4 items-start group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-muted border border-border flex items-center justify-center flex-shrink-0 group-hover:bg-accent/15 group-hover:border-accent/30 transition-all">
                        <span className="text-muted-foreground font-bold text-sm group-hover:text-accent transition-colors">{step.num}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-foreground mb-0.5">{step.title}</h3>
                        <p className="text-muted-foreground text-sm">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button size="lg" onClick={() => navigate("/vendor/onboarding")} className="rounded-full px-8 font-semibold">
                  Create Free Profile <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Vendor Testimonials */}
        <section className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-display font-bold text-xl md:text-3xl text-center text-foreground mb-8">
              Vendors Love Karlo Shaadi
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto">
              {[
                { name: "Rajesh Photography", city: "Delhi", quote: "We got 40+ inquiries in our first month. The zero commission model means we keep every rupee we earn.", rating: 5 },
                { name: "Ananya Mehendi Arts", city: "Lucknow", quote: "The smart matching sends us couples who actually fit our budget range. No more time wasted on mismatched leads.", rating: 5 },
                { name: "Royal Caterers", city: "Jaipur", quote: "Unlike other platforms, Karlo Shaadi doesn't take a cut from our bookings. Our revenue increased by 35% after joining.", rating: 5 },
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-2xl bg-card border border-border shadow-sm"
                >
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-accent fill-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.city}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-6">
              <Link to="/vendor-success-stories">
                <Button variant="outline" className="rounded-full">
                  Read More Success Stories <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display font-bold text-xl md:text-3xl text-center text-foreground mb-8">
                Frequently Asked Questions
              </h2>

              <Accordion type="single" collapsible className="space-y-3">
                {vendorFaqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="border border-border rounded-2xl px-5 bg-card hover:border-primary/20 transition-colors data-[state=open]:bg-muted/50"
                  >
                    <AccordionTrigger className="text-left text-sm sm:text-base font-semibold hover:no-underline py-4 text-foreground">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm pb-4 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA - Immersive (text on image stays white) */}
        <section className="relative overflow-hidden">
          <div className="relative h-[50vh] min-h-[360px]">
            <img
              src={sectionVendors}
              alt="Wedding vendors"
              className="w-full h-full object-cover"
              style={{ filter: 'contrast(1.05) saturate(1.1) brightness(0.6)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-transparent" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-5 px-6">
                <h2 className="font-display font-bold text-2xl md:text-4xl text-white">
                  Ready to Get More Bookings?
                </h2>
                <p className="text-white/50 text-sm max-w-xl mx-auto">
                  Join 5,000+ vendors who grew their wedding business with zero commission.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" onClick={() => navigate("/vendor/onboarding")} className="rounded-full px-8 font-semibold">
                    Register Free Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Link to="/vendor-pricing">
                    <Button size="lg" variant="outline" className="rounded-full px-8 bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 w-full sm:w-auto">
                      View Plans & Pricing
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ForVendors;
