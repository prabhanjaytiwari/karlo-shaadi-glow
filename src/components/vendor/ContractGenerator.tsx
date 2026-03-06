import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, FileText, Eye, Send, CheckCircle2, Clock, X, Download, Copy, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/paymentUtils";
import jsPDF from "jspdf";

interface ContractGeneratorProps {
  vendorId: string;
  vendorName: string;
  vendorCategory?: string;
}

const CONTRACT_TEMPLATES: Record<string, { services: string; cancellation: string; terms: string }> = {
  photography: {
    services: "Full-day wedding photography coverage including:\n- Pre-wedding shoot (1 session)\n- All ceremony events coverage\n- 500+ edited photographs\n- 1 premium wedding album (40 pages)\n- All raw files on USB drive\n- Online gallery for 1 year",
    cancellation: "Cancellation 30+ days before event: 100% refund of advance\nCancellation 15-29 days: 50% refund\nCancellation 7-14 days: 25% refund\nCancellation <7 days: No refund\nPostponement: One free reschedule within 6 months",
    terms: "1. Deliverables within 45 days of event\n2. Travel and accommodation for outstation venues to be borne by client\n3. Vendor retains right to use images for portfolio (faces can be blurred on request)\n4. Additional hours charged at ₹5,000/hour\n5. Force majeure clause applies for natural calamities"
  },
  catering: {
    services: "Wedding catering services including:\n- Welcome drinks & starters\n- Main course buffet (veg/non-veg)\n- Live counters (2)\n- Dessert station\n- Service staff and equipment\n- Crockery and cutlery",
    cancellation: "Cancellation 30+ days before event: 100% refund minus food procurement costs\nCancellation 15-29 days: 50% refund\nCancellation <15 days: No refund\nGuest count can be adjusted up to 7 days before event (±10%)",
    terms: "1. Final menu confirmation 15 days before event\n2. Guest count confirmation 7 days before event\n3. Tasting session included for groups of 50+\n4. Venue kitchen access required 6 hours before event\n5. Leftover food cannot be claimed for hygiene reasons"
  },
  venue: {
    services: "Wedding venue booking including:\n- Main hall/banquet/lawn area\n- Parking facilities\n- Basic lighting and sound\n- Changing rooms for bride and groom\n- Security arrangements\n- Generator backup",
    cancellation: "Cancellation 60+ days before event: 100% refund\nCancellation 30-59 days: 50% refund\nCancellation 15-29 days: 25% refund\nCancellation <15 days: No refund\nDate change subject to availability, one free reschedule",
    terms: "1. Venue access from [time] to [time]\n2. DJ/music to stop by 10 PM (as per local regulations)\n3. Decorations team can access venue 12 hours before event\n4. Any damage to property will be charged separately\n5. Outside catering allowed with prior permission"
  },
  general: {
    services: "Professional wedding services as discussed and agreed upon.",
    cancellation: "Cancellation 30+ days before event: 100% refund of advance\nCancellation 15-29 days: 50% refund\nCancellation <15 days: No refund",
    terms: "1. Services as per agreed scope\n2. Any additions will be charged extra\n3. Travel costs for outstation events borne by client\n4. Force majeure clause applies"
  }
};

