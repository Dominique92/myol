/* global urlParams, mapModif, mapKeys */

// Simule la position du point donnée à la page de modification
const markerJson = document.getElementById('marker-json');

if (urlParams.id_point && markerJson)
  markerJson.value = '{"type":"Point","coordinates":[5.88496,44.79095]}';

const scriptEl = document.createElement('script');

document.body.appendChild(scriptEl);
scriptEl.src = '../examples_wri/vues/_cartes.js';
scriptEl.addEventListener('load', () =>
  mapModif({
    host: 'https://www.refuges.info/', // '<?=$config_wri["sous_dossier_installation"]?>',
    mapKeys: mapKeys, //<?=json_encode($config_wri['mapKeys'])?>,
    idPoint: urlParams['id_point'], // <?=intval($vue->point->id_point)?>;
  })
);