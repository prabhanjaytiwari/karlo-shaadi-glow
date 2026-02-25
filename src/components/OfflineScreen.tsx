import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineScreen() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
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
      {isOffline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center px-8 text-center"
        >
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
            <WifiOff className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">You're Offline</h2>
          <p className="text-muted-foreground mb-1 text-sm max-w-xs">
            Looks like the WiFi at the venue isn't cooperating 😅
          </p>
          <p className="text-muted-foreground/70 text-xs mb-8 max-w-xs">
            Check your connection and try again. Your data is safe — we'll sync everything once you're back online.
          </p>
          <Button onClick={retry} disabled={retrying} size="lg" className="rounded-2xl gap-2 px-8">
            <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
            {retrying ? 'Checking…' : 'Try Again'}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
