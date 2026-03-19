import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  CreditCard, 
  DollarSign, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Loader2
} from "lucide-react";

export function PaymentTestingPanel() {
  const [testing, setTesting] = useState(false);
  const [testType, setTestType] = useState<"booking" | "subscription" | "vendor">("booking");
  const [amount, setAmount] = useState("1000");
  const [results, setResults] = useState<any[]>([]);

  const testPaymentCreation = async () => {
    setTesting(true);
    try {
      const testAmount = parseFloat(amount);
      
      const body: Record<string, unknown> = {
        amount: testAmount
      };

      if (testType === "subscription") {
        body.subscriptionPlan = "ai_premium";
      } else if (testType === "booking") {
        body.bookingId = "test-booking-id";
        body.milestone = "advance";
      }

      const { data, error } = await supabase.functions.invoke("create-payment", {
        body
      });

      if (error) throw error;

      setResults(prev => [...prev, {
        type: "success",
        message: `Payment order created: ${data.orderId}`,
        data,
        timestamp: new Date().toISOString()
      }]);

      toast.success("Payment order created successfully!");
    } catch (error: any) {
      setResults(prev => [...prev, {
        type: "error",
        message: error.message,
        timestamp: new Date().toISOString()
      }]);
      toast.error("Payment creation failed: " + error.message);
    } finally {
      setTesting(false);
    }
  };

  const testWebhookProcessing = async () => {
    setTesting(true);
    try {
      // Simulate webhook payload
      const mockWebhook = {
        event: "subscription.activated",
        payload: {
          subscription: {
            entity: {
              id: "sub_test_" + Date.now(),
              status: "active",
              plan_id: "plan_test"
            }
          }
        }
      };

      toast.info("Webhook testing requires manual verification in edge function logs");
      
      setResults(prev => [...prev, {
        type: "info",
        message: "Webhook test payload prepared. Check edge function logs.",
        data: mockWebhook,
        timestamp: new Date().toISOString()
      }]);
    } catch (error: any) {
      toast.error("Test failed: " + error.message);
    } finally {
      setTesting(false);
    }
  };

  const testAnalyticsTracking = async () => {
    setTesting(true);
    try {
      const { error } = await supabase.functions.invoke("track-event", {
        body: {
          event_type: "test_event",
          metadata: { test: true, timestamp: Date.now() }
        }
      });

      if (error) throw error;

      setResults(prev => [...prev, {
        type: "success",
        message: "Analytics event tracked successfully",
        timestamp: new Date().toISOString()
      }]);

      toast.success("Analytics tracking working!");
    } catch (error: any) {
      setResults(prev => [...prev, {
        type: "error",
        message: "Analytics failed: " + error.message,
        timestamp: new Date().toISOString()
      }]);
      toast.error("Analytics tracking failed");
    } finally {
      setTesting(false);
    }
  };

  const checkPaymentStatus = async (paymentId: string) => {
    setTesting(true);
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("transaction_id", paymentId)
        .single();

      if (error) throw error;

      setResults(prev => [...prev, {
        type: "info",
        message: `Payment status: ${data.status}`,
        data,
        timestamp: new Date().toISOString()
      }]);
    } catch (error: any) {
      toast.error("Failed to check payment status");
    } finally {
      setTesting(false);
    }
  };

  const clearResults = () => setResults([]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Testing Panel
        </CardTitle>
        <CardDescription>
          Test payment flows and integrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create Payment</TabsTrigger>
            <TabsTrigger value="webhook">Webhook</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Type</Label>
                <Select value={testType} onValueChange={(v: any) => setTestType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="booking">Booking Payment</SelectItem>
                    <SelectItem value="subscription">User Subscription</SelectItem>
                    <SelectItem value="vendor">Vendor Subscription</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000"
                />
              </div>

              <Button 
                onClick={testPaymentCreation} 
                disabled={testing}
                className="w-full"
              >
                {testing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Create Test Payment
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="webhook" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Test webhook processing by triggering test events from Razorpay dashboard or simulating events.
              </p>
              
              <Button 
                onClick={testWebhookProcessing} 
                disabled={testing}
                variant="outline"
                className="w-full"
              >
                {testing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Prepare Webhook Test
                  </>
                )}
              </Button>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Webhook URL:</p>
                <code className="text-xs break-all">
                  {import.meta.env.VITE_SUPABASE_URL}/functions/v1/vendor-subscription-webhook
                </code>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Test analytics event tracking functionality.
              </p>
              
              <Button 
                onClick={testAnalyticsTracking} 
                disabled={testing}
                variant="outline"
                className="w-full"
              >
                {testing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Track Test Event"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Results Display */}
        {results.length > 0 && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Test Results</h3>
              <Button size="sm" variant="ghost" onClick={clearResults}>
                Clear
              </Button>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {results.map((result, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border ${
                    result.type === "success"
                      ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                      : result.type === "error"
                      ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                      : "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {result.type === "success" && (
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    )}
                    {result.type === "error" && (
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    )}
                    {result.type === "info" && (
                      <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{result.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(result.timestamp).toLocaleString()}
                      </p>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer">View Details</summary>
                          <pre className="text-xs mt-1 p-2 bg-background rounded overflow-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
