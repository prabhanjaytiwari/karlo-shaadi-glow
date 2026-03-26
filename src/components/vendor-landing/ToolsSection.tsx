import { motion } from "framer-motion";
import dashboardImg from "@/assets/vendor-dashboard-phone.jpg";

const vendorTools = [
  { emoji: "📋", title: "Smart CRM", desc: "Kanban lead pipeline. Score, track & convert — no lead lost.", worth: "₹2,000/mo", tier: "All Plans" },
  { emoji: "📊", title: "Business Analytics", desc: "Views, clicks, conversions. Know exactly what's working.", worth: "₹1,500/mo", tier: "Starter+" },
  { emoji: "📄", title: "Digital Contracts", desc: "Professional contracts in 60 seconds. Legally sound.", worth: "₹1,000/mo", tier: "Pro+" },
  { emoji: "🌐", title: "Portfolio Mini-Site", desc: "Your own SEO-optimised website. Ranks on Google.", worth: "₹3,000/mo", tier: "All Plans" },
  { emoji: "💬", title: "WhatsApp Integration", desc: "Auto-alerts for new leads. Reply instantly from phone.", worth: "₹800/mo", tier: "All Plans" },
  { emoji: "💰", title: "Payment Tracker", desc: "Milestone payments, invoices, receipts — automated.", worth: "₹1,200/mo", tier: "Pro+" },
];

const coupleTools = [
  { emoji: "🧮", title: "Budget Calculator", desc: "AI-powered budget allocation for every wedding category." },
  { emoji: "📅", title: "Muhurat Finder", desc: "Find auspicious dates based on Hindu calendar & astrology." },
  { emoji: "🎵", title: "AI Music Generator", desc: "Custom wedding songs with couple names & theme." },
  { emoji: "💌", title: "Invite Creator", desc: "Beautiful digital wedding invitations in seconds." },
  { emoji: "🎤", title: "Speech Writer", desc: "AI-written speeches for every wedding occasion." },
  { emoji: "💍", title: "Couple Quiz", desc: "Fun compatibility quiz couples love to share." },
];

const totalWorth = "₹9,500+/mo";

export function ToolsSection() {
  return (
    <section className="py-16 md:py-28 px-4 sm:px-6 bg-background">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-sm font-semibold tracking-[0.15em] uppercase mb-3 text-accent">Your Business Toolkit</p>
            <h2 className="font-display font-bold leading-tight text-foreground text-2xl md:text-5xl">
              Tools Worth <span className="text-accent">{totalWorth}</span><br />
              <em className="italic text-muted-foreground text-xl md:text-3xl">Included FREE in Every Plan</em>
            </h2>
            <p className="text-base leading-relaxed mt-4 text-muted-foreground max-w-md">
              Replace 6 separate paid tools with one dashboard. Manage leads, contracts, payments, portfolio — everything from your phone.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative mx-auto max-w-[280px] md:max-w-[320px]">
            <div className="absolute -inset-4 rounded-3xl opacity-30" style={{ background: "radial-gradient(circle, hsl(38 75% 50% / 0.4), transparent 70%)" }} />
            <img src={dashboardImg} alt="Vendor dashboard on phone" loading="lazy" className="rounded-2xl shadow-2xl w-full relative z-10" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendorTools.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl p-6 relative overflow-hidden group border border-border hover:border-accent/40 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-primary to-accent" />
              <div className="flex justify-between items-start mb-3">
                <div className="text-3xl">{t.emoji}</div>
                <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-full line-through text-muted-foreground bg-muted">
                  {t.worth}
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground">{t.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mt-1.5">{t.desc}</p>
              <span className="inline-block mt-3 rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase bg-accent/10 text-accent border border-accent/20">
                {t.tier}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Couple-facing tools — drives traffic to YOUR profile */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-14 md:mt-20">
          <div className="rounded-2xl p-6 md:p-10" style={{ background: "linear-gradient(135deg, hsl(350 72% 96%), hsl(38 80% 96%))", border: "1px solid hsl(var(--accent) / 0.2)" }}>
            <p className="text-sm font-semibold tracking-[0.15em] uppercase mb-2 text-accent">Why Couples Love Us</p>
            <h3 className="font-display font-bold leading-tight text-foreground text-xl md:text-3xl mb-2">
              10,000+ Couples Use These Tools Every Month
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-lg">
              More couples on platform = more eyes on YOUR profile. These viral tools bring engaged couples directly to our vendor directory.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {coupleTools.map((t, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-xl p-4 text-center border border-border/50 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all">
                  <div className="text-3xl mb-2">{t.emoji}</div>
                  <h4 className="text-sm font-bold text-foreground leading-tight">{t.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">{t.desc}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-accent font-semibold mt-5 text-center">
              🎯 Every tool user = a potential lead for YOU
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
