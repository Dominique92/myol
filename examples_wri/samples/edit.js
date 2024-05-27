const scriptEl = document.createElement('script');

document.body.appendChild(scriptEl);
scriptEl.src = '../examples_wri/vues/_cartes.js';
scriptEl.addEventListener('load', () =>
  mapEdit({
    host: 'https://www.refuges.info/', // '<?=$config_wri["sous_dossier_installation"]?>',
    mapKeys: mapKeys, //<?=json_encode($config_wri['mapKeys'])?>,
    // id_polygone: <?=isset($vue->polygone)?$vue->polygone->id_polygone:0?>,
    // extent: <?=json_encode($vue->polygone->extent)?>,
    ...urlParams,
  })
);