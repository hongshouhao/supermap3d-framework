export default class LayersRenderer {
  constructor(viewer) {
    this.viewer = viewer
  }

  startRender(layer) {
    let ly = window.s3d.getLayer(layer)
    if (ly.config.renderer) {
      if (ly.config.renderer.type === 'S3MLAYER') {
        this.addS3MRender(ly)
      }
    }
  }

  _getS3MRenderLayerName(lyName) {
    return `${lyName}-s3mrender`
  }

  addS3MRender(ly) {
    // let ly = window.s3d.getLayer(layer)
    let lyName = this._getS3MRenderLayerName(ly.name)
    let renderLayer = this.viewer.scene.layers.find(lyName)
    if (renderLayer) {
      renderLayer.visible = true
    } else {
      let promise = this.viewer.scene.addS3MTilesLayerByScp(
        ly.config.renderer.layer.url,
        {
          name: lyName,
        }
      )
      promise.then((rly) => {
        rly.textureUVSpeed = ly.config.renderer.layer.textureUVSpeed
        rly.visible = true
      })
    }
  }

  stopRender(layer) {
    let ly = window.s3d.getLayer(layer)
    if (ly.config.renderer.type === 'S3MLAYER') {
      let lyName = this._getS3MRenderLayerName(ly.name)
      let renderLayer = this.viewer.scene.layers.find(lyName)
      if (renderLayer) {
        renderLayer.visible = false
      }
    }
  }

  // addTest() {
  //   let symbol = lconf.renderer.symbol
  //   if (!symbol) {
  //     symbol = {
  //       color: Cesium.Color.fromCssColorString('rgba(118，232, 241，1.0)'),
  //       trailLength: 0.3,
  //       period: 2,
  //     }
  //   }

  //   new Promise((resolve) => {
  //     Cesium.loadJson(`./json/${layer}.json`).then(function(jsonData) {
  //       // let polylines = _this.viewer.scene.primitives.add(
  //       //   new Cesium.PolylineCollection()
  //       // )
  //       _this.viewer.entities.removeAll()
  //       let i = 1
  //       for (let feature of jsonData.features) {
  //         if (i > 2) {
  //           break
  //         }
  //         i++
  //         // polylines.add({
  //         //   positions: [
  //         //     Cesium.Cartesian3.fromDegrees(
  //         //       feature.geometry.coordinates[0][0],
  //         //       feature.geometry.coordinates[0][1],
  //         //       feature.properties.QDGC
  //         //     ),
  //         //     Cesium.Cartesian3.fromDegrees(
  //         //       feature.geometry.coordinates[1][0],
  //         //       feature.geometry.coordinates[1][1],
  //         //       feature.properties.ZDGC
  //         //     ),
  //         //   ],
  //         //   width: 10,
  //         //   material: new Cesium.PolylineTrailLinkMaterial(
  //         //     Cesium.Color.WHITE,
  //         //     3000,
  //         //     1
  //         //   ),
  //         //   // material: Cesium.Material.fromType(
  //         //   //   Cesium.Material.PolylineArrowType
  //         //   // ),
  //         // })
  //         _this.viewer.entities.add({
  //           polyline: {
  //             positions: [
  //               Cesium.Cartesian3.fromDegrees(
  //                 feature.geometry.coordinates[0][0],
  //                 feature.geometry.coordinates[0][1],
  //                 feature.properties.QDGC
  //               ),
  //               Cesium.Cartesian3.fromDegrees(
  //                 feature.geometry.coordinates[1][0],
  //                 feature.geometry.coordinates[1][1],
  //                 feature.properties.ZDGC
  //               ),
  //             ],
  //             width: 2,
  //             material: new Cesium.PolylineTrailLinkMaterial(
  //               Cesium.Color.WHITE,
  //               3000,
  //               1
  //             ),
  //             // material: new Cesium.PolylineTrailMaterialProperty(
  //             //   lconf.renderer.symbol
  //             // ),
  //           },
  //         })
  //       }
  //     })
  //     resolve()
  //   })
  // }
}
