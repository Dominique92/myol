document.getElementById('example-title').innerHTML = 'Refuges.info';

/* global mapIndex */
const elScript = document.createElement('script');

document.body.appendChild(elScript);
elScript.src = '../examples_wri/vues/_cartes.js';
elScript.addEventListener('load', () =>
  mapIndex({
    host: 'https://www.refuges.info/', // '<?=$config_wri["sous_dossier_installation"]?>',
    extent: [4, 43.5, 8.5, 47], // [<?=$vue->bbox?>];
  })
);