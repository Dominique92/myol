/**
 * Edit.js
 * geoJson lines & polygons edit
 */

import ol from '../ol';
import './edit.css';

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

    this.interactions = [
      new ol.interaction.Modify({ // 0 Modify
        source: source,
        pixelTolerance: 16, // Default is 10
        style: style,
      }),
      new ol.interaction.Select({ // 1 Inspect
        condition: ol.events.condition.pointerMove,
        style: () => new ol.style.Style({
          // Lines or polygons border
          stroke: new ol.style.Stroke({
            color: 'red',
            width: 3,
          }),
          // Polygons
          fill: new ol.style.Fill({
            color: 'rgba(0,0,255,0.5)',
          }),
        }),
      }),
      new ol.interaction.Draw({ // 2 Draw line
        source: source,
        type: 'LineString',
        style: style,
        stopClick: true, // Avoid zoom when you finish drawing by doubleclick
      }),
      new ol.interaction.Draw({ // 3 Draw poly
        source: source,
        type: 'Polygon',
        style: style,
        stopClick: true, // Avoid zoom when you finish drawing by doubleclick
      }),
    ];

    this.interactionSnap = new ol.interaction.Snap({
      source: source,
      pixelTolerance: 7.5, // 6 + line width / 2 : default is 10
    });
  } // End constructor

  setMapInternal(map) {
    super.setMapInternal(map);
    this.map = map;

    // Draw buttons
    this.interactions.forEach((interaction, noInteraction) => {
      const buttonEl = document.createElement('button'),
        element = document.createElement('div');

      element.className = 'ol-unselectable ol-control ed-button ed-button-' + noInteraction;
      element.appendChild(buttonEl);

      // Add listeners to the buttons
      //    this.element.addEventListener('mouseover', evt => this.buttonListener(evt));
      //    this.element.addEventListener('mouseout', evt => this.buttonListener(evt));
      buttonEl.addEventListener('click', evt => this.buttonAction(evt, noInteraction));
      //TODO help on hover / click mobile

      map.addControl(new ol.control.Control({
        element: element,
      }));
    });

    map.once('postrender', () => { //HACK when everything is ready
      this.buttonAction({ // Init interaction & button to modify
        type: 'click',
      }, 0);
    });
  } // End setMapInternal

  buttonAction(evt, noInteraction) {
    this.interactions[noInteraction].on('drawend', () => {
      this.buttonAction(evt, 0); // Reset interaction & button to modify
      //TODO optimize & update geoJsonEl
    })

    if (evt.type === 'click') {
      this.map.getTargetElement().firstChild.className = 'ol-viewport ed-view-' + noInteraction;

      this.interactions.forEach(interaction => this.map.removeInteraction(interaction));
      this.map.addInteraction(this.interactions[noInteraction]);
      this.map.addInteraction(this.interactionSnap); // Must be added after the others

      // For snap : register again the full list of features as addFeature manages already registered
      this.map.getLayers().forEach(layer => {
        if (layer.getSource() && layer.getSource().getFeatures) // Vector layers only
          layer.getSource().getFeatures().forEach(f =>
            this.interactionSnap.addFeature(f)
          );
      });
    }
  }
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