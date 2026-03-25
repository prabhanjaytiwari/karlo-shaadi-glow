import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import dashboardImg from "@/assets/vendor-dashboard-mockup.jpg";

const plans = [
  {
    name: "Free", amount: "₹0", period: "forever free", commission: "10% per booking transaction", popular: false,
    features: ["Basic profile listing", "Up to 5 portfolio images", "Up to 3 service packages", "Direct enquiry form", "Customer reviews & ratings", "Email notifications for inquiries"],
    cta: "Start Free", ctaStyle: "outlined" as const, planId: "free",
  },
  {
    name: "Starter", amount: "₹999", period: "per month", commission: "7% per booking transaction (save 3%)", popular: false, badge: "STARTER",
    features: ["Everything in Free", "Top 10 placement in search", '"Silver" verified badge', "Up to 15 portfolio images", "Basic analytics dashboard", "Monthly performance reports"],
    cta: "Get Starter", ctaStyle: "outlined" as const, planId: "starter",
  },
  {
    name: "Pro", amount: "₹2,999", period: "per month", commission: "Only 3% per booking transaction (save 7%)", popular: true, badge: "⭐ Most Popular",
    features: ["Everything in Starter", '"Gold Verified" badge', "Unlimited portfolio images", "Advanced analytics dashboard", "Featured in category pages", "Priority customer support", "Top 5 search placement"],
    cta: "Get Pro — Best Value", ctaStyle: "gold" as const, planId: "pro",
  },
  {
    name: "Elite", amount: "₹6,999", period: "per month", commission: "🎉 ZERO Commission — Keep 100%", popular: false, badge: "BEST VALUE",
    features: ["Everything in Pro", "Zero transaction fees", "Top 1-3 in all searches", '"Diamond Premium" badge', "Homepage featured carousel", "Dedicated account manager", "Social media promotion", "Custom URL (yourname.karloshaadi.com)", "24/7 VIP support"],
    cta: "Go Elite", ctaStyle: "outlined" as const, planId: "elite",
  },
];

export function VendorPricingSection() {
  const navigate = useNavigate();

  return (
    <section id="vendor-pricing" className="py-20 px-6" style={{ background: "linear-gradient(180deg, hsl(30 25% 98%) 0%, #FFF5E6 100%)" }}>
      <div className="max-w-[1100px] mx-auto">
        {/* Dashboard preview */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-16 text-center">
          <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3 text-accent">Your Vendor Dashboard</p>
          <h2 className="font-display font-bold leading-tight text-foreground mb-6" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
            This is What <em className="italic text-accent">Success Looks Like</em>
          </h2>
          <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-[var(--shadow-xl)]">
            <img src={dashboardImg} alt="KarloShaadi Vendor Dashboard" loading="lazy" className="w-full" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3 text-accent">Transparent Pricing</p>
          <h2 className="font-display font-bold leading-tight text-foreground" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
            Choose Your <em className="italic text-accent">Growth Plan</em>
          </h2>
          <p className="text-base leading-relaxed max-w-[560px] mt-3.5 text-muted-foreground">
            No hidden charges. Cancel anytime. 100% money-back guarantee if you don't get leads in 30 days.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12 items-stretch">
          {plans.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className={`rounded-2xl p-8 flex flex-col relative overflow-hidden transition-all duration-300 ${p.popular ? "scale-[1.03]" : ""}`}
              style={p.popular
                ? { background: "linear-gradient(160deg, hsl(350 72% 25%), hsl(350 72% 35%))", color: "#fff", border: "1px solid hsl(38 75% 50%)", boxShadow: "0 20px 60px rgba(107,26,26,0.3)" }
                : { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }
              }>
              {p.badge && (
                <span className="absolute top-4 right-4 rounded-full px-3.5 py-1 text-[0.7rem] font-bold tracking-wide uppercase bg-accent text-accent-foreground">
                  {p.badge}
                </span>
              )}

              <div className={`font-display font-bold text-2xl ${p.popular ? "" : "text-foreground"}`}
                style={p.popular ? { color: "#E8B94A" } : undefined}>{p.name}</div>

              <div className="mt-5 mb-2">
                <span className="font-display font-bold leading-none" style={{ fontSize: "2.8rem" }}>{p.amount}</span>
                <span className={`text-sm ml-1 ${p.popular ? "text-white/60" : "text-muted-foreground"}`}>{p.period}</span>
              </div>

              <div className={`rounded-lg px-3.5 py-2 text-[0.82rem] font-semibold text-center my-4 ${
                p.popular ? "bg-white/[0.12] text-[#E8B94A]" : "bg-primary/[0.07] text-primary"
              }`}>
                {p.commission}
              </div>

              <ul className="flex-1 space-y-0">
                {p.features.map((f, fi) => (
                  <li key={fi} className={`flex gap-2.5 items-start py-2 text-sm ${
                    p.popular ? "text-white/85 border-b border-white/10" : "text-foreground border-b border-border/50"
                  }`}>
                    <span className={`flex-shrink-0 font-bold ${p.popular ? "text-[#E8B94A]" : "text-accent"}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button onClick={() => navigate("/vendor/onboarding")}
                className="mt-7 py-3.5 rounded-lg w-full text-sm font-semibold cursor-pointer transition-all duration-300 tracking-wide"
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
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mt-10 bg-card rounded-2xl p-7"
          style={{ border: "2px dashed hsl(var(--accent))", boxShadow: "var(--shadow-sm)" }}>
          <h3 className="font-display text-3xl font-bold text-foreground">🛡️ 100% Money-Back Guarantee</h3>
          <p className="text-sm mt-2 max-w-[500px] mx-auto text-muted-foreground">
            If you don't receive a single verified lead within 30 days of your profile going live, we refund your full plan amount. No questions asked. We win when you win.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
