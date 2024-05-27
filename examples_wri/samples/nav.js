const selectMassifEl = document.getElementById('select-massif');

if (!urlParams.id_polygone || urlParams.id_polygone_type)
  selectMassifEl.parentNode.remove();

const scriptEl = document.createElement('script');

document.body.appendChild(scriptEl);
scriptEl.src = '../examples_wri/vues/_cartes.js';
scriptEl.addEventListener('load', () =>
  mapNav({
    target: 'carte-nav',
    host: 'https://www.refuges.info/', // '<?=$config_wri["sous_dossier_installation"]?>',
    mapKeys: mapKeys, //<?=json_encode($config_wri['mapKeys'])?>,
    // id_polygone: <?=isset($vue->polygone)?$vue->polygone->id_polygone:0?>,
    // id_polygone_type: <?=isset($vue->polygone)?$vue->polygone->id_polygone_type:0?>,
    // extent: <?=json_encode($vue->polygone->extent)?>,
    ...urlParams, // For test
    initSelect: true,
  })
);