export default class SubmergedTool {
  constructor(viewer) {
    this.viewer = viewer
    this.maxHeight = 50
    this.minHeight = 0.5
    this.speed = 3
    this.layerNames = []
  }

  setTargetLayers(layerNames) {
    this.layerNames = layerNames
    return this
  }

  //positions: [lon1,lat1,height1,lon2,lat2,height2....]
  includingGlobe(positions) {
    this._includingGlobe = true
    this.positions = positions
    return this
  }

  excludingGlobe() {
    this._includingGlobe = false
    return this
  }

  start() {
    this.layers = []
    for (let lname of this.layerNames) {
      let ly = window.s3d.getLayer(lname)
      if (!ly) {
        throw `没有找到对应图层(${lname})，检查图层名是否正确`
      }
      this.layers.push(ly)
      window.s3d.setLayerVisible(lname, true)
    }

    let currentHeight = 0
    let _this = this
    this._interval_Id = setInterval(() => {
      if (currentHeight > _this.maxHeight) {
        clearInterval(_this._interval_Id)
        return
      }

      let hyp = new Cesium.HypsometricSetting()
      hyp.MaxVisibleValue = currentHeight
      hyp.MinVisibleValue = _this.minHeight
      hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE
      hyp.Opacity = 0.5
      //等高线间隔
      hyp.LineInterval = 10.0

      let colorTable = new Cesium.ColorTable()
      colorTable.insert(71, new Cesium.Color(210 / 255, 15 / 255, 15 / 255))
      colorTable.insert(54, new Cesium.Color(221 / 255, 224 / 255, 7 / 255))
      colorTable.insert(36, new Cesium.Color(20 / 255, 187 / 255, 18 / 255))
      colorTable.insert(18, new Cesium.Color(0, 161 / 255, 1))
      colorTable.insert(0, new Cesium.Color(9 / 255, 9 / 255, 212 / 255))
      hyp.ColorTable = colorTable

      for (let ly of _this.layers) {
        ly.hypsometricSetting = {
          hypsometricSetting: hyp,
          analysisMode:
            Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
        }
      }

      if (_this._includingGlobe) {
        hyp.CoverageArea = _this.positions
        _this.viewer.scene.globe.HypsometricSetting = {
          hypsometricSetting: hyp,
          analysisMode:
            Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
        }
      }

      currentHeight += _this.speed / 10
    }, 100)
  }

  clear() {
    if (this._interval_Id) {
      clearInterval(this._interval_Id)

      let hyp = new Cesium.HypsometricSetting()
      hyp.MaxVisibleValue = -1000

      if (this.layers) {
        for (let ly of this.layers) {
          ly.hypsometricSetting = {
            hypsometricSetting: hyp,
            analysisMode:
              Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
          }
        }
      }

      if (this._includingGlobe) {
        this.viewer.scene.globe.HypsometricSetting = {
          hypsometricSetting: hyp,
          analysisMode:
            Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
        }
      }
    }
  }
}
