import { Button } from "./ui/button";
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

const categoryIcons = [
  { src: iconPhotography, delay: "0s", position: "top-[8%] left-[8%]" },
  { src: iconCatering, delay: "0.5s", position: "top-[12%] left-[18%]" },
  { src: iconCouple, delay: "1s", position: "top-[20%] left-[12%]" },
  { src: iconMusic, delay: "0.3s", position: "bottom-[25%] left-[10%]" },
  { src: iconMehendi, delay: "1.5s", position: "bottom-[15%] left-[20%]" },
  { src: iconDecoration, delay: "0.8s", position: "bottom-[32%] left-[15%]" },
  { src: iconVenue, delay: "1.2s", position: "top-[35%] right-[12%]" },
  { src: iconCake, delay: "0.6s", position: "bottom-[20%] right-[18%]" },
  { src: iconGifts, delay: "1.8s", position: "bottom-[32%] right-[10%]" },
  { src: iconHeart, delay: "2s", position: "bottom-[15%] right-[22%]" },
];

export const TensionsSection = () => {
  return (
    <section className="relative py-32 bg-gradient-to-b from-background to-background overflow-hidden">
      {/* Floating Category Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {categoryIcons.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.position} animate-float hidden lg:block`}
            style={{
              animationDelay: item.delay,
              animationDuration: "6s",
            }}
          >
            <img 
              src={item.src} 
              alt="Category icon"
              className="w-24 h-24 rounded-3xl shadow-2xl hover:scale-110 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
          <div className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <span className="text-accent text-sm font-semibold tracking-wide">Categories</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold leading-tight">
            2000+ Wedding Tensions.<br />
            <span className="font-quote italic text-accent">One Solution.</span>
          </h2>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            From photographers to caterers, decorators to mehendi artists—every wedding service you need, verified and ready to book on one platform.
          </p>

          <div className="pt-6">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-500 hover:to-amber-600 rounded-full px-10 py-7 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              Explore All Categories
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
