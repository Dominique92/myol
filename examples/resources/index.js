/**
 * MyOpenlayers demo & test helper
 */

/* global myol */

const projects = {
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
  projectKeys = Object.keys(projects),
  projectName = projectKeys.find(k => k == location.hash.substring(1)) || projectKeys[0],
  nextProjectKey = projectKeys[projectKeys.findIndex(v => v == projectName) + 1],
  shortcuts = [];

// Title & links
let lpk = projectKeys[0];
for (const [key, value] of Object.entries(projects)) {
  if (projectName == key && key != projectKeys[0]) {
    shortcuts.push(
      '<a href="#' + lpk + '" ' +
      'onclick="location.hash=\'#' + lpk + '\';location.reload()" ' +
      'title="previeous">&#9664;</a>'
    );
  }
  if (projectName == lpk && key != projectKeys[0]) {
    shortcuts.push(
      '<a href="#' + key + '" ' +
      'onclick="location.hash=\'#' + key + '\';location.reload()" ' +
      'title="next">&#9654;</a>'
    );
  }
  shortcuts.push(
    '<a href="#' + key + '" ' +
    'onclick="location.hash=\'#' + key + '\';location.reload()" ' +
    'title="' + value.substring(1) + '">' +
    value[0] + '</a>'
  );
  lpk = key;
}

document.body.insertAdjacentHTML('afterbegin', [
  '<a style="float:right" href="https://github.com/Dominique92/myol/">Github &#9654;</a>',
  '<h1>' + projects[projectName].substring(1) + '</h1>',
  '<a style="float:right" href="#' + nextProjectKey + '" ' +
  'onclick="location.hash=\'#' + nextProjectKey + '\';location.reload()">Next &#9654;</a>',
  '<div class="shortcuts">',
  '<span>Demos:</span>',
  '<a href="#intro" onclick="location.hash=\'#intro\';location.reload()" title="Home">&#127968;</a>',
  ...shortcuts,
  '</div>',
  '<hr/>',
].join('\n'));

// Get the project html
// Display the javascript code
['html', 'js'].forEach(type =>
  fetch(path + projectName + '.' + type)
  .then(response => response.text())
  .then(fileContent => document.getElementById('project-' + type).innerHTML = fileContent)
  .catch(error => console.warn(error)));

// Execute the project script
document.body.appendChild(document.createElement('script')).src = path + projectName + '.js';

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