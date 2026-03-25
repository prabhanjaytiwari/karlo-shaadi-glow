import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import heroImg from "@/assets/vendor-hero-photographer.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const trustStats = [
  { num: "10,000+", label: "Monthly Searches" },
  { num: "3 Cities", label: "Lucknow · Delhi · Kanpur" },
  { num: "500+", label: "Vendors Onboard" },
  { num: "₹0", label: "To Start Free" },
];

const marqueeItems = [
  "🎊 Wedding Photographers", "💐 Decorators & Florists", "🎵 DJs & Live Bands",
  "🍽️ Catering Services", "💄 Bridal Makeup Artists", "🏨 Wedding Venues",
  "🚗 Car Rentals", "🎬 Videographers", "🌸 Mehendi Artists",
];

export function VendorHero() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(45,8,8,0.92) 0%, rgba(74,14,14,0.88) 40%, rgba(139,26,26,0.85) 100%)" }} />
        </div>
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9962A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

        <div className="relative z-10 max-w-[820px]">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border text-xs font-medium tracking-widest uppercase mb-7"
            style={{ background: "rgba(201,150,42,0.15)", borderColor: "rgba(201,150,42,0.4)", color: "#E8B94A" }}>
            🔥 Early Vendor Advantage — Limited Seats Per City
          </motion.div>

          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="font-display font-bold text-white leading-[1.12] tracking-tight"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}>
            India's Fastest Growing{" "}
            <br className="hidden sm:block" />
            Wedding Marketplace{" "}
            <br className="hidden sm:block" />
            <em className="italic" style={{ color: "#E8B94A" }}>Wants Your Business</em>
          </motion.h1>

          <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="text-white/70 font-light max-w-[600px] mx-auto mt-5 mb-10 leading-relaxed"
            style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}>
            Get verified leads directly in your inbox. No middlemen. No guesswork.
            Join 500+ vendors already closing bookings on KarloShaadi.
          </motion.p>

          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
            className="flex gap-3.5 justify-center flex-wrap">
            <button onClick={() => navigate("/vendor/onboarding")}
              className="px-9 py-4 rounded-lg font-semibold text-base cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #C9962A 0%, #E8B94A 100%)", color: "#4A0E0E", boxShadow: "0 8px 30px rgba(201,150,42,0.35)" }}>
              🚀 Register Free Today
            </button>
            <button onClick={() => { document.getElementById("vendor-pricing")?.scrollIntoView({ behavior: "smooth" }); }}
              className="px-8 py-4 rounded-lg text-base text-white cursor-pointer transition-all duration-300 hover:bg-white/[0.08]"
              style={{ border: "1px solid rgba(255,255,255,0.35)" }}>
              View Pricing Plans
            </button>
          </motion.div>

          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
            className="flex gap-8 justify-center flex-wrap mt-14">
            {trustStats.map((s, i) => (
              <div key={i} className="flex items-center gap-8">
                <div className="text-center">
                  <div className="font-display font-bold leading-none" style={{ fontSize: "2.2rem", color: "#E8B94A" }}>{s.num}</div>
                  <div className="text-[0.7rem] text-white/55 tracking-widest uppercase mt-1">{s.label}</div>
                </div>
                {i < trustStats.length - 1 && <div className="w-px h-10 bg-white/15 hidden sm:block" />}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden py-3" style={{ background: "linear-gradient(90deg, hsl(var(--accent)), hsl(45 95% 60%), hsl(var(--accent)))" }}>
        <div className="flex whitespace-nowrap animate-[marquee_22s_linear_infinite]">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="px-8 text-xs font-semibold tracking-widest uppercase text-accent-foreground">
              {item} <span className="opacity-50 ml-8">✦</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
