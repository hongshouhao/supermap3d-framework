export default class ViewUtility {
  constructor(viewer) {
    this.viewer = viewer
  }

  getViewCenter() {
    let ray = new Cesium.Ray(
      this.viewer.camera.position,
      this.viewer.camera.direction
    )
    let intersection = Cesium.IntersectionTests.rayEllipsoid(
      ray,
      Cesium.Ellipsoid.WGS84
    )

    let point = Cesium.Ray.getPoint(ray, intersection.start)
    return point
  }

  getCameraHeight() {
    return this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
      this.viewer.camera.position
    ).height
  }

  screenPositionToCartesian(screenPosition) {
    let position = this.viewer.scene.pickPosition(screenPosition)
    let cartographic = Cesium.Cartographic.fromCartesian(position)
    let longitude = Cesium.Math.toDegrees(cartographic.longitude)
    let latitude = Cesium.Math.toDegrees(cartographic.latitude)
    return Cesium.Cartesian3.fromDegrees(
      longitude,
      latitude,
      cartographic.height
    )
  }
}
