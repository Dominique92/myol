/**
 * GpxEdit layer to edit geoJson lines & polygons
 */
//TODO tester chemineur + wri

import ol from '../ol'; //TODO finir imports via node_modules;
import Control from 'ol/control/Control';
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {
  Draw,
  Modify,
  Select,
  Snap,
} from 'ol/interaction';

import './gpxEdit.css';

class GpxEdit extends VectorLayer {
  constructor(opt) {
    const options = {
      geoJsonId: 'geojson',
      format: new ol.format.GeoJSON(),
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
      decimals: 5, //Output precision
      tolerance: 7, // Px
      //direction: false, // Add arrows to each line segment to show the direction
      //canMerge: false, // Merge lines having a common end
      //withPolys: false, // Can edit polygons
      //withHoles: false, // Allow holes in polygons

      writeGeoJson: () => // writeGeoJson (features, lines, polys, options)
        this.options.format.writeFeatures(
          this.editedSource.getFeatures(),
          this.options,
        ),

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
      filter: (f, layer) => layer && (layer.getSource() === this.editedSource),
      style: (f, r) => this.selectStyles(f, r),
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
      style: f => this.selectStyles(f),
    });
    this.snapInteraction = new Snap({
      source: this.editedSource,
      pixelTolerance: this.options.tolerance, // Default is 10
    });

