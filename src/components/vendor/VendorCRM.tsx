import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Flame, Thermometer, Snowflake, Phone, MessageSquare, 
  Calendar, ChevronRight, ArrowRight, Search, Copy
} from "lucide-react";

interface VendorCRMProps {
  vendorId: string;
  vendorName: string;
}

const PIPELINE_STAGES = [
  { key: "new", label: "New", color: "bg-blue-500" },
  { key: "contacted", label: "Contacted", color: "bg-yellow-500" },
  { key: "meeting_done", label: "Meeting", color: "bg-purple-500" },
  { key: "quote_sent", label: "Quoted", color: "bg-orange-500" },
  { key: "booked", label: "Booked", color: "bg-green-500" },
  { key: "lost", label: "Lost", color: "bg-muted-foreground" },
];

const WHATSAPP_TEMPLATES = [
  {
    name: "Thank You for Inquiry",
    message: "Hi {name}! 🙏\n\nThank you for reaching out to {vendor}! We'd love to be part of your special day.\n\nCould you share:\n📅 Your wedding date?\n👥 Expected guest count?\n📍 Venue location?\n\nLooking forward to hearing from you! ✨"
  },
  {
    name: "Follow-Up on Quote",
    message: "Hi {name}! 😊\n\nJust following up on the quote we shared. Have you had a chance to review it?\n\nWe're happy to customize our package to fit your needs. Let me know if you have any questions!\n\nBest,\n{vendor}"
  },
  {
    name: "Meeting Confirmation",
    message: "Hi {name}! 🎉\n\nGreat speaking with you! As discussed, here's a summary:\n\n📋 Service: [service details]\n💰 Package: [amount]\n📅 Your date: [date]\n\nShall we go ahead and lock this in? 🙌\n\n{vendor}"
  },
  {
    name: "Post-Meeting Thank You",
    message: "Hi {name}! 🙏\n\nThank you for meeting with us today! It was wonderful understanding your vision for the big day.\n\nWe'll send across a detailed quote shortly. Feel free to reach out anytime!\n\nWarm regards,\n{vendor}"
  },
];

