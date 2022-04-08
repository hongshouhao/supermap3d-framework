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

      this.preHeight2 = this.viewer.camera.positionCartographic.height;
      this.preVector = Cesium.Cartesian3.subtract(
        center,
        this.viewer.camera.position,
        new Cesium.Cartesian3()
      );

      let distance = Cesium.Cartesian3.distance(
        this.viewer.camera.position,
        center
      );
      let newPosition = reCalculateCartesian(center, distance);
      this.viewer.camera.flyTo({
        destination: newPosition,
        orientation: {
          heading: 0,
          roll: 0,
          pitch: -1.57,
        },
        duration: 1.5,
        complete: () => {
          // this.viewer.scene.mode = Cesium.SceneMode.SCENE2D
          this.viewer.scene.screenSpaceCameraController.enableTilt = false;
        },
      });
      this.mode = '2D';
    } else if (this.mode === '2D') {
      let center = this.viewUtility.getViewCenter();
      let destination = Cesium.Cartesian3.subtract(
        center,
        this.preVector,
        new Cesium.Cartesian3()
      );

      destination = reCalculateCartesian(destination, this.preHeight);
      this.viewer.camera.flyTo({
        destination: destination,
        orientation: {
          heading: this.preHeading,
          pitch: this.prePitch,
          roll: this.preRoll,
        },
        duration: 1.5,
        complete: () => {
          this.viewer.scene.screenSpaceCameraController.enableTilt = true;
        },
      });

      this.mode = '3D';
    }
  }
}
