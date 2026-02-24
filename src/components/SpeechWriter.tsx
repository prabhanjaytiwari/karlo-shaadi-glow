import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, RefreshCw, Download, Sparkles, Plus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

const relationships = [
  "Best Man", "Maid of Honor", "Father of the Bride", "Mother of the Bride",
  "Father of the Groom", "Mother of the Groom", "Sibling", "Friend", "Colleague", "Other"
];

const tones = [
  { value: "funny", label: "😂 Funny & Sarcastic", desc: "Roast-style with love" },
  { value: "emotional", label: "🥹 Emotional & Heartfelt", desc: "Tear-jerking & poetic" },
  { value: "balanced", label: "✨ Balanced Mix", desc: "Best of both worlds" },
];

const languages = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "hinglish", label: "Hinglish" },
];

const lengths = [
  { value: "short", label: "Short (~1 min)" },
  { value: "medium", label: "Medium (~3 min)" },
  { value: "long", label: "Long (~5 min)" },
];

export const SpeechWriter = () => {
  const [step, setStep] = useState<"form" | "result">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [speech, setSpeech] = useState("");

  const [relationship, setRelationship] = useState("");
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [anecdotes, setAnecdotes] = useState(["", ""]);
  const [tone, setTone] = useState("balanced");
  const [language, setLanguage] = useState("english");
  const [length, setLength] = useState("medium");

  const addAnecdote = () => { if (anecdotes.length < 5) setAnecdotes([...anecdotes, ""]); };
  const removeAnecdote = (i: number) => { if (anecdotes.length > 1) setAnecdotes(anecdotes.filter((_, idx) => idx !== i)); };
  const updateAnecdote = (i: number, v: string) => { const a = [...anecdotes]; a[i] = v; setAnecdotes(a); };

  const generate = async () => {
    if (!relationship || !brideName.trim() || !groomName.trim()) {
      toast({ title: "Missing fields", description: "Please fill in your relationship and couple names.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-wedding-speech", {
        body: { relationship, brideName: brideName.trim(), groomName: groomName.trim(), anecdotes: anecdotes.filter(a => a.trim()), tone, language, length },
      });

      if (error) throw error;
      if (data?.error) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
        return;
      }

      setSpeech(data.speech);
      setStep("result");
    } catch (err: any) {
      toast({ title: "Failed to generate speech", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(speech);
    toast({ title: "Copied! 📋", description: "Speech copied to clipboard." });
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Check out this amazing AI Wedding Speech Writer! 🎤✨\n\nCreate your personalized wedding speech for free:\nhttps://karloshaadi.com/speech-writer`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Wedding Speech for ${brideName} & ${groomName}`, 20, 20);
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(speech, 170);
    doc.text(lines, 20, 35);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Generated on KarloShaadi.com", 20, 285);
    doc.save(`wedding-speech-${brideName}-${groomName}.pdf`);
  };

  if (step === "result") {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-6">
          <Button onClick={copyToClipboard} variant="outline" size="sm" className="gap-2"><Copy className="w-4 h-4" /> Copy</Button>
          <Button onClick={shareWhatsApp} variant="outline" size="sm" className="gap-2 border-accent/30 hover:bg-accent/10"><Share2 className="w-4 h-4" /> WhatsApp</Button>
          <Button onClick={downloadPDF} variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" /> PDF</Button>
          <Button onClick={() => { setStep("form"); }} variant="outline" size="sm" className="gap-2"><RefreshCw className="w-4 h-4" /> Edit & Regenerate</Button>
        </div>

        <Card className="border-primary/20">
          <CardContent className="p-6 md:p-8">
            <div className="prose prose-lg max-w-none whitespace-pre-wrap text-foreground leading-relaxed">
              {speech}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">✨ Speech crafted by AI on KarloShaadi.com</p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Relationship */}
        <div>
          <Label className="text-base font-semibold">Who are you? *</Label>
          <Select onValueChange={setRelationship}>
            <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select your relationship to the couple" /></SelectTrigger>
            <SelectContent>
              {relationships.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Couple Names */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-base font-semibold">Bride's Name *</Label>
            <Input className="mt-1.5" placeholder="e.g. Priya" value={brideName} onChange={e => setBrideName(e.target.value)} maxLength={100} />
          </div>
          <div>
            <Label className="text-base font-semibold">Groom's Name *</Label>
            <Input className="mt-1.5" placeholder="e.g. Rahul" value={groomName} onChange={e => setGroomName(e.target.value)} maxLength={100} />
          </div>
        </div>

        {/* Anecdotes */}
        <div>
          <Label className="text-base font-semibold">Share Memories / Anecdotes</Label>
          <p className="text-sm text-muted-foreground mb-2">The more details you share, the more personal the speech.</p>
          <AnimatePresence>
            {anecdotes.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex gap-2 mb-2">
                <Textarea
                  placeholder={i === 0 ? "e.g. I remember when Priya first told me about Rahul..." : "e.g. The funniest thing about them is..."}
                  value={a}
                  onChange={e => updateAnecdote(i, e.target.value)}
                  maxLength={500}
                  className="min-h-[80px]"
                />
                {anecdotes.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeAnecdote(i)} className="shrink-0 mt-1"><X className="w-4 h-4" /></Button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {anecdotes.length < 5 && (
            <Button variant="outline" size="sm" onClick={addAnecdote} className="gap-1 mt-1"><Plus className="w-3 h-3" /> Add Memory</Button>
          )}
        </div>

        {/* Tone */}
        <div>
          <Label className="text-base font-semibold">Tone</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1.5">
            {tones.map(t => (
              <button
                key={t.value}
                onClick={() => setTone(t.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${tone === t.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
              >
                <p className="font-medium text-foreground text-sm">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Language & Length */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-base font-semibold">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {languages.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-base font-semibold">Length</Label>
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {lengths.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={generate} disabled={isLoading} size="lg" className="w-full gap-2 text-lg">
          {isLoading ? (
            <><RefreshCw className="w-5 h-5 animate-spin" /> Writing Your Speech...</>
          ) : (
            <><Sparkles className="w-5 h-5" /> Generate My Speech</>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">100% Free • No signup required • Powered by AI</p>
      </div>
    </div>
  );
};
