/* global mapModif, mapKeys */

document.getElementById('item-title').innerHTML = 'WRI modif point';
document.getElementById('item-next').href = '?../../examples_wri/samples/modif&id_point_type=7';

const elScript = document.createElement('script');

document.body.appendChild(elScript);
elScript.src = '../examples_wri/vues/_cartes.js';
elScript.addEventListener('load', () =>
  mapModif({
    host: 'https://www.refuges.info/', // '<?=$config_wri["sous_dossier_installation"]?>',
    mapKeys: mapKeys, //<?=json_encode($config_wri['mapKeys'])?>,
    layerOptions: {}, //<?=json_encode($config_wri['layerOptions'])?>,
    idPoint: 1234, // <?=intval($vue->point->id_point)?>;
  })
);