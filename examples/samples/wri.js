/* global mapKeys */
/* eslint-disable camelcase */

const params = new URLSearchParams(document.location.search),
  mapFunction = 'map' + params.get('map'),
  options = {
    target: 'map',
    host: 'https://www.refuges.info/',
    mapKeys: mapKeys,
    extent: [4, 43, 8, 47],
  };

// Populate map options with URI arguments
for (const k of params.keys())
  options[k] = params.get(k);

if (typeof options.extent === 'string')
  options.extent = options.extent.split(',');

if (typeof options.id_polygone === 'string')
  options.id_polygone = parseFloat(options.id_polygone);

options.initSelect = options.initSelect === 'true';

if (typeof options.id_polygone_type === 'string')
  options.id_polygone_type = parseFloat(options.id_polygone_type);

// Load example map
window[mapFunction](options);

// Display example html
const champsEl = document.getElementById('wri-champs-' + params.get('map').toLowerCase());

if (champsEl)
  document.body.appendChild(champsEl);