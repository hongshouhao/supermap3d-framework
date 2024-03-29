export default class ModelObservationTool {
  constructor(viewer) {
    this.viewer = viewer;
    this.selectHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    this.cameraUtility = window.s3d.cameraUtility;
  }

  start(callback) {
    let _this = this;
    this.selectHandler.setInputAction(function (e) {
      let pickobject = _this.viewer.scene.pick(e.position);
      if (pickobject) {
        if (typeof pickobject.id !== 'string') {
          return;
        }

        if (pickobject.primitive) {
          window.s3d.dataAccess
            .dataFromDataset({
              layer: pickobject.primitive.name,
              ids: [pickobject.id],
            })
            .then((response) => {
              _this.feature = response[0].source;
              if (callback) {
                callback(_this.feature);
              }
            });
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  lookAt(angle, scale) {
    if (!this.feature) {
      return;
    }

    this.cameraUtility.lookAtFeature(this.feature, angle, {
      scale: scale,
      duration: 0,
    });
  }
  lookAtFront() {
    if (!this.feature) {
      return;
    }
    this.cameraUtility.lookAtFeature(this.feature, 'south');
  }
  lookAtBehind() {
    if (!this.feature) {
      return;
    }
    this.cameraUtility.lookAtFeature(this.feature, 'north');
  }
  lookAtLeft() {
    if (!this.feature) {
      return;
    }
    this.cameraUtility.lookAtFeature(this.feature, 'west');
  }
  lookAtRight() {
    if (!this.feature) {
      return;
    }
    this.cameraUtility.lookAtFeature(this.feature, 'east');
  }
  lookAtTop() {
    if (!this.feature) {
      return;
    }
    this.cameraUtility.lookAtFeature(this.feature, 'top');
  }

  clear() {
    this.feature = null;
    this.selectHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
}
