import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import iconPhotography from "@/assets/icon-photography.jpg";
import iconCatering from "@/assets/icon-catering.jpg";
import iconCouple from "@/assets/icon-couple.jpg";
import iconMusic from "@/assets/icon-music.jpg";
import iconMehendi from "@/assets/icon-mehendi.jpg";
import iconDecoration from "@/assets/icon-decoration.jpg";
import iconVenue from "@/assets/icon-venue.jpg";
import iconCake from "@/assets/icon-cake.jpg";
import iconGifts from "@/assets/icon-gifts.jpg";
import iconHeart from "@/assets/icon-heart.jpg";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const categoryIcons = [
  { src: iconPhotography, delay: "0s", position: "top-[8%] left-[8%]", floatClass: "float-slow" },
  { src: iconCatering, delay: "0.5s", position: "top-[12%] left-[18%]", floatClass: "float-medium" },
  { src: iconCouple, delay: "1s", position: "top-[20%] left-[12%]", floatClass: "float-fast" },
  { src: iconMusic, delay: "0.3s", position: "bottom-[25%] left-[10%]", floatClass: "float-medium" },
  { src: iconMehendi, delay: "1.5s", position: "bottom-[15%] left-[20%]", floatClass: "float-slow" },
  { src: iconDecoration, delay: "0.8s", position: "bottom-[32%] left-[15%]", floatClass: "float-fast" },
  { src: iconVenue, delay: "1.2s", position: "top-[35%] right-[12%]", floatClass: "float-slow" },
  { src: iconCake, delay: "0.6s", position: "bottom-[20%] right-[18%]", floatClass: "float-medium" },
  { src: iconGifts, delay: "1.8s", position: "bottom-[32%] right-[10%]", floatClass: "float-fast" },
  { src: iconHeart, delay: "2s", position: "bottom-[15%] right-[22%]", floatClass: "float-slow" },
];

export const TensionsSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative py-32 bg-gradient-to-b from-background via-background to-background overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Floating Category Icons with Premium Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {categoryIcons.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.position} ${item.floatClass} hidden lg:block transition-all duration-700`}
            style={{
              animationDelay: item.delay,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.8)',
              transitionDelay: `${index * 100}ms`,
            }}
          >
            <div className="relative group cursor-pointer">
              {/* Glow Effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-accent/30 to-primary/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon Container */}
              <div className="relative">
                <img 
                  src={item.src} 
                  alt="Category icon"
                  className="w-24 h-24 rounded-3xl shadow-2xl group-hover:scale-110 transition-all duration-500 ring-2 ring-white/10 group-hover:ring-accent/50"
                />
                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div 
          className="max-w-4xl mx-auto text-center space-y-8"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            filter: isVisible ? 'blur(0px)' : 'blur(8px)',
            transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {/* Premium Badge */}
          <div className="inline-block">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent/50 to-primary/50 rounded-full blur-sm opacity-75" />
              <div className="relative px-6 py-2.5 rounded-full bg-card/80 backdrop-blur-xl border border-accent/30">
                <span className="text-accent text-sm font-semibold tracking-wide">✨ Categories</span>
              </div>
            </div>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="hero-text-reveal" style={{ animationDelay: '0.1s' }}>2000+ Wedding Tensions.</span>
            <br />
            <span className="font-quote italic bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer-glow hero-text-reveal" style={{ animationDelay: '0.2s' }}>
              One Solution.
            </span>
          </h2>
          
          <p 
            className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed hero-text-reveal"
            style={{ animationDelay: '0.3s' }}
          >
            From photographers to caterers, decorators to mehendi artists—every wedding service you need, verified and ready to book on one platform.
          </p>

          <div className="pt-6 hero-text-reveal" style={{ animationDelay: '0.4s' }}>
            <Link to="/categories">
              <Button 
                size="lg"
                variant="premium"
                className="rounded-full px-10 py-7 text-lg font-semibold"
              >
                Explore All Categories
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
    </section>
  );
};
