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
            <p className="text-accent font-medium text-sm tracking-widest uppercase">Browse By Category</p>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-display font-semibold leading-tight">
            Every Service Your
            <br />
            <span className="text-primary font-quote italic">
              Wedding Needs
            </span>
          </h2>
          
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed px-2 mt-3">
            From photographers to pandits — every wedding service, verified and ready to book.
          </p>

          <div className="pt-4 sm:pt-6">
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
