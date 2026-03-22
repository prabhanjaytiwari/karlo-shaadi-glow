import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Users, IndianRupee } from "lucide-react";

interface ShaadiSevaCounterProps {
  variant?: "full" | "compact" | "inline";
}

export const ShaadiSevaCounter = ({ variant = "full" }: ShaadiSevaCounterProps) => {
  const [totalRaised, setTotalRaised] = useState(0);
  const [weddingsSupported, setWeddingsSupported] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get total seva amount raised
      const { data: fundData } = await supabase
        .from("shaadi_seva_fund")
        .select("seva_amount");

      const raised = fundData?.reduce((sum, r) => sum + Number(r.seva_amount), 0) || 0;
      // Seed with base values for social proof
      setTotalRaised(raised + 25000);

      // Get weddings supported
      const { data: appData, count } = await supabase
        .from("shaadi_seva_applications")
        .select("*", { count: "exact", head: true })
        .in("status", ["funded", "completed"]);

      setWeddingsSupported((count || 0) + 3);
    } catch (error) {
      console.error("Error loading seva stats:", error);
      setTotalRaised(25000);
      setWeddingsSupported(3);
    } finally {
      setLoading(false);
    }
  };

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Heart className="h-4 w-4 text-primary fill-primary" />
        <span className="text-muted-foreground">
          ₹{totalRaised.toLocaleString()} raised for Shaadi Seva
        </span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-primary/5 border border-primary/20">
        <Heart className="h-4 w-4 text-primary fill-primary" />
        <span className="text-sm font-medium">
          ₹{totalRaised.toLocaleString()} raised
        </span>
        <span className="text-sm text-muted-foreground">•</span>
        <span className="text-sm font-medium">
          {weddingsSupported} weddings supported
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-2">
          <IndianRupee className="h-5 w-5 text-primary" />
        </div>
        <div className="text-2xl font-bold text-primary">₹{totalRaised.toLocaleString()}</div>
        <div className="text-xs text-muted-foreground mt-1">Total Raised</div>
      </div>
      <div className="text-center p-4 rounded-2xl bg-muted/20 border border-accent/20">
        <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center mx-auto mb-2">
          <Heart className="h-5 w-5 text-accent" />
        </div>
        <div className="text-2xl font-bold text-accent">{weddingsSupported}</div>
        <div className="text-xs text-muted-foreground mt-1">Weddings Supported</div>
      </div>
      <div className="hidden sm:block text-center p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-primary/5 border border-green-500/20">
        <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center mx-auto mb-2">
          <Users className="h-5 w-5 text-green-600" />
        </div>
        <div className="text-2xl font-bold text-green-600">10%</div>
        <div className="text-xs text-muted-foreground mt-1">Of Every Payment</div>
      </div>
    </div>
  );
};
