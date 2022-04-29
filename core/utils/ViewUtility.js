import { rotateVector, rayEarthIntersection } from './CesiumMath';
import DebugUtility from './DebugUtility';
export default class ViewUtility {
  constructor(viewer) {
    this.viewer = viewer;
    this.camera = this.viewer.camera;
    this.pointMeasurement = new DebugUtility(this.viewer);

    Cesium.Viewer.prototype.getViewCenter = () => this.getViewCenter();
    Cesium.Viewer.prototype.screenPositionToCartesian = (screenPosition) =>
      this.screenPositionToCartesian(screenPosition);
    Cesium.Viewer.prototype.rotateZ = (offset, duration) =>
      this.rotateZ(offset, duration);
  }

  getViewCenter() {
    if (this.viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW) {
      let ray = new Cesium.Ray(this.camera.position, this.camera.direction);
      let intersection = Cesium.IntersectionTests.rayPlane(
        ray,
        Cesium.Plane.ORIGIN_XY_PLANE
      );
      return intersection;
    } else {
      let intersection = rayEarthIntersection(
        this.camera.position,
        this.camera.direction
      );
      return intersection;
    }
  }

  rotateZ(offset, duration) {
    let center = this.getViewCenter();
    let vec = Cesium.Cartesian3.subtract(
      center,
      this.camera.position,
      new Cesium.Cartesian3()
    );

    let nVec = rotateVector(vec, center, offset);
    let nPosition = Cesium.Cartesian3.subtract(
      center,
      nVec,
      new Cesium.Cartesian3()
    );

    let tar = {
      destination: nPosition,
      orientation: {
        heading: this.camera.heading - offset,
        pitch: this.camera.pitch,
        roll: this.camera.roll,
      },
      duration: duration == null ? 2 : duration,
      convert: this.viewer.scene.mode != Cesium.SceneMode.COLUMBUS_VIEW,
    };

    this.camera.flyTo(tar);
  }

  screenPositionToCartesian(screenPosition) {
    let position = this.viewer.scene.pickPosition(screenPosition);
    let cartographic = Cesium.Cartographic.fromCartesian(position);
    let longitude = Cesium.Math.toDegrees(cartographic.longitude);
    let latitude = Cesium.Math.toDegrees(cartographic.latitude);
    return Cesium.Cartesian3.fromDegrees(
      longitude,
      latitude,
      cartographic.height
    );
  }
}
