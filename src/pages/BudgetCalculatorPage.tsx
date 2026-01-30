import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { SEO } from "@/components/SEO";
import BudgetCalculator from "@/components/BudgetCalculator";

const BudgetCalculatorPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Wedding Budget Calculator - Instant Category-wise Breakdown"
        description="Calculate your wedding budget instantly. Get a detailed category-wise breakdown for venue, catering, photography, decoration, and more. Free tool, no signup required."
        keywords="wedding budget calculator, indian wedding budget, wedding cost breakdown, wedding planning budget, shaadi budget"
      />
      <BhindiHeader />
      <main className="flex-1 pt-16 md:pt-20">
        <BudgetCalculator />
      </main>
      <BhindiFooter />
    </div>
  );
};

export default BudgetCalculatorPage;
