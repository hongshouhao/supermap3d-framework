export default class RectangleDrawingTool {
  constructor(viewer, options) {
    this.viewer = viewer;
    this.options = Object.assign(
      {},
      {
        fillColor: '#ff0000',
        fillOpacity: 0.5,
        lineColor: '#ff0000',
        lineOpacity: 1,
        clampToGround: true,
      },
      options
    );
    this.entities = [];

    this.entityAdded = function (geo) {
      console.log('entityAdded', geo);
    };
    this.drawingFinished = function (geoms) {
      console.log('drawingFinished', geoms);
    };

    this._drawHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
    this._entityVertexes = [];
    this._currentEntity = null;
  }

  start() {
    const that = this;
    return new Promise((resolve) => {
      that.isDrawing = false;

      window.s3d.setCursor('cursor-crosshair');
      that.stop();

      this._drawHandler.setInputAction(function (e) {
        if (!that.isDrawing) {
          let cartesianPosition =
            window.s3d.viewUtility.screenPositionToCartesian(e.position);
          that._entityVertexes.push(cartesianPosition);
          that.isDrawing = true;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      this._drawHandler.setInputAction(function (e) {
        if (that.isDrawing) {
          let cartesianPosition =
            window.s3d.viewUtility.screenPositionToCartesian(e.endPosition);

          if (!that._currentEntity) {
            that._entityVertexes.push(cartesianPosition);

            that._currentEntity = new Cesium.Entity({
              rectangle: {
                coordinates: new Cesium.CallbackProperty(function () {
                  return Cesium.Rectangle.fromCartesianArray(that._entityVertexes);
                }, false),
                material: Cesium.Color.fromAlpha(
                  Cesium.Color.fromCssColorString(that.options.fillColor),
                  that.options.fillOpacity
                ),
              },
            });

            that.entities.push(that._currentEntity);
            that.viewer.entities.add(that._currentEntity);
          } else {
            that._entityVertexes.pop();
            that._entityVertexes.push(cartesianPosition);
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      this._drawHandler.setInputAction(function () {
        that.isDrawing = false;
        that.stop();

        that.getGeometries().then((geojson) => {
          resolve(geojson);
        });
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    });
  }

  getGeometries() {
    let coll = new Cesium.EntityCollection(this.viewer.entities.owner);
    for (let ent of this.entities) {
      coll.add(ent);
    }
    return coll.toGeoJson();
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
    this.entities.forEach((e) => {
      this.viewer.entities.remove(e);
    });
    this.entities = [];
  }
  
  _createEntity(point) {
    this._currentEntity =  this.viewer.entities.add({
      rectangle: {
        coordinates: new Cesium.CallbackProperty(function () {
          return Cesium.Rectangle.fromCartesianArray(this._entityVertexes);
        }, false),
        material: Cesium.Color.fromAlpha(
          Cesium.Color.fromCssColorString(that.options.fillColor),
          that.options.fillOpacity
        ),
      },
    });
  }
}
