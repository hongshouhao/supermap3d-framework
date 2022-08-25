import ElementUI from 'element-ui';
import VueiClient from '@supermap/vue-iclient3d-webgl';

import Map from './Map.vue';
import MapViewer from './MapViewer.vue';
import LayersTree from './components/layerstree/index.vue';
import Basemap from './components/basemap/index.vue';
import TopLeftBar from './components/common/TopLeftBar.vue';
import TopRightBar from './components/common/TopRightBar.vue';
import WidgetInfoPanel from './components/common/WidgetInfoPanel.vue';
import SketchToolPanel from './components/sketch/ToolPanel.vue';

import * as Analysis from './analysis/index';
import * as Tools from './tools/index';
import * as CesiumMath from './utils/CesiumMath';
import * as IfUtility from './utils/IfUtility';
import * as LayerUtility from './utils/LayerUtility';
import * as Reproject from './utils/Reproject';
import SelectedChangedEvent from './data/SelectedChangedEvent';

import LayerFactory from './utils/LayerFactory';
import { addMessageListener } from './IframeMessage';
import S3d from './S3d';
import './utils/EntityUtility';
import ToolBar from './components/toolbar/index.vue';
import ToolItem from './components/toolbar/tool-item.vue';
import './proj4';

const components = [
  Map,
  MapViewer,
  LayersTree,
  Basemap,
  TopLeftBar,
  TopRightBar,
  ToolBar,
  ToolItem,
  SketchToolPanel,
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
  Basemap,
  LayersTree,
  TopLeftBar,
  TopRightBar,
  CesiumMath,
  Analysis,
  Tools,
  LayerFactory,
  IfUtility,
  LayerUtility,
  Reproject,
  SketchToolPanel,
  SelectedChangedEvent,
  addMessageListener,
};
