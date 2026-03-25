import { motion } from "framer-motion";

const tools = [
  { emoji: "📋", title: "Vendor Dashboard", desc: "All leads, bookings & earnings in one place.", tier: "All Plans" },
  { emoji: "📊", title: "Analytics & Insights", desc: "Track views, clicks, and enquiry conversions.", tier: "Starter+" },
  { emoji: "🖼️", title: "Portfolio Showcase", desc: "Upload photos & videos. Stunning albums.", tier: "All Plans" },
  { emoji: "⭐", title: "Ratings & Reviews", desc: "Verified reviews that convert enquiries.", tier: "All Plans" },
  { emoji: "📅", title: "Booking Calendar", desc: "Manage availability. Never double-book.", tier: "Pro+" },
  { emoji: "💬", title: "Direct Enquiry System", desc: "Couples send requirements. You respond directly.", tier: "All Plans" },
  { emoji: "🔔", title: "Instant Lead Alerts", desc: "WhatsApp + SMS alerts for new leads.", tier: "Starter+" },
  { emoji: "🔍", title: "SEO-Optimised Profile", desc: "Rank on Google for your city + category.", tier: "All Plans" },
  { emoji: "💎", title: "Priority Listing", desc: "Top of search results. Maximum visibility.", tier: "Pro+" },
];

export function ToolsSection() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 bg-background">
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[0.7rem] font-semibold tracking-[0.15em] uppercase mb-2 text-accent">Built For Vendors</p>
          <h2 className="font-display font-bold leading-tight text-foreground text-xl md:text-4xl">
            Everything You Need to <em className="italic text-accent">Grow Your Business</em>
          </h2>
          <p className="text-sm leading-relaxed max-w-[500px] mt-2 text-muted-foreground">
            A complete toolkit that replaces 5 different paid tools — included in your plan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
          {tools.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.03 }}
              className="bg-card rounded-xl p-4 md:p-5 relative overflow-hidden group border border-border hover:border-accent/30 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-200">
              <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-primary to-accent" />
              <div className="flex gap-3 items-start">
                <div className="text-2xl flex-shrink-0">{t.emoji}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">{t.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground mt-0.5">{t.desc}</p>
                  <span className="inline-block mt-2 rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wide uppercase bg-primary/[0.07] text-primary">
                    {t.tier}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
