/* global mapIndex */

document.getElementById('item-title').innerHTML = 'Refuges.info';
document.getElementById('sh-index').style.border = '1px solid black';
document.getElementById('item-next').href = '?../../examples_wri/samples/point';

const elScript = document.createElement('script');

document.body.appendChild(elScript);
elScript.src = '../examples_wri/vues/_cartes.js';
elScript.addEventListener('load', () =>
  mapIndex({
    host: 'https://www.refuges.info/', // '<?=$config_wri["sous_dossier_installation"]?>',
    extent: [4, 43.5, 8.5, 47], // [<?=$vue->bbox?>];
  })
);