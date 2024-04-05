/* global navEdit, mapKeys, urlParams */

const elScript = document.createElement('script');

document.body.appendChild(elScript);
elScript.src = '../examples_wri/vues/_cartes.js';
elScript.addEventListener('load', () =>
  navEdit({
    host: 'https://www.refuges.info/', // '<?=$config_wri["sous_dossier_installation"]?>',
    mapKeys: mapKeys, //<?=json_encode($config_wri['mapKeys'])?>,
    // layerOptions: <?=json_encode($config_wri['layerOptions'])?>,
    // id_polygone: <?=isset($vue->polygone)?$vue->polygone->id_polygone:0?>,
    // extent :null <?=json_encode($vue->polygone->extent)?>,
    ...urlParams,
  })
);