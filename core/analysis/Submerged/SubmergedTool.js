export default class SubmergedTool {
  constructor(viewer) {
    this.viewer = viewer
    this.maxHeight = 50
    this.minHeight = 0.5
    this.speed = 3
  }

  setTargetLayer(layerName) {
    this.layerName = layerName
  }

  start() {
    this.layer = window.s3d.getLayer(this.layerName)
    if (!this.layer) {
      throw `没有找到对应图层(${this.layerName})，检查图层名是否正确`
    }
    this.layer.visible = true

    let currentHeight = 0
    this.id = setInterval(() => {
      if (currentHeight > this.maxHeight) {
        clearInterval(id)
        return
      }

      let hyp = new Cesium.HypsometricSetting()
      hyp.MaxVisibleValue = currentHeight
      hyp.MinVisibleValue = this.minHeight
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

      this.layer.hypsometricSetting = {
        hypsometricSetting: hyp,
        analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
      }

      currentHeight += this.speed / 10
    }, 100)
  }

  clear() {
    if (this.layer) {
      clearInterval(this.id)
      let hyp = new Cesium.HypsometricSetting()
      hyp.MaxVisibleValue = -1000

      this.layer.hypsometricSetting = {
        hypsometricSetting: hyp,
        analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
      }
    }
  }
}
