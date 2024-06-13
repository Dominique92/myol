/* eslint-disable-next-line no-unused-vars */
const map = new ol.Map({
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

const params = new URLSearchParams(document.location.search),
  carte = params.get('carte');

if (!carte)
  window.location.href = '?sample=wri&carte=index';