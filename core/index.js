/*
 * @Author: zhangbo
 * @Date: 2022-04-02 13:47:14
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-13 13:56:35
 * @FilePath: \supermap3d-framework\core\index.js
 * @Description:
 *
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved.
 */
import ElementUI from 'element-ui';
import VueiClient from '@supermap/vue-iclient3d-webgl';

import Map from './Map.vue';
import MapViewer from './MapViewer.vue';
import Layers from '@/components/layer/tree/index.vue';
import BasemapToggle from './components/layer/basemap/index.vue';
import TopLeftBar from './components/common/TopLeftBar.vue';
import TopRightBar from './components/common/TopRightBar.vue';
import WidgetInfoPanel from './components/common/WidgetInfoPanel.vue';

import * as Analysis from './analysis/index';
import * as Tools from './tools/index';
import * as CesiumMath from './utils/CesiumMath';
import * as IfUtility from './utils/IfUtility';
import * as LayerUtility from './utils/LayerUtility';

import LayerFactory from './utils/LayerFactory';
import { addMessageListener } from './IframeMessage';
import S3d from './S3d';
import './utils/EntityUtility';
import ToolBar from './components/toolbar/index.vue';
import ToolItem from './components/toolbar/tool-item.vue';

const components = [
  Map,
  MapViewer,
  Layers,
  BasemapToggle,
  TopLeftBar,
  TopRightBar,
  ToolBar,
  ToolItem,
];

const install = function (Vue, config) {
  if (install.installed) return;

  Vue.use(ElementUI, { size: 'small' });
  Vue.use(VueiClient);

  components.forEach((component) => {
    if (component.name) {
      Vue.component(component.name, component);
    }
  });

  let conf = null;
  if (typeof config === 'string') {
    if (
      config.indexOf('\'function') != -1 ||
      config.indexOf('"function') != -1
    ) {
      conf = JSON.parse(config, function (k, v) {
        if (v.indexOf && v.indexOf('function') > -1) {
          return eval('(function(){return ' + v + ' })()');
        }
        return v;
      });
    } else {
      conf = eval('(' + config + ')');
    }
  } else if (typeof config === 'object') {
    conf = config;
  } else {
    throw '参数类型错误';
  }
  window.s3d = new S3d(conf);
};

// if (typeof window !== 'undefined' && window.Vue) {
//   install(window.Vue)
// }

export default {
  install,
  Map,
  MapViewer,
  WidgetInfoPanel,
  BasemapToggle,
  TopLeftBar,
  TopRightBar,
  CesiumMath,
  Analysis,
  Tools,
  LayerFactory,
  IfUtility,
  LayerUtility,
  addMessageListener,
};
