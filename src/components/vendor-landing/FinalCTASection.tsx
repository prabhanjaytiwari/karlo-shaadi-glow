import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function FinalCTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 px-6 text-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #2D0808 0%, #4A0E0E 50%, #8B1A1A 100%)" }}>
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(201,150,42,0.1) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-[600px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: "#E8B94A" }}>Don't Miss Your City Slot</p>
          <h2 className="font-display font-bold text-white leading-tight" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            Your Next Big Booking<br />
            is <span className="italic" style={{ color: "#E8B94A" }}>One Click Away</span>
          </h2>
          <p className="text-white/65 text-lg mt-4 mb-10 max-w-[520px] mx-auto">
            Join KarloShaadi today and be among the first vendors in your city. The early advantage window closes soon.
          </p>
        </motion.div>

        <div className="flex gap-4 justify-center flex-wrap">
          <button onClick={() => navigate("/vendor/onboarding")}
            className="px-9 py-4 rounded-lg font-semibold text-base cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #C9962A 0%, #E8B94A 100%)", color: "#4A0E0E", boxShadow: "0 8px 30px rgba(201,150,42,0.35)" }}>
            🚀 Register as Vendor — Free
          </button>
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
            className="px-8 py-4 rounded-lg text-base text-white cursor-pointer transition-all duration-300 hover:bg-white/[0.08] inline-flex items-center gap-2"
            style={{ border: "1px solid rgba(255,255,255,0.35)" }}>
            💬 Chat on WhatsApp
          </a>
        </div>

        <p className="text-xs text-white/35 mt-5">
          No credit card required to start · Cancel anytime · 100% money-back guarantee
        </p>
      </div>
    </section>
  );
}
