import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { name: "Commission", us: "0%", wedmegood: "15-20%", shaadisaga: "10-15%" },
  { name: "Free Registration", us: true, wedmegood: true, shaadisaga: true },
  { name: "AI Lead Matching", us: true, wedmegood: false, shaadisaga: false },
  { name: "Business CRM", us: true, wedmegood: false, shaadisaga: false },
  { name: "Digital Contracts", us: true, wedmegood: false, shaadisaga: false },
  { name: "Portfolio Mini-Site", us: true, wedmegood: "Basic", shaadisaga: false },
  { name: "Payment Tracking", us: true, wedmegood: false, shaadisaga: false },
  { name: "Verified Badge", us: true, wedmegood: true, shaadisaga: true },
  { name: "No Lock-in", us: true, wedmegood: false, shaadisaga: true },
  { name: "WhatsApp Integration", us: true, wedmegood: false, shaadisaga: false },
];

function CellValue({ val }: { val: boolean | string }) {
  if (val === true) return <Check className="h-4 w-4 text-green-500 mx-auto" />;
  if (val === false) return <X className="h-4 w-4 text-red-400 mx-auto" />;
  return <span className="text-xs text-muted-foreground">{val}</span>;
}

export function CompetitorComparison() {
  return (
    <section className="py-10 md:py-16 px-4 sm:px-6">
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
          <h2 className="font-display font-bold text-lg md:text-3xl text-foreground">
            Commission De Rahe Ho? <span className="text-accent">Band Karo.</span>
          </h2>
          <p className="text-muted-foreground text-xs max-w-md mx-auto mt-1">
            See how Karlo Shaadi compares — more features, less charges.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto overflow-x-auto scrollbar-hide">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-medium text-muted-foreground w-[35%]">Feature</th>
                <th className="text-center py-3 px-2 w-[22%]">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 font-bold text-accent text-[0.65rem]">KarloShaadi</span>
                </th>
                <th className="text-center py-3 px-2 font-medium text-muted-foreground w-[22%]">WedMeGood</th>
                <th className="text-center py-3 px-2 font-medium text-muted-foreground w-[22%]">ShaadiSaga</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2 px-2 font-medium text-foreground">{f.name}</td>
                  <td className="py-2 px-2 text-center font-bold">
                    {typeof f.us === "string" ? <span className="text-accent font-bold">{f.us}</span> : <CellValue val={f.us} />}
                  </td>
                  <td className="py-2 px-2 text-center"><CellValue val={f.wedmegood} /></td>
                  <td className="py-2 px-2 text-center"><CellValue val={f.shaadisaga} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
