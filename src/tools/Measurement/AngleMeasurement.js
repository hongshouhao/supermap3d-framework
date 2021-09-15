import {
  extendLine,
  pointOnDirection,
  rotateVector,
} from '../../utils/CesiumMath'

export default class AngleMeasurement {
  constructor(viewer) {
    this.viewer = viewer
    this.angleDrawHandler = new Cesium.ScreenSpaceEventHandler(
      viewer.scene.canvas
    )
  }

  start() {
    this.clear()

    window.s3d.toolWorking = true

    let step = 0
    let _this = this
    _this.legLength = 0

    window.s3d.setCursor('cursor-crosshair')

    _this.anglePositions = []
    _this.angleDrawHandler.setInputAction(function(e) {
      let point = window.s3d.viewUtility.screenPositionToCartesian(e.position)
      if (step === 0) {
        _this.anglePositions.push(point)
        step = step + 1
      } else if (step === 1) {
        _this.anglePositions[1] = point
        _this.updateAngleEntity()
        _this.legLength = Cesium.Cartesian3.distance(
          _this.anglePositions[0],
          _this.anglePositions[1]
        )
        step = step + 1
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    _this.angleDrawHandler.setInputAction(function(e) {
      let point = window.s3d.viewUtility.screenPositionToCartesian(
        e.endPosition
      )
      if (step === 1) {
        _this.anglePositions[1] = point
        if (!_this.angleEntity) {
          _this.createAngleEntity()
        } else {
          _this.updateAngleEntity()
        }
      } else if (step === 2) {
        let newEndPoint = extendLine(
          _this.anglePositions[1],
          point,
          _this.legLength
        )
        _this.anglePositions[2] = newEndPoint
        _this.updateAngleEntity()
        _this.addAnnotation()
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    _this.angleDrawHandler.setInputAction(function() {
      window.s3d.resetCursor()

      _this.angleDrawHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      )
      _this.angleDrawHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.RIGHT_CLICK
      )
      _this.angleDrawHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      )

      window.s3d.toolWorking = false
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }

  clear() {
    window.s3d.toolWorking = false
    if (this.angleEntity) {
      this.viewer.entities.remove(this.angleEntity)
      this.angleEntity = null
    }
    if (this.angleAuxiliaryEntity) {
      this.viewer.entities.remove(this.angleAuxiliaryEntity)
      this.angleAuxiliaryEntity = null
    }
    if (this.textEntity) {
      this.viewer.entities.remove(this.textEntity)
      this.textEntity = null
    }
    this.angleDrawHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.MOUSE_MOVE
    )
    this.angleDrawHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.RIGHT_CLICK
    )
    this.angleDrawHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    )
  }

  createAngleEntity() {
    let _this = this
    _this.angleEntity = _this.viewer.entities.add({
      name: 'angle_measure_line',
      polyline: {
        positions: _this.anglePositions,
        material: Cesium.Color.fromCssColorString('#12D035'),
        width: 2.0,
        clampToGround: false,
      },
    })
  }

  updateAngleEntity() {
    let _this = this
    _this.angleEntity.polyline.positions = new Cesium.CallbackProperty(
      () => _this.anglePositions,
      false
    )
  }

  addAnnotation() {
    let v1 = Cesium.Cartesian3.subtract(
      this.anglePositions[0],
      this.anglePositions[1],
      new Cesium.Cartesian3()
    )
    let v2 = Cesium.Cartesian3.subtract(
      this.anglePositions[2],
      this.anglePositions[1],
      new Cesium.Cartesian3()
    )

    let angle = Cesium.Cartesian3.angleBetween(v1, v2)
    let normal = Cesium.Cartesian3.cross(v1, v2, new Cesium.Cartesian3())

    let pn = pointOnDirection(this.anglePositions[1], v1, this.legLength * 0.1)
    let v = Cesium.Cartesian3.subtract(
      pn,
      this.anglePositions[1],
      new Cesium.Cartesian3()
    )

    this.addAuxiliaryLine(v, normal, angle)
    this.addAngleText(v, normal, angle)
  }

  addAuxiliaryLine(vector, normal, angle) {
    let step = 0.1
    let angleAuxiliary = []
    for (let al = -1 * step; al < angle; al = al + step) {
      let vn = rotateVector(vector, normal, al)
      let p = Cesium.Cartesian3.add(
        vn,
        this.anglePositions[1],
        new Cesium.Cartesian3()
      )
      angleAuxiliary.push(p)
    }

    let vn = rotateVector(vector, normal, angle + step)
    let p = Cesium.Cartesian3.add(
      vn,
      this.anglePositions[1],
      new Cesium.Cartesian3()
    )
    angleAuxiliary.push(p)

    if (this.angleAuxiliaryEntity) {
      this.angleAuxiliaryEntity.polyline.positions = new Cesium.CallbackProperty(
        () => angleAuxiliary,
        false
      )
    } else {
      this.angleAuxiliaryEntity = this.viewer.entities.add({
        name: 'angle_measure_auxiliary',
        polyline: {
          positions: angleAuxiliary,
          material: Cesium.Color.fromCssColorString('#12D035'),
          width: 2.0,
          clampToGround: false,
        },
      })
    }
  }

  addAngleText(v, normal, angle) {
    let vn = rotateVector(v, normal, angle / 2)
    let p = Cesium.Cartesian3.add(
      vn,
      this.anglePositions[1],
      new Cesium.Cartesian3()
    )

    if (this.textEntity) {
      this.textEntity.position = new Cesium.CallbackProperty(() => p, false)
      this.textEntity.label.text = Cesium.Math.toDegrees(angle).toFixed(2) + '°'
    } else {
      this.textEntity = this.viewer.entities.add({
        position: p,
        name: 'angle_measure_text',
        label: {
          text: Cesium.Math.toDegrees(angle).toFixed(2) + '°',
          font: '20px 宋体',
          // fillColor: Cesium.Color.WHITE,
          fillColor: Cesium.Color.fromCssColorString('#FF6600'),
          outlineColor: Cesium.Color.fromCssColorString('#FF6600'),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          // pixelOffset: new Cesium.Cartesian2(10, 0),
          showBackground: false,
          eyeOffset: new Cesium.Cartesian3(0, 0, -10),
        },
      })
    }
  }
}