    // Buttons
    ['modify', 'draw'].forEach(intName => {
      const buttonEl = document.createElement('button'),
        element = document.createElement('div');

      element.className = 'ol-unselectable ol-control edit-button edit-button-' + intName;
      element.appendChild(buttonEl);

      const helpEl = document.getElementById('edit-help-' + intName);
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

    this.modifyInteraction.on('modifyend', () => this.optimiseAndSave());

    this.drawInteraction.on('drawend', () => {
      this.modified = true; // Wait for modifyend completion before optim
    });

    this.editedSource.on('addfeature', () => {
      if (this.modified) {
        this.modified = false;
        this.optimiseAndSave();
        this.restartInteractions('modify');
      }
    });

    // At init
    this.map.once('loadend', () => {
      this.coordinate = this.map.getView().getCenter();

      this.optimiseAndSave();
      this.restartInteractions('modify');
    });

    map.on('pointermove', evt => {
      this.coordinate = evt.coordinate;

      // Change pointer if a feature is hovered
      const selectedFeatures = this.selectInteraction.getFeatures();

      this.map.getTargetElement().classList.remove('edit-pointed');
      if (selectedFeatures.getLength()) {
        this.map.forEachFeatureAtPixel(
          evt.pixel,
          feature => {
            if (feature !== selectedFeatures.item(0))
              this.map.getTargetElement().classList.add('edit-pointed');
          }, {
            layerFilter: (layer) => layer.getSource() === this.editedSource, // Only the edited layer
            hitTolerance: this.options.tolerance, // Default is 0
          },
        );
      }
    });

    map.on('click', evt => {
      const oEvt = evt.originalEvent;

      if (!oEvt.shiftKey && oEvt.ctrlKey && !oEvt.altKey)
        this.optimiseAndSave(
          this.snapInteraction.snapTo(
            evt.pixel,
            evt.coordinate,
            map,
          ).vertex
        );
    });
  } // End setMapInternal

  restartInteractions(intName) {
    this.map.getTargetElement().firstChild.className = 'ol-viewport edit-view-' + intName;

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

  optimiseAndSave(splitCord) {
    // Get optimized coords
    const editedFeatures = this.editedSource.getFeatures(), // Get edited features
      coordinates = editedFeatures.map(
        f => this.flatFeatures(f.getGeometry()) // Get flat coordinates
      ),
      // Get all edited features as array of lines coordinates
      lines = this.flatCoord(coordinates, splitCord),
      polys = [];

    // Merge lines having a common end
    if (this.options.canMerge)
      for (const a in lines) {
        for (let b = 0; b < a; b++) { // Once each combination
          if (lines[b]) {
            const m = [a, b];

            for (let i = 4; i; i--) // 4 times
              if (lines[m[0]] && lines[m[1]]) { // Test if the line has been removed
                // Shake lines end to explore all possibilities
                m.reverse();
                lines[m[0]].reverse();
                if (this.compareCoords(lines[m[0]][lines[m[0]].length - 1], lines[m[1]][0])) {
                  // Merge 2 lines having 2 ends in common
                  lines[m[0]] = lines[m[0]].concat(lines[m[1]].slice(1)).reverse();
                  delete lines[m[1]]; // Remove the line but don't renumber the array keys
                }
              }
          }
        }
      }

    // Make polygons with looped lines
    if (this.options.withPolys)
      for (const a in lines) {
        if (this.compareCoords(lines[a])) { // If this line is closed
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
    if (this.options.withHoles)
      for (const p1 in polys) { // Explore all Polygons combinaison
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

    // Recreate features
    this.editedSource.clear();
    lines.forEach(l => {
      this.editedSource.addFeature(new Feature({
        geometry: new ol.geom.LineString(l),
      }));
    });
    polys.forEach(p => {
      this.editedSource.addFeature(new Feature({
        geometry: new ol.geom.Polygon(p),
      }));
    });

    // Save geometries in <EL> as geoJSON at every change
    if (this.geoJsonEl)
      this.geoJsonEl.value = this.options.writeGeoJson(
        this.editedSource.getFeatures(),
        lines.filter(Boolean),
        polys.filter(Boolean),
        this.options,
      ).replaceAll(',"properties":null', '');

    // Select the feature closest to the mouse position
    const selectedFeatures = this.selectInteraction.getFeatures();

    if (this.editedSource.getFeatures().length) {
      selectedFeatures.clear();
      selectedFeatures.push(
        this.editedSource.getClosestFeatureToCoordinate(this.coordinate)
      );
    }
  } // End optimiseAndSave

  flatFeatures(geom) {
    if (geom.getType().match(/collection/iu)) // Recurse Collections
      return geom.getGeometries().map(g => this.flatFeatures(g));
    return geom.getCoordinates();
  }

  // Get all lines fragments (lines, polylines, polygons, multipolygons, hole polygons, ...) at the same level
  flatCoord(coords, splitCord) {
    const lines = [];

    coords.forEach(c => {
      if (typeof c[0][0] === 'object') // Recurse for multi* or polys
        lines.push(...this.flatCoord(c, splitCord));
      else if (typeof c[0][0] === 'number') { // Lines
        if (splitCord) {
          lines.push([]);
          c.forEach(p => {
            lines[lines.length - 1].push(p);
            if (this.compareCoords(splitCord, p))
              lines.push([
                [p[0], p[1] + 1],
              ]);
          });
        } else
          lines.push(c);
      }
    });

    return lines;
  }

  compareCoords(a, b) {
    if (!a) return false;
    if (!b) return this.compareCoords(a[0], a[a.length - 1]); // Compare start with end
    return a[0] === b[0] && a[1] === b[1]; // 2 coordinates
  }

  // Style to color selected features with arrows, begin & end points
  selectStyles(feature, resolution) {
    const geometry = feature.getGeometry(),
      selectedStyle = {
        stroke: new ol.style.Stroke({
          color: 'red',
          width: 2,
        }),
        fill: new ol.style.Fill({ // Polygons
          color: 'rgba(255,0,0,0.2)',
        }),
        radius: 3, // Move & begin line marker
      },
      featureStyles = [
        new ol.style.Style(selectedStyle), // Line style
      ];

    // Circle at the ends of the line
    if (geometry.getCoordinates) {
      const coordinates = geometry.getCoordinates(),
        circlesCoords = [coordinates[0]];

      if (!this.options.direction)
        circlesCoords.push(coordinates[coordinates.length - 1]);

      circlesCoords.forEach(cc => {
        featureStyles.push(
          new ol.style.Style({
            geometry: new ol.geom.Point(cc),
            image: new ol.style.Circle(selectedStyle),
          }),
        );
      });
    }

    // Arrows to show the line direction
    if (this.options.direction && geometry.forEachSegment && resolution) {
      let last = null;

      geometry.forEachSegment((start, end) => {
        if (!last) last = start;

        const dx = end[0] - last[0],
          dy = end[1] - last[1];

        if (Math.abs(dx) + Math.abs(dy) > resolution * 50) {
          last = end;
          featureStyles.push(
            new ol.style.Style({
              geometry: new ol.geom.Point(end),
              image: new ol.style.Icon({
                rotateWithView: true,
                rotation: -Math.atan2(dy, dx),
                src: 'data:image/svg+xml;utf8,\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 6" width="10" height="10">\
<path stroke="red" d="M0 0 4 3 M4 3 0 6" />\
</svg>',
              }),
            }),
          );
        }
      });
    }

    return featureStyles;
  };
}

export default GpxEdit;