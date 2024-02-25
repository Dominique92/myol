document.body.appendChild(document.createElement('script')).src = 'vues/nav.js';

document.getElementById('example-title').innerHTML = 'Wri carte nav massif';
document.getElementById('example-next').href = '?editmassif';

/* eslint-disable no-unused-vars */
var host = 'https://www.refuges.info/',
  layerOptions = {},
  id_polygone = 4, // Vercors
  extent = [5.03, 44.69, 5.72, 45.32];