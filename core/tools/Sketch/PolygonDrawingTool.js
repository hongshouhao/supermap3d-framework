export default class PolygonDrawingTool {
  constructor(viewer, options = {}) {
    this.viewer = viewer;
    this.entities = [];
    this.options = Object.assign(
      {},
      {
        multiable: true,
        fillColor: '#ff0000',
        fillOpacity: 0.5,
        lineColor: '#ff0000',
        lineOpacity: 1,
        clampToGround: true,
      },
      options
    );

    this.entityAdded = function (geo) {
      console.log('entityAdded', geo);
    };
    this.drawingFinished = function (geoms) {
      console.log('drawingFinished', geoms);
    };

    this._drawHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    this._offsetZ = 0;
    this._entitiesOutline = [];
    this._entityVertexes = [];
    this._currentEntityOutline = null;
    this._currentEntityFill = null;
    this._vertexLimitCount = 100;
  }

  setVertexLimitCount(count) {
    if (count < 3) {
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
      if (!_this._currentEntityOutline) {
        _this._createEntity(point);
      } else {
        let curEntVers = _this._getCurrentEntityVertexes();
        curEntVers.splice(curEntVers.length - 1, 0, point);
       
        if (_this._vertexLimitCount + 2 === curEntVers.length) {
          _this.finishCurrentDrawing();
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    _this._drawHandler.setInputAction(function (e) {
      if (_this._currentEntityOutline) {
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

    for (let ent of this._entitiesOutline) {
      this.viewer.entities.remove(ent);
    }

    this.entities = [];
    this._entitiesOutline = [];
    this._currentEntityOutline = null;
    this._currentEntityFill = null;
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
    if (this._currentEntityOutline) {
      let curEntVers = this._getCurrentEntityVertexes();
      curEntVers.splice(curEntVers.length - 2, 1);
      this._currentEntityOutline = null;
      this._currentEntityFill = null;

      if (this.entityAdded) {
        this.entities[this.entities.length - 1].toGeoJson().then((result) => {
          this.entityAdded(result);
        });
      }

      if (!this.options.multiable) {
        this.finishDrawing();
      }
    } else {
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
    let curEntVers = [point, point.clone(), point.clone()];
    this._entityVertexes.push(curEntVers);

    this._currentEntityOutline = this.viewer.entities.add({
      name: 'sketch_polygon_outline',
      polyline: {
        positions: new Cesium.CallbackProperty(
          () => curEntVers,
          false
        ),
        material: Cesium.Color.fromAlpha(
          Cesium.Color.fromCssColorString(this.options.lineColor),
          this.options.lineOpacity
        ),
        width: 2.0,
        clampToGround: this.options.clampToGround,
      },
      ignorePopup: true,
    });

    // let heightReference = this.clampToGround
    //   ? Cesium.HeightReference.CLAMP_TO_GROUND
    //   : Cesium.HeightReference.NONE
    this._currentEntityFill = this.viewer.entities.add({
      name: 'sketch_polygon_fill',
      polygon: {
        // heightReference: Cesium.HeightReference.NONE,
        hierarchy: new Cesium.CallbackProperty(
          () => new Cesium.PolygonHierarchy(curEntVers.slice(0, -1)),
          false
        ),
        material: Cesium.Color.fromAlpha(
          Cesium.Color.fromCssColorString(this.options.fillColor),
          this.options.fillOpacity
        ),
      },
      ignorePopup: true,
    });

    this.entities.push(this._currentEntityFill);
    this._entitiesOutline.push(this._currentEntityOutline);
  }

  _updateEntity(point) {
    if (!this._currentEntityOutline) {
      return;
    }
    let curEntVers = this._getCurrentEntityVertexes();
    curEntVers[curEntVers.length - 2] = point;
  }

  _getCurrentEntityVertexes() {
    return this._entityVertexes[this._entityVertexes.length - 1];
  }
}
