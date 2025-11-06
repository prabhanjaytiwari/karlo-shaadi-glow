import { Clock, TrendingUp, Users, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TrustSignalsProps {
  lastBookedHours?: number;
  totalBookings?: number;
  responseTime?: string;
  availabilityCount?: number;
  className?: string;
}

export const TrustSignals = ({ 
  lastBookedHours, 
  totalBookings,
  responseTime = "2 hours",
  availabilityCount,
  className = ""
}: TrustSignalsProps) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {lastBookedHours && lastBookedHours < 48 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="secondary" className="flex items-center gap-1 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900 animate-pulse">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs">Last booked {lastBookedHours}h ago</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>This vendor is in high demand!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {availabilityCount && availabilityCount <= 5 && (
        <Badge variant="secondary" className="flex items-center gap-1 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900">
          <Zap className="h-3 w-3" />
          <span className="text-xs">Only {availabilityCount} dates left</span>
        </Badge>
      )}

      {totalBookings && totalBookings > 50 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="secondary" className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900">
                <Users className="h-3 w-3" />
                <span className="text-xs">{totalBookings}+ couples booked</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Trusted by {totalBookings}+ couples</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {responseTime && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="text-xs">Responds in ~{responseTime}</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Average response time based on recent inquiries</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
