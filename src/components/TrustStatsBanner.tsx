import { useEffect, useState, useRef } from "react";
import { Heart, ShieldCheck, Users, MapPin } from "lucide-react";

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  delay: number;
}

const StatItem = ({ icon, value, suffix, label, delay }: StatItemProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      const duration = 1500;
      const steps = 40;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isVisible, value, delay]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center p-2 sm:p-3 md:p-5">
      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center mb-1.5 sm:mb-2">
        {icon}
      </div>
      <div className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
};

const stats = [
  {
    icon: <Heart className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary" />,
    value: 50000,
    suffix: "+",
    label: "Happy Couples",
    delay: 0,
  },
  {
    icon: <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary" />,
    value: 500,
    suffix: "+",
    label: "Verified Vendors",
    delay: 100,
  },
  {
    icon: <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary" />,
    value: 100,
    suffix: "%",
    label: "Secure Payments",
    delay: 200,
  },
  {
    icon: <MapPin className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary" />,
    value: 20,
    suffix: "+",
    label: "Cities Covered",
    delay: 300,
  },
];

export const TrustStatsBanner = () => {
  return (
    <section className="py-6 sm:py-8 md:py-12 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-4 gap-1 sm:gap-3 md:gap-6 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};
