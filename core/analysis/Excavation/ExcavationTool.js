export default class ExcavationTool {
  constructor(viewer) {
    this.viewer = viewer;
    this.depth = 20;
    this.handlerPolygon = new Cesium.DrawHandler(
      viewer,
      Cesium.DrawMode.Polygon,
      0
    );
  }

  start() {
    this.handlerPolygon.activeEvt.addEventListener(function(isActive) {
      if (isActive == true) {
        window.s3d.setCursor('cursor-crosshair');
      } else {
        window.s3d.resetCursor();
      }
    });

    let _this = this;
    this.handlerPolygon.drawEvt.addEventListener(function(result) {
      if (!result.object.positions) {
        _this.handlerPolygon.polygon.show = false;
        _this.handlerPolygon.polyline.show = false;
        _this.handlerPolygon.deactivate();
        _this.handlerPolygon.activate();
        return;
      }

      let array = [].concat(result.object.positions);
      let positions = [];
      for (let i = 0, len = array.length; i < len; i++) {
        let cartographic = Cesium.Cartographic.fromCartesian(array[i]);
        let longitude = Cesium.Math.toDegrees(cartographic.longitude);
        let latitude = Cesium.Math.toDegrees(cartographic.latitude);
        let h = cartographic.height;
        if (
          positions.indexOf(longitude) == -1 &&
          positions.indexOf(latitude) == -1
        ) {
          positions.push(longitude);
          positions.push(latitude);
          positions.push(h);
        }
      }

      _this.viewer.scene.globe.addExcavationRegion({
        name: 'excavation' + new Date(),
        position: positions,
        height: _this.depth,
        transparent: false,
      });

      _this.handlerPolygon.polygon.show = false;
      _this.handlerPolygon.polyline.show = false;
      _this.handlerPolygon.deactivate();
      // _this.handlerPolygon.activate()
    });
    this.handlerPolygon.activate();
  }

  clear() {
    this.handlerPolygon.deactivate();
    this.viewer.scene.globe.removeAllExcavationRegion();
  }
}
