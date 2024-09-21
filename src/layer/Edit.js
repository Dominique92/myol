/**
 * Edit.js
 * geoJson lines & polygons edit
 */
//TODO interactions avec load / download, ...

import ol from '../ol';
import Control from 'ol/control/Control.js';
import Feature from 'ol/Feature.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import {
  Draw,
  Modify,
  Select,
  Snap,
} from 'ol/interaction.js';

import './edit.css';

// OPTIMIZE LINES & POLYS
function compareCoords(a, b) {
  if (!a) return false;
  if (!b) return compareCoords(a[0], a[a.length - 1]); // Compare start with end
  return a[0] === b[0] && a[1] === b[1]; // 2 coordinates
}

// Get all lines fragments (lines, polylines, polygons, multipolygons, hole polygons, ...) at the same level
function flatCoord(lines, coords) {
  if (coords.length && typeof coords[0][0] === 'object') {
    // Multi*
    for (const c1 in coords)
      flatCoord(lines, coords[c1]);
  } else {
    // LineString
    const begCoords = [];

    while (coords.length) {
      const c = coords.shift();

      if (!coords.length || !compareCoords(c, coords[0])) { // Skip duplicated points
        begCoords.push(c);
      }
    }
    lines.push(begCoords, coords);
  }
}

function flatFeatures(geom, lines) {
  // Expand geometryCollection
  if (geom.getType() === 'GeometryCollection') {
    const geometries = geom.getGeometries();

    for (const g in geometries)
      // Recurse collections
      flatFeatures(geometries[g], lines);
  } else if (!geom.getType().match(/point$/iu)) { // Exclude Points
    // Get lines or polyons as flat array of coordinates
    flatCoord(lines, geom.getCoordinates());
  }
}

// Refurbish Lines & Polygons
function optimizeFeatures(features, options) {
  const lines = [],
    polys = [];

  // Get all edited features as array of lines coordinates
  features.forEach(f => flatFeatures(f.getGeometry(), lines));

  // Exclude 1 coordinate features (points)
  for (const a in lines)
    if (lines[a].length < 2)
      delete lines[a];

  // Merge lines having a common end
  for (const a in lines) {
    for (let b = 0; b < a; b++) { // Once each combination
      if (lines[b]) {
        const m = [a, b];

        for (let i = 4; i; i--) // 4 times
          if (lines[m[0]] && lines[m[1]]) { // Test if the line has been removed
            // Shake lines end to explore all possibilities
            m.reverse();
            lines[m[0]].reverse();
            if (compareCoords(lines[m[0]][lines[m[0]].length - 1], lines[m[1]][0])) {
              // Merge 2 lines having 2 ends in common
              lines[m[0]] = lines[m[0]].concat(lines[m[1]].slice(1)).reverse();
              delete lines[m[1]]; // Remove the line but don't renumber the array keys
            }
          }
      }
    }
  }

  // Make polygons with looped lines
  for (const a in lines)
    if (options.editOnly !== 'line') {
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

        // Convert closed lines to polygons
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
    lines: lines.filter(Boolean), // Remove deleted array members
    polys: polys.filter(Boolean),
  };
}

// STYLES
// Style to color selected features with begin & end points
function selectStyles(feature, resolution) {
  const geometry = feature.getGeometry(),
    selectStyle = {
      stroke: new ol.style.Stroke({
        color: '#3399CC',
        width: 3,
      }),
      fill: new ol.style.Fill({ // Polygons
        color: 'rgba(51,153,204,0.1)',
      }),
      radius: 4, // Move & begin line marker
    },
    featureStyles = [
      new ol.style.Style(selectStyle), // Line style
    ];

  // Circle at the begining of the line
  if (geometry.getCoordinates)
    featureStyles.push(
      new ol.style.Style({
        geometry: new ol.geom.Point(geometry.getCoordinates()[0]),
        image: new ol.style.Circle(selectStyle),
      }),
    );

  // Arrows
  //TODO if option
  //TODO document all options
  if (geometry.forEachSegment)
    geometry.forEachSegment((start, end) => {
      const dx = end[0] - start[0],
        dy = end[1] - start[1];

      if (Math.abs(dx) + Math.abs(dy) > resolution * 20) {
        featureStyles.push(
          new ol.style.Style({
            geometry: new ol.geom.Point(end),
            image: new ol.style.Icon({
              rotateWithView: true,
              rotation: -Math.atan2(dy, dx),
              src: 'data:image/svg+xml;utf8,\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 6" width="10" height="10">\
<path stroke="royalblue" d="M0 0 4 3 M4 3 0 6" />\
</svg>',
            }),
          }),
        );
      }
    });

  return featureStyles;
};

