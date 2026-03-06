import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Globe, Eye, Copy, QrCode, Palette, ExternalLink, Loader2 } from "lucide-react";
import QRCode from "qrcode";

interface VendorMiniSiteProps {
  vendorId: string;
  vendorName: string;
}

const THEMES = [
  { id: "elegant-rose", name: "Elegant Rose", primary: "#be185d", accent: "#fda4af" },
  { id: "royal-gold", name: "Royal Gold", primary: "#92400e", accent: "#fbbf24" },
  { id: "modern-slate", name: "Modern Slate", primary: "#1e293b", accent: "#94a3b8" },
];

const DEFAULT_SECTIONS = {
  about: true,
  portfolio: true,
  services: true,
  reviews: true,
  whatsapp_cta: true,
};

export function VendorMiniSite({ vendorId, vendorName }: VendorMiniSiteProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [miniSite, setMiniSite] = useState<any>(null);
  const [slug, setSlug] = useState("");
  const [theme, setTheme] = useState("elegant-rose");
  const [tagline, setTagline] = useState("");
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [isPublished, setIsPublished] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    loadMiniSite();
  }, [vendorId]);

  const loadMiniSite = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("vendor_mini_sites")
      .select("*")
      .eq("vendor_id", vendorId)
      .maybeSingle();

    if (data) {
      setMiniSite(data);
      setSlug(data.slug);
      setTheme(data.theme);
      setTagline(data.custom_tagline || "");
      setSections(data.sections_config as typeof DEFAULT_SECTIONS || DEFAULT_SECTIONS);
      setIsPublished(data.is_published);
      generateQR(data.slug);
    } else {
      // Auto-generate slug from vendor name
      const autoSlug = vendorName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(autoSlug);
    }
    setLoading(false);
  };

  const generateQR = async (siteSlug: string) => {
    try {
      const url = `${window.location.origin}/vendor-site/${siteSlug}`;
      const dataUrl = await QRCode.toDataURL(url, { width: 256, margin: 2 });
      setQrDataUrl(dataUrl);
    } catch (e) {
      console.error("QR generation failed:", e);
    }
  };

  const saveMiniSite = async () => {
    setSaving(true);
    try {
      const payload = {
        vendor_id: vendorId,
        slug,
        theme,
        custom_tagline: tagline || null,
        sections_config: sections,
        is_published: isPublished,
      };

      if (miniSite) {
        const { error } = await supabase
          .from("vendor_mini_sites")
          .update(payload)
          .eq("id", miniSite.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("vendor_mini_sites")
          .insert(payload);
        if (error) throw error;
      }

      toast({ title: isPublished ? "Mini-site published! 🎉" : "Settings saved" });
      await loadMiniSite();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const siteUrl = `${window.location.origin}/vendor-site/${slug}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(siteUrl);
    toast({ title: "Link copied!" });
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `${slug}-qr.png`;
    a.click();
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="h-48" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* URL & Status */}
      <Card className="border-accent/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              Your Mini Website
            </CardTitle>
            <Badge variant={isPublished ? "default" : "secondary"}>
              {isPublished ? "Live" : "Draft"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm">Site URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={slug}
                onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                className="font-mono text-sm"
                placeholder="your-business-name"
              />
              <Button size="icon" variant="outline" onClick={copyUrl}>
                <Copy className="h-4 w-4" />
              </Button>
              {isPublished && (
                <Button size="icon" variant="outline" onClick={() => window.open(siteUrl, "_blank")}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{siteUrl}</p>
          </div>

          <div>
            <Label className="text-sm">Tagline</Label>
            <Input
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              placeholder="Making your dream wedding a reality ✨"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card className="border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="h-5 w-5 text-accent" />
            Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  theme === t.id ? "border-accent ring-2 ring-accent/30" : "border-border hover:border-accent/40"
                }`}
              >
                <div className="flex gap-1 justify-center mb-2">
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.primary }} />
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.accent }} />
                </div>
                <span className="text-xs font-medium">{t.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sections Toggle */}
      <Card className="border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries({ about: "About", portfolio: "Portfolio Gallery", services: "Services & Pricing", reviews: "Client Reviews", whatsapp_cta: "WhatsApp Button" }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm">{label}</span>
              <Switch
                checked={sections[key as keyof typeof sections]}
                onCheckedChange={val => setSections(prev => ({ ...prev, [key]: val }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* QR Code */}
      {qrDataUrl && (
        <Card className="border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <QrCode className="h-5 w-5 text-accent" />
              QR Code for Visiting Cards
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <img src={qrDataUrl} alt="QR Code" className="w-40 h-40 rounded-lg border" />
            <Button size="sm" variant="outline" onClick={downloadQR}>
              Download QR Code
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Publish */}
      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold">Publish Mini-Site</h4>
              <p className="text-sm text-muted-foreground">Make your mini-site visible to everyone</p>
            </div>
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
          </div>
          <Button onClick={saveMiniSite} disabled={saving} className="w-full gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
            {saving ? "Saving..." : miniSite ? "Update Mini-Site" : "Create Mini-Site"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
