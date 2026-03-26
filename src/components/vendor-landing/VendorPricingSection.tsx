import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free", amount: "₹0", period: "forever", commission: "10% per booking", popular: false,
    savings: null,
    features: ["Basic profile listing", "Up to 5 portfolio images", "Direct enquiry form", "Customer reviews & ratings", "Email notifications"],
    cta: "Start Free", ctaStyle: "outlined" as const,
  },
  {
    name: "Starter", amount: "₹999", period: "/month", commission: "7% per booking", popular: false, badge: "STARTER",
    savings: "Save ₹40K+/yr vs WedMeGood",
    features: ["Everything in Free", "Top 10 search placement", "Silver verified badge", "Up to 15 portfolio images", "Basic analytics dashboard"],
    cta: "Get Starter", ctaStyle: "outlined" as const,
  },
  {
    name: "Pro", amount: "₹2,999", period: "/month", commission: "Only 3%", popular: true, badge: "⭐ MOST POPULAR",
    savings: "Save ₹70K+/yr vs WedMeGood",
    features: ["Everything in Starter", "Gold Verified badge", "Unlimited portfolio", "Advanced analytics + CRM", "Featured in category pages", "Priority support"],
    cta: "Get Pro — Best Value", ctaStyle: "gold" as const,
  },
  {
    name: "Elite", amount: "₹6,999", period: "/month", commission: "🎉 ZERO Commission", popular: false, badge: "MAXIMUM ROI",
    savings: "Save ₹1L+/yr — keep 100%",
    features: ["Everything in Pro", "Zero transaction fees", "Top 1-3 in all searches", "Diamond Premium badge", "Homepage featured carousel", "Dedicated account manager", "Social media promotion"],
    cta: "Go Elite", ctaStyle: "outlined" as const,
  },
];

export function VendorPricingSection() {
  const navigate = useNavigate();

  return (
    <section id="vendor-pricing" className="py-14 md:py-24 px-4 sm:px-6" style={{ background: "linear-gradient(180deg, hsl(30 25% 98%) 0%, #FFF5E6 100%)" }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <p className="text-[0.7rem] font-semibold tracking-[0.15em] uppercase mb-2 text-accent">Transparent Pricing</p>
          <h2 className="font-display font-bold leading-tight text-foreground text-2xl md:text-5xl">
            Invest <em className="italic text-accent">₹999/mo</em>, Earn <em className="italic text-accent">₹Lakhs</em>
          </h2>
          <p className="text-sm leading-relaxed max-w-[480px] mx-auto mt-2 text-muted-foreground">
            No hidden charges. Cancel anytime. 100% money-back if zero leads in 30 days.
          </p>
        </motion.div>

        {/* Plans grid */}
        <div className="flex md:grid md:grid-cols-4 gap-4 mt-10 overflow-x-auto pb-4 md:pb-0 md:overflow-visible snap-x snap-mandatory scrollbar-hide items-stretch">
          {plans.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className={`flex-shrink-0 w-[260px] md:w-auto snap-start rounded-2xl p-5 md:p-6 flex flex-col relative overflow-hidden ${p.popular ? "md:scale-[1.03]" : ""}`}
              style={p.popular
                ? { background: "linear-gradient(160deg, hsl(350 72% 22%), hsl(350 72% 32%))", color: "#fff", border: "2px solid hsl(38 75% 50%)", boxShadow: "0 20px 60px rgba(107,26,26,0.35)" }
                : { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }
              }>
              {p.badge && (
                <span className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[0.55rem] font-bold tracking-wider uppercase ${
                  p.popular ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary"
                }`}>
                  {p.badge}
                </span>
              )}

              <div className={`font-display font-bold text-base ${p.popular ? "" : "text-foreground"}`}
                style={p.popular ? { color: "#E8B94A" } : undefined}>{p.name}</div>

              <div className="mt-3 mb-1">
                <span className="font-display font-bold leading-none text-3xl md:text-4xl">{p.amount}</span>
                <span className={`text-xs ml-1 ${p.popular ? "text-white/50" : "text-muted-foreground"}`}>{p.period}</span>
              </div>

              <div className={`rounded-lg px-3 py-1.5 text-[0.75rem] font-bold text-center my-2 ${
                p.popular ? "bg-white/[0.12] text-[#E8B94A]" : "bg-primary/[0.07] text-primary"
              }`}>
                {p.commission}
              </div>

              {p.savings && (
                <div className={`rounded-md px-2 py-1 text-[0.65rem] font-semibold text-center mb-2 ${
                  p.popular ? "bg-green-500/20 text-green-300" : "bg-green-50 text-green-700 border border-green-200"
                }`}>
                  💰 {p.savings}
                </div>
              )}

              <ul className="flex-1 space-y-0">
                {p.features.map((f, fi) => (
                  <li key={fi} className={`flex gap-2 items-start py-1.5 text-xs ${
                    p.popular ? "text-white/80 border-b border-white/10" : "text-foreground border-b border-border/50"
                  }`}>
                    <span className={`flex-shrink-0 font-bold ${p.popular ? "text-[#E8B94A]" : "text-accent"}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button onClick={() => navigate("/vendor/onboarding")}
                className="mt-5 py-3 rounded-lg w-full text-xs font-bold cursor-pointer transition-all duration-300 tracking-wide hover:-translate-y-0.5"
                style={p.ctaStyle === "gold"
                  ? { background: "linear-gradient(135deg, hsl(38 75% 50%), hsl(45 95% 60%))", color: "hsl(38 90% 15%)", border: "none", boxShadow: "0 6px 24px rgba(201,150,42,0.4)" }
                  : p.popular
                    ? { background: "transparent", color: "#E8B94A", border: "1.5px solid rgba(232,185,74,0.5)" }
                    : { background: "transparent", color: "hsl(var(--primary))", border: "1.5px solid hsl(var(--border))" }
                }>
                {p.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Guarantee + Risk Reversal */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mt-10 bg-card rounded-2xl p-6"
          style={{ border: "2px dashed hsl(var(--accent))", boxShadow: "var(--shadow-md)" }}>
          <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">🛡️ Triple Guarantee</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs text-muted-foreground">
            <div className="p-3 rounded-lg bg-background">
              <div className="font-bold text-foreground text-sm mb-1">30-Day Money Back</div>
              No leads? Full refund. No questions.
            </div>
            <div className="p-3 rounded-lg bg-background">
              <div className="font-bold text-foreground text-sm mb-1">No Lock-in</div>
              Cancel anytime. No contracts. No penalties.
            </div>
            <div className="p-3 rounded-lg bg-background">
              <div className="font-bold text-foreground text-sm mb-1">Price Lock Forever</div>
              Early vendors keep today's price permanently.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
