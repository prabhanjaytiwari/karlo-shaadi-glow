import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const perks = [
  { icon: "🥇", title: "City #1 Spotlight", desc: "Top of search results — before everyone else." },
  { icon: "🔒", title: "Price Lock Forever", desc: "Today's price is yours. Even when we raise prices." },
  { icon: "🎁", title: "3 Months Free on Pro+", desc: "Early Pro/Elite members get 3 months on us." },
  { icon: "👑", title: "Founding Partner Badge", desc: "Exclusive badge. Shows couples you're an OG." },
  { icon: "📞", title: "Dedicated Account Manager", desc: "Personal help to optimize your profile & convert." },
  { icon: "📣", title: "Free Social Promotion", desc: "Featured to our 50,000+ followers." },
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
  const navigate = useNavigate();

  return (
    <section className="py-14 md:py-24 px-4 sm:px-6 border-t-[3px] border-b-[3px] border-accent relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #FFF8EE 0%, #FFF2DE 50%, #FFECCC 100%)" }}>
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-10" style={{ background: "radial-gradient(circle, hsl(38 75% 50%), transparent)" }} />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full opacity-10" style={{ background: "radial-gradient(circle, hsl(350 72% 40%), transparent)" }} />

      <div className="max-w-[1100px] mx-auto relative z-10">
        {/* Urgency banner */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-2xl px-5 sm:px-10 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-5 mb-10"
          style={{ background: "linear-gradient(90deg, hsl(350 72% 22%), hsl(350 72% 30%))", boxShadow: "0 20px 60px rgba(107,26,26,0.3)" }}>
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[0.6rem] font-bold tracking-wider uppercase mb-2"
              style={{ background: "rgba(239,68,68,0.15)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.3)" }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-400" />
              </span>
              Only 37 Spots Left in Lucknow
            </div>
            <h2 className="font-display font-bold text-white leading-tight text-lg sm:text-2xl md:text-3xl">
              Early Vendor Window<br />
              <span style={{ color: "#E8B94A" }}>Closing Soon</span>
            </h2>
            <p className="text-white/60 mt-1.5 text-xs sm:text-sm">First 100 vendors per city get lifetime perks</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {[
              { v: String(cd.d).padStart(2, "0"), l: "Days" },
              { v: String(cd.h).padStart(2, "0"), l: "Hrs" },
              { v: String(cd.m).padStart(2, "0"), l: "Min" },
              { v: String(cd.s).padStart(2, "0"), l: "Sec" },
            ].map((u, i) => (
              <div key={i} className="text-center rounded-lg px-3 sm:px-4 py-2.5 min-w-[52px] sm:min-w-[60px]"
                style={{ background: "rgba(201,150,42,0.15)", border: "1px solid rgba(201,150,42,0.35)" }}>
                <div className="font-display font-bold leading-none text-2xl sm:text-3xl" style={{ color: "#E8B94A" }}>{u.v}</div>
                <div className="text-[0.5rem] text-white/45 tracking-widest uppercase mt-0.5">{u.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="text-[0.7rem] font-semibold tracking-[0.15em] uppercase mb-2 text-accent">Founding Member Benefits</p>
        <h2 className="font-display font-bold leading-tight mb-6 text-foreground text-xl md:text-3xl">
          Ye Benefits <em className="italic text-accent">Baad Mein Nahi Milenge</em>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {perks.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl p-4 flex gap-3 items-start border border-accent/20 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-accent/40 transition-all duration-200">
              <div className="text-xl flex-shrink-0 mt-0.5">{p.icon}</div>
              <div>
                <div className="font-bold text-sm mb-0.5 text-foreground">{p.title}</div>
                <div className="text-xs leading-relaxed text-muted-foreground">{p.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Inline CTA */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mt-8">
          <button onClick={() => navigate("/vendor/onboarding")}
            className="px-8 py-3.5 rounded-xl font-bold text-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(201,150,42,0.4)]"
            style={{ background: "linear-gradient(135deg, #C9962A, #E8B94A)", color: "#3A0A0A", boxShadow: "0 8px 30px rgba(201,150,42,0.35)" }}>
            🔥 Claim Your Spot — Register Free
          </button>
          <p className="text-[0.65rem] text-muted-foreground mt-2">No credit card needed · 2 minute setup</p>
        </motion.div>
      </div>
    </section>
  );
}
