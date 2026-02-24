import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

export const WhatsAppButton = () => {
  const isMobile = useIsMobile();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  // Bottom nav is visible when mobile + logged in
  const hasBottomNav = isMobile && user;
  const location = useLocation();
  const [showLabel, setShowLabel] = useState(false);
  const phoneNumber = "917011460321";

  // Show help label after 10 seconds on first visit
  useEffect(() => {
    const hasSeenLabel = sessionStorage.getItem("whatsapp-label-shown");
    if (!hasSeenLabel) {
      const timer = setTimeout(() => {
        setShowLabel(true);
        sessionStorage.setItem("whatsapp-label-shown", "true");
        // Hide after 5 seconds
        setTimeout(() => setShowLabel(false), 5000);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Generate context-aware message based on current page
  const getMessage = () => {
    const path = location.pathname;
    
    if (path.startsWith("/vendor/")) {
      return "Hi! I found a vendor on Karlo Shaadi and would like more information.";
    }
    if (path === "/search") {
      const params = new URLSearchParams(location.search);
      const category = params.get("category");
      const city = params.get("city");
      if (category && city) {
        return `Hi! I'm looking for ${category} vendors in ${city}. Can you help?`;
      }
      return "Hi! I'm searching for wedding vendors on Karlo Shaadi.";
    }
    if (path === "/bookings") {
      return "Hi! I have a question about my booking on Karlo Shaadi.";
    }
    return "Hi! I'm interested in Karlo Shaadi wedding planning services.";
  };

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(getMessage())}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed right-4 sm:right-6 z-50 group transition-all duration-300 ${
        hasBottomNav ? 'bottom-20' : 'bottom-4 sm:bottom-6'
      }`}
    >
      {/* Help Label */}
      {showLabel && (
        <div className="absolute -top-12 right-0 bg-foreground text-background px-3 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm font-medium animate-fade-in">
          Need help? Chat with us!
          <div className="absolute -bottom-1 right-4 w-2 h-2 bg-foreground rotate-45" />
        </div>
      )}

      <Button
        size="lg"
        className={`rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-[#25D366] hover:bg-[#20BD5A] border-2 border-white/20 group-hover:scale-110 animate-pulse-subtle ${
          isMobile ? 'h-12 w-12' : 'h-14 w-14'
        }`}
      >
        <MessageCircle className={`text-white ${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
      </Button>

      {/* Hover tooltip */}
      <div className="hidden sm:block absolute -top-12 right-0 bg-background/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-border">
        <p className="text-sm font-medium">Chat with Prabhanjay Tiwari</p>
        <p className="text-xs text-muted-foreground">Founder</p>
      </div>
    </a>
  );
};
