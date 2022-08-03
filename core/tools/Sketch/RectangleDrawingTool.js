import PolygonDrawingTool from './PolygonDrawingTool';
import { pointProjectionOnLine } from '../../utils/CesiumMath';
export default class RectangleDrawingTool extends PolygonDrawingTool {
  constructor(viewer, options) {
    super(viewer, options);
  }
 
  _initCurrentEntityVertexes(vertex) {
    return [vertex, vertex, vertex ];
  }
  _mouseLeftClick(currEntVers, newVertex) {
    if(this.v0v1Picked)
    {
      return;
    }
    this.v0v1Picked = true;
    currEntVers[1] = newVertex;
    currEntVers[2] = newVertex;
  }
  _mouseMoving(currEntVers, newVertex) {
    if(this.v0v1Picked)
    {
      let projectionPoint = pointProjectionOnLine(
        newVertex,
        currEntVers[0],
        currEntVers[1]
      );
      let vecV1V2 = Cesium.Cartesian3.subtract(
        newVertex,
        projectionPoint,
        new Cesium.Cartesian3()
      );
      let vertex2 = Cesium.Cartesian3.add(
        currEntVers[1],
        vecV1V2,
        new Cesium.Cartesian3()
      );
      currEntVers[2] = vertex2;
      let vecV0V1 = Cesium.Cartesian3.subtract(
        currEntVers[0],
        currEntVers[1],
        new Cesium.Cartesian3()
      );
      let vertex3 = Cesium.Cartesian3.add(
        vecV0V1,
        vertex2,
        new Cesium.Cartesian3()
      );
      currEntVers[3] = vertex3;
      currEntVers[4] = currEntVers[0];
    }
    else{
      currEntVers[1] = newVertex;
      currEntVers[2] = newVertex;
    }
  }
  _beforeFinishingCurrentDrawing(currEntVers) {
    this._currentEntityOutline = null;
    this.v0v1Picked = false;
  }
  _shouldFinishCurrentDrawing(currEntVers) {
    return false;
  }
}
