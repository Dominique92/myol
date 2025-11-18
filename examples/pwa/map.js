/* global ol, myol */

// Strategy for loading elements based on fixed tile grid
// lon:2°=157km, lat:1°=111km
function tiledBboxStrategy(extent, resolution) {
  const extent4326 = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326'),
    tiledExtents = [];

  if (resolution > 100)
    return [ol.proj.transformExtent([-180, -90, 180, 90], 'EPSG:4326', 'EPSG:3857')]; // Full world

  for (let lon = Math.floor(extent4326[0] / 2) * 2 - 2; lon < Math.ceil(extent4326[2] / 2) * +2; lon += 2)
    for (let lat = Math.floor(extent4326[1]) - 1; lat < Math.ceil(extent4326[3]) + 1; lat++)
      tiledExtents.push(
        ol.proj.transformExtent([lon, lat, lon + 2, lat + 1], 'EPSG:4326', 'EPSG:3857')
      );

  return tiledExtents;
}

const points= new myol.layer.vector.WRI({
      strategy: tiledBboxStrategy,
      //debug: true,
    }),
    
map = new ol.Map({
  target: 'map',

  view: new ol.View({
    center: ol.proj.transform([5.7, 45.2], 'EPSG:4326', 'EPSG:3857'), // Grenoble
    constrainResolution: true, // Force zoom on the definition of available tiles
    zoom: 11,
  }),

  controls: [
    new ol.control.Zoom(),
    new ol.control.FullScreen(),
    new ol.control.ScaleLine(),
  ],

  layers: [
    // Background layer
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),

    // Vector layers
   points,

    // Hover & click management (mouse & touch)
    new myol.layer.Hover(),
  ],
});

    /* eslint-disable-next-line no-unused-vars */
function tileNumber(lat_deg, lon_deg, zoom){
const	lat_rad = lat_deg* (Math.PI / 180),
	n = 2.0 ** zoom,
	xtile = Math.round((lon_deg + 180.0) / 360.0 * n),
	ytile = Math.round((1.0 - Math.log(Math.tan(lat_rad) + (1 / Math.cos(lat_rad))) / Math.PI) / 2.0 * n);
  
  //*DCMM*/console.log([xtile, ytile, zoom]);

	return [zoom,xtile, ytile];
}

  // Compute properties when the layer is loaded & before the cluster layer is computed
      points.on('change', () => {
        
        const center4326=ol.proj.transform(map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
        if(0)
        /*DCMM*/console.log(tileNumber(
        center4326[0],
        center4326[1],
        map.getView().getZoom()
        ));
        //*DCMM*/console.log(center4326);

//*DCMM*/console.log(map.getView().getZoom());
        
        
  /*      this.logs ??= {};
        //if (this.options.debug)
          if(0)
          console.info(
            'Receive 1 tile XXX ' +
            this.logs.tileSize + ', ' +// this.getFeatures().length +
            //(this.logs.isCluster ? ' clusters, ' : ' points, ') +
            ol.proj.transform(map.getView().getCenter(this.getExtent()), 'EPSG:3857', 'EPSG:4326')
            .map(x => Math.round(x * 1000) / 1000)
            .join('°E/') + '°N'
          );*/
      });