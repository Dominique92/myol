/**
 * Edit.js
 * geoJson lines & polygons edit
 */

import ol from '../ol';
import './edit.css';

function strokeFill(deep) {
  return {
    stroke: new ol.style.Stroke({
      color: 'red',
      width: deep,
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0,0,255,0.' + deep + ')',
    }),
  };
}

// Style of edited features display
function displayStyle() {
  return new ol.style.Style({
    // Marker
    image: new ol.style.Circle({
      radius: 4,
      ...strokeFill(2),
    }),
    ...strokeFill(2),
  });
}

// Style to color selected (hoveres) features with begin & end points
function selectStyles(feature) {
  const geometry = feature.getGeometry(),
    featureStyles = [
      new ol.style.Style(strokeFill(3)),
    ],
    summits = [];

  if (geometry.forEachSegment) {
    geometry.forEachSegment((start, end) => {
      summits.push(start);
      summits[1] = end;
    });
    featureStyles.push(
      new ol.style.Style({
        geometry: new ol.geom.Point(summits[0]),
        image: new ol.style.Circle({
          radius: 5,
          ...strokeFill(2),
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
class Edit extends ol.layer.Vector {
  constructor(opt) {
    const options = {
      geoJsonId: 'geojson',
      format: new ol.format.GeoJSON(),
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',

      ...opt,
    }

    // The data entry
    const geoJsonEl = document.getElementById(options.geoJsonId) || {}, // Read data in an html element
      geoJson = geoJsonEl.value || geoJsonEl.innerHTML || '{"type":"FeatureCollection","features":[]}';

    // The editor source
    const editedSource = new ol.source.Vector({
      features: options.format.readFeatures(geoJson, options),
      wrapX: false,

      ...options,
    });

    // The editor layer
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
    this.snapSource = new ol.source.Vector({});

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
        traceSource: this.snapSource,
        trace: true,
        style: displayStyle,
        stopClick: true, // Avoid zoom when you finish drawing by doubleclick
      }),
      new ol.interaction.Draw({ // 3 Draw poly
        type: 'Polygon',
        source: this.editedSource,
        traceSource: this.snapSource,
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

      this.finish();
    });

    // End of line & poly drawing
    [2, 3].forEach(i => this.interactions[i].on('drawend', () => {
      console.log('drawend');

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
      buttonEl.addEventListener('click', () => this.restartInteractions(noInteraction));

      map.addControl(new ol.control.Control({
        element: element,
      }));
    });

    // Init interaction & button to modify at the beginning & when a file is loaded
    this.map.on('loadend', () => this.restartInteractions(0));
  } // End setMapInternal

  restartInteractions(noInteraction) {
    console.log('restartInteractions');
    this.map.getTargetElement().firstChild.className = 'ol-viewport ed-view-' + noInteraction;

    this.interactions.forEach(interaction => this.map.removeInteraction(interaction));

    this.map.addInteraction(this.interactions[noInteraction]);
    this.map.addInteraction(this.interactionSnap); // Must be added after the others

    // For snap & traceSource : register again the full list of features as addFeature manages already registered
    this.snapSource.clear();
    this.map.getLayers().forEach(layer => {
      if (layer.getSource() && layer.getSource().getFeatures) // Vector layers only
        layer.getSource().getFeatures().forEach(feature => {
          this.interactionSnap.addFeature(feature);
          this.snapSource.addFeature(feature);
        });
    });
  }

  finish() {
    console.log('finish');
    //TODO optimize & update geoJsonEl
  }
}

export default Edit;

/*//TODO new editor
//TODO BUG edit polygone : ne peut pas supprimer un côté
//TODO move only one summit when dragging
//TODO Ctrl+Alt+click on summit : delete the line or poly
//TODO Alt+click on segment : delete the segment & split the line
Inverser une ligne

https://github.com/openlayers/openlayers/issues/11608
https://openlayers.org/en/latest/examples/modify-features.html
Move 1 vertex from double (line / polygons, …
	Dédouble / colle line
	Défait / colle polygone
Quand interaction finie : transforme line -> poly si les 2 extrémités sont =

Delete selected feature
*/