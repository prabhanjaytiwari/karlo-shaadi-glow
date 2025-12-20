import { BhindiFooter } from "@/components/BhindiFooter";
import { SEO } from "@/components/SEO";
import MuhuratFinder from "@/components/MuhuratFinder";

const MuhuratFinderPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Shubh Muhurat Finder 2025 - Auspicious Wedding Dates"
        description="Find the most auspicious wedding dates in 2025. Complete Hindu Panchang calendar with Nakshatra, Tithi, and muhurat timings. Share dates on WhatsApp, add to calendar."
        keywords="shubh muhurat 2025, wedding muhurat dates, auspicious wedding dates, vivah muhurat, hindu wedding dates, panchang 2025"
      />
      <div className="pt-16">
        <MuhuratFinder />
      </div>
      <BhindiFooter />
    </div>
  );
};

export default MuhuratFinderPage;
