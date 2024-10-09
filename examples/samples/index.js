/* global ol, myol, mapKeys */

/* eslint-disable-next-line no-unused-vars */
const map = new ol.Map({
  target: 'map',
  //BEST resizable map

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