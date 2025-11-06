import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VendorComparison } from "@/components/vendor/VendorComparison";
import { Scale } from "lucide-react";

interface Vendor {
  id: string;
  business_name: string;
  category: string;
  average_rating: number;
  total_reviews: number;
  description: string | null;
}

interface VendorComparisonToggleProps {
  selectedVendors: Vendor[];
  onRemove: (vendorId: string) => void;
  onClear: () => void;
}

export const VendorComparisonToggle = ({ 
  selectedVendors, 
  onRemove,
  onClear 
}: VendorComparisonToggleProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (selectedVendors.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 animate-scale-in">
        <Button
          size="lg"
          onClick={() => setIsOpen(true)}
          className="rounded-full shadow-2xl hover:shadow-3xl transition-all group relative px-6"
        >
          <Scale className="h-5 w-5 mr-2" />
          <span className="font-semibold">Compare Vendors</span>
          <Badge className="ml-2 bg-accent text-accent-foreground">
            {selectedVendors.length}
          </Badge>
        </Button>
      </div>

      <VendorComparison
        vendors={selectedVendors}
        open={isOpen}
        onOpenChange={setIsOpen}
        onRemove={onRemove}
      />
    </>
  );
};
