/* global myol, mapPoint, mapKeys */

const scriptEl = document.createElement('script');

document.body.appendChild(scriptEl);
scriptEl.src = '../examples_wri/vues/_cartes.js';
scriptEl.addEventListener('load', () => {
  const map = mapPoint({
    host: 'https://www.refuges.info/', // '<?=$config_wri["sous_dossier_installation"]?>',
    mapKeys: mapKeys, //<?=json_encode($config_wri['mapKeys'])?>,
    //layerOptions: <?=json_encode($config_wri['layerOptions'])?>,
  });

  myol.trace(map);
  return map;
});