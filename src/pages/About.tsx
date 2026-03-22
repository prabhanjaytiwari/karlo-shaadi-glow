import { Heart, Users, Shield, Sparkles } from "lucide-react";
import { CinematicImage } from "@/components/CinematicImage";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import heroAboutFounder from "@/assets/hero-about-founder.jpg";
import sectionVendors from "@/assets/section-vendors.jpg";

const About = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title="About Us" />

      <main className={isMobile ? "pb-20" : "pt-24 pb-16"}>
        {/* Hero Banner */}
        {isMobile ? (
          <section className="px-4 pt-3 pb-2">
            <p className="text-sm text-muted-foreground">India's most trusted wedding planning platform</p>
          </section>
        ) : (
          <section className="relative overflow-hidden">
            <div className="absolute inset-0">
              <CinematicImage src={sectionVendors} alt="Karlo Shaadi team" className="w-full h-full" cinematic />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/60" />
            </div>
            <div className="container mx-auto px-4 sm:px-6 relative z-10 py-12 md:py-24">
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold">
                  About <span className="text-primary">Karlo Shaadi</span>
                </h1>
                <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
                  India's most trusted wedding planning platform, connecting couples with verified vendors across the country
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="container mx-auto px-4 sm:px-6 space-y-10 md:space-y-20 py-10 md:py-16">
          {/* Our Story */}
          <section className="max-w-4xl mx-auto">
            <div className="rounded-2xl bg-card shadow-[var(--shadow-sm)] p-6 md:p-10">
              <h2 className="text-xl md:text-3xl font-bold mb-4">Our Story</h2>
              <div className="space-y-3 text-muted-foreground text-sm md:text-base leading-relaxed">
                <p>
                  Karlo Shaadi was founded by Prabhanjay Tiwari with a simple belief: every couple deserves a stress-free, 
                  magical wedding experience. We understand that planning a wedding in India can be overwhelming, with 
                  countless decisions to make and vendors to coordinate.
                </p>
                <p>
                  Our platform brings together the best wedding vendors across India — from photographers and venues to 
                  decorators and caterers — all verified and reviewed by real couples. We've made it our mission to 
                  simplify wedding planning while ensuring you find the perfect match for your special day.
                </p>
                <p>
                  With thousands of successful weddings and countless happy couples, we continue to innovate and improve 
                  our platform to serve you better. Your dream wedding is just a few clicks away!
                </p>
              </div>
            </div>
          </section>

          {/* Founder Section */}
          <section className="max-w-4xl mx-auto">
            <div className="rounded-2xl bg-card shadow-[var(--shadow-sm)] overflow-hidden">
              <div className="grid md:grid-cols-[280px_1fr] gap-0">
                <div className="relative h-48 md:h-full">
                  <CinematicImage src={heroAboutFounder} alt="Prabhanjay Tiwari - Founder" className="w-full h-full" cinematic />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-background/20" />
                </div>
                <div className="p-6 md:p-8 space-y-3">
                  <div className="text-center md:text-left">
                    <h2 className="text-xl md:text-2xl font-bold mb-1">Meet Our Founder</h2>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-accent mx-auto md:mx-0 mb-3" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">Prabhanjay Tiwari</p>
                  <p className="text-primary text-sm font-medium">Founder & CEO</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    With a vision to revolutionize wedding planning in India, Prabhanjay created Karlo Shaadi to 
                    bridge the gap between couples and trusted wedding vendors. His passion for technology and deep 
                    understanding of Indian wedding traditions have made Karlo Shaadi the go-to platform for modern couples.
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Under Prabhanjay's leadership, Karlo Shaadi has grown to become India's most trusted wedding planning 
                    platform, helping thousands of couples create their dream weddings with ease and confidence.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section>
            <h2 className="text-xl md:text-3xl font-bold text-center mb-8">Our Values</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {[
                { icon: Heart, title: "Love First", desc: "Every wedding is a celebration of love, and we treat each one as unique and special", color: "text-primary" },
                { icon: Shield, title: "Trust & Safety", desc: "All vendors are verified and reviewed to ensure quality and reliability", color: "text-primary" },
                { icon: Users, title: "Community", desc: "Building a strong community of couples and vendors helping each other", color: "text-primary" },
                { icon: Sparkles, title: "Innovation", desc: "Constantly improving our platform with new features and technologies", color: "text-primary" },
              ].map((item, i) => (
                <div key={i} className="text-center p-5 md:p-7 rounded-2xl bg-card shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <h3 className="text-sm md:text-lg font-semibold mb-1.5">{item.title}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-pink-500/15 to-accent/15" />
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 p-8 md:p-12 text-center">
              {[
                { value: "50,000+", label: "Happy Couples" },
                { value: "10,000+", label: "Verified Vendors" },
                { value: "100+", label: "Cities Covered" },
                { value: "4.8/5", label: "Average Rating" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-muted-foreground text-xs md:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default About;
