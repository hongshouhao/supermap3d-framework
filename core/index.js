import ElementUI from 'element-ui'
import VueiClient from '@supermap/vue-iclient3d-webgl'
import Map from './Map.vue'
import S3d from './S3d'
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
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  // 以下是具体的组件列表
  Map,
}
