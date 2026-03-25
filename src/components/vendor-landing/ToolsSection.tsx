import { motion } from "framer-motion";

const tools = [
  { emoji: "📋", title: "Vendor Dashboard", desc: "See all your leads, bookings, enquiries and earnings in one clean dashboard. No more WhatsApp chaos.", tier: "All Plans" },
  { emoji: "📊", title: "Analytics & Insights", desc: "Know exactly how many people viewed your profile, clicked your number, and enquired. Make data-driven decisions.", tier: "Starter & Above" },
  { emoji: "🖼️", title: "Portfolio Showcase", desc: "Upload photos & videos. Create stunning albums that show couples exactly what you can do.", tier: "All Plans" },
  { emoji: "⭐", title: "Ratings & Reviews", desc: "Collect verified reviews from your clients. Social proof that automatically converts more enquiries into bookings.", tier: "All Plans" },
  { emoji: "📅", title: "Booking Calendar", desc: "Manage your availability, block dates, and track upcoming events so you never double-book again.", tier: "Pro & Elite" },
  { emoji: "💬", title: "Direct Enquiry System", desc: "Couples send you enquiries with their date, budget & requirements. You respond directly — no platform middleman.", tier: "All Plans" },
  { emoji: "🔔", title: "Instant Lead Alerts", desc: "Get notified via WhatsApp + SMS the moment a new lead comes in. Be the first to respond, win the booking.", tier: "Starter & Above" },
  { emoji: "🔍", title: "SEO-Optimised Profile", desc: 'Your profile ranks on Google for searches like "wedding photographer in Lucknow". Free organic traffic.', tier: "All Plans" },
  { emoji: "💎", title: "Priority Listing", desc: "Pro & Elite vendors appear at the top of all category searches — maximum visibility, maximum leads.", tier: "Pro & Elite" },
];

export function ToolsSection() {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3 text-accent">Built For Vendors</p>
          <h2 className="font-display font-bold leading-tight text-foreground" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Everything You Need to <em className="italic text-accent">Grow Your Wedding Business</em>
          </h2>
          <p className="text-base leading-relaxed max-w-[560px] mt-3.5 text-muted-foreground">
            A complete toolkit that replaces 5 different paid tools — included in your KarloShaadi plan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {tools.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl p-7 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 group border border-border hover:border-accent/30 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]">
              <div className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-primary to-accent" />
              <div className="text-4xl mb-3.5">{t.emoji}</div>
              <h3 className="text-[1.05rem] font-semibold mb-2 text-foreground">{t.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
              <span className="inline-block mt-3.5 rounded-full px-3 py-1 text-[0.72rem] font-semibold tracking-wide uppercase bg-primary/[0.07] text-primary">
                {t.tier}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
