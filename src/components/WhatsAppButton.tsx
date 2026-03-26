import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const VENDOR_ROUTES = [
  "/vendor/onboarding",
  "/vendor/dashboard",
  "/vendor/settings",
  "/vendor-auth",
  "/vendor-pricing",
  "/vendor-billing",
  "/vendor-profile-setup",
  "/vendor-onboarding",
  "/for-vendors",
  "/vendor-guide",
  "/vendor-leaderboard",
  "/vendor-success-stories",
  "/vendor-verification-status",
];

export const WhatsAppButton = () => {
  const location = useLocation();
  const [showLabel, setShowLabel] = useState(false);
  const phoneNumber = "917011460321";

  const isVendorPage =
    VENDOR_ROUTES.some((r) => location.pathname.startsWith(r)) ||
    location.pathname.startsWith("/vendor-site/") ||
    location.pathname.startsWith("/vendor/");

  // Show help label after 8 seconds on vendor pages
  useEffect(() => {
    if (!isVendorPage) return;
    const hasSeenLabel = sessionStorage.getItem("wa-vendor-label");
    if (!hasSeenLabel) {
      const timer = setTimeout(() => {
        setShowLabel(true);
        sessionStorage.setItem("wa-vendor-label", "true");
        setTimeout(() => setShowLabel(false), 5000);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isVendorPage]);

  // Context-aware messages for vendor pages
  const getMessage = () => {
    const path = location.pathname;

    if (path === "/vendor/onboarding")
      return "Hi! I'm registering my business on Karlo Shaadi and need help with the process.";
    if (path === "/vendor/dashboard")
      return "Hi! I'm a vendor on Karlo Shaadi and have a question about my dashboard.";
    if (path.includes("billing") || path.includes("pricing"))
      return "Hi! I need help choosing the right plan for my wedding business on Karlo Shaadi.";
    if (path.includes("settings"))
      return "Hi! I need help with my vendor account settings on Karlo Shaadi.";
    if (path === "/for-vendors" || path === "/vendor-guide")
      return "Hi! I'm interested in listing my wedding business on Karlo Shaadi. Can you help?";
    if (path.includes("verification"))
      return "Hi! I have a question about my vendor verification status on Karlo Shaadi.";
    if (path.startsWith("/vendor-site/"))
      return "Hi! I need help customizing my vendor storefront on Karlo Shaadi.";

    return "Hi! I'm a wedding vendor and need help with Karlo Shaadi.";
  };

  // Only show on vendor pages
  if (!isVendorPage) return null;
  // Hide on pure auth pages
  if (["/vendor-auth"].includes(location.pathname)) return null;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(getMessage())}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 group"
    >
      {/* Help Label */}
      {showLabel && (
        <div className="absolute -top-12 right-0 bg-foreground text-background px-3 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm font-medium animate-fade-in">
          Need help? Chat with us! 💬
          <div className="absolute -bottom-1 right-4 w-2 h-2 bg-foreground rotate-45" />
        </div>
      )}

      <Button
        size="lg"
        className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-[#25D366] hover:bg-[#20BD5A] border-2 border-white/20 group-hover:scale-110 animate-pulse-subtle"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Hover tooltip */}
      <div className="hidden sm:block absolute -top-12 right-0 bg-background/95 px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-border">
        <p className="text-sm font-medium">Chat with Prabhanjay Tiwari</p>
        <p className="text-xs text-muted-foreground">Founder • Vendor Support</p>
      </div>
    </a>
  );
};
