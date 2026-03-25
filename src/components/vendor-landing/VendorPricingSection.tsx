import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import dashboardImg from "@/assets/vendor-dashboard-mockup.jpg";

const plans = [
  {
    name: "Free", amount: "₹0", period: "forever", commission: "10% per booking", popular: false,
    features: ["Basic profile listing", "Up to 5 portfolio images", "Direct enquiry form", "Customer reviews & ratings", "Email notifications"],
    cta: "Start Free", ctaStyle: "outlined" as const,
  },
  {
    name: "Starter", amount: "₹999", period: "/month", commission: "7% per booking", popular: false, badge: "STARTER",
    features: ["Everything in Free", "Top 10 search placement", "Silver verified badge", "Up to 15 portfolio images", "Basic analytics dashboard"],
    cta: "Get Starter", ctaStyle: "outlined" as const,
  },
  {
    name: "Pro", amount: "₹2,999", period: "/month", commission: "Only 3% per booking", popular: true, badge: "⭐ POPULAR",
    features: ["Everything in Starter", "Gold Verified badge", "Unlimited portfolio", "Advanced analytics", "Featured in category pages", "Priority support"],
    cta: "Get Pro — Best Value", ctaStyle: "gold" as const,
  },
  {
    name: "Elite", amount: "₹6,999", period: "/month", commission: "🎉 ZERO Commission", popular: false, badge: "BEST VALUE",
    features: ["Everything in Pro", "Zero transaction fees", "Top 1-3 in all searches", "Diamond Premium badge", "Homepage featured carousel", "Dedicated account manager", "Social media promotion"],
    cta: "Go Elite", ctaStyle: "outlined" as const,
  },
];

export function VendorPricingSection() {
  const navigate = useNavigate();

  return (
    <section id="vendor-pricing" className="py-12 md:py-20 px-4 sm:px-6" style={{ background: "linear-gradient(180deg, hsl(30 25% 98%) 0%, #FFF5E6 100%)" }}>
      <div className="max-w-[1100px] mx-auto">
        {/* Dashboard preview */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-10 md:mb-16 text-center">
          <p className="text-[0.7rem] font-semibold tracking-[0.15em] uppercase mb-2 text-accent">Your Vendor Dashboard</p>
          <h2 className="font-display font-bold leading-tight text-foreground mb-4 text-xl md:text-3xl">
            This is What <em className="italic text-accent">Success Looks Like</em>
          </h2>
          <div className="max-w-2xl mx-auto rounded-xl overflow-hidden shadow-[var(--shadow-xl)]">
            <img src={dashboardImg} alt="KarloShaadi Vendor Dashboard" loading="lazy" className="w-full" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[0.7rem] font-semibold tracking-[0.15em] uppercase mb-2 text-accent">Transparent Pricing</p>
          <h2 className="font-display font-bold leading-tight text-foreground text-xl md:text-4xl">
            Choose Your <em className="italic text-accent">Growth Plan</em>
          </h2>
          <p className="text-sm leading-relaxed max-w-[500px] mt-2 text-muted-foreground">
            No hidden charges. Cancel anytime. 100% money-back guarantee if you don't get leads in 30 days.
          </p>
        </motion.div>

        {/* Mobile: horizontal scroll, Desktop: grid */}
        <div className="flex md:grid md:grid-cols-4 gap-4 mt-8 overflow-x-auto pb-4 md:pb-0 md:overflow-visible snap-x snap-mandatory scrollbar-hide items-stretch">
          {plans.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className={`flex-shrink-0 w-[260px] md:w-auto snap-start rounded-2xl p-5 md:p-6 flex flex-col relative overflow-hidden ${p.popular ? "md:scale-[1.02]" : ""}`}
              style={p.popular
                ? { background: "linear-gradient(160deg, hsl(350 72% 25%), hsl(350 72% 35%))", color: "#fff", border: "1px solid hsl(38 75% 50%)", boxShadow: "0 16px 48px rgba(107,26,26,0.3)" }
                : { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }
              }>
              {p.badge && (
                <span className="absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold tracking-wide uppercase bg-accent text-accent-foreground">
                  {p.badge}
                </span>
              )}

              <div className={`font-display font-bold text-lg ${p.popular ? "" : "text-foreground"}`}
                style={p.popular ? { color: "#E8B94A" } : undefined}>{p.name}</div>

              <div className="mt-3 mb-1">
                <span className="font-display font-bold leading-none text-3xl md:text-4xl">{p.amount}</span>
                <span className={`text-xs ml-1 ${p.popular ? "text-white/60" : "text-muted-foreground"}`}>{p.period}</span>
              </div>

              <div className={`rounded-lg px-3 py-1.5 text-[0.75rem] font-semibold text-center my-3 ${
                p.popular ? "bg-white/[0.12] text-[#E8B94A]" : "bg-primary/[0.07] text-primary"
              }`}>
                {p.commission}
              </div>

              <ul className="flex-1 space-y-0">
                {p.features.map((f, fi) => (
                  <li key={fi} className={`flex gap-2 items-start py-1.5 text-xs ${
                    p.popular ? "text-white/85 border-b border-white/10" : "text-foreground border-b border-border/50"
                  }`}>
                    <span className={`flex-shrink-0 font-bold ${p.popular ? "text-[#E8B94A]" : "text-accent"}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button onClick={() => navigate("/vendor/onboarding")}
                className="mt-5 py-3 rounded-lg w-full text-xs font-semibold cursor-pointer transition-all duration-300 tracking-wide"
                style={p.ctaStyle === "gold"
                  ? { background: "linear-gradient(135deg, hsl(38 75% 50%), hsl(45 95% 60%))", color: "hsl(38 90% 15%)", border: "none", boxShadow: "0 6px 20px rgba(201,150,42,0.35)" }
                  : p.popular
                    ? { background: "transparent", color: "#E8B94A", border: "1.5px solid rgba(232,185,74,0.4)" }
                    : { background: "transparent", color: "hsl(var(--primary))", border: "1.5px solid hsl(var(--border))" }
                }>
                {p.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Guarantee */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mt-8 bg-card rounded-xl p-5"
          style={{ border: "2px dashed hsl(var(--accent))", boxShadow: "var(--shadow-sm)" }}>
          <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">🛡️ 100% Money-Back Guarantee</h3>
          <p className="text-xs mt-1.5 max-w-[440px] mx-auto text-muted-foreground">
            No leads in 30 days? Full refund. No questions asked.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
