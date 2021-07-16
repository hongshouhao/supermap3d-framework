export default class SunlightTool {
  constructor(viewer) {
    this.viewer = viewer
    viewer.scene.shadowMap.darkness = 0.3
    viewer.scene.sun.show = true
    for (let ly of viewer.scene.layers._layerQueue) {
      ly.shadowType = 2
    }
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
  }

  start(intercepor) {
    if (this.startTime > this.endTime) {
      return
    }

    let shour = this.startTime.getHours()
    let ehour = this.endTime.getHours()

    let start = new Date(this.startTime.valueOf())
    let nTimer = 0.0
    let nIntervId = setInterval(function() {
      if (shour < ehour) {
        start.setHours(shour)
        start.setMinutes(nTimer)
        viewer.clock.currentTime = Cesium.JulianDate.fromDate(start)
        nTimer += 10.0
        if (nTimer > 60.0) {
          shour += 1.0
          if (intercepor) {
            intercepor(shour)
          }
          nTimer = 0.0
        }
      } else {
        clearInterval(nIntervId)
      }
    }, 20)
  }

  clear() {
    let currentTime = new Date()
    currentTime.setHours(12)
    this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(currentTime)
    this.viewer.clock.multiplier = 1
    this.viewer.clock.shouldAnimate = true
  }
}
