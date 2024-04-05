/* global ol, myol, mapKeys */

/* eslint-disable-next-line no-unused-vars */
var map = new ol.Map({
  target: 'map',

  view: new ol.View({
    center: ol.proj.transform([2, 47], 'EPSG:4326', 'EPSG:3857'), // France
    constrainResolution: true, // Force zoom on the definition of available tiles
    zoom: 5,
  }),

  controls: [
    new ol.control.Zoom(),
    new ol.control.Attribution({
      collapsed: false,
    }),
    new myol.control.LayerSwitcher({
      layers: myol.layer.tile.examples(mapKeys),
    }),
  ],
});