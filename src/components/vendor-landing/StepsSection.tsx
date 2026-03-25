import { motion } from "framer-motion";

const steps = [
  { n: "1", title: "Register Your Business", desc: "Fill a simple form. Takes less than 5 minutes. Free to start, no credit card needed." },
  { n: "2", title: "Set Up Your Profile", desc: "Upload your portfolio, set your pricing, add services. Our team helps you make it shine." },
  { n: "3", title: "Go Live & Get Found", desc: "Couples searching for vendors in your city discover your profile and contact you directly." },
  { n: "4", title: "Close Bookings", desc: "Respond to leads, send quotes, confirm bookings — all from your vendor dashboard." },
];

export function StepsSection() {
  return (
    <section className="py-20 px-6 bg-card">
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3 text-accent">Simple as 1-2-3</p>
          <h2 className="font-display font-bold leading-tight text-foreground" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Start Getting Leads <em className="italic text-accent">in Under 24 Hours</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 mt-14">
          {steps.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center px-6 relative">
              {i < steps.length - 1 && (
                <span className="absolute right-[-8px] top-7 text-2xl hidden lg:block text-accent/50">→</span>
              )}
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 font-display font-bold text-3xl bg-primary text-primary-foreground shadow-[var(--shadow-lg)]">
                {s.n}
              </div>
              <h3 className="font-semibold text-base mb-2 text-foreground">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
