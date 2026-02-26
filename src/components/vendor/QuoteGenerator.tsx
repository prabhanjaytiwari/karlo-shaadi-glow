import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QuoteGeneratorProps {
  vendorName: string;
}

export function QuoteGenerator({ vendorName }: QuoteGeneratorProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [quote, setQuote] = useState("");
  const [form, setForm] = useState({
    clientName: "",
    eventType: "wedding",
    eventDate: "",
    guestCount: "",
    location: "",
    services: "",
    budget: "",
  });

  const generateQuote = async () => {
    if (!form.clientName || !form.eventDate) {
      toast({ title: "Please fill client name and event date", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("vendor-ai-tools", {
        body: {
          tool: "quote",
          vendorName,
          ...form,
        },
      });
      if (error) throw error;
      setQuote(data.result || "Could not generate quote. Please try again.");
    } catch (e: any) {
      toast({ title: "Error generating quote", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyQuote = () => {
    navigator.clipboard.writeText(quote);
    setCopied(true);
    toast({ title: "Quote copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-2 border-accent/20">
      <CardHeader>
        <CardTitle className="text-lg">AI Quote Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Client Name *</Label>
            <Input
              placeholder="Rahul & Priya"
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Event Type</Label>
            <Select value={form.eventType} onValueChange={(v) => setForm({ ...form, eventType: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="wedding">Wedding</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="sangeet">Sangeet</SelectItem>
                <SelectItem value="reception">Reception</SelectItem>
                <SelectItem value="haldi">Haldi</SelectItem>
                <SelectItem value="mehendi">Mehendi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Event Date *</Label>
            <Input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Guest Count</Label>
            <Input type="number" placeholder="200" value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input placeholder="Mumbai" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Budget Range</Label>
            <Input placeholder="₹2-5 Lakhs" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Services Required</Label>
          <Textarea
            placeholder="Describe the services needed..."
            value={form.services}
            onChange={(e) => setForm({ ...form, services: e.target.value })}
            rows={2}
          />
        </div>

        <Button onClick={generateQuote} disabled={loading} className="w-full">
          {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</> : "Generate Professional Quote"}
        </Button>

        {quote && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={copyQuote}>
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
            <pre className="whitespace-pre-wrap text-sm font-sans">{quote}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
