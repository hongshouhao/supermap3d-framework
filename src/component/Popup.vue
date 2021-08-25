<template>
  <div v-show="popupVisible"
       ref="popup"
       class="my-popup esri-component esri-popup esri-popup--aligned-top-center esri-popup--shadow">
    <div class="esri-popup__main-container esri-widget esri-popup--is-collapsible">
      <header class="esri-popup__header">
        <h2 class="esri-widget__heading esri-popup__header-title">{{title}}</h2>
        <div class="esri-popup__header-buttons">
          <div title="停靠"
               class="esri-popup__button esri-popup__button--dock"
               @click="dock">
            <span ref="dockIcon"
                  class="esri-popup__icon--dock-icon esri-icon-dock-right esri-popup__icon"></span>
          </div>
          <div title="关闭"
               class="esri-popup__button"
               @click="hidePopup">

            <span class="esri-popup__icon esri-icon-close"></span>
          </div>
        </div>
      </header>
      <article class="esri-popup__content">
        <PropertyGrid v-show="showPropGrid"
                      :propArray="propArray" />
        <div v-show="!showPropGrid"
             ref="content"></div>
      </article>
    </div>
    <div ref="popupPointer"
         class="esri-popup__pointer">
      <div class="esri-popup__pointer-direction esri-popup--shadow"></div>
    </div>
  </div>
</template>

