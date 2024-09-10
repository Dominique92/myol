/* global myol */

import ol from '../../src/ol'; // Part of Openlayers functions used in myol
import Edit from '../../src/layer/Edit.js';

const snaplayer = new ol.layer.Vector({
    background: 'transparent',
    source: new ol.source.Vector({
      url: 'images/switzerland.geojson',
      format: new ol.format.GeoJSON(),
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke(),
    }),
  }),

  editorLayer = new Edit({
    geoJsonId: 'geojson',
  }),

  /* eslint-disable-next-line no-unused-vars */
  map = new ol.Map({
    target: 'map',

    controls: myol.control.collection(),

    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
      snaplayer,
      editorLayer,
    ],

    view: new ol.View({ //TODO REPLACE BY ?
      center: ol.proj.fromLonLat([5, 46.5]),
      zoom: 6.4,
    }),
  });