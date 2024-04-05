/* global myol, mapPoint, mapKeys */

document.getElementById('item-title').innerHTML = 'WRI point';
document.getElementById('sh-point').style.border = '1px solid black';
document.getElementById('item-next').href = '?../../examples_wri/samples/modif&id_point=1234';

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