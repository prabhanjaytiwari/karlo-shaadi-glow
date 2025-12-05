import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Heart, Shield, Calendar, CreditCard, Users, Star } from "lucide-react";

const faqCategories = [
  {
    icon: Users,
    title: "For Couples",
    faqs: [
      {
        question: "How does Karlo Shaadi work?",
        answer: "Karlo Shaadi connects you with verified wedding vendors across India. Browse vendors by category, compare prices, read reviews, and book directly through our platform. We handle all coordination and ensure smooth communication."
      },
      {
        question: "Is Karlo Shaadi free to use?",
        answer: "Yes! Creating an account and browsing vendors is completely free. We only facilitate bookings between you and vendors - there are no hidden charges or commission fees added to your booking."
      },
      {
        question: "How do I book a vendor?",
        answer: "Simply browse vendors, select your preferred service, choose a date, and click 'Book Now'. You'll need to pay an advance amount (typically 30%) to confirm the booking. The remaining amount can be paid in milestones."
      },
      {
        question: "What if I need to cancel my booking?",
        answer: "You can cancel bookings from your dashboard. Cancellation policies vary by vendor and are shown before booking. Advance payments may be partially or fully refundable based on the vendor's policy and cancellation timing."
      },
      {
        question: "How do I know vendors are reliable?",
        answer: "All vendors on Karlo Shaadi are verified. We check their credentials, past work, and reviews. You can see verified badges, ratings, portfolio, and real reviews from couples before booking."
      }
    ]
  },
  {
    icon: Shield,
    title: "Safety & Security",
    faqs: [
      {
        question: "Are my payments secure?",
        answer: "Absolutely! We use industry-standard payment gateways with end-to-end encryption. Your payment information is never stored on our servers. All transactions are PCI-DSS compliant."
      },
      {
        question: "What if a vendor doesn't deliver as promised?",
        answer: "We take this seriously. Contact our support team immediately if there's an issue. We'll mediate between you and the vendor. For verified bookings, we offer dispute resolution support."
      },
      {
        question: "How is my personal information protected?",
        answer: "We follow strict data protection policies. Your information is encrypted and never shared with third parties without consent. Only vendors you contact can see your booking details."
      }
    ]
  },
  {
    icon: CreditCard,
    title: "Payments",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major payment methods including credit/debit cards, UPI, net banking, and digital wallets through our secure payment gateway."
      },
      {
        question: "When do I pay the vendor?",
        answer: "Typically, you pay 30% advance at booking, 40% before the wedding (pre-wedding milestone), and 30% after service completion (post-wedding milestone). Payment schedules may vary by vendor."
      },
      {
        question: "Can I get a refund if I cancel?",
        answer: "Refund policies depend on the vendor and cancellation timing. Most vendors offer partial refunds if cancelled well in advance. Full refund details are shown before you confirm your booking."
      },
      {
        question: "Do vendors charge extra through Karlo Shaadi?",
        answer: "No! Vendors set their own prices. We don't add any commission or hidden charges. The price you see is the price you pay to the vendor."
      }
    ]
  },
  {
    icon: Calendar,
    title: "Bookings & Events",
    faqs: [
      {
        question: "How far in advance should I book vendors?",
        answer: "We recommend booking 6-12 months in advance, especially for popular wedding seasons (October-March). Some premium vendors get booked even earlier. Book as soon as your date is confirmed!"
      },
      {
        question: "Can I book multiple vendors at once?",
        answer: "Yes! You can book different vendors for different services (photographer, caterer, decorator, etc.) all from your dashboard. We help you coordinate everything."
      },
      {
        question: "What if my wedding date changes?",
        answer: "Contact the vendor through our messaging system as soon as possible. Many vendors accommodate date changes if their calendar allows. Early communication is key."
      },
      {
        question: "Can I get vendors in multiple cities?",
        answer: "Yes! We have verified vendors across major cities in India. Some premium vendors also travel to your location (additional charges may apply)."
      }
    ]
  },
  {
    icon: Star,
    title: "Reviews & Quality",
    faqs: [
      {
        question: "Are reviews authentic?",
        answer: "Yes! Only couples who have completed a verified booking can leave reviews. We don't allow fake reviews and have systems to detect and remove suspicious content."
      },
      {
        question: "Can vendors remove negative reviews?",
        answer: "No. Vendors cannot delete reviews. They can only respond to them. This ensures transparency and helps you make informed decisions."
      },
      {
        question: "What does 'Verified Vendor' mean?",
        answer: "Verified vendors have completed our vetting process: identity verification, business credentials check, portfolio review, and reference validation."
      }
    ]
  },
  {
    icon: Heart,
    title: "For Vendors",
    faqs: [
      {
        question: "How do I join as a vendor?",
        answer: "Click 'For Vendors' in the menu and complete our onboarding form. Submit your business details, portfolio, and credentials. Our team will verify and approve your profile within 24-48 hours."
      },
      {
        question: "Do you charge commission on bookings?",
        answer: "No! We don't charge any commission on bookings. You set your prices, and you receive 100% of the booking amount directly."
      },
      {
        question: "How do I get more bookings?",
        answer: "Complete your profile with high-quality photos, respond quickly to inquiries, maintain good ratings, and keep your availability calendar updated. Featured vendors get more visibility."
      },
      {
        question: "Can I manage multiple services?",
        answer: "Yes! You can offer multiple wedding services under your vendor profile. For example, if you provide both photography and videography, you can list both services."
      }
    ]
  }
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <BhindiHeader />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl mb-6">
            Frequently Asked <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Questions</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers! Find everything you need to know about booking vendors for your dream wedding.
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl space-y-16">
          {faqCategories.map((category, idx) => (
            <div key={idx} className="space-y-6">
              {/* Category Header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-bold text-2xl sm:text-3xl">{category.title}</h2>
              </div>

              {/* FAQs Accordion */}
              <Accordion type="single" collapsible className="w-full space-y-3">
                {category.faqs.map((faq, faqIdx) => (
                  <AccordionItem 
                    key={faqIdx} 
                    value={`${idx}-${faqIdx}`}
                    className="border-2 border-border/50 rounded-2xl px-6 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors"
                  >
                    <AccordionTrigger className="text-left text-base sm:text-lg font-semibold hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            Still Have Questions?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/support" className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors">
              Contact Support
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <BhindiFooter />
    </div>
  );
}