/* global ol, myol */

/* eslint-disable-next-line no-unused-vars */
const map = new ol.Map({
  target: 'map',

  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
    new myol.layer.Marker({
      src: 'images/cadre.png',
      prefix: 'cadre',
    }),
    new myol.layer.Marker({
      src: 'images/viseur.png',
      dragable: true,
      focus: 15, // Overload position & zoom to marker
    }),
  ],
});