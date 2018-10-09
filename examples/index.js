var _v=document.cookie,_r='COOKIES : ';if(typeof _v=='array'||typeof _v=='object'){for(_i in _v)if(typeof _v[_i]!='function')_r+=_i+'='+typeof _v[_i]+' '+_v[_i]+' '+(_v[_i]&&_v[_i].CLASS_NAME?'('+_v[_i].CLASS_NAME+')':'')+"\n"}else _r+=_v;console.log(_r);

/**
 * www.refuges.info areas layer
 * Requires layerVectorURL
 */
function layerMassifsWri() {
	return layerVectorURL({
		url: '//www.refuges.info/api/polygones?type_polygon=1',
		selector: 'wri-massifs',
		style: function(properties) {
			// Translates the color in RGBA to be transparent
			var cs = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(properties.couleur);
			return {
				fill: new ol.style.Fill({
					color: 'rgba(' + parseInt(cs[1], 16) + ',' + parseInt(cs[2], 16) + ',' + parseInt(cs[3], 16) + ',0.5)'
				}),
				stroke: new ol.style.Stroke({
					color: 'black'
				})
			};
		},
		label: function(properties) {
			return properties.nom;
		},
		hover: function(properties) {
			return {
				fill: new ol.style.Fill({
					color: properties.couleur
				}),
				stroke: new ol.style.Stroke({
					color: 'black'
				})
			};
		},
		click: function(properties) {
			if (properties.lien)
				window.location.href = properties.lien;
		}
	});
}

/**
 * www.refuges.info POI layer
 * Requires layerVectorURL
 */
function layerPointsWri() {
	return layerVectorURL({
		url: '//www.refuges.info/api/bbox?type_points=',
		selector: 'wri-poi',
		style: function(properties) {
			return {
				image: new ol.style.Icon({
					src: '//www.refuges.info/images/icones/' + properties.type.icone + '.png'
				})
			};
		},
		label: function(properties) {
			return properties.nom;
		},
		click: function(properties) {
			if (properties.lien)
				window.location.href = properties.lien;
		}
	});
}

/**
 * chemineur.fr POI layer
 * Requires layerVectorURL
 */
function chemineurLayer() {
	return layerVectorURL({
		url: '//dc9.fr/chemineur/ext/Dominique92/GeoBB/gis.php?site=this&poi=3,8,16,20,23,28,30,40,44,64,58,62,65',
		selector: 'chemineur',
		style: function(properties) {
			return {
				// POI
				image: new ol.style.Icon({
					src: properties.icone
				}),
				// Traces
				stroke: new ol.style.Stroke({
					color: 'blue'
				})
			};
		},
		hover: function(properties) {
			return {
				image: new ol.style.Icon({
					src: properties.icone
				}),
				stroke: new ol.style.Stroke({
					color: 'red',
					width: 3
				})
			};
		},
		label: function(properties) {
			return properties.nom;
		},
		click: function(properties) {
			if (properties.url)
				window.location.href = properties.url;
		}
	});
}

//***************************************************************
// EXAMPLE
//***************************************************************
var overpass = layerOverpass({
		url: '//overpass-api.de/api/interpreter',
		selector: 'overpass',
		labelClass: 'label-overpass',
		label: function(p) {
			return ['<hr/><a href="http://chemineur.fr/posting.php?mode=post',
					'sid=ca86393fbad98908cf443bdeef5a04ca',
					'f=' + p.type,
					'url=' + encodeURI(p.url),
					'nom=' + p.name,
					'lon=' + p.lon,
					'lat=' + p.lat
				].join('&') +
				'">Créer une fiche</a>';
		}
	}),
	overlays = [
		layerPointsWri(),
		chemineurLayer(),
		layerMassifsWri(),
		overpass,
	],
/*	view = new ol.View({
		//center: ol.proj.fromLonLat([-3.5, 48.25]), // France
		//center: ol.proj.fromLonLat([7, 47]), // Suisse
		//center: ol.proj.fromLonLat([9.2, 45.5]), // Milan
		//center: ol.proj.fromLonLat([7.07, 45.19]), // Rochemelon
		//center: ol.proj.fromLonLat([-.1, 51.5]), // Londres
//		center: ol.proj.fromLonLat([-4, 48]), // Bretagne
//		zoom: 8
	}),*/
	map = new ol.Map({
		target: 'map',
//		view: view,
		controls: controlsCollection(),
		layers: overlays
	}),
	layers = layersCollection({
		IGN: 'o6owv8ubhn3vbz2uj8jq5j0z', // localhost
		//IGN: 'hcxdz5f1p9emo4i1lch6ennl', // chemineur.fr
		thunderforest: 'a54d38a8b23f435fa08cfb1d0d0b266e', // https://manage.thunderforest.com
		bing: 'ArLngay7TxiroomF7HLEXCS7kTWexf1_1s1qiF7nbTYs2IkD3XLcUnvSlKbGRZxt',
	}),
	marqueur = draggedIcon(markerImage, [6.575, 45.845], 'll'),
	viseur = draggedIcon(targetImage, [6.15, 46.2], 'lled', true);

map.addLayer(marqueur);
map.addLayer(viseur);
controlgps.callBack = function (position) {
	viseur.getPoint().setCoordinates(position);
}

map.addControl(controlLayersSwitcher(layers));
map.addControl(controlLineEditor('geojson', overlays));
