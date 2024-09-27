/* global ol, myol */

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

  editorLayer = new myol.layer.GpxEdit({
    direction: true,
    canMerge: true,
    withPolys: true,
    withHoles: true,

    // For WRI
    wwwriteGeoJson: (features, lines, polys, options) => {
      const warnEl = document.getElementById('warn');

      // Body class to warn edit polys only
      if (lines.length)
        warnEl.innerHTML = 'Il ne doit pas y avoir de lignes dans un massif.';
      else if (polys.length)
        warnEl.innerHTML = '';
      else
        warnEl.innerHTML = 'Il doit y avoir au moins 1 polygone dans un massif.';

      return options.format.writeGeometry(
        new ol.geom.MultiPolygon(polys),
        options,
      );
    },
  }),

  map = new ol.Map({
    target: 'map',

    controls: [
      new myol.control.Load(),
      new myol.control.LengthLine(),
      new myol.control.MyMousePosition(),
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