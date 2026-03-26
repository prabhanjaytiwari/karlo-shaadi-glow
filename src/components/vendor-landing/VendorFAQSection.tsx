import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Kya registration sach mein free hai?", a: "Haan, 100% free hai. No credit card needed. Free plan pe aap listing, enquiries, reviews sab use kar sakte ho." },
  { q: "Commission kitna lagta hai?", a: "Free plan: 10%, Starter (₹999/mo): 7%, Pro (₹2,999/mo): 3%, Elite (₹6,999/mo): 0%. Elite pe aap 100% rakhte ho." },
  { q: "30-day money-back guarantee kaise kaam karta hai?", a: "Agar 30 din mein ek bhi verified lead nahi aaya, toh full refund. No questions asked. Zero risk." },
  { q: "Kaunse cities supported hain?", a: "Abhi Lucknow, Delhi, aur Kanpur. Agra, Varanasi, aur Allahabad next quarter mein launch ho rahe hain." },
  { q: "Kya plan upgrade kar sakte hain?", a: "Haan! Kabhi bhi upgrade karo. Early vendors ko original locked-in price hamesha ke liye milta hai." },
  { q: "Kitne din mein leads aayenge?", a: "Starter+ vendors ko 3-7 din mein pehli enquiry milti hai. Pro aur Elite ko sabse jaldi results milte hain." },
  { q: "WedMeGood se kaise alag hai?", a: "WedMeGood 15-20% commission leta hai har booking pe. Humara Elite plan = 0% commission. Plus CRM, contracts, analytics — sab free included." },
];

export function VendorFAQSection() {
  return (
    <section className="py-16 md:py-28 px-4 sm:px-6 bg-background">
      <div className="max-w-[720px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <p className="text-sm font-semibold tracking-[0.15em] uppercase mb-3 text-accent">Sawaal?</p>
          <h2 className="font-display font-bold leading-tight text-foreground text-2xl md:text-5xl">
            Aapke Sawaal, <em className="italic text-accent">Humare Jawaab</em>
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="mt-10 space-y-2.5">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-0">
              <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-accent/30 transition-colors">
                <AccordionTrigger className="px-6 py-5 hover:no-underline text-left font-bold text-base text-foreground">
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
