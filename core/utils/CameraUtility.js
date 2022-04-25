import { rotateVector } from './CesiumMath';
import { boxCornersFromFeature } from './CesiumUtility';
export default class CameraUtility {
  constructor(viewer) {
    this.viewer = viewer;
    this.camera = this.viewer.camera;
    Cesium.Camera.prototype.getCameraHeight = () => this.getCameraHeight();
    Cesium.Camera.prototype.flyToS3mFeatures = (features, options) =>
      this.flyToS3mFeatures(features, options);
    Cesium.Camera.prototype.lookAtFeature = (feature, direction, options) =>
      this.lookAtFeature(feature, direction, options);
    Cesium.Camera.prototype.flyToPointsLL = (points, options) =>
      this.flyToPointsLL(points, options);
    Cesium.Camera.prototype.flyToPoints = (points, options) =>
      this.flyToPoints(points, options);
    Cesium.Camera.prototype.rotateZAroundPoint = (point, heading, duration) =>
      this.rotateZAroundPoint(point, heading, duration);
  }

  getCameraHeight() {
    return this.viewer.camera.positionCartographic.height;
    // return this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
    //   this.camera.position
    // ).height
  }

  flyToS3mFeatures(features, options) {
    let pts = [];
    for (let feature of features) {
      let box = boxCornersFromFeature(feature);
      pts.push(box[0]);
      pts.push(box[1]);
    }

    return this.flyToPoints(pts, options);
  }

  lookAtFeature(feature, direction, options) {
    let pitch = -0.25;
    let offset = null;
    if (typeof direction === 'string') {
      if (direction === 'north') {
        offset = {
          heading: Math.PI,
          pitch: pitch,
        };
      } else if (direction === 'south') {
        offset = {
          heading: 0,
          pitch: pitch,
        };
      } else if (direction === 'west') {
        offset = {
          heading: Math.PI * 1.5,
          pitch: pitch,
        };
      } else if (direction === 'east') {
        offset = {
          heading: Math.PI * 0.5,
          pitch: pitch,
        };
      } else if (direction === 'top') {
        offset = {
          heading: this.camera.heading,
          pitch: Math.PI * -0.5,
        };
      }
    } else if (typeof direction === 'number') {
      offset = {
        heading: direction,
        pitch: pitch,
      };
    }

    let box = boxCornersFromFeature(feature);
    return this._flyToPoints(box, {
      offset: offset,
      scale: options?.scale,
      duration: options?.duration,
    });
  }

  flyToPointsLL(points, options) {
    let pts = [];
    for (let pt of points) {
      pts.push(Cesium.Cartesian3.fromDegrees(pt.x, pt.y, pt.z));
    }
    this.flyToPoints(pts, options);
  }

  rotateZAroundPoint(point, heading, duration) {
    let dis = Cesium.Cartesian3.distance(point, this.camera.position);
    let ray = new Cesium.Ray(point, this.camera.direction);
    let startPosition = Cesium.Ray.getPoint(ray, dis * -1);
    let vec = Cesium.Cartesian3.subtract(
      point,
      startPosition,
      new Cesium.Cartesian3()
    );

    let nVec = rotateVector(vec, point, heading - this.camera.heading);
    let endPosition = Cesium.Cartesian3.subtract(
      point,
      nVec,
      new Cesium.Cartesian3()
    );

    let tar = {
      destination: endPosition,
      orientation: {
        heading: heading,
        pitch: this.camera.pitch,
        roll: this.camera.roll,
      },
      duration: duration ?? 0,
      convert: this.viewer.scene.mode != Cesium.SceneMode.COLUMBUS_VIEW,
    };

    this.camera.flyTo(tar);
  }

  lookAt(origin, target) {
    let direction = Cesium.Cartesian3.subtract(
      target,
      origin,
      new Cesium.Cartesian3()
    );
    // var convertPos = Cesium.SceneTransforms.convert2DToCartesian(
    //   this.viewer.scene,
    //   new Cesium.Cartesian3(0, 1, 0)
    // );

    // let quaternion = this.SetFromTo(direction, convertPos);
    // // Cesium.Cartesian3.normalize(direction, direction);
    // // let angle = Cesium.Cartesian3.angleBetween(
    // //   direction,
    // //   new Cesium.Cartesian3(1, 0, 0)
    // // );

    // // let quaternion = Cesium.Quaternion.fromAxisAngle(
    // //   new Cesium.Cartesian3(0, 0, 1),
    // //   angle,
    // //   new Cesium.Quaternion()
    // // );
    // let headingPitchRoll = Cesium.HeadingPitchRoll.fromQuaternion(quaternion);
    this.viewer.camera.flyTo({
      destination: origin,
      orientation: {
        direction: Cesium.Cartesian3.normalize(
          direction,
          new Cesium.Cartesian3()
        ),
        up: new Cesium.Cartesian3(0, 0, 0),
      },
      duration: 2,
    });
  }

  SetFromTo(vFrom, vTo) {
    let x = 0;
    let y = 0;
    let z = 0;
    let w = 0;

    let from = Cesium.Cartesian3.normalize(vFrom, new Cesium.Cartesian3());
    let to = Cesium.Cartesian3.normalize(vTo, new Cesium.Cartesian3());
    let bisector = Cesium.Cartesian3.add(from, to, new Cesium.Cartesian3());
    w = Cesium.Cartesian3.dot(from, bisector);
    if (w != 0) {
      let cross = Cesium.Cartesian3.cross(
        from,
        bisector,
        new Cesium.Cartesian3()
      );
      x = cross.x;
      y = cross.y;
      z = cross.z;
    } else {
      let invLength;
      if (Math.abs(from.x) >= Math.abs(from.y)) {
        invLength = 1.0 / Math.sqrt(from.x * from.x + from.z * from.z);
        x = -from.z * invLength;
        y = 0;
        z = +from.x * invLength;
      } else {
        invLength = 1.0 / Math.sqrt(from.y * from.y + from.z * from.z);
        x = 0;
        y = +from.z * invLength;
        z = -from.y * invLength;
      }
    }

    return Cesium.Quaternion.normalize(
      new Cesium.Quaternion(x, y, z, w),
      new Cesium.Quaternion(0, 0, 0, 0)
    );
  }

  flyToPoints(points, options) {
    let _this = this;
    return new Promise(function (resolve, reject) {
      let boundingSphere = Cesium.BoundingSphere.fromPoints(points);
      if (boundingSphere.radius == 0) {
        boundingSphere.radius = 1;
      }
      if (options?.scale) {
        boundingSphere.radius = boundingSphere.radius * options.scale;
      }

      // window.s3d.debugUtility.drawBoundingSphereAndPoints(
      //   boundingSphere,
      //   points
      // )

      _this.viewer.camera.flyToBoundingSphere(boundingSphere, {
        duration: options?.duration ?? 2,
        complete: function () {
          resolve();
        },
        cancel: function () {
          reject();
        },
        offset: options?.offset,
      });
    });
  }
}