// EDITOR
class Edit extends VectorLayer {
  constructor(opt) {
    const options = {
      geoJsonId: 'geojson',
      format: new ol.format.GeoJSON(),
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
      tolerance: 7, // Px
      //editPoly: false | true, // output are lines | polygons

      ...opt,
    }

    // Read data in an html element
    const geoJsonEl = document.getElementById(options.geoJsonId) ||
      document.createElement('textarea'),
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
      zIndex: 400, // Editor & cursor : above the features
      ...options,
    });

    this.options = options;
    this.geoJsonEl = geoJsonEl;
    this.editedSource = editedSource;
    this.snapSource = new VectorSource({});
  } // End constructor

  setMapInternal(map) {
    super.setMapInternal(map);
    this.map = map;

    // Interactions
    this.selectInteraction = new Select({
      hitTolerance: this.options.tolerance, // Default is 0
      toggleCondition: ol.events.never, // No deselection on shift click
      //condition: ol.events.never, // No deselection on click
      //removeCondition: ol.events.never, // No deselection on click
      filter: (f, layer) => layer && (layer.getSource() === this.editedSource),
      style: selectStyles,
    });
    this.modifyInteraction = new Modify({
      features: this.selectInteraction.getFeatures(),
      pixelTolerance: this.options.tolerance, // Default is 10
    });
    this.drawInteraction = new Draw({ // Draw line
      type: 'LineString',
      source: this.editedSource,
      traceSource: this.snapSource,
      trace: true,
      stopClick: true, // Avoid zoom when finish drawing by doubleclick
    });
    this.snapInteraction = new Snap({
      source: this.editedSource,
      pixelTolerance: this.options.tolerance, // Default is 10
    });

    // Buttons
    ['modify', 'draw'].forEach(intName => {
      const buttonEl = document.createElement('button'),
        element = document.createElement('div');

      element.className = 'ol-unselectable ol-control ed-button ed-button-' + intName;
      element.appendChild(buttonEl);

      const helpEl = document.getElementById('ed-help-' + intName);
      if (helpEl)
        element.appendChild(helpEl);

      buttonEl.addEventListener('click', () => this.restartInteractions(intName));

      // Add the button to the map
      map.addControl(new Control({
        element: element,
      }));
    });

    // Interactions listeners
    this.modifyInteraction.on('modifystart', evt => {
      console.log('modifystart');

      const oEvt = evt.mapBrowserEvent.originalEvent,
        selectedFeature = this.selectInteraction.getFeatures().item(0),
        coordinates = selectedFeature.getGeometry().getCoordinates();

      // Shift + click : reverse line direction
      if (oEvt.shiftKey && !oEvt.ctrlKey && !oEvt.altKey &&
        typeof coordinates[0][0] === 'number') {
        this.editedSource.removeFeature(selectedFeature);

        this.editedSource.addFeature(new Feature({
          geometry: new ol.geom.LineString(coordinates.reverse()),
        }));
      }

      // Ctrl+Alt+click on segment : delete the line or poly
      if (!oEvt.shiftKey && oEvt.ctrlKey && oEvt.altKey)
        this.editedSource.removeFeature(selectedFeature);
    });

    this.modifyInteraction.on('modifyend', evt => {
      console.log('modifyend');

      const oEvt = evt.mapBrowserEvent.originalEvent,
        selectedFeature = this.selectInteraction.getFeatures().item(0);

      // Ctrl + click : split line / convert polygon to lines
      //TODO Ctrl+Click  polygon immediately convert it
      if (!oEvt.shiftKey && oEvt.ctrlKey && !oEvt.altKey) {
        const mouseCoords = evt.mapBrowserEvent.coordinate,
          featureCoords = evt.features.item(0).getGeometry().getCoordinates(),
          inCoords = typeof featureCoords[0][0] === 'number' ? [featureCoords] : featureCoords, // Lines / Polys
          outCoords = [];

        inCoords.forEach(inLine => {
          outCoords.push([]);
          inLine.forEach(coords => {
            outCoords[outCoords.length - 1].push(coords);
            // Split the coordinates array in 2
            if (coords[0] === mouseCoords[0] && coords[1] === mouseCoords[1])
              outCoords.push([
                [coords[0], coords[1] + 1]
              ]);
          });
        });

        this.editedSource.removeFeature(selectedFeature);
        outCoords.forEach(coords => {
          this.editedSource.addFeature(new Feature({
            geometry: new ol.geom.LineString(coords),
          }));
        });
      }

      this.optimiseAndSave();
    });

    this.drawInteraction.on('drawend', () => this.optimiseAndSave());
    this.map.once('loadend', () => this.optimiseAndSave());

    map.on('pointermove', evt => {
      this.map.getTargetElement().classList.add('ed-selected');
      this.pixel = evt.pixel;
    });
  } // End setMapInternal

  restartInteractions(intName) {
    console.log('restartInteractions ' + intName);

    this.map.getTargetElement().firstChild.className = 'ol-viewport ed-view-' + intName;

    ['select', 'modify', 'draw', 'snap'].forEach(i =>
      this.map.removeInteraction(this[i + 'Interaction'])
    );

    if (intName === 'modify')
      this.map.addInteraction(this.selectInteraction);

    this.map.addInteraction(this[intName + 'Interaction']);
    this.map.addInteraction(this.snapInteraction); // Must be added after the others

    // For snap & traceSource : register again the full list of features as addFeature manages already registered
    this.snapSource.clear();
    this.map.getLayers().forEach(layer => {
      if (layer.getSource() !== this.editedSource &&
        layer.getSource() &&
        layer.getSource().getFeatures) // Vector layers only
        layer.getSource().getFeatures().forEach(feature => {
          this.snapInteraction.addFeature(feature);
          this.snapSource.addFeature(feature);
        });
    });
  }

  optimiseAndSave() {
    console.log('optimiseAndSave');

    // Get optimized coords
    const optCoords = optimizeFeatures(
      this.editedSource.getFeatures(), // Get edited features
      this.options,
    );

    // Body class to handle edit polys only
    if (!optCoords.lines.length && optCoords.polys.length)
      document.body.classList.add('edit-only-polys');
    else
      document.body.classList.remove('edit-only-polys');

    // Recreate features
    this.editedSource.clear();
    optCoords.lines.forEach(line => {
      this.editedSource.addFeature(new Feature({
        geometry: new ol.geom.LineString(line),
        //BEST Multilinestring / Multipolygon
      }));
    });
    optCoords.polys.forEach(poly => {
      this.editedSource.addFeature(new Feature({
        geometry: new ol.geom.Polygon(poly),
      }));
    });

    // Save geometries in <EL> as geoJSON at every change
    //TODO only poly for WRI
    if (this.geoJsonEl)
      this.geoJsonEl.value = this.options.format.writeFeatures(
        this.editedSource.getFeatures(), {
          dataProjection: this.options.dataProjection,
          featureProjection: this.map.getView().getProjection(),
          decimals: 5,
        })
      .replace(/,"properties":(\{[^}]*\}|null)/u, '');

    // Select the closest feature
    setTimeout(() => { // Do it later from the stabilized features
      const editedFeatures = this.editedSource.getFeatures();

      // Search the feature at the mouse position
      this.map.forEachFeatureAtPixel(
        this.pixel || [0, 0],
        feature => {
          editedFeatures[0] = feature;
        }, {
          layerFilter: layer => layer.getSource() === this.editedSource,
          hitTolerance: this.options.tolerance, // Default is 0
        },
      );

      // Or the first edited feature
      this.selectInteraction.getFeatures().clear();
      if (editedFeatures.length)
        this.selectInteraction.getFeatures().push(editedFeatures[0]);
    });

    this.restartInteractions('modify');
  }
}

export default Edit;