import { rayEarthIntersection } from './CesiumMath'
export default class DebugUtility {
  constructor(viewer) {
    this.viewer = viewer
  }

  labelPoint(point) {
    this.viewer.entities.add({
      position: point,
      name: 'point_annotation_debugger',
      point: {
        pixelSize: 8,
        color: Cesium.Color.YELLOW,
      },
      label: {
        text: `${point.x}, ${point.y}, ${point.z}`,
        font: '20px 宋体',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.fromCssColorString('#212fd2'),
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        pixelOffset: new Cesium.Cartesian2(10, -10),
        backgroundColor: Cesium.Color.fromAlpha(
          Cesium.Color.fromCssColorString('#2b312c'),
          1
        ),
        showBackground: true,
        eyeOffset: new Cesium.Cartesian3(0, 0, -10),
      },
    })
  }

  drawBoundingSphereAndPoints(boundingSphere, pts) {
    this.viewer.entities.removeAll()
    for (let p of pts) {
      this.labelPoint(p)
    }
    this.labelPoint(boundingSphere.center)

    this.viewer.entities.add({
      name: 'bounding-sphere',
      position: boundingSphere.center,
      ellipsoid: {
        radii: new Cesium.Cartesian3(
          boundingSphere.radius,
          boundingSphere.radius,
          boundingSphere.radius
        ),
        fill: false,
        outline: true,
        outlineColor: Cesium.Color.RED,
      },
    })
  }

  printCamera() {
    console.log({
      position: this.viewer.camera.position,
      heading: this.viewer.camera.heading,
      pitch: this.viewer.camera.pitch,
      roll: this.viewer.camera.roll,
    })
  }

  drawCameraDirection() {
    let ptOnEarth = rayEarthIntersection(
      this.viewer.camera.position,
      this.viewer.camera.direction
    )

    this.viewer.entities.add({
      name: 'camera_direction',
      polyline: {
        positions: [ptOnEarth, this.viewer.camera.position.clone()],
        material: Cesium.Color.fromCssColorString('#fe8001'),
        width: 1.0,
        clampToGround: false,
      },
    })
  }
}
