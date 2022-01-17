<template>
  <div class="layer-tree">
    <div ref="viewportSpliter"
         v-show="multiViewport"
         class="viewport-spliter" />
    <el-scrollbar style="height:100%">
      <el-tree show-checkbox
               node-key="id"
               ref="tree1"
               :render-after-expand="false"
               :data="layersData"
               :props="{ disabled: disableNode }"
               :default-expanded-keys="defaultExpandedKeys"
               :default-checked-keys="defaultCheckedKeys"
               :render-content="renderExtButton"
               @check-change="setLayerVisible1">
      </el-tree>
    </el-scrollbar>

    <div v-show="multiViewport"
         class="divider">
      <el-divider direction="vertical"></el-divider>
    </div>

    <el-scrollbar style="height:100%">
      <el-tree v-show="multiViewport"
               show-checkbox
               node-key="id"
               ref="tree2"
               :render-after-expand="false"
               :data="layersData"
               :props="{ disabled: disableNode }"
               :default-expanded-keys="defaultExpandedKeys"
               :default-checked-keys="defaultCheckedKeys"
               :render-content="renderExtButton"
               @check-change="setLayerVisible2">
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
import LayerSetting from './LayerSetting.vue'
import LayerFactory from '../utils/LayerFactory'
import { isPromise } from '../utils/IfUtility'

