//TODO warnings lint

const params = new URLSearchParams(document.location.search),
  mapFunction = 'map' + params.get('map'),
  options = {
    target: 'map',
    host: 'https://www.refuges.info/',
    mapKeys: mapKeys,
    extent: [4, 43.5, 8.5, 47],
  },
  scriptSampleEl = document.getElementById('script-sample'),
  htmlSampleEl = document.getElementById('html-sample');

for (const k of params.keys())
  options[k] = params.get(k);

if (scriptSampleEl)
  scriptSampleEl.addEventListener('load', () => {
    //TODO ne charge pas toujours la carte => Revoir ordre de chargement des fichiers
    const scriptCartesEl = document.getElementById('script-cartes');

    if (scriptCartesEl)
      scriptCartesEl.addEventListener('load', () => {
        console.log(mapFunction);
        window[mapFunction](options);
      });

    if (htmlSampleEl)
      htmlSampleEl.addEventListener('load', () => {
        const champsEl = document.getElementById('champs-wri');

        if (champsEl)
          //TODO ne démasque pas les champs
          champsEl.style.display = 'block';
      });
  });

const args = window.location.search || '?sample=wri&map=Index',
  miEls = document.body.querySelectorAll('[href="' + args + '"]'),
  menuItemEl = miEls ? miEls[miEls.length - 1] : null,
  titleEl = document.getElementById('sample-title'),
  nextEl = document.getElementById('sample-next');

if (menuItemEl) {
  menuItemEl.classList.add('menu-selected');
  if (titleEl)
    titleEl.innerHTML = menuItemEl.title;
  if (nextEl && menuItemEl.nextElementSibling)
    nextEl.href = menuItemEl.nextElementSibling.href;
}