/* global L, requeteAPI, serveurApi, appliqueDonnees */

/*****************
 * Carte Leaflet *
 *****************/
// Initialise la carte avec les points des Alpes du Nord
let map = null;

/* eslint-disable-next-line no-unused-vars */
function initCarte() {
  //BEST stratégie bbox & ne pas charger toutes les icônes
  if (!map) {
    map = L.map('map');

    // Fond de carte
    L.tileLayer(
      'https://tile.openmaps.fr/openhikingmap/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '<a href="https://www.openstreetmap.org/copyright"">&copy; OpenStreetMap</a>. ' +
          '<a href="https://wiki.openstreetmap.org/wiki/OpenHikingMap">OpenHikingMap</a>',
      }
    ).addTo(map);

    requeteAPI(
      'cartes',
      '/api/bbox?&nb_points=all&bbox=4.8%2C44.5%2C7.4%2C46.2', // French north Apls
      null,
      json => {
        L.geoJson(json, {
          // Icônes WRI
          pointToLayer: (feature, latlng) => L.marker(latlng, {
            icon: L.icon({
              iconUrl: serveurApi + '/images/icones/' + feature.properties.type.icone + '.svg',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })
          }),

          onEachFeature: (feature, layer) => {
            // Etiquette sur les points
            layer.bindTooltip(
              feature.properties.nom, {
                direction: 'center',
                offset: L.point(0, -24),
              }
            ).openTooltip();

            // Clic
            layer.on({
              click: () => {
                // Affiche les donnés d'entête de la fiche qui sont disponibles dans l'API bbox
                appliqueDonnees('point', feature.properties);

                // Affiche la page point
                window.location.hash = 'point=' + feature.properties.id;
              },
            });
          }
        }).addTo(map);
      }
    );
  }
  map.invalidateSize(); // Recharge la carte

  return map;
}