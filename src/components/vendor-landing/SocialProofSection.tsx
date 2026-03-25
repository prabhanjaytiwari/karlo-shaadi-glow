import { motion } from "framer-motion";
import makeupImg from "@/assets/vendor-proof-makeup.jpg";
import decorImg from "@/assets/vendor-proof-decorator.jpg";
import catererImg from "@/assets/vendor-proof-caterer.jpg";
import djImg from "@/assets/vendor-proof-dj.jpg";
import photographerImg from "@/assets/vendor-proof-photographer.jpg";
import venueImg from "@/assets/vendor-proof-venue.jpg";

const vendors = [
  { name: "Rahul Sharma Studio", cat: "Photographer · Lucknow", earn: "₹3.2L earned", img: photographerImg },
  { name: "Dream Decor Events", cat: "Decorator · Delhi", earn: "28 leads/month", img: decorImg },
  { name: "Priya Beauty Studio", cat: "Makeup · Kanpur", earn: "Fully booked 3mo", img: makeupImg },
  { name: "Royal Band Lucknow", cat: "Band & DJ · Lucknow", earn: "₹1.8L earned", img: djImg },
  { name: "Shahi Khana Caterers", cat: "Catering · Delhi", earn: "42 bookings", img: catererImg },
  { name: "Palace Grounds", cat: "Venue · Kanpur", earn: "Season sold out", img: null },
];

export function SocialProofSection() {
  return (
    <section className="py-10 md:py-16 px-4 sm:px-6" style={{ background: "linear-gradient(135deg, hsl(350 72% 25%), hsl(350 72% 32%))" }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[0.7rem] font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#E8B94A" }}>Real Vendors. Real Results.</p>
          <h2 className="font-display font-bold text-white leading-tight text-xl md:text-4xl">
            Vendors Already Winning <em className="italic" style={{ color: "#E8B94A" }}>on KarloShaadi</em>
          </h2>
        </motion.div>

        <div className="flex gap-3 overflow-x-auto pb-2 mt-6 scrollbar-hide">
          {vendors.map((v, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="flex-shrink-0 w-[180px] md:w-[220px] rounded-xl overflow-hidden relative shadow-[var(--shadow-xl)]">
              {v.img ? (
                <img src={v.img} alt={v.name} loading="lazy" className="w-full h-[220px] md:h-[280px] object-cover" />
              ) : (
                <div className="w-full h-[220px] md:h-[280px]"
                  style={{ background: `linear-gradient(135deg, hsl(${350 + i * 15}, 40%, ${25 + i * 5}%), hsl(${38 + i * 10}, 50%, ${30 + i * 5}%))` }} />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-3"
                style={{ background: "linear-gradient(transparent, rgba(45,8,8,0.9))" }}>
                <div className="text-white font-semibold text-xs">{v.name}</div>
                <div className="text-[0.65rem] mt-0.5" style={{ color: "#E8B94A" }}>{v.cat}</div>
                <span className="inline-block mt-1.5 rounded px-2 py-0.5 text-[0.6rem] font-semibold"
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
