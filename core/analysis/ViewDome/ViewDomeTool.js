export default class ViewDomeTool {
  constructor(viewer) {
    this.viewer = viewer;

    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  }

  start() {
    window.s3d.setCursor('cursor-crosshair');

    let _this = this;
    this.handler.setInputAction(function(e) {
      window.s3d.resetCursor();

      let position = _this.viewer.scene.pickPosition(e.position);
      let cartographic = Cesium.Cartographic.fromCartesian(position);
      let longitude = Cesium.Math.toDegrees(cartographic.longitude);
      let latitude = Cesium.Math.toDegrees(cartographic.latitude);
      let height = cartographic.height;

      if (height < 0) {
        height = 0;
      }

      debugger;
      _this.createViewDome();
      _this.viewDome.viewPosition = [longitude, latitude, height];
      _this.viewDome.build();

      _this.viewer.entities.removeAll();
      _this.viewer.entities.add(
        new Cesium.Entity({
          point: new Cesium.PointGraphics({
            color: new Cesium.Color(1, 0, 0),
            pixelSize: 10,
            outlineColor: new Cesium.Color(0, 1, 1),
          }),
          position: Cesium.Cartesian3.fromDegrees(
            longitude,
            latitude,
            height + 0.5
          ),
        })
      );

      _this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  clear() {
    this.viewer.entities.removeAll();
    this.viewDome.destroy();
    this.viewDome = null;
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  createViewDome() {
    this.viewDome = new Cesium.ViewDome(this.viewer.scene);
    this.viewDome.distance = 200;
    this.viewDome.domeType = Cesium.ViewDomeType.ALLDOME;
    this.viewDome.visibleAreaColor = Cesium.Color.fromAlpha(
      Cesium.Color.fromCssColorString('#1891ba'),
      0.5
    );
    this.viewDome.hiddenAreaColor = Cesium.Color.fromAlpha(
      Cesium.Color.fromCssColorString('#ce3839'),
      0.5
    );
    this.viewDome.startAngle = 0;
    this.viewDome.endAngle = 360;
    this.viewDome.isClosed = true;
  }
}
