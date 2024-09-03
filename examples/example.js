/**
 * MyOpenlayers example & test helper
 */

// Include specific w3-include html & script
async function replaceIncludes() {
  // Process the tags one after the other
  const firstIncludeEl = document.body.querySelector('[w3-include]');

  if (firstIncludeEl) {
    const firstIncludeName = firstIncludeEl.getAttribute('w3-include')
      .replace('SAMPLE',
        new URLSearchParams(window.location.search).get('sample') || 'index'
      );

    // Remove attribute to do not do it several time
    firstIncludeEl.removeAttribute('w3-include');

    if (firstIncludeEl.tagName === 'SCRIPT') {
      const scriptEl = document.createElement('script');

      // Wait for script load	 
      scriptEl.addEventListener('load', async () => {
        await replaceIncludes(); // Iterate recursively if any tag w3-include has been included
      });
      scriptEl.src = firstIncludeName;
      document.head.appendChild(scriptEl);
    } else {
      await fetch(firstIncludeName)
        .then(response => response.text())
        .then(async (text) => {
          if (firstIncludeEl.tagName === 'LINK')
            firstIncludeEl.outerHTML = text; // Just replace the tag
          else
            // Display js code
            firstIncludeEl.innerHTML = text
            .replace(/<script.*vite.*script>/u, '') // Remove vite scripts tags
            .replace(/\/\*.*\*\//gu, '') // Remove /* comments */
            .replace(/\/\/#.*/u, '') // Remove //# sourceMappingURL
            .trim();

          await replaceIncludes(); // Iterate recursively if any tag w3-include has been included
        });
    }
  }
}

// Launch actions serially
(async function actionsTest() {
  await replaceIncludes()
    .then(() => {
      // Populate the sample data in the header.html
      //TODO don't work for 1st index WRI
      const args = window.location.search || '?sample=index',
        menuItemEl = document.body.querySelector('[href="' + args + '"]'),
        titleEl = document.getElementById('sample-title'),
        nextEl = document.getElementById('sample-next');

      if (menuItemEl) {
        menuItemEl.classList.add('menu-selected');
        if (titleEl)
          titleEl.innerHTML = menuItemEl.title;
        if (nextEl && menuItemEl.nextElementSibling)
          nextEl.href = menuItemEl.nextElementSibling.href;
      }
    });
})();

/* global myol */
myol.trace();


// Default keys for development only
/* eslint-disable-next-line no-unused-vars */
const mapKeys = {
  // https://manage.thunderforest.com/dashboard
  thunderforest: 'ee751f43b3af4614b01d1bce72785369',

  // http://www.kompass.de/livemap/
  kompass: '2ba8c124-38b6-11e7-ade1-e0cb4e28e847',

  // https://www.mapbox.com/
  maptiler: 'YiOqxKkIAWZyREPRjd7d',
  mapbox: 'pk.eyJ1IjoiZG9taW5pcXVlOTIiLCJhIjoiY2xtOWprMmZmMGcwejNlbzVvOTl3dmt2eSJ9.B9IsLuXTDBarbCY4_YTIrQ',

  //https://www.microsoft.com/en-us/maps/create-a-bing-maps-key
  bing: 'AldBMbaKNyat-j6CBRKxxH05uaxP7dvQu1RnMWCQEGGC3z0gjBu-bLniE_8WZvcC',

  // https://geoservices.ign.fr/
  //TODO private key when available at // https://geoservices.ign.fr/actualites/2023-11-20-acces-donnesnonlibres-gpf
  //TODO new keys at : https://cartes.gouv.fr
  ign: 'ign_scan_ws',

  // SwissTopo : register your domain at
  // https://shop.swisstopo.admin.ch/fr/products/geoservice/swisstopo_geoservices/WMTS_info

  // https://osdatahub.os.uk/
  os: 'P8MjahLAlyDAHXEH2engwXJG6KDYsVzF',
};