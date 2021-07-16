// import { transformMousePosition } from '../../utils/CesiumMath'

export default class PointMeasurement {
  // constructor(viewer) {
  //   this.editHandler = new Cesium.ScreenSpaceEventHandler(
  //     this.viewer.scene.canvas
  //   )
  // }
  // start() {
  //   let _this = this
  //   _this.editHandler.setInputAction(function(e) {
  //     let position = this.viewer.scene.pickPosition(e.endPosition)
  //     let cartographic = Cesium.Cartographic.fromCartesian(position)
  //     let longitude = Cesium.Math.toDegrees(cartographic.longitude)
  //     let latitude = Cesium.Math.toDegrees(cartographic.latitude)
  //     if (this.point) {
  //       this.addPonit(`坐标: ${longitude.toFixed(4)}, ${latitude.toFixed(4)}`)
  //     } else {
  //     }
  //   }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  //   _this.editHandler.setInputAction(function() {
  //     _this.editHandler.removeInputAction(
  //       Cesium.ScreenSpaceEventType.MOUSE_MOVE
  //     )
  //     _this.editHandler.removeInputAction(
  //       Cesium.ScreenSpaceEventType.RIGHT_CLICK
  //     )
  //   }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  // }
  // addPonit(position, text) {
  //   this.pointEntity = viewer.entities.add({
  //     position: position,
  //     point: {
  //       pixelSize: 10,
  //       color: Cesium.Color.RED,
  //     },
  //     label: {
  //       text: text,
  //       font: '30px Sans-Serif',
  //       fillColor: Cesium.Color.RED,
  //       outlineColor: Cesium.Color.GOLD,
  //       style: Cesium.LabelStyle.FILL,
  //       verticalOrigin: Cesium.VerticalOrigin.CENTER,
  //       pixelOffset: new Cesium.Cartesian2(0, -10),
  //       backgroundColor: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
  //       showBackground: true,
  //     },
  //   })
  // }
  // updatePonit(position) {
  //   this.pointEntity.position = new Cesium.CallbackProperty(function() {
  //     return Cesium.Rectangle.fromCartesianArray([
  //       _this.clippingRectangleOutlinePositions[0],
  //       _this.clippingRectangleOutlinePositions[2],
  //     ])
  //   }, false)
  //   this.pointEntity.label.text = ''
  // }
}
