import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Copy, Send, MessageSquare, CalendarCheck, PartyPopper, Star, IndianRupee, Sparkles, Edit } from "lucide-react";

interface ClientCommsHubProps {
  vendorId: string;
  vendorName: string;
}

interface Template {
  id: string;
  name: string;
  category: "pre-event" | "day-of" | "post-event" | "seasonal";
  icon: React.ReactNode;
  message: string;
}

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "booking-confirmed",
    name: "Booking Confirmed",
    category: "pre-event",
    icon: <CalendarCheck className="h-4 w-4" />,
    message: "Hi {name}! 🎉\n\nYour booking with {vendor} is CONFIRMED for {date}!\n\n📋 Details:\n📅 Date: {date}\n📍 Venue: {venue}\n💰 Amount: {amount}\n\nWe're so excited to be part of your celebration! We'll reach out closer to the date with more details.\n\nWarm regards,\n{vendor}"
  },
  {
    id: "event-reminder-3day",
    name: "Event Reminder (3 Days)",
    category: "pre-event",
    icon: <CalendarCheck className="h-4 w-4" />,
    message: "Hi {name}! 🌟\n\nJust 3 days to go until your big day! Here's what you need to know:\n\n📅 Date: {date}\n📍 Venue: {venue}\n⏰ Our team arrives at: [time]\n📞 Day-of contact: [phone]\n\nAnything you need? We're just a message away!\n\n{vendor}"
  },
  {
    id: "day-of-timeline",
    name: "Day-of Timeline",
    category: "day-of",
    icon: <CalendarCheck className="h-4 w-4" />,
    message: "Good morning {name}! ✨\n\nToday's the day! Here's your timeline:\n\n🕐 [Time] — Setup begins\n🕑 [Time] — [Activity]\n🕒 [Time] — [Activity]\n🕓 [Time] — [Activity]\n\n📞 Emergency contact: [phone]\n\nLet's make this magical! 🎊\n\n{vendor}"
  },
  {
    id: "day-of-checklist",
    name: "Day-of Checklist",
    category: "day-of",
    icon: <CalendarCheck className="h-4 w-4" />,
    message: "Hi {name}! Today's checklist ✅\n\n☐ Venue access confirmed\n☐ Outfit & accessories ready\n☐ Mehendi / makeup scheduled\n☐ Photographer briefed\n☐ Guest seating arranged\n☐ Music playlist finalized\n\nRelax and enjoy — we've got everything covered! 💫\n\n{vendor}"
  },
  {
    id: "thank-you-review",
    name: "Thank You + Review Request",
    category: "post-event",
    icon: <Star className="h-4 w-4" />,
    message: "Hi {name}! 🙏\n\nIt was an absolute honor to be part of your wedding! We hope everything was perfect.\n\nWould you mind sharing your experience? Your review helps us immensely:\n👉 [Review Link]\n\nWishing you a lifetime of happiness together! 💕\n\n{vendor}"
  },
  {
    id: "payment-reminder",
    name: "Payment Reminder",
    category: "pre-event",
    icon: <IndianRupee className="h-4 w-4" />,
    message: "Hi {name}! 😊\n\nFriendly reminder about your pending payment:\n\n💰 Amount: {amount}\n📅 Due by: [due date]\n💳 Payment link: [link]\n\nIf already paid, please ignore this message!\n\nThank you,\n{vendor}"
  },
  {
    id: "diwali-greeting",
    name: "Diwali Greetings",
    category: "seasonal",
    icon: <Sparkles className="h-4 w-4" />,
    message: "Happy Diwali {name}! 🪔✨\n\nWishing you and your family a beautiful Diwali filled with love, light, and laughter!\n\nPlanning a celebration? We'd love to be part of it again. Check out our latest work! 📸\n\nWarm wishes,\n{vendor}"
  },
  {
    id: "new-year-greeting",
    name: "New Year Greetings",
    category: "seasonal",
    icon: <PartyPopper className="h-4 w-4" />,
    message: "Happy New Year {name}! 🎊\n\nWishing you a wonderful year ahead filled with joy and celebrations!\n\nKnow someone getting married this year? We'd love a referral — and there's a special discount waiting! 💝\n\nCheers,\n{vendor}"
  },
  {
    id: "anniversary-wish",
    name: "Anniversary Wish",
    category: "seasonal",
    icon: <Sparkles className="h-4 w-4" />,
    message: "Happy Anniversary {name}! 💕🎂\n\nIt's been a year since your beautiful wedding! We still remember how special it was.\n\nWishing you both a lifetime of love and happiness! 🥂\n\n{vendor}"
  },
];

