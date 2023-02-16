// Ease validators
/* jshint esversion: 9 */
if (!ol) var ol = {};

/**
 * Debug facilities on mobile
 */
//HACK use hash ## for error alerts
if (!location.hash.indexOf('##'))
	window.addEventListener('error', function(evt) {
		alert(evt.filename + ' ' + evt.lineno + ':' + evt.colno + '\n' + evt.message);
	});
//HACK use hash ### to route all console logs on alerts
if (location.hash == '###')
	console.log = function(message) {
		alert(message);
	};

/**
 * Display misc values
 */
(async function() {
	let data = ['Openlayers ' + ol.util.VERSION];

	// myol storages in the subdomain
	['localStorage', 'sessionStorage'].forEach(s => {
		if (window[s].length)
			data.push(s + ':');

		Object.keys(window[s])
			.forEach(k => data.push('  ' + k + ': ' + window[s].getItem(k)));
	});

	// Registered service workers in the scope
	if ('serviceWorker' in navigator)
		await navigator.serviceWorker.getRegistrations().then(registrations => {
			if (registrations.length) {
				data.push('service-workers:'); //BEST BUG displayed event when we have nothing

				for (let registration of registrations)
					if (registration.active)
						data.push('  ' + registration.active.scriptURL);
			}
		});

	if (typeof caches == 'object')
		await caches.keys().then(function(names) {
			if (names.length) {
				data.push('caches:');

				for (let name of names) {
					data.push('  ' + name);

					//BEST TEMPORARY (til Jun,2023) : Delete previous version of MyOl cache
					if (name == 'myGpsCache')
						caches.delete(name);
				}
			}
		});

	// Final display
	console.info(data.join('\n'));
})();

/**
 * Json parsing errors log
 */
//BEST implement on layerVectorCollection.js & editor.js
function JSONparse(json) {
	try {
		return JSON.parse(json);
	} catch (returnCode) {
		console.error(returnCode + '\nParsing "' + json + '"\n' + new Error().stack);
	}
}