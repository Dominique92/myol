/**
 * Edit.js
 * geoJson lines & polygons edit
 */

import ol from '../ol';
import Control from 'ol/control/Control.js';
import Feature from 'ol/Feature.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';

import './edit.css';

// OPTIMIZE LINES & POLYS
function compareCoords(a, b) {
  if (!a) return false;
  if (!b) return compareCoords(a[0], a[a.length - 1]); // Compare start with end
  return a[0] === b[0] && a[1] === b[1]; // 2 coordinates
}

// Get all lines fragments (lines, polylines, polygons, multipolygons, hole polygons, ...)
// at the same level & split if one point = selectedVertex
function flatCoord(lines, coords, selectedVertex) {
  if (coords.length && typeof coords[0][0] === 'object') {
    // Multi*
    for (const c1 in coords)
      flatCoord(lines, coords[c1], selectedVertex);
  } else {
    // LineString
    const begCoords = []; // Coords before the selectedVertex

    while (coords.length) {
      const c = coords.shift();

      if (!coords.length || !compareCoords(c, coords[0])) { // Skip duplicated points
        if (selectedVertex && compareCoords(c, selectedVertex))
          break; // Ignore this point and stop selection

        begCoords.push(c);
      }
    }

    lines.push(begCoords, coords);
  }
}

function flatFeatures(geom, points, lines, polys, selectedVertex) {
  // Expand geometryCollection
  if (geom.getType() === 'GeometryCollection') {
    const geometries = geom.getGeometries();

    for (const g in geometries)
      flatFeatures(geometries[g], points, lines, polys, selectedVertex);
  }
  // Point
  else if (geom.getType().match(/point$/iu))
    points.push(geom.getCoordinates());

  // line & poly
  else
    // Get lines or polyons as flat array of coordinates
    flatCoord(lines, geom.getCoordinates(), selectedVertex);
}

// Refurbish Lines & Polygons
// Split lines having a summit at selectedVertex
function optimiseFeatures(options, features, selectedVertex) {
  const points = [],
    lines = [],
    polys = [];

  // Get all edited features as array of coordinates
  for (const f in features)
    flatFeatures(features[f].getGeometry(), points, lines, polys, selectedVertex);

  for (const a in lines)
    // Exclude 1 coordinate features (points)
    if (lines[a].length < 2)
      delete lines[a];

    // Merge lines having a common end
    else if (options.canMerge)
    for (let b = 0; b < a; b++) // Once each combination
      if (lines[b]) {
        const m = [a, b];

        for (let i = 4; i; i--) // 4 times
          if (lines[m[0]] && lines[m[1]]) { // Test if the line has been removed
            // Shake lines end to explore all possibilities
            m.reverse();
            lines[m[0]].reverse();
            if (compareCoords(lines[m[0]][lines[m[0]].length - 1], lines[m[1]][0])) {
              // Merge 2 lines having 2 ends in common
              lines[m[0]] = lines[m[0]].concat(lines[m[1]].slice(1));
              delete lines[m[1]]; // Remove the line but don't renumber the array keys
            }
          }
      }

  // Make polygons with looped lines
  for (const a in lines)
    if (options.editOnly !== 'line' && lines[a]) {
      // Close open lines
      if (options.editOnly === 'poly')
        if (!compareCoords(lines[a]))
          lines[a].push(lines[a][0]);

      if (compareCoords(lines[a])) { // If this line is closed
        // Split squeezed polygons
        // Explore all summits combinaison
        for (let i1 = 0; i1 < lines[a].length - 1; i1++)
          for (let i2 = 0; i2 < i1; i2++)
            if (lines[a][i1][0] === lines[a][i2][0] &&
              lines[a][i1][1] === lines[a][i2][1]) { // Find 2 identical summits
              const squized = lines[a].splice(i2, i1 - i2); // Extract the squized part
              squized.push(squized[0]); // Close the poly
              polys.push([squized]); // Add the squized poly
              i1 = lines[a].length; // End loop
              i2 = lines[a].length;
            }

        // Convert closed lines into polygons
        polys.push([lines[a]]); // Add the polygon
        delete lines[a]; // Forget the line
      }
    }

  // Makes holes if a polygon is included in a biggest one
  for (const p1 in polys) // Explore all Polygons combinaison
    if (options.withHoles && polys[p1]) {
      const fs = new ol.geom.Polygon(polys[p1]);

      for (const p2 in polys)
        if (polys[p2] && p1 !== p2) {
          let intersects = true;
          for (const c in polys[p2][0])
            if (!fs.intersectsCoordinate(polys[p2][0][c]))
              intersects = false;
          if (intersects) { // If one intersects a bigger
            polys[p1].push(polys[p2][0]); // Include the smaler in the bigger
            delete polys[p2]; // Forget the smaller
          }
        }
    }

  return {
    points: points,
    lines: lines.filter(Boolean), // Remove deleted array members
    polys: polys.filter(Boolean),
  };
}

// STYLES
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

//TODO editPoly: false, => optimise / export
//TODO BUG edit polygone : ne peut pas supprimer un côté
//TODO move only one summit when dragging
//TODO Quand interaction finie : transforme line -> poly si les 2 extrémités sont =
/*
https://github.com/openlayers/openlayers/issues/11608
https://openlayers.org/en/latest/examples/modify-features.html
Move 1 vertex from double (line / polygons, …
	Dédouble / colle line
	Défait / colle polygone
*/

