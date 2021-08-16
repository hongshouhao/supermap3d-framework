import Element from 'element-ui'
import VueiClient from '@supermap/vue-iclient3d-webgl'
import { lonLatToCartesian } from './utils/CesiumMath'

import 'element-ui/lib/theme-chalk/index.css'
import '@supermap/vue-iclient3d-webgl/dist/styles/vue-iclient3d-webgl.min.css'
import './assets/themes/light/main.css'
import './css/index.scss'

import Toolbar from './tools/Toolbar'
import EventBus from 'eventbusjs'

export function setup(vue) {
  vue.use(Element)
  vue.use(VueiClient)
}

export function init(config) {
  window.s3d = new S3d(config)
}

class S3d {
  constructor(config) {
    if (!config.iServerBaseURL) throw '参数不能为空: iServerBaseURL'
    if (!config.layers) throw '参数不能为空: layers'
    if (!config.defaultCamera) throw '参数不能为空: defaultCamera'
    if (!config.baseMaps.earth) throw '参数不能为空: baseMaps.earth'
    if (!config.baseMaps.normal) throw '参数不能为空: baseMaps.normal'

    this.config = config
    this.toolbar = new Toolbar()
    this.eventBus = EventBus
  }

  getLayerConfig(layerName) {
    let getConfig = function(layers) {
      for (let lyConfig of layers) {
        if (lyConfig.layer) {
          if (lyConfig.label === layerName) {
            return lyConfig.layer
          }
        } else if (lyConfig.children) {
          return getConfig(lyConfig.children)
        }
      }
    }

    let config = getConfig(this.config.layers)
    return config
  }

  /* 
  data结构
  {
    object: {
      id(此处可空),
      layerName
    },
    position: {
      longitude,
      latitude,
      height(此处可空),
      },
  }
   */
  openPopup(data) {
    let worldPosition = lonLatToCartesian(
      data.position.longitude,
      data.position.latitude,
      data.position.height
    )
    this.popup.renderPopup(worldPosition, data)
  }
}
