import { SEO } from "@/components/SEO";
import BudgetCalculator from "@/components/BudgetCalculator";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const BudgetCalculatorPage = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Wedding Budget Calculator - Instant Category-wise Breakdown"
        description="Calculate your wedding budget instantly. Get a detailed category-wise breakdown for venue, catering, photography, decoration, and more. Free tool, no signup required."
        keywords="wedding budget calculator, indian wedding budget, wedding cost breakdown, wedding planning budget, shaadi budget"
      />
      <MobilePageHeader title="Budget Calculator" />
      <main className={isMobile ? "flex-1 pb-24" : "flex-1 pt-16 md:pt-20"}>
        <BudgetCalculator />
      </main>
    </div>
  );
};

export default BudgetCalculatorPage;
