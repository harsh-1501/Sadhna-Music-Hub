/* ========================================================
   SADHNA MUSIC HUB - SERVICE WORKER
   Made with ❤️ by Sadhna
   Enables offline functionality
======================================================== */

const CACHE_NAME = "sadhna-music-v1";
const urlsToCache = [
  "./index (3).html",
  "./styles.css",
  "./script.js",
  "./manifest.json",
  "./Sd1811.png",
  "./Sd1811.png",
  "./Sd1811.png"
];

/* Install Service Worker */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

/* Fetch from cache */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

/* Activate and clean old caches */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});