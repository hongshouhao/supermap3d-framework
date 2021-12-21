import { createImageryProvider } from '../utils/ImageryUtility'

export default class BasemapUtility {
  constructor(viewer, sm3d) {
    this.viewer = viewer
    this.sm3d = sm3d
    this.mapsConfig = sm3d.config.baseMaps
    if (!sm3d.baseMaps) {
      sm3d.baseMaps = {}
    }
    this.baseMaps = sm3d.baseMaps

    //白天还是夜晚
    this.mode = 'day'
  }

  createMaps() {
    for (let mapKey in this.mapsConfig) {
      if (mapKey === 'none') {
        continue
      }
      let mapConf = this.mapsConfig[mapKey]
      let maps = []
      for (let mapParams of mapConf.maps) {
        let mapProvider = createImageryProvider(mapParams)
        let map = this.viewer.imageryLayers.addImageryProvider(mapProvider)
        map.type = mapParams.type
        map.mode = mapParams.mode
        if (!mapConf.default) {
          map.alpha = 0
        }
        maps.push(map)
      }
      this.baseMaps[mapKey] = maps
    }

    //设置默认底图
    for (let mapKey in this.mapsConfig) {
      let map = this.mapsConfig[mapKey]
      if (map.default) {
        this.toggleMap(mapKey)
        break
      }
    }
  }

  toggleMap(type) {
    if (type === 'none') {
      this.viewer.scene.globe.show = false
      this.viewer.scene.skyBox.show = false
      this.viewer.scene.skyAtmosphere.show = false
      this.baseMaps.current = null
      this.sm3d.eventBus.dispatch('baseMap-changed', null, {
        type: type,
        currentMaps: this.baseMaps.current,
      })
    } else {
      this.viewer.scene.globe.show = true
      this.viewer.scene.skyBox.show = true
      this.viewer.scene.skyAtmosphere.show = true

      let alpha = this.getCurrentMapAlpha(type)
      for (let mapKey in this.mapsConfig) {
        if (mapKey === 'none') {
          continue
        }
        let maps = this.baseMaps[mapKey]
        if (mapKey === type) {
          for (let map of maps) {
            if (map.mode) {
              if (this.mode === map.mode) {
                map.alpha = alpha
              } else {
                map.alpha = 0
              }
            } else {
              map.alpha = alpha
            }
          }
        } else {
          for (let map of maps) {
            map.alpha = 0
          }
        }
      }

      this.baseMaps.current = this.baseMaps[type]
      this.sm3d.eventBus.dispatch('baseMap-changed', null, {
        type: type,
        currentMaps: this.baseMaps.current,
      })
    }
  }

  getCurrentMapAlpha(type) {
    if (type === 'none') {
      return null
    }

    if (this.baseMaps.current) {
      let current = null
      if (this.mode) {
        current = this.baseMaps.current.find((x) => x.mode === this.mode)
        if (!current) {
          current = this.baseMaps.current[0]
        }
      } else {
        current = this.baseMaps.current[0]
      }
      return current.alpha
    } else {
      return 1
    }
  }
}
