import { setCursor, resetCursor } from '../../utils/CursorUtility'
export default class PointMeasurement {
  constructor(viewer) {
    this.viewer = viewer
    this.pointEntities = []
    this.currentEntity = null
    this.status = 'none'
    this.drag = false
    this.createHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    )

    this.editHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    )
  }

  start() {
    if (this.createHandler) {
      this.createHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      )
      this.createHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.RIGHT_CLICK
      )
      this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
      this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
      this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }

    let _this = this
    setCursor(viewer, 'cursor-crosshair')
    _this.createHandler.setInputAction(function(e) {
      if (_this.status === 'none') {
        _this.status = 'moving'
        _this.addPonit(e.endPosition)
      } else if (_this.status === 'moving') {
        _this.updatePonit(e.endPosition)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    _this.createHandler.setInputAction(function() {
      resetCursor(viewer, 'cursor-crosshair')
      _this.createHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      )
      _this.createHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.RIGHT_CLICK
      )
      _this.status = 'none'
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    _this.editHandler.setInputAction(function(e) {
      let pick = _this.viewer.scene.pick(e.position, 15, 15)
      if (
        Cesium.defined(pick) &&
        pick.id &&
        pick.id.name === 'point_annotation'
      ) {
        _this.drag = true
        _this.status = 'moving'
        _this.currentEntity = pick.id
        _this.viewer.scene.screenSpaceCameraController.enableInputs = false
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

    _this.editHandler.setInputAction(function(e) {
      if (_this.drag) {
        _this.updatePonit(e.endPosition)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    _this.editHandler.setInputAction(function() {
      if (_this.drag) {
        _this.status = 'none'
        _this.drag = false
        _this.viewer.scene.screenSpaceCameraController.enableInputs = true
      }
    }, Cesium.ScreenSpaceEventType.LEFT_UP)
  }

  clear() {
    for (let ent of this.pointEntities) {
      this.viewer.entities.remove(ent)
    }
    this.createHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    this.createHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.RIGHT_CLICK
    )
    this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
    this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
    this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }

  addPonit(position) {
    let p = this.transformMousePosition(position)
    let pointPosition = Cesium.Cartesian3.fromDegrees(
      p.longitude,
      p.latitude,
      p.height
    )

    let entity = this.viewer.entities.add({
      position: pointPosition,
      name: 'point_annotation',
      point: {
        pixelSize: 8,
        color: Cesium.Color.YELLOW,
      },
      label: {
        text: this.getLableText(p),
        font: '20px 宋体',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.fromCssColorString('#212fd2'),
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        pixelOffset: new Cesium.Cartesian2(10, -10),
        backgroundColor: Cesium.Color.fromAlpha(
          Cesium.Color.fromCssColorString('#2b312c'),
          1
        ),
        showBackground: true,
        eyeOffset: new Cesium.Cartesian3(0, 0, -10),
      },
    })
    this.currentEntity = entity
    this.pointEntities.push(entity)
  }

  updatePonit(mousePosition) {
    if (this.currentEntity) {
      let position = this.transformMousePosition(mousePosition)
      this.currentEntity.position = new Cesium.CallbackProperty(function() {
        return Cesium.Cartesian3.fromDegrees(
          position.longitude,
          position.latitude,
          position.height
        )
      }, false)

      this.currentEntity.label.text = this.getLableText(position)
    }
  }

  getLableText(point) {
    return `经度: ${point.longitude.toFixed(4)}\n纬度: ${point.latitude.toFixed(
      4
    )}\n高度: ${point.height.toFixed(3)}m`
  }

  transformMousePosition(mousePosition) {
    let position = this.viewer.scene.pickPosition(mousePosition)
    let cartographic = Cesium.Cartographic.fromCartesian(position)
    let longitude = Cesium.Math.toDegrees(cartographic.longitude)
    let latitude = Cesium.Math.toDegrees(cartographic.latitude)
    return {
      longitude: longitude,
      latitude: latitude,
      height: cartographic.height,
    }
  }
}
