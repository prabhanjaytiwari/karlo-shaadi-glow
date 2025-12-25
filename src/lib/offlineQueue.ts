// Offline Queue Manager using IndexedDB for persistence
const DB_NAME = 'karlo-shaadi-offline';
const DB_VERSION = 1;
const MESSAGES_STORE = 'pending-messages';
const BOOKINGS_STORE = 'pending-bookings';

interface PendingMessage {
  id: string;
  senderId: string;
  recipientId: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'syncing' | 'failed';
  retryCount: number;
}

interface PendingBooking {
  id: string;
  coupleId: string;
  vendorId: string;
  serviceId: string | null;
  weddingDate: string;
  totalAmount: number;
  specialRequirements: string | null;
  advancePercentage: number;
  createdAt: string;
  status: 'pending' | 'syncing' | 'failed';
  retryCount: number;
}

class OfflineQueueManager {
  private db: IDBDatabase | null = null;
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
    this.setupNetworkListeners();
  }

  private async init(): Promise<void> {
    try {
      this.db = await this.openDatabase();
      console.log('[OfflineQueue] Database initialized');
      
      // Attempt sync on init if online
      if (this.isOnline) {
        this.syncAll();
      }
    } catch (error) {
      console.error('[OfflineQueue] Failed to initialize database:', error);
    }
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create messages store
        if (!db.objectStoreNames.contains(MESSAGES_STORE)) {
          const messagesStore = db.createObjectStore(MESSAGES_STORE, { keyPath: 'id' });
          messagesStore.createIndex('status', 'status', { unique: false });
          messagesStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Create bookings store
        if (!db.objectStoreNames.contains(BOOKINGS_STORE)) {
          const bookingsStore = db.createObjectStore(BOOKINGS_STORE, { keyPath: 'id' });
          bookingsStore.createIndex('status', 'status', { unique: false });
          bookingsStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      console.log('[OfflineQueue] Network online - starting sync');
      this.isOnline = true;
      this.syncAll();
    });

    window.addEventListener('offline', () => {
      console.log('[OfflineQueue] Network offline');
      this.isOnline = false;
    });
  }

  // Subscribe to queue changes
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  // Add message to queue
  async queueMessage(message: Omit<PendingMessage, 'id' | 'createdAt' | 'status' | 'retryCount'>): Promise<string> {
    if (!this.db) await this.init();
    
    const pendingMessage: PendingMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      retryCount: 0,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([MESSAGES_STORE], 'readwrite');
      const store = transaction.objectStore(MESSAGES_STORE);
      const request = store.add(pendingMessage);

      request.onsuccess = () => {
        console.log('[OfflineQueue] Message queued:', pendingMessage.id);
        this.notifyListeners();
        
        // Try to sync immediately if online
        if (this.isOnline) {
          this.syncMessages();
        }
        
        resolve(pendingMessage.id);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Add booking to queue
  async queueBooking(booking: Omit<PendingBooking, 'id' | 'createdAt' | 'status' | 'retryCount'>): Promise<string> {
    if (!this.db) await this.init();
    
    const pendingBooking: PendingBooking = {
      ...booking,
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      retryCount: 0,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([BOOKINGS_STORE], 'readwrite');
      const store = transaction.objectStore(BOOKINGS_STORE);
      const request = store.add(pendingBooking);

      request.onsuccess = () => {
        console.log('[OfflineQueue] Booking queued:', pendingBooking.id);
        this.notifyListeners();
        
        // Try to sync immediately if online
        if (this.isOnline) {
          this.syncBookings();
        }
        
        resolve(pendingBooking.id);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Get all pending items
  async getPendingMessages(): Promise<PendingMessage[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([MESSAGES_STORE], 'readonly');
      const store = transaction.objectStore(MESSAGES_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingBookings(): Promise<PendingBooking[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([BOOKINGS_STORE], 'readonly');
      const store = transaction.objectStore(BOOKINGS_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Get counts
  async getPendingCount(): Promise<{ messages: number; bookings: number }> {
    const messages = await this.getPendingMessages();
    const bookings = await this.getPendingBookings();
    return {
      messages: messages.filter(m => m.status === 'pending').length,
      bookings: bookings.filter(b => b.status === 'pending').length,
    };
  }

  // Update item status
  private async updateMessageStatus(id: string, status: PendingMessage['status'], retryCount?: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([MESSAGES_STORE], 'readwrite');
      const store = transaction.objectStore(MESSAGES_STORE);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.status = status;
          if (retryCount !== undefined) item.retryCount = retryCount;
          store.put(item);
        }
        resolve();
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  private async updateBookingStatus(id: string, status: PendingBooking['status'], retryCount?: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([BOOKINGS_STORE], 'readwrite');
      const store = transaction.objectStore(BOOKINGS_STORE);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.status = status;
          if (retryCount !== undefined) item.retryCount = retryCount;
          store.put(item);
        }
        resolve();
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Delete synced item
  private async deleteMessage(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([MESSAGES_STORE], 'readwrite');
      const store = transaction.objectStore(MESSAGES_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async deleteBooking(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([BOOKINGS_STORE], 'readwrite');
      const store = transaction.objectStore(BOOKINGS_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Sync methods
  async syncMessages(): Promise<void> {
    if (!this.isOnline || this.syncInProgress) return;
    
    const { supabase } = await import('@/integrations/supabase/client');
    const messages = await this.getPendingMessages();
    const pending = messages.filter(m => m.status === 'pending' && m.retryCount < 3);

    for (const msg of pending) {
      try {
        await this.updateMessageStatus(msg.id, 'syncing');
        
        const { error } = await supabase.from('messages').insert([{
          sender_id: msg.senderId,
          recipient_id: msg.recipientId,
          message: msg.message,
        }]);

        if (error) throw error;

        await this.deleteMessage(msg.id);
        console.log('[OfflineQueue] Message synced:', msg.id);
      } catch (error) {
        console.error('[OfflineQueue] Failed to sync message:', msg.id, error);
        await this.updateMessageStatus(msg.id, 'failed', msg.retryCount + 1);
      }
    }

    this.notifyListeners();
  }

  async syncBookings(): Promise<void> {
    if (!this.isOnline || this.syncInProgress) return;
    
    const { supabase } = await import('@/integrations/supabase/client');
    const bookings = await this.getPendingBookings();
    const pending = bookings.filter(b => b.status === 'pending' && b.retryCount < 3);

    for (const booking of pending) {
      try {
        await this.updateBookingStatus(booking.id, 'syncing');
        
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

        if (error) throw error;

        await this.deleteBooking(booking.id);
        console.log('[OfflineQueue] Booking synced:', booking.id);
      } catch (error) {
        console.error('[OfflineQueue] Failed to sync booking:', booking.id, error);
        await this.updateBookingStatus(booking.id, 'failed', booking.retryCount + 1);
      }
    }

    this.notifyListeners();
  }

  async syncAll(): Promise<void> {
    if (this.syncInProgress) return;
    
    this.syncInProgress = true;
    console.log('[OfflineQueue] Starting full sync');
    
    try {
      await Promise.all([
        this.syncMessages(),
        this.syncBookings(),
      ]);
      console.log('[OfflineQueue] Full sync complete');
    } finally {
      this.syncInProgress = false;
    }
  }

  // Check if we're online
  get online(): boolean {
    return this.isOnline;
  }
}

// Singleton instance
export const offlineQueue = new OfflineQueueManager();
