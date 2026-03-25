import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "What is the transaction fee and when does it apply?", a: "The transaction fee applies when a booking is confirmed through the platform. Free plan: 15%, Silver: 12%, Gold: 8%, Diamond: 0%. This means on Diamond plan, you keep 100% of every booking — no commission at all." },
  { q: "How does the 30-day money-back guarantee work?", a: "If your profile is live and active for 30 days and you receive zero verified leads, contact us and we will process a full refund of your plan fee within 7 business days. No questions asked." },
  { q: "Which cities are currently supported?", a: "We currently serve Lucknow, Delhi, and Kanpur. We are expanding to Agra, Varanasi, and Allahabad in the next quarter. Early vendor registrations in new cities get founding partner benefits." },
  { q: "Can I upgrade my plan later?", a: "Yes! You can upgrade anytime. If you're an early vendor, your original price is locked in — so even if plan prices increase, you pay what you registered at originally." },
  { q: "What types of vendors can register?", a: "Any wedding-related business: photographers, videographers, decorators, caterers, makeup artists, mehendi artists, DJs, bands, venues, car rentals, invitation designers, jewellers, and more. If couples need it for their wedding, you belong on KarloShaadi." },
  { q: "How quickly will I start receiving leads?", a: "Most vendors on Silver+ plans receive their first enquiry within 3–7 days of profile going live, especially in peak wedding season. Gold and Diamond vendors with priority placement see the fastest results." },
];

export function VendorFAQSection() {
  return (
    <section className="py-20 px-6" style={{ background: "#FAF6EE" }}>
      <div className="max-w-[720px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#C9962A" }}>Got Questions?</p>
          <h2 className="font-display font-bold leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#4A0E0E" }}>
            Frequently Asked<br /><em className="italic" style={{ color: "#C9962A" }}>Questions</em>
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-0">
              <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid rgba(201,150,42,0.15)" }}>
                <AccordionTrigger className="px-6 py-5 hover:no-underline text-left font-semibold text-[0.97rem]" style={{ color: "#4A0E0E" }}>
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "#8B7B6B" }}>
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
