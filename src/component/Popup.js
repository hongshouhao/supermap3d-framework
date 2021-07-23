import $ from 'jquery'
export default class Popup {
  constructor(viewer) {
    this.viewer = viewer
    this.popupVisible = false
    this.handler3D = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

    let _this = this
    this.handler3D.setInputAction(function(e) {
      let pickobject = viewer.scene.pick(e.position)
      if (pickobject) {
        let object = {}
        if (pickobject.primitive) {
          object.id = pickobject.id
          object.layerName = pickobject.primitive.name
        }

        let position = viewer.scene.pickPosition(e.position)
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
  }

  renderPopup(worldPosition, data) {
    window.popup.setHeader(this.getPopupHeader(data))
    window.popup.setContent(this.getPopupContent(data))
    this.worldPosition = worldPosition
    $(window.popup.$el).show()
    this.addStickRender()
  }

  addStickRender() {
    let _this = this
    this.removeStickRender()
    this.removePostRenderHandler = this.viewer.scene.postRender.addEventListener(
      function() {
        let screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          _this.viewer.scene,
          _this.worldPosition
        )

        let popupDom = window.popup.$el
        let left = screenPosition.x - popupDom.offsetWidth / 2
        let top = screenPosition.y - popupDom.offsetHeight - 30

        if (left < 0) {
          left = 0
        }
        if (top < 0) {
          top = 0
        }

        popupDom.style.left = left + 'px'
        popupDom.style.top = top + 'px'
      }
    )
  }

  removeStickRender() {
    if (this.removePostRenderHandler) {
      this.removePostRenderHandler()
      this.removePostRenderHandler = null
    }
  }

  getPopupContent(data) {
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
  }

  getPopupHeader(data) {
    return data.object.layerName + ' - ' + data.object.id
  }

  hidePopup() {
    if (this.removePostRenderHandler) {
      this.removePostRenderHandler()
      this.removePostRenderHandler = null
    }
    $(window.popup.$el).hide()
  }
}
