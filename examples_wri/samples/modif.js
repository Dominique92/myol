/* global urlParams, mapModif, mapKeys */

/*//TODO
if (urlParams['id_point']) {
  document.getElementById('item-title').innerHTML = 'WRI modif point';
  document.getElementById('sh-modif').style.border = '1px solid black';
  document.getElementById('item-next').href = '?../../examples_wri/samples/modif&id_point_type=7';
} else {
  document.getElementById('item-title').innerHTML = 'WRI crée point';
  document.getElementById('sh-pointcree').style.border = '1px solid black';
  document.getElementById('item-next').href = '?../../examples_wri/samples/nav';
}
*/
const sampleEl =
  document.getElementById('sampleList')
  .querySelectorAll('[href*="' + location.search + '"]')[0];

document.getElementById('item-next').href = sampleEl
  .nextElementSibling
  .getAttribute('href');

document.getElementById(sampleEl.id).style.border = '1px solid black';
document.getElementById('item-title').innerHTML = 'WRI ' + sampleEl.title;


const elScript = document.createElement('script');

document.body.appendChild(elScript);
elScript.src = '../examples_wri/vues/_cartes.js';
elScript.addEventListener('load', () =>
  mapModif({
    host: 'https://www.refuges.info/', // '<?=$config_wri["sous_dossier_installation"]?>',
    mapKeys: mapKeys, //<?=json_encode($config_wri['mapKeys'])?>,
    layerOptions: {}, //<?=json_encode($config_wri['layerOptions'])?>,
    idPoint: urlParams['id_point'], // <?=intval($vue->point->id_point)?>;
  })
);
//TODO BUG position curseur crée