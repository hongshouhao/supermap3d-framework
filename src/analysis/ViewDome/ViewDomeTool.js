import $ from 'jquery'

export default class ViewDomeTool {
  constructor(viewer) {
    this.viewer = viewer
    this.built = false
    this.viewDome = new Cesium.ViewDome(viewer.scene)
    this.viewDome.distance = 100
    this.viewDome.domeType = Cesium.ViewDomeType.ALLDOME
    this.viewDome.visibleAreaColor = Cesium.Color.fromAlpha(
      Cesium.Color.fromCssColorString('#1891ba'),
      0.5
    )
    this.viewDome.hiddenAreaColor = Cesium.Color.fromAlpha(
      Cesium.Color.fromCssColorString('#ce3839'),
      0.5
    )
    this.viewDome.startAngle = 0
    this.viewDome.endAngle = 360
    this.viewDome.isClosed = true
    this.handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
  }

  start() {
    this.viewer.enableCursorStyle = false
    this.viewer._element.style.cursor = ''
    $('body')
      .removeClass('drawCur')
      .addClass('drawCur')

    let _this = this
    this.handler.setInputAction(function(e) {
      _this.viewer.enableCursorStyle = true
      $('body').removeClass('drawCur')

      let position = _this.viewer.scene.pickPosition(e.position)
      let cartographic = Cesium.Cartographic.fromCartesian(position)
      let longitude = Cesium.Math.toDegrees(cartographic.longitude)
      let latitude = Cesium.Math.toDegrees(cartographic.latitude)
      let height = cartographic.height

      if (height < 0) {
        height = 0
      }

      _this.viewDome.viewPosition = [longitude, latitude, height]
      _this.viewDome.startAngle = 0 //必须要加这行无用得代码 不然不更新
      if (!_this.built) {
        _this.viewDome.build()
        _this.built = true
      }

      _this.viewer.entities.removeAll()
      _this.viewer.entities.add(
        new Cesium.Entity({
          point: new Cesium.PointGraphics({
            color: new Cesium.Color(1, 0, 0),
            pixelSize: 10,
            outlineColor: new Cesium.Color(0, 1, 1),
          }),
          position: Cesium.Cartesian3.fromDegrees(
            longitude,
            latitude,
            height + 0.5
          ),
        })
      )

      _this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }

  clear() {
    this.viewer.entities.removeAll()
    this.viewDome.clear()
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
}
