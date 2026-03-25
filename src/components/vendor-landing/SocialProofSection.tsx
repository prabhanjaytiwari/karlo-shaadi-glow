import { motion } from "framer-motion";
import makeupImg from "@/assets/vendor-proof-makeup.jpg";
import decorImg from "@/assets/vendor-proof-decorator.jpg";
import catererImg from "@/assets/vendor-proof-caterer.jpg";
import djImg from "@/assets/vendor-proof-dj.jpg";

const vendors = [
  { name: "Rahul Sharma Studio", cat: "Wedding Photographer · Lucknow", earn: "₹3.2L earned this month", img: null },
  { name: "Dream Decor Events", cat: "Wedding Decorator · Delhi", earn: "28 leads in 30 days", img: decorImg },
  { name: "Priya Beauty Studio", cat: "Bridal Makeup · Kanpur", earn: "Fully booked 3 months ahead", img: makeupImg },
  { name: "Royal Band Lucknow", cat: "Live Band & DJ · Lucknow", earn: "₹1.8L earned this month", img: djImg },
  { name: "Shahi Khana Caterers", cat: "Catering Service · Delhi", earn: "42 bookings confirmed", img: catererImg },
  { name: "Palace Grounds Venue", cat: "Wedding Venue · Kanpur", earn: "Season sold out in 2 weeks", img: null },
];

export function SocialProofSection() {
  return (
    <section className="py-16 px-6 bg-primary" style={{ background: "linear-gradient(135deg, hsl(350 72% 25%), hsl(350 72% 32%))" }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#E8B94A" }}>Real Vendors. Real Results.</p>
          <h2 className="font-display font-bold text-white leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Vendors Already Winning <em className="italic" style={{ color: "#E8B94A" }}>on KarloShaadi</em>
          </h2>
        </motion.div>

        <div className="flex gap-4 overflow-x-auto pb-3 mt-9" style={{ scrollbarWidth: "none" }}>
          {vendors.map((v, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="flex-shrink-0 w-[240px] rounded-2xl overflow-hidden relative shadow-[var(--shadow-xl)]">
              {v.img ? (
                <img src={v.img} alt={v.name} loading="lazy" className="w-full h-[300px] object-cover" />
              ) : (
                <div className="w-full h-[300px]"
                  style={{ background: `linear-gradient(135deg, hsl(${350 + i * 15}, 40%, ${25 + i * 5}%), hsl(${38 + i * 10}, 50%, ${30 + i * 5}%))` }} />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 pt-5"
                style={{ background: "linear-gradient(transparent, rgba(45,8,8,0.9))" }}>
                <div className="text-white font-semibold text-sm">{v.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "#E8B94A" }}>{v.cat}</div>
                <span className="inline-block mt-2 rounded-md px-2.5 py-1 text-[0.72rem] font-semibold"
                  style={{ background: "rgba(201,150,42,0.2)", border: "1px solid rgba(201,150,42,0.4)", color: "#E8B94A" }}>
                  {v.earn}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
