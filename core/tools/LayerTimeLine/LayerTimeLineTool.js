import LayerFactory from '../../utils/LayerFactory'
import { isPromise } from '../../utils/IfUtility'
import { setLayerOpacity } from '../../utils/LayerUtility'

export default class LayerTimeLineTool {
  constructor(viewer) {
    this.viewer = viewer
    this.layerFactory = new LayerFactory(viewer)
  }

  setLayers(layers) {
    this.layersInfo = layers
    return this
  }

  loadLayers() {
    this.layers = this.layersInfo.map((lyInfo) => lyInfo.name)
    let promises = []
    this.layersInfo.forEach((lyInfo) => {
      lyInfo.visible = true
      lyInfo.opacity = 0
      let result = this.layerFactory.createLayer(lyInfo)
      if (isPromise(result)) {
        promises.push(result)
      } else {
        let idx = this.layers.findIndex((x) => x === result.name)
        this.layers[idx] = result
      }
    })

    if (promises.length > 0) {
      let _this = this
      return Cesium.when.all(promises, (layers) => {
        layers.forEach((s3mLy) => {
          let idx = _this.layers.findIndex((x) => x === s3mLy.name)
          _this.layers[idx] = s3mLy
        })
        return layers
      })
    } else {
      return this.layers
    }
  }

  setCurrentLayer(layerName, opacity) {
    if (this.layers) {
      this.layers.forEach((ly) => {
        if (ly.name === layerName) {
          setLayerOpacity(ly, opacity)
        } else {
          setLayerOpacity(ly, 0)
        }
      })
    }
  }

  clear() {
    if (this.layers) {
      this.layers.forEach((ly) => {
        this.layerFactory.removeLayer(ly)
      })

      this.layers = []
    }
  }
}
