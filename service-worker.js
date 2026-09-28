// Stocked service worker: saves the app files on the phone so it opens offline.
const CACHE = "stocked-v1";                       // change this name (stocked-v2...) when you update the app
const FILES = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", e => {          // first visit: store all the files
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {         // remove old versions of the cache
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {            // every request: try the saved copy first, then the internet
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
