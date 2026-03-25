import { SEO } from "@/components/SEO";
import { VendorHero } from "@/components/vendor-landing/VendorHero";
import { ProblemsSection } from "@/components/vendor-landing/ProblemsSection";
import { EarlyBirdSection } from "@/components/vendor-landing/EarlyBirdSection";
import { StepsSection } from "@/components/vendor-landing/StepsSection";
import { ToolsSection } from "@/components/vendor-landing/ToolsSection";
import { SocialProofSection } from "@/components/vendor-landing/SocialProofSection";
import { VendorPricingSection } from "@/components/vendor-landing/VendorPricingSection";
import { VendorTestimonialsSection } from "@/components/vendor-landing/VendorTestimonialsSection";
import { VendorFAQSection } from "@/components/vendor-landing/VendorFAQSection";
import { FinalCTASection } from "@/components/vendor-landing/FinalCTASection";
import { CompetitorComparison } from "@/components/vendor/CompetitorComparison";

export default function ForVendors() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Partner With KarloShaadi — Get Unlimited Wedding Leads"
        description="Join India's fastest growing wedding marketplace. Zero commission, verified leads, complete business toolkit. Register free today."
      />

      <VendorHero />
      <ProblemsSection />
      <EarlyBirdSection />
      <StepsSection />
      <ToolsSection />
      <CompetitorComparison />
      <SocialProofSection />
      <VendorPricingSection />
      <VendorTestimonialsSection />
      <VendorFAQSection />
      <FinalCTASection />
    </div>
  );
}
