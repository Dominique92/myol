var host = 'https://www.refuges.info/', // Appeler la couche de CE serveur
  extent = [4, 43.5, 8.5, 47];

var map = new ol.Map({
  target: 'carte-accueil',
  view: new ol.View({
    enableRotation: false,
    constrainResolution: true, // Force le zoom sur la définition des dalles disponibles
  }),
  controls: [
    new ol.control.Attribution({ // Du fond de carte
      collapsed: false,
    }),
  ],
  layers: [
    new myol.layer.tile.MRI(), // Fond de carte
    coucheMassifsColores({ // Les massifs
      host: host,
    }),
    new myol.layer.Hover(), // Gère le survol du curseur
  ],
});

// Centre la carte sur la zone souhaitée
map.getView().fit(ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857'));