<script>
import PropertyGrid from './PropertyGrid.vue'
export default {
  data () {
    return {
      propArray: [],
      title: "",
      dockered: false,
      handler3D: null,
      popupTool: null,
      popupVisible: false,
      worldPosition: null,
      showPropGrid: true,
      removePostRenderHandler: null,
    }
  },
  components: {
    PropertyGrid
  },
  props: [],
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.initIQueryFor3D()
      // this.initIQueryForMVT()
    },
    initIQueryFor3D () {
      let _this = this
      this.handler3D = new Cesium.ScreenSpaceEventHandler(window.s3d.viewer.scene.canvas)
      this.handler3D.setInputAction(function (e) {
        if (!window.s3d.toolWorking) {
          let pickobject = window.s3d.viewer.scene.pick(e.position)
          if (pickobject) {
            if (typeof pickobject.id !== 'string') {
              _this.hidePopup()
              return
            }

            let dobj = {
              object: {
                id: "",
                layer: "",
                attributes: {}
              },
              position: {
                longitude: 0,
                latitude: 0,
                height: 0,
              },
            }

            if (pickobject.primitive) {
              dobj.object.id = pickobject.id
              dobj.object.layer = pickobject.primitive.name
              dobj.position.longitude = pickobject.primitive.lon
              dobj.position.latitude = pickobject.primitive.lat
              dobj.position.height = pickobject.primitive.height
            }

            let position = window.s3d.viewer.scene.pickPosition(e.position)
            // let cartographic = Cesium.Cartographic.fromCartesian(position)
            // longitude = Cesium.Math.toDegrees(cartographic.longitude)
            // latitude = Cesium.Math.toDegrees(cartographic.latitude)
            // height = cartographic.height

            let lconfig = window.s3d.getLayerConfig(dobj.object.layer)
            if (lconfig.outFields
              && lconfig.outFields instanceof Array
              && lconfig.outFields.length > 0) {
              let theLayer = window.s3d.getLayer(dobj.object.layer)

              theLayer.getAttributesById(dobj.object.id).then((atts) => {
                if (lconfig.outFields[0] === "*") {
                  dobj.object.attributes = atts
                }
                else {
                  for (let f of lconfig.outFields) {
                    dobj.object.attributes[f] = atts[f]
                  }
                }

                _this.renderPopup(position, dobj)
              });
            }
            else {
              _this.renderPopup(position, dobj)
            }
          } else {
            _this.hidePopup()
          }
        } else {
          _this.hidePopup()
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    initIQueryForMVT () {
      window.s3d.viewer.selectedEntityChanged.addEventListener(function (entity) {
        debugger

        if (!Cesium.defined(entity) || !Cesium.defined(entity.pickResult)) {
          return;
        }

        let pickResult = entity.pickResult;
        let properties = null;

        let labelOrBillboardClicked = Cesium.defined(pickResult.position);
        if (labelOrBillboardClicked) {
          properties = {};
          for (let obj in pickResult) {
            properties[obj] = pickResult[obj];
          }
        } else {
          for (let obj in pickResult) {
            let pickFeature = pickResult[obj][0].feature;
            properties = pickFeature.properties;
            break;
          }
        }
        if (!properties) {
          return;
        }

        console.log(properties)
      });
    },

    renderPopup (worldPosition, data) {
      let lconfig = window.s3d.getLayerConfig(data.object.layer)
      debugger
      if (lconfig && lconfig.popupTemplate) {
        if (!lconfig.popupTemplate.getHeader) {
          throw `配置错误: 图层${data.object.layer}相关配置丢失, 函数popupTemplate.getHeader丢失`
        }
        if (!lconfig.popupTemplate.getContent) {
          throw `配置错误: 图层${data.object.layer}相关配置丢失, 函数popupTemplate.getContent丢失`
        }

        this.setHeader(lconfig.popupTemplate.getHeader(data))
        this.setContent(lconfig.popupTemplate.getContent(data))
      }
      else {
        this.setHeader(this.getPopupHeader(data))
        this.setContent(this.getPopupContent(data))
      }

      this.worldPosition = worldPosition
      this.popupVisible = true

      if (!this.dockered) {
        this.enableStickRender()
      }
    },
    enableStickRender () {
      let _this = this
      if (this.removePostRenderHandler) {
        return
      }
      this.removePostRenderHandler = window.s3d.viewer.scene.postRender.addEventListener(
        function () {
          let screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            window.s3d.viewer.scene,
            _this.worldPosition
          )
          let popupDom = _this.$refs.popup
          let left = screenPosition.x - popupDom.offsetWidth / 2
          let top = screenPosition.y - popupDom.offsetHeight - 30

          if (left < 0
            || top > window.s3d.viewer.scene.canvas.height - popupDom.offsetHeight
            || left > window.s3d.viewer.scene.canvas.width - popupDom.offsetWidth) {
            _this.setPopupStyle(true)
          }
          else if (top < 0) {
            top = screenPosition.y + 10

            if (top - 30 < 0) {
              _this.setPopupStyle(true)
            } else {
              _this.setPopupStyle(false)
              _this.$refs.popupPointer.style.top = '0'
              popupDom.style.left = left + 'px'
              popupDom.style.top = top + 'px'
            }
          }
          else {
            _this.setPopupStyle(false)
            popupDom.style.left = left + 'px'
            popupDom.style.top = top + 'px'
            _this.$refs.popupPointer.style.top = '100%'
          }
        }
      )
    },

    enableDock () {
      this.setPopupStyle(true)
      if (this.removePostRenderHandler) {
        this.removePostRenderHandler()
        this.removePostRenderHandler = null
      }
      this.dockered = true
    },

    disableDock () {
      this.setPopupStyle(false)
      this.enableStickRender()
      this.dockered = false
    },
    setPopupStyle (enableDockStyle) {
      if (enableDockStyle) {
        this.$refs.popup.style.top = '60px'
        this.$refs.popup.style.right = '15px'
        this.$refs.popup.style.left = 'unset'
        this.$refs.popupPointer.style.display = 'none'
        this.$refs.dockIcon.className = "esri-icon-minimize esri-popup__icon"
      }
      else {
        this.$refs.popup.style.right = 'unset'
        this.$refs.popupPointer.style.display = 'unset'
        this.$refs.dockIcon.className = "esri-popup__icon--dock-icon esri-icon-dock-right esri-popup__icon"
      }
    },
    getPopupContent (data) {
      let arr = []
      arr.push({
        key: '对象',
        value: data.object.layer,
      })
      arr.push({
        key: '标识',
        value: data.object.id,
      })
      arr.push({
        key: '经度',
        value: data.position.longitude,
      })
      arr.push({
        key: '纬度',
        value: data.position.latitude,
      })
      arr.push({
        key: '高度',
        value: data.position.height,
      })

      for (let p in data.object.attributes) {
        arr.push({
          key: p,
          value: data.object.attributes[p],
        })
      }
      return arr
    },

    getPopupHeader (data) {
      return data.object.layer + ' - ' + data.object.id
    },

    hidePopup () {
      if (this.removePostRenderHandler) {
        this.removePostRenderHandler()
        this.removePostRenderHandler = null
      }
      this.popupVisible = false
    },

    setHeader (title) {
      this.title = title
    },
    setContent (object) {
      if (object instanceof HTMLElement) {
        this.showPropGrid = false
        this.$refs.content.innerHTML = "";
        this.$refs.content.appendChild(object)
      }
      else if (object instanceof Array) {
        this.showPropGrid = true
        this.propArray = object
      }
    },
    dock () {
      if (this.dockered) {
        this.disableDock()
      }
      else {
        this.enableDock()
      }
    },
  }
}
</script>

<style lang="scss">
.my-popup {
  position: absolute;
  max-width: 500px;

  .esri-popup__main-container {
    max-width: 500px !important;
    max-height: 500px !important;
    width: unset;
  }

  // .esri-popup__content {
  //   margin: 0 0;
  // }

  // .esri-popup__pointer {
  //   top: unset !important;
  // }

  .esri-popup__header {
    border-bottom: solid 1px rgba(110, 110, 110, 0.3);
  }
}
</style>