<template>
  <div class="layer-tree">
    <el-tree :data="layersData"
             node-key="id"
             show-checkbox
             @check-change="setLayerVisible"
             :render-content="renderExtButton"
             :default-expanded-keys="defaultExpandedKeys"
             :default-checked-keys="defaultCheckedKeys">
    </el-tree>
  </div>
</template>

<script>
import { layers } from './layers'

export default {
  data () {
    return {
      layersData: [],
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
    }
  },
  props: [],
  mounted () {
  },
  methods: {
    init () {
      if (window.viewer) {
        this.addLayers(layers)
        this.layersData = layers
        // const targ = layers.filter(x => x.display !== false)
        // this.layersData = targ
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(120.603, 31.175, 400.0),
          orientation: {
            heading: 0.027587479922354774,
            pitch: -0.5169824822585825,
            roll: 6.283185307179586
          }
        });

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
            window.viewer.imageryLayers.addImageryProvider(l)
            console.log(l)
          }
          else if (lyD.layer.type === "S3M") {
            if (lyD.layer.visible) {
              _this.defaultCheckedKeys.push(lyD.id)
            }

            if (lyD.layer.url) {
              window.viewer.scene.addS3MTilesLayerByScp(lyD.layer.url, { name: lyD.label }).then((ly) => {
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

              // window.viewer.scene.open(lyD.layer.url).then((lylist) => {

              //   lyD.cesiumLayer = lylist
              //   for (let clayer of lylist) {

              //     clayer.visible = lyD.layer.visible
              //     // clayer._name = lyD.label

              //     if (lyD.layer.queryParameter) {
              //       clayer.setQueryParameter(queryParameter);
              //     }

              //     if (lyD.layer.enableFillAndWireFrame) {
              //       clayer.style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame;
              //       clayer.style3D.lineColor = Cesium.Color.fromCssColorString('rgb(0,0,0)');
              //       clayer.style3D.lineWidth = 1;
              //       clayer.wireFrameMode = 2
              //     }
              //   }
              // });
            }
            else if (lyD.layer.layerName) {
              // var slayer = scene.layers.find(lyD.layer.layerName);
              // lyD.cesiumLayer = slayer
              // if (slayer) {
              //   slayer.visible = lyD.layer.visible
              // }
            }
          }
          else if (lyD.layer.type === "MVT") {
            var mvtMap = window.viewer.scene.addVectorTilesMap({
              url: lyD.layer.url,
              name: lyD.label,
              viewer: window.viewer
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
    setLayerVisible (data, checked) {
      if (data.children && data.children.length > 0) {
        return
      }
      data.cesiumLayer.visible = checked
      // if (data.cesiumLayer instanceof Array) {
      //   for (let clayer of data.cesiumLayer) {
      //     clayer.visible = checked
      //   }
      // } else if (data.layer.layerName) {
      //   var slayer = scene.layers.find(data.layer.layerName);
      //   if (slayer) {
      //     data.cesiumLayer = slayer
      //     data.cesiumLayer.visible = checked
      //   }
      // } else {
      //   data.cesiumLayer.visible = checked
      // }
    },
    renderExtButton (h, { node, data }) {
      let checkedLayer = !(
        (node.childNodes && node.childNodes.length > 0) ||
        node.checked === false
      )

      const gotoLayer = function (node, data) {
        viewer.flyTo(data.cesiumLayer)
        // if (data.cesiumLayer instanceof Array) {
        //   viewer.flyTo(data.cesiumLayer[0])
        // } else if (data.cesiumLayer) {
        //   viewer.flyTo(data.cesiumLayer)
        // } else if (data.layer.layerName) {
        //   var slayer = scene.layers.find(data.layer.layerName);
        //   if (slayer) {
        //     data.cesiumLayer = slayer
        //     viewer.flyTo(slayer)
        //   }
        // }
      }

      return (
        <span class="custom-tree-node">
          <span class="toggle-ext-button">{node.label}
            <i v-show={checkedLayer} class="esri-icon-directions2 my-ext-button" on-click={() => gotoLayer(node, data)} />
          </span>
        </span>
      )
    },

  }
}
</script>
<style lang="scss">
.layer-tree {
  height: 100%;
  width: 100%;
}
.custom-tree-node {
  display: flex;
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
</style>