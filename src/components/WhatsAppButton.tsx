import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WhatsAppButton = () => {
  const phoneNumber = "917011460321";
  const message = encodeURIComponent("Hi! I'm interested in Karlo Shaadi services.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group"
    >
      <Button
        size="lg"
        className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-[#25D366] hover:bg-[#20BD5A] border-2 border-white/20 group-hover:scale-110"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
      </Button>
      <div className="hidden sm:block absolute -top-12 right-0 bg-background/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-border">
        <p className="text-sm font-medium">Chat with Prabhanjay Tiwari</p>
        <p className="text-xs text-muted-foreground">Founder</p>
      </div>
    </a>
  );
};
