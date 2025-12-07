import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  if (selectedVendors.length === 0) return null;

  const handleCompare = () => {
    const vendorIds = selectedVendors.map(v => v.id).join(",");
    navigate(`/compare?vendors=${vendorIds}`);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-fade-up">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-accent/20 p-3 flex items-center gap-3">
        {/* Selected Vendors Preview */}
        <div className="flex items-center gap-2">
          {selectedVendors.slice(0, 3).map((vendor) => (
            <div 
              key={vendor.id}
              className="relative group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center text-sm font-bold text-accent">
                {vendor.business_name.charAt(0)}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(vendor.id);
                }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {selectedVendors.length > 3 && (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
              +{selectedVendors.length - 3}
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-border" />

        {/* Compare Button */}
        <Button
          onClick={handleCompare}
          className="gap-2"
        >
          <Scale className="h-4 w-4" />
          Compare
          <Badge className="bg-accent text-accent-foreground ml-1">
            {selectedVendors.length}
          </Badge>
        </Button>

        {/* Clear Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground hover:text-destructive"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
