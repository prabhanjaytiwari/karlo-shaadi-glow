import { motion } from "framer-motion";

const steps = [
  { n: "1", title: "Register Your Business", desc: "Fill a simple form. Takes less than 5 minutes. Free to start, no credit card needed." },
  { n: "2", title: "Set Up Your Profile", desc: "Upload your portfolio, set your pricing, add services. Our team helps you make it shine." },
  { n: "3", title: "Go Live & Get Found", desc: "Couples searching for vendors in your city discover your profile and contact you directly." },
  { n: "4", title: "Close Bookings", desc: "Respond to leads, send quotes, confirm bookings — all from your vendor dashboard." },
];

export function StepsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#C9962A" }}>Simple as 1-2-3</p>
          <h2 className="font-display font-bold leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#4A0E0E" }}>
            Start Getting Leads<br />
            <em className="italic" style={{ color: "#C9962A" }}>in Under 24 Hours</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 mt-14">
          {steps.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center px-6 relative">
              {i < steps.length - 1 && (
                <span className="absolute right-[-8px] top-7 text-2xl hidden lg:block" style={{ color: "#E8B94A", opacity: 0.5 }}>→</span>
              )}
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 font-display font-bold text-3xl"
                style={{ background: "linear-gradient(135deg, #6B1A1A, #4A0E0E)", color: "#E8B94A", boxShadow: "0 8px 24px rgba(107,26,26,0.25)" }}>
                {s.n}
              </div>
              <h3 className="font-semibold text-base mb-2" style={{ color: "#4A0E0E" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#8B7B6B" }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
