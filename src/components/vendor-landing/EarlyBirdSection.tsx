import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const perks = [
  { icon: "🥇", title: "City #1 Spotlight", desc: "Your profile appears at the very top of search results in your city — above all later registrations." },
  { icon: "🔒", title: "Price Lock Guarantee", desc: "Whatever plan you join today — that price is yours forever. Even if we raise prices later." },
  { icon: "🎁", title: "3 Months Free on Silver+", desc: "Early registrations on Silver, Gold or Diamond get 3 additional months added at no charge." },
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
    <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #FFF8EE 0%, #FFF2DE 100%)", borderTop: "3px solid #C9962A", borderBottom: "3px solid #C9962A" }}>
      <div className="max-w-[1100px] mx-auto">
        {/* Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-2xl px-8 sm:px-12 py-10 flex items-center justify-between gap-8 flex-wrap mb-12"
          style={{ background: "linear-gradient(90deg, #4A0E0E, #6B1A1A)", boxShadow: "0 20px 60px rgba(107,26,26,0.25)" }}>
          <div>
            <h2 className="font-display font-bold text-white leading-tight" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
              🔥 Early Vendor Advantage<br />
              <span style={{ color: "#E8B94A" }}>Closes in Limited Time</span>
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
              <div key={i} className="text-center rounded-xl px-4 py-3 min-w-[64px]"
                style={{ background: "rgba(201,150,42,0.2)", border: "1px solid rgba(201,150,42,0.4)" }}>
                <div className="font-display font-bold leading-none" style={{ fontSize: "2.2rem", color: "#E8B94A" }}>{u.v}</div>
                <div className="text-[0.65rem] text-white/50 tracking-widest uppercase">{u.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Perks header */}
        <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#C9962A" }}>What Early Birds Get</p>
        <h2 className="font-display font-bold leading-tight mb-10" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#4A0E0E" }}>
          Exclusive Benefits for<br />
          <em className="italic" style={{ color: "#C9962A" }}>First 100 Vendors</em>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {perks.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-xl p-6 flex gap-3.5 items-start transition-all duration-300 hover:-translate-y-1"
              style={{ border: "1px solid rgba(201,150,42,0.2)", boxShadow: "0 4px 20px rgba(107,26,26,0.07)" }}>
              <div className="text-2xl flex-shrink-0">{p.icon}</div>
              <div>
                <div className="font-semibold text-[0.95rem] mb-1" style={{ color: "#4A0E0E" }}>{p.title}</div>
                <div className="text-[0.82rem] leading-relaxed" style={{ color: "#8B7B6B" }}>{p.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
