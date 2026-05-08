const ASSET_CACHE = "portfolio-assets-v1";
const STATIC_CACHE = "portfolio-static-v1";
const CACHE_NAMES = new Set([ASSET_CACHE, STATIC_CACHE]);
const FINGERPRINTED_ASSET_PATTERN = /^\/(?:css|js)\/[^/]+\.[a-f0-9]{64}\.(?:css|js)$/;
const STATIC_ASSET_PATTERN = /^\/(?:favicon\/|img\/|vendor\/webfonts\/|.*\.(?:gif|jpe?g|pdf|png|svg|webp|woff2)$)/;

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys()
        .then((cacheNames) => Promise.all(
          cacheNames
            .filter((cacheName) => !CACHE_NAMES.has(cacheName))
            .map((cacheName) => caches.delete(cacheName)),
        )),
      self.clients.claim(),
    ]),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin || request.mode === "navigate" || request.destination === "document") {
    return;
  }

  if (FINGERPRINTED_ASSET_PATTERN.test(url.pathname)) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  if (STATIC_ASSET_PATTERN.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
  }
});

const cacheFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(request);

  if (isCacheable(response)) {
    await cache.put(request, response.clone());
  }

  return response;
};

const staleWhileRevalidate = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  const networkResponse = fetch(request)
    .then(async (response) => {
      if (isCacheable(response)) {
        await cache.put(request, response.clone());
      }

      return response;
    })
    .catch(() => cachedResponse);

  return cachedResponse || networkResponse;
};

const isCacheable = (response) =>
  response.ok && (response.type === "basic" || response.type === "default");
