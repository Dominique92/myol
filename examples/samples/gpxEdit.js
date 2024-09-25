import ol from '../../src/ol';
import Load from '../../src/control/Load';
import LengthLine from '../../src/control/LengthLine';
import MyMousePosition from '../../src/control/MyMousePosition';
import GpxEdit from '../../src/layer/GpxEdit.js';

const snaplayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'datas/switzerland.geojson',
      format: new ol.format.GeoJSON(),
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'black',
      }),
    }),
  }),

  editorLayer = new GpxEdit({
    editPoly: true,
    withHoles: true,
  }),

  /* eslint-disable-next-line no-unused-vars */
  map = new ol.Map({
    target: 'map',

    controls: [
      new Load(),
      new LengthLine(),
      new MyMousePosition(),
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