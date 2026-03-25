import { motion } from "framer-motion";

const testimonials = [
  {
    stars: "★★★★★",
    text: "Pehle sirf referrals pe dependent tha. KarloShaadi join kiya aur pehle hi hafte mein 6 enquiries aayi. Pro plan ka best ROI ever.",
    name: "Vikram Srivastava",
    cat: "Wedding Photographer · Lucknow",
  },
  {
    stars: "★★★★★",
    text: "Makeup artist hun, zyada time leads dhundhne mein nahi dena chahti. Ab sab KarloShaadi se automatically aata hai. Elite plan ne booking calendar bhar diya.",
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
    <section className="py-20 px-6 bg-card">
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3 text-accent">What Vendors Say</p>
          <h2 className="font-display font-bold leading-tight text-foreground" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Real Feedback from <em className="italic text-accent">Real Partners</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          {testimonials.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-7 bg-background border border-border shadow-[var(--shadow-sm)]">
              <div className="text-base tracking-wider mb-3.5 text-accent">{t.stars}</div>
              <p className="text-[0.93rem] italic leading-relaxed text-foreground">"{t.text}"</p>
              <div className="mt-4 flex gap-3 items-center">
                <div className="w-11 h-11 rounded-full flex-shrink-0 bg-gradient-to-br from-primary to-accent border-2 border-accent" />
                <div>
                  <div className="font-semibold text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.cat}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
