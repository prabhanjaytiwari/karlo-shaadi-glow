import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const TensionsSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative py-16 md:py-24 overflow-hidden">
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div 
          className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <div className="inline-block mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted text-muted-foreground">
              <span className="font-medium text-sm">Categories</span>
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-semibold leading-tight">
            2000+ Wedding Services.
            <br />
            <span className="text-accent font-quote italic">
              One Platform.
            </span>
          </h2>
          
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed px-2">
            From photographers to caterers—every wedding service you need, verified and ready to book.
          </p>

          <div className="pt-2 sm:pt-4">
            <Link to="/categories">
              <Button size="default" className="rounded-full px-6">
                Explore All Categories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
