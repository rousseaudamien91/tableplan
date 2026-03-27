/* TableMaître Service Worker - PWA offline support */
const CACHE_NAME = 'tablemaître-v1';
const STATIC_ASSETS = [
  '/',
  '/static/js/main.js',
  '/favicon.ico',
  '/manifest.json'
];

// Installation : mise en cache des assets statiques
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(['/']);
    })
  );
  self.skipWaiting();
});

// Activation : suppression des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch : réseau d'abord, cache en fallback
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('firestore') || event.request.url.includes('googleapis')) return;
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Notifications push (pour rappels J-7)
self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'TableMaître', {
      body: data.body || 'Rappel de votre événement',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.tag || 'tablemaître',
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || '/'));
});
