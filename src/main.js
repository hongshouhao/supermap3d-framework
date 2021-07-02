import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import VueiClient from '@supermap/vue-iclient3d-webgl'

import 'element-ui/lib/theme-chalk/index.css'
import '@supermap/vue-iclient3d-webgl/dist/styles/vue-iclient3d-webgl.min.css'
import './css/app.scss'

Vue.config.productionTip = false

Vue.use(Element)
Vue.use(VueiClient)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
