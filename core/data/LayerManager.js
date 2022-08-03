import { isPromise } from '../utils/IfUtility';
import LayerFactory from '../utils/LayerFactory';
import LayerRenderer from './LayerRenderer';

export default class LayerManager {
  constructor(viewer, config, eventBus) {
    this.viewer = viewer;
    this.config = config;
    this.eventBus = eventBus;
    this.layerFactory = new LayerFactory(viewer);
    this.layerRenderer = new LayerRenderer(viewer);
  }

  getLayerConfig(params) {
    let lnode = this._getLayerNode(params);
    if (lnode) {
      return lnode.layer;
    }
  }
  getLayer(params) {
    let lnode = this._getLayerNode(params);
    if (lnode) {
      return lnode.cesiumLayer;
    }
  }
  getAllLayers(predicate) {
    let getLayerNode = function (layers, list) {
      for (let lyConfig of layers) {
        if (lyConfig.layer && lyConfig.cesiumLayer) {
          if (predicate) {
            if (predicate(lyConfig.cesiumLayer)) {
              list.push(lyConfig.cesiumLayer);
            }
          } else {
            list.push(lyConfig.cesiumLayer);
          }
        } else if (lyConfig.children) {
          let ln = getLayerNode(lyConfig.children, list);
          if (ln) {
            list.push(ln.cesiumLayer);
          }
        }
      }
    };

    let list = [];
    getLayerNode(this.config.layers, list);
    return list;
  }
  setLayerVisible(layer, visible) {
    this.eventBus.dispatch('layer-visible-changed', layer, visible);
    // let ly = this.getLayer(layer)
    // this._setLayerVisible(ly, visible)
  }
  // layerOptions同layers.js配置
  addLayer(layerOptions, cameraOptions) {
    let result = this.layerFactory.createLayer(layerOptions);
    if (cameraOptions) {
      if (isPromise(result)) {
        return result.then((ly) => {
          flyToLayer(ly, cameraOptions);
          return ly;
        });
      } else {
        flyToLayer(result, cameraOptions);
        return result;
      }
    } else {
      return result;
    }
  }

  _getLayerNode(params) {
    let getLayerNode = function (layers, predicate) {
      for (let lyConfig of layers) {
        if (lyConfig.layer) {
          if (predicate(lyConfig)) {
            return lyConfig;
          }
        } else if (lyConfig.children) {
          let result = getLayerNode(lyConfig.children, predicate);
          if (result) {
            return result;
          }
        }
      }
    };
    if (typeof params === 'function') {
      return getLayerNode(this.config.layers, params);
    } else if (typeof params === 'string') {
      return getLayerNode(this.config.layers, (x) => x.name === params);
    } else {
      throw `getLayerNode 不支持的参数类型 ${typeof params}`;
    }
  }

  bottomLayer(layer) {
    let baseLys = this.viewer.imageryLayers._layers.filter(
      (x) => x.isBaseMap == true
    );
    let theLy = this.getLayer(layer);

    if (this.viewer.imageryLayers._layers[baseLys.length].name == layer) {
      return;
    }

    let lyConf = this.getLayerConfig(layer);
    lyConf.index = baseLys.length;

    this.layerFactory.removeLayer(theLy);
    let newLy = this.layerFactory.createLayer(lyConf);
    lyConf.index = null;
    return newLy;
  }

  topLayer(layer) {
    let imgLys = this.viewer.imageryLayers._layers;
    if (layer == imgLys[imgLys.length - 1].name) {
      return;
    }

    let theLy = this.getLayer(layer);
    let lyConf = theLy.config;
    lyConf.index = null;

    this.layerFactory.removeLayer(theLy);
    let newLy = this.layerFactory.createLayer(lyConf);
    return newLy;
  }

  // _setLayerVisible(layer, visible) {
  //   this.eventBus.dispatch('layer-visible-changed', layer.name, visible)
  //   // if (!visible) {
  //   //   if (layer.config?.renderer) {
  //   //     this.layerRenderer.stopRender(layer.name)
  //   //   }
  //   // }
  // }
}
