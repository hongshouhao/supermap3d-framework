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
    return this.flyToPoints(pts, 10)
  }

  flyToPoints(points, scale) {
    let _this = this
    return new Promise(function(resolve, reject) {
      let boundingSphere = Cesium.BoundingSphere.fromPoints(points)
      if (scale) {
        boundingSphere.radius = boundingSphere.radius * scale
      } else {
        // boundingSphere.radius = boundingSphere.radius * scale
      }

      _this.viewer.camera.flyToBoundingSphere(boundingSphere, {
        duration: 2,
        complete: function() {
          resolve()
        },
        cancel: function() {
          reject()
        },
        // offset: {
        //   heading: Cesium.Math.toRadians(heading),
        //   pitch: Cesium.Math.toRadians(pitch),
        //   range: 0.0,
        // },
      })
    })
  }
}
