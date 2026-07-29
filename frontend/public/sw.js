const CACHE_NAME = 'offline-learning-hub-v4';
const API_CACHE_NAME = 'offline-learning-hub-api-v4';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
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
          if (cache !== CACHE_NAME && cache !== API_CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event Handler
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Exclude non-GET requests and heavy video download/stream binaries (handled via browser native range requests & IndexedDB)
  if (event.request.method !== 'GET') {
    return;
  }

  if (
    url.pathname.includes('/stream') || 
    url.pathname.includes('/download') || 
    url.pathname.includes('/uploads/videos/') ||
    url.pathname.includes('/uploads/')
  ) {
    return;
  }

  // Handle Backend API catalog requests (/videos) with Stale-While-Revalidate strategy
  if (url.pathname.includes('/videos')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // Offline fallback: Serve cached video catalog list if network is unavailable
            return cache.match(event.request, { ignoreSearch: true });
          });
      })
    );
    return;
  }

  // Handle HTML navigation requests
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            return networkResponse;
          }
          return caches.match('/index.html').then((htmlMatch) => htmlMatch || caches.match('/'));
        })
        .catch(() => {
          return caches.match('/index.html').then((htmlMatch) => htmlMatch || caches.match('/'));
        })
    );
    return;
  }

  // Standard Static Assets (JS, CSS, SVG, Fonts, Vite dev files) Strategy: Cache-First + Dynamic Cache
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        // If online, update cache in background (Stale-While-Revalidate)
        if (navigator.onLine) {
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
              }
            })
            .catch(() => {/* Ignore background revalidation failure */});
        }
        return cachedResponse;
      }

      // If asset is not cached yet, fetch from network and dynamically store in cache
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
        .catch((err) => {
          console.warn('[SW] Asset fetch failed offline:', event.request.url);
          return caches.match(event.request, { ignoreSearch: true });
        });
    })
  );
});



