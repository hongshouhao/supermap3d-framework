export default class SunlightTool {
  constructor(viewer) {
    this.viewer = viewer
    for (let ly of viewer.scene.layers._layerQueue) {
      ly.shadowType = 2
    }

    this.updateInterval = 20
    this.state = 'none'
  }

  setTimeRange(date, startHour, endHour) {
    this.startTime = null
    this.endTime = null

    if (date instanceof Date) {
      this.startTime = new Date(date.valueOf())
      this.endTime = new Date(date.valueOf())
    } else {
      this.startTime = new Date(date)
      this.endTime = new Date(date)
    }

    this.startTime.setHours(parseInt(startHour))
    this.endTime.setHours(parseInt(endHour))
    return this
  }

  start(intercepor, completedCallback) {
    this.viewer.scene.shadowMap.darkness = 0.3
    this.viewer.scene.sun.show = true

    if (this.state === 'none') {
      if (this.startTime > this.endTime) {
        return
      }

      this._shour = this.startTime.getHours()
      this._ehour = this.endTime.getHours()

      this._start = new Date(this.startTime.valueOf())
      this._nTimer = 0.0
    }

    this.state = 'running'
    let _this = this
    this._nIntervId = setInterval(function() {
      if (_this._shour < _this._ehour) {
        _this._start.setHours(_this._shour)
        _this._start.setMinutes(_this._nTimer)
        _this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(
          _this._start
        )
        _this._nTimer += 10.0
        if (_this._nTimer > 60.0) {
          _this._shour += 1.0
          if (intercepor) {
            intercepor(_this._shour)
          }
          _this._nTimer = 0.0
        }
      } else {
        clearInterval(_this._nIntervId)
        _this._nIntervId = null
        if (completedCallback) {
          completedCallback()
        }
        _this.state = 'none'
      }
    }, _this.updateInterval)
  }

  pause() {
    if (this._nIntervId) {
      clearInterval(this._nIntervId)
    }
    this.state = 'paused'
  }

  clear() {
    let currentTime = new Date()
    currentTime.setHours(12)
    this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(currentTime)
    this.viewer.clock.multiplier = 1
    this.viewer.clock.shouldAnimate = true
    this.state = 'none'
    this._nIntervId = null
  }
}
