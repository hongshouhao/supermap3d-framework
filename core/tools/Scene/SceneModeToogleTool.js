import { reCalculateCartesian } from '../../utils/CesiumMath';

export default class SceneModeToogleTool {
  constructor(viewer) {
    this.viewer = viewer;
    this.mode = '3D';
    this.viewUtility = window.s3d.viewUtility;
  }

  toogle() {
    if (this.mode === '3D') {
      let center = this.viewUtility.getViewCenter();
      this.preHeading = this.viewer.camera.heading;
      this.prePitch = this.viewer.camera.pitch;
      this.preRoll = this.viewer.camera.roll;
      this.preDirection = this.viewer.camera.direction;

      this.preHeight = this.viewer.camera.getCameraHeight();
      this.preVector = Cesium.Cartesian3.subtract(
        center,
        this.viewer.camera.position,
        new Cesium.Cartesian3()
      );
      let distance = Cesium.Cartesian3.distance(
        this.viewer.camera.position,
        center
      );

      let options = {
        orientation: {
          heading: 0,
          roll: 0,
          pitch: -1.57,
        },
        duration: 1.5,
        complete: () => {
          this.viewer.scene.screenSpaceCameraController.enableTilt = false;
        },
      };
      if (this.viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW) {
        options.destination = new Cesium.Cartesian3(
          center.x,
          center.y,
          distance
        );
        options.convert = false;
      } else {
        options.destination = reCalculateCartesian(center, distance);
      }

      this.viewer.camera.flyTo(options);
      this.mode = '2D';
    } else if (this.mode === '2D') {
      let center = this.viewUtility.getViewCenter();
      let destination = Cesium.Cartesian3.subtract(
        center,
        this.preVector,
        new Cesium.Cartesian3()
      );

      let options = {
        orientation: {
          heading: this.preHeading,
          pitch: this.prePitch,
          roll: this.preRoll,
        },
        duration: 1.5,
        complete: () => {
          this.viewer.scene.screenSpaceCameraController.enableTilt = true;
        },
      };
      if (this.viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW) {
        options.destination = new Cesium.Cartesian3(
          destination.x,
          destination.y,
          this.preHeight
        );
        options.convert = false;
      } else {
        destination = reCalculateCartesian(destination, this.preHeight);
      }
      this.viewer.camera.flyTo(options);
      this.mode = '3D';
    }
  }
}
