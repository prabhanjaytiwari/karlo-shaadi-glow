// Service Worker for Push Notifications and Offline Support
const CACHE_NAME = 'karlo-shaadi-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/app-icon.png',
  '/manifest.json'
];

// Cache strategies
const CACHE_STRATEGIES = {
  cacheFirst: ['image', 'font', 'style'],
  networkFirst: ['document', 'script'],
  staleWhileRevalidate: ['fetch']
};

// Install event - cache static assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(keys => {
        return Promise.all(
          keys
            .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map(key => caches.delete(key))
        );
      })
      .then(() => clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', function(event) {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and external requests
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }

  // Skip API calls - always fetch from network
  if (url.pathname.startsWith('/api') || url.pathname.includes('supabase')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return cached response if available
        if (cachedResponse) {
          // Fetch fresh version in background for next time
          event.waitUntil(
            fetch(request)
              .then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                  caches.open(DYNAMIC_CACHE)
                    .then(cache => cache.put(request, networkResponse.clone()));
                }
              })
              .catch(() => {})
          );
          return cachedResponse;
        }

        // No cache, fetch from network
        return fetch(request)
          .then(networkResponse => {
            // Cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(request, responseToCache));
            }
            return networkResponse;
          })
          .catch(() => {
            // Return offline fallback for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/');
            }
            return new Response('Offline', { status: 503, statusText: 'Offline' });
          });
      })
  );
});

// Push notification handler
self.addEventListener('push', function(event) {
  const options = {
    body: 'You have a new notification',
    icon: '/app-icon.png',
    badge: '/app-icon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      url: '/'
    },
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  if (event.data) {
    try {
      const data = event.data.json();
      options.body = data.body || options.body;
      options.data.url = data.url || '/';
      options.tag = data.tag || 'default';
      
      event.waitUntil(
        self.registration.showNotification(data.title || 'Karlo Shaadi', options)
      );
    } catch (e) {
      event.waitUntil(
        self.registration.showNotification('Karlo Shaadi', {
          ...options,
          body: event.data.text()
        })
      );
    }
  } else {
    event.waitUntil(
      self.registration.showNotification('Karlo Shaadi', options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', function(event) {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
  
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
  
  if (event.tag === 'sync-bookings') {
    event.waitUntil(syncBookings());
  }
});

async function syncData() {
  console.log('[SW] Syncing all offline data...');
  await Promise.all([syncMessages(), syncBookings()]);
}

async function syncMessages() {
  console.log('[SW] Syncing offline messages...');
  // Notify the client to sync messages
  const clients = await self.clients.matchAll({ type: 'window' });
  clients.forEach(client => {
    client.postMessage({ type: 'SYNC_MESSAGES' });
  });
}

async function syncBookings() {
  console.log('[SW] Syncing offline bookings...');
  // Notify the client to sync bookings
  const clients = await self.clients.matchAll({ type: 'window' });
  clients.forEach(client => {
    client.postMessage({ type: 'SYNC_BOOKINGS' });
  });
}

// Message handler for cache management
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
    );
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then(cache => cache.addAll(event.data.urls))
    );
  }
  
  // Trigger background sync when requested
  if (event.data && event.data.type === 'TRIGGER_SYNC') {
    if ('sync' in self.registration) {
      event.waitUntil(
        self.registration.sync.register('sync-data')
          .then(() => console.log('[SW] Sync registered'))
          .catch(err => console.error('[SW] Sync registration failed:', err))
      );
    } else {
      // Fallback: sync immediately
      event.waitUntil(syncData());
    }
  }
});
