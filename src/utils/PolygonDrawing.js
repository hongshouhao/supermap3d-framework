export default class PolygonDrawing {
  constructor() {
    this.callback = function() {}
    this.polygonDrawHandler = new Cesium.DrawHandler(
      viewer,
      Cesium.DrawMode.Polygon,
      0
    )

    this.polygonDrawHandler.activeEvt.addEventListener(function(isActive) {
      if (isActive == true) {
        viewer.enableCursorStyle = false
        viewer._element.style.cursor = ''

        $('body')
          .removeClass('drawCur')
          .addClass('drawCur')
      } else {
        viewer.enableCursorStyle = true
        $('body').removeClass('drawCur')
      }
    })

    let points = []

    let _this = this
    this.polygonDrawHandler.drawEvt.addEventListener(function(result) {
      points.length = 0
      let polygon = result.object
      if (!polygon) {
        return
      }

      polygon.show = false
      _this.polygonDrawHandler.polyline.show = false

      let positions = [].concat(polygon.positions)
      positions = Cesium.arrayRemoveDuplicates(
        positions,
        Cesium.Cartesian3.equalsEpsilon
      )

      for (let i = 0, len = positions.length; i < len; i++) {
        let cartographic = Cesium.Cartographic.fromCartesian(
          polygon.positions[i]
        )
        let longitude = Cesium.Math.toDegrees(cartographic.longitude)
        let latitude = Cesium.Math.toDegrees(cartographic.latitude)

        points.push(longitude)
        points.push(latitude)
      }

      if (_this.callback) {
        _this.callback(points)
      }
    })
  }

  setFinishDrawingCallback(callback) {
    this.callback = callback
  }

  start() {
    this.polygonDrawHandler.activate()
  }

  reset() {
    this.polygonDrawHandler.deactivate()
  }
}
