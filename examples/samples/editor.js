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

  editorLayer = new myol.layer.Editor({
    geoJsonId: 'geojson',
  }),

  /* eslint-disable-next-line no-unused-vars */
  map = new ol.Map({
    target: 'map',

    controls: myol.control.collection(),

    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
      snaplayer,
      editorLayer,
    ],
  });