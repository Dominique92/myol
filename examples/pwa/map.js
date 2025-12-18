/* global ol, myol */
/* eslint-disable no-unused-vars */ //TODO REMOVE

// Strategy for loading elements based on fixed tile grid
// lon:2°=157km, lat:1°=111km
function tiledBboxStrategy(extent, resolution) {
  const extent4326 = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326'),
    tiledExtents = [];

  if (resolution > 100)
    return [ol.proj.transformExtent([-180, -90, 180, 90], 'EPSG:4326', 'EPSG:3857')]; // Full world

  for (let lon = Math.floor(extent4326[0] / 2) * 2 - 2; lon < Math.ceil(extent4326[2] / 2) * +2; lon += 2)
    for (let lat = Math.floor(extent4326[1]) - 1; lat < Math.ceil(extent4326[3]) + 1; lat++)
      tiledExtents.push(
        ol.proj.transformExtent([lon, lat, lon + 2, lat + 1], 'EPSG:4326', 'EPSG:3857')
      );

  console.info(
    'Request ' + tiledExtents.length +
    ' tile' + (tiledExtents.length > 1 ? 's' : '') +
    ' extent=[' + extent4326.join(',') + '] for ' +
    Math.round(resolution) + 'm/px resolution '
  );

  return tiledExtents;
}

const points = new myol.layer.vector.WRI({
    strategy: tiledBboxStrategy,
    debug: true,
  }),
  baselayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
  }),
  view = new ol.View({
    center: ol.proj.transform([5.7, 45.2], 'EPSG:4326', 'EPSG:3857'), // Grenoble
    constrainResolution: true, // Force zoom on the definition of available tiles
    zoom: 8,
  }),
  map = new ol.Map({
    target: 'map',
    view: view,

    controls: [
      new ol.control.Zoom(),
      new ol.control.FullScreen(),
      new ol.control.ScaleLine(),
    ],

    layers: [
      baselayer,
      points,
      new myol.layer.Hover(),
    ],
  }),
  baselayerTileGrid = baselayer.getSource().getTileGrid();

myol.traces({
  files: true,
});

view.on('change', evt => {
  myol.traces({
    files: true,
  });
});