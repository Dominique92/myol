document.getElementById('example-title').innerHTML = 'Refuges.info';
document.getElementById('example-next-wri').href = '?../../examples_wri/point';

const elScript = document.createElement('script');
var map;
/* global mapIndex */

document.body.appendChild(elScript);
elScript.src = '../examples_wri/vues/_cartes.js';
elScript.addEventListener('load', () =>
  map = mapIndex({
    host: 'https://www.refuges.info/', // '<?=$config_wri["sous_dossier_installation"]?>',
    extent: [4, 43.5, 8.5, 47], // [<?=$vue->bbox?>];
  })
);