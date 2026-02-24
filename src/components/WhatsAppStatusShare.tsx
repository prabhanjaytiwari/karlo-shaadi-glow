import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface WhatsAppStatusShareProps {
  title: string;
  subtitle?: string;
  stats?: Array<{ label: string; value: string }>;
  accentColor?: string;
  shareUrl: string;
  className?: string;
}

/**
 * Generates a vertical image optimized for WhatsApp Status (1080x1920)
 * and triggers share/download
 */
export const WhatsAppStatusShare = ({
  title,
  subtitle,
  stats = [],
  accentColor = "#db2777",
  shareUrl,
  className = "",
}: WhatsAppStatusShareProps) => {
  const generateStatusImage = useCallback(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
    bgGrad.addColorStop(0, "#1a0a0f");
    bgGrad.addColorStop(0.4, "#2d0a1a");
    bgGrad.addColorStop(0.7, "#1a0a0f");
    bgGrad.addColorStop(1, "#0f0508");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Decorative circles
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(200, 400, 300, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(880, 1500, 250, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Top badge
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.15;
    roundRect(ctx, 390, 320, 300, 36, 18);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.font = "bold 18px 'Inter', sans-serif";
    ctx.fillStyle = accentColor;
    ctx.textAlign = "center";
    ctx.fillText("✨ KARLO SHAADI", 540, 344);

    // Main title
    ctx.font = "bold 56px 'Inter', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    const titleLines = wrapText(ctx, title, 900);
    let y = 520;
    titleLines.forEach((line) => {
      ctx.fillText(line, 540, y);
      y += 70;
    });

    // Subtitle
    if (subtitle) {
      ctx.font = "400 28px 'Inter', sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillText(subtitle, 540, y + 30);
      y += 80;
    }

    // Divider
    const divGrad = ctx.createLinearGradient(240, 0, 840, 0);
    divGrad.addColorStop(0, "transparent");
    divGrad.addColorStop(0.3, accentColor);
    divGrad.addColorStop(0.7, accentColor);
    divGrad.addColorStop(1, "transparent");
    ctx.strokeStyle = divGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(240, y + 20);
    ctx.lineTo(840, y + 20);
    ctx.stroke();
    y += 60;

    // Stats
    if (stats.length > 0) {
      const statWidth = 800 / stats.length;
      stats.forEach((stat, i) => {
        const x = 140 + i * statWidth + statWidth / 2;

        ctx.font = "bold 48px 'Inter', sans-serif";
        ctx.fillStyle = accentColor;
        ctx.fillText(stat.value, x, y + 50);

        ctx.font = "400 20px 'Inter', sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillText(stat.label, x, y + 85);
      });
      y += 140;
    }

    // CTA box
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    roundRect(ctx, 140, y + 40, 800, 100, 20);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    roundRect(ctx, 140, y + 40, 800, 100, 20);
    ctx.stroke();

    ctx.font = "600 22px 'Inter', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Create yours free at karloshaadi.com", 540, y + 98);

    // Bottom branding
    ctx.font = "600 20px 'Inter', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillText("karloshaadi.com", 540, 1840);

    // Download
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

    // Try native share first (mobile)
    if (navigator.share && navigator.canShare) {
      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], "karlo-shaadi-status.jpg", { type: "image/jpeg" });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title,
            text: `${title} — karloshaadi.com`,
            url: shareUrl,
          });
          return;
        }
      } catch {
        // Fall through to download
      }
    }

    // Fallback: download
    const link = document.createElement("a");
    link.download = "karlo-shaadi-status.jpg";
    link.href = dataUrl;
    link.click();
    toast.success("Image downloaded! Share it on your WhatsApp Status 📱");
  }, [title, subtitle, stats, accentColor, shareUrl]);

  return (
    <Button
      onClick={generateStatusImage}
      variant="outline"
      size="sm"
      className={`gap-2 border-green-500/30 text-green-600 hover:bg-green-50 hover:text-green-700 ${className}`}
    >
      <Share2 className="h-4 w-4" />
      Share to Status
    </Button>
  );
};

// Helpers
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const test = currentLine + " " + words[i];
    if (ctx.measureText(test).width <= maxWidth) {
      currentLine = test;
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines;
}
