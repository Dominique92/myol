/* global ol, myol */

document.getElementById('example-title').innerHTML = 'Layer switcher';
document.getElementById('example-next').href = '?tileLayer'; //§

var baseLayers = {
    'OSM org': new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
    'Positron': new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: 'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
      }),
    }),
    'Hidden': new ol.layer.Tile({
      hidden: true,
    }),
    'Null': null,
  },
  countries = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'resources/switzerland.geojson',
      format: new ol.format.GeoJSON(),
    }),
    zIndex: 2, // Above the base layer
  }),

  /* eslint-disable-next-line no-unused-vars */
  map = new ol.Map({
    target: 'map',
    view: new ol.View({
      center: ol.proj.transform([4, 47], 'EPSG:4326', 'EPSG:3857'), // France + Swiss
      zoom: 5,
    }),
    controls: [
      new myol.control.LayerSwitcher({
        layers: baseLayers,
        selectExtId: 'select-ext',
      }),
      new ol.control.Attribution({
        collapsed: false,
      }),
    ],
    layers: [countries],
  });

document.getElementById('toggle-countries')
  .addEventListener('click', evt =>
    countries.setVisible(evt.target.checked)
  );