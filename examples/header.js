const sampleListEl = document.getElementById('sampleList'),
  sampleEl = sampleListEl.querySelectorAll('[href="' + location.search + '"]')[0];

if (sampleEl) {
  document.getElementById(sampleEl.id).style.border = '1px solid black';
  document.getElementById('item-title').innerHTML = sampleEl.title;
  document.getElementById('item-next').href = sampleEl
    .nextElementSibling
    .getAttribute('href');
}