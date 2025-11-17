/* global ol, myol */

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

  return tiledExtents;
}

/* eslint-disable-next-line no-unused-vars */
const map = new ol.Map({
  target: 'map',

  view: new ol.View({
    center: ol.proj.transform([5.7, 45.2], 'EPSG:4326', 'EPSG:3857'), // Grenoble
    constrainResolution: true, // Force zoom on the definition of available tiles
    zoom: 11,
  }),

  controls: [
    new ol.control.Zoom(),
    new ol.control.FullScreen(),
    new ol.control.ScaleLine(),
  ],

  layers: [
    // Background layer
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),

    // Vector layers
    new myol.layer.vector.WRI({
      strategy: tiledBboxStrategy,
      debug: true,
    }),

    // Hover & click management (mouse & touch)
    new myol.layer.Hover(),
  ],
});