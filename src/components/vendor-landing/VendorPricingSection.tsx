import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free", amount: "₹0", period: "forever free", commission: "15% per booking transaction", popular: false,
    features: ["Basic profile listing", "Up to 10 portfolio photos", "Direct enquiry form", "Customer reviews & ratings", "SEO-optimised profile page", "Standard search placement"],
    cta: "Start Free", ctaStyle: "outlined" as const,
  },
  {
    name: "Silver", amount: "₹4,999", period: "per month", commission: "12% per booking transaction", popular: false,
    features: ["Everything in Free", "Up to 30 portfolio photos", "Lead analytics dashboard", "WhatsApp lead alerts", "Priority standard placement", "Silver verified badge", "Promotional offers feature"],
    cta: "Get Silver", ctaStyle: "outlined" as const,
  },
  {
    name: "Gold", amount: "₹9,999", period: "per month", commission: "Only 8% per booking transaction", popular: true, badge: "⭐ Most Popular",
    features: ["Everything in Silver", "Unlimited portfolio photos + videos", "Priority listing — top of results", "Booking calendar & management", "Advanced analytics & reports", "Gold verified badge", "Featured on home page rotation", "Dedicated account manager"],
    cta: "Get Gold — Best Value", ctaStyle: "gold" as const,
  },
  {
    name: "Diamond", amount: "₹19,999", period: "per month", commission: "🎉 ZERO Commission — Keep 100%", popular: false,
    features: ["Everything in Gold", "Zero transaction commission", "Permanent #1 city position", "Exclusive Diamond badge", "Direct homepage spotlight", "Monthly KarloShaadi Reels feature", "WhatsApp broadcast to couples list", "Dedicated city sales support"],
    cta: "Get Diamond", ctaStyle: "outlined" as const,
  },
];

export function VendorPricingSection() {
  const navigate = useNavigate();

  return (
    <section id="vendor-pricing" className="py-20 px-6" style={{ background: "linear-gradient(180deg, #FAF6EE 0%, #FFF5E6 100%)" }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#C9962A" }}>Transparent Pricing</p>
          <h2 className="font-display font-bold leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#4A0E0E" }}>
            Choose Your<br /><em className="italic" style={{ color: "#C9962A" }}>Growth Plan</em>
          </h2>
          <p className="text-base leading-relaxed max-w-[560px] mt-3.5" style={{ color: "#8B7B6B" }}>
            No hidden charges. Cancel anytime. 100% money-back guarantee if you don't get leads in 30 days.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12 items-stretch">
          {plans.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className={`rounded-2xl p-8 flex flex-col relative overflow-hidden transition-all duration-300 ${
                p.popular ? "scale-[1.03]" : ""
              }`}
              style={p.popular
                ? { background: "linear-gradient(160deg, #4A0E0E, #6B1A1A)", color: "#fff", border: "1px solid #C9962A", boxShadow: "0 20px 60px rgba(107,26,26,0.3)" }
                : { background: "#fff", border: "1px solid rgba(201,150,42,0.15)", boxShadow: "0 4px 24px rgba(107,26,26,0.06)" }
              }>
              {p.badge && (
                <span className="absolute top-4 right-4 rounded-full px-3.5 py-1 text-[0.7rem] font-bold tracking-wide uppercase"
                  style={{ background: "#C9962A", color: "#4A0E0E" }}>
                  {p.badge}
                </span>
              )}

              <div className="font-display font-bold text-2xl" style={{ color: p.popular ? "#E8B94A" : "#4A0E0E" }}>{p.name}</div>

              <div className="mt-5 mb-2">
                <span className="font-display font-bold leading-none" style={{ fontSize: "2.8rem", color: p.popular ? "#fff" : undefined }}>{p.amount}</span>
                <span className="text-sm ml-1" style={{ color: p.popular ? "rgba(255,255,255,0.6)" : "#8B7B6B" }}>{p.period}</span>
              </div>

              <div className="rounded-lg px-3.5 py-2 text-[0.82rem] font-semibold text-center my-4"
                style={p.popular
                  ? { background: "rgba(255,255,255,0.12)", color: "#E8B94A" }
                  : { background: "rgba(107,26,26,0.07)", color: "#6B1A1A" }
                }>
                {p.commission}
              </div>

              <ul className="flex-1 space-y-0">
                {p.features.map((f, fi) => (
                  <li key={fi} className="flex gap-2.5 items-start py-2 text-sm"
                    style={{ borderBottom: p.popular ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(107,26,26,0.06)", color: p.popular ? "rgba(255,255,255,0.85)" : "#1C1C1C" }}>
                    <span className="flex-shrink-0 font-bold" style={{ color: p.popular ? "#E8B94A" : "#C9962A" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button onClick={() => navigate("/vendor/onboarding")}
                className="mt-7 py-3.5 rounded-lg w-full text-sm font-semibold cursor-pointer transition-all duration-300 tracking-wide"
                style={p.ctaStyle === "gold"
                  ? { background: "linear-gradient(135deg, #C9962A, #E8B94A)", color: "#4A0E0E", border: "none", boxShadow: "0 6px 20px rgba(201,150,42,0.35)" }
                  : p.popular
                    ? { background: "transparent", color: "#E8B94A", border: "1.5px solid rgba(232,185,74,0.4)" }
                    : { background: "transparent", color: "#6B1A1A", border: "1.5px solid rgba(107,26,26,0.3)" }
                }>
                {p.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Guarantee */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mt-10 bg-white rounded-2xl p-7"
          style={{ border: "2px dashed #C9962A", boxShadow: "0 4px 20px rgba(201,150,42,0.1)" }}>
          <h3 className="font-display text-3xl font-bold" style={{ color: "#4A0E0E" }}>🛡️ 100% Money-Back Guarantee</h3>
          <p className="text-sm mt-2 max-w-[500px] mx-auto" style={{ color: "#8B7B6B" }}>
            If you don't receive a single verified lead within 30 days of your profile going live, we refund your full plan amount. No questions asked. We win when you win.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
