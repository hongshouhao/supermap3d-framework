import BaseDrawingTool from './BaseDrawingTool';
export default class PolylineDrawingTool extends BaseDrawingTool {
  constructor(viewer) {
    super(viewer);
    this.lineColor = '#ff0000';
    this.clampToGround = true;
    this.multiable = true;
    this.freeLine = false;
    this._vertexLimitCount = 100;
  }

  setVertexLimitCount(count) {
    if (!count || count < 2) {
      return;
    }
    this._vertexLimitCount = count;
  }

  _initCurrentEntityVertexes(vertex) {
    return [vertex, vertex.clone()];
  }
  _mouseLeftClick(currEntVers, newVertex) {
    currEntVers.splice(currEntVers.length - 1, 0, newVertex);
  }
  _mouseMoving(currEntVers, newVertex) {
    if (this.freeLine) {
      currEntVers.push(newVertex);
    } else {
      currEntVers[currEntVers.length - 1] = newVertex;
    }
  }
  _beforeFinishingCurrentDrawing(currEntVers) {
    currEntVers.splice(currEntVers.length - 1, 1);
  }
  _createCurrentEntity(currEntVers) {
    return this.viewer.entities.add({
      name: 'sketch_line',
      polyline: {
        positions: new Cesium.CallbackProperty(() => currEntVers, false),
        material: Cesium.Color.fromCssColorString(this.lineColor),
        width: 2.0,
        clampToGround: this.clampToGround,
      },
      iQueryable: false,
    });
  }
  _shouldFinishCurrentDrawing(currEntVers) {
    if (this.freeLine) {
      return false;
    }
    return this._vertexLimitCount + 1 === currEntVers.length;
  }
}
