/**
 * MyOpenlayers example & test helper
 */

// Analyse url & args
const urlParams = {};
let sampleName = 'index';

for (const p of new URLSearchParams(location.search))
  if (p[1])
    urlParams[p[0]] = JSON.parse(p[1]);
  else
    sampleName = p[0];

// Helper
function getText(fileName) {
  return fetch(fileName)
    .then(response => response.text())
    .then(text => text
      .replace(/<script.*vite.*script>/u, '') // Remove vite scripts tags
      .replace(/\/\*.*\*\//gu, '') // Remove /* comments */
      .replace(/\/\/#.*/u, '') // Remove //# sourceMappingURL
      .trim()
    );
}

// Populate the body
(async function() {
  document.body.insertAdjacentHTML('afterbegin', await getText('samples/' + sampleName + '.html'));
  document.body.insertAdjacentHTML('afterbegin', await getText('header.html'));

  const sampleCodeEl = document.getElementById('sample-code');
  sampleCodeEl.insertAdjacentHTML('afterbegin', await getText('samples/' + sampleName + '.js'));

  // Load & run the sample script
  const script = document.createElement('script');
  script.src = 'samples/' + sampleName + '.js';
  document.head.appendChild(script);

  // Search the sample data in the header.html & populate the tags
  const sampleEl = document.querySelector('a[href="' + (location.search || '.') + '"]');
  if (sampleEl) {
    sampleEl.style.border = '1px solid black';

    document.getElementById('sample-title').innerHTML = sampleEl.title;
    document.getElementById('sample-next').setAttribute('href', sampleEl.nextElementSibling.href);
  }

  myol.trace();
})();

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