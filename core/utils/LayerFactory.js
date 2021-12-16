export default class LayerFactory {
  constructor(viewer) {
    this.viewer = viewer
  }

  createS3MLayer(options) {
    if (options.url) {
      let promise = this.viewer.scene.addS3MTilesLayerByScp(options.url, {
        name: options.name,
      })
      return promise.then((cly) => {
        cly.type = options.type
        cly.config = options
        cly.visible = options.visible
        cly.indexedDBSetting.isAttributesSave = true
        if (options.selectColorType) {
          cly.selectColorType = options.selectColorType
        }
        // cly.selectedColor = Cesium.Color.RED
        // cly.selectedLineColor = Cesium.Color.BLUE
        // cly.silhouetteColor = Cesium.Color.RED
        // cly.silhouetteSize = 10
        // console.log(cly.silhouetteColor)

        if (options.enableFillAndWireFrame) {
          cly.style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame
          cly.style3D.lineColor = Cesium.Color.BLACK
          cly.style3D.lineWidth = 1
          cly.wireFrameMode = Cesium.WireFrameType.EffectOutline
          // cly.wireFrameMode = Cesium.WireFrameType.Triangle
        }

        return cly
      })
    } else {
      throw 'S3M图层配置错误:URL'
    }
  }
  createMVTLayer(options) {
    let cly = this.viewer.scene.addVectorTilesMap({
      url: options.url,
      name: options.name,
      viewer: this.viewer,
    })
    cly.type = options.type
    cly.config = options
    cly.show = options.visible
    return cly
  }
  createDEMLayer(options) {
    let res = {}
    res.dem = new Cesium.CesiumTerrainProvider({
      url: options.url,
    })
    if (options.url0) {
      res.dem0 = new Cesium.CesiumTerrainProvider({
        url: options.url0,
      })
    } else {
      res.dem0 = new Cesium.EllipsoidTerrainProvider()
    }

    res.dem.isCreateSkirt = false
    res.dem0.isCreateSkirt = false
    if (options.visible) {
      this.viewer.terrainProvider = res.dem
    } else {
      this.viewer.terrainProvider = res.dem0
    }

    return res
  }
  createImageLayer(options) {
    let imgp = this._createImageryProvider(options)
    let ly = this.viewer.imageryLayers.addImageryProvider(imgp)
    ly.type = options.type
    ly.config = options
    ly.show = options.visible
    ly.name = options.name
    return ly
  }
  create3DTilesLayer(options) {
    var tileset = this.viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset(options)
    )
    return tileset
  }
  _createImageryProvider(options) {
    switch (options.type) {
      case 'ARCGISEXIMG':
        return new Cesium.CGCS2000MapServerImageryProvider(options)
      case 'ARCGISIMG':
        return new Cesium.ArcGisMapServerImageryProvider(options)
      case 'SMIMG':
        return new Cesium.SuperMapImageryProvider(options)
      default:
        throw `暂不支持类型为${options.type}的栅格图层`
    }
  }
}
