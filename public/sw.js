// Service Worker for Push Notifications
self.addEventListener('push', function(event) {
  const options = {
    body: 'You have a new notification',
    icon: '/favicon.png',
    badge: '/favicon.png',
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

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});
