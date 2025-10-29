const CACHE_NAME = 'bsw-static-v2';
const STATIC_ASSETS = [
  '/manifest.json',
  '/Logos/Logo.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try { await cache.addAll(STATIC_ASSETS); } catch (_) { /* no-op */ }
      self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
      self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Never serve cached HTML or JS; avoids stale bundles that break Webpack runtime
  const dest = req.destination;
  const isNav = req.mode === 'navigate' || dest === 'document';
  const isScriptOrStyle = dest === 'script' || dest === 'style';
  // Never intercept admin routes
  let isAdmin = false;
  try { isAdmin = new URL(req.url).pathname.startsWith('/admin'); } catch (_) {}

  if (isNav || isScriptOrStyle || isAdmin) {
    return; // default network behavior
  }

  // Cache-first for small static assets (images, icons)
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const resClone = res.clone();
        // Only cache GET same-origin successful responses
        try {
          const isGet = req.method === 'GET';
          const sameOrigin = new URL(req.url).origin === self.location.origin;
          if (isGet && sameOrigin && res.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone)).catch(() => {});
          }
        } catch (_) { /* no-op */ }
        return res;
      }).catch(() => cached || Promise.reject());
    })
  );
});
