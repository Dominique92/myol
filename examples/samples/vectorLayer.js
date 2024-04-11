/* global ol, myol */

/* eslint-disable-next-line no-unused-vars */
var map = new ol.Map({
  target: 'map',

  view: new ol.View({
    center: ol.proj.transform([5.885, 44.791], 'EPSG:4326', 'EPSG:3857'), // Cabane double Samblue
    //center: ol.proj.transform([6.51, 45.13], 'EPSG:4326', 'EPSG:3857'), // Cabane double Terre rouge
    constrainResolution: true, // Force zoom on the definition of available tiles
    zoom: 14,
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
    new myol.layer.vector.Chemineur({
      selectName: 'select-chem',
      initSelect: '',
    }),
    new myol.layer.vector.Alpages({
      selectName: 'select-alpages',
    }),
    new myol.layer.vector.WRI({
      selectName: 'select-wri',
    }),
    new myol.layer.vector.PRC({
      selectName: 'select-prc',
    }),
    new myol.layer.vector.C2C({
      selectName: 'select-c2c',
    }),
    new myol.layer.vector.Overpass({
      selectName: 'select-osm',
    }),

    // Hover & click management (mouse & touch)
    new myol.layer.Hover(),
  ],
});