/* global ol, myol */

// Strategy for loading elements based on fixed tile grid
function tiledBboxStrategy(extent, resolution) {

  // lon:2°=157km,lat:1°=111km


  const exdeg = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
  /*DCMM*/
  console.log(exdeg);
  if (0);
  {
    /*DCMM*/
    console.log(Math.floor(exdeg[0]));
    /*DCMM*/
    console.log(Math.floor(exdeg[1] * 2) / 2);
    /*DCMM*/
    console.log(Math.ceil(exdeg[2]));
    /*DCMM*/
    console.log(Math.ceil(exdeg[3] * 2) / 2);
  }

  //for(x=Math.floor(exdeg[0])-1;x<Math.ceil(exdeg[2])+1;x++)
  //for(y=Math.floor(exdeg[1]/2)*2-2;y<Math.ceil(exdeg[3]/2)*2+2;y+=2)

  //for(x=Math.floor(exdeg[0]/2)*2-2;x<Math.ceil(exdeg[2]/2)*2+2;x+=2)
  //for(y=Math.floor(exdeg[1])-1;y<Math.ceil(exdeg[3])+1;y++)

  for (x = Math.floor(exdeg[0]) - 1; x < Math.ceil(exdeg[2]) + 1; x++)
    for (y = Math.floor(exdeg[1] * 2) / 2 - 1; y < Math.ceil(exdeg[3] * 2) / 2 + 1; y += 2) {
      /*DCMM*/
      console.log(x + '/' + y + ' à ' + (x + 1) + '/' + (y + 2));
    }


  return [extent]; // Fall back to bbox strategy

  const layer = this,
    tsur = layer.options.tiledBBoxStrategy || {},
    found = Object.keys(tsur).find(k => tsur[k] > resolution),
    tileSize = parseInt(found, 10),
    tiledExtent = [];

  if (typeof found === 'undefined')
    return [extent]; // Fall back to bbox strategy

  for (let lon = Math.floor(extent[0] / tileSize); lon < Math.ceil(extent[2] / tileSize); lon++)
    for (let lat = Math.floor(extent[1] / tileSize); lat < Math.ceil(extent[3] / tileSize); lat++)
      tiledExtent.push([
        Math.round(lon * tileSize),
        Math.round(lat * tileSize),
        Math.round(lon * tileSize + tileSize),
        Math.round(lat * tileSize + tileSize),
      ]);

  if (layer.options.debug) {
    layer.logs = {
      tileSize: Math.round(tileSize / 1414) + '*' + Math.round(tileSize / 1414) + 'km',
      isCluster: resolution > layer.options.serverClusterMinResolution,
    };
    console.info(
      'Request ' + tiledExtent.length +
      ' tile' + (tiledExtent.length > 1 ? 's ' : ' ') +
      layer.logs.tileSize + ' for ' +
      Math.round(resolution) + 'm/px resolution '
    );
  }

  return tiledExtent;
}

/* eslint-disable-next-line no-unused-vars */
const map = new ol.Map({
  target: 'map',

  view: new ol.View({
    center: ol.proj.transform([5.7, 45.2], 'EPSG:4326', 'EPSG:3857'), // Grenoble
    //constrainResolution: true, // Force zoom on the definition of available tiles
    zoom: 10,
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
    new myol.layer.vector.WRI({
      //selectName: 'select-wri-tiled',
      strategy: tiledBboxStrategy,
      /*tiledBBoxStrategy: { // Static tiled bbox. 1 Mercator unit = 0.7 meter at lat = 45° : cos(45°)
        50000: 100, // tilesize = 10 000 Mercator units = 35 km until resolution = 100 meters per pixel
        570000: 1000, // tilesize = 400 km until resolution = 1 km per pixel
        14000000: Infinity, // tilesize = 10 000 km above
      },*/
      debug: true,
    }),

    // Hover & click management (mouse & touch)
    new myol.layer.Hover(),
  ],
});