import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function FinalCTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-6 text-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, hsl(350 72% 15%) 0%, hsl(350 72% 25%) 50%, hsl(350 72% 35%) 100%)" }}>
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(201,150,42,0.1) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-[520px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[0.7rem] font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#E8B94A" }}>Don't Miss Your City Slot</p>
          <h2 className="font-display font-bold text-white leading-tight text-2xl md:text-5xl">
            Your Next Big Booking<br />
            is <span className="italic" style={{ color: "#E8B94A" }}>One Click Away</span>
          </h2>
          <p className="text-white/65 text-sm md:text-base mt-3 mb-8">
            Join KarloShaadi today. The early advantage window closes soon.
          </p>
        </motion.div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => navigate("/vendor/onboarding")}
            className="px-6 md:px-9 py-3 md:py-4 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, hsl(38 75% 50%) 0%, hsl(45 95% 60%) 100%)", color: "hsl(38 90% 15%)", boxShadow: "0 8px 30px rgba(201,150,42,0.35)" }}>
            🚀 Register as Vendor — Free
          </button>
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
            className="px-5 md:px-8 py-3 md:py-4 rounded-lg text-sm text-white cursor-pointer transition-all duration-300 hover:bg-white/[0.08] inline-flex items-center gap-2"
            style={{ border: "1px solid rgba(255,255,255,0.35)" }}>
            💬 Chat on WhatsApp
          </a>
        </div>

        <p className="text-[0.65rem] text-white/35 mt-4">
          No credit card required · Cancel anytime · 100% money-back guarantee
        </p>
      </div>
    </section>
  );
}
