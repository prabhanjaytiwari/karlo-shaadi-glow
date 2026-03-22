import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

type VendorPlan = "free" | "starter" | "pro" | "elite";

interface ToolGateProps {
  children: ReactNode;
  currentPlan: VendorPlan;
  requiredPlan: VendorPlan;
  toolName: string;
  featureDescription?: string;
}

const PLAN_HIERARCHY: Record<VendorPlan, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  elite: 3,
};

const PLAN_LABELS: Record<VendorPlan, string> = {
  free: "Free",
  starter: "Starter (₹999/mo)",
  pro: "Pro (₹2,999/mo)",
  elite: "Elite (₹6,999/mo)",
};

export function ToolGate({ children, currentPlan, requiredPlan, toolName, featureDescription }: ToolGateProps) {
  const navigate = useNavigate();

  if (PLAN_HIERARCHY[currentPlan] >= PLAN_HIERARCHY[requiredPlan]) {
    return <>{children}</>;
  }

  return (
    <Card className="border-2 border-dashed border-accent/30 bg-accent/5">
      <CardContent className="py-12 flex flex-col items-center text-center gap-4">
        <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
          <Lock className="h-8 w-8 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-bold mb-1">{toolName}</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {featureDescription || `This tool is available on the ${PLAN_LABELS[requiredPlan]} plan and above.`}
          </p>
        </div>
        <Button onClick={() => navigate("/vendor-pricing")} className="gap-2">
          <Crown className="h-4 w-4" />
          Upgrade to {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}
        </Button>
      </CardContent>
    </Card>
  );
}
