import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface VendorFAQProps {
  vendorName: string;
  category: string;
  customFAQs?: FAQItem[];
}

const getDefaultFAQs = (vendorName: string, category: string): FAQItem[] => {
  const commonFAQs: FAQItem[] = [
    {
      question: `How do I book ${vendorName}?`,
      answer: `You can book ${vendorName} by clicking the "Check Availability" button, selecting your preferred date, and completing the booking form. A 30% advance payment secures your booking with milestone-based payments for the remainder.`,
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major payment methods including UPI, credit/debit cards, net banking, and wallet payments through our secure Razorpay gateway. All payments are protected with escrow until services are delivered.",
    },
    {
      question: "What is the cancellation policy?",
      answer: "Cancellation policies vary. Generally: 100% refund if cancelled 30+ days before the event, 50% refund for 15-29 days, 25% refund for 7-14 days, and no refund for less than 7 days. Check the vendor's specific policy in the Quick Info section.",
    },
    {
      question: "Is my payment secure?",
      answer: "Absolutely. All payments are processed through Razorpay with bank-grade encryption. Your payment is held in escrow and only released to the vendor after successful service delivery, protecting you throughout the process.",
    },
    {
      question: "How can I contact the vendor?",
      answer: "You can message the vendor directly through our in-app chat. Click the 'Chat with Vendor' button to start a conversation. Most vendors respond within 2 hours during business hours.",
    },
  ];

  const categoryFAQs: Record<string, FAQItem[]> = {
    photography: [
      {
        question: "What's included in the photography package?",
        answer: "Packages typically include pre-wedding shoots, ceremony coverage, reception coverage, edited digital photos, and photo albums. Specific inclusions vary by package - check the Pricing tab for details.",
      },
      {
        question: "How long until we receive our photos?",
        answer: "Most photographers deliver edited photos within 4-6 weeks after your event. Rush delivery may be available for an additional fee.",
      },
    ],
    catering: [
      {
        question: "Can you accommodate dietary restrictions?",
        answer: "Yes, most caterers can accommodate vegetarian, vegan, gluten-free, and other dietary requirements. Please mention your needs during booking so they can plan accordingly.",
      },
      {
        question: "Is there a minimum guest count?",
        answer: "Minimum guest counts vary by caterer and package. This is typically mentioned in the service details. Contact the vendor for custom requirements.",
      },
    ],
    venues: [
      {
        question: "What's the guest capacity?",
        answer: "Guest capacity varies by venue and setup type (banquet, theater, cocktail). Check the venue details or contact them directly for your specific event requirements.",
      },
      {
        question: "Are decorations included?",
        answer: "Basic venue decoration may be included. Premium décor packages are usually available separately. Check with the venue for their decoration policy and options.",
      },
    ],
    mehendi: [
      {
        question: "How long does bridal mehendi take?",
        answer: "Bridal mehendi typically takes 4-6 hours for full hands and feet. The artist will discuss timing based on your design preferences during consultation.",
      },
      {
        question: "Do you provide mehendi for guests too?",
        answer: "Most mehendi artists offer packages that include guest mehendi. Check the Pricing tab for details on guest packages.",
      },
    ],
    decoration: [
      {
        question: "Do you provide setup and breakdown?",
        answer: "Yes, decoration packages include professional setup before your event and complete breakdown afterwards. Timing will be coordinated with your venue.",
      },
      {
        question: "Can we customize the design?",
        answer: "Absolutely! Decorators work closely with you to create custom designs that match your vision, theme, and color preferences.",
      },
    ],
    music: [
      {
        question: "Do you take song requests?",
        answer: "Yes! Most DJs and bands accept song requests. You can share your must-play and do-not-play lists during the planning phase.",
      },
      {
        question: "What equipment is provided?",
        answer: "Professional sound systems, lighting, and backup equipment are typically included. Specific equipment varies by package.",
      },
    ],
  };

  return [...commonFAQs, ...(categoryFAQs[category] || [])];
};

export const VendorFAQ = ({ vendorName, category, customFAQs }: VendorFAQProps) => {
  const faqs = customFAQs || getDefaultFAQs(vendorName, category);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-accent" />
        <h3 className="font-semibold text-lg">Frequently Asked Questions</h3>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
            <AccordionTrigger className="text-left text-sm hover:text-primary hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
