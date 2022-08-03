import PolylineDrawingTool from './PolylineDrawingTool';
import PolygonDrawingTool from './PolygonDrawingTool';
import RectangleDrawingTool from './RectangleDrawingTool';
import CircleDrawingTool from './CircleDrawingTool';
export default class SketchTool {
  constructor(viewer) {
    this.viewer = viewer;
    this._geoType = 'polygon';
    this._lineDrawingTool = new PolylineDrawingTool(viewer);
    this._polygonDrawingTool = new PolygonDrawingTool(viewer);
    this._rectangleDrawingTool = new RectangleDrawingTool(viewer);
    this._circleDrawingTool = new CircleDrawingTool(viewer);
  }

  enableFreeLine(){
    this._lineDrawingTool.freeLine = true;
  }

  setVertexLimitCount(count) {
    this._lineDrawingTool.setVertexLimitCount(count);
    this._polygonDrawingTool.setVertexLimitCount(count);
  }

  setColor(value) {
    this._lineDrawingTool.lineColor = value;
    this._polygonDrawingTool.options.lineColor = value;
    this._rectangleDrawingTool.options.lineColor = value;
    this._circleDrawingTool.options.lineColor = value;
  }

  setClampToGround(value) {
    this._lineDrawingTool.clampToGround = value;
    this._polygonDrawingTool.options.clampToGround = value;
    this._rectangleDrawingTool.options.clampToGround = value;
    this._circleDrawingTool.options.clampToGround = value;
  }

  setMultiable(value) {
    this._lineDrawingTool.multiable = value;
    this._polygonDrawingTool.multiable = value;
    this._rectangleDrawingTool.multiable = value;
    this._circleDrawingTool.multiable = value;
  }

  addEvent(type, callback) {
    switch (type) {
    case 'entityAdded':
      this._lineDrawingTool.entityAdded = callback;
      this._polygonDrawingTool.entityAdded = callback;
      this._rectangleDrawingTool.entityAdded = callback;
      this._circleDrawingTool.entityAdded = callback;
      break;
    case 'drawingFinished':
      this._lineDrawingTool.drawingFinished = callback;
      this._polygonDrawingTool.drawingFinished = callback;
      this._rectangleDrawingTool.drawingFinished = callback;
      this._circleDrawingTool.drawingFinished = callback;
      break;
    default:
      throw '暂不支持此事件';
    }
  }

  start(geoType) {
    this.stop();
    if (geoType) {
      this._geoType = geoType;
    }
    switch (this._geoType) {
    case 'polygon':
      return  this._polygonDrawingTool.start();
      break;
    case 'polyline':
      return  this._lineDrawingTool.start();
      break;
    case 'rectangle':
      return this._rectangleDrawingTool.start();
      break;
    case 'circle':
      return this._circleDrawingTool.start();
      break;
    default:
      return this._polygonDrawingTool.start();
      break;
    }
  }

  stop() {
    this._lineDrawingTool.stop();
    this._polygonDrawingTool.stop();
    this._rectangleDrawingTool.stop();
    this._circleDrawingTool.stop();
  }

  clear() {
    this._lineDrawingTool.clear();
    this._polygonDrawingTool.clear();
    this._rectangleDrawingTool.clear();
    this._circleDrawingTool.clear();
  }

  getGeometries() {
    return Promise.all([
      this._polygonDrawingTool.getGeometries(),
      this._lineDrawingTool.getGeometries(),
      this._rectangleDrawingTool.getGeometries(),
      this._circleDrawingTool.getGeometries(),
    ]).then((result) => {
      return {
        polygons: result[0],
        polylines: result[1],
        rectangles: result[2],
        circles: result[3],
      };
    });
  }
}
