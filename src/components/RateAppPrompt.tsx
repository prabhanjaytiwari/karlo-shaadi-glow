import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SESSION_KEY = 'karlo-session-count';
const RATED_KEY = 'karlo-rated-app';
const TRIGGER_SESSIONS = 4;

export function RateAppPrompt() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(RATED_KEY)) return;

    const count = parseInt(localStorage.getItem(SESSION_KEY) || '0', 10) + 1;
    localStorage.setItem(SESSION_KEY, String(count));

    if (count >= TRIGGER_SESSIONS) {
      const t = setTimeout(() => setOpen(true), 8000);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = (rated = false) => {
    if (rated) localStorage.setItem(RATED_KEY, 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) dismiss(); }}>
      <DialogContent className="max-w-xs mx-auto rounded-2xl text-center">
        <DialogHeader className="items-center">
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-accent text-accent" />
            ))}
          </div>
          <DialogTitle className="text-lg">Enjoying Karlo Shaadi?</DialogTitle>
          <DialogDescription className="text-sm">
            Your feedback helps us make wedding planning better for everyone 💕
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={() => { dismiss(true); window.open('https://play.google.com/store', '_blank'); }}
            className="w-full rounded-xl gap-2"
          >
            <ThumbsUp className="w-4 h-4" />
            Rate Us
          </Button>
          <Button
            variant="outline"
            onClick={() => { dismiss(); navigate('/support'); }}
            className="w-full rounded-xl gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Send Feedback
          </Button>
          <Button variant="ghost" size="sm" onClick={() => dismiss()} className="text-xs text-muted-foreground">
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
