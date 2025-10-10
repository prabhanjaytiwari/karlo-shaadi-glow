import { Camera, Utensils, Music, Flower2, Sparkles, Heart, Gift, Diamond, Cake, Palette, Users, MapPin } from "lucide-react";
import { Button } from "./ui/button";

const floatingIcons = [
  { Icon: Camera, color: "from-purple-500 to-purple-600", delay: "0s", position: "top-[10%] left-[5%]" },
  { Icon: Diamond, color: "from-pink-500 to-pink-600", delay: "0.5s", position: "top-[15%] right-[8%]" },
  { Icon: Utensils, color: "from-orange-500 to-orange-600", delay: "1s", position: "top-[25%] left-[12%]" },
  { Icon: Flower2, color: "from-green-500 to-green-600", delay: "1.5s", position: "top-[35%] right-[15%]" },
  { Icon: Music, color: "from-blue-500 to-blue-600", delay: "2s", position: "top-[45%] left-[8%]" },
  { Icon: Cake, color: "from-yellow-500 to-yellow-600", delay: "0.3s", position: "top-[55%] right-[10%]" },
  { Icon: Palette, color: "from-red-500 to-red-600", delay: "1.8s", position: "bottom-[20%] left-[10%]" },
  { Icon: Gift, color: "from-indigo-500 to-indigo-600", delay: "0.8s", position: "bottom-[25%] right-[12%]" },
  { Icon: Users, color: "from-teal-500 to-teal-600", delay: "1.2s", position: "top-[20%] left-[20%]" },
  { Icon: MapPin, color: "from-cyan-500 to-cyan-600", delay: "1.7s", position: "top-[40%] right-[20%]" },
  { Icon: Sparkles, color: "from-amber-500 to-amber-600", delay: "0.6s", position: "bottom-[30%] left-[18%]" },
  { Icon: Heart, color: "from-rose-500 to-rose-600", delay: "2.2s", position: "bottom-[35%] right-[18%]" },
];

export const TensionsSection = () => {
  return (
    <section className="relative py-32 bg-background overflow-hidden">
      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.position} animate-float`}
            style={{
              animationDelay: item.delay,
              animationDuration: "4s",
            }}
          >
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${item.color} p-4 shadow-2xl`}>
              <item.Icon className="w-full h-full text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
          <div className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <span className="text-accent text-sm font-semibold">Categories</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold leading-tight">
            2000+ Wedding Tensions.<br />
            <span className="text-accent">One Solution.</span>
          </h2>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            From photographers to caterers, decorators to mehendi artists—every wedding service you need, verified and ready to book on one platform.
          </p>

          <div className="pt-4">
            <Button 
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 py-7 text-lg font-semibold"
            >
              Explore All Categories
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};
