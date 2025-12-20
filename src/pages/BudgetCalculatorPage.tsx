import { BhindiFooter } from "@/components/BhindiFooter";
import { SEO } from "@/components/SEO";
import BudgetCalculator from "@/components/BudgetCalculator";

const BudgetCalculatorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Wedding Budget Calculator - Instant Category-wise Breakdown"
        description="Calculate your wedding budget instantly. Get a detailed category-wise breakdown for venue, catering, photography, decoration, and more. Free tool, no signup required."
        keywords="wedding budget calculator, indian wedding budget, wedding cost breakdown, wedding planning budget, shaadi budget"
      />
      <div className="pt-16">
        <BudgetCalculator />
      </div>
      <BhindiFooter />
    </div>
  );
};

export default BudgetCalculatorPage;
