export default class SkylineTool {
  constructor(viewer) {
    this.viewer = viewer;
    this.scene = viewer.scene;
    this.skyline = new Cesium.Skyline(viewer.scene);
    // this.skyline.lineWidth = 10;
    this.skyline.radius = 10000;
  }

  start() {
    const cartographic = this.scene.camera.positionCartographic;
    const longitude = Cesium.Math.toDegrees(cartographic.longitude);
    const latitude = Cesium.Math.toDegrees(cartographic.latitude);
    const height = cartographic.height;

    this.skyline.viewPosition = [longitude, latitude, height];
    this.skyline.pitch = Cesium.Math.toDegrees(this.scene.camera.pitch);
    this.skyline.direction = Cesium.Math.toDegrees(this.scene.camera.heading);

    this.skyline.build();
  }

  clear() {
    this.viewer.entities.removeAll();
    this.skyline.clear();
  }
}
