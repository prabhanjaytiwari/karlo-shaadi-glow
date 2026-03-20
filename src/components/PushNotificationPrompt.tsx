import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Shows a friendly pre-prompt card BEFORE calling the native browser
 * Notification.requestPermission() — this prevents wasting the single
 * native permission prompt on users who haven't consented yet.
 */
export function PushNotificationPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'default') return;
    if (localStorage.getItem('ks_push_asked')) return;

    // Delay prompt until user has spent 45s on the site
    const timer = setTimeout(() => setShow(true), 45000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = (permanently = false) => {
    if (permanently) localStorage.setItem('ks_push_asked', 'true');
    setShow(false);
  };

  const handleAllow = async () => {
    localStorage.setItem('ks_push_asked', 'true');
    setShow(false);
    try {
      await Notification.requestPermission();
    } catch {
      // permission request failed silently
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-[190] bg-card border border-border rounded-2xl shadow-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight">
                Stay updated on your bookings
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Get notified when vendors respond, bookings are confirmed, or deals go live.
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={handleAllow}
                  className="h-8 text-xs rounded-lg flex-1"
                >
                  Allow
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dismiss(false)}
                  className="h-8 text-xs rounded-lg flex-1"
                >
                  Not now
                </Button>
              </div>
            </div>
            <button
              onClick={() => dismiss(true)}
              className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Don't ask again"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
