export default class SceneRouteTool {
  constructor(viewer) {
    this.viewer = viewer
  }

  setRoute(fpfUrl) {
    let routes = new Cesium.RouteCollection(this.viewer.entities)
    routes.fromFile(fpfUrl)
    this.flyManager = new Cesium.FlyManager({
      scene: this.viewer.scene,
      routes: routes,
    })

    let _this = this
    return this.flyManager.readyPromise.then(function() {
      _this.flyManager.currentRoute.isLineVisible = false
      _this.flyManager.currentRoute.isStopVisible = false
    })
  }

  start() {
    if (this.flyManager) {
      this.flyManager.play()
    }
  }

  pause() {
    if (this.flyManager) {
      this.flyManager.pause()
    }
  }

  stop() {
    if (this.flyManager) {
      this.flyManager.stop()
    }
  }
}
