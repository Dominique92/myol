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

    const traceSource = new ol.source.Vector({});

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

    // Style to color selected (hoveres) features with begin & end points
    const selectStyle = function(feature) {
      const geometry = feature.getGeometry(),
        featureStyle = [
          new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: 'red',
              width: 3,
            }),
          }),
        ],
        summits = [];

      if (geometry.forEachSegment) {
        geometry.forEachSegment(function(start, end) {
          summits.push(start);
          summits[1] = end;
        });
        featureStyle.push(
          new ol.style.Style({
            geometry: new ol.geom.Point(summits[0]),
            image: new ol.style.Circle({
              stroke: new ol.style.Stroke({
                color: 'red',
                width: 1,
              }),
              radius: 5,
            }),
          }),
        );
        featureStyle.push(
          new ol.style.Style({
            geometry: new ol.geom.Point(summits[1]),
            image: new ol.style.Circle({
              fill: new ol.style.Fill({
                color: 'red',
                width: 2,
              }),
              radius: 5,
            }),
          }),
        );
      }
      return featureStyle;
    };

    this.interactions = [
      new ol.interaction.Modify({ // 0 Modify
        source: source,
        pixelTolerance: 16, // Default is 10
        style: style,
      }),
      new ol.interaction.Select({ // 1 Select
        condition: ol.events.condition.pointerMove,
        style: selectStyle,
      }),
      new ol.interaction.Draw({ // 2 Draw line
        type: 'LineString',
        source: source,
        traceSource: traceSource,
        trace: true,
        style: style,
        stopClick: true, // Avoid zoom when you finish drawing by doubleclick
      }),
      new ol.interaction.Draw({ // 3 Draw poly
        type: 'Polygon',
        source: source,
        traceSource: traceSource,
        trace: true,
        style: style,
        stopClick: true, // Avoid zoom when you finish drawing by doubleclick
      }),
    ];

    this.interactionSnap = new ol.interaction.Snap({
      source: source,
      pixelTolerance: 7.5, // 6 + line width / 2 : default is 10
    });

    this.traceSource = traceSource;
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

      const helpEl = document.getElementById('ed-help' + noInteraction);
      if (helpEl)
        element.appendChild(helpEl);

      // Add listeners to the buttons
      buttonEl.addEventListener('click', evt => this.buttonAction(evt, noInteraction));

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

      // For snap & traceSource : register again the full list of features as addFeature manages already registered
      this.traceSource.clear();
      this.map.getLayers().forEach(layer => {
        if (layer.getSource() && layer.getSource().getFeatures) // Vector layers only
          layer.getSource().getFeatures().forEach(f => {
            this.interactionSnap.addFeature(f);
            this.traceSource.addFeature(f);
          });
      });
    }
  }
}

export default Edit;

/*//TODO new editor
Inverser une ligne
Mesurer la longueur

https://github.com/openlayers/openlayers/issues/11608
https://openlayers.org/en/latest/examples/modify-features.html
Move 1 vertex from double (line / polygons, …
	Dédouble / colle line
	Défait / colle polygone
Quand interaction finie : transforme line -> poly si les 2 extrémités sont =

Delete selected feature
*/