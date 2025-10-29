var nomPages = ['carte', 'point', 'nouvelles'],
  serveurApi = 'https://www.refuges.info';

// Initialisation de la page lorsque l'URL principale est appelée ou l'ancre change 
function changePage() {
  const ancre = window.location.hash.replace('#', '').split('=');

  // Attribue le nom de la page à l'ID du body
  if (nomPages.includes(ancre[0]))
    document.body.id = ancre[0];
  else
    document.body.id = 'carte';

  // Supprime tous les états d'affichage de la page précédente
  document.body.className = '';

  // Execute la function d'initialisation de la page
  const nomFonctionAffiche = 'affichePage' + document.body.id.replace(/^[a-z]/, m => m.toUpperCase());
  window[nomFonctionAffiche](ancre[1]);
}

window.addEventListener('load', changePage); // Chargement initial du html
window.addEventListener('popstate', changePage); // L'ancre change ou navigation par les boutons buttons

/**************
 * Page carte *
 **************/
function affichePageCarte() {
  initCarte().setView([45, 5.5], 13);
}

/******************
 * Page nouvelles *
 ******************/
function affichePageNouvelles() {
  requeteAPI(
    'nouvelles',
    '/api/contributions?format=json&format_texte=html&massif=352&nombre=10',
    null,
    json => {
      // Calcule le lien pour afficher la page qui correspond
      for (j in json)
        json[j].lien_interne = '#point=' + json[j].id_point;

      prepareModeleGroupe('nouvelles-groupe', Object.keys(json).length - 1); // -1 pour le copyright
      appliqueDonnees('nouvelles-groupe', json);
    }
  );
}

/**************
 * Page point *
 **************/
function affichePagePoint(point_id) {
  // Charge les données du points
  requeteAPI(
    'point',
    '/api/point?detail=complet&format=geojson&format_texte=html&id=' + point_id,
    null,
    json => {
      const properties = json.features[0].properties,
        coords = json.features[0].geometry.coordinates
      info_comp = {};

      initCarte().setView([coords[1], coords[0]], 15);

      // Infos complémentaires
      // Filtre les infos non signifiantes
      properties.info_comp.places = properties.places;
      let ii = 0;
      for (ic in properties.info_comp)
        if (!'§ 0 Sans'.includes(properties.info_comp[ic].valeur || '§'))
          info_comp[ii++] = properties.info_comp[ic];

      prepareModeleGroupe('point-infos-groupe', Object.keys(info_comp).length);
      appliqueDonnees('point-infos-groupe', info_comp);

      // Infos de la fiche
      //BEST enlever titre de la rubrique quand elle est vide
      properties.lien_externe = '/point/' + properties.id;
      appliqueDonnees('point', properties);
    }
  );

  // Charge les données des commentaires
  requeteAPI(
    'commentaires',
    '/api/commentaires?format=json&format_texte=html&id_point=' + point_id,
    null,
    json => {
      prepareModeleGroupe('commentaires-groupe', Object.keys(json).length - 1); // -1 pour le copyright
      appliqueDonnees('commentaires-groupe', json);
    }
  );
}