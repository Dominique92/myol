/**
 * MyOpenlayers example & test helper
 */

// Include specific w3-include html & script
const sampleName = new URLSearchParams(window.location.search).get('sample') || 'index',
  scriptEl = document.createElement('script');

function replaceInclude() {
  document.body.querySelectorAll('[w3-include]').forEach(el => {
    const fileName = el.getAttribute('w3-include')
      .replace('SAMPLE', sampleName);

    el.removeAttribute('w3-include'); // Remove attribute to do not do it several time

    if (el.tagName === 'SCRIPT') {
      scriptEl.type = 'text/javascript';
      scriptEl.src = fileName;
      document.head.appendChild(scriptEl);
    } else {
      fetch(fileName)
        .then(response => response.text())
        .then(text => {
          if (el.tagName === 'LINK')
            el.outerHTML = text; // Just replace the tag
          else
            el.innerHTML = text
            .replace(/<script.*vite.*script>/u, '') // Remove vite scripts tags
            .replace(/\/\*.*\*\//gu, '') // Remove /* comments */
            .replace(/\/\/#.*/u, '') // Remove //# sourceMappingURL
            .trim();

          replaceInclude(); // Iterate recursively if any tag w3-include has been included
        });
    }
  });
};
replaceInclude(); // Do it the first time

myol.trace();

///////////////////////////////////////////////////////

const tt = '[href*="'+window.location.search.substring(1)+'"]';
const ell = document.body.querySelectorAll(tt);
/*DCMM*/{var _r=tt+' = ',_v=ell.length;if(typeof _v=='array'||typeof _v=='object'){for(let _i in _v)if(typeof _v[_i]!='function'&&_v[_i])_r+=_i+'='+typeof _v[_i]+' '+_v[_i]+' '+(_v[_i]&&_v[_i].CLASS_NAME?'('+_v[_i].CLASS_NAME+')':'')+"\n"}else _r+=_v;console.log(_r)}

if (0) { /////////////////////////

  // Analyse url & args
  const urlParams = {};
  let sampleName2 = 'index';

  for (const p of new URLSearchParams(location.search))
    if (p[1])
      urlParams[p[0]] = JSON.parse(p[1]);
    else
      sampleName2 = p[0];

  // Helper
  function getText(fileName) {
    return fetch(fileName)
      .then(response => response.text())
      .then(text => text
        .replace(/<script.*vite.*script>/u, '') // Remove vite scripts tags
        .replace(/\/\*.*\*\//gu, '') // Remove /* comments */
        .replace(/\/\/#.*/u, '') // Remove //# sourceMappingURL
        .trim()
      );
  }

  // Populate the body
  (async function() {
    document.body.insertAdjacentHTML('afterbegin', await getText('samples/' + sampleName2 + '.html'));
    document.body.insertAdjacentHTML('afterbegin', await getText('header.html'));

    const sampleCodeEl = document.getElementById('sample-code');
    sampleCodeEl.insertAdjacentHTML('afterbegin', await getText('samples/' + sampleName2 + '.js'));

    // Load & run the sample script
    const script = document.createElement('script');
    script.src = 'samples/' + sampleName2 + '.js';
    document.head.appendChild(script);

    // Search the sample data in the header.html & populate the tags
    const sampleEl = document.querySelector('a[href="' + (location.search || '.') + '"]');
    if (sampleEl) {
      sampleEl.style.border = '1px solid black';

      document.getElementById('sample-title').innerHTML = sampleEl.title;
      document.getElementById('sample-next').setAttribute('href', sampleEl.nextElementSibling.href);
    }

  })();

} //////////////////////////////

// Default keys for development only
/* eslint-disable-next-line no-unused-vars */
const mapKeys = {
  bing: 'AldBMbaKNyat-j6CBRKxxH05uaxP7dvQu1RnMWCQEGGC3z0gjBu-bLniE_8WZvcC',
  //https://www.microsoft.com/en-us/maps/create-a-bing-maps-key
  ign: 'ry2ju17rbtmlujviy8njbv5i',
  // https://geoservices.ign.fr/
  kompass: '2ba8c124-38b6-11e7-ade1-e0cb4e28e847',
  // https://manage.thunderforest.com/dashboard
  mapbox: 'pk.eyJ1IjoiZG9taW5pcXVlOTIiLCJhIjoiY2xtOWprMmZmMGcwejNlbzVvOTl3dmt2eSJ9.B9IsLuXTDBarbCY4_YTIrQ',
  // http://www.kompass.de/livemap/
  maptiler: 'YiOqxKkIAWZyREPRjd7d',
  // https://www.mapbox.com/
  os: 'P8MjahLAlyDAHXEH2engwXJG6KDYsVzF',
  // https://osdatahub.os.uk/
  // SwissTopo : register your domain
  // https://shop.swisstopo.admin.ch/fr/products/geoservice/swisstopo_geoservices/WMTS_info
  thunderforest: 'ee751f43b3af4614b01d1bce72785369',
  // https://www.mapbox.com/
};