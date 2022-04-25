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
    // this.lineColor = "#12D035";
    // this.opacity = 0.5;
    // this.multiable = true;
    // this.clampToGround = true;

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
  }

  start() {
    this.stop();
    window.s3d.setCursor('cursor-crosshair');

    let _this = this;

    return new Promise((resolve, reject) => {
      _this._drawHandler.setInputAction(function (e) {
        let point = window.s3d.viewUtility.screenPositionToCartesian(
          e.position
        );
        point.z = point.z + _this._offsetZ;
        if (!_this._currentEntityOutline) {
          _this._createEntity(point);
        } else {
          let curEntVers = _this._getCurrentEntityVertexes();
          curEntVers.splice(curEntVers.length - 1, 0, point);
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
        let curEntVers = _this._getCurrentEntityVertexes();
        curEntVers.splice(curEntVers.length - 2, 1);
        _this._currentEntityOutline = null;
        _this._currentEntityFill = null;

        if (_this.entityAdded) {
          _this.entities[_this.entities.length - 1]
            .toGeoJson()
            .then((result) => {
              _this.entityAdded(result);
            });
        }

        if (!_this.options.multiable) {
          _this.finishDrawing();
        }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    });
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
        positions: curEntVers,
        material: Cesium.Color.fromAlpha(
          Cesium.Color.fromCssColorString(this.options.lineColor),
          this.options.lineOpacity
        ),
        width: 2.0,
        clampToGround: this.options.clampToGround,
      },
    });

    // let heightReference = this.clampToGround
    //   ? Cesium.HeightReference.CLAMP_TO_GROUND
    //   : Cesium.HeightReference.NONE
    this._currentEntityFill = this.viewer.entities.add({
      name: 'sketch_polygon_fill',
      polygon: {
        // heightReference: Cesium.HeightReference.NONE,
        hierarchy: curEntVers.slice(0, -1),
        material: Cesium.Color.fromAlpha(
          Cesium.Color.fromCssColorString(this.options.fillColor),
          this.options.fillOpacity
        ),
      },
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
    this._currentEntityOutline.polyline.positions = new Cesium.CallbackProperty(
      () => curEntVers,
      false
    );

    this._currentEntityFill.polygon.hierarchy = new Cesium.CallbackProperty(
      () => new Cesium.PolygonHierarchy(curEntVers.slice(0, -1)),
      false
    );
  }

  _getCurrentEntityVertexes() {
    return this._entityVertexes[this._entityVertexes.length - 1];
  }
}
