import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import makeupImg from "@/assets/vendor-proof-makeup.jpg";
import decorImg from "@/assets/vendor-proof-decorator.jpg";
import catererImg from "@/assets/vendor-proof-caterer.jpg";
import djImg from "@/assets/vendor-proof-dj.jpg";
import photographerImg from "@/assets/vendor-proof-photographer.jpg";
import venueImg from "@/assets/vendor-proof-venue.jpg";

const vendors = [
  { name: "Rahul Sharma Studio", cat: "Photographer · Lucknow", before: "2-3 bookings/season", after: "₹3.2L earned in 4 months", img: photographerImg },
  { name: "Dream Decor Events", cat: "Decorator · Delhi", before: "Referral dependent", after: "28 leads/month consistently", img: decorImg },
  { name: "Priya Beauty Studio", cat: "Makeup · Kanpur", before: "Off-season = zero income", after: "Fully booked 3 months ahead", img: makeupImg },
  { name: "Royal Band Lucknow", cat: "Band & DJ · Lucknow", before: "₹40K spent on ads, no ROI", after: "₹1.8L earned, zero ad spend", img: djImg },
  { name: "Shahi Khana Caterers", cat: "Catering · Delhi", before: "15% commission bleeding", after: "42 bookings, 0% commission", img: catererImg },
  { name: "Palace Grounds", cat: "Venue · Kanpur", before: "Empty weekday slots", after: "Wedding season sold out", img: venueImg },
];

export function SocialProofSection() {
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6" style={{ background: "linear-gradient(135deg, hsl(350 72% 22%), hsl(350 72% 30%))" }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <p className="text-[0.7rem] font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#E8B94A" }}>Transformations</p>
            <h2 className="font-display font-bold text-white leading-tight text-xl md:text-4xl">
              Real Vendors. <em className="italic" style={{ color: "#E8B94A" }}>Real Growth.</em>
            </h2>
          </div>
          <button onClick={() => navigate("/vendor/onboarding")}
            className="text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all hover:brightness-110 self-start"
            style={{ background: "rgba(201,150,42,0.15)", border: "1px solid rgba(201,150,42,0.3)", color: "#E8B94A" }}>
            Join Them →
          </button>
        </motion.div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {vendors.map((v, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="flex-shrink-0 w-[200px] md:w-[220px] rounded-xl overflow-hidden relative shadow-2xl group">
              <img src={v.img} alt={v.name} loading="lazy" className="w-full h-[260px] md:h-[300px] object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-3.5"
                style={{ background: "linear-gradient(transparent, rgba(30,5,5,0.95) 50%)" }}>
                <div className="text-white font-bold text-xs">{v.name}</div>
                <div className="text-[0.65rem] mt-0.5" style={{ color: "#E8B94A" }}>{v.cat}</div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-red-400 text-[0.55rem]">✕</span>
                    <span className="text-white/40 text-[0.6rem] line-through">{v.before}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-green-400 text-[0.55rem]">✓</span>
                    <span className="text-[0.6rem] font-semibold" style={{ color: "#E8B94A" }}>{v.after}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
