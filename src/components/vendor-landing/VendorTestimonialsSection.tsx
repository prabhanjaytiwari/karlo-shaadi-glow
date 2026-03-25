import { motion } from "framer-motion";

const testimonials = [
  {
    stars: "★★★★★",
    text: "Pehle sirf referrals pe dependent tha. KarloShaadi join kiya aur pehle hi hafte mein 6 enquiries aayi. Gold plan ka best ROI ever.",
    name: "Vikram Srivastava",
    cat: "Wedding Photographer · Lucknow",
  },
  {
    stars: "★★★★★",
    text: "Makeup artist hun, zyada time leads dhundhne mein nahi dena chahti. Ab sab KarloShaadi se automatically aata hai. Diamond plan ne booking calendar bhar diya.",
    name: "Anjali Verma",
    cat: "Bridal Makeup Artist · Delhi",
  },
  {
    stars: "★★★★★",
    text: "Catering business tha, seasonal leads the. Ab poore saal constant enquiries aati hain. 3 months mein ROI recover ho gaya, ab pure profit mein hoon.",
    name: "Suresh Pandey",
    cat: "Catering Services · Kanpur",
  },
];

export function VendorTestimonialsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#C9962A" }}>What Vendors Say</p>
          <h2 className="font-display font-bold leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#4A0E0E" }}>
            Real Feedback from<br /><em className="italic" style={{ color: "#C9962A" }}>Real Partners</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          {testimonials.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-7"
              style={{ background: "#FAF6EE", border: "1px solid rgba(201,150,42,0.15)", boxShadow: "0 4px 20px rgba(107,26,26,0.06)" }}>
              <div className="text-base tracking-wider mb-3.5" style={{ color: "#C9962A" }}>{t.stars}</div>
              <p className="text-[0.93rem] italic leading-relaxed" style={{ color: "#1C1C1C" }}>"{t.text}"</p>
              <div className="mt-4 flex gap-3 items-center">
                {/* Avatar placeholder */}
                <div className="w-11 h-11 rounded-full flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, #6B1A1A, #C9962A)`, border: "2px solid #C9962A" }} />
                <div>
                  <div className="font-semibold text-sm" style={{ color: "#4A0E0E" }}>{t.name}</div>
                  <div className="text-xs" style={{ color: "#8B7B6B" }}>{t.cat}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
