import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CreditCard, Wallet, AlertCircle } from "lucide-react";

/**
 * Razorpay Test Payment Helper Component
 * 
 * Use this component in development to test payment flows
 * without real transactions.
 * 
 * Test Card Details:
 * - Card Number: 4111 1111 1111 1111
 * - CVV: Any 3 digits
 * - Expiry: Any future date
 * - OTP: 0007 (for testing)
 */
export function PaymentTestHelper() {
  // Only show in development mode
  const isDevelopment = import.meta.env.DEV;
  const [mode, setMode] = useState<"card" | "upi" | "netbanking">("card");

  // Don't render in production
  if (!isDevelopment) {
    return null;
  }
  
  const testCards = {
    success: {
      number: "4111 1111 1111 1111",
      description: "Always succeeds"
    },
    failure: {
      number: "4000 0000 0000 0002",
      description: "Always fails with card declined"
    },
    authentication: {
      number: "4000 0027 6000 3184",
      description: "Requires 3DS authentication"
    }
  };

  const testUPI = {
    success: "success@razorpay",
    failure: "failure@razorpay"
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <CardTitle>Payment Testing Helper</CardTitle>
        </div>
        <CardDescription>
          Test payment flows without real transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Select value={mode} onValueChange={(v: any) => setMode(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Credit/Debit Card</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="netbanking">Net Banking</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Test Card Details */}
        {mode === "card" && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-medium">Test Mode Active</p>
                  <p className="text-muted-foreground">Use these test card numbers:</p>
                </div>
              </div>
            </div>

            {Object.entries(testCards).map(([key, card]) => (
              <div key={key} className="p-3 bg-card border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={key === 'success' ? 'success' : key === 'failure' ? 'destructive' : 'default'}>
                    {key.toUpperCase()}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(card.number);
                      toast.success("Card number copied!");
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-sm font-medium">{card.number}</p>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </div>
              </div>
            ))}

            <div className="p-3 bg-card border rounded-lg space-y-2">
              <p className="text-sm font-medium">Additional Details:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• CVV: Any 3 digits</li>
                <li>• Expiry: Any future date</li>
                <li>• OTP: 0007 (for 3DS authentication)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Test UPI Details */}
        {mode === "upi" && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-start gap-2">
                <Wallet className="h-4 w-4 text-primary mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-medium">Test UPI IDs</p>
                  <p className="text-muted-foreground">Use these for testing:</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-card border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="success">SUCCESS</Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(testUPI.success);
                    toast.success("UPI ID copied!");
                  }}
                >
                  Copy
                </Button>
              </div>
              <p className="font-mono text-sm">{testUPI.success}</p>
            </div>

            <div className="p-3 bg-card border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="destructive">FAILURE</Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(testUPI.failure);
                    toast.success("UPI ID copied!");
                  }}
                >
                  Copy
                </Button>
              </div>
              <p className="font-mono text-sm">{testUPI.failure}</p>
            </div>
          </div>
        )}

        {/* Net Banking */}
        {mode === "netbanking" && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              Select any test bank and use credentials:
            </p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Username: test</li>
              <li>• Password: test</li>
            </ul>
          </div>
        )}

        {/* Documentation Link */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            For complete testing documentation, visit{" "}
            <a
              href="https://razorpay.com/docs/payments/payments/test-card-details/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Razorpay Test Docs
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
