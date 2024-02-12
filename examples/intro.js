    var map = new ol.Map({
      target: 'map',
      controls: [
        ...myol.control.collection(),
        new myol.control.LayerSwitcher({
          layers: myol.layer.tile.demo(mapKeys),
        }),
        new myol.control.Permalink({
          display: true,
          init: true,
        }),
      ],
      layers: [
        new myol.layer.vector.Chemineur({
          selectName: 'select-chem',
        }),
      ],
    });