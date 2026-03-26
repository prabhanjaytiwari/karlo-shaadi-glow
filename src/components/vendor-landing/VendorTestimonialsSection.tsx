import { motion } from "framer-motion";
import confidentImg from "@/assets/vendor-testimonial-portrait.jpg";

const testimonials = [
  {
    stars: "★★★★★",
    text: "Pehle sirf referrals pe dependent tha. KarloShaadi join kiya aur pehle hi hafte mein 6 enquiries aayi. Pro plan ka best ROI ever.",
    name: "Vikram Srivastava",
    cat: "Photographer · Lucknow",
    metric: "6x more leads",
  },
  {
    stars: "★★★★★",
    text: "Makeup artist hun, leads dhundhne mein time waste nahi karti ab. Elite plan ne calendar bhar diya — 3 months advance booked.",
    name: "Anjali Verma",
    cat: "Bridal Makeup · Delhi",
    metric: "3 months ahead booked",
  },
  {
    stars: "★★★★★",
    text: "WedMeGood pe 18% commission de raha tha. Yahan Pro plan = only 3%. Ek saal mein ₹85,000 bacha liye.",
    name: "Suresh Pandey",
    cat: "Catering · Kanpur",
    metric: "₹85K saved/year",
  },
];

export function VendorTestimonialsSection() {
  return (
    <section className="py-16 md:py-28 px-4 sm:px-6 bg-card">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid md:grid-cols-5 gap-10 items-center">
          {/* Image column */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="md:col-span-2 hidden md:block">
            <div className="relative">
              <div className="absolute -inset-3 rounded-2xl opacity-20" style={{ background: "radial-gradient(circle at center, hsl(38 75% 50%), transparent 70%)" }} />
              <img src={confidentImg} alt="Successful vendor" loading="lazy" className="rounded-2xl shadow-2xl w-full relative z-10" />
              <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground px-5 py-2.5 rounded-xl font-display font-bold text-base shadow-lg z-20">
                500+ Happy Vendors
              </div>
            </div>
          </motion.div>

          {/* Testimonials column */}
          <div className="md:col-span-3">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-sm font-semibold tracking-[0.15em] uppercase mb-3 text-accent">Vendor Stories</p>
              <h2 className="font-display font-bold leading-tight text-foreground text-2xl md:text-4xl mb-8">
                Suniye Unki Zubaani <em className="italic text-accent">Jo Pehle Se Jeet Rahe Hain</em>
              </h2>
            </motion.div>

            <div className="space-y-4">
              {testimonials.map((t, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="rounded-xl p-6 bg-background border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-base tracking-wider mb-2 text-accent">{t.stars}</div>
                      <p className="text-sm italic leading-relaxed text-foreground/85">"{t.text}"</p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-primary to-accent" />
                        <div>
                          <div className="font-bold text-sm text-foreground">{t.name}</div>
                          <div className="text-sm text-muted-foreground">{t.cat}</div>
                        </div>
                      </div>
                    </div>
                    <span className="flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 whitespace-nowrap">
                      📈 {t.metric}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
