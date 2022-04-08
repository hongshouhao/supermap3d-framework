export default class PolylineDrawingTool {
  constructor(viewer) {
    this.viewer = viewer;
    this.entities = [];
    this.lineColor = '#12D035';
    this.multiable = true;
    this.clampToGround = true;

    this.entityAdded = function(geo) {
      console.log('entityAdded', geo);
    };
    this.drawingFinished = function(geoms) {
      console.log('drawingFinished', geoms);
    };

    this._drawHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    this._offsetZ = 0;
    this._entityVertexes = [];
    this._currentEntity = null;
  }

  start() {
    this.stop();
    window.s3d.setCursor('cursor-crosshair');

    let _this = this;
    _this._drawHandler.setInputAction(function(e) {
      let point = window.s3d.viewUtility.screenPositionToCartesian(e.position);
      point.z = point.z + _this._offsetZ;
      if (!_this._currentEntity) {
        _this._createEntity(point);
      } else {
        let curEntVers = _this._getCurrentEntityVertexes();
        curEntVers.splice(curEntVers.length - 1, 0, point);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    _this._drawHandler.setInputAction(function(e) {
      if (_this._currentEntity) {
        let point = window.s3d.viewUtility.screenPositionToCartesian(
          e.endPosition
        );
        point.z = point.z + _this._offsetZ;
        _this._updateEntity(point);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    _this._drawHandler.setInputAction(function() {
      let curEntVers = _this._getCurrentEntityVertexes();
      curEntVers.splice(curEntVers.length - 1, 1);
      _this._currentEntity = null;

      if (_this.entityAdded) {
        _this.entities[_this.entities.length - 1].toGeoJson().then((result) => {
          _this.entityAdded(result);
        });
      }

      if (!_this.multiable) {
        _this.finishDrawing();
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  clear() {
    this.stop();
    for (let ent of this.entities) {
      this.viewer.entities.remove(ent);
    }

    this.entities = [];
    this._currentEntity = null;
    this._entityVertexes = [];
  }

  stop() {
    window.s3d.resetCursor();
    this._drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this._drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this._drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  finishDrawing() {
    this.stop();
    if (this.drawingFinished) {
      this.getGeometries().then((result) => {
        this.drawingFinished(result);
      });
    }
  }

  getGeometries() {
    let coll = new Cesium.EntityCollection(this.viewer.entities.owner);
    for (let ent of this.entities) {
      coll.add(ent);
    }
    return coll.toGeoJson();
  }

  _createEntity(point) {
    let curEntVers = [point, point.clone()];
    this._entityVertexes.push(curEntVers);

    this._currentEntity = this.viewer.entities.add({
      name: 'sketch_line',
      polyline: {
        positions: curEntVers,
        material: Cesium.Color.fromCssColorString(this.lineColor),
        width: 2.0,
        clampToGround: this.clampToGround,
      },
    });

    this.entities.push(this._currentEntity);
  }

  _updateEntity(point) {
    if (!this._currentEntity) {
      return;
    }

    let curEntVers = this._getCurrentEntityVertexes();
    curEntVers[curEntVers.length - 1] = point;
    this._currentEntity.polyline.positions = new Cesium.CallbackProperty(
      () => curEntVers,
      false
    );
  }

  _getCurrentEntityVertexes() {
    return this._entityVertexes[this._entityVertexes.length - 1];
  }
}
