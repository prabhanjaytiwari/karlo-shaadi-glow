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
    <section className="py-16 sm:py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 px-2 hero-text-reveal">
            Why Karlo Shaadi?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4 hero-text-reveal hero-text-reveal-delay-1">
            Everything you need for a stress-free wedding, all in one place
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
          
          {/* Large Card - Before & After */}
          <BentoCard index={0} isVisible={visibleItems[0]} className="lg:col-span-2 lg:row-span-2">
            <div className="h-full bg-card border border-border/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden group hover:border-accent/50 transition-all duration-500 hover:shadow-[0_0_40px_hsl(var(--accent)/0.15)]">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">The Old Way vs. Our Way</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Before */}
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] img-luxury">
                      <img 
                        src={bentoChaos}
                        alt="Wedding planning chaos"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-sm font-semibold">
                        Before 😰
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Endless vendor calls</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Payment confusion</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Fraud worries</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Zero organization</li>
                    </ul>
                  </div>

                  {/* After */}
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] img-luxury">
                      <img 
                        src={bentoRelaxed}
                        alt="Stress-free planning"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                        After 🎉
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-foreground font-medium">
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent"></span>Verified vendors only</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent"></span>Secure milestone payments</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent"></span>Fraud protection included</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent"></span>Everything organized</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Tall Card - Smart Matching */}
          <BentoCard index={1} isVisible={visibleItems[1]} className="lg:row-span-2">
            <div className="h-full bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col justify-between group hover:border-primary transition-all duration-500 hover:shadow-[0_0_40px_hsl(var(--primary)/0.15)]">
              <div className="space-y-3 sm:space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold">AI-Powered Matching</h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Answer 3 simple questions and get matched with perfect vendors in under 2 minutes
                </p>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden aspect-square mt-6 img-luxury">
                <img 
                  src={bentoMagic}
                  alt="Magical planning"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="mt-6 flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all duration-500">
                Try it now <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-500" />
              </div>
            </div>
          </BentoCard>

          {/* Wide Card - Verified Vendors */}
          <BentoCard index={2} isVisible={visibleItems[2]} className="md:col-span-2">
            <div className="h-full bg-card border border-border/50 rounded-2xl sm:rounded-3xl overflow-hidden group hover:border-accent/50 transition-all duration-500 hover:shadow-[0_0_40px_hsl(var(--accent)/0.15)]">
              <div className="grid md:grid-cols-2">
                <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-center">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold">5,000+ Verified Vendors</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Every vendor undergoes strict verification. Background checks, portfolio reviews, and customer ratings ensure you work with the best
                    </p>
                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold animate-breathe">
                        <Shield className="h-4 w-4" />
                        100% Verified
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative h-full min-h-[300px] img-luxury overflow-hidden">
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
            <div className="h-full bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 group hover:border-accent transition-all duration-500 hover:shadow-[0_0_40px_hsl(var(--accent)/0.15)]">
              <div className="space-y-3 sm:space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold">Fraud Protection Shield</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Your money is safe with milestone-based payments and our fraud prevention system
                </p>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden aspect-square mt-6 img-luxury">
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
            <div className="h-full bg-gradient-to-br from-primary to-primary/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-primary-foreground group hover:shadow-[0_0_50px_hsl(var(--primary)/0.4)] transition-all duration-500">
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold">By the Numbers</h3>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { value: "50,000+", label: "Happy Couples" },
                    { value: "5,000+", label: "Verified Vendors" },
                    { value: "2 Hrs", label: "Avg. Response Time" },
                    { value: "100%", label: "Fraud Protection" },
                  ].map((stat, i) => (
                    <div key={i} className="group/stat">
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 group-hover/stat:scale-105 transition-transform duration-300 origin-left">{stat.value}</div>
                      <div className="text-primary-foreground/80 text-xs sm:text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Feature Card */}
          <BentoCard index={5} isVisible={visibleItems[5]}>
            <div className="h-full bg-card border border-border/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 group hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_40px_hsl(var(--primary)/0.15)]">
              <div className="space-y-3 sm:space-y-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold">No Tension, Just Celebration</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Your personal wedding planner handles the stress while you enjoy the journey to your big day
                </p>
                <div className="pt-2 space-y-2 text-sm text-muted-foreground">
                  {["24/7 Support", "Timeline Management", "Budget Tracking"].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }}>
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
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
