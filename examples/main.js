import Vue from 'vue'
import App from './App.vue'
import supermap3d from '../core/index'
import '../core/css/index.scss'

// import supermap3d from '../lib/supermap3d-framework.umd'
// import '../lib/supermap3d-framework.css'

import { config } from './config'
Vue.use(supermap3d, config)
Vue.config.productionTip = false

// import { addMessageListener } from '../lib/supermap3d-framework.umd'
// import { CesiumMath } from '../lib/supermap3d-framework.umd'
// console.log('CesiumMath', CesiumMath.cartesianToLonlat)
// console.log('addMessageListener', addMessageListener)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
