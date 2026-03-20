import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineScreen() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [dismissed, setDismissed] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const goOffline = () => { setIsOffline(true); setDismissed(false); };
    const goOnline = () => { setIsOffline(false); setDismissed(false); };
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  const retry = () => {
    setRetrying(true);
    setTimeout(() => {
      if (navigator.onLine) {
        setIsOffline(false);
        window.location.reload();
      }
      setRetrying(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOffline && !dismissed && (
        <motion.div
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -64, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-[200] bg-zinc-900 text-white px-4 py-2.5 flex items-center gap-3 shadow-lg"
        >
          <WifiOff className="w-4 h-4 shrink-0 text-amber-400" />
          <p className="text-sm flex-1">
            <span className="font-semibold">You're offline.</span>{' '}
            <span className="text-white/70 hidden sm:inline">Browsing cached content — some features may be limited.</span>
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={retry}
              disabled={retrying}
              className="h-7 px-2.5 text-xs text-white hover:bg-white/10 hover:text-white gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${retrying ? 'animate-spin' : ''}`} />
              {retrying ? 'Checking…' : 'Retry'}
            </Button>
            <button
              onClick={() => setDismissed(true)}
              className="h-7 w-7 flex items-center justify-center rounded hover:bg-white/10 text-white/60 hover:text-white"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
