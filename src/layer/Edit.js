/**
 * Edit.js
 * geoJson lines & polygons edit
 */

import ol from '../ol';
import './edit.css';

// Style of edited features display
const displayStyle = new ol.style.Style({
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
});

// Style to color selected (hoveres) features with begin & end points
function selectStyles(feature) {
  const geometry = feature.getGeometry(),
    featureStyles = [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#ff0000',
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
    featureStyles.push(
      new ol.style.Style({
        geometry: new ol.geom.Point(summits[0]),
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'red',
            width: 2,
          }),
        }),
      }),
    );
    featureStyles.push(
      new ol.style.Style({
        geometry: new ol.geom.Point(summits[1]),
        image: new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({
            color: '#ff8000',
          }),
        }),
      }),
    );
  }
  return featureStyles;
};

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

    const editedSource = new ol.source.Vector({
      features: options.format.readFeatures(geoJson, options),
      wrapX: false,

      ...options,
    });

    super({
      source: editedSource,
      style: displayStyle,
      zIndex: 400, // Editor & cursor : above the features

      ...options,
    });

    this.editedSource = editedSource;
  } // End constructor

  setMapInternal(map) {
    super.setMapInternal(map);
    this.map = map;

    // Interactions & buttons
    this.traceSource = new ol.source.Vector({});

    this.interactions = [
      new ol.interaction.Modify({ // 0 Modify
        source: this.editedSource,
        pixelTolerance: 16, // Default is 10
        style: displayStyle,
      }),
      new ol.interaction.Select({ // 1 Select
        condition: ol.events.condition.pointerMove,
        style: selectStyles,
      }),
      new ol.interaction.Draw({ // 2 Draw line
        type: 'LineString',
        source: this.editedSource,
        traceSource: this.traceSource,
        trace: true,
        style: displayStyle,
        stopClick: true, // Avoid zoom when you finish drawing by doubleclick
      }),
      new ol.interaction.Draw({ // 3 Draw poly
        type: 'Polygon',
        source: this.editedSource,
        traceSource: this.traceSource,
        trace: true,
        style: displayStyle,
        stopClick: true, // Avoid zoom when you finish drawing by doubleclick
      }),
    ];

    this.interactionSnap = new ol.interaction.Snap({
      source: this.editedSource,
      pixelTolerance: 7.5, // 6 + line width / 2 : default is 10
    });

    this.interactions[1].on('select', evt => {
      console.log('select');
    });
    this.interactions[1].on('change', evt => {
      console.log('change');
    });
    this.interactions[1].on('propertychange', evt => {
      console.log('propertychange');
    });

    // End of one modify interaction
    this.interactions[0].on('modifyend', evt => {
      console.log('modifyend');

      // Ctrl+Alt+click on segment : delete the line or poly
      if (evt.mapBrowserEvent.originalEvent.ctrlKey &&
        evt.mapBrowserEvent.originalEvent.altKey) {
        const selectedFeatures = this.map.getFeaturesAtPixel(
          evt.mapBrowserEvent.pixel, {
            hitTolerance: 6, // Default is 0
            layerFilter: l => l.ol_uid === this.ol_uid
          });

        for (const f in selectedFeatures) // We delete the selected feature
          this.editedSource.removeFeature(selectedFeatures[f]);
      }

      /*
      //TODO BUG edit polygone : ne peut pas supprimer un côté
      //BEST move only one summit when dragging
      //BEST Ctrl+Alt+click on summit : delete the line or poly

      // Alt+click on segment : delete the segment & split the line
      //TODO Snap : register again the full list of features as addFeature manages already registered
      //TODO Le faire aussi à l’init vers edit
      const tmpFeature = this.interactions[4].snapTo(
        evt.mapBrowserEvent.pixel,
        evt.mapBrowserEvent.coordinate,
        map
      );

      if (tmpFeature && evt.mapBrowserEvent.originalEvent.altKey)
        this.optimiseEdited(tmpFeature.vertex);

      else if (tmpFeature && evt.mapBrowserEvent.originalEvent.shiftKey)
        this.optimiseEdited(tmpFeature.vertex, true);
      else
        this.optimiseEdited();

      this.hoveredFeature = null;
	  */
      this.finish();
    });

    // End of line & poly drawing
    [2, 3].forEach(i => this.interactions[i].on('drawend', () => {
      console.log('drawend');
      /*
      // Warn source 'on change' to save the feature
      // Don't do it now as it's not yet added to the source
      this.source.modified = true;

      // Reset interaction & button to modify
      this.buttons[1].buttonListener({
        type: 'click',
      });
	  */
      this.finish();
    }));

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

  finish() {
    console.log('finish');
    //TODO optimize & update geoJsonEl
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