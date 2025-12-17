// Register service worker
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
if ('serviceWorker' in navigator)
  navigator.serviceWorker.register('service-worker.js')
  .catch(error => console.error('Service worker not registered' + error));

/*
async function getData() {
  const url = 'https://c92.fr/test/pwa/?expire=1000';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Response status: ' + response.status);
    }

    const result = await response.text();
    console.log(result.substring(15, 23));
  } catch (error) {
    console.error(error.message);
  }
}
window.onload = getData;
*/