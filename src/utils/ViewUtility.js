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

  getCameraHeight() {
    return this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
      this.camera.position
    ).height
  }

  rotateZ(offset) {
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
      duration: 2,
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

  flyToS3mFeatures(features) {
    let pts = []
    for (let feature of features) {
      pts.push(
        Cesium.Cartesian3.fromDegrees(
          feature.geometry.boundingBox.lower.x,
          feature.geometry.boundingBox.lower.y,
          feature.geometry.boundingBox.lower.z
        )
      )

      pts.push(
        Cesium.Cartesian3.fromDegrees(
          feature.geometry.boundingBox.upper.x,
          feature.geometry.boundingBox.upper.y,
          feature.geometry.boundingBox.upper.z
        )
      )
    }
    return this.flyToPoints(pts, { scale: 1.5 })
  }

  lookAtFeature(feature, direction, options) {
    let pts = []
    pts.push(
      Cesium.Cartesian3.fromDegrees(
        feature.geometry.boundingBox.lower.x,
        feature.geometry.boundingBox.lower.y,
        feature.geometry.boundingBox.lower.z
      )
    )
    pts.push(
      Cesium.Cartesian3.fromDegrees(
        feature.geometry.boundingBox.upper.x,
        feature.geometry.boundingBox.upper.y,
        feature.geometry.boundingBox.upper.z
      )
    )
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

  flyToPoints(points, options) {
    let _this = this
    return new Promise(function(resolve, reject) {
      let boundingSphere = Cesium.BoundingSphere.fromPoints(points)

      if (options?.scale) {
        boundingSphere.radius = boundingSphere.radius * options.scale
      }

      window.s3d.debugUtility.drawBoundingSphereAndPoints(
        boundingSphere,
        points
      )

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
}
