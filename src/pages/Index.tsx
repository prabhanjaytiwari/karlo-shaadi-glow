import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBokeh from "@/assets/hero-bokeh-red.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <BhindiHeader />

      {/* Hero Section - Glass Card Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Blurred Bokeh Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBokeh}
            alt="Wedding bokeh background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40" />
        </div>
        
        {/* Glass Card Container */}
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-5xl mx-auto animate-fade-up">
            {/* Frosted Glass Card */}
            <div className="relative rounded-[3rem] border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl p-12 md:p-20 shadow-2xl">
              {/* Content */}
              <div className="text-center space-y-8">
                {/* Headline with Script Font */}
                <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight text-white">
                  Finally, a<br />
                  <span className="font-quote italic font-normal">Shaadi</span> Platform<br />
                  That Gets It Right
                </h1>

                {/* Subtext */}
                <p className="text-white/90 text-xl md:text-2xl font-light">
                  Stress-free planning. Verified vendors. Personal planner.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-500 hover:to-amber-600 rounded-full px-10 py-7 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
                  >
                    Plan My Wedding Free
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="bg-black/40 text-white border-2 border-white/30 hover:bg-black/60 rounded-full px-10 py-7 text-lg font-semibold backdrop-blur-sm"
                  >
                    Become a Vendor
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      {/* How It Works - Minimalist */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20 animate-fade-up">
              <p className="text-accent text-sm font-semibold tracking-wider uppercase mb-4">
                Three Simple Steps
              </p>
              <h2 className="font-display font-bold text-4xl md:text-6xl">
                How It Works
              </h2>
            </div>

            {/* Steps Grid */}
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  number: "01",
                  title: "Match",
                  description: "AI curates perfect vendors based on your style, budget, and date"
                },
                {
                  number: "02",
                  title: "Compare",
                  description: "View verified profiles, real reviews, and transparent pricing"
                },
                {
                  number: "03",
                  title: "Book Safely",
                  description: "Milestone payments, escrow protection, and dispute resolution"
                }
              ].map((step, i) => (
                <div 
                  key={i}
                  className="group animate-fade-up"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="text-accent/20 font-display text-7xl font-bold mb-6 group-hover:text-accent/40 transition-colors">
                    {step.number}
                  </div>
                  <h3 className="font-display font-semibold text-2xl mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 relative border-y border-border/50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { value: "10,000+", label: "Verified Vendors" },
                { value: "50,000+", label: "Weddings Planned" },
                { value: "4.9/5", label: "Average Rating" },
                { value: "100%", label: "Payment Protected" }
              ].map((stat, i) => (
                <div 
                  key={i} 
                  className="text-center animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="text-accent font-display text-4xl md:text-5xl font-bold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20 animate-fade-up">
              <p className="text-accent text-sm font-semibold tracking-wider uppercase mb-4">
                All Services
              </p>
              <h2 className="font-display font-bold text-4xl md:text-6xl">
                Explore Categories
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "Photography", "Venues", "Catering", "Decor", 
                "Makeup", "Mehendi", "Music/DJ", "Hospitality"
              ].map((category, i) => (
                <Link
                  key={i}
                  to={`/category/${category.toLowerCase()}`}
                  className="group"
                >
                  <div className="border border-border/50 rounded-2xl p-8 text-center hover:border-accent/50 transition-all hover-glow animate-fade-up"
                       style={{ animationDelay: `${i * 60}ms` }}>
                    <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
                      {category}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
            <h2 className="font-display font-bold text-4xl md:text-6xl">
              Ready to Plan Your<br />
              <span className="text-accent">Dream Wedding?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of couples who trusted us with their special day
            </p>
            <div className="pt-4">
              <Button 
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 text-base font-semibold hover-glow"
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </section>

      <BhindiFooter />
    </div>
  );
};

export default Index;
