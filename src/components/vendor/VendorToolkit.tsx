import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Instagram, Receipt, CalendarHeart, Users } from "lucide-react";
import { QuoteGenerator } from "./QuoteGenerator";
import { CaptionGenerator } from "./CaptionGenerator";
import { InvoiceGenerator } from "./InvoiceGenerator";
import { SeasonalInsights } from "./SeasonalInsights";
import { FollowUpTracker } from "./FollowUpTracker";

interface VendorToolkitProps {
  vendorId: string;
  vendorName: string;
}

export function VendorToolkit({ vendorId, vendorName }: VendorToolkitProps) {
  const [activeTool, setActiveTool] = useState("quotes");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Productivity Tools</h3>
        <p className="text-sm text-muted-foreground">
          AI-powered tools to grow your wedding business
        </p>
      </div>

      <Tabs value={activeTool} onValueChange={setActiveTool}>
        <TabsList className="w-full flex overflow-x-auto scrollbar-hide justify-start gap-1 p-1">
          <TabsTrigger value="quotes" className="shrink-0 text-xs">
            <FileText className="h-4 w-4 mr-1" />
            AI Quotes
          </TabsTrigger>
          <TabsTrigger value="followup" className="shrink-0 text-xs">
            <Users className="h-4 w-4 mr-1" />
            Follow-Ups
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

        <TabsContent value="quotes">
          <QuoteGenerator vendorName={vendorName} />
        </TabsContent>
        <TabsContent value="followup">
          <FollowUpTracker vendorId={vendorId} />
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
