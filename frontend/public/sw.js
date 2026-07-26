const CACHE_NAME = 'offline-learning-hub-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event: Pre-cache core static application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event: Immediately claim clients & clean up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Cache-First with Stale-While-Revalidate for zero-latency offline loading
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Exclude non-GET requests and backend video API / streaming endpoints
  if (
    event.request.method !== 'GET' || 
    url.pathname.includes('/videos') || 
    url.pathname.includes('/stream') || 
    url.pathname.includes('/download')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. If cached asset exists, return it immediately (Works 100% Offline)
      if (cachedResponse) {
        // If online, update cache in background (Stale-While-Revalidate)
        if (navigator.onLine) {
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
              }
            })
            .catch(() => {/* Ignore background revalidation failure */});
        }
        return cachedResponse;
      }

      // 2. If asset is not in cache yet, fetch from network and cache it
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // 3. Network failed & asset not directly matched: Fallback for page navigation (Hard refresh / reload offline)
          if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html').then((htmlMatch) => {
              return htmlMatch || caches.match('/');
            });
          }
        });
    })
  );
});


