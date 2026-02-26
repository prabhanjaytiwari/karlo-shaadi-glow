import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, Clock, AlertTriangle, AlertCircle, Loader2 } from "lucide-react";

interface FollowUpTrackerProps {
  vendorId: string;
}

export function FollowUpTracker({ vendorId }: FollowUpTrackerProps) {
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInquiries();
  }, [vendorId]);

  const loadInquiries = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("vendor_inquiries")
      .select("*")
      .eq("vendor_id", vendorId)
      .in("status", ["pending", "new"])
      .order("created_at", { ascending: true });
    setInquiries(data || []);
    setLoading(false);
  };

  const markFollowedUp = async (id: string) => {
    const { error } = await supabase
      .from("vendor_inquiries")
      .update({ status: "contacted", updated_at: new Date().toISOString() })
      .eq("id", id);
    if (!error) {
      toast({ title: "Marked as followed up!" });
      loadInquiries();
    }
  };

  const getUrgency = (createdAt: string) => {
    const hours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    if (hours > 168) return { label: "7d+ old", color: "bg-destructive text-destructive-foreground", icon: AlertCircle };
    if (hours > 48) return { label: "48h+ old", color: "bg-orange-500 text-white", icon: AlertTriangle };
    if (hours > 24) return { label: "24h+ old", color: "bg-yellow-500 text-black", icon: Clock };
    return { label: "New", color: "bg-green-500 text-white", icon: Clock };
  };

  if (loading) {
    return (
      <Card className="border-2 border-accent/20">
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-accent/20">
      <CardHeader>
        <CardTitle className="text-lg">Client Follow-Up Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        {inquiries.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            🎉 All caught up! No pending follow-ups.
          </p>
        ) : (
          <div className="space-y-3">
            {inquiries.map((inq) => {
              const urgency = getUrgency(inq.created_at);
              const UrgencyIcon = urgency.icon;
              return (
                <div key={inq.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{inq.name}</span>
                      <Badge className={`text-xs ${urgency.color}`}>
                        <UrgencyIcon className="h-3 w-3 mr-1" />
                        {urgency.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {inq.message || "No message"} • {inq.phone}
                    </p>
                    {inq.wedding_date && (
                      <p className="text-xs text-muted-foreground">
                        Wedding: {new Date(inq.wedding_date).toLocaleDateString("en-IN")}
                      </p>
                    )}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => markFollowedUp(inq.id)} className="ml-2 shrink-0">
                    <Check className="h-4 w-4 mr-1" /> Done
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
