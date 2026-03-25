import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "What is the transaction fee and when does it apply?", a: "The transaction fee applies when a booking is confirmed through the platform. Free plan: 10%, Starter: 7%, Pro: 3%, Elite: 0%. This means on Elite plan, you keep 100% of every booking — no commission at all." },
  { q: "How does the 30-day money-back guarantee work?", a: "If your profile is live and active for 30 days and you receive zero verified leads, contact us and we will process a full refund of your plan fee within 7 business days. No questions asked." },
  { q: "Which cities are currently supported?", a: "We currently serve Lucknow, Delhi, and Kanpur. We are expanding to Agra, Varanasi, and Allahabad in the next quarter. Early vendor registrations in new cities get founding partner benefits." },
  { q: "Can I upgrade my plan later?", a: "Yes! You can upgrade anytime. If you're an early vendor, your original price is locked in — so even if plan prices increase, you pay what you registered at originally." },
  { q: "What types of vendors can register?", a: "Any wedding-related business: photographers, videographers, decorators, caterers, makeup artists, mehendi artists, DJs, bands, venues, car rentals, invitation designers, jewellers, and more." },
  { q: "How quickly will I start receiving leads?", a: "Most vendors on Starter+ plans receive their first enquiry within 3–7 days of profile going live, especially in peak wedding season. Pro and Elite vendors with priority placement see the fastest results." },
  { q: "What are the premium subscription plans?", a: "We offer Starter (₹999/mo), Pro (₹2,999/mo), and Elite (₹6,999/mo) plans. Premium vendors get priority listing, featured placement, advanced analytics, and dedicated account support. All plans are month-to-month." },
  { q: "Does KarloShaadi charge commission on bookings?", a: "Unlike WedMeGood or ShaadiSaga that charge 15-20% commission, KarloShaadi's Elite plan has ZERO commission. Even our free plan charges only 10%, far less than competitors." },
];

export function VendorFAQSection() {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-[720px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3 text-accent">Got Questions?</p>
          <h2 className="font-display font-bold leading-tight text-foreground" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Frequently Asked <em className="italic text-accent">Questions</em>
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-0">
              <div className="bg-card rounded-xl overflow-hidden border border-border">
                <AccordionTrigger className="px-6 py-5 hover:no-underline text-left font-semibold text-[0.97rem] text-foreground">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
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
