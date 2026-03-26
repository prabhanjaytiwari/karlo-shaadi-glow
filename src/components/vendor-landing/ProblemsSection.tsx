import { motion } from "framer-motion";
import beforeAfterImg from "@/assets/vendor-before-after.jpg";

const painPoints = [
  { icon: "💸", amount: "₹75K–₹1L", title: "Lost to Commission Every Year", desc: "WedMeGood takes 15-20% of every booking. On ₹5L revenue, that's ₹1 Lakh gone." },
  { icon: "📵", amount: "0 Leads", title: "In Off-Season Months", desc: "Jan-March, July-Aug = dead months. No referrals, no income, just rent and EMIs." },
  { icon: "🔍", amount: "Page 5+", title: "On Google Search Results", desc: "Couples search online. If you're not on Page 1, you don't exist." },
  { icon: "📅", amount: "3-4 Hrs", title: "Wasted Daily on Follow-ups", desc: "WhatsApp chaos. No CRM. Missed leads. Double bookings." },
];

export function ProblemsSection() {
  return (
    <section className="py-14 md:py-24 px-4 sm:px-6" style={{ background: "hsl(20 25% 8%)" }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[0.7rem] font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#E8B94A" }}>
            The Painful Truth
          </p>
          <h2 className="font-display font-bold text-white leading-tight text-xl md:text-4xl max-w-lg">
            Aapka Talent <em className="italic text-accent">Kamaal</em> Hai —<br />
            Lekin Business <span className="text-red-400">Struggle</span> Kar Raha Hai
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
          {painPoints.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-xl p-5 flex gap-4 items-start transition-all duration-300 hover:border-red-400/40"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex-shrink-0 text-center">
                <div className="text-2xl mb-1">{p.icon}</div>
                <div className="font-display font-bold text-red-400 text-sm">{p.amount}</div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-0.5">{p.title}</h3>
                <p className="text-xs text-white/45 leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Before/After transformation image */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-10 rounded-2xl overflow-hidden relative shadow-2xl">
          <img src={beforeAfterImg} alt="Before and after joining KarloShaadi" loading="lazy" className="w-full h-[200px] md:h-[320px] object-cover" />
          <div className="absolute inset-0 flex">
            <div className="w-1/2 flex items-end p-4 md:p-6" style={{ background: "linear-gradient(transparent 40%, rgba(0,0,0,0.8))" }}>
              <div>
                <div className="text-red-400 font-bold text-[0.65rem] md:text-xs uppercase tracking-wider">Before</div>
                <div className="text-white font-display font-bold text-sm md:text-lg">Struggling for Leads</div>
              </div>
            </div>
            <div className="w-1/2 flex items-end justify-end p-4 md:p-6" style={{ background: "linear-gradient(transparent 40%, rgba(0,0,0,0.5))" }}>
              <div className="text-right">
                <div className="font-bold text-[0.65rem] md:text-xs uppercase tracking-wider" style={{ color: "#E8B94A" }}>After KarloShaadi</div>
                <div className="text-white font-display font-bold text-sm md:text-lg">Fully Booked</div>
              </div>
            </div>
          </div>
          {/* Center divider */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] bg-accent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent rounded-full w-10 h-10 flex items-center justify-center text-accent-foreground font-bold text-xs shadow-lg">
            VS
          </div>
        </motion.div>
      </div>
    </section>
  );
}
