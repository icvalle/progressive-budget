const FILES_TO_CACHE = [
    "/",
    "index.html",
    "assets/styles/styles.css",
    "assets/js/index.js",
    "assets/js/db.js",
    "manifest.webmanifest",
    "icons/icon-192x192.png",
    "icons/icon-512x512.png",
    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.url.includes("/api/")) {
        event.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(event.request)
            .then(response => {
              if (response.status === 200) {
                cache.put(event.request.url, response.clone());
              }
  
              return response;
            })
            .catch(err => {
              return cache.match(event.request);
            });
        }).catch(err => console.log(err))
      );
  
      return;
    }

  // use cache first for all other requests for performance
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // request is not in cache. make network request and cache the response
      return caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(event.request).then(response => {
          return cache.put(event.request, response.clone()).then(() => {
            return response;
          });
        });
      });
    })
  );
});