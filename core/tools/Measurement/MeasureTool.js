export default class MeasureTool {
  constructor(viewer) {
    let _this = this;
    _this.setCursor = (className) => window.s3d.setCursor(className);
    _this.resetCursor = () => window.s3d.resetCursor();
    _this.handlerDis = new Cesium.MeasureHandler(
      viewer,
      Cesium.MeasureMode.Distance,
      0
    );

    // 注册测距功能事件
    _this.handlerDis.measureEvt.addEventListener(function(result) {
      let dis = Number(result.distance);

      let distance =
        dis > 1000 ? (dis / 1000).toFixed(2) + 'km' : dis.toFixed(2) + 'm';
      _this.handlerDis.disLabel.text = '距离:' + distance;
      // _this.handlerDis.disLabel.style = Cesium.LabelStyle.FILL
      // _this.handlerDis.disLabel.fillColor = Cesium.Color.fromCssColorString(
      //   '#99CCFF'
      // )
    });

    _this.handlerDis.activeEvt.addEventListener(function(isActive) {
      if (isActive == true) {
        _this.setCursor('cursor-crosshair');
      } else {
        _this.resetCursor();
      }
    });

    // 初始化测量面积
    _this.handlerArea = new Cesium.MeasureHandler(
      viewer,
      Cesium.MeasureMode.Area,
      0
    );

    _this.handlerArea.measureEvt.addEventListener(function(result) {
      let mj = Number(result.area);
      let area =
        mj > 1000000 ? (mj / 1000000).toFixed(2) + 'km²' : mj.toFixed(2) + '㎡';
      _this.handlerArea.areaLabel.text = '面积:' + area;
    });
    _this.handlerArea.activeEvt.addEventListener(function(isActive) {
      if (isActive == true) {
        _this.setCursor('cursor-crosshair');
      } else {
        _this.resetCursor();
      }
    });

    // 初始化测量高度
    _this.handlerHeight = new Cesium.MeasureHandler(
      viewer,
      Cesium.MeasureMode.DVH
    );
    _this.handlerHeight.measureEvt.addEventListener(function(result) {
      let distance =
        result.distance > 1000
          ? (result.distance / 1000).toFixed(2) + 'km'
          : result.distance + 'm';
      let vHeight =
        result.verticalHeight > 1000
          ? (result.verticalHeight / 1000).toFixed(2) + 'km'
          : result.verticalHeight + 'm';
      let hDistance =
        result.horizontalDistance > 1000
          ? (result.horizontalDistance / 1000).toFixed(2) + 'km'
          : result.horizontalDistance + 'm';
      _this.handlerHeight.disLabel.text = '空间距离:' + distance;
      _this.handlerHeight.vLabel.text = '垂直高度:' + vHeight;
      _this.handlerHeight.hLabel.text = '水平距离:' + hDistance;
    });
    _this.handlerHeight.activeEvt.addEventListener(function(isActive) {
      if (isActive == true) {
        _this.setCursor('cursor-crosshair');
      } else {
        _this.resetCursor();
      }
    });
  }

  measureDistance() {
    this.deactive();
    this.handlerDis.activate();
  }
  measureArea() {
    this.deactive();
    this.handlerArea.activate();
  }
  measureHeight() {
    this.deactive();
    this.handlerHeight.activate();
  }

  deactive() {
    this.handlerDis.deactivate();
    this.handlerArea.deactivate();
    this.handlerHeight.deactivate();
  }

  clear() {
    this.deactive();

    this.handlerDis.clear();
    this.handlerArea.clear();
    this.handlerHeight.clear();
  }
}
