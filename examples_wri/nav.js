document.getElementById('item-title').innerHTML = 'Wri carte nav';

/* global mapNav */
const elScript = document.createElement('script');

document.body.appendChild(elScript);
elScript.src = '../examples_wri/vues/_cartes.js';
elScript.addEventListener('load', () =>
  mapNav({
    host: 'https://www.refuges.info/', // '<?=$config_wri["sous_dossier_installation"]?>',
    mapKeys: mapKeys, //<?=json_encode($config_wri['mapKeys'])?>,
    layerOptions: {}, //<?=json_encode($config_wri['layerOptions'])?>,
    id_polygone: 0, // <?=isset($vue->polygone)?$vue->polygone->id_polygone:0?>,
  })
);