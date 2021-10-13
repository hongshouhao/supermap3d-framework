import ElementUI from 'element-ui'
import VueiClient from '@supermap/vue-iclient3d-webgl'
import Map from './Map.vue'
import S3d from './S3d'
import { addMessageListener } from './IframeMessage'
import * as CesiumMath from './utils/CesiumMath'
import './utils/EntityUtility'

const components = [Map]
// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function(Vue, config) {
  if (install.installed) return

  Vue.use(ElementUI, { size: 'small' })
  Vue.use(VueiClient)

  components.forEach((component) => {
    Vue.component(component.name, component)
  })

  window.s3d = new S3d(config)
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  Map,
  CesiumMath,
  addMessageListener,
}
