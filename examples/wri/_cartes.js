function couchePointsWRI(options) {
  const layer = new myol.layer.MyVectorLayer({
    selectMassif: new myol.Selector('no-selector'), // Defaut = pas de sélecteur de massif
    browserClusterMinDistance: 50, // Distance (pixels) entre 2 icones en dessous de laquelle on affiche un cluster local
    spreadClusterMaxResolution: 10,
    serverClusterMinResolution: 100, // Résolution de la carte (en mètres par pixels) au delà de laquelle on demande des clusters au serveur
    ...options,

    // Calcul de l'url de l'API refuges?.info
    query: (extent, resolution, projection, opt) => {
      const selectionMassif = layer.options.selectMassif.getSelection();

      return {
        _path: selectionMassif.length ? 'api/massif' : 'api/bbox',
        massif: selectionMassif,
        type_points: opt.selector.getSelection(),
        nb_points: 'all',
        cluster: resolution > opt.serverClusterMinResolution ? 0.1 : null, // For server cluster layer
      };
    },

    // Traduction des propriétés reçues de WRI pour interprétation par MyVectorLayer
    addProperties: properties => ({
      label: properties.nom, // Permanence de l'étiquette dès l'affichage de la carte
      name: properties.nom, // Nom utilisé dans les listes affichées au survol des ronds des clusters
      icon: options.host + 'images/icones/' + properties.type.icone + '.svg',
      link: properties.lien, // Lien sur lequel cliquer
    }),

    hoverStylesOptions: (feature, layer) => {
      // Construction de l'étiquette détaillée
      const properties = feature.getProperties();

      // Si c'est un cluster, on affiche comme d'habitude
      if (properties.cluster)
        return myol.stylesOptions.hover(feature, layer);

      feature.setProperties({
        label: etiquetteComplette(properties),
      }, true);

      return myol.stylesOptions.label(feature, layer);
    },
  });

  // Recharger la couche de points quand le sélecteur de massif change
  layer.options.selectMassif.callbacks.push(() => layer.reload());

  return layer;
}

// Fabrique le texte de l'étiquette à partir des propriétés reçues du serveur
function etiquetteComplette(properties) {
  const caracteristiques = [],
    lignes = [];

  // On calcule d'abord la deuxième ligne
  if (properties.coord && properties.coord.alt)
    caracteristiques.push(parseInt(properties.coord.alt) + ' m');
  if (properties.places && properties.places.valeur)
    caracteristiques.push(parseInt(properties.places.valeur) + '\u255E\u2550\u2555');

  // Calcul des lignes de l'étiquette
  lignes.push(properties.name);
  if (caracteristiques.length)
    lignes.push(caracteristiques.join(','));
  lignes.push(properties.type.valeur);

  return lignes.join('\n');
}

// La couche des massifs colorés (accueil et couche carte nav)
function coucheMassifsColores(options) {
  return new myol.layer.MyVectorLayer({
    // Construction de l'url
    strategy: ol.loadingstrategy.all, // Pas de bbox
    query: () => ({
      _path: 'api/polygones',
      type_polygon: 1, // Massifs
    }),
    ...options,

    // Réception et traduction des données
    addProperties: properties => ({
      label: properties.nom, // Affichage du nom du massif si le polygone est assez grand
      link: properties.lien, // Lien sur lequel cliquer
    }),

    // Affichage de base
    basicStylesOptions: feature => {
      // Conversion de la couleur en rgb pour pouvoir y ajouter la transparence
      const rgb = feature.getProperties().couleur
        .match(/([0-9a-f]{2})/ig)
        .map(c => parseInt(c, 16));

      return [{
        // Etiquette
        ...myol.stylesOptions.label(feature),

        // Affichage de la couleur du massif
        fill: new ol.style.Fill({
          // Transparence 0.3
          color: 'rgba(' + rgb.join(',') + ',0.3)',
        }),
      }];
    },

    // Affichage au survol des massifs
    hoverStylesOptions: feature => {
      feature.setProperties({
        overflow: true, // Affiche l'étiquette même si elle n'est pas contenue dans le polygone
      }, true);

      return {
        // Etiquette (pour les cas où elle n'est pas déja affichée)
        ...myol.stylesOptions.label(feature),

        // On renforce le contour du massif survolé
        stroke: new ol.style.Stroke({
          color: feature.getProperties().couleur,
          width: 2,
        }),
      };
    },
  });
}

