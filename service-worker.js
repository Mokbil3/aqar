const CACHE_NAME = "aqar-cache-v1";
const urlsToCache = [
  "/index.html",
  "/properties.html",
  "/css/index.css",
  "/js/index.js",
  "/js/nav-auth.js",
  "/icon-192.png",
  "/icon-512.png"
];

// Install: cache the core files
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache.map(function(url){
        return new Request(url, { cache: "reload" });
      })).catch(function(err){
        // If any single file fails (e.g. doesn't exist), don't block install
        console.warn("Some files could not be cached:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name){
          return name !== CACHE_NAME;
        }).map(function(name){
          return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: try network first, fall back to cache if offline
self.addEventListener("fetch", function(event) {
  // Only handle GET requests for our own site, skip API calls
  if (event.request.method !== "GET" || event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(function() {
        return caches.match(event.request);
      })
  );
});
