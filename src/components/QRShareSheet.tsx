import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Download, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface QRShareSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title?: string;
  subtitle?: string;
}

export function QRShareSheet({ open, onOpenChange, url, title = 'Share', subtitle }: QRShareSheetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 220,
        margin: 2,
        color: { dark: '#1a1a1a', light: '#ffffff' },
      });
    }
  }, [open, url]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'karlo-shaadi-qr.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
    toast.success('QR code saved!');
  };

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: title, url });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto rounded-2xl">
        <DialogHeader className="text-center">
          <DialogTitle>{title}</DialogTitle>
          {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
            <canvas ref={canvasRef} />
          </div>
          <p className="text-xs text-muted-foreground mb-4 text-center max-w-[200px] truncate">{url}</p>

          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={copyLink} className="flex-1 gap-2 rounded-xl">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="outline" onClick={downloadQR} className="flex-1 gap-2 rounded-xl">
              <Download className="w-4 h-4" />
              Save
            </Button>
            {typeof navigator.share === 'function' && (
              <Button onClick={nativeShare} className="flex-1 gap-2 rounded-xl">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
