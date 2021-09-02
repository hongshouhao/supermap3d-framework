import { rotateVector } from '../utils/CesiumMath'
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
      let box = this._boxCornersFromFeature(feature)
      pts.push(box[0])
      pts.push(box[1])
    }
    return this.flyToPoints(pts, { scale: 1.5 })
  }

  lookAtFeature(feature, direction, options) {
    let pts = []
    let box = this._boxCornersFromFeature(feature)
    pts.push(box[0])
    pts.push(box[1])

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

    return this.flyToPoints(pts, {
      offset: offset,
      scale: options?.scale,
      duration: options?.duration,
    })
  }

  rotateZAroundFeature(feature, heading, fitView) {
    if (fitView) {
      this.lookAtFeature(feature, heading, {
        duration: 0,
      })
    } else {
      let pts = []
      let box = this._boxCornersFromFeature(feature)
      pts.push(box[0])
      pts.push(box[1])
      let boundingSphere = Cesium.BoundingSphere.fromPoints(pts)
      let dis = Cesium.Cartesian3.distance(
        boundingSphere.center,
        this.camera.position
      )
      //3.431927296(常数) = 完整定位时相机位置与球体中心点的具体/球体的半径
      let radius = dis / 3.431927296
      let ratio = radius / boundingSphere.radius

      this.lookAtFeature(feature, heading, {
        scale: ratio,
        duration: 0,
      })
    }
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

  _boxCornersFromFeature(feature) {
    let pts = []
    pts.push(
      Cesium.Cartesian3.fromDegrees(
        feature.geometry.boundingBox.lower.x,
        feature.geometry.boundingBox.lower.y,
        feature.geometry.boundingBox.lower.z + feature.geometry.position.z
      )
    )
    pts.push(
      Cesium.Cartesian3.fromDegrees(
        feature.geometry.boundingBox.upper.x,
        feature.geometry.boundingBox.upper.y,
        feature.geometry.boundingBox.upper.z + feature.geometry.position.z
      )
    )
    return pts
  }
}
