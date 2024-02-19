/**
 * MyOpenlayers example & test helper
 */

const exampleName = location.search.substring(1) || 'index',
  base = location.href.match(/(.*\/)[^/]*/)[1];

// Fill an element with the content of the file defined in data-file="FILE_NAME"
document.querySelectorAll('[data-file*="example"]') // Replace example by url?query
  .forEach(el =>
    fetch(base + el.dataset.file.replace('example', exampleName))
    .then(response => response.text())
    .then(fileContent =>
      el.innerHTML = el.tagName == 'PRE' ?
      fileContent.split('§').pop().trim() : // Start after the first §
      fileContent
    )
  );

// Default keys for development only
/* eslint-disable-next-line no-unused-vars */
var mapKeys = {
  bing: 'AldBMbaKNyat-j6CBRKxxH05uaxP7dvQu1RnMWCQEGGC3z0gjBu-bLniE_8WZvcC',
  //https://www.microsoft.com/en-us/maps/create-a-bing-maps-key
  ign: 'iejxbx4obzhco6c8klxrfbto',
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