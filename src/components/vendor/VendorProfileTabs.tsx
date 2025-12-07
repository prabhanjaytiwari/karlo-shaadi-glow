import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, DollarSign, MapPin, Star } from "lucide-react";

interface VendorProfileTabsProps {
  defaultTab?: string;
  children: {
    details: React.ReactNode;
    pricing: React.ReactNode;
    location: React.ReactNode;
    reviews: React.ReactNode;
  };
}

export const VendorProfileTabs = ({ defaultTab = "details", children }: VendorProfileTabsProps) => {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="w-full grid grid-cols-4 mb-6 bg-muted/50 p-1 rounded-xl">
        <TabsTrigger 
          value="details" 
          className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2.5"
        >
          <Info className="h-4 w-4" />
          <span className="hidden sm:inline">Details</span>
        </TabsTrigger>
        <TabsTrigger 
          value="pricing"
          className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2.5"
        >
          <DollarSign className="h-4 w-4" />
          <span className="hidden sm:inline">Pricing</span>
        </TabsTrigger>
        <TabsTrigger 
          value="location"
          className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2.5"
        >
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">Location</span>
        </TabsTrigger>
        <TabsTrigger 
          value="reviews"
          className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2.5"
        >
          <Star className="h-4 w-4" />
          <span className="hidden sm:inline">Reviews</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="mt-0 space-y-6">
        {children.details}
      </TabsContent>

      <TabsContent value="pricing" className="mt-0 space-y-6">
        {children.pricing}
      </TabsContent>

      <TabsContent value="location" className="mt-0 space-y-6">
        {children.location}
      </TabsContent>

      <TabsContent value="reviews" className="mt-0 space-y-6">
        {children.reviews}
      </TabsContent>
    </Tabs>
  );
};
