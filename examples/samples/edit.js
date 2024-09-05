/* global ol, myol */

const snaplayer = new ol.layer.Vector({
    background: 'transparent',
    source: new ol.source.Vector({
      url: 'images/switzerland.geojson',
      format: new ol.format.GeoJSON(),
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke(),
    }),
  }),

  editorLayer = new myol.layer.Edit({
    geoJsonId: 'geojson',
  }),

  /* eslint-disable-next-line no-unused-vars */
  map = new ol.Map({
    target: 'map',

    controls: myol.control.collection({
      load: {
        receivingLayer: editorLayer,
      },
    }),

    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
      snaplayer,
      editorLayer,
    ],

    view: new ol.View({ //TODO DELETE
      center: ol.proj.fromLonLat([5, 46.5]),
      zoom: 6.4,
    }),
  });

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