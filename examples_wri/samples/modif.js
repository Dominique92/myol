/* global urlParams, mapModif, mapKeys */

// Simule la page de création qui n'a pas de position initiale du curseur
document.getElementById('marker-json').value = '';

const elScript = document.createElement('script');

document.body.appendChild(elScript);
elScript.src = '../examples_wri/vues/_cartes.js';
elScript.addEventListener('load', () =>
  mapModif({
    host: 'https://www.refuges.info/', // '<?=$config_wri["sous_dossier_installation"]?>',
    mapKeys: mapKeys, //<?=json_encode($config_wri['mapKeys'])?>,
    idPoint: urlParams['id_point'], // <?=intval($vue->point->id_point)?>;
    //...<?=json_encode($config_wri['layerOptions'])?>,
  })
);