export function ContractGenerator({ vendorId, vendorName, vendorCategory }: ContractGeneratorProps) {
  const { toast } = useToast();
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [previewContract, setPreviewContract] = useState<any>(null);

  // Form state
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("wedding");
  const [totalAmount, setTotalAmount] = useState("");
  const [servicesDesc, setServicesDesc] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("30% advance at signing, 40% one week before event, 30% after event completion");
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [additionalClauses, setAdditionalClauses] = useState("");
  const [templateType, setTemplateType] = useState(vendorCategory || "general");

  useEffect(() => { loadContracts(); }, [vendorId]);

  useEffect(() => {
    const template = CONTRACT_TEMPLATES[templateType] || CONTRACT_TEMPLATES.general;
    setServicesDesc(template.services);
    setCancellationPolicy(template.cancellation);
    setAdditionalClauses(template.terms);
  }, [templateType]);

  const loadContracts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("vendor_contracts")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });
    setContracts(data || []);
    setLoading(false);
  };

  const createContract = async () => {
    if (!clientName || !totalAmount || !servicesDesc) {
      toast({ title: "Fill required fields", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("vendor_contracts").insert({
      vendor_id: vendorId,
      client_name: clientName,
      client_phone: clientPhone || null,
      client_email: clientEmail || null,
      event_date: eventDate || null,
      event_type: eventType,
      services_description: servicesDesc,
      total_amount: parseFloat(totalAmount),
      payment_terms: paymentTerms,
      cancellation_policy: cancellationPolicy,
      additional_clauses: additionalClauses,
      template_type: templateType,
      vendor_signature: true,
      status: "draft",
    });

    if (error) {
      toast({ title: "Failed to create contract", variant: "destructive" });
      return;
    }

    toast({ title: "Contract created!" });
    setCreateOpen(false);
    resetForm();
    loadContracts();
  };

  const generatePDF = (contract: any) => {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;
    const lineHeight = 7;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("SERVICE AGREEMENT", pageWidth / 2, y, { align: "center" });
    y += lineHeight * 2;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${new Date(contract.created_at).toLocaleDateString("en-IN")}`, margin, y);
    doc.text(`Contract #: ${contract.id.slice(0, 8).toUpperCase()}`, pageWidth - margin, y, { align: "right" });
    y += lineHeight * 2;

    // Parties
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("BETWEEN", margin, y);
    y += lineHeight;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Service Provider: ${vendorName}`, margin, y); y += lineHeight;
    doc.text(`Client: ${contract.client_name}`, margin, y); y += lineHeight;
    if (contract.client_phone) { doc.text(`Phone: ${contract.client_phone}`, margin, y); y += lineHeight; }
    if (contract.event_date) { doc.text(`Event Date: ${new Date(contract.event_date).toLocaleDateString("en-IN")}`, margin, y); y += lineHeight; }
    doc.text(`Event Type: ${contract.event_type}`, margin, y); y += lineHeight;
    y += lineHeight;

    // Amount
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: ${formatCurrency(Number(contract.total_amount))}`, margin, y);
    y += lineHeight * 2;

    // Services
    const addSection = (title: string, content: string) => {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin, y);
      y += lineHeight;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(content, pageWidth - margin * 2);
      lines.forEach((line: string) => {
        if (y > 270) { doc.addPage(); y = margin; }
        doc.text(line, margin, y);
        y += lineHeight * 0.85;
      });
      y += lineHeight;
    };

    addSection("SERVICES", contract.services_description);
    if (contract.payment_terms) addSection("PAYMENT TERMS", contract.payment_terms);
    if (contract.cancellation_policy) addSection("CANCELLATION POLICY", contract.cancellation_policy);
    if (contract.additional_clauses) addSection("ADDITIONAL TERMS", contract.additional_clauses);

    // Signatures
    y += lineHeight;
    if (y > 240) { doc.addPage(); y = margin; }
    doc.setFontSize(10);
    doc.line(margin, y + 15, margin + 60, y + 15);
    doc.text("Service Provider Signature", margin, y + 22);
    doc.line(pageWidth - margin - 60, y + 15, pageWidth - margin, y + 15);
    doc.text("Client Signature", pageWidth - margin - 60, y + 22);

    doc.save(`Contract_${contract.client_name.replace(/\s/g, "_")}.pdf`);
    toast({ title: "PDF downloaded!" });
  };

  const sendViaWhatsApp = (contract: any) => {
    const msg = `Hi ${contract.client_name}! 📄\n\nPlease find your service agreement from ${vendorName}:\n\n📋 Services: ${contract.services_description.slice(0, 100)}...\n💰 Total: ${formatCurrency(Number(contract.total_amount))}\n📅 Event: ${contract.event_date ? new Date(contract.event_date).toLocaleDateString("en-IN") : "TBD"}\n\nPlease review and confirm. Thank you! 🙏`;
    const phone = contract.client_phone?.replace(/\D/g, "");
    if (phone) {
      window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, "_blank");
      supabase.from("vendor_contracts").update({ status: "sent" }).eq("id", contract.id).then(() => loadContracts());
    }
  };

  const deleteContract = async (id: string) => {
    await supabase.from("vendor_contracts").delete().eq("id", id);
    toast({ title: "Contract deleted" });
    loadContracts();
  };

  const resetForm = () => {
    setClientName(""); setClientPhone(""); setClientEmail("");
    setEventDate(""); setTotalAmount(""); setEventType("wedding");
    const tpl = CONTRACT_TEMPLATES[templateType] || CONTRACT_TEMPLATES.general;
    setServicesDesc(tpl.services); setCancellationPolicy(tpl.cancellation);
    setAdditionalClauses(tpl.terms);
  };

  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
    draft: { label: "Draft", variant: "secondary" },
    sent: { label: "Sent", variant: "outline" },
    accepted: { label: "Accepted", variant: "default" },
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold">{contracts.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Sent</p>
            <p className="text-lg font-bold text-primary">{contracts.filter(c => c.status === "sent").length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Accepted</p>
            <p className="text-lg font-bold text-green-600">{contracts.filter(c => c.status === "accepted").length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Create */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" size="lg">
            <Plus className="h-4 w-4 mr-2" /> New Contract
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Service Agreement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Template</Label>
              <Select value={templateType} onValueChange={setTemplateType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="catering">Catering</SelectItem>
                  <SelectItem value="venue">Venue</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Client Name *</Label>
              <Input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. Priya & Rahul" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Phone</Label><Input value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="9876543210" /></div>
              <div><Label>Email</Label><Input value={clientEmail} onChange={e => setClientEmail(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Event Date</Label><Input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} /></div>
              <div><Label>Event Type</Label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="reception">Reception</SelectItem>
                    <SelectItem value="haldi">Haldi</SelectItem>
                    <SelectItem value="mehendi">Mehendi</SelectItem>
                    <SelectItem value="sangeet">Sangeet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Total Amount *</Label><Input type="number" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} placeholder="₹" /></div>
            </div>
            <div><Label>Services *</Label><Textarea value={servicesDesc} onChange={e => setServicesDesc(e.target.value)} rows={4} /></div>
            <div><Label>Payment Terms</Label><Textarea value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} rows={2} /></div>
            <div><Label>Cancellation Policy</Label><Textarea value={cancellationPolicy} onChange={e => setCancellationPolicy(e.target.value)} rows={3} /></div>
            <div><Label>Additional Terms</Label><Textarea value={additionalClauses} onChange={e => setAdditionalClauses(e.target.value)} rows={3} /></div>
            <Button onClick={createContract} className="w-full">Create Contract</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contracts List */}
      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading...</p>
      ) : contracts.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground text-sm">No contracts yet</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Create professional agreements to protect your business</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {contracts.map(contract => {
            const cfg = statusConfig[contract.status] || statusConfig.draft;
            return (
              <Card key={contract.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm truncate">{contract.client_name}</span>
                        <Badge variant={cfg.variant} className="text-[10px] shrink-0">{cfg.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(Number(contract.total_amount))} • {contract.event_type}
                        {contract.event_date && ` • ${new Date(contract.event_date).toLocaleDateString("en-IN")}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => generatePDF(contract)}>
                      <Download className="h-3 w-3 mr-1" /> PDF
                    </Button>
                    {contract.client_phone && (
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => sendViaWhatsApp(contract)}>
                        <Send className="h-3 w-3 mr-1" /> WhatsApp
                      </Button>
                    )}
                    {contract.status === "sent" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={async () => {
                          await supabase.from("vendor_contracts").update({ status: "accepted", client_accepted: true, client_accepted_at: new Date().toISOString() }).eq("id", contract.id);
                          toast({ title: "Marked as accepted!" });
                          loadContracts();
                        }}
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Mark Accepted
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => deleteContract(contract.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
