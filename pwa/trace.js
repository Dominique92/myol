/**
 * Display misc values
 */
async function trace() {
  const data = [];

  // Storages in the subdomain
  ['localStorage', 'sessionStorage'].forEach(s => {
    if (window[s].length)
      data.push(s + ':');

    Object.keys(window[s])
      .forEach(k => data.push('  ' + k + ': ' + window[s].getItem(k)));
  });

  // Registered service workers in the scope
  if ('serviceWorker' in navigator)
    await navigator.serviceWorker.getRegistrations().then(registrations => {
      if (registrations.length) {
        data.push('service-workers:');

        for (const registration of registrations)
          if (registration.active)
            data.push('  ' + registration.active.scriptURL);
      }
    });

  // Registered caches in the scope
  if (typeof caches === 'object')
    await caches.keys().then(names => {
      if (names.length) {
        data.push('caches:');
        for (const name of names) {
          data.push('CACHE ' + name);

          //TODO attendre la fin du calcul
          caches
            .open(name)
            .then(cache => cache.keys())
            .then(keys => {
              keys.forEach(request => {
                data.push('CACHE:' + name + ' FILE:' + request.url);
              });
            });
        }
      }
    });

  //if(0)//Pour attendre la fin du calcul :(
  if (typeof caches === 'object')
    await caches
    .open("myWRI1")
    .then(cache => cache.keys())
    .then(keys => {
      keys.forEach(request => {
        //    data.push('FILE ' + request.url);
      });
    });

  // Log all the traces
  console.info(data.join('\n'));
}
trace();