import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const perks = [
  { icon: "🥇", title: "City #1 Spotlight", desc: "Your profile appears at the very top of search results in your city — above all later registrations." },
  { icon: "🔒", title: "Price Lock Guarantee", desc: "Whatever plan you join today — that price is yours forever. Even if we raise prices later." },
  { icon: "🎁", title: "3 Months Free on Pro+", desc: "Early registrations on Pro or Elite get 3 additional months added at no charge." },
  { icon: "📣", title: "Free Social Media Feature", desc: "We feature your business on KarloShaadi Instagram & Facebook to 50,000+ followers." },
  { icon: "👑", title: '"Verified Partner" Badge', desc: "Exclusive badge on your profile that builds instant trust with couples searching for vendors." },
  { icon: "📞", title: "Dedicated Account Manager", desc: "A dedicated KarloShaadi representative helps you set up and optimize your profile for maximum leads." },
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
    <section className="py-20 px-6 border-t-[3px] border-b-[3px] border-accent" style={{ background: "linear-gradient(135deg, #FFF8EE 0%, #FFF2DE 100%)" }}>
      <div className="max-w-[1100px] mx-auto">
        {/* Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-2xl px-8 sm:px-12 py-10 flex items-center justify-between gap-8 flex-wrap mb-12"
          style={{ background: "linear-gradient(90deg, hsl(350 72% 25%), hsl(350 72% 35%))", boxShadow: "0 20px 60px rgba(107,26,26,0.25)" }}>
          <div>
            <h2 className="font-display font-bold text-white leading-tight" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}>
              🔥 Early Vendor Advantage<br />
              <span className="text-accent">Closes in Limited Time</span>
            </h2>
            <p className="text-white/70 mt-2.5 text-base">First 100 vendors per city get locked-in pricing forever + exclusive city spotlight placement</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {[
              { v: String(cd.d).padStart(2, "0"), l: "Days" },
              { v: String(cd.h).padStart(2, "0"), l: "Hours" },
              { v: String(cd.m).padStart(2, "0"), l: "Mins" },
              { v: String(cd.s).padStart(2, "0"), l: "Secs" },
            ].map((u, i) => (
              <div key={i} className="text-center rounded-xl px-4 py-3 min-w-[64px] bg-accent/20 border border-accent/40">
                <div className="font-display font-bold leading-none text-accent" style={{ fontSize: "2.2rem" }}>{u.v}</div>
                <div className="text-[0.65rem] text-white/50 tracking-widest uppercase">{u.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3 text-accent">What Early Birds Get</p>
        <h2 className="font-display font-bold leading-tight mb-10 text-foreground" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
          Exclusive Benefits for <em className="italic text-accent">First 100 Vendors</em>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {perks.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-xl p-6 flex gap-3.5 items-start transition-all duration-300 hover:-translate-y-1 border border-accent/20 shadow-[var(--shadow-sm)]">
              <div className="text-2xl flex-shrink-0">{p.icon}</div>
              <div>
                <div className="font-semibold text-[0.95rem] mb-1 text-foreground">{p.title}</div>
                <div className="text-[0.82rem] leading-relaxed text-muted-foreground">{p.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
