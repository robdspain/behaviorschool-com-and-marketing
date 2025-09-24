const CACHE_VERSION = 'v3';
const STATIC_CACHE = `static-${CACHE_VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      // Only cache strictly static assets, never the HTML shell
      return cache.addAll([
        '/manifest.json',
        '/Logos/Logo.webp'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
});

// Network-first for navigation requests (HTML) to avoid stale pages/styles
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // For navigations and HTML requests, go to network first
  const isNavigation = request.mode === 'navigate' ||
    (request.headers.get('accept') || '').includes('text/html');

  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => networkResponse)
        .catch(() => caches.match(request))
    );
    return;
  }

  // For static assets, use cache-first with fallback to network
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).then((networkResponse) => {
          // Only cache successful GET requests
          if (request.method === 'GET' && networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
      );
    })
  );
});
