/* global ol, myol */

document.getElementById('example-title').innerHTML = 'Controls';
document.getElementById('example-next').href = '?marker';

/* eslint-disable-next-line no-unused-vars */
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
      background: 'transparent',
      source: new ol.source.Vector({
        url: 'images/features.geojson',
        format: new ol.format.GeoJSON(),
      }),
    }),
  ],
});