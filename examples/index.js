/**
 * MyOpenlayers example & test helper
 */

// Include specific w3-include html & script
const sampleName = new URLSearchParams(window.location.search).get('sample') || 'index';

async function replaceIncludes() {
  const includeEls = document.body.querySelectorAll('[w3-include]');

  // Load files in parallel
  await Promise.all(Array.from(includeEls).map(async el => {
    const fileName = el.getAttribute('w3-include')
      .replace('SAMPLE', sampleName);

    // Remove attribute to do not do it several time
    el.removeAttribute('w3-include');

    if (el.tagName === 'SCRIPT') {
      const scriptEl = document.createElement('script');

      scriptEl.src = fileName;
      document.head.appendChild(scriptEl);
      //TODO wait for script load
    } else {
      await fetch(fileName)
        .then(response => response.text())
        .then(text => {
          if (el.tagName === 'LINK')
            el.outerHTML = text; // Just replace the tag
          else
            el.innerHTML = text
            .replace(/<script.*vite.*script>/u, '') // Remove vite scripts tags
            .replace(/\/\*.*\*\//gu, '') // Remove /* comments */
            .replace(/\/\/#.*/u, '') // Remove //# sourceMappingURL
            .trim();
        });

      await replaceIncludes() // Iterate recursively if any tag w3-include has been included
    }
  }));
}

// Launch actions serially
(async function() {
  // Launch recursion of tag w3-include load
  await replaceIncludes();

  // Populate the sample data in the header.html 
  const menuItemEl = document.body.querySelector('[href="' + window.location.search + '"]'),
    titleEl = document.getElementById('sample-title'),
    nextEl = document.getElementById('sample-next'),
    listEls = document.body.querySelectorAll('.sample-list');

  if (menuItemEl) {
    menuItemEl.classList.add('menu-selected');
    if (titleEl)
      titleEl.innerHTML = menuItemEl.title;
    if (nextEl && menuItemEl.nextElementSibling)
      nextEl.href = menuItemEl.nextElementSibling.href;
  }
  if (listEls.length === 2)
    listEls[1].innerHTML = listEls[0].innerHTML;
})();

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
  ign: 'ign_scan_ws',

  // SwissTopo : register your domain at
  // https://shop.swisstopo.admin.ch/fr/products/geoservice/swisstopo_geoservices/WMTS_info

  // https://osdatahub.os.uk/
  os: 'P8MjahLAlyDAHXEH2engwXJG6KDYsVzF',
};