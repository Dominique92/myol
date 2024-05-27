const scriptEl = document.createElement('script');

document.body.appendChild(scriptEl);
scriptEl.src = '../examples_wri/vues/_cartes.js';
scriptEl.addEventListener('load', () =>
  mapIndex({
    target: 'carte-accueil',
    host: 'https://www.refuges.info/', // '<?=$config_wri["sous_dossier_installation"]?>',
    extent: [4, 43.5, 8.5, 47], // [<?=$vue->bbox?>],
  })
);