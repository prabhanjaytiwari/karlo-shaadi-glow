import { Check, X, Minus } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { name: "Commission on Bookings", us: "0%", wedmegood: "15-20%", shaadisaga: "10-15%" },
  { name: "Free Registration", us: true, wedmegood: true, shaadisaga: true },
  { name: "AI-Powered Lead Matching", us: true, wedmegood: false, shaadisaga: false },
  { name: "Business CRM & Dashboard", us: true, wedmegood: false, shaadisaga: false },
  { name: "Digital Contracts & Invoices", us: true, wedmegood: false, shaadisaga: false },
  { name: "Portfolio Mini-Site (SEO)", us: true, wedmegood: "Basic", shaadisaga: false },
  { name: "Payment Tracking", us: true, wedmegood: false, shaadisaga: false },
  { name: "Verified Badge System", us: true, wedmegood: true, shaadisaga: true },
  { name: "No Lock-in Contract", us: true, wedmegood: false, shaadisaga: true },
  { name: "WhatsApp Integration", us: true, wedmegood: false, shaadisaga: false },
];

function CellValue({ val }: { val: boolean | string }) {
  if (val === true) return <Check className="h-5 w-5 text-green-500 mx-auto" />;
  if (val === false) return <X className="h-5 w-5 text-red-400 mx-auto" />;
  return <span className="text-sm text-muted-foreground">{val}</span>;
}

export function CompetitorComparison() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display font-bold text-xl md:text-3xl text-foreground mb-2">
            Commission De Rahe Ho? <span className="text-accent">Band Karo.</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            See how Karlo Shaadi compares to other platforms — we give you more, charge you less.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-3 font-medium text-muted-foreground w-[40%]">Feature</th>
                <th className="text-center py-4 px-3 w-[20%]">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                    <span className="font-bold text-accent text-xs">Karlo Shaadi</span>
                  </div>
                </th>
                <th className="text-center py-4 px-3 font-medium text-muted-foreground w-[20%]">WedMeGood</th>
                <th className="text-center py-4 px-3 font-medium text-muted-foreground w-[20%]">ShaadiSaga</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <motion.tr
                  key={f.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-3 font-medium text-foreground">{f.name}</td>
                  <td className="py-3 px-3 text-center font-bold">
                    {typeof f.us === "string" ? (
                      <span className="text-accent font-bold">{f.us}</span>
                    ) : (
                      <CellValue val={f.us} />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center"><CellValue val={f.wedmegood} /></td>
                  <td className="py-3 px-3 text-center"><CellValue val={f.shaadisaga} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
