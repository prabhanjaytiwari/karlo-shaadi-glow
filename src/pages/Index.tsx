import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <BhindiHeader />

      {/* Hero Section - Bhindi Style */}
      <section className="relative min-h-screen flex items-center justify-center geometric-bg overflow-hidden pt-20">
        {/* Animated Geometric Shapes */}
        <div className="geometric-shape geometric-shape-1" />
        <div className="geometric-shape geometric-shape-2" />
        <div className="geometric-shape geometric-shape-3" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-5xl mx-auto space-y-8 animate-fade-up">
            {/* Accent Line */}
            <p className="text-accent text-sm font-semibold tracking-wider uppercase">
              Introducing the Future of Wedding Planning
            </p>

            {/* Main Headline */}
            <h1 className="font-display font-bold text-6xl md:text-8xl leading-[1.1] tracking-tight">
              <span className="text-foreground">Stop Managing Vendors</span>
              <br />
              <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                Start Enjoying Your Wedding
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Verified vendors, milestone payments, and AI-powered matchmaking.<br />
              Everything you need for a stress-free wedding celebration.
            </p>

            {/* CTA */}
            <div className="pt-6">
              <Button 
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 text-base font-semibold hover-glow"
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
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
