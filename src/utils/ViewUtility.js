import { rotateVector } from '../utils/CesiumMath'
import DebugUtility from '../utils/DebugUtility'
export default class ViewUtility {
  constructor(viewer) {
    this.viewer = viewer
    this.camera = this.viewer.camera
    this.pointMeasurement = new DebugUtility(this.viewer)
  }

  getViewCenter() {
    let ray = new Cesium.Ray(this.camera.position, this.camera.direction)
    let intersection = Cesium.IntersectionTests.rayEllipsoid(
      ray,
      Cesium.Ellipsoid.WGS84
    )
    let point = Cesium.Ray.getPoint(ray, intersection.start)
    return point
  }

  rotateZ(offset, duration) {
    let center = this.getViewCenter()
    let vec = Cesium.Cartesian3.subtract(
      center,
      this.camera.position,
      new Cesium.Cartesian3()
    )

    let nVec = rotateVector(vec, center, offset)
    let nPosition = Cesium.Cartesian3.subtract(
      center,
      nVec,
      new Cesium.Cartesian3()
    )

    let tar = {
      destination: nPosition,
      orientation: {
        heading: this.camera.heading - offset,
        pitch: this.camera.pitch,
        roll: this.camera.roll,
      },
      duration: duration ?? 2,
    }

    this.camera.flyTo(tar)
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