const CATEGORY_LABELS = {
  "pre-event": "Pre-Event",
  "day-of": "Day-of",
  "post-event": "Post-Event",
  "seasonal": "Seasonal",
};

export function ClientCommsHub({ vendorId, vendorName }: ClientCommsHubProps) {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>("pre-event");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");

  // Personalization fields
  const [clientName, setClientName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue] = useState("");
  const [amount, setAmount] = useState("");

  const personalizeMessage = (msg: string) => {
    return msg
      .replace(/{name}/g, clientName || "[Client Name]")
      .replace(/{vendor}/g, vendorName)
      .replace(/{date}/g, eventDate || "[Event Date]")
      .replace(/{venue}/g, venue || "[Venue]")
      .replace(/{amount}/g, amount ? `₹${Number(amount).toLocaleString("en-IN")}` : "[Amount]");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(personalizeMessage(text));
    toast({ title: "Copied!", description: "Message copied to clipboard" });
  };

  const sendViaWhatsApp = (text: string, phone?: string) => {
    const encodedMsg = encodeURIComponent(personalizeMessage(text));
    const url = phone
      ? `https://wa.me/91${phone}?text=${encodedMsg}`
      : `https://wa.me/?text=${encodedMsg}`;
    window.open(url, "_blank");
  };

  const filteredTemplates = DEFAULT_TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Personalization bar */}
      <Card className="border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-accent" />
            Quick Personalize
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Input placeholder="Client name" value={clientName} onChange={e => setClientName(e.target.value)} className="text-sm" />
            <Input type="date" placeholder="Event date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="text-sm" />
            <Input placeholder="Venue" value={venue} onChange={e => setVenue(e.target.value)} className="text-sm" />
            <Input placeholder="Amount (₹)" value={amount} onChange={e => setAmount(e.target.value)} className="text-sm" />
          </div>
        </CardContent>
      </Card>

      {/* Category tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="w-full justify-start gap-1">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <TabsTrigger key={key} value={key} className="text-xs">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(CATEGORY_LABELS).map(cat => (
          <TabsContent key={cat} value={cat}>
            <div className="grid gap-3">
              {DEFAULT_TEMPLATES.filter(t => t.category === cat).map(template => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate?.id === template.id ? "border-accent ring-1 ring-accent/30" : "border-border/50"
                  }`}
                  onClick={() => {
                    setSelectedTemplate(template);
                    setEditedMessage(template.message);
                    setEditMode(false);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-md bg-accent/10 text-accent">
                          {template.icon}
                        </div>
                        <span className="font-medium text-sm">{template.name}</span>
                        <Badge variant="secondary" className="text-[10px]">{CATEGORY_LABELS[template.category as keyof typeof CATEGORY_LABELS]}</Badge>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={e => { e.stopPropagation(); copyToClipboard(editMode && selectedTemplate?.id === template.id ? editedMessage : template.message); }}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600" onClick={e => { e.stopPropagation(); sendViaWhatsApp(editMode && selectedTemplate?.id === template.id ? editedMessage : template.message); }}>
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-pre-line line-clamp-3">
                      {personalizeMessage(editMode && selectedTemplate?.id === template.id ? editedMessage : template.message)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit / Preview selected template */}
      {selectedTemplate && (
        <Card className="border-accent/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{selectedTemplate.name} — Preview</CardTitle>
              <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => setEditMode(!editMode)}>
                <Edit className="h-3 w-3" />
                {editMode ? "Preview" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editMode ? (
              <Textarea
                value={editedMessage}
                onChange={e => setEditedMessage(e.target.value)}
                rows={10}
                className="text-sm font-mono"
              />
            ) : (
              <div className="bg-muted/30 rounded-lg p-4 text-sm whitespace-pre-line">
                {personalizeMessage(editedMessage || selectedTemplate.message)}
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" className="gap-1" onClick={() => copyToClipboard(editedMessage || selectedTemplate.message)}>
                <Copy className="h-3.5 w-3.5" /> Copy
              </Button>
              <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700" onClick={() => sendViaWhatsApp(editedMessage || selectedTemplate.message)}>
                <Send className="h-3.5 w-3.5" /> Send via WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
