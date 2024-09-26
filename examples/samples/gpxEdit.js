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
    direction: true,
    canMerge: true,
    withPolys: true,
    withHoles: true,
  }),

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

if (editorLayer.getSource().getFeatures().length)
  map.once('loadend', () => {
    map.getView().fit(
      editorLayer.getSource().getExtent(), {
        minResolution: 1,
        padding: [5, 5, 5, 5],
      });
  });