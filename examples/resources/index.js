/**
 * MyOpenlayers example & test helper
 */

/* global myol */

const examples = {
    intro: ' Openlayers adaptation',
    layerSwitcher: 'SLayer switcher',
    tileLayer: 'TTile layer',
    vectorLayer: 'VVector layer',
    controls: 'CControls',
    marker: 'MMarker',
    editor: 'EEditor',
    wri: 'WRefuges.info',
    wripoint: 'PPoint WRI',
    wripointmodif: 'MModif point WRI',
    wripointcree: 'CCreate point WRI',
    wrinav: 'NNav WRI',
    wrimassifedit: 'EEdit massif WRI',
    wrimassifcree: 'CCrée massif WRI',
    gps: 'GOff line GPS',
  },
  path = location.href.match(/(.*\/)[^/]*/)[1],
  exampleKeys = Object.keys(examples),
  exampleName = exampleKeys.find(k => k == location.hash.substring(1)) || exampleKeys[0];

// Title & links
let shortcuts = [],
  exampleList = [],
  memKey = exampleKeys[0],
  nextExampleKey = '';

for (const [key, value] of Object.entries(examples)) {
  if (exampleName == key && key != exampleKeys[0])
    shortcuts.push(exampleLink(memKey, 'Previous', '&#9664'));

  if (exampleName == memKey && key != exampleKeys[0])
    shortcuts.push(exampleLink(key, 'Next', '&#9654'));

  shortcuts.push(exampleLink(key, value.substring(1), value[0]));
  exampleList.push(exampleLink(key, value.substring(1), value.substring(1)));

  // Mem next example key
  if (exampleName == memKey)
    nextExampleKey = key;

  // Mem key for next loop
  memKey = key;
}

function exampleLink(key, title, text) {
  return '<a ' +
    'href="#' + key + '" ' +
    'onclick="location.hash=\'#' + key + '\';location.reload()" ' +
    'title="' + title + '">' +
    text + '</a>';
}

document.body.insertAdjacentHTML('afterbegin', [
  '<div class="header">',
  '<a href="https://github.com/Dominique92/myol/">Github &#9654;</a>',
  '<h1>' + examples[exampleName].substring(1) + '</h1>',
  exampleLink(nextExampleKey, 'Next', 'Next&#9654'),
  '<div>',
  '<span>Examples:</span>',
  exampleLink(exampleKeys[0], 'Home', '&#127968'),
  ...shortcuts,
  '</div>',
  '</div>',
].join('\n'));

// Get the example html
// Display the javascript code
['html', 'js'].forEach(type =>
  fetch(path + exampleName + '.' + type)
  .then(response => response.text())
  .then(fileContent => document.getElementById('example-' + type).innerHTML = fileContent)
  .catch(error => console.warn(error)));

//TODO ne marche pas
const exampleListEl = document.getElementById('example-list');
if (exampleListEl)
  exampleListEl.innerHTML = exampleList.join('\n');

// Execute the example script
document.body.appendChild(document.createElement('script')).src = path + exampleName + '.js';

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

myol.trace();