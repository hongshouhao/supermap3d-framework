import BaseDrawingTool from './BaseDrawingTool';
export default class RectangleDrawingTool extends BaseDrawingTool {
  constructor(viewer, options) {
    super(viewer);
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
    this._entitiesOutline = [];
    this._entityOutlineVertexes = [];
    this._currentEntityOutline = null;
  }

  clear() {
    super.clear();
    for (let ent of this._entitiesOutline) {
      this.viewer.entities.remove(ent);
    }
    this._entitiesOutline = [];
    this._currentEntityOutline = null;
  }

  _initCurrentEntityVertexes(vertex, screenPoint) {
    this.firstCornerPx = screenPoint;
    return [vertex, vertex.clone()];
  }
  _mouseLeftClick(currEntVers, newVertex) {}
  _mouseMoving(
    currEntVers,
    newVertex,
    screenPoint
  ) {
    currEntVers[currEntVers.length - 1] = newVertex;

    let minPtPx = null;
    let maxPtPx = null;
    let minPt = null;
    let maxPt = null;
    let secondCornerPx = screenPoint;
    if (secondCornerPx.x < this.firstCornerPx.x) {
      minPtPx = this.firstCornerPx;
      maxPtPx = secondCornerPx;
      minPt = currEntVers[0];
      maxPt = currEntVers[1];
    } else {
      minPtPx = secondCornerPx;
      maxPtPx = this.firstCornerPx;
      minPt = currEntVers[1];
      maxPt = currEntVers[0];
    }

    let bottomRightCorner = window.s3d.viewUtility.screenPositionToCartesian({
      x: maxPtPx.x,
      y: minPtPx.y,
    });
    let topLeftCorner = window.s3d.viewUtility.screenPositionToCartesian({
      x: minPtPx.x,
      y: maxPtPx.y,
    });

    let currentOutlineVertexes =
      this._entityOutlineVertexes[this._entityOutlineVertexes.length - 1];
    currentOutlineVertexes [0] = minPt;
    currentOutlineVertexes [1] = bottomRightCorner;
    currentOutlineVertexes [2] = maxPt;
    currentOutlineVertexes [3] = topLeftCorner;
  }
  _beforeFinishingCurrentDrawing(currEntVers) {
    this._currentEntityOutline = null;
  }
  _createCurrentEntity(currEntVers) {
    let currEntityOutlineVertexes = [currEntVers[0], currEntVers[1]];
    this._entityOutlineVertexes.push(currEntityOutlineVertexes);

    this._currentEntityOutline = this.viewer.entities.add({
      name: 'sketch_rectangle_outline',
      polyline: {
        positions: new Cesium.CallbackProperty(
          () => currEntityOutlineVertexes,
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

    return this.viewer.entities.add({
      name: 'sketch_rectangle',
      rectangle: {
        coordinates: new Cesium.CallbackProperty(
          () => Cesium.Rectangle.fromCartesianArray(currEntVers),
          false
        ),
        material: Cesium.Color.fromAlpha(
          Cesium.Color.fromCssColorString(this.options.fillColor),
          this.options.fillOpacity
        ),
      },
    });
  }
  _shouldFinishCurrentDrawing(currEntVers) {
    return false;
  }
}
