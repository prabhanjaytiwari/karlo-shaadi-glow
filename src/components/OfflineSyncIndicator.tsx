import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, Cloud, CloudOff, Check } from 'lucide-react';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function OfflineSyncIndicator() {
  const { isOnline, pendingCount, totalPending, isSyncing, syncNow } = useOfflineSync();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Show banner when going offline or when there are pending items
    if (!isOnline || totalPending > 0) {
      setShowBanner(true);
    } else {
      // Hide after a delay when everything is synced
      const timer = setTimeout(() => setShowBanner(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, totalPending]);

  if (!showBanner && isOnline && totalPending === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-16 left-1/2 -translate-x-1/2 z-50"
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={isOnline ? (totalPending > 0 ? 'secondary' : 'outline') : 'destructive'}
              size="sm"
              className="gap-2 shadow-lg"
            >
              {isSyncing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : isOnline ? (
                totalPending > 0 ? <Cloud className="h-4 w-4" /> : <Check className="h-4 w-4" />
              ) : (
                <WifiOff className="h-4 w-4" />
              )}
              
              {isSyncing ? (
                'Syncing...'
              ) : isOnline ? (
                totalPending > 0 ? `${totalPending} pending` : 'All synced'
              ) : (
                'Offline'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="center">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="h-5 w-5 text-green-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-destructive" />
                )}
                <span className="font-medium">
                  {isOnline ? 'Connected' : 'No internet connection'}
                </span>
              </div>

              {totalPending > 0 && (
                <div className="space-y-2 border-t pt-3">
                  <p className="text-sm text-muted-foreground">
                    Pending items to sync:
                  </p>
                  <ul className="text-sm space-y-1">
                    {pendingCount.messages > 0 && (
                      <li className="flex items-center gap-2">
                        <CloudOff className="h-4 w-4 text-muted-foreground" />
                        {pendingCount.messages} message{pendingCount.messages !== 1 ? 's' : ''}
                      </li>
                    )}
                    {pendingCount.bookings > 0 && (
                      <li className="flex items-center gap-2">
                        <CloudOff className="h-4 w-4 text-muted-foreground" />
                        {pendingCount.bookings} booking{pendingCount.bookings !== 1 ? 's' : ''}
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {isOnline && totalPending > 0 && (
                <Button 
                  onClick={syncNow} 
                  disabled={isSyncing}
                  className="w-full"
                  size="sm"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </>
                  )}
                </Button>
              )}

              {!isOnline && (
                <p className="text-xs text-muted-foreground">
                  Your messages and bookings are saved locally and will sync automatically when you're back online.
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </motion.div>
    </AnimatePresence>
  );
}
