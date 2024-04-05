/* global myol, mapPoint, mapKeys */

const elScript = document.createElement('script');

document.body.appendChild(elScript);
elScript.src = '../examples_wri/vues/_cartes.js';
elScript.addEventListener('load', () => {
  const map = mapPoint({
    host: 'https://www.refuges.info/', // '<?=$config_wri["sous_dossier_installation"]?>',
    mapKeys: mapKeys, //<?=json_encode($config_wri['mapKeys'])?>,
    layerOptions: {}, //<?=json_encode($config_wri['layerOptions'])?>,
  });

  myol.trace(map);
  return map;
});