/*
 * @Author: zhangbo
 * @Date: 2022-04-06 15:40:14
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-06 17:38:58
 * @FilePath: \supermap3d-framework\examples\sample-1\main.js
 * @Description:
 *
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved.
 */
import Vue from 'vue';
import App from './App.vue';
import supermap3d from '../../core/index';
import '../../core/css/index.scss';

import { config } from './config';

const setLabel = function (layers) {
  for (const key in layers) {
    // name作为主键，将id赋值给name
    if (layers[key].name) {
      layers[key].label = layers[key].name;
      layers[key].name = layers[key].id;
    }
    if (layers[key].children && layers[key].children.length > 0) {
      setLabel(layers[key].children);
    }
  }
};

setLabel(config.layers);

Vue.use(supermap3d, config);
Vue.config.productionTip = false;
new Vue({
  render: (h) => h(App),
}).$mount('#app');
