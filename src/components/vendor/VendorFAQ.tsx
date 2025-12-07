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
    makeup: [
      {
        question: "Do you offer trials before the wedding?",
        answer: "Yes, most bridal makeup artists offer trial sessions 2-4 weeks before your wedding. This helps finalize your look and ensures you're comfortable with the style.",
      },
      {
        question: "Do you travel to the venue?",
        answer: "Yes, most makeup artists provide on-location services. They'll arrive at your getting-ready location with all necessary equipment.",
      },
    ],
    invitations: [
      {
        question: "How far in advance should I order?",
        answer: "We recommend ordering invitations 3-4 months before your wedding to allow time for design, printing, and mailing. Rush orders may be available for additional fees.",
      },
      {
        question: "Can I see samples before ordering?",
        answer: "Yes, most invitation designers offer sample kits or digital proofs. Contact the vendor to request samples of paper quality and printing styles.",
      },
    ],
    choreography: [
      {
        question: "How many rehearsal sessions are included?",
        answer: "Choreography packages typically include 8-12 rehearsal sessions. The number varies based on the complexity of performances and number of songs.",
      },
      {
        question: "Can you choreograph for the whole family?",
        answer: "Absolutely! Choreographers specialize in group performances for sangeet, including couple dances, family performances, and flash mobs.",
      },
    ],
    transport: [
      {
        question: "Are the vehicles decorated?",
        answer: "Basic floral decoration is typically included. Premium decoration packages with specific themes are available upon request.",
      },
      {
        question: "Is a backup vehicle provided?",
        answer: "Reputable transport services maintain backup vehicles to ensure no disruption on your special day. Confirm this when booking.",
      },
    ],
    jewelry: [
      {
        question: "Do you offer rental services?",
        answer: "Many jewelry vendors offer rental options for bridal sets, perfect for those who prefer variety without the full purchase price.",
      },
      {
        question: "Can jewelry be customized?",
        answer: "Yes, custom jewelry can be created to match your outfit or preferences. Allow 6-8 weeks for custom orders.",
      },
    ],
    pandit: [
      {
        question: "Which wedding rituals do you perform?",
        answer: "Experienced pandits perform all traditional ceremonies including engagement, haldi, mehendi, wedding ceremony, and reception blessings based on your customs and traditions.",
      },
      {
        question: "Do you travel to other cities?",
        answer: "Many pandits are available for outstation weddings. Travel and accommodation arrangements can be discussed during booking.",
      },
    ],
    entertainment: [
      {
        question: "What entertainment options are available?",
        answer: "Options include dhol players, live bands, fireworks, LED shows, celebrity performers, magicians, and more. Contact for specific entertainment packages.",
      },
      {
        question: "Are permissions for fireworks included?",
        answer: "Professional entertainment vendors handle all necessary permits and safety requirements for pyrotechnics and special effects.",
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
