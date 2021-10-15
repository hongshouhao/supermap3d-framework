import ElementUI from 'element-ui'
import VueiClient from '@supermap/vue-iclient3d-webgl'
import Map from './Map.vue'
import S3d from './S3d'
import { addMessageListener } from './IframeMessage'
import * as CesiumMath from './utils/CesiumMath'
import './utils/EntityUtility'

const components = [Map]
const install = function(Vue, config) {
  if (install.installed) return

  Vue.use(ElementUI, { size: 'small' })
  Vue.use(VueiClient)

  components.forEach((component) => {
    Vue.component(component.name, component)
  })

  let conf = null
  if (typeof config === 'string') {
    if (
      config.indexOf("'function") != -1 ||
      config.indexOf('"function') != -1
    ) {
      conf = JSON.parse(config, function(k, v) {
        if (v.indexOf && v.indexOf('function') > -1) {
          return eval('(function(){return ' + v + ' })()')
        }
        return v
      })
    } else {
      conf = eval('(' + config + ')')
    }
  } else if (typeof config === 'object') {
    conf = config
  } else {
    throw '参数类型错误'
  }
  window.s3d = new S3d(conf)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  Map,
  CesiumMath,
  addMessageListener,
}
