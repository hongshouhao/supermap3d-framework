export default class LayersRender {
  constructor() {}
  addRender(layer) {
    let lconf = window.s3d.getLayerConfig(layer)
    if (lconf.renderer) {
      if (lconf.renderer.type === 'pipe') {
        let symbol = lconf.renderer.symbol
        if (!symbol) {
          symbol = {
            color: Cesium.Color.fromCssColorString('rgba(118，232, 241，1.0)'),
            trailLength: 0.2,
            period: 1,
          }
        }

        // Cesium.loadJson(`./json/${layer}.json`).then(function(jsonData) {
        //   console.log(jsonData)

        //   for (let feature of jsonData.features) {
        //     viewer.entities.add({
        //       polyline: {
        //         positions: [
        //           Cesium.Cartesian3.fromDegrees(
        //             feature.geometry.coordinates[0][0],
        //             feature.geometry.coordinates[0][1],
        //             100
        //           ),
        //         ],
        //         width: 2,
        //         material: new Cesium.PolylineTrailMaterialProperty(
        //           lconf.renderer.symbol
        //         ),
        //       },
        //     })
        //   }
        // })
      }
    }
  }
}
