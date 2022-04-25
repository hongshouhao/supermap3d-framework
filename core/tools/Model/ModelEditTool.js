export default class ModelEditTool {
  constructor(viewer) {
    this.viewer = viewer;

    // let _this = this
    this.selectHandler = new Cesium.ScreenSpaceEventHandler(
      viewer.scene.canvas
    );

    this.selectHandler.setInputAction(function (e) {
      let pickobject = viewer.scene.pick(e.position);
      if (pickobject) {
        if (typeof pickobject.id !== 'string') {
          return;
        }

        // if (pickobject.primitive) {
        // }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  start() {}

  draw() {}
  move() {}
}
