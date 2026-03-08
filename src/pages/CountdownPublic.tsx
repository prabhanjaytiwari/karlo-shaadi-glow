import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart, Share2, Calendar, Gift, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format } from "date-fns";

const dailyTips = [
  "Finalize your photographer shortlist",
  "Send out save-the-date cards",
  "Book your mehendi artist",
  "Confirm the caterer menu",
  "Plan your sangeet playlist",
  "Review decoration mood boards",
  "Schedule dress fittings",
  "Confirm guest accommodation",
  "Plan the baraat route",
  "Review the wedding day timeline",
  "Finalize invitation design",
  "Book honeymoon tickets",
  "Plan welcome gifts for guests",
  "Confirm pandit ji availability",
  "Arrange transport for family",
];

export default function CountdownPublic() {
  const { slug } = useParams<{ slug: string }>();
  const [weddingData, setWeddingData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);
  const [dailyTip, setDailyTip] = useState("");

  useEffect(() => {
    loadWeddingData();
    setDailyTip(dailyTips[new Date().getDate() % dailyTips.length]);
  }, [slug]);

  const loadWeddingData = async () => {
    try {
      if (slug) {
        const { data } = await supabase
          .from("wedding_websites" as any)
          .select("*")
          .eq("slug", slug)
          .eq("is_published", true)
          .single();
        if (data) setWeddingData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Demo mode if no data
  const weddingDate = weddingData?.wedding_date 
    ? new Date(weddingData.wedding_date) 
    : new Date(Date.now() + 147 * 24 * 60 * 60 * 1000);
  
  const coupleName = weddingData 
    ? `${weddingData.partner1_name || "Partner 1"} & ${weddingData.partner2_name || "Partner 2"}`
    : "Priya & Rahul";

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeLeft({
        days: Math.max(0, differenceInDays(weddingDate, now)),
        hours: Math.max(0, differenceInHours(weddingDate, now) % 24),
        minutes: Math.max(0, differenceInMinutes(weddingDate, now) % 60),
        seconds: Math.max(0, differenceInSeconds(weddingDate, now) % 60),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  const shareCountdown = () => {
    const text = `${timeLeft.days} days until ${coupleName}'s wedding! 💒✨\n\nFollow the countdown: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50/30">
      <SEO title={`${coupleName}'s Wedding Countdown | Karlo Shaadi`} description={`${timeLeft.days} days until ${coupleName}'s wedding! Follow the countdown and celebrate with them.`} />

      {/* Hero Countdown */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-60 h-60 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Heart className="h-4 w-4 text-primary fill-primary" />
              <span className="text-primary text-sm font-semibold">Wedding Countdown</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
              {coupleName}
            </h1>
            <p className="text-muted-foreground mb-8">
              {format(weddingDate, "EEEE, MMMM do, yyyy")}
            </p>

            {/* Countdown Grid */}
            <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mb-8">
              {[
                { value: timeLeft.days, label: "Days" },
                { value: timeLeft.hours, label: "Hours" },
                { value: timeLeft.minutes, label: "Minutes" },
                { value: timeLeft.seconds, label: "Seconds" },
              ].map((unit, i) => (
                <motion.div
                  key={unit.label}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-white border-2 border-primary/20 shadow-lg flex items-center justify-center">
                    <span className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                      {String(unit.value).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium">{unit.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Daily Tip */}
            <div className="inline-block px-6 py-3 rounded-xl bg-accent/10 border border-accent/20 mb-6">
              <p className="text-sm">
                <span className="font-semibold text-accent">Today's Task:</span>{" "}
                <span className="text-foreground">{dailyTip}</span>
              </p>
            </div>

            {/* Share */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={shareCountdown} size="lg" className="rounded-full">
                <Share2 className="mr-2 h-4 w-4" /> Share Countdown
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTAs for visitors */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Link to="/categories" className="group">
              <div className="p-6 rounded-2xl bg-white border-2 border-accent/20 hover:border-primary/40 transition-all hover:shadow-lg text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Are You a Vendor?</h3>
                <p className="text-muted-foreground text-sm">Get listed on India's #1 wedding platform</p>
              </div>
            </Link>
            <Link to="/plan-wizard" className="group">
              <div className="p-6 rounded-2xl bg-white border-2 border-accent/20 hover:border-primary/40 transition-all hover:shadow-lg text-center">
                <Calendar className="h-8 w-8 text-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Planning Your Wedding?</h3>
                <p className="text-muted-foreground text-sm">Get a free AI wedding plan in 2 minutes</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <BhindiFooter />
    </div>
  );
}
