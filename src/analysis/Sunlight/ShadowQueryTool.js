import { setCursor, resetCursor } from '../../utils/CursorUtility'
export default class ShadowQueryTool {
  constructor(viewer) {
    this.viewer = viewer

    this.shadowQuery = new Cesium.ShadowQueryPoints(viewer.scene)
    this.shadowQuery.spacing = 10
    this.shadowQuery.timeInterval = 60
    this.shadowQuery.build()

    this.polygonDrawHandler = new Cesium.DrawHandler(
      viewer,
      Cesium.DrawMode.Polygon,
      0
    )

    this.polygonDrawHandler.activeEvt.addEventListener(function(isActive) {
      if (isActive == true) {
        setCursor(viewer, 'cursor-crosshair')
      } else {
        resetCursor(viewer, 'cursor-crosshair')
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

      _this.shadowQuery.qureyRegion({
        position: points,
        bottom: 10,
        extend: 50,
      })
    })
  }

  setTimeRange(date, startHour, endHour) {
    this.startTime = null
    this.endTime = null

    if (date instanceof Date) {
      this.startTime = new Date(this.date.valueOf())
      this.endTime = new Date(this.date.valueOf())
    } else {
      this.startTime = new Date(date)
      this.endTime = new Date(date)
    }

    this.startTime.setHours(parseInt(startHour))
    this.endTime.setHours(parseInt(endHour))

    this.shadowQuery.startTime = Cesium.JulianDate.fromDate(this.startTime)
    this.shadowQuery.endTime = Cesium.JulianDate.fromDate(this.endTime)
  }

  start() {
    this.polygonDrawHandler.deactivate()
    this.polygonDrawHandler.activate()
  }

  clear() {
    this.polygonDrawHandler.deactivate()

    if (this.polygonDrawHandler.polygon) {
      this.polygonDrawHandler.polygon.show = false
    }
    if (this.polygonDrawHandler.polyline) {
      this.polygonDrawHandler.polyline.show = false
    }

    this.viewer.entities.removeAll()

    this.shadowQuery.qureyRegion({
      position: [0, 0],
      bottom: 0,
      extend: 0,
    })
  }
}
