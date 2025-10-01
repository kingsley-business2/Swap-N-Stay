// ========================== public/service-worker.js (NEW) ==========================
const CACHE_NAME = 'swapnstay-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // ⚠️ Ensure you place your icons in public/icons/
  '/icons/icon-192x192.png', 
  '/icons/icon-512x512.png',
  // Add other critical assets here
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
