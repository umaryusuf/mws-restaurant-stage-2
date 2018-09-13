const staticCacheName = 'restaurant-2';
const resourcesToCache = [
  'index.html',
  'restaurant.html',
  'css/styles.css',
  'data/restaurants.json',
  'js/dbhelper.js',
  'js/restaurant_info.js',
  'js/main.js',
  'img/1.jpg',
  'img/2.jpg',
  'img/3.jpg',
  'img/4.jpg',
  'img/5.jpg',
  'img/6.jpg',
  'img/7.jpg',
  'img/8.jpg',
  'img/9.jpg',
  'img/10.jpg',
  'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
  '//normalize-css.googlecode.com/svn/trunk/normalize.css'
];

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('restaurant-') && cacheName !== staticCacheName;
        }).map(cacheName => {
          return caches.delete(cacheName);
        }),
      );
    }),
  );
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll(resourcesToCache);
    })
  );
});

/*
* checks for a request in cache, return response if found
* or
* request resource from the network and save it into
* the cache, so the later request for that resource
* could be retrieved offline
*/
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(response => {
      return response || fetch(event.request).then(res => {
        return caches.open(staticCacheName).then(cache => {
          cache.put(event.request, res.clone());
          return res;
        })
      });
    })
  );
});
