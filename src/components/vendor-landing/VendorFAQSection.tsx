import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "What is the transaction fee?", a: "Free: 10%, Starter: 7%, Pro: 3%, Elite: 0%. On Elite, you keep 100% of every booking." },
  { q: "How does the 30-day money-back guarantee work?", a: "If your profile is live for 30 days with zero verified leads, we refund your full plan fee. No questions asked." },
  { q: "Which cities are supported?", a: "Lucknow, Delhi, and Kanpur. Expanding to Agra, Varanasi, and Allahabad next quarter." },
  { q: "Can I upgrade my plan later?", a: "Yes! Upgrade anytime. Early vendors keep their original locked-in price forever." },
  { q: "What types of vendors can register?", a: "Photographers, videographers, decorators, caterers, makeup artists, mehendi artists, DJs, bands, venues, car rentals, and more." },
  { q: "How quickly will I get leads?", a: "Most Starter+ vendors get their first enquiry within 3–7 days. Pro and Elite see fastest results." },
  { q: "Does KarloShaadi charge commission?", a: "Unlike WedMeGood (15-20%), our Elite plan has ZERO commission. Even Free is only 10%." },
];

export function VendorFAQSection() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 bg-background">
      <div className="max-w-[640px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <p className="text-[0.7rem] font-semibold tracking-[0.15em] uppercase mb-2 text-accent">Got Questions?</p>
          <h2 className="font-display font-bold leading-tight text-foreground text-xl md:text-4xl">
            Frequently Asked <em className="italic text-accent">Questions</em>
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="mt-8 space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-0">
              <div className="bg-card rounded-lg overflow-hidden border border-border">
                <AccordionTrigger className="px-4 py-3.5 hover:no-underline text-left font-semibold text-sm text-foreground">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3.5 text-xs leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
