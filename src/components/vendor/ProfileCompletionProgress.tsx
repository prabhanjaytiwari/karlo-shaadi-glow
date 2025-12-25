import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, AlertCircle, ChevronRight } from "lucide-react";

interface ProfileCompletionProgressProps {
  vendor: {
    business_name?: string;
    description?: string;
    phone_number?: string;
    address?: string;
    logo_url?: string;
    instagram_handle?: string;
    website_url?: string;
    years_experience?: number;
    team_size?: number;
  };
  servicesCount: number;
  portfolioCount: number;
  onNavigateToTab?: (tab: string) => void;
}

interface CompletionItem {
  label: string;
  completed: boolean;
  weight: number;
  targetTab: string;
}

export function ProfileCompletionProgress({ 
  vendor, 
  servicesCount, 
  portfolioCount,
  onNavigateToTab
}: ProfileCompletionProgressProps) {
  const completionItems: CompletionItem[] = useMemo(() => [
    { label: "Business Name", completed: !!vendor.business_name, weight: 15, targetTab: "profile" },
    { label: "Description", completed: !!vendor.description && vendor.description.length > 50, weight: 15, targetTab: "profile" },
    { label: "Phone Number", completed: !!vendor.phone_number, weight: 10, targetTab: "profile" },
    { label: "Address", completed: !!vendor.address, weight: 10, targetTab: "profile" },
    { label: "Logo/Photo", completed: !!vendor.logo_url, weight: 10, targetTab: "profile" },
    { label: "At least 1 Service", completed: servicesCount > 0, weight: 15, targetTab: "services" },
    { label: "At least 3 Portfolio Images", completed: portfolioCount >= 3, weight: 15, targetTab: "portfolio" },
    { label: "Instagram Handle", completed: !!vendor.instagram_handle, weight: 5, targetTab: "profile" },
    { label: "Website", completed: !!vendor.website_url, weight: 5, targetTab: "profile" },
  ], [vendor, servicesCount, portfolioCount]);

  const completionPercentage = useMemo(() => {
    const totalWeight = completionItems.reduce((sum, item) => sum + item.weight, 0);
    const completedWeight = completionItems
      .filter(item => item.completed)
      .reduce((sum, item) => sum + item.weight, 0);
    return Math.round((completedWeight / totalWeight) * 100);
  }, [completionItems]);

  const incompleteItems = completionItems.filter(item => !item.completed);

  const getProgressColor = () => {
    if (completionPercentage >= 80) return "bg-emerald-500";
    if (completionPercentage >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getStatusBadge = () => {
    if (completionPercentage >= 80) {
      return <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-300">Profile Strong</Badge>;
    }
    if (completionPercentage >= 50) {
      return <Badge className="bg-amber-500/20 text-amber-700 border-amber-300">Needs Work</Badge>;
    }
    return <Badge className="bg-rose-500/20 text-rose-700 border-rose-300">Incomplete</Badge>;
  };

  const handleItemClick = (tab: string) => {
    if (onNavigateToTab) {
      onNavigateToTab(tab);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-2 border-accent/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Profile Completion</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-bold text-lg">{completionPercentage}%</span>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {incompleteItems.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-2 text-amber-700">
              <AlertCircle className="h-4 w-4" />
              Complete these to boost visibility:
            </p>
            <div className="space-y-1">
              {incompleteItems.slice(0, 4).map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleItemClick(item.targetTab)}
                  className="w-full flex items-center justify-between gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 p-2 rounded-md transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Circle className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
              {incompleteItems.length > 4 && (
                <p className="text-xs text-muted-foreground pl-2 pt-1">
                  +{incompleteItems.length - 4} more items
                </p>
              )}
            </div>
          </div>
        )}

        {completionPercentage >= 80 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-sm text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Great job! Your profile is well optimized for visibility.
            </p>
          </div>
        )}

        {completionPercentage < 80 && completionPercentage >= 50 && (
          <p className="text-xs text-muted-foreground">
            Tip: Complete profiles get 3x more inquiries from couples!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
