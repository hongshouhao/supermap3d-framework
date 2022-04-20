import {
  convertCartesianToProj,
  convertProjToCartesian,
  convertGeoJsonFromProj2LL,
  cartesianToLonlat,
} from '../../utils/CesiumMath';
export default class SkylineTool {
  constructor(viewer) {
    this.viewer = viewer;
    this.scene = viewer.scene;
    this.skyline = new Cesium.Skyline(this.scene);
    this.skyline.lineWidth = 4;
    this.skyline.radius = 100;
  }

  start() {
    let position = [];
    if (this.viewer.scene.mode != Cesium.SceneMode.COLUMBUS_VIEW) {
      let cartographic = this.scene.camera.positionCartographic;
      let x = Cesium.Math.toDegrees(cartographic.longitude);
      let y = Cesium.Math.toDegrees(cartographic.latitude);
      let z = cartographic.height;
      position = [x, y, z];
    } else {
      debugger;
      let xx = this.scene.camera.position;
      let cartesianP = convertProjToCartesian(this.viewer.scene, xx);
      let llP = cartesianToLonlat(cartesianP);
      let cartographic = this.scene.camera.positionCartographic;
      let x = Cesium.Math.toDegrees(cartographic.longitude);
      let y = Cesium.Math.toDegrees(cartographic.latitude);
      let z = cartographic.height;
      console.log(x);
      console.log(y);
      console.log(z);
      console.log(llP);
      // let cartesian = Cesium.Cartesian3.fromDegrees(x, y, z);
      // let projP = convertCartesianToProj(this.scene, cartesian);
      // position = [projP.x, projP.y, projP.z];
      position = [x, y, z];
    }

    this.skyline.viewPosition = position;
    this.skyline.pitch = Cesium.Math.toDegrees(this.scene.camera.pitch);
    this.skyline.direction = Cesium.Math.toDegrees(this.scene.camera.heading);
    let xxx = this.skyline.build();
  }

  clear() {
    this.viewer.entities.removeAll();
    this.skyline.clear();
  }
}
