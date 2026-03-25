import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const perks = [
  { icon: "🥇", title: "City #1 Spotlight", desc: "Top of search results in your city." },
  { icon: "🔒", title: "Price Lock Guarantee", desc: "Today's price is yours forever." },
  { icon: "🎁", title: "3 Months Free on Pro+", desc: "Early Pro/Elite get 3 months free." },
  { icon: "📣", title: "Social Media Feature", desc: "Featured to 50,000+ followers." },
  { icon: "👑", title: "Verified Partner Badge", desc: "Instant trust with couples." },
  { icon: "📞", title: "Account Manager", desc: "Dedicated help to optimize your profile." },
];

function useCountdown() {
  const [time, setTime] = useState({ d: 4, h: 18, m: 32, s: 9 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { d, h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d--; }
        if (d < 0) return { d: 0, h: 0, m: 0, s: 0 };
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

export function EarlyBirdSection() {
  const cd = useCountdown();

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 border-t-[3px] border-b-[3px] border-accent" style={{ background: "linear-gradient(135deg, #FFF8EE 0%, #FFF2DE 100%)" }}>
      <div className="max-w-[1100px] mx-auto">
        {/* Banner */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-2xl px-5 sm:px-10 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-5 mb-8"
          style={{ background: "linear-gradient(90deg, hsl(350 72% 25%), hsl(350 72% 35%))", boxShadow: "0 16px 48px rgba(107,26,26,0.25)" }}>
          <div className="text-center sm:text-left">
            <h2 className="font-display font-bold text-white leading-tight text-lg sm:text-2xl md:text-3xl">
              🔥 Early Vendor Advantage<br />
              <span className="text-accent">Closes in Limited Time</span>
            </h2>
            <p className="text-white/70 mt-1.5 text-xs sm:text-sm">First 100 vendors per city get locked-in pricing forever</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {[
              { v: String(cd.d).padStart(2, "0"), l: "Days" },
              { v: String(cd.h).padStart(2, "0"), l: "Hrs" },
              { v: String(cd.m).padStart(2, "0"), l: "Min" },
              { v: String(cd.s).padStart(2, "0"), l: "Sec" },
            ].map((u, i) => (
              <div key={i} className="text-center rounded-lg px-2.5 sm:px-3.5 py-2 min-w-[48px] sm:min-w-[56px] bg-accent/20 border border-accent/40">
                <div className="font-display font-bold leading-none text-accent text-xl sm:text-3xl">{u.v}</div>
                <div className="text-[0.55rem] text-white/50 tracking-widest uppercase">{u.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="text-[0.7rem] font-semibold tracking-[0.15em] uppercase mb-2 text-accent">What Early Birds Get</p>
        <h2 className="font-display font-bold leading-tight mb-6 text-foreground text-xl md:text-3xl">
          Exclusive Benefits for <em className="italic text-accent">First 100 Vendors</em>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {perks.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              className="bg-white rounded-xl p-4 flex gap-3 items-start border border-accent/20 shadow-[var(--shadow-sm)]">
              <div className="text-xl flex-shrink-0">{p.icon}</div>
              <div>
                <div className="font-semibold text-sm mb-0.5 text-foreground">{p.title}</div>
                <div className="text-xs leading-relaxed text-muted-foreground">{p.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
