import { useEffect, useState, useRef } from "react";
import { Heart, ShieldCheck, Users, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
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
      <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-primary/8 flex items-center justify-center mb-2.5">
        {icon}
      </div>
      <div className="text-xl md:text-2xl font-display font-semibold text-foreground">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
};

export const TrustStatsBanner = () => {
  const [stats, setStats] = useState([
    { icon: <Heart className="h-5 w-5 text-primary" />, value: 0, suffix: "+", label: "Families Joined", delay: 0 },
    { icon: <Users className="h-5 w-5 text-primary" />, value: 0, suffix: "+", label: "Verified Vendors", delay: 100 },
    { icon: <ShieldCheck className="h-5 w-5 text-primary" />, value: 100, suffix: "%", label: "Secure Payments", delay: 200 },
    { icon: <MapPin className="h-5 w-5 text-primary" />, value: 20, suffix: "+", label: "Cities Covered", delay: 300 },
  ]);

  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        const [profilesResult, vendorsResult, citiesResult] = await Promise.all([
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase.from("vendors").select("id", { count: "exact", head: true }).eq("verified", true),
          supabase.from("cities").select("id", { count: "exact", head: true }).eq("is_active", true),
        ]);

        const coupleCount = (profilesResult.count && profilesResult.count > 0) ? profilesResult.count : 500;
        const vendorCount = (vendorsResult.count && vendorsResult.count > 0) ? vendorsResult.count : 50;
        const cityCount = (citiesResult.count && citiesResult.count > 0) ? citiesResult.count : 20;

        setStats([
          { icon: <Heart className="h-5 w-5 text-primary" />, value: coupleCount, suffix: "+", label: "Families Joined", delay: 0 },
          { icon: <Users className="h-5 w-5 text-primary" />, value: vendorCount, suffix: "+", label: "Verified Vendors", delay: 100 },
          { icon: <ShieldCheck className="h-5 w-5 text-primary" />, value: 100, suffix: "%", label: "Secure Payments", delay: 200 },
          { icon: <MapPin className="h-5 w-5 text-primary" />, value: cityCount, suffix: "+", label: "Cities Covered", delay: 300 },
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchRealStats();
  }, []);

  return (
    <section className="py-12 md:py-16">
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
