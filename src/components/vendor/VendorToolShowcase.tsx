import { BarChart3, FileText, Globe, MessageSquare, CreditCard, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const tools = [
  {
    icon: Users,
    title: "Smart CRM",
    desc: "Lead pipeline, follow-ups, and client management — all in one place.",
    tier: "Free",
  },
  {
    icon: FileText,
    title: "Digital Contracts & Invoices",
    desc: "Generate professional contracts and invoices. Send them directly to couples.",
    tier: "Free",
  },
  {
    icon: Globe,
    title: "Portfolio Mini-Site",
    desc: "Your own SEO-optimized vendor page — yourname.karloshaadi.com",
    tier: "Free",
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    desc: "Track views, inquiries, conversion rates, and revenue trends.",
    tier: "Starter",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Integration",
    desc: "Receive inquiries directly on WhatsApp. Auto-respond to leads.",
    tier: "Pro",
  },
  {
    icon: CreditCard,
    title: "Payment Tracking",
    desc: "Manage advances, milestones, and final payments. Send payment reminders.",
    tier: "Free",
  },
];

const tierColors: Record<string, string> = {
  Free: "bg-green-500/10 text-green-600 border-green-500/20",
  Starter: "bg-slate-400/10 text-slate-500 border-slate-400/20",
  Pro: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

export function VendorToolShowcase() {
  return (
    <section className="py-16 md:py-24 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display font-bold text-xl md:text-3xl text-foreground mb-2">
            Aapko Milega <span className="text-accent">Complete Business Toolkit</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Everything you need to manage, grow, and scale your wedding business — most of it FREE.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group p-5 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <tool.icon className="h-5 w-5 text-accent" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tierColors[tool.tier]}`}>
                  {tool.tier === "Free" ? "✓ FREE" : tool.tier}
                </span>
              </div>
              <h3 className="font-semibold text-base text-foreground mb-1.5">{tool.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{tool.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
