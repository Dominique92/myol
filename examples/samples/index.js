/* global ol, myol, mapKeys */

document.getElementById('item-title').innerHTML = 'Openlayers adaptation';
document.getElementById('item-next').href = '?layerSwitcher';

/* eslint-disable-next-line no-unused-vars */
var map = new ol.Map({
  target: 'map',

  controls: [
    ...myol.control.collection(),
    new myol.control.LayerSwitcher({
      layers: myol.layer.tile.examples(mapKeys),
    }),
    new myol.control.Permalink({
      display: true,
      init: true,
    }),
  ],

  layers: [
    new myol.layer.vector.Chemineur({
      selectName: 'select-chem',
    }),
  ],
});