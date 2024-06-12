/**
 * MyOpenlayers example & test helper
 */

// Include specific w3-include html & script
const sampleName = new URLSearchParams(window.location.search).get('sample') || 'index',
  scriptEl = document.createElement('script');

async function replaceIncludes() {
  const includeEls = document.body.querySelectorAll('[w3-include]');

  // Load files in parallel
  await Promise.all(Array.from(includeEls).map(async el => {
    const fileName = el.getAttribute('w3-include')
      .replace('SAMPLE', sampleName);

    el.removeAttribute('w3-include'); // Remove attribute to do not do it several time

    if (el.tagName === 'SCRIPT') {
      scriptEl.type = 'text/javascript';
      scriptEl.src = fileName;
      document.head.appendChild(scriptEl);
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
  const menuItemEl = document.body.querySelector('[href*="' + sampleName + '"]'),
    titleEl = document.getElementById('sample-title'),
    nextEl = document.getElementById('sample-next'),
    listEls = document.body.querySelectorAll('.sample-list');



  if (menuItemEl) {
    menuItemEl.classList.add('menu-selected');
    if (titleEl)
      titleEl.innerHTML = menuItemEl.title;
    if (nextEl)
      nextEl.href = menuItemEl.nextElementSibling.href;
  }
  if (listEls.length === 2)
    listEls[1].innerHTML = listEls[0].innerHTML;
})();

myol.trace();


// Default keys for development only
/* eslint-disable-next-line no-unused-vars */
const mapKeys = {
  bing: 'AldBMbaKNyat-j6CBRKxxH05uaxP7dvQu1RnMWCQEGGC3z0gjBu-bLniE_8WZvcC',
  //https://www.microsoft.com/en-us/maps/create-a-bing-maps-key
  ign: 'ry2ju17rbtmlujviy8njbv5i',
  // https://geoservices.ign.fr/
  kompass: '2ba8c124-38b6-11e7-ade1-e0cb4e28e847',
  // https://manage.thunderforest.com/dashboard
  mapbox: 'pk.eyJ1IjoiZG9taW5pcXVlOTIiLCJhIjoiY2xtOWprMmZmMGcwejNlbzVvOTl3dmt2eSJ9.B9IsLuXTDBarbCY4_YTIrQ',
  // http://www.kompass.de/livemap/
  maptiler: 'YiOqxKkIAWZyREPRjd7d',
  // https://www.mapbox.com/
  os: 'P8MjahLAlyDAHXEH2engwXJG6KDYsVzF',
  // https://osdatahub.os.uk/
  // SwissTopo : register your domain
  // https://shop.swisstopo.admin.ch/fr/products/geoservice/swisstopo_geoservices/WMTS_info
  thunderforest: 'ee751f43b3af4614b01d1bce72785369',
  // https://www.mapbox.com/
};