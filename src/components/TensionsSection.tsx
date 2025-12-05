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
    <section ref={ref} className="relative py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white via-rose-50/40 to-amber-50/30 overflow-hidden">
      {/* Premium Background Effects - Hidden on mobile */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Floating Category Icons - Only on large screens */}
      <div className="absolute inset-0 pointer-events-none">
        {categoryIcons.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.position} ${item.floatClass} hidden xl:block transition-all duration-700`}
            style={{
              animationDelay: item.delay,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.8)',
              transitionDelay: `${index * 100}ms`,
            }}
          >
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-2 bg-gradient-to-r from-accent/40 to-primary/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <img 
                  src={item.src} 
                  alt="Category icon"
                  className="w-16 h-16 rounded-2xl shadow-xl group-hover:scale-110 transition-all duration-500 ring-2 ring-accent/20"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div 
          className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            filter: isVisible ? 'blur(0px)' : 'blur(8px)',
            transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <div className="inline-block mb-4">
            <div className="px-4 py-2 rounded-lg bg-accent/15 border-2 border-accent/30">
              <span className="text-accent font-semibold text-xs sm:text-sm">Categories</span>
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            <span className="hero-text-reveal" style={{ animationDelay: '0.1s' }}>2000+ Wedding Services.</span>
            <br />
            <span className="text-accent font-quote italic hero-text-reveal" style={{ animationDelay: '0.2s' }}>
              One Platform.
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 mx-auto rounded-full" />
          
          <p 
            className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed hero-text-reveal px-2"
            style={{ animationDelay: '0.3s' }}
          >
            From photographers to caterers—every wedding service you need, verified and ready to book.
          </p>

          <div className="pt-2 sm:pt-4 hero-text-reveal" style={{ animationDelay: '0.4s' }}>
            <Link to="/categories">
              <Button 
                size="default"
                className="rounded-full px-6 sm:px-8 h-10 sm:h-11 text-sm sm:text-base font-semibold"
              >
                Explore All Categories
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
    </section>
  );
};
