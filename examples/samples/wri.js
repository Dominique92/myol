//TODO clean wri examples / paramètre carte inactif
//TODO clean wri examples / supprimer examples_wri

//TODO 251:21  warning  'selectIndexLayer' was used before it was defined  no-use-before-define
//TODO 257:21  warning  'selectIndexLayer' was used before it was defined  no-use-before-define
//TODO 269:11  warning  Unexpected 'this'                                  no-invalid-this

//TODO Créer un massif à partir d'un tracé existant
//TODO Lecture nombre de commentaires d'un user avant destruction

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