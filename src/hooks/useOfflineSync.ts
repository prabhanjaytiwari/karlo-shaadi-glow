import { useState, useEffect, useCallback } from 'react';
import { offlineQueue } from '@/lib/offlineQueue';
import { useToast } from '@/hooks/use-toast';

export function useOfflineSync() {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState({ messages: 0, bookings: 0 });
  const [isSyncing, setIsSyncing] = useState(false);

  // Update pending counts
  const refreshCounts = useCallback(async () => {
    const counts = await offlineQueue.getPendingCount();
    setPendingCount(counts);
  }, []);

  useEffect(() => {
    // Initial count
    refreshCounts();

    // Subscribe to queue changes
    const unsubscribe = offlineQueue.subscribe(() => {
      refreshCounts();
    });

    // Network status listeners
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back online",
        description: pendingCount.messages + pendingCount.bookings > 0 
          ? "Syncing your pending requests..." 
          : "You're connected to the internet",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "Don't worry, your messages and bookings will be saved and synced when you're back online",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshCounts, toast, pendingCount.messages, pendingCount.bookings]);

  // Queue a message for offline sending
  const queueMessage = useCallback(async (
    senderId: string,
    recipientId: string,
    message: string
  ): Promise<{ success: boolean; offline: boolean; id?: string }> => {
    if (navigator.onLine) {
      // Try to send directly
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.from('messages').insert([{
        sender_id: senderId,
        recipient_id: recipientId,
        message,
      }]);

      if (error) {
        // Failed, queue for later
        const id = await offlineQueue.queueMessage({ senderId, recipientId, message });
        return { success: true, offline: true, id };
      }
      
      return { success: true, offline: false };
    } else {
      // Offline, queue the message
      const id = await offlineQueue.queueMessage({ senderId, recipientId, message });
      return { success: true, offline: true, id };
    }
  }, []);

  // Queue a booking for offline sending
  const queueBooking = useCallback(async (booking: {
    coupleId: string;
    vendorId: string;
    serviceId: string | null;
    weddingDate: string;
    totalAmount: number;
    specialRequirements: string | null;
    advancePercentage: number;
  }): Promise<{ success: boolean; offline: boolean; id?: string }> => {
    if (navigator.onLine) {
      // Try to send directly
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.from('bookings').insert([{
        couple_id: booking.coupleId,
        vendor_id: booking.vendorId,
        service_id: booking.serviceId,
        wedding_date: booking.weddingDate,
        total_amount: booking.totalAmount,
        special_requirements: booking.specialRequirements,
        advance_percentage: booking.advancePercentage,
        status: 'pending',
      }]);

      if (error) {
        // Failed, queue for later
        const id = await offlineQueue.queueBooking(booking);
        return { success: true, offline: true, id };
      }
      
      return { success: true, offline: false };
    } else {
      // Offline, queue the booking
      const id = await offlineQueue.queueBooking(booking);
      return { success: true, offline: true, id };
    }
  }, []);

  // Manual sync trigger
  const syncNow = useCallback(async () => {
    if (!navigator.onLine) {
      toast({
        title: "Still offline",
        description: "Connect to the internet to sync your data",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    try {
      await offlineQueue.syncAll();
      await refreshCounts();
      toast({
        title: "Sync complete",
        description: "All your data has been synced",
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Some items couldn't be synced. We'll try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [toast, refreshCounts]);

  const totalPending = pendingCount.messages + pendingCount.bookings;

  return {
    isOnline,
    pendingCount,
    totalPending,
    isSyncing,
    queueMessage,
    queueBooking,
    syncNow,
    refreshCounts,
  };
}
