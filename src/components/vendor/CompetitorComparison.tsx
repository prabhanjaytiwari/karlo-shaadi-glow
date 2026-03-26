import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { name: "Commission on Bookings", us: "0% (Elite)", wedmegood: "15–20%", shaadisaga: "10–15%", highlight: true },
  { name: "Free Registration", us: true, wedmegood: true, shaadisaga: true },
  { name: "AI Lead Matching", us: true, wedmegood: false, shaadisaga: false },
  { name: "Business CRM", us: true, wedmegood: false, shaadisaga: false },
  { name: "Digital Contracts", us: true, wedmegood: false, shaadisaga: false },
  { name: "Portfolio Mini-Site", us: true, wedmegood: "Basic", shaadisaga: false },
  { name: "Payment Tracking", us: true, wedmegood: false, shaadisaga: false },
  { name: "Verified Badge", us: true, wedmegood: true, shaadisaga: true },
  { name: "No Lock-in Contract", us: true, wedmegood: false, shaadisaga: true },
  { name: "WhatsApp Integration", us: true, wedmegood: false, shaadisaga: false },
];

function CellValue({ val }: { val: boolean | string }) {
  if (val === true) return <Check className="h-5 w-5 text-green-500 mx-auto" />;
  if (val === false) return <X className="h-5 w-5 text-red-400/60 mx-auto" />;
  return <span className="text-sm text-muted-foreground">{val}</span>;
}

export function CompetitorComparison() {
  return (
    <section className="py-14 md:py-24 px-4 sm:px-6" style={{ background: "linear-gradient(180deg, hsl(20 25% 8%) 0%, hsl(20 20% 12%) 100%)" }}>
      <div className="max-w-[900px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <p className="text-sm font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#E8B94A" }}>Why Switch?</p>
          <h2 className="font-display font-bold text-2xl md:text-5xl text-white">
            Commission De Rahe Ho?{" "}
            <span className="text-red-400">Band Karo.</span>
          </h2>
          <p className="text-white/55 text-sm md:text-base max-w-md mx-auto mt-3">
            Feature-by-feature comparison. See what you're missing.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(201,150,42,0.2)", background: "rgba(255,255,255,0.03)" }}>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(201,150,42,0.08)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <th className="text-left py-4 px-5 font-medium text-white/60 w-[35%]">Feature</th>
                  <th className="text-center py-4 px-3 w-[22%]">
                    <span className="inline-block px-3 py-1.5 rounded-full font-bold text-xs tracking-wide"
                      style={{ background: "linear-gradient(135deg, #C9962A, #E8B94A)", color: "#3A0A0A" }}>
                      KarloShaadi
                    </span>
                  </th>
                  <th className="text-center py-4 px-3 font-medium text-white/40 w-[22%]">WedMeGood</th>
                  <th className="text-center py-4 px-3 font-medium text-white/40 w-[22%]">ShaadiSaga</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <tr key={i} className="transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <td className={`py-3 px-5 font-medium ${f.highlight ? "text-white font-bold text-base" : "text-white/75"}`}>{f.name}</td>
                    <td className="py-3 px-3 text-center font-bold">
                      {typeof f.us === "string" ? (
                        <span className="font-bold text-sm" style={{ color: "#E8B94A" }}>{f.us}</span>
                      ) : <CellValue val={f.us} />}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {typeof f.wedmegood === "string" ? (
                        <span className="text-red-400 font-bold text-sm">{f.wedmegood}</span>
                      ) : <CellValue val={f.wedmegood} />}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {typeof f.shaadisaga === "string" ? (
                        <span className="text-red-400 font-bold text-sm">{f.shaadisaga}</span>
                      ) : <CellValue val={f.shaadisaga} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Savings calculator */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-6 rounded-xl p-6 text-center"
          style={{ background: "rgba(201,150,42,0.08)", border: "1px solid rgba(201,150,42,0.2)" }}>
          <p className="text-white/65 text-sm mb-2">If you earn ₹5L/year from bookings:</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div>
              <span className="text-red-400 font-display font-bold text-xl md:text-2xl line-through">₹75,000–₹1,00,000</span>
              <span className="text-white/45 text-sm ml-2">on WedMeGood</span>
            </div>
            <span className="text-white/30 text-xl">→</span>
            <div>
              <span className="font-display font-bold text-xl md:text-2xl" style={{ color: "#E8B94A" }}>₹0</span>
              <span className="text-white/45 text-sm ml-2">on KarloShaadi Elite</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