export function VendorCRM({ vendorId, vendorName }: VendorCRMProps) {
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => { loadInquiries(); }, [vendorId]);

  const loadInquiries = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("vendor_inquiries")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });
    setInquiries(data || []);
    setLoading(false);
  };

  const moveToStage = async (inquiryId: string, stage: string) => {
    const { error } = await supabase
      .from("vendor_inquiries")
      .update({ 
        pipeline_stage: stage, 
        updated_at: new Date().toISOString(),
        last_contacted_at: stage !== "new" ? new Date().toISOString() : undefined
      })
      .eq("id", inquiryId);
    if (error) {
      console.error("Error moving lead:", error);
      toast({ title: "Failed to move lead", variant: "destructive" });
      return;
    }
    loadInquiries();
    toast({ title: `Moved to ${PIPELINE_STAGES.find(s => s.key === stage)?.label}` });
  };

  const saveNote = async (inquiryId: string) => {
    if (!noteText.trim()) return;
    await supabase
      .from("vendor_inquiries")
      .update({ notes_internal: noteText, updated_at: new Date().toISOString() })
      .eq("id", inquiryId);
    toast({ title: "Note saved!" });
    setNoteText("");
    loadInquiries();
  };

  const getLeadTemperature = (inquiry: any) => {
    const daysSinceInquiry = (Date.now() - new Date(inquiry.created_at).getTime()) / (1000 * 60 * 60 * 24);
    const weddingDate = inquiry.wedding_date ? new Date(inquiry.wedding_date) : null;
    const daysToWedding = weddingDate ? (weddingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24) : 999;

    if (daysToWedding < 30 && daysSinceInquiry < 3) return { temp: "hot", icon: Flame, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/20" };
    if (daysToWedding < 90 || daysSinceInquiry < 7) return { temp: "warm", icon: Thermometer, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/20" };
    return { temp: "cold", icon: Snowflake, color: "text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/20" };
  };

  const sendWhatsApp = (inquiry: any, template: typeof WHATSAPP_TEMPLATES[0]) => {
    const msg = template.message
      .replace(/{name}/g, inquiry.name)
      .replace(/{vendor}/g, vendorName);
    const phone = inquiry.phone?.replace(/\D/g, "");
    if (phone) {
      window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    } else {
      navigator.clipboard.writeText(msg);
      toast({ title: "Message copied!" });
    }
  };

  const copyTemplate = (inquiry: any, template: typeof WHATSAPP_TEMPLATES[0]) => {
    const msg = template.message
      .replace(/{name}/g, inquiry.name)
      .replace(/{vendor}/g, vendorName);
    navigator.clipboard.writeText(msg);
    toast({ title: "Copied to clipboard!" });
  };

  const filtered = inquiries.filter(inq => {
    const matchSearch = !searchTerm || inq.name?.toLowerCase().includes(searchTerm.toLowerCase()) || inq.phone?.includes(searchTerm);
    const matchStage = !activeStage || (inq.pipeline_stage || "new") === activeStage;
    return matchSearch && matchStage;
  });

  // Funnel stats
  const stageCounts = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.key] = inquiries.filter(i => (i.pipeline_stage || "new") === stage.key).length;
    return acc;
  }, {} as Record<string, number>);

  const conversionRate = inquiries.length > 0 
    ? Math.round((stageCounts.booked / inquiries.length) * 100) 
    : 0;

  return (
    <div className="space-y-4">
      {/* Conversion Funnel */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Lead Pipeline</p>
            <Badge variant="secondary" className="text-xs">{conversionRate}% conversion</Badge>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {PIPELINE_STAGES.map((stage, i) => (
              <div key={stage.key} className="flex items-center shrink-0">
                <button
                  onClick={() => setActiveStage(activeStage === stage.key ? null : stage.key)}
                  className={`flex flex-col items-center px-3 py-2 rounded-xl transition-all text-xs ${
                    activeStage === stage.key ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-muted/50"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${stage.color} mb-1`} />
                  <span className="font-medium">{stageCounts[stage.key] || 0}</span>
                  <span className="text-muted-foreground text-[10px]">{stage.label}</span>
                </button>
                {i < PIPELINE_STAGES.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search leads..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-9 h-10 rounded-xl"
        />
      </div>

      {/* Lead Cards */}
      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading leads...</p>
      ) : filtered.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground text-sm">
              {searchTerm || activeStage ? "No leads match your filter" : "No inquiries yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(inquiry => {
            const temp = getLeadTemperature(inquiry);
            const TempIcon = temp.icon;
            const currentStage = inquiry.pipeline_stage || "new";
            const currentStageIdx = PIPELINE_STAGES.findIndex(s => s.key === currentStage);
            const nextStage = PIPELINE_STAGES[currentStageIdx + 1];
            const isSelected = selectedLead?.id === inquiry.id;

            return (
              <Card
                key={inquiry.id}
                className={`border-border/50 cursor-pointer transition-all ${isSelected ? "ring-2 ring-primary/30" : ""}`}
                onClick={() => setSelectedLead(isSelected ? null : inquiry)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <TempIcon className={`h-4 w-4 ${temp.color} shrink-0`} />
                        <span className="font-semibold text-sm truncate">{inquiry.name}</span>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {PIPELINE_STAGES.find(s => s.key === currentStage)?.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {inquiry.phone && <span>{inquiry.phone}</span>}
                        {inquiry.wedding_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(inquiry.wedding_date).toLocaleDateString("en-IN")}
                          </span>
                        )}
                        {inquiry.budget_range && <span>₹{inquiry.budget_range}</span>}
                      </div>
                    </div>
                    {nextStage && currentStage !== "booked" && currentStage !== "lost" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs shrink-0"
                        onClick={(e) => { e.stopPropagation(); moveToStage(inquiry.id, nextStage.key); }}
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        {nextStage.label}
                      </Button>
                    )}
                  </div>

                  {/* Expanded Lead View */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-border/50 space-y-3" onClick={e => e.stopPropagation()}>
                      {/* Stage Actions */}
                      <div className="flex flex-wrap gap-1.5">
                        {PIPELINE_STAGES.map(stage => (
                          <Button
                            key={stage.key}
                            size="sm"
                            variant={currentStage === stage.key ? "default" : "outline"}
                            className="h-7 text-xs"
                            onClick={() => moveToStage(inquiry.id, stage.key)}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${stage.color} mr-1`} />
                            {stage.label}
                          </Button>
                        ))}
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2">
                        {inquiry.phone && (
                          <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
                            <a href={`tel:${inquiry.phone}`}>
                              <Phone className="h-3.5 w-3.5 mr-1" /> Call
                            </a>
                          </Button>
                        )}
                        {inquiry.phone && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs"
                            onClick={() => window.open(`https://wa.me/91${inquiry.phone?.replace(/\D/g, "")}`, "_blank")}
                          >
                            <MessageSquare className="h-3.5 w-3.5 mr-1" /> WhatsApp
                          </Button>
                        )}
                      </div>

                      {/* WhatsApp Templates */}
                      <div>
                        <p className="text-xs font-medium mb-2 text-muted-foreground">Quick Messages</p>
                        <div className="grid grid-cols-2 gap-2">
                          {WHATSAPP_TEMPLATES.map((tpl, i) => (
                            <div key={i} className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-auto py-1.5 px-2 text-[11px] text-left flex-1 justify-start"
                                onClick={() => sendWhatsApp(inquiry, tpl)}
                              >
                                {tpl.name}
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 shrink-0" onClick={() => copyTemplate(inquiry, tpl)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <Textarea
                          placeholder="Add internal notes..."
                          value={noteText || inquiry.notes_internal || ""}
                          onChange={e => setNoteText(e.target.value)}
                          rows={2}
                          className="text-xs"
                        />
                        <Button size="sm" variant="outline" className="mt-1.5 h-7 text-xs" onClick={() => saveNote(inquiry.id)}>
                          Save Note
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
