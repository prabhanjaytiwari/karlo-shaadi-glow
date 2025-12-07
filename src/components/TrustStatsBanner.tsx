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
    <div ref={ref} className="flex flex-col items-center text-center p-4 md:p-6">
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center mb-3">
        {icon}
      </div>
      <div className="text-2xl md:text-3xl font-semibold text-foreground">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
};

const stats = [
  {
    icon: <Heart className="h-7 w-7 text-primary" />,
    value: 50000,
    suffix: "+",
    label: "Happy Couples",
    delay: 0,
  },
  {
    icon: <Users className="h-7 w-7 text-primary" />,
    value: 500,
    suffix: "+",
    label: "Verified Vendors",
    delay: 100,
  },
  {
    icon: <ShieldCheck className="h-7 w-7 text-primary" />,
    value: 100,
    suffix: "%",
    label: "Secure Payments",
    delay: 200,
  },
  {
    icon: <MapPin className="h-7 w-7 text-primary" />,
    value: 20,
    suffix: "+",
    label: "Cities Covered",
    delay: 300,
  },
];

export const TrustStatsBanner = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};
