/* global ol, myol */

var snaplayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'resources/switzerland.geojson',
      format: new ol.format.GeoJSON(),
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke(),
    }),
  }),
  editorLayer = new myol.layer.Editor({
    geoJsonId: 'geojson',
  }),

  /* eslint-disable-next-line no-unused-vars */
  map = new ol.Map({
    target: 'map',
    controls: [
      new ol.control.Zoom(),
      new myol.control.MyGeocoder(),
      new myol.control.MyGeolocation(),
      new myol.control.Load({
        receivingLayer: editorLayer,
      }),
      new myol.control.Download({
        savedLayer: editorLayer,
      }),
      new myol.control.Print(),
    ],
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
      snaplayer,
      editorLayer,
    ],
  });