export default {
  name: 'layers-tree',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    LayerSetting,
  },
  data () {
    return {
      layersData: [],
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      multiViewport: false,
    }
  },
  props: [],
  mounted () {
    window.s3d.layerTree = this
    let _this = this
    _this.layerFactory = new LayerFactory(_this.$viewer)
    window.s3d.eventBus.addEventListener('framework-initialized', () => {
      _this._checkLayersConfig()
      _this.init()
    })
    window.s3d.eventBus.addEventListener('layer-visible-changed', (caller, ly) => {
      _this._setLayerNodeChecked(ly)
    })
  },
  methods: {
    init () {
      if (this.$viewer) {
        this.addLayers(window.s3d.config.layers, -1)
        this.layersData = window.s3d.config.layers

        this.$nextTick(() => {
          let dom = document.querySelectorAll('.hide-tree-node')
          dom.forEach((item) => {
            item.parentNode.parentNode.style.display = 'none'
          })
        })

        this.$viewer._element.appendChild(this.$refs.viewportSpliter)
      }
    },
    addLayers (layersData) {
      let _this = this
      for (let lyElModel of layersData) {
        let lyOptions = lyElModel.layer
        if (lyOptions) {
          if (!lyOptions.opacity) {
            lyOptions.opacity = 1
          }
          lyElModel.cesiumLayerLoaded = false
          if (lyOptions.visible) {
            _this.defaultCheckedKeys.push(lyElModel.id)
            _this._createLayer(lyElModel)
          }
        } else if (lyElModel.children) {
          if (lyElModel.expand) {
            _this.defaultExpandedKeys.push(lyElModel.id)
          }
          this.addLayers(lyElModel.children)
        }
      }
    },
    setLayerVisible1 (data, checked) {
      this.setLayerVisible(0, data, checked)
    },
    setLayerVisible2 (data, checked) {
      this.setLayerVisible(1, data, checked)
    },
    setLayerVisible (viewport, data, checked) {
      if (data.children && data.children.length > 0) {
        return
      }
      if (data.cesiumLayer) {
        if (this.multiViewport) {
          this.setVisibleInViewport(data.cesiumLayer, viewport, checked)
        } else {
          if (checked) {
            this._createLayer(data)
          }
          else {
            let lyName = data.cesiumLayer.name
            this._removeLayer(data)
            window.s3d.eventBus.dispatch(
              'layer-invisible-internal',
              null,
              lyName
            )
          }
        }
      } else if (data.dem) {
        if (checked) {
          this.$viewer.terrainProvider = data.dem
        } else {
          this.$viewer.terrainProvider = data.dem0
        }
      }
      else {
        if (checked) {
          data.layer.visible = true
          let cly = this._createLayer(data)
          if (this.multiViewport) {
            if (isPromise(cly)) {
              cly.then((_ly) => {
                this.setVisibleInViewport(_ly, viewport, true)
                this.setVisibleInViewport(_ly, viewport == 0 ? 1 : 0, false)
              })
            }
            else {
              this.setVisibleInViewport(cly, viewport, true)
              this.setVisibleInViewport(cly, viewport == 0 ? 1 : 0, false)
            }
          }
        }
      }
    },
    setVisibleInViewport (cesiumLayer, viewport, checked) {
      if (cesiumLayer["setVisibleInViewport"]) {
        if (!cesiumLayer.visible) {
          cesiumLayer.visible = true
          if (viewport === 0) {
            cesiumLayer.setVisibleInViewport(0, checked)
          } else {
            cesiumLayer.setVisibleInViewport(0, false)
          }

          if (viewport === 1) {
            cesiumLayer.setVisibleInViewport(1, checked)
          } else {
            cesiumLayer.setVisibleInViewport(1, false)
          }
        } else {
          cesiumLayer.setVisibleInViewport(viewport, checked)
        }
      }
    },
    renderExtButton (h, { node }) {
      let lyElModel = node.data
      if (node.childNodes && node.childNodes.length > 0) {
        return (
          <span
            class={
              lyElModel.display === false
                ? 'custom-tree-node hide-tree-node'
                : 'custom-tree-node dir-node'
            }
          >
            <i class={lyElModel.icon ? 'layer-node-icon ' + lyElModel.icon : ''} />
            <span class="over-ellipsis">
              <span title={node.label}>{node.label}</span>
            </span>
          </span>
        )
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
                <i class={lyElModel.icon ? 'layer-node-icon ' + lyElModel.icon : ''} />
                <span class="over-ellipsis">
                  <span on-dblclick={() => {
                    if (lyElModel.cesiumLayer) {
                      window.s3d.flyToLayer(
                        lyElModel.cesiumLayer,
                        lyElModel.layer.defaultCamera
                      )
                    }
                  }} title={node.label}>{node.label}</span>
                </span>
              </span>

              <el-popover
                placement="bottom"
                popper-class="layer-setting-popup"
                trigger="hover"
              >
                <LayerSetting lyElModel={lyElModel} />
                <i
                  slot="reference"
                  class={node.checked ? 'layer-settings my-icon-more' : ''}
                />
              </el-popover>
            </span>
          )
        }
        else {
          return (
            <span
              class={
                lyElModel.display === false
                  ? 'custom-tree-node hide-tree-node'
                  : 'custom-tree-node'
              }
            >
              <span class="layer-node-content">
                <i class={lyElModel.icon ? 'layer-node-icon ' + lyElModel.icon : ''} />
                <span class="over-ellipsis">
                  <span title={node.label}>{node.label}</span>
                </span>
              </span>
            </span>
          )
        }
      }
    },
    toggleViewportMode () {
      if (this.multiViewport) {
        this.$viewer.scene.multiViewportMode = Cesium.MultiViewportMode.NONE
        this.multiViewport = false
      } else {
        this.$viewer.scene.multiViewportMode =
          Cesium.MultiViewportMode.HORIZONTAL
        this.multiViewport = true
        this.$refs.tree2.setCheckedKeys(this.$refs.tree1.getCheckedKeys())
      }
    },
    disableNode (lyElModel) {
      if (lyElModel.disable) {
        return true
      }

      if (lyElModel.children && lyElModel.children.length > 0) {
        return false
      } else {
        if (lyElModel.layer && lyElModel.layer.url) {
          return false
        } else {
          return true
        }
      }
    },
    _checkLayersConfig () {
      let setLayerName = function (layers, nameList) {
        for (let ln of layers) {
          if (ln.layer) {
            if (!ln.layer.name && !ln.name) {
              throw `图层配置错误: "name"属性缺失\n错误节点: ${JSON.stringify(
                ln
              )}`
            } else {
              if (ln.layer.name) {
                ln.name = ln.layer.name
              } else {
                ln.layer.name = ln.name
              }

              if (nameList[ln.name]) {
                nameList[ln.name] = nameList[ln.name] + 1
              } else {
                nameList[ln.name] = 1
              }
              if (!ln.label) {
                ln.label = ln.name
              }
            }
          } else if (ln.children) {
            setLayerName(ln.children, nameList)
          }
        }
      }
      let nameList = {}
      setLayerName(window.s3d.config.layers, nameList)

      for (let key in nameList) {
        if (nameList[key] > 1) {
          throw `图层配置错误: 图层名(${key})重复`
        }
      }
    },
    _setLayerNodeChecked (layer) {
      if (layer.nodeKey) {
        let keys = this.$refs.tree1.getCheckedKeys()
        let idx = keys.findIndex((item) => item === layer.nodeKey)
        if (layer.visible || layer.show) {
          if (idx == -1) {
            keys.push(layer.nodeKey)
          }
        } else {
          if (idx != -1) {
            keys.splice(idx, 1)
          }
        }
        this.$refs.tree1.setCheckedKeys(keys)
      }
    },
    _createLayer (lyElModel) {
      let result = this.layerFactory.createLayer(lyElModel.layer)
      if (isPromise(result)) {
        return result.then(ly => {
          lyElModel.cesiumLayer = ly
          lyElModel.cesiumLayerLoaded = true
          lyElModel.cesiumLayer.nodeKey = lyElModel.id
        })
      }
      else if (lyElModel.layer.type === 'DEM') {
        Object.assign(lyElModel, result)
      }
      else {
        lyElModel.cesiumLayer = result
        lyElModel.cesiumLayerLoaded = true
        lyElModel.cesiumLayer.nodeKey = lyElModel.id
      }
      return lyElModel.cesiumLayer
    },
    _removeLayer (lyElModel) {
      this.layerFactory.removeLayer(lyElModel.cesiumLayer)
      if (lyElModel.layer.renderer) {
        window.s3d.layersRenderer.stopRender(lyElModel.cesiumLayer.name)
      }
      lyElModel.cesiumLayer = null
      lyElModel.cesiumLayerLoaded = false
    }
  },
}
</script>
<style lang="scss">
.layer-tree {
  display: flex;
  width: 100%;
  background: white;
  padding: 10px 0px 10px 5px;

  .el-scrollbar__wrap {
    overflow-x: hidden;
    overflow-y: auto;
    max-height: calc(100vh - 200px);
    margin: 0 !important;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  }

  .el-scrollbar__view {
    .el-tree {
      margin-right: 5px;
      min-width: 190px;
    }
  }
  .el-tree-node__content {
    .el-checkbox {
      margin-bottom: 0px;
    }
  }

  .divider {
    position: relative;
    width: 10px;
    // margin-left: 2px;
    .el-divider {
      height: 100%;
    }
  }

  .custom-tree-node {
    display: flex;
    align-items: center;
    margin-bottom: 0px;
    width: 100%;
    justify-content: space-between;
    &.dir-node {
      justify-content: flex-start;
    }

    .layer-node-content {
      height: 19px;
    }

    .over-ellipsis {
      display: inline-block;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      -webkit-line-clamp: 1;
      user-select: none;
    }

    .layer-node-icon {
      margin-right: 4px;
      margin-top: 1px;
      color: #409eff;
    }

    .layer-settings {
      width: 13px;
      display: block;
      margin-right: 5px;
    }
  }
}

.viewport-spliter {
  position: absolute;
  background-color: white;
  left: 50%;
  top: 0;
  width: 2px;
  height: 100%;
}

.layer-setting-popup {
  border-radius: 1px !important;
  border: 1px solid #dbdbdb !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  padding-top: 8px !important;
  padding-bottom: 4px !important;

  .popper__arrow {
    // border-left-color: #dbdbdb !important;
    border-bottom-color: #dbdbdb !important;
  }

  .el-popover__title {
    font-size: 5px;
    margin-bottom: 0px;
  }
}
</style>
