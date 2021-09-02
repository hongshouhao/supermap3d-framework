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
      position: window.s3d.viewer.camera.position,
      heading: window.s3d.viewer.camera.heading,
      pitch: window.s3d.viewer.camera.pitch,
      roll: window.s3d.viewer.camera.roll,
    })
  }
}
