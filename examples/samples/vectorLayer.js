/* global ol, myol */

/* eslint-disable-next-line no-unused-vars */
const map = new ol.Map({
  target: 'map',

  view: new ol.View({
    center: ol.proj.transform([5.885, 44.791], 'EPSG:4326', 'EPSG:3857'), // Cabane double Samblue
    //center: ol.proj.transform([6.51, 45.13], 'EPSG:4326', 'EPSG:3857'), // Cabane double Terre rouge
    //center: ol.proj.transform([2.394, 48.861], 'EPSG:4326', 'EPSG:3857'), // Père lachaise
    constrainResolution: true, // Force zoom on the definition of available tiles
    zoom: 13,
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
      debug: true,
    }),
    new myol.layer.vector.WRI({
      selectName: 'select-wri-tiled',
      strategy: myol.layer.myLoadingStrategy.tiledBboxStrategy,
      tiledBBoxStrategy: { // Static tiled bbox. 1 Mercator unit = 0.7 meter at lat = 45° : cos(45°)
        50000: 100, // tilesize = 10 000 Mercator units = 35 km until resolution = 100 meters per pixel
        570000: 1000, // tilesize = 400 km until resolution = 1 km per pixel
        14000000: Infinity, // tilesize = 10 000 km above
      },
      debug: true,
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
    new myol.layer.vector.PL({
      selectName: 'select-pl',
    }),

    // Hover & click management (mouse & touch)
    new myol.layer.Hover(),
  ],
});