// EDITOR
class Edit extends VectorLayer {
  constructor(opt) {
    const options = {
      geoJsonId: 'geojson',
      format: new ol.format.GeoJSON(),
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
      //editPoly: false | true, // output are lines | polygons

      featuresToSave: () => this.options.format.writeFeatures(
        //TODO put getFeatures in main method
        this.editedSource.getFeatures(), {
          dataProjection: this.options.dataProjection,
          featureProjection: this.map.getView().getProjection(),
          decimals: 5,
        }),

      ...opt,
    }

    // The data entry
    const geoJsonEl = document.getElementById(options.geoJsonId) || {}, // Read data in an html element
      geoJson = geoJsonEl.value.trim() ||
      geoJsonEl.innerHTML.trim() ||
      '{"type":"FeatureCollection","features":[]}';

    // The editor source
    const editedSource = new VectorSource({
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

    this.options = options;
    this.geoJsonEl = geoJsonEl;
    this.editedSource = editedSource;
  } // End constructor

  setMapInternal(map) {
    super.setMapInternal(map);
    this.map = map;

    // Interactions & buttons
    this.snapSource = new VectorSource({});

    this.interactions = [
      new ol.interaction.Modify({ // 0 Modify
        source: this.editedSource,
        pixelTolerance: 16, // Default is 10
        style: displayStyle,
      }),
      new ol.interaction.Select({ // 1 Select
        condition: ol.events.condition.pointerMove,
        filter: (feature, layer) => layer.getSource() === this.editedSource,
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
    ];

    if (this.options.editPoly)
      this.interactions.push(
        new ol.interaction.Draw({ // 3 Draw poly
          type: 'Polygon',
          source: this.editedSource,
          traceSource: this.snapSource,
          trace: true,
          style: displayStyle,
          stopClick: true, // Avoid zoom when you finish drawing by doubleclick
        }));

    this.interactionSnap = new ol.interaction.Snap({
      source: this.editedSource,
      pixelTolerance: 7.5, // 6 + line width / 2 : default is 10
    });

    this.interactions.forEach((interaction, noInteraction) => {
      // Draw buttons
      const buttonEl = document.createElement('button'),
        element = document.createElement('div');

      element.className = 'ol-unselectable ol-control ed-button ed-button-' + noInteraction;
      element.appendChild(buttonEl);

      const helpEl = document.getElementById('ed-help' + noInteraction);
      if (helpEl)
        element.appendChild(helpEl);

      // Add listeners to the buttons
      buttonEl.addEventListener('click', () => this.restartInteractions(noInteraction));

      ['modifyend', 'drawend'].forEach(event =>
        this.interactions[noInteraction].on(event, evt => this.endIntercation(evt))
      );

      // Add the button to the map
      map.addControl(new Control({
        element: element,
      }));
    });

    // Init interaction & button to modify at the beginning & when a file is loaded
    this.map.on('loadend', () => {
      this.optimiseEdited();
      this.restartInteractions(0);
    });
    this.map.on('click', evt => this.mapClick(evt));
  } // End setMapInternal

  restartInteractions(noInteraction) {
    this.map.getTargetElement().firstChild.className = 'ol-viewport ed-view-' + noInteraction;

    this.interactions.forEach(interaction => this.map.removeInteraction(interaction));

    this.map.addInteraction(this.interactions[noInteraction]);
    this.map.addInteraction(this.interactionSnap); // Must be added after the others

    // For snap & traceSource : register again the full list of features as addFeature manages already registered
    this.snapSource.clear();
    this.map.getLayers().forEach(layer => {
      if (layer.getSource() !== this.editedSource &&
        layer.getSource() &&
        layer.getSource().getFeatures) // Vector layers only
        layer.getSource().getFeatures().forEach(feature => {
          this.interactionSnap.addFeature(feature);
          this.snapSource.addFeature(feature);
        });
    });
  }

  endIntercation(evt) {
    console.log(evt.type); //TODO

    this.optimiseEdited();
    this.restartInteractions(0);
  }

  mapClick(evt) {
    this.interactions[1].getFeatures().forEach(feature => {
      const coordinates = feature.getGeometry().getCoordinates();

      // Shift + click : reverse line direction
      if (evt.originalEvent.shiftKey &&
        typeof coordinates[0][0] === 'number') {
        this.editedSource.removeFeature(feature);
        this.editedSource.addFeature(new Feature({
          geometry: new ol.geom.LineString(coordinates.reverse()),
        }));
      }

      // Alt + click : delete line
      if (evt.originalEvent.altKey)
        this.editedSource.removeFeature(feature);

      this.optimiseEdited();
    });
  }

  // Processing the data
  optimiseEdited(selectedVertex) {
    // Get edited features
    const coordinates = optimiseFeatures(
      this.options,
      this.editedSource.getFeatures(),
      selectedVertex, //TODO
    );

    // Recreate features
    this.editedSource.clear();

    //BEST Multilinestring / Multipolygon
    for (const l in coordinates.lines)
      this.editedSource.addFeature(new Feature({
        geometry: new ol.geom.LineString(coordinates.lines[l]),
      }));
    for (const p in coordinates.polys)
      this.editedSource.addFeature(new Feature({
        geometry: new ol.geom.Polygon(coordinates.polys[p]),
      }));

    // Save geometries in <EL> as geoJSON at every change
    if (this.geoJsonEl && this.map.getView())
      this.geoJsonEl.value = this.options.featuresToSave(coordinates)
      .replace(/,"properties":(\{[^}]*\}|null)/u, '');
  }
}

export default Edit;