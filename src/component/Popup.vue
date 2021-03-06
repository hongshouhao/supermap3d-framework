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
      this.handler3D = new Cesium.ScreenSpaceEventHandler(window.s3d.viewer.scene.canvas)
      let _this = this
      this.handler3D.setInputAction(function (e) {
        let pickobject = window.s3d.viewer.scene.pick(e.position)
        if (pickobject) {
          if (typeof pickobject.id !== 'string') {
            _this.hidePopup()
            return
          }
          let object = {}
          if (pickobject.primitive) {
            object.id = pickobject.id
            object.layerName = pickobject.primitive.name
          }

          let position = window.s3d.viewer.scene.pickPosition(e.position)
          let cartographic = Cesium.Cartographic.fromCartesian(position)
          let longitude = Cesium.Math.toDegrees(cartographic.longitude)
          let latitude = Cesium.Math.toDegrees(cartographic.latitude)
          let height = cartographic.height

          _this.renderPopup(position, {
            object: object,
            position: {
              longitude: longitude,
              latitude: latitude,
              height: height,
            },
          })
        } else {
          _this.hidePopup()
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },

    renderPopup (worldPosition, data) {
      this.setHeader(this.getPopupHeader(data))
      this.setContent(this.getPopupContent(data))
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
        value: data.object.layerName,
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
      return arr
    },

    getPopupHeader (data) {
      return data.object.layerName + ' - ' + data.object.id
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
    max-height: 800px !important;
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