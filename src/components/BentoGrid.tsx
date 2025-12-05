import { ArrowRight, Shield, Sparkles, Users, Zap } from "lucide-react";
import bentoChaos from "@/assets/bento-chaos.jpg";
import bentoRelaxed from "@/assets/bento-relaxed.jpg";
import bentoProtection from "@/assets/bento-protection.jpg";
import bentoVendors from "@/assets/bento-vendors.jpg";
import bentoMagic from "@/assets/bento-magic.jpg";
import { useStaggeredReveal } from "@/hooks/usePremiumAnimations";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  index: number;
  isVisible: boolean;
}

const BentoCard = ({ children, className, index, isVisible }: BentoCardProps) => {
  return (
    <div
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDelay: `${index * 75}ms`,
      }}
    >
      {children}
    </div>
  );
};

export const BentoGrid = () => {
  const { containerRef, visibleItems } = useStaggeredReveal(7, 100);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3">
            Why Karlo Shaadi?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Everything you need for a stress-free wedding
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          
          {/* Large Card - Before & After */}
          <BentoCard index={0} isVisible={visibleItems[0]} className="lg:col-span-2 lg:row-span-2">
            <div className="h-full bg-card border border-border rounded-lg p-5 sm:p-6 overflow-hidden group hover:border-accent/30 transition-colors duration-200">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold">The Old Way vs. Our Way</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="space-y-3">
                    <div className="relative rounded-lg overflow-hidden aspect-[4/3]">
                      <img 
                        src={bentoChaos}
                        alt="Wedding planning chaos"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-1 rounded bg-destructive text-destructive-foreground text-xs font-medium">
                        Before
                      </div>
                    </div>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Endless vendor calls</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Payment confusion</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Fraud worries</li>
                    </ul>
                  </div>

                  {/* After */}
                  <div className="space-y-3">
                    <div className="relative rounded-lg overflow-hidden aspect-[4/3]">
                      <img 
                        src={bentoRelaxed}
                        alt="Stress-free planning"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-1 rounded bg-accent text-accent-foreground text-xs font-medium">
                        After
                      </div>
                    </div>
                    <ul className="space-y-1.5 text-xs text-foreground">
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent"></span>Verified vendors</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent"></span>Secure payments</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent"></span>Fraud protection</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Tall Card - Smart Matching */}
          <BentoCard index={1} isVisible={visibleItems[1]} className="lg:row-span-2">
            <div className="h-full bg-card border border-border rounded-lg p-5 sm:p-6 flex flex-col justify-between group hover:border-primary/30 transition-colors duration-200">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold">AI-Powered Matching</h3>
                <p className="text-muted-foreground text-sm">
                  Get matched with perfect vendors in under 2 minutes
                </p>
              </div>
              
              <div className="relative rounded-lg overflow-hidden aspect-square mt-4">
                <img 
                  src={bentoMagic}
                  alt="Magical planning"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4 flex items-center gap-2 text-primary font-medium text-sm">
                Try it now <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </BentoCard>

          {/* Wide Card - Verified Vendors */}
          <BentoCard index={2} isVisible={visibleItems[2]} className="md:col-span-2">
            <div className="h-full bg-card border border-border rounded-lg overflow-hidden group hover:border-accent/30 transition-colors duration-200">
              <div className="grid md:grid-cols-2">
                <div className="p-5 sm:p-6 flex flex-col justify-center">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold">5,000+ Verified Vendors</h3>
                    <p className="text-muted-foreground text-sm">
                      Every vendor undergoes strict verification with background checks and portfolio reviews
                    </p>
                    <div className="pt-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-medium">
                        <Shield className="h-3.5 w-3.5" />
                        100% Verified
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative h-full min-h-[180px] sm:min-h-[200px] overflow-hidden">
                  <img 
                    src={bentoVendors}
                    alt="Verified vendors"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Square Card - Protection */}
          <BentoCard index={3} isVisible={visibleItems[3]}>
            <div className="h-full bg-card border border-border rounded-lg p-5 sm:p-6 group hover:border-accent/30 transition-colors duration-200">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-base md:text-lg font-semibold">Fraud Protection</h3>
                <p className="text-muted-foreground text-xs">
                  Safe milestone-based payments
                </p>
              </div>
              
              <div className="relative rounded-lg overflow-hidden aspect-square mt-4">
                <img 
                  src={bentoProtection}
                  alt="Fraud protection"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </BentoCard>

          {/* Stats Card */}
          <BentoCard index={4} isVisible={visibleItems[4]}>
            <div className="h-full bg-primary rounded-lg p-5 sm:p-6 text-primary-foreground">
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold">By the Numbers</h3>
                <div className="space-y-3">
                  {[
                    { value: "50K+", label: "Couples" },
                    { value: "5K+", label: "Vendors" },
                    { value: "2 Hrs", label: "Response" },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="text-xl sm:text-2xl font-semibold">{stat.value}</div>
                      <div className="text-primary-foreground/70 text-xs">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Feature Card */}
          <BentoCard index={5} isVisible={visibleItems[5]}>
            <div className="h-full bg-card border border-border rounded-lg p-5 sm:p-6 group hover:border-primary/30 transition-colors duration-200">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-semibold">No Tension</h3>
                <p className="text-muted-foreground text-xs">
                  Personal planner handles stress
                </p>
                <div className="pt-2 space-y-1.5 text-xs text-muted-foreground">
                  {["24/7 Support", "Timeline", "Budget"].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  );
};
