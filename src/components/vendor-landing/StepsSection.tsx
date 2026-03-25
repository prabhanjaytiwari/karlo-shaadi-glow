import { motion } from "framer-motion";

const steps = [
  { n: "1", title: "Register Your Business", desc: "Simple form. 5 minutes. Free, no card needed." },
  { n: "2", title: "Set Up Your Profile", desc: "Upload portfolio, set pricing. We help you shine." },
  { n: "3", title: "Go Live & Get Found", desc: "Couples in your city discover you and reach out." },
  { n: "4", title: "Close Bookings", desc: "Respond, quote, confirm — all from your dashboard." },
];

export function StepsSection() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 bg-card">
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[0.7rem] font-semibold tracking-[0.15em] uppercase mb-2 text-accent">Simple as 1-2-3</p>
          <h2 className="font-display font-bold leading-tight text-foreground text-xl md:text-4xl">
            Start Getting Leads <em className="italic text-accent">in Under 24 Hours</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 md:mt-12">
          {steps.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="text-center px-2 relative">
              {i < steps.length - 1 && (
                <span className="absolute right-[-4px] top-5 text-xl hidden lg:block text-accent/50">→</span>
              )}
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 font-display font-bold text-xl md:text-3xl bg-primary text-primary-foreground shadow-[var(--shadow-md)]">
                {s.n}
              </div>
              <h3 className="font-semibold text-xs md:text-sm mb-1 text-foreground">{s.title}</h3>
              <p className="text-[0.7rem] md:text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
