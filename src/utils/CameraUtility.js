import { rotateVector } from '../utils/CesiumMath'
import { boxCornersFromFeature } from '../utils/CesiumUtility'
export default class CameraUtility {
  constructor(viewer) {
    this.viewer = viewer
    this.camera = this.viewer.camera
  }

  getCameraHeight() {
    return this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
      this.camera.position
    ).height
  }

  flyToS3mFeatures(features) {
    let pts = []
    for (let feature of features) {
      let box = boxCornersFromFeature(feature)
      pts.push(box[0])
      pts.push(box[1])
    }
    return this.flyToPoints(pts, { scale: 1.5 })
  }

  lookAtFeature(feature, direction, options) {
    let pitch = -0.25
    let offset = null
    if (typeof direction === 'string') {
      if (direction === 'north') {
        offset = {
          heading: Math.PI,
          pitch: pitch,
        }
      } else if (direction === 'south') {
        offset = {
          heading: 0,
          pitch: pitch,
        }
      } else if (direction === 'west') {
        offset = {
          heading: Math.PI * 1.5,
          pitch: pitch,
        }
      } else if (direction === 'east') {
        offset = {
          heading: Math.PI * 0.5,
          pitch: pitch,
        }
      } else if (direction === 'top') {
        offset = {
          heading: this.camera.heading,
          pitch: Math.PI * -0.5,
        }
      }
    } else if (typeof direction === 'number') {
      offset = {
        heading: direction,
        pitch: pitch,
      }
    }

    let box = boxCornersFromFeature(feature)
    return this.flyToPoints(box, {
      offset: offset,
      scale: options?.scale,
      duration: options?.duration,
    })
  }

  flyToPoints(points, options) {
    let _this = this
    return new Promise(function(resolve, reject) {
      let boundingSphere = Cesium.BoundingSphere.fromPoints(points)

      if (options?.scale) {
        boundingSphere.radius = boundingSphere.radius * options.scale
      }

      // window.s3d.debugUtility.drawBoundingSphereAndPoints(
      //   boundingSphere,
      //   points
      // )

      _this.viewer.camera.flyToBoundingSphere(boundingSphere, {
        duration: options?.duration ?? 2,
        complete: function() {
          resolve()
        },
        cancel: function() {
          reject()
        },
        offset: options?.offset,
      })
    })
  }

  rotateZAroundPoint(point, heading, duration) {
    let dis = Cesium.Cartesian3.distance(point, this.camera.position)
    let ray = new Cesium.Ray(point, this.camera.direction)
    let startPosition = Cesium.Ray.getPoint(ray, dis * -1)
    let vec = Cesium.Cartesian3.subtract(
      point,
      startPosition,
      new Cesium.Cartesian3()
    )

    let nVec = rotateVector(vec, point, heading - this.camera.heading)
    let endPosition = Cesium.Cartesian3.subtract(
      point,
      nVec,
      new Cesium.Cartesian3()
    )

    let tar = {
      destination: endPosition,
      orientation: {
        heading: heading,
        pitch: this.camera.pitch,
        roll: this.camera.roll,
      },
      duration: duration ?? 0,
    }

    this.camera.flyTo(tar)
  }
}
