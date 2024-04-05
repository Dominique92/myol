const sampleEl =
  document.getElementById('sampleList')
  .querySelectorAll('[href="' + location.search + '"]')[0];

if (sampleEl) {
  document.getElementById(sampleEl.id).style.border = '1px solid black';
  document.getElementById('item-title').innerHTML = 'WRI ' + sampleEl.title;
  document.getElementById('item-next').href = sampleEl
    .nextElementSibling
    .getAttribute('href');
}