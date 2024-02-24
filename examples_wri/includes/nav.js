document.body.appendChild(document.createElement('script')).src = 'vues/nav.js';

document.getElementById('example-title').innerHTML = 'Wri carte nav';
document.getElementById('example-next').href = '?navmassif';

/* eslint-disable-next-line no-unused-vars */
var host = 'https://www.refuges.info/',
  layerOptions = {},
  id_polygone = 0,
  extent = false;