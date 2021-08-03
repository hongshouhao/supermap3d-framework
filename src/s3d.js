import Element from 'element-ui'
import VueiClient from '@supermap/vue-iclient3d-webgl'

import 'element-ui/lib/theme-chalk/index.css'
import '@supermap/vue-iclient3d-webgl/dist/styles/vue-iclient3d-webgl.min.css'
import './assets/themes/light/main.css'
import './css/index.scss'

import Toolbar from './tools/Toolbar'

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
    if (!config.baseMapEarth) throw '参数不能为空: baseMapEarth'
    if (!config.baseMapNormal) throw '参数不能为空: baseMapNormal'

    this.config = config
    this.toolbar = new Toolbar()
  }
}
