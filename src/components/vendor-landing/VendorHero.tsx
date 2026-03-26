import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroImg from "@/assets/vendor-hero-success.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};

const trustStats = [
  { num: "₹2.1Cr+", label: "Revenue Generated" },
  { num: "10,000+", label: "Leads Delivered" },
  { num: "500+", label: "Active Vendors" },
  { num: "₹0", label: "To Start Free" },
];

const liveNotifications = [
  "🎉 Rahul Studio just got 3 new leads in Delhi",
  "📸 Priya Makeup booked for ₹85,000 in Lucknow",
  "🔥 12 vendors registered today",
  "💰 Dream Decor earned ₹4.2L this month",
  "✅ Shahi Caterers got verified in 24 hrs",
];

const marqueeItems = [
  "📸 Photographers", "💐 Decorators", "🎵 DJs & Bands",
  "🍽️ Caterers", "💄 Makeup Artists", "🏨 Venues",
  "🚗 Car Rentals", "🎬 Videographers", "🌸 Mehendi",
];

export function VendorHero() {
  const navigate = useNavigate();
  const [notifIdx, setNotifIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setNotifIdx(p => (p + 1) % liveNotifications.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <section className="relative min-h-[85vh] md:min-h-[92vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-20 md:py-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(30,5,5,0.95) 0%, rgba(60,10,10,0.92) 35%, rgba(120,20,20,0.88) 100%)" }} />
        </div>
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9962A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

        {/* Live notification bar */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="relative z-10 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm"
            style={{ background: "rgba(201,150,42,0.12)", border: "1px solid rgba(201,150,42,0.3)" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <AnimatePresence mode="wait">
              <motion.span key={notifIdx}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="text-[0.7rem] font-medium" style={{ color: "#E8B94A" }}>
                {liveNotifications[notifIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="relative z-10 max-w-[860px]">
          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="font-display font-bold text-white leading-[1.08] tracking-tight"
            style={{ fontSize: "clamp(1.9rem, 5.5vw, 4.8rem)" }}>
            Har Booking Pe{" "}
            <span className="relative inline-block">
              <span className="line-through opacity-50">15-20% Commission</span>
              <span className="absolute -top-1 -right-4 text-red-400 font-bold text-lg md:text-2xl rotate-[-12deg]">✕</span>
            </span>
            <br />
            Dena <em className="italic" style={{ color: "#E8B94A" }}>Band Karo</em>
          </motion.h1>

          <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="text-white/70 font-light max-w-[560px] mx-auto mt-4 mb-8 md:mb-10 leading-relaxed text-sm md:text-lg">
            India ka pehla <strong className="text-white font-semibold">zero-commission</strong> wedding marketplace.
            Paid plans starting from just <strong className="font-semibold" style={{ color: "#E8B94A" }}>₹999/month</strong>.
            {" "}500+ vendors already earning more, spending less.
          </motion.p>

          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
            className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => navigate("/vendor/onboarding")}
              className="group px-7 md:px-10 py-3.5 md:py-4 rounded-xl font-bold text-sm md:text-base cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(201,150,42,0.5)]"
              style={{ background: "linear-gradient(135deg, #C9962A 0%, #E8B94A 50%, #C9962A 100%)", backgroundSize: "200% 200%", color: "#3A0A0A", boxShadow: "0 8px 32px rgba(201,150,42,0.4)" }}>
              🚀 Register Free — Takes 2 Min
            </button>
            <button onClick={() => { document.getElementById("vendor-pricing")?.scrollIntoView({ behavior: "smooth" }); }}
              className="px-5 md:px-8 py-3.5 md:py-4 rounded-xl text-sm md:text-base text-white/90 cursor-pointer transition-all duration-300 hover:bg-white/[0.1] backdrop-blur-sm"
              style={{ border: "1px solid rgba(255,255,255,0.25)" }}>
              See Plans ↓
            </button>
          </motion.div>

          {/* Loss aversion hook */}
          <motion.p custom={3.5} variants={fadeUp} initial="hidden" animate="visible"
            className="text-[0.7rem] mt-4 text-red-300/70 font-medium">
            ⚠️ Agar aap ₹5L/year ka business karte ho, toh commission mein ₹75,000–₹1,00,000 ja raha hai
          </motion.p>

          {/* Trust stats */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
            className="grid grid-cols-2 sm:flex sm:gap-10 gap-5 justify-center mt-10 md:mt-14">
            {trustStats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display font-bold leading-none text-2xl sm:text-4xl" style={{ color: "#E8B94A" }}>{s.num}</div>
                <div className="text-[0.6rem] sm:text-[0.68rem] text-white/50 tracking-widest uppercase mt-1.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden py-2.5" style={{ background: "linear-gradient(90deg, hsl(var(--accent)), hsl(45 95% 60%), hsl(var(--accent)))" }}>
        <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="px-6 text-[0.7rem] font-semibold tracking-widest uppercase text-accent-foreground">
              {item} <span className="opacity-50 ml-6">✦</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
