export default class DebugUtility {
  constructor(viewer) {
    this.viewer = viewer;
  }

  labelPointLL(point, addLabel = true) {
    let position = Cesium.Cartesian3.fromDegrees(
      point.longitude,
      point.latitude,
      point.height
    );
    this._labelPoint(
      position,
      `${point.longitude}, ${point.latitude}, ${point.height}`,
      addLabel
    );
  }

  labelPoint(point, addLabel = true) {
    this._labelPoint(point, `${point.x}, ${point.y}, ${point.z}`, addLabel);
  }

  _labelPoint(point, text, addLabel) {
    let options = {
      position: point,
      name: 'point_annotation_debugger',
      point: {
        pixelSize: 8,
        color: Cesium.Color.YELLOW,
      },
    };

    if (addLabel) {
      options.label = {
        text: text,
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
      };
    }
    this.viewer.entities.add(options);
  }

  drawBoundingSphereAndPoints(boundingSphere, pts) {
    this.viewer.entities.removeAll();
    for (let p of pts) {
      this.labelPoint(p);
    }
    this.labelPoint(boundingSphere.center);

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
    });
  }

  printCamera() {
    console.log({
      position: this.viewer.camera.position,
      heading: this.viewer.camera.heading,
      pitch: this.viewer.camera.pitch,
      roll: this.viewer.camera.roll,
    });
  }

  drawCameraDirection() {
    this.drawRay(this.viewer.camera.position, this.viewer.camera.direction);
  }

  drawRay(start, direction, distance) {
    if (!distance) {
      distance = 100;
    }

    let ray = Cesium.Cartesian3.multiplyByScalar(
      direction,
      distance,
      new Cesium.Cartesian3()
    );
    let endPoint = Cesium.Cartesian3.add(start, ray, new Cesium.Cartesian3());
    this.labelPoint(start);
    this.labelPoint(endPoint);
    this.viewer.entities.add({
      name: 'debug_ray',
      polyline: {
        positions: [start, endPoint],
        arcType: Cesium.ArcType.NONE,
        material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED),
        width: 4.0,
      },
    });
  }

  flyToPoint(point) {
    window.s3d.cameraUtility.flyToPoints([point]);
  }
}
