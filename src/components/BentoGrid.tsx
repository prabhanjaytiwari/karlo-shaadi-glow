import { ArrowRight, Shield, Sparkles, Users, Zap } from "lucide-react";
import bentoChaos from "@/assets/bento-chaos.jpg";
import bentoRelaxed from "@/assets/bento-relaxed.jpg";
import bentoProtection from "@/assets/bento-protection.jpg";
import bentoVendors from "@/assets/bento-vendors.jpg";
import bentoMagic from "@/assets/bento-magic.jpg";
import { useStaggeredReveal } from "@/hooks/usePremiumAnimations";
import { useRef, useState, useCallback, useEffect } from "react";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  index: number;
  isVisible: boolean;
}

const BentoCard = ({ children, className, index, isVisible }: BentoCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setTilt({ rotateX, rotateY });
  }, []);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={ref}
      className={`transform-gpu will-change-transform ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible 
          ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(0)` 
          : 'perspective(1000px) translateY(40px)',
        filter: isVisible ? 'blur(0px)' : 'blur(8px)',
        transition: isHovered 
          ? 'transform 0.1s ease-out, opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), filter 0.8s cubic-bezier(0.22, 1, 0.36, 1)' 
          : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), filter 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {children}
    </div>
  );
};

export const BentoGrid = () => {
  const { containerRef, visibleItems } = useStaggeredReveal(7, 100);

  return (
    <section className="py-10 sm:py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 hero-text-reveal">
            Why Karlo Shaadi?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto hero-text-reveal hero-text-reveal-delay-1">
            Everything you need for a stress-free wedding
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-6xl mx-auto">
          
          {/* Large Card - Before & After */}
          <BentoCard index={0} isVisible={visibleItems[0]} className="lg:col-span-2 lg:row-span-2">
            <div className="h-full bg-card border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 overflow-hidden group hover:border-accent/50 transition-all duration-500 hover:shadow-[0_0_30px_hsl(var(--accent)/0.15)]">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold">The Old Way vs. Our Way</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden aspect-[4/3] img-luxury">
                      <img 
                        src={bentoChaos}
                        alt="Wedding planning chaos"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs font-semibold">
                        Before 😰
                      </div>
                    </div>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-destructive"></span>Endless vendor calls</li>
                      <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-destructive"></span>Payment confusion</li>
                      <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-destructive"></span>Fraud worries</li>
                    </ul>
                  </div>

                  {/* After */}
                  <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden aspect-[4/3] img-luxury">
                      <img 
                        src={bentoRelaxed}
                        alt="Stress-free planning"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                        After 🎉
                      </div>
                    </div>
                    <ul className="space-y-1 text-xs text-foreground font-medium">
                      <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-accent"></span>Verified vendors</li>
                      <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-accent"></span>Secure payments</li>
                      <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-accent"></span>Fraud protection</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Tall Card - Smart Matching */}
          <BentoCard index={1} isVisible={visibleItems[1]} className="lg:row-span-2">
            <div className="h-full bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col justify-between group hover:border-primary transition-all duration-500 hover:shadow-[0_0_30px_hsl(var(--primary)/0.15)]">
              <div className="space-y-2 sm:space-y-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold">AI-Powered Matching</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Get matched with perfect vendors in under 2 minutes
                </p>
              </div>
              
              <div className="relative rounded-xl overflow-hidden aspect-square mt-4 img-luxury">
                <img 
                  src={bentoMagic}
                  alt="Magical planning"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="mt-4 flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all duration-500">
                Try it now <ArrowRight className="h-3 w-3 group-hover:translate-x-2 transition-transform duration-500" />
              </div>
            </div>
          </BentoCard>

          {/* Wide Card - Verified Vendors */}
          <BentoCard index={2} isVisible={visibleItems[2]} className="md:col-span-2">
            <div className="h-full bg-card border border-border/50 rounded-xl sm:rounded-2xl overflow-hidden group hover:border-accent/50 transition-all duration-500 hover:shadow-[0_0_30px_hsl(var(--accent)/0.15)]">
              <div className="grid md:grid-cols-2">
                <div className="p-4 sm:p-5 flex flex-col justify-center">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold">5,000+ Verified Vendors</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Every vendor undergoes strict verification with background checks and portfolio reviews
                    </p>
                    <div className="pt-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                        <Shield className="h-3 w-3" />
                        100% Verified
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative h-full min-h-[180px] sm:min-h-[220px] img-luxury overflow-hidden">
                  <img 
                    src={bentoVendors}
                    alt="Verified vendors"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Square Card - Protection */}
          <BentoCard index={3} isVisible={visibleItems[3]}>
            <div className="h-full bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 group hover:border-accent transition-all duration-500 hover:shadow-[0_0_30px_hsl(var(--accent)/0.15)]">
              <div className="space-y-2 sm:space-y-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold">Fraud Protection</h3>
                <p className="text-muted-foreground text-xs">
                  Safe milestone-based payments
                </p>
              </div>
              
              <div className="relative rounded-xl overflow-hidden aspect-square mt-3 img-luxury">
                <img 
                  src={bentoProtection}
                  alt="Fraud protection"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
          </BentoCard>

          {/* Stats Card */}
          <BentoCard index={4} isVisible={visibleItems[4]}>
            <div className="h-full bg-gradient-to-br from-primary to-primary/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-primary-foreground group hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] transition-all duration-500">
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-bold">By the Numbers</h3>
                <div className="space-y-2">
                  {[
                    { value: "50K+", label: "Couples" },
                    { value: "5K+", label: "Vendors" },
                    { value: "2 Hrs", label: "Response" },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                      <div className="text-primary-foreground/80 text-xs">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Feature Card */}
          <BentoCard index={5} isVisible={visibleItems[5]}>
            <div className="h-full bg-card border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 group hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_hsl(var(--primary)/0.15)]">
              <div className="space-y-2 sm:space-y-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold">No Tension</h3>
                <p className="text-muted-foreground text-xs">
                  Personal planner handles stress
                </p>
                <div className="pt-1 space-y-1 text-xs text-muted-foreground">
                  {["24/7 Support", "Timeline", "Budget"].map((feature, i) => (
                    <div key={i} className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }}>
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
