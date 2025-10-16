import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Vendor {
  id: string;
  business_name: string;
  category: string;
  average_rating: number;
  total_reviews: number;
  description: string;
}

interface VendorComparisonProps {
  vendors: Vendor[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: (vendorId: string) => void;
}

export function VendorComparison({ vendors, open, onOpenChange, onRemove }: VendorComparisonProps) {
  const navigate = useNavigate();

  const features = [
    { key: "category", label: "Category" },
    { key: "average_rating", label: "Rating" },
    { key: "total_reviews", label: "Reviews" },
    { key: "description", label: "Description" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Compare Vendors</DialogTitle>
          <DialogDescription>
            Compare up to 3 vendors side by side
          </DialogDescription>
        </DialogHeader>

        {vendors.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No vendors selected for comparison
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-4 w-40 font-semibold">Feature</th>
                  {vendors.map((vendor) => (
                    <th key={vendor.id} className="p-4 text-left">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{vendor.business_name}</p>
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto"
                            onClick={() => navigate(`/vendors/${vendor.id}`)}
                          >
                            View Profile
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onRemove(vendor.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr key={feature.key} className="border-t">
                    <td className="p-4 font-medium text-sm">{feature.label}</td>
                    {vendors.map((vendor) => (
                      <td key={vendor.id} className="p-4">
                        {feature.key === "category" && (
                          <Badge variant="outline" className="capitalize">
                            {vendor[feature.key as keyof Vendor]}
                          </Badge>
                        )}
                        {feature.key === "average_rating" && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">
                              {(vendor[feature.key as keyof Vendor] as number)?.toFixed(1) || "N/A"}
                            </span>
                          </div>
                        )}
                        {feature.key === "total_reviews" && (
                          <span>{vendor[feature.key as keyof Vendor] || 0} reviews</span>
                        )}
                        {feature.key === "description" && (
                          <p className="text-sm line-clamp-3">
                            {vendor[feature.key as keyof Vendor] || "No description"}
                          </p>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
