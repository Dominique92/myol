Dominique92.MyOl
================
This package intent to make you able to implement an [OPENLAYER MAP](https://openlayers.org/) in your own website.

SIMPLE EXAMPLE
==============
This [EXAMPLE DEMO](https://dominique92.github.io/MyOl/) implements a single map with the most current maps layers providers.
You can download the [DISTRIBUTION ZIPPED PACKAGE](https://github.com/Dominique92/MyOl/archive/master.zip) and unzip it in your website FTP section.
See the [FULL HTML EXAMPLE CODE](https://raw.githubusercontent.com/Dominique92/MyOl/master/index.html)
You can include the includes, css & javascript sections of this example on your own page (adjust the include files path to your implementation)
If you want to use the France IGN, Microsoft BING & OSM thunderforest map layers, you must acquire a free key and replace it in the html (see source comment)


FULL FUNCTIONS EXAMPLE
======================
MyOL extension provides supplementary functions to [Openlayers V5](https://openlayers.org/)
* GeoJson ajax layers,
* Multi vendors maps &amp; projections:
```
- OSM, Maps.Refuges.Info
- ThunderForest Outdoors, Cycles, Landscape, Transport
- IGN France, cadastre, photos
- SwissTopo
- IDEE España, photos
- IGM Italie
- OS Great Britain
- Kompass Austria
- Bing Microsoft, photos
- Google maps, photos
```
* Editable position marker with multi-projection position display,
* Polylines editor.
* Keep position, zoom & zoom on cookies

ARCHITECTURE
============
Just include myol.js & myos.css after ol/dist, proj4js & geocoder's js & css
See index.html for example

Code & all tiled layers use EPSG:3857 spherical mercator projection

The coding rules are volontary simple & don't follow all openlayers's
* No class, no inheritage, no jquery...
* Each adaptation is included in a single JS function that you can include separately (check dependencies if any)
* Feel free to use, modify & share as you want

[See a DEMO here](https://dominique92.github.io/MyOl/examples/)

FILES
=====
* ol/... : Openlayer last stable distribution files from [Openlayers GitHub](https://github.com/openlayers/openlayers)
* geocoder/... : Openlayer geocoder last stable distribution files from [Openlayers geocoder GitHub](https://github.com/jonataswalker/ol-geocoder)
* examples/... : Demo files or ongoing developments
* myol.css : Specific CSS presentation
* myol.js : Specific CSS extensions
* index.html : Simple demo
