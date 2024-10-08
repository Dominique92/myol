/**
 * Permalink control
 * "map" url hash or localStorage: zoom=<ZOOM> lon=<LON> lat=<LAT>
 * Don't set view when you declare the map
 */

import Control from 'ol/control/Control.js';
import {
  transform,
} from 'ol/proj';

import './control.css';

class Permalink extends Control {
  constructor(opt) {
    const options = {
      // display: false, // {false | true} Display permalink link the map.
      // init: false, // {undefined | false | true | [<zoom>, <lon>, <lat>]} use url hash or localStorage to position the map.
      default: [6, 2, 47], // France
      // setUrl: false, // {false | true} Change url hash when moving the map.
      hash: '?', // {?, #} the permalink delimiter after the url

      ...opt,
    };

    super({
      element: document.createElement('div'),

      ...options,
    });

    this.options = options;

    if (options.display) {
      this.element.className = 'ol-control myol-permalink';
      this.linkEl = document.createElement('a');
      this.linkEl.innerHTML = 'Permalink';
      this.linkEl.title = 'Generate a link with map zoom & position';
      this.element.appendChild(this.linkEl);
    }
  }

  render(evt) {
    const view = evt.map.getView(),
      //BEST init with res=<resolution> or extent (not zoom, lon, lat)
      urlMod = (typeof this.options.init === 'object' ? // init: [<zoom>, <lon>, <lat>]
        'zoom=' + this.options.init[0] + '&lon=' + this.options.init[1] + '&lat=' + this.options.init[2] + ',' :
        '') +
      location.href.replace( // Get value from params with priority url / ? / #
        /map=([0-9.]+)\/(-?[0-9.]+)\/(-?[0-9.]+)/u, // map=<zoom>/<lon>/<lat>
        'zoom=$1&lon=$2&lat=$3' // zoom=<zoom>&lon=<lon>&lat=<lat>
      ) + ',' +
      // Last values
      'zoom=' + localStorage.myolZoom + ',' +
      'lon=' + localStorage.myolLon + ',' +
      'lat=' + localStorage.myolLat + ',' +
      // Default
      'zoom=' + this.options.default[0] + '&lon=' + this.options.default[1] + '&lat=' + this.options.default[2];

    // Set center & zoom at the init
    if (this.options.init) {
      this.options.init = false; // Only once

      view.setZoom(urlMod.match(/zoom=([0-9.]+)/u)[1]);

      view.setCenter(transform([
        urlMod.match(/lon=(-?[0-9.]+)/u)[1],
        urlMod.match(/lat=(-?[0-9.]+)/u)[1],
      ], 'EPSG:4326', 'EPSG:3857'));
    }

    // Set the permalink with current map zoom & position
    if (view.getCenter()) {
      const ll4326 = transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326'),
        newParams = 'map=' +
        (localStorage.myolZoom = Math.round(view.getZoom() * 10) / 10) + '/' +
        (localStorage.myolLon = Math.round(ll4326[0] * 10000) / 10000) + '/' +
        (localStorage.myolLat = Math.round(ll4326[1] * 10000) / 10000);

      if (this.linkEl) {
        this.linkEl.href = this.options.hash + newParams;

        if (this.options.setUrl)
          location.href = '#' + newParams;
      }
    }

    return super.render(evt);
  }
}

export default Permalink;