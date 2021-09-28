import PolylineDrawingTool from './PolylineDrawingTool'
import PolygonDrawingTool from './PolygonDrawingTool'
export default class SketchTool {
  constructor(viewer) {
    this.viewer = viewer
    this._geoType = 'polygon'
    this._lineDrawingTool = new PolylineDrawingTool(viewer)
    this._polygonDrawingTool = new PolygonDrawingTool(viewer)
  }

  setColor(value) {
    this._lineDrawingTool.lineColor = value
    this._polygonDrawingTool.lineColor = value
  }

  setClampToGround(value) {
    this._lineDrawingTool.clampToGround = value
    this._polygonDrawingTool.clampToGround = value
  }

  setMultiable(value) {
    this._lineDrawingTool.multiable = value
    this._polygonDrawingTool.multiable = value
  }

  start(geoType) {
    this.stop()
    if (geoType) {
      this._geoType = geoType
    }
    switch (this._geoType) {
      case 'polygon':
        this._polygonDrawingTool.start()
        break
      case 'polyline':
        this._lineDrawingTool.start()
        break
      default:
        this._polygonDrawingTool.start()
        break
    }
  }

  stop() {
    this._lineDrawingTool.stop()
    this._polygonDrawingTool.stop()
  }

  clear() {
    this._lineDrawingTool.clear()
    this._polygonDrawingTool.clear()
  }

  getGeometries() {
    return Promise.all([
      this._polygonDrawingTool.getGeometries(),
      this._lineDrawingTool.getGeometries(),
    ]).then((result) => {
      return {
        polygons: result[0],
        polylines: result[1],
      }
    })
  }
}