// Affiche le contour d'un massif pour la page nav
function coucheContourMassif(options) {
  return new myol.layer.MyVectorLayer({
    // Construction de l'url
    query: (extent, resolution, projection, options) => ({
      _path: 'api/polygones',
      type_polygon: 1, // Massifs
      massif: options.selector.getSelection(),
    }),
    strategy: ol.loadingstrategy.all, // Pas de bbox
    ...options,

    // Affichage de base
    basicStylesOptions: () => [{
      // Simple contour bleu
      stroke: new ol.style.Stroke({
        color: 'blue',
        width: 2,
      }),
    }],

    // Pas d'action au survol
    hoverStylesOptions: () => {},
  });
}

// Les controles des cartes de refuges.info
function controlesCartes(page) {
  return [
    // Haut gauche
    new ol.control.Zoom(),
    new ol.control.FullScreen(),
    new myol.control.MyGeocoder(),
    new myol.control.MyGeolocation(),
    'nav,edit,modif'.includes(page) ? new myol.control.Load() : new myol.control.MyButton(),
    'nav,edit,point'.includes(page) ? new myol.control.Download() : new myol.control.MyButton(),
    'nav,point'.includes(page) ? new myol.control.Print() : new myol.control.MyButton(),

    // Bas gauche
    new myol.control.MyMousePosition(),
    new ol.control.ScaleLine(),

    // Bas droit
    new ol.control.Attribution({ // Attribution doit être défini avant LayerSwitcher
      collapsed: false,
    }),
  ];
}

// Les couches de fond des cartes de refuges.info
function fondsCarte(page, layersKeys) {
  return {
    'Refuges.info': new myol.layer.tile.MRI(),
    'OSM fr': new myol.layer.tile.OpenStreetMap({
      url: '//{a-c}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
    }),
    'OpenTopo': new myol.layer.tile.OpenTopo(),
    'Outdoors': new myol.layer.tile.Thunderforest({
      subLayer: 'outdoors',
      key: layersKeys.thunderforest,
    }),
    'IGN TOP25': 'nav,point'.includes(page) ?
      new myol.layer.tile.IGN({
        layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS',
        key: layersKeys.ign,
      }) : null,
    'IGN V2': new myol.layer.tile.IGN({
      layer: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2',
      key: 'essentiels', // La clé pour les couches publiques
      format: 'image/png',
    }),
    'SwissTopo': 'nav,point'.includes(page) ?
      new myol.layer.tile.SwissTopo(
        'ch.swisstopo.pixelkarte-farbe'
      ) : null,
    'Autriche': new myol.layer.tile.Kompass(), // No key
    'Espagne': new myol.layer.tile.IgnES('mapa-raster', 'MTN'),
    'Photo IGN': new myol.layer.tile.IGN({
      layer: 'ORTHOIMAGERY.ORTHOPHOTOS',
      key: 'essentiels',
    }),
    'Photo ArcGIS': new myol.layer.tile.ArcGIS('World_Imagery'),
    'Photo Google': 'nav,point'.includes(page) ?
      new myol.layer.tile.Google('s') : null,
  };
}

// Les couches vectorielles importées des autres sites
function couchesVectoriellesExternes() {
  return [
    new myol.layer.vector.Chemineur({
      selectName: 'select-chemineur',
    }),
    new myol.layer.vector.Alpages({
      selectName: 'select-alpages',
    }),
    new myol.layer.vector.PRC({
      selectName: 'select-prc',
    }),
    new myol.layer.vector.C2C({
      selectName: 'select-c2c',
    }),
    new myol.layer.vector.Overpass({
      selectName: 'select-osm',
    }),
  ];
}