import Vue from 'vue'
import Map from './Map.vue'

import { setup, init } from './s3d'
setup(Vue)
import { config } from './config'
init(config)

Vue.config.productionTip = false

new Vue({
  render: (h) => h(Map),
}).$mount('#app')
