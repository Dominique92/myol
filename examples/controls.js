/* global ol, myol */

var map = new ol.Map({
  target: 'map',
  controls: [
    ...myol.control.collection(),
    new myol.control.Button({ // Help
      label: '?',
      subMenuId: 'myol-button-help',
    }),
    new myol.control.Permalink({
      display: true,
      init: true,
    }),
  ],
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
    new ol.layer.Vector({
      source: new ol.source.Vector({
        url: 'images/features.geojson',
        format: new ol.format.GeoJSON(),
      }),
    }),
  ],
});