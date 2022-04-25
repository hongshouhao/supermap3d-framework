import Vue from 'vue';
import App from '../App.vue';
import supermap3d from '../../core/index';
import '../../core/css/index.scss';

import { config } from './config';

Vue.use(supermap3d, config);
Vue.config.productionTip = false;
new Vue({
  render: (h) => h(App),
}).$mount('#app');
