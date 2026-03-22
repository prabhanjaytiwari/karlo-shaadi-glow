import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface InvoiceGeneratorProps {
  vendorName: string;
}

export function InvoiceGenerator({ vendorName }: InvoiceGeneratorProps) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    clientName: "",
    service: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    phone: "",
  });

  const generatePDF = () => {
    if (!form.clientName || !form.amount || !form.service) {
      toast({ title: "Please fill client name, service, and amount", variant: "destructive" });
      return;
    }

    const doc = new jsPDF();
    const amt = parseFloat(form.amount);
    const invoiceNo = `KS-${Date.now().toString(36).toUpperCase()}`;

    // Header
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 20, 25);
    doc.setFontSize(10);
    doc.text(vendorName, 140, 15);
    doc.text(`Invoice #: ${invoiceNo}`, 140, 22);
    doc.text(`Date: ${new Date(form.date).toLocaleDateString("en-IN")}`, 140, 29);

    // Body
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 20, 55);
    doc.setFont("helvetica", "normal");
    doc.text(form.clientName, 20, 63);
    if (form.phone) doc.text(`Phone: ${form.phone}`, 20, 70);

    // Table header
    const tableY = 85;
    doc.setFillColor(245, 245, 245);
    doc.rect(20, tableY, 170, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Service", 25, tableY + 7);
    doc.text("Amount (₹)", 150, tableY + 7);

    // Table row
    doc.setFont("helvetica", "normal");
    doc.text(form.service, 25, tableY + 20);
    doc.text(`₹${amt.toLocaleString("en-IN")}`, 150, tableY + 20);

    // Line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, tableY + 25, 190, tableY + 25);

    // Total
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Total:", 120, tableY + 38);
    doc.text(`₹${amt.toLocaleString("en-IN")}`, 150, tableY + 38);

    // Notes
    if (form.notes) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Notes:", 20, tableY + 55);
      doc.text(form.notes, 20, tableY + 63);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated via Karlo Shaadi Vendor Tools", 20, 280);
    doc.text("www.karloshaadi.com", 150, 280);

    doc.save(`Invoice-${invoiceNo}.pdf`);
    toast({ title: "Invoice downloaded!" });
  };

  return (
    <Card className="shadow-[var(--shadow-sm)]">
      <CardHeader>
        <CardTitle className="text-lg">Quick Invoice Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Client Name *</Label>
            <Input placeholder="Client name" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Service *</Label>
            <Input placeholder="Wedding Photography" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Amount (₹) *</Label>
            <Input type="number" placeholder="50000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Date</Label>
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea placeholder="Payment terms, advance details..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
        </div>
        <Button onClick={generatePDF} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Download Invoice PDF
        </Button>
      </CardContent>
    </Card>
  );
}
