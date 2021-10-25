<template>
  <div class="layer-tree">
    <div ref="viewportSpliter"
         v-show="multiViewport"
         class="viewport-spliter" />
    <el-tree show-checkbox
             node-key="id"
             ref="tree1"
             :data="layersData"
             :props="{disabled:disableNode}"
             :default-expanded-keys="defaultExpandedKeys"
             :default-checked-keys="defaultCheckedKeys"
             :render-content="renderExtButton"
             @check-change="setLayerVisible1">
    </el-tree>

    <div v-if="multiViewport"
         class="divider">
      <el-divider direction="vertical"></el-divider>
    </div>

    <el-tree v-if="multiViewport"
             show-checkbox
             node-key="id"
             ref="tree2"
             :data="layersData"
             :props="{disabled:disableNode}"
             :default-expanded-keys="defaultExpandedKeys"
             :default-checked-keys="defaultCheckedKeys"
             :render-content="renderExtButton"
             @check-change="setLayerVisible2">
    </el-tree>
  </div>
</template>

<script> 
import LayerSetting from './LayerSetting.vue'
import LayerFactory from '../utils/LayerFactory'
import { isImageryLayer } from '../utils/ImageryUtility'

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    LayerSetting
  },
  data () {
    return {
      layersData: [],
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      multiViewport: false,
      layerFactory: null,
    }
  },
  computed: {
    viewer () {
      return window.s3d.viewer
    }
  },
  props: [],
  mounted () {
    window.s3d.layerTree = this
    let _this = this
    _this.layerFactory = new LayerFactory(_this.viewer)
    window.s3d.eventBus.addEventListener("framework-initialized", () => {
      _this._checkLayersConfig()
      _this.init()
    });

    window.s3d.eventBus.addEventListener("layer-visible-changed", (s3d, ly) => {
      _this._setLayerNodeChecked(ly)
    });
  },
  methods: {
    init () {
      if (this.viewer) {
        this.addLayers(window.s3d.config.layers, -1)
        this.layersData = window.s3d.config.layers

        this.viewer.camera.flyTo(window.s3d.config.defaultCamera);
        this.viewer._element.appendChild(this.$refs.viewportSpliter)
      }
    },
    addLayers (layersData) {
      let _this = this
      for (let lyNode of layersData) {
        let lyOptions = lyNode.layer
        if (lyOptions) {
          if (!lyOptions.opacity) {
            lyOptions.opacity = 100
          }
          if (lyOptions.visible) {
            _this.defaultCheckedKeys.push(lyNode.id)
          }

          if (isImageryLayer(lyOptions.type)) {
            lyNode.cesiumLayer = _this.layerFactory.createImageLayer(lyOptions)
            lyNode.cesiumLayer.nodeKey = lyNode.id
          } else if (lyOptions.type === 'S3M') {
            _this.layerFactory.createS3MLayer(lyOptions).then(ly => {
              lyNode.cesiumLayer = ly
              lyNode.cesiumLayer.nodeKey = lyNode.id
            })
          } else if (lyOptions.type === 'MVT') {
            lyNode.cesiumLayer = _this.layerFactory.createMVTLayer(lyOptions)
            lyNode.cesiumLayer.nodeKey = lyNode.id
          } else if (lyOptions.type === 'DEM') {
            Object.assign(lyNode, _this.layerFactory.createDEMLayer(lyOptions))
          } else {
            throw '图层类型配置错误'
          }
        }
        else if (lyNode.children) {
          if (lyNode.expand) {
            _this.defaultExpandedKeys.push(lyNode.id)
          }
          this.addLayers(lyNode.children)
        }
      }
    },
    setLayerVisible1 (data, checked) {
      this.setLayerVisible(0, data, checked)
    },
    setLayerVisible2 (data, checked) { this.setLayerVisible(1, data, checked) },
    setLayerVisible (viewport, data, checked) {
      if (data.children && data.children.length > 0) {
        return
      }

      if (data.cesiumLayer) {
        if (this.multiViewport) {
          data.cesiumLayer.setVisibleInViewport(viewport, checked);
        }
        else {
          let layer = data.cesiumLayer
          if (isImageryLayer(layer.type) || layer.type === 'MVT') {
            if (layer.show !== checked) {
              layer.show = checked
              window.s3d.eventBus.dispatch('layer-visible-changed-internal', this, layer)
            }
          } else if (layer.type === 'S3M') {
            if (layer.visible !== checked) {
              layer.visible = checked
              window.s3d.eventBus.dispatch('layer-visible-changed-internal', this, layer)

              // if (!checked) {
              //   if (layer.config.renderer) {
              //     window.s3d.layersRenderer.stopRender(layer.name)
              //   }
              // }
            }
          }
        }
      }
      else if (data.dem) {
        if (checked) {
          this.viewer.terrainProvider = data.dem
        }
        else {
          this.viewer.terrainProvider = data.dem0
        }
      }
    },
    renderExtButton (h, { node, data }) {
      if (node.childNodes && node.childNodes.length > 0) {
        return (
          <span class="custom-tree-node">
            <i class={data.icon ? "layer-node-icon " + data.icon : ""} />
            <span class="toggle-ext-button">{node.label}
            </span>
          </span>
        )
      }
      else {
        return (
          <span class="custom-tree-node">
            <i class={data.icon ? "layer-node-icon " + data.icon : ""} />
            <span class="toggle-ext-button">{node.label}
              <i class={node.checked ? "esri-icon-directions2 my-ext-button" : "esri-icon-directions2 my-ext-button my-ext-button-hidden"}
                on-click={() => window.s3d.flyToLayer(data.cesiumLayer)} />
            </span>

            <el-popover
              placement="bottom"
              popper-class="layer-setting-popup"
              trigger="hover"
            >
              <LayerSetting conf={data} />
              <i slot="reference" class={node.checked ? "layer-settings my-icon-more" : ""} />
            </el-popover>
          </span >
        )
      }
    },
    toggleViewportMode () {
      if (this.multiViewport) {
        this.viewer.scene.multiViewportMode = Cesium.MultiViewportMode.NONE
        this.multiViewport = false
      }
      else {
        this.viewer.scene.multiViewportMode = Cesium.MultiViewportMode.HORIZONTAL
        this.multiViewport = true
      }
    },
    disableNode (data) {
      if (data.children && data.children.length > 0) {
        return false
      }
      else {
        if (data.layer && data.layer.url) {
          return false
        }
        else {
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
            }
            else {
              if (ln.layer.name) {
                ln.name = ln.layer.name
              }
              else {
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
        }
        else {
          if (idx != -1) {
            keys.splice(idx, 1);
          }
        }
        this.$refs.tree1.setCheckedKeys(keys);
      }
    },
  }
}
</script>
<style lang="scss">
.layer-tree {
  display: flex;
  height: 100%;
  width: 100%;
  background: white;
  padding: 10px 10px;

  .tree-div {
    padding: 10px;
  }

  .divider {
    position: relative;
    margin-left: 4px;
    .el-divider {
      height: 100%;
    }
  }

  .custom-tree-node {
    display: flex;
    margin-bottom: 5px;

    .layer-node-icon {
      margin-right: 4px;
      margin-top: 1px;
      color: #409eff;
    }
    // margin-top: 2px;
    // height: 100%;

    .layer-settings {
      height: 19px;
      width: 13px;

      position: absolute;
      right: -5px;
    }

    .toggle-ext-button {
      i {
        opacity: 0;
      }
      &:hover i {
        opacity: 1;
      }
    }

    .my-ext-button {
      margin-left: 4px;
      margin-top: 1px;
      float: right;
    }

    .my-ext-button-hidden {
      visibility: hidden;
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