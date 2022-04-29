/*
 * @Author: zhangbo
 * @Date: 2022-04-07 12:48:38
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-09 13:15:04
 * @FilePath: \supermap3d-framework\core\components\layer\tree\mixins\layer-tree.js
 * @Description:
 *
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved.
 */
import { isPromise } from '@/utils/IfUtility';
import LayerFactory from '@/utils/LayerFactory';
import LayerSetting from '../setting.vue';
import LayerStore from '../store/layer-store';

export default {
  data() {
    return {
      layerFactory: null,
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
    };
  },
  components: {
    LayerSetting,
  },
  created() {
    // 支持自定义图层store
    let StoreConstructor = window.s3d.config.layerStore || LayerStore;
    this.recentLayerStore = new StoreConstructor('n-smap-recent', { max: 10 });
    this.favourLayerStore = new StoreConstructor('n-smap-favour');
  },
  mounted() {
    this.layerFactory = new LayerFactory(this.$viewer);
  },
  methods: {
    setLayerVisible(data, checked, viewport = 0) {
      if (data.children && data.children.length > 0) {
        return;
      }

      if (checked && this.recentLayerStore) {
        this.recentLayerStore.set(data.id);
      }

      if (data.cesiumLayer) {
        if (this.multiViewport) {
          this.setVisibleInViewport(data.cesiumLayer, viewport, checked);
        } else {
          if (checked) {
            this._createLayer(data);
          } else {
            let lyName = data.cesiumLayer.name;
            this._removeLayer(data);

            window.s3d.eventBus.dispatch(
              'layer-invisible-internal',
              'layers-tree',
              lyName
            );
          }
        }
      } else if (data.dem) {
        if (checked) {
          this.$viewer.terrainProvider = data.dem;
        } else {
          this.$viewer.terrainProvider = data.dem0;
        }
      } else {
        if (checked) {
          data.layer.visible = true;
          let cly = this._createLayer(data);

          if (this.multiViewport) {
            if (isPromise(cly)) {
              cly.then((_ly) => {
                this.setVisibleInViewport(_ly, viewport, true);
                this.setVisibleInViewport(_ly, viewport == 0 ? 1 : 0, false);
              });
            } else {
              this.setVisibleInViewport(cly, viewport, true);
              this.setVisibleInViewport(cly, viewport == 0 ? 1 : 0, false);
            }
          }
        }
      }
    },
    setVisibleInViewport(cesiumLayer, viewport, checked) {
      if (cesiumLayer['setVisibleInViewport']) {
        if (!cesiumLayer.visible) {
          cesiumLayer.visible = true;
          if (viewport === 0) {
            cesiumLayer.setVisibleInViewport(0, checked);
          } else {
            cesiumLayer.setVisibleInViewport(0, false);
          }

          if (viewport === 1) {
            cesiumLayer.setVisibleInViewport(1, checked);
          } else {
            cesiumLayer.setVisibleInViewport(1, false);
          }
        } else {
          cesiumLayer.setVisibleInViewport(viewport, checked);
        }
      }
    },
    renderExtButton(h, { node }) {
      let lyElModel = node.data;

      if (node.childNodes && node.childNodes.length > 0) {
        if (node.checked) {
          return (
            <span class={this.getDirNodeClass(lyElModel)}>
              <i
                class={
                  lyElModel.icon ? 'layer-node-icon ' + lyElModel.icon : ''
                }
              />
              <span class="over-ellipsis">
                <span
                  on-dblclick={() => {
                    let firstLayer = lyElModel.children[0];
                    if (firstLayer.cesiumLayer) {
                      window.s3d.flyToLayer(
                        firstLayer.cesiumLayer,
                        firstLayer.layer.defaultCamera
                      );
                    }
                  }}
                  title={node.label}
                >
                  {node.label}
                </span>
              </span>
            </span>
          );
        } else {
          return (
            <span class={this.getDirNodeClass(lyElModel)}>
              <i
                class={
                  lyElModel.icon ? 'layer-node-icon ' + lyElModel.icon : ''
                }
              />
              <span class="over-ellipsis">
                <span title={node.label}>{node.label}</span>
              </span>
            </span>
          );
        }
      } else {
        if (node.checked) {
          return (
            <span
              class={
                lyElModel.display === false
                  ? 'custom-tree-node hide-tree-node'
                  : 'custom-tree-node'
              }
            >
              <span class="layer-node-content">
                <i
                  class={
                    lyElModel.icon ? 'layer-node-icon ' + lyElModel.icon : ''
                  }
                />
                <span class="over-ellipsis">
                  <span
                    on-dblclick={() => {
                      if (lyElModel.cesiumLayer) {
                        window.s3d.flyToLayer(
                          lyElModel.cesiumLayer,
                          lyElModel.layer.defaultCamera
                        );
                      }
                    }}
                    title={node.label}
                  >
                    {node.label}
                  </span>
                </span>
              </span>
              <span class="layer-tool">
                <i
                  class="my-icon-top"
                  on-click={() => {
                    lyElModel.cesiumLayer = window.s3d.layerManager.topLayer(
                      lyElModel.layer.name
                    );
                  }}
                />
                <i
                  class="my-icon-bottom"
                  on-click={() => {
                    lyElModel.cesiumLayer = window.s3d.layerManager.bottomLayer(
                      lyElModel.layer.name
                    );
                  }}
                />
                <el-popover
                  placement="bottom"
                  popper-class="layer-setting-popup"
                  class="layer-tool-item"
                  trigger="hover"
                >
                  <LayerSetting lyElModel={lyElModel} />
                  <i
                    slot="reference"
                    class={node.checked ? 'layer-settings my-icon-more' : ''}
                  />
                </el-popover>
                <a
                  class="layer-tool-item"
                  on-click={() => {
                    lyElModel.isFavourite = !lyElModel.isFavourite;
                    this.onChangeFavourite(lyElModel, lyElModel.isFavourite);
                  }}
                >
                  <i
                    class={
                      lyElModel.isFavourite
                        ? 'icon-star-full'
                        : 'icon-star-empty'
                    }
                  ></i>
                </a>
              </span>
            </span>
          );
        } else {
          return (
            <span
              class={
                lyElModel.display === false
                  ? 'custom-tree-node hide-tree-node'
                  : 'custom-tree-node'
              }
            >
              <span class="layer-node-content">
                <i
                  class={
                    lyElModel.icon ? 'layer-node-icon ' + lyElModel.icon : ''
                  }
                />
                <span class="over-ellipsis">
                  <span title={node.label}>{node.label}</span>
                </span>
              </span>
            </span>
          );
        }
      }
    },
    disableNode(lyElModel) {
      if (lyElModel.disable) {
        return true;
      }

      if (lyElModel.children && lyElModel.children.length > 0) {
        return false;
      } else {
        if (lyElModel.layer && lyElModel.layer.url) {
          return false;
        } else {
          return true;
        }
      }
    },
    _checkLayersConfig() {
      let setLayerName = function (layers, nameList) {
        for (let ln of layers) {
          if (ln.layer) {
            if (!ln.layer.name && !ln.name) {
              throw `图层配置错误: "name"属性缺失\n错误节点: ${JSON.stringify(
                ln
              )}`;
            } else {
              if (ln.layer.name) {
                ln.name = ln.layer.name;
              } else {
                ln.layer.name = ln.name;
              }

              if (nameList[ln.name]) {
                nameList[ln.name] = nameList[ln.name] + 1;
              } else {
                nameList[ln.name] = 1;
              }
              if (!ln.label) {
                ln.label = ln.name;
              }
            }
          } else if (ln.children) {
            setLayerName(ln.children, nameList);
          }
        }
      };

      let nameList = {};
      setLayerName(window.s3d.config.layers, nameList);

      for (let key in nameList) {
        if (nameList[key] > 1) {
          throw `图层配置错误: 图层名(${key})重复`;
        }
      }
    },
    setLayerNodeChecked(layerName, checked) {
      let lnode = window.s3d.layerManager._getLayerNode(layerName);
      if (lnode) {
        let keys = this.$refs.tree.getCheckedKeys();
        let idx = keys.findIndex((item) => item === lnode.id);

        if (checked) {
          if (idx == -1) {
            keys.push(lnode.id);
          }
        } else {
          if (idx != -1) {
            keys.splice(idx, 1);
          }
        }
        this.$refs.tree.setCheckedKeys(keys);
      }
    },
    _createLayer(lyElModel) {
      let result = this.layerFactory.createLayer(lyElModel.layer);
      if (isPromise(result)) {
        return result.then((ly) => {
          lyElModel.cesiumLayer = ly;
          lyElModel.cesiumLayerLoaded = true;
          window.s3d.eventBus.dispatch('layer-added', 'layers-tree', ly);
        });
      } else if (lyElModel.layer.type === 'DEM') {
        Object.assign(lyElModel, result);
        window.s3d.eventBus.dispatch('dem-added', 'layers-tree', result);
      } else {
        lyElModel.cesiumLayer = result;
        lyElModel.cesiumLayerLoaded = true;
        window.s3d.eventBus.dispatch('layer-added', 'layers-tree', result);
      }
      return lyElModel.cesiumLayer;
    },
    _removeLayer(lyElModel) {
      this.layerFactory.removeLayer(lyElModel.cesiumLayer);

      if (lyElModel.layer.renderer) {
        window.s3d.layerManager.layerRenderer.stopRender(
          lyElModel.cesiumLayer.name
        );
      }

      lyElModel.cesiumLayer = null;
      lyElModel.cesiumLayerLoaded = false;

      window.s3d.eventBus.dispatch(
        'layer-removed',
        'layers-tree',
        lyElModel.name
      );
    },
    getDirNodeClass(lyElModel) {
      if (lyElModel.display === false) {
        return 'custom-tree-node hide-tree-node';
      } else {
        if (lyElModel.virtual === true) {
          return 'custom-tree-node virtual-dir-node';
        } else {
          return 'custom-tree-node dir-node';
        }
      }
    },
    filterNode(value, data) {
      if (!value) {
        if (typeof data.display === 'boolean') {
          return data.display;
        } else {
          return true;
        }
      } else {
        if (typeof data.display === 'boolean') {
          if (data.display) {
            return data.label.indexOf(value) !== -1;
          } else {
            return false;
          }
        } else {
          return data.label.indexOf(value) !== -1;
        }
      }
    },
    onChangeFavourite(lyElModel, isFavourite) {
      if (isFavourite) {
        this.favourLayerStore.set(lyElModel.id);
      } else {
        this.favourLayerStore.remove(lyElModel.id);
      }

      window.s3d.eventBus.dispatch('layer-favourite-changed', 'layers-tree', {
        layer: lyElModel,
        checked: isFavourite,
      });
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
};
