import { motion } from "framer-motion";

const testimonials = [
  {
    stars: "★★★★★",
    text: "Pehle sirf referrals pe dependent tha. KarloShaadi join kiya aur pehle hi hafte mein 6 enquiries aayi. Pro plan ka best ROI ever.",
    name: "Vikram Srivastava",
    cat: "Photographer · Lucknow",
  },
  {
    stars: "★★★★★",
    text: "Makeup artist hun, leads dhundhne mein time waste nahi karti. Ab sab automatically aata hai. Elite plan ne calendar bhar diya.",
    name: "Anjali Verma",
    cat: "Bridal Makeup · Delhi",
  },
  {
    stars: "★★★★★",
    text: "Catering business tha, seasonal leads the. Ab poore saal constant enquiries aati hain. 3 months mein ROI recover.",
    name: "Suresh Pandey",
    cat: "Catering · Kanpur",
  },
];

export function VendorTestimonialsSection() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 bg-card">
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[0.7rem] font-semibold tracking-[0.15em] uppercase mb-2 text-accent">What Vendors Say</p>
          <h2 className="font-display font-bold leading-tight text-foreground text-xl md:text-4xl">
            Real Feedback from <em className="italic text-accent">Real Partners</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8">
          {testimonials.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-xl p-5 bg-background border border-border shadow-[var(--shadow-sm)]">
              <div className="text-sm tracking-wider mb-2 text-accent">{t.stars}</div>
              <p className="text-xs italic leading-relaxed text-foreground">"{t.text}"</p>
              <div className="mt-3 flex gap-2.5 items-center">
                <div className="w-9 h-9 rounded-full flex-shrink-0 bg-gradient-to-br from-primary to-accent border-2 border-accent" />
                <div>
                  <div className="font-semibold text-xs text-foreground">{t.name}</div>
                  <div className="text-[0.65rem] text-muted-foreground">{t.cat}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
