<template>
  <div class="layer-tree">
    <div ref="viewportSpliter"
         v-show="multiViewport"
         class="viewport-spliter" />
    <el-tree show-checkbox
             node-key="id"
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
    window.s3d.eventBus.addEventListener("framework-initialized", () => {
      console.debug("framework-initialized")
      _this.init()
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
        if (lyNode.layer) {
          if (!lyNode.layer.opacity) {
            lyNode.layer.opacity = 100
          }
          if (lyNode.layer.visible) {
            _this.defaultCheckedKeys.push(lyNode.id)
          }
          if (lyNode.layer.type === "SMIMG") {
            let imgl = new Cesium.SuperMapImageryProvider({
              url: lyNode.layer.url
            });
            let cly = _this.viewer.imageryLayers.addImageryProvider(imgl)
            cly.type = lyNode.layer.type
            cly.config = lyNode.layer
            cly.show = lyNode.layer.visible
            lyNode.cesiumLayer = cly
          }
          else if (lyNode.layer.type === "S3M") {
            if (lyNode.layer.url) {
              let promise = _this.viewer.scene.addS3MTilesLayerByScp(lyNode.layer.url,
                {
                  name: lyNode.name,
                })
              promise.then((cly) => {
                cly.type = lyNode.layer.type
                cly.config = lyNode.layer
                cly.visible = lyNode.layer.visible
                cly.indexedDBSetting.isAttributesSave = true;
                cly.selectColorType = Cesium.SelectColorType.REPLACE
                // cly.selectedColor = Cesium.Color.RED
                // cly.selectedLineColor = Cesium.Color.BLUE
                // cly.silhouetteColor = Cesium.Color.RED
                // cly.silhouetteSize = 10
                // console.log(cly.silhouetteColor)
                lyNode.cesiumLayer = cly

                if (lyNode.layer.enableFillAndWireFrame) {
                  cly.style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame;
                  cly.style3D.lineColor = Cesium.Color.BLACK;
                  cly.style3D.lineWidth = 1;
                  cly.wireFrameMode = Cesium.WireFrameType.EffectOutline
                  // cly.wireFrameMode = Cesium.WireFrameType.Triangle
                }
              })
            }
            else {
              throw 'S3M图层配置错误:URL'
            }
          }
          else if (lyNode.layer.type === "MVT") {
            let cly = _this.viewer.scene.addVectorTilesMap({
              url: lyNode.layer.url,
              name: lyNode.name,
              viewer: _this.viewer
            });
            cly.type = lyNode.layer.type
            cly.config = lyNode.layer
            cly.show = lyNode.layer.visible
            lyNode.cesiumLayer = cly
          }
          else if (lyNode.layer.type === "DEM") {
            lyNode.dem = new Cesium.CesiumTerrainProvider({
              url: lyNode.layer.url,
            })
            lyNode.dem0 = new Cesium.CesiumTerrainProvider({
              url: lyNode.layer.url0,
            })
            lyNode.dem.isCreateSkirt = false;
            lyNode.dem0.isCreateSkirt = false;
            if (lyNode.layer.visible) {
              _this.viewer.terrainProvider = lyNode.dem
            }
            else {
              _this.viewer.terrainProvider = lyNode.dem0
            }
          }
          else {
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
    setLayerVisible1 (data, checked) { this.setLayerVisible(0, data, checked) },
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
          window.s3d._setLayerVisible(data.cesiumLayer, checked)
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