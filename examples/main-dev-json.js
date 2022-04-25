import Vue from 'vue';
import App from './App.vue';
import '../core/css/index.scss';
import supermap3d from '../core/index';
import axios from 'axios';

axios.get('/config.json').then(function (response) {
  let conf = null;
  if (typeof response.data === 'string') {
    conf = response.data;
  } else {
    conf = JSON.stringify(response.data);
  }
  Vue.use(supermap3d, conf);
  Vue.config.productionTip = false;
  new Vue({
    render: (h) => h(App),
  }).$mount('#app');
});
