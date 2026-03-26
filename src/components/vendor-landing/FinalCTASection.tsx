import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function FinalCTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 md:py-36 px-4 sm:px-6 text-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, hsl(350 72% 12%) 0%, hsl(350 72% 22%) 40%, hsl(350 72% 30%) 100%)" }}>
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(201,150,42,0.12) 0%, transparent 65%)" }} />

      <div className="relative z-10 max-w-[580px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#E8B94A" }}>
            Ab Decision Lena Hai
          </p>
          <h2 className="font-display font-bold text-white leading-[1.1] text-3xl md:text-6xl">
            Aapke Competitors<br />
            Already <span className="italic" style={{ color: "#E8B94A" }}>Register</span> Kar Chuke Hain
          </h2>
          <p className="text-white/60 text-base md:text-lg mt-5 mb-4 leading-relaxed">
            Har din wait karne ka matlab = ek aur booking kisi aur ko jaana.
          </p>

          {/* Social proof nudge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10"
            style={{ background: "rgba(201,150,42,0.1)", border: "1px solid rgba(201,150,42,0.25)" }}>
            <div className="flex -space-x-1.5">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="w-7 h-7 rounded-full border-2"
                  style={{ borderColor: "hsl(350 72% 20%)", background: `linear-gradient(135deg, hsl(${350 + i * 15}, 50%, ${35 + i * 5}%), hsl(${38 + i * 12}, 60%, ${40 + i * 5}%))` }} />
              ))}
            </div>
            <span className="text-sm font-medium" style={{ color: "#E8B94A" }}>
              12 vendors registered today
            </span>
          </div>
        </motion.div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => navigate("/vendor/onboarding")}
            className="px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-base md:text-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(201,150,42,0.5)]"
            style={{ background: "linear-gradient(135deg, hsl(38 75% 50%) 0%, hsl(45 95% 60%) 100%)", color: "hsl(38 90% 15%)", boxShadow: "0 10px 36px rgba(201,150,42,0.4)" }}>
            🚀 Register Free — 2 Minutes
          </button>
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
            className="px-6 md:px-8 py-4 md:py-5 rounded-xl text-base text-white/90 cursor-pointer transition-all duration-300 hover:bg-white/[0.08] inline-flex items-center gap-2 backdrop-blur-sm"
            style={{ border: "1px solid rgba(255,255,255,0.25)" }}>
            💬 Chat on WhatsApp
          </a>
        </div>

        <p className="text-sm text-white/35 mt-6">
          No credit card · No lock-in · 30-day money-back guarantee · Cancel anytime
        </p>
      </div>
    </section>
  );
}
