import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Instagram, Receipt, CalendarHeart, Users, IndianRupee, Kanban, FileSignature } from "lucide-react";
import { QuoteGenerator } from "./QuoteGenerator";
import { CaptionGenerator } from "./CaptionGenerator";
import { InvoiceGenerator } from "./InvoiceGenerator";
import { SeasonalInsights } from "./SeasonalInsights";
import { FollowUpTracker } from "./FollowUpTracker";
import { PaymentScheduleManager } from "./PaymentScheduleManager";
import { VendorCRM } from "./VendorCRM";
import { ContractGenerator } from "./ContractGenerator";

interface VendorToolkitProps {
  vendorId: string;
  vendorName: string;
  vendorCategory?: string;
}

export function VendorToolkit({ vendorId, vendorName, vendorCategory }: VendorToolkitProps) {
  const [activeTool, setActiveTool] = useState("crm");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Business Tools</h3>
        <p className="text-sm text-muted-foreground">
          Everything you need to manage and grow your wedding business
        </p>
      </div>

      <Tabs value={activeTool} onValueChange={setActiveTool}>
        <TabsList className="w-full flex overflow-x-auto scrollbar-hide justify-start gap-1 p-1">
          <TabsTrigger value="crm" className="shrink-0 text-xs">
            <Kanban className="h-4 w-4 mr-1" />
            CRM
          </TabsTrigger>
          <TabsTrigger value="payments" className="shrink-0 text-xs">
            <IndianRupee className="h-4 w-4 mr-1" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="contracts" className="shrink-0 text-xs">
            <FileSignature className="h-4 w-4 mr-1" />
            Contracts
          </TabsTrigger>
          <TabsTrigger value="followup" className="shrink-0 text-xs">
            <Users className="h-4 w-4 mr-1" />
            Follow-Ups
          </TabsTrigger>
          <TabsTrigger value="quotes" className="shrink-0 text-xs">
            <FileText className="h-4 w-4 mr-1" />
            AI Quotes
          </TabsTrigger>
          <TabsTrigger value="captions" className="shrink-0 text-xs">
            <Instagram className="h-4 w-4 mr-1" />
            Captions
          </TabsTrigger>
          <TabsTrigger value="invoice" className="shrink-0 text-xs">
            <Receipt className="h-4 w-4 mr-1" />
            Invoice
          </TabsTrigger>
          <TabsTrigger value="insights" className="shrink-0 text-xs">
            <CalendarHeart className="h-4 w-4 mr-1" />
            Demand
          </TabsTrigger>
        </TabsList>

        <TabsContent value="crm">
          <VendorCRM vendorId={vendorId} vendorName={vendorName} />
        </TabsContent>
        <TabsContent value="payments">
          <PaymentScheduleManager vendorId={vendorId} vendorName={vendorName} />
        </TabsContent>
        <TabsContent value="contracts">
          <ContractGenerator vendorId={vendorId} vendorName={vendorName} vendorCategory={vendorCategory} />
        </TabsContent>
        <TabsContent value="followup">
          <FollowUpTracker vendorId={vendorId} />
        </TabsContent>
        <TabsContent value="quotes">
          <QuoteGenerator vendorName={vendorName} />
        </TabsContent>
        <TabsContent value="captions">
          <CaptionGenerator />
        </TabsContent>
        <TabsContent value="invoice">
          <InvoiceGenerator vendorName={vendorName} />
        </TabsContent>
        <TabsContent value="insights">
          <SeasonalInsights />
        </TabsContent>
      </Tabs>
    </div>
  );
}
