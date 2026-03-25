import { motion } from "framer-motion";

const problems = [
  { icon: "📵", title: "No Consistent Lead Flow", desc: "Referrals dry up. Some months great, others zero." },
  { icon: "💸", title: "Wasting Money on Ads", desc: "₹5K–₹20K on ads with no guaranteed results." },
  { icon: "🤝", title: "Middlemen Take a Cut", desc: "Aggregators charge 15-20% commission per booking." },
  { icon: "📊", title: "No Business Analytics", desc: "No idea what's converting or how to scale." },
  { icon: "🔍", title: "Low Online Visibility", desc: "Competitors show up. You're invisible to couples." },
  { icon: "📅", title: "No Booking System", desc: "WhatsApp chaos. No calendar, no reminders." },
];

export function ProblemsSection() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6" style={{ background: "hsl(20 25% 10%)" }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[0.7rem] font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#E8B94A" }}>Sound Familiar?</p>
          <h2 className="font-display font-bold text-white leading-tight text-xl md:text-4xl">
            Problems Every <em className="italic text-accent">Vendor Faces</em>
          </h2>
          <p className="text-sm text-white/60 leading-relaxed max-w-[500px] mt-2">
            You're great at your work — getting the right clients is a different game.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
          {problems.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              className="rounded-xl p-5 bg-white/[0.05] border border-white/10 hover:border-accent/30 transition-colors">
              <div className="text-2xl mb-2">{p.icon}</div>
              <h3 className="text-sm font-semibold text-white mb-1">{p.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
