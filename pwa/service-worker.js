// Create/install cache
self.addEventListener('install', evt => {
  console.info('PWA install');

  //self.skipWaiting(); // Immediately activate the SW & trigger controllerchange

  const cacheName = 'myWRI1';

  caches.delete(cacheName)
    .then(console.info('PWA ' + cacheName + ' deleted'))
    .catch(error => console.error(error));

  evt.waitUntil(
    caches.open(cacheName)
    .then(cache => {
      console.info('PWA open cache ' + cacheName);
      cache.addAll([
          'index.html',
          'manifest.json',
          'service-worker.js',
          'favicon.svg',
        ])
        .then(console.info('PWA files added to cache'))
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error))
  );
});

// Provides the required files
// Cache first, then browser cache, then network
self.addEventListener('fetch', evt => {
  console.info('PWA fetch ' + evt.request.url);
  evt.respondWith(
    caches.match(evt.request)
    .then(found => found || fetch(evt.request))
    .catch(error => console.error(error + ' ' + evt.request.url))
  )
});