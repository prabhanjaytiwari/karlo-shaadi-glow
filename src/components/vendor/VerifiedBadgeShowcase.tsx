import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Download, Copy, Code, Share2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoImg from "@/assets/logo-new.png";

interface VerifiedBadgeShowcaseProps {
  vendor: {
    id: string;
    business_name: string;
    category: string;
    verified: boolean;
    verification_date?: string;
  };
}

export const VerifiedBadgeShowcase = ({ vendor }: VerifiedBadgeShowcaseProps) => {
  const { toast } = useToast();
  const [badgeStyle, setBadgeStyle] = useState<"light" | "dark" | "minimal">("light");

  const profileUrl = `https://karloshaadi.com/vendors/${vendor.id}`;
  const embedUrl = `https://karloshaadi.com/embed?type=verified-badge&vendorId=${vendor.id}&style=${badgeStyle}`;

  const embedCode = `<a href="${profileUrl}" target="_blank" rel="noopener noreferrer">
  <img src="${embedUrl}" alt="Karlo Shaadi Verified Vendor" width="280" height="80" />
</a>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    toast({ title: "Embed code copied!", description: "Paste it on your website or blog." });
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({ title: "Profile link copied!" });
  };

  const downloadBadge = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 280;

    const isDark = badgeStyle === "dark";
    const isMinimal = badgeStyle === "minimal";

    // Background
    if (isDark) {
      ctx.fillStyle = "#1a1a2e";
      ctx.beginPath();
      ctx.roundRect(0, 0, 800, 280, 20);
      ctx.fill();
    } else if (isMinimal) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(0, 0, 800, 280, 20);
      ctx.fill();
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      // Light gradient
      const grad = ctx.createLinearGradient(0, 0, 800, 280);
      grad.addColorStop(0, "#fff1f2");
      grad.addColorStop(1, "#fef3c7");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(0, 0, 800, 280, 20);
      ctx.fill();
      ctx.strokeStyle = "rgba(219, 39, 119, 0.2)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Verified checkmark circle
    ctx.beginPath();
    ctx.arc(100, 140, 50, 0, Math.PI * 2);
    const checkGrad = ctx.createLinearGradient(50, 90, 150, 190);
    checkGrad.addColorStop(0, "#db2777");
    checkGrad.addColorStop(1, "#f59e0b");
    ctx.fillStyle = checkGrad;
    ctx.fill();

    // Checkmark
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(78, 140);
    ctx.lineTo(93, 158);
    ctx.lineTo(122, 122);
    ctx.stroke();

    // Text
    const textColor = isDark ? "#ffffff" : "#1f2937";
    const subtextColor = isDark ? "#9ca3af" : "#6b7280";

    ctx.fillStyle = textColor;
    ctx.font = "bold 32px 'Inter', sans-serif";
    ctx.fillText(vendor.business_name, 180, 100);

    ctx.fillStyle = subtextColor;
    ctx.font = "18px 'Inter', sans-serif";
    ctx.fillText(`${vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)} • Verified Vendor`, 180, 135);

    // "Karlo Shaadi Verified" label
    ctx.fillStyle = "#db2777";
    ctx.font = "bold 22px 'Inter', sans-serif";
    ctx.fillText("✓ Karlo Shaadi Verified", 180, 180);

    // Footer
    ctx.fillStyle = subtextColor;
    ctx.font = "14px 'Inter', sans-serif";
    ctx.fillText("karloshaadi.com", 180, 220);

    // Download
    const link = document.createElement("a");
    link.download = `karlo-shaadi-verified-${vendor.business_name.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    toast({ title: "Badge downloaded!", description: "Share it on your Instagram, website, or WhatsApp." });
  };

  if (!vendor.verified) {
    return (
      <Card className="border-2 border-dashed border-muted">
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Get Your Verified Badge</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            Complete your verification to unlock the "Karlo Shaadi Verified Vendor" badge 
            — display it on your website, Instagram bio, and WhatsApp status.
          </p>
          <Button variant="outline" asChild>
            <a href="/vendor/verification">Complete Verification →</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Badge Preview */}
      <Card className="overflow-hidden border-2 border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Your Verified Badge
          </CardTitle>
          <CardDescription>
            Download or embed this badge on your website, Instagram, or WhatsApp status to build trust with couples.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Style Selector */}
          <div className="flex gap-3">
            {(["light", "dark", "minimal"] as const).map((style) => (
              <button
                key={style}
                onClick={() => setBadgeStyle(style)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all
                  ${badgeStyle === style 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }
                `}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Badge Preview */}
          <div className={`
            rounded-2xl p-6 flex items-center gap-5 max-w-lg mx-auto transition-all
            ${badgeStyle === "dark" 
              ? "bg-[#1a1a2e] text-white" 
              : badgeStyle === "minimal"
                ? "bg-white border border-border"
                : "bg-gradient-to-r from-rose-50 to-amber-50 border border-primary/20"
            }
          `}>
            {/* Verified Icon */}
            <div className="shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>

            <div className="min-w-0">
              <h3 className={`font-bold text-lg truncate ${badgeStyle === "dark" ? "text-white" : "text-foreground"}`}>
                {vendor.business_name}
              </h3>
              <p className={`text-sm ${badgeStyle === "dark" ? "text-gray-400" : "text-muted-foreground"}`}>
                {vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)} • Verified
              </p>
              <p className="text-primary font-semibold text-sm mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Karlo Shaadi Verified
              </p>
              <p className={`text-xs mt-0.5 ${badgeStyle === "dark" ? "text-gray-500" : "text-muted-foreground/60"}`}>
                karloshaadi.com
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={downloadBadge} className="gap-2">
              <Download className="h-4 w-4" />
              Download Badge (PNG)
            </Button>
            <Button variant="outline" onClick={copyProfileLink} className="gap-2">
              <Share2 className="h-4 w-4" />
              Copy Profile Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Embed Code */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Code className="h-4 w-4" />
            Embed on Your Website
          </CardTitle>
          <CardDescription>
            Paste this code on your website to display the verified badge with a link to your Karlo Shaadi profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-muted rounded-lg p-4 text-xs overflow-x-auto font-mono">
              {embedCode}
            </pre>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2 gap-1.5"
              onClick={copyEmbedCode}
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-accent" />
            Where to Display Your Badge
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span><strong>Instagram Bio</strong> — Add your Karlo Shaadi profile link</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span><strong>WhatsApp Status</strong> — Share the downloaded badge image</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span><strong>Your Website</strong> — Use the embed code above</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span><strong>Business Cards</strong> — Print the badge on your physical cards</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span><strong>Wedding Fairs</strong> — Display at your booth for instant credibility</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
