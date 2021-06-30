import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import '@supermap/vue-iclient3d-webgl/dist/styles/vue-iclient3d-webgl.min.css'
import VueiClient from '@supermap/vue-iclient3d-webgl'

Vue.config.productionTip = false

Vue.use(Element)
Vue.use(VueiClient)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
