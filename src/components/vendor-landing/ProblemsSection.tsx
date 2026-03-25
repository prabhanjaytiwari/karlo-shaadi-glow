import { motion } from "framer-motion";

const problems = [
  { icon: "📵", title: "No Consistent Lead Flow", desc: "Relying on referrals and word-of-mouth only. Some months are great, others completely dry." },
  { icon: "💸", title: "Wasting Money on Ads", desc: "Spending ₹5,000–₹20,000 on Facebook/Google ads with no guaranteed results or ROI." },
  { icon: "🤝", title: "Middlemen Take a Cut", desc: "Broker networks and aggregators charge high commissions and don't care about your growth." },
  { icon: "📊", title: "No Business Analytics", desc: "You don't know where your clients come from, what's converting, or how to scale your bookings." },
  { icon: "🔍", title: "Low Online Visibility", desc: "Your competitors are showing up when couples search. You're missing thousands of potential bookings." },
  { icon: "📅", title: "No Booking System", desc: "Managing enquiries through WhatsApp and calls is chaos. No calendar, no reminders, no system." },
];

export function ProblemsSection() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(20 25% 10%)" }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#E8B94A" }}>Sound Familiar?</p>
          <h2 className="font-display font-bold text-white leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            The Problems Every <em className="italic text-accent">Wedding Vendor Faces</em>
          </h2>
          <p className="text-base text-white/60 leading-relaxed max-w-[560px] mt-3.5">
            You're great at your work — but getting the right clients at the right time is a different game entirely.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {problems.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="rounded-xl p-7 transition-all duration-300 bg-white/[0.05] border border-white/10 hover:border-accent/30">
              <div className="text-3xl mb-3.5">{p.icon}</div>
              <h3 className="text-base font-semibold text-white mb-2">{p.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
