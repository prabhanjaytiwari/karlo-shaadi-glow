import { ArrowRight, Shield, Sparkles, Users, Zap } from "lucide-react";
import bentoChaos from "@/assets/bento-chaos.jpg";
import bentoRelaxed from "@/assets/bento-relaxed.jpg";
import bentoProtection from "@/assets/bento-protection.jpg";
import bentoVendors from "@/assets/bento-vendors.jpg";
import bentoMagic from "@/assets/bento-magic.jpg";

export const BentoGrid = () => {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Why Karlo Shaadi?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need for a stress-free wedding, all in one place
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Large Card - Before & After */}
          <div className="lg:col-span-2 lg:row-span-2 bg-card border border-border/50 rounded-3xl p-8 overflow-hidden group hover:border-accent/50 transition-all">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">The Old Way vs. Our Way</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Before */}
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                    <img 
                      src={bentoChaos}
                      alt="Wedding planning chaos"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-sm font-semibold">
                      Before 😰
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Endless vendor calls</li>
                    <li>• Payment confusion</li>
                    <li>• Fraud worries</li>
                    <li>• Zero organization</li>
                  </ul>
                </div>

                {/* After */}
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                    <img 
                      src={bentoRelaxed}
                      alt="Stress-free planning"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                      After 🎉
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-foreground font-medium">
                    <li>• Verified vendors only</li>
                    <li>• Secure milestone payments</li>
                    <li>• Fraud protection included</li>
                    <li>• Everything organized</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Tall Card - Smart Matching */}
          <div className="lg:row-span-2 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-3xl p-8 flex flex-col justify-between group hover:border-primary transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">AI-Powered Matching</h3>
              <p className="text-muted-foreground">
                Answer 3 simple questions and get matched with perfect vendors in under 2 minutes
              </p>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden aspect-square mt-6">
              <img 
                src={bentoMagic}
                alt="Magical planning"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-6 flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all">
              Try it now <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          {/* Wide Card - Verified Vendors */}
          <div className="md:col-span-2 bg-card border border-border/50 rounded-3xl overflow-hidden group hover:border-accent/50 transition-all">
            <div className="grid md:grid-cols-2">
              <div className="p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold">5,000+ Verified Vendors</h3>
                  <p className="text-muted-foreground">
                    Every vendor undergoes strict verification. Background checks, portfolio reviews, and customer ratings ensure you work with the best
                  </p>
                  <div className="pt-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold">
                      <Shield className="h-4 w-4" />
                      100% Verified
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-full min-h-[300px]">
                <img 
                  src={bentoVendors}
                  alt="Verified vendors"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Square Card - Protection */}
          <div className="bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-3xl p-8 group hover:border-accent transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold">Fraud Protection Shield</h3>
              <p className="text-muted-foreground text-sm">
                Your money is safe with milestone-based payments and our fraud prevention system
              </p>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden aspect-square mt-6">
              <img 
                src={bentoProtection}
                alt="Fraud protection"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-primary-foreground">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">By the Numbers</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-4xl font-bold mb-1">50,000+</div>
                  <div className="text-primary-foreground/80 text-sm">Happy Couples</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-1">5,000+</div>
                  <div className="text-primary-foreground/80 text-sm">Verified Vendors</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-1">2 Hrs</div>
                  <div className="text-primary-foreground/80 text-sm">Avg. Response Time</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-1">100%</div>
                  <div className="text-primary-foreground/80 text-sm">Fraud Protection</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Card */}
          <div className="bg-card border border-border/50 rounded-3xl p-8 group hover:border-primary/50 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">No Tension, Just Celebration</h3>
              <p className="text-muted-foreground text-sm">
                Your personal wedding planner handles the stress while you enjoy the journey to your big day
              </p>
              <div className="pt-2 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <span>Timeline Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <span>Budget Tracking</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
