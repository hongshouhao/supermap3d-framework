export default class BaseDrawingTool {
  constructor(viewer) {
    this.viewer = viewer;
    this.entities = [];
    this.multiable = true;

    this._entityVertexes = [];
    this._currentEntity = null;
    this._drawHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    this._offsetZ = 0.001;

    this.entityAdded = function (geo) {
      console.log('entityAdded', geo);
    };
    this.drawingFinished = function (geoms) {
      console.log('drawingFinished', geoms);
    };
  }

  start() {
    this.stop();
    window.s3d.setCursor('cursor-crosshair');
    let _this = this;
    return new Promise((resolve) => {
      _this._drawHandler.setInputAction(function (e) { 
        let point = window.s3d.viewUtility.screenPositionToCartesian(
          e.position
        );
        point.z = point.z + _this._offsetZ;
        if (!_this._currentEntity) {
          let currEntVers = _this._initCurrentEntityVertexes(point , e.position);
          _this._currentEntity = _this._createCurrentEntity(currEntVers);
          _this.entities.push(_this._currentEntity);
          _this._entityVertexes.push(currEntVers);
        } else {
          let currEntVers = _this._getCurrentEntityVertexes();
          _this._mouseLeftClick(currEntVers, point,e.position);

          if (_this._shouldFinishCurrentDrawing(currEntVers)) {
            _this._finishCurrentDrawing(resolve);
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      _this._drawHandler.setInputAction(function (e) { 
        if (_this._currentEntity) {
          let point = window.s3d.viewUtility.screenPositionToCartesian(
            e.endPosition
          );
          point.z = point.z + _this._offsetZ;
          let currEntVers = _this._getCurrentEntityVertexes();
          _this._mouseMoving(currEntVers, point,e.endPosition);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      _this._drawHandler.setInputAction(function () {
        _this._finishCurrentDrawing(resolve);
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    });
  }

  stop() {
    window.s3d.resetCursor();
    this._drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this._drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this._drawHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.RIGHT_CLICK
    );
    this._currentEntity = null;
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

  getGeometries() {
    let coll = new Cesium.EntityCollection(this.viewer.entities.owner);
    for (let ent of this.entities) {
      coll.add(ent);
    }
    return coll.toGeoJson();
  }

  _getCurrentEntityVertexes() {
    return this._entityVertexes[this._entityVertexes.length - 1];
  }

  _finishDrawing(callback) {
    this.stop();
    this.getGeometries().then((result) => {
      if (this.drawingFinished) {
        this.drawingFinished(result);
      }
      if (callback) {
        callback(result);
      }
    });
  }

  _finishCurrentDrawing(callback) {
    if (this._currentEntity) {
      this._beforeFinishingCurrentDrawing(this._getCurrentEntityVertexes());
      this._currentEntity = null;
      if (this.entityAdded) {
        this.entities[this.entities.length - 1].toGeoJson().then((result) => {
          this.entityAdded(result);
        });
      }
      if (!this.multiable) {
        this._finishDrawing(callback);
      }
    } else {
      this._finishDrawing(callback);
    }
  }

  // 以下函数需要子类重写
  _initCurrentEntityVertexes(vertex) {
    return [vertex];
  }
  _mouseLeftClick(currEntVers, newVertex) {
    currEntVers.push(newVertex);
  }
  _mouseMoving(currEntVers, newVertex) {
    currEntVers.push(newVertex);
  }
  _beforeFinishingCurrentDrawing(currEntVers) {}
  _createCurrentEntity(currEntVers) {
    return null;
  }
  _shouldFinishCurrentDrawing(currEntVers) {
    return true;
  }
}
