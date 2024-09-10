import ol from '../../src/ol';
import Load from '../../src/control/Load';
import Edit from '../../src/layer/Edit.js';

const snaplayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'images/switzerland.geojson',
      format: new ol.format.GeoJSON(),
    }),
  }),

  editorLayer = new Edit(),

  /* eslint-disable-next-line no-unused-vars */
  map = new ol.Map({
    target: 'map',

    controls: [
      new Load(),
    ],

    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
      snaplayer,
      editorLayer,
    ],

    view: new ol.View({
      center: ol.proj.fromLonLat([5, 46.5]),
      zoom: 6.4,
    }),
  });