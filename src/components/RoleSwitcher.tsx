import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, Store, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

type ViewMode = "couple" | "vendor";

interface RoleSwitcherProps {
  isVendor: boolean;
  className?: string;
}

export function RoleSwitcher({ isVendor, className }: RoleSwitcherProps) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ViewMode>(() => {
    if (!isVendor) return "couple";
    return (localStorage.getItem("ks-active-view") as ViewMode) || "vendor";
  });

  useEffect(() => {
    if (isVendor) {
      localStorage.setItem("ks-active-view", activeView);
    }
  }, [activeView, isVendor]);

  if (!isVendor) return null;

  const handleSwitch = (mode: ViewMode) => {
    setActiveView(mode);
    if (mode === "vendor") {
      navigate("/vendor/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2 rounded-full border-accent/30 hover:border-accent/50 hover:bg-accent/5 text-sm font-medium",
            className
          )}
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          {activeView === "vendor" ? "Vendor Mode" : "Couple Mode"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => handleSwitch("couple")}
          className={cn(
            "gap-2 cursor-pointer",
            activeView === "couple" && "bg-accent/10 font-semibold"
          )}
        >
          <Heart className="h-4 w-4 text-primary" />
          Couple View
          {activeView === "couple" && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSwitch("vendor")}
          className={cn(
            "gap-2 cursor-pointer",
            activeView === "vendor" && "bg-accent/10 font-semibold"
          )}
        >
          <Store className="h-4 w-4 text-accent" />
          Vendor View
          {activeView === "vendor" && <span className="ml-auto text-accent">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function getActiveView(): ViewMode {
  return (localStorage.getItem("ks-active-view") as ViewMode) || "couple";
}
