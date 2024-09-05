/**
 * Edit.js
 * geoJson lines & polygons edit
 */

import ol from '../ol';
import './edit.css';

// Default french text
const helpModifFr = {
    inspect: '\
<p><b><u>EDITEUR</u>: Inspecter une ligne ou un polygone</b></p>\
<p>Cliquer sur le bouton &#x2048 (qui bleuit) puis</p>\
<p>Survoler l\'objet avec le curseur pour:</p>\
<p>Distinguer une ligne ou un polygone des autres</p>\
<p>Calculer la longueur d\'une ligne ou un polygone</p>',
    line: '\
<p><b><u>EDITEUR</u>: Modifier une ligne</b></p>\
<p>Cliquer sur le bouton &#x2725; (qui bleuit) puis</p>\
<p>Pointer le curseur sur une ligne</p>\
<p><u>Déplacer un sommet</u>: Cliquer sur le sommet et le déplacer</p>\
<p><u>Ajouter un sommet au milieu d\'un segment</u>: cliquer le long du segment puis déplacer</p>\
<p><u>Supprimer un sommet</u>: Alt+cliquer sur le sommet</p>\
<p><u>Couper une ligne en deux</u>: Alt+cliquer sur le segment à supprimer</p>\
<p><u>Inverser la direction d\'une ligne</u>: Shift+cliquer sur le segment à inverser</p>\
<p><u>Fusionner deux lignes</u>: déplacer l\'extrémité d\'une ligne pour rejoindre l\'autre</p>\
<p><u>Supprimer une ligne</u>: Ctrl+Alt+cliquer sur un segment</p>',
    poly: '\
<p><b><u>EDITEUR</u>: Modifier un polygone</b></p>\
<p>Cliquer sur le bouton &#x2725; (qui bleuit) puis </p>\
<p>Pointer le curseur sur un bord de polygone</p>\
<p><u>Déplacer un sommet</u>: Cliquer sur le sommet et le déplacer</p>\
<p><u>Ajouter un sommet au milieu d\'un segment</u>: cliquer le long du segment puis déplacer</p>\
<p><u>Supprimer un sommet</u>: Alt+cliquer sur le sommet</p>\
<p><u>Scinder un polygone</u>: joindre 2 sommets du polygone puis Alt+cliquer sur le sommet commun</p>\
<p><u>Fusionner 2 polygones</u>: superposer un côté (entre 2 sommets consécutifs)\
 de chaque polygone puis Alt+cliquer dessus</p>\
<p><u>Supprimer un polygone</u>: Ctrl+Alt+cliquer sur un segment</p>',
    both: '\
<p><b><u>EDITEUR</u>: Modifier une ligne ou un polygone</b></p>\
<p>Pointer le curseur sur une ligne ou un bord de polygone</p>\
<p>Cliquer sur le bouton &#x2725; (qui bleuit) puis</p>\
<p><u>Déplacer un sommet</u>: Cliquer sur le sommet et le déplacer</p>\
<p><u>Ajouter un sommet au milieu d\'un segment</u>: cliquer le long du segment puis déplacer</p>\
<p><u>Supprimer un sommet</u>: Alt+cliquer sur le sommet</p>\
<p><u>Couper une ligne en deux</u>: Alt+cliquer sur le segment à supprimer</p>\
<p><u>Inverser la direction d\'une ligne</u>: Shift+cliquer sur le segment à inverser</p>\
<p><u>Transformer un polygone en ligne</u>: Alt+cliquer sur un côté</p>\
<p><u>Fusionner deux lignes</u>: déplacer l\'extrémité d\'une ligne pour rejoindre l\'autre</p>\
<p><u>Transformer une ligne en polygone</u>: déplacer une extrémité pour rejoindre l\'autre</p>\
<p><u>Scinder un polygone</u>: joindre 2 sommets du polygone puis Alt+cliquer sur le sommet commun</p>\
<p><u>Fusionner 2 polygones</u>: superposer un côté (entre 2 sommets consécutifs)\
 de chaque polygone puis Alt+cliquer dessus</p>\
<p><u>Supprimer une ligne ou un polygone</u>: Ctrl+Alt+cliquer sur un segment</p>',
  },

  helpLineFr = '\
<p><b><u>EDITEUR</u>: Créer une ligne</b></p>\
<p>Cliquer sur le bouton &#x2608; (qui bleuit) puis</p>\
<p>Cliquer sur l\'emplacement du début</p>\
<p>Puis sur chaque sommet</p>\
<p>Double cliquer sur le dernier sommet pour terminer</p>\
<hr>\
<p>Cliquer sur une extrémité d\'une ligne existante pour l\'étendre</p>',

  helpPolyFr = '\
<p><b><u>EDITEUR</u>: Créer un polygone</b></p>\
<p>Cliquer sur le bouton &#x23E2; (qui bleuit) puis</p>\
<p>Cliquer sur l\'emplacement du premier sommet</p>\
<p>Puis sur chaque sommet</p>\
<p>Double cliquer sur le dernier sommet pour terminer</p>\
<hr>\
<p>Un polygone entièrement compris dans un autre crée un "trou"</p>';

// Editor
export class Edit extends ol.layer.Vector {
  constructor(opt) {
    const options = {
      geoJsonId: 'geojson',
      format: new ol.format.GeoJSON(),
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',

      ...opt,
    }

    const geoJsonEl = document.getElementById(options.geoJsonId) || {}, // Read data in an html element
      geoJson = geoJsonEl.value || geoJsonEl.innerHTML || '{"type":"FeatureCollection","features":[]}';

    const source = new ol.source.Vector({
      features: options.format.readFeatures(geoJson, options),
      wrapX: false,

      ...options,
    });

    const style = new ol.style.Style({
      // Marker
      image: new ol.style.Circle({
        radius: 4,
        stroke: new ol.style.Stroke({
          color: 'red',
          width: 2,
        }),
      }),
      // Lines or polygons border
      stroke: new ol.style.Stroke({
        color: 'red',
        width: 2,
      }),
      // Polygons
      fill: new ol.style.Fill({
        color: 'rgba(0,0,255,0.2)',
      }),

      ...options.styleOptions,
    });

    super({
      source: source,
      style: style,
      zIndex: 400, // Editor & cursor : above the features

      ...options,
    });
  } // End constructor

  setMapInternal(map) {
    this.map = map;

    super.setMapInternal(map);
  } // End setMapInternal

}

export default Edit;

/*//TODO new editor
https://openlayers.org/en/latest/examples/draw-and-modify-features.html
https://openlayers.org/en/latest/examples/tracing.html

https://openlayers.org/en/latest/examples/measure-style.html
	Reverse if modify one end ?
https://openlayers.org/en/latest/examples/line-arrows.html

https://github.com/openlayers/openlayers/issues/11608
https://openlayers.org/en/latest/examples/modify-features.html
Move 1 vertex from double (line / polygons, …
	Dédouble / colle line
	Défait / colle polygone
Quand interaction finie : transforme line -> poly si les 2 extrémités sont =

Marquer les extrémités des lignes

Inverser une ligne

Delete selected feature
*/