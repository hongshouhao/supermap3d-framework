import Vue from 'vue'
import map from './map.vue'
import Element from 'element-ui'
import VueiClient from '@supermap/vue-iclient3d-webgl'

import 'element-ui/lib/theme-chalk/index.css'
import '@supermap/vue-iclient3d-webgl/dist/styles/vue-iclient3d-webgl.min.css'
import './assets/themes/light/main.css'
import './css/index.scss'

import { config } from './config'
import { setup } from './s3d'
setup(config)

Vue.config.productionTip = false

Vue.use(Element)
Vue.use(VueiClient)

new Vue({
  render: (h) => h(map),
}).$mount('#app')
