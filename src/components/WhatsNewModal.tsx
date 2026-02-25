import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Shield, Music } from 'lucide-react';

const CURRENT_VERSION = '2.5.0';
const VERSION_KEY = 'karlo-whats-new-version';

const features = [
  { icon: Sparkles, title: 'AI Wedding Planner', desc: 'Get a full plan in 60 seconds with our AI assistant' },
  { icon: Music, title: 'Wedding Music Generator', desc: 'Create custom songs for your ceremonies' },
  { icon: Shield, title: 'Shaadi Seva Fund', desc: 'Every booking contributes to underprivileged weddings' },
  { icon: Zap, title: 'Instant QR Sharing', desc: 'Share your profile or wedding website via QR code' },
];

export function WhatsNewModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(VERSION_KEY);
    if (seen !== CURRENT_VERSION) {
      // Small delay so it doesn't clash with other modals
      const t = setTimeout(() => setOpen(true), 3000);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) dismiss(); }}>
      <DialogContent className="max-w-sm mx-auto rounded-2xl">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-xl">What's New ✨</DialogTitle>
          <DialogDescription>Version {CURRENT_VERSION}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={dismiss} className="w-full rounded-xl">Got it!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
