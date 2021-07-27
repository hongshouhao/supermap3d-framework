<template>
  <div class="layer-tree">
    <div ref="viewportSpliter"
         v-show="multiViewport"
         class="viewport-spliter" />
    <!-- <div class="tree-div"> -->
    <el-tree :data="layersData"
             node-key="id"
             show-checkbox
             @check-change="setLayerVisible1"
             :render-content="renderExtButton"
             :default-expanded-keys="defaultExpandedKeys"
             :default-checked-keys="defaultCheckedKeys">
    </el-tree>
    <!-- </div> -->

    <div v-if="multiViewport"
         class="divider">
      <el-divider direction="vertical"></el-divider>
    </div>

    <div>
      <el-tree v-if="multiViewport"
               :data="layersData"
               node-key="id"
               show-checkbox
               @check-change="setLayerVisible2"
               :render-content="renderExtButton"
               :default-expanded-keys="defaultExpandedKeys"
               :default-checked-keys="defaultCheckedKeys">
      </el-tree>
    </div>
  </div>
</template>

<script> 
export default {
  data () {
    return {
      layersData: [],
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      multiViewport: false
    }
  },
  props: [],
  mounted () {
  },
  methods: {
    init () {
      if (window.s3d.viewer) {
        this.addLayers(window.s3d.config.layers)
        this.layersData = window.s3d.config.layers

        window.s3d.viewer.camera.flyTo(window.s3d.config.defaultCamera);
        window.s3d.viewer._element.appendChild(this.$refs.viewportSpliter)
      }
    },
    addLayers (layersData) {
      let _this = this
      for (let lyD of layersData) {
        if (lyD.layer) {

          if (lyD.layer.type === "Terrain") {
            new Cesium.CesiumTerrainProvider({
              url: TEST_TERRAIN,
              isSct: true
            })
          }
          else if (lyD.layer.type === "MapImagery") {
            var l = new Cesium.SuperMapImageryProvider({
              url: lyD.layer.url
            });
            window.s3d.viewer.imageryLayers.addImageryProvider(l)
            console.log(l)
          }
          else if (lyD.layer.type === "S3M") {
            if (lyD.layer.visible) {
              _this.defaultCheckedKeys.push(lyD.id)
            }

            if (lyD.layer.url) {
              window.s3d.viewer.scene.addS3MTilesLayerByScp(lyD.layer.url, { name: lyD.label }).then((ly) => {
                lyD.cesiumLayer = ly
                ly.visible = lyD.layer.visible

                if (lyD.layer.queryParameter) {
                  ly.setQueryParameter(queryParameter);
                }

                if (lyD.layer.enableFillAndWireFrame) {
                  ly.style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame;
                  ly.style3D.lineColor = Cesium.Color.fromCssColorString('rgb(0,0,0)');
                  ly.style3D.lineWidth = 1;
                  ly.wireFrameMode = 2
                }
              });
            }
          }
          else if (lyD.layer.type === "MVT") {
            var mvtMap = window.s3d.viewer.scene.addVectorTilesMap({
              url: lyD.layer.url,
              name: lyD.label,
              viewer: window.s3d.viewer
            });
            console.log(mvtMap)
          }

          else {
            throw '图层类型配置错误'
          }
        }
        else if (lyD.children) {
          if (lyD.expand) {
            _this.defaultExpandedKeys.push(lyD.id)
          }
          this.addLayers(lyD.children)
        }
      }
    },
    setLayerVisible1 (data, checked) { this.setLayerVisible(0, data, checked) },
    setLayerVisible2 (data, checked) { this.setLayerVisible(1, data, checked) },
    setLayerVisible (viewport, data, checked) {
      if (data.children && data.children.length > 0) {
        return
      }

      if (this.multiViewport) {
        data.cesiumLayer.setVisibleInViewport(viewport, checked);
      }
      else {
        data.cesiumLayer.visible = checked
      }
    },
    renderExtButton (h, { node, data }) {
      let checkedLayer = !(
        (node.childNodes && node.childNodes.length > 0) ||
        node.checked === false
      )

      const gotoLayer = function (node, data) {
        window.s3d.viewer.flyTo(data.cesiumLayer)
      }
      return (
        <span class="custom-tree-node">
          <span class="toggle-ext-button">{node.label}
            <i class={checkedLayer ? "esri-icon-directions2 my-ext-button" : "esri-icon-directions2 my-ext-button my-ext-button-hidden"} on-click={() => gotoLayer(node, data)} />
          </span>
        </span>
      )
    },
    toggleViewportMode () {
      if (this.multiViewport) {
        window.s3d.viewer.scene.multiViewportMode = Cesium.MultiViewportMode.NONE
        this.multiViewport = false
      }
      else {
        window.s3d.viewer.scene.multiViewportMode = Cesium.MultiViewportMode.HORIZONTAL
        this.multiViewport = true
      }
    }
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
    .el-divider {
      height: 100%;
    }
  }
}

.custom-tree-node {
  display: flex;
  margin-bottom: 6px;
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
  margin-top: 2px;
  float: right;
}

.my-ext-button-hidden {
  visibility: hidden;
}

.viewport-spliter {
  position: absolute;
  background-color: white;
  left: 50%;
  top: 0;
  width: 2px;
  height: 100%;
}
</style>