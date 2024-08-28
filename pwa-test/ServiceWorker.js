const cacheName = "DefaultCompany-Arrow Race-1.2";
const contentToCache = [
    "Build/game.loader.js",
    "Build/game.framework.js",
    "Build/game.data",
    "Build/game.wasm",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((currentCacheName) => {
            if (currentCacheName !== cacheName) {
              console.log('[Service Worker] Removing old cache:', currentCacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })

      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((currentCacheName) => {
          if (currentCacheName !== cacheName) {
            console.log('[Service Worker] Removing old cache:', currentCacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});