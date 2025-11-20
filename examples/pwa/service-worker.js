  const cacheName = 'myWRI';

  // Create/install cache
  self.addEventListener('install', evt => {
    console.info('PWA install');

    //self.skipWaiting(); // Immediately activate the SW & trigger controllerchange

    caches.delete(cacheName)
      .then(console.info('PWA ' + cacheName + ' deleted'))
      .catch(error => console.error(error));

    evt.waitUntil(
      caches.open(cacheName)
      .then(cache => {
        console.info('PWA open cache ' + cacheName);
        cache.addAll([
            'index.php',
            'index.css',
            'manifest.json',
            'service-worker.js',
            'map.js',
            'favicon.svg',
            'favicon.sgv.php',
            'favicon.sgv.php?expire=120',
            // lon:2°=157km,lat:1°=111km
            'https://www.refuges.info/api/bbox?&nb_points=all&bbox=5,45,7,46',
            'https://www.refuges.info/api/bbox?&nb_points=all&cluster=0.1',
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

    evt.waitUntil(
      caches.open('myWRI')
      .then(cache => {
        //console.info('***' + evt.request.url);
        cache.add('https://tile.openstreetmap.org/8/132/92.png');
      })
    );

    evt.respondWith(
      caches.match(evt.request)
      .then(found => {
        //*DCMM*/console.log(found);
        //*DCMM*/console.log(fetch(evt.request));
        return found || fetch(evt.request);
      })
      .catch(error => console.error(error + ' ' + evt.request.url))
    );
  });

  // https://blog.bitsrc.io/5-service-worker-caching-strategies-for-your-next-pwa-app-58539f156f52
  /* Cache first
  self.addEventListener('fetch', function (event) {
      event.respondWith(
          caches.open(cacheName)
              .then(function(cache) {
                  cache.match(event.request)
                      .then( function(cacheResponse) {
                          if(cacheResponse)
                              return cacheResponse
                          else
                              return fetch(event.request)
                                  .then(function(networkResponse) {
                                      cache.put(event.request, networkResponse.clone())
                                      return networkResponse
                                  })
                      })
              })
      )
  });
  */

  /* Network First
  self.addEventListener(’fetch’, function (event) {
      event.respondWith(
          fetch(event.request).catch(function() {
              return caches.match(event.request)
          })
      )
  });
  */