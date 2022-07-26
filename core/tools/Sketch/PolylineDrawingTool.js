export default class PolylineDrawingTool {
  constructor(viewer) {
    this.viewer = viewer;
    this.entities = [];
    this.lineColor = '#12D035';
    this.multiable = true;
    this.clampToGround = true;

    this.entityAdded = function (geo) {
      console.log('entityAdded', geo);
    };
    this.drawingFinished = function (geoms) {
      console.log('drawingFinished', geoms);
    };

    this._drawHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    this._offsetZ = 0;
    this._entityVertexes = [];
    this._currentEntity = null;
    this._vertexLimitCount = 100;
  }

  setVertexLimitCount(count) {
    if (count < 2) {
      return;
    }
    this._vertexLimitCount = count;
  }

  start() {
    this.stop();
    window.s3d.setCursor('cursor-crosshair');
    let _this = this;
    _this._drawHandler.setInputAction(function (e) {
      let point = window.s3d.viewUtility.screenPositionToCartesian(e.position);
      point.z = point.z + _this._offsetZ;
      if (!_this._currentEntity) {
        _this._createEntity(point);
      } else {
        let curEntVers = _this._getCurrentEntityVertexes();
        curEntVers.splice(curEntVers.length - 1, 0, point);
        if (_this._vertexLimitCount + 1 === curEntVers.length) {
          _this.finishCurrentDrawing();
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    _this._drawHandler.setInputAction(function (e) {
      if (_this._currentEntity) {
        let point = window.s3d.viewUtility.screenPositionToCartesian(
          e.endPosition
        );
        point.z = point.z + _this._offsetZ;
        _this._updateEntity(point);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    _this._drawHandler.setInputAction(function () {
      _this.finishCurrentDrawing();
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
    this._drawHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.RIGHT_CLICK
    );
  }

  finishCurrentDrawing() {
    if (this._currentEntity) {
      let curEntVers = this._getCurrentEntityVertexes();
      curEntVers.splice(curEntVers.length - 1, 1);
      this._currentEntity = null;
  
      if (this.entityAdded) {
        this.entities[this.entities.length - 1].toGeoJson().then((result) => {
          this.entityAdded(result);
        });
      }

      if (!this.multiable) {
        this.finishDrawing();
      }
    }
    else{
      this.finishDrawing();
    }
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
        positions: new Cesium.CallbackProperty(
          () => curEntVers,
          false
        ),
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
  }

  _getCurrentEntityVertexes() {
    return this._entityVertexes[this._entityVertexes.length - 1];
  }
}
