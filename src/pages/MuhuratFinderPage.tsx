import { SEO } from "@/components/SEO";
import MuhuratFinder from "@/components/MuhuratFinder";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";

const MuhuratFinderPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MobilePageHeader title="Muhurat Finder" />
      <SEO
        title="Shubh Muhurat Finder 2025 - Auspicious Wedding Dates"
        description="Find the most auspicious wedding dates in 2025. Complete Hindu Panchang calendar with Nakshatra, Tithi, and muhurat timings. Share dates on WhatsApp, add to calendar."
        keywords="shubh muhurat 2025, wedding muhurat dates, auspicious wedding dates, vivah muhurat, hindu wedding dates, panchang 2025"
      />
      
      <main className="flex-1 pt-16 md:pt-20">
        <MuhuratFinder />
      </main>
      
    </div>
  );
};

export default MuhuratFinderPage;
