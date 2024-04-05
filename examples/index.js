/**
 * MyOpenlayers example & test helper
 */

// Analyse url & args
const base = location.href.match(/([^?]*\/)[^/]*/)[1],
  urlParams = {};
let sampleLink = 'index';

for (const p of new URLSearchParams(location.search))
  if (p[1])
    urlParams[p[0]] = p[1];
  else
    sampleLink = p[0];

// Fill html sample specific
/*//TODO
const sampleEl=
document.getElementById('sampleList')
.querySelectorAll('[href*="'+location.search+'"]')[0] ; 

  document.getElementById('item-next').href = sampleEl
  .nextElementSibling
  .getAttribute('href');

  document.getElementById(sampleEl.id).style.border = '1px solid black';
  document.getElementById('item-title').innerHTML = 'WRI '+sampleEl.title;
*/

// Fill an element with the content of the file defined in data-file="FILE_NAME"
document.querySelectorAll('[data-file*="ITEM"]') // Replace ITEM by url?query
  .forEach(el =>
    fetch(base + el.dataset.file.replace('ITEM', sampleLink))
    .then(response => response.text())
    .then(fileContent => el.innerHTML = fileContent
      .replace(/\/\*.*\*\//, '') // Remove /* comments */
      .replace(/\/\/#.*/, '') // remove //# sourceMappingURL
      .trim()
    )
  );

// Default keys for development only
/* eslint-disable-next-line no-unused-vars */
var mapKeys = {
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

/* global myol */
myol.trace();