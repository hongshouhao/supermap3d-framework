import Vue from 'vue'
import App from './App.vue'
// import supermap3d from '../core/index'
import supermap3d from '../lib/supermap3d-framework.umd'
import '../lib/supermap3d-framework.css'
import { config } from './config'
Vue.use(supermap3d, config)
Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
}).$mount('#app')
