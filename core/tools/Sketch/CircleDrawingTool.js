import {
  pointRotateAroundPoint,
} from '../../../core/utils/CesiumMath';
import PolygonDrawingTool from './PolygonDrawingTool';

export default class CircleDrawingTool extends PolygonDrawingTool {
  constructor(viewer, options) {
    super(viewer,options);
    this.slices = 128;
  }

  _initCurrentEntityVertexes(vertex) {
    this.center = vertex;
    return [vertex, vertex.clone(), vertex.clone()];
  }
  _mouseLeftClick(currEntVers, newVertex) {
  }
  _mouseMoving(currEntVers, newVertex) {
    let vertexes = this. getVertexes(this.center, newVertex, this.slices);
    currEntVers.length = 0;
    vertexes.forEach(element => {
      currEntVers.push(element);
    });
  }
  
  _shouldFinishCurrentDrawing(currEntVers) {
    return false;
  }

  getVertexes(center, startPoint, slices) {
    let vertexes = [];
    let normal = Cesium.Cartesian3.normalize(center, new Cesium.Cartesian3());
    let sectorRad = (Math.PI * 2) / slices;
    for (let i = 0; i < slices - 1; i++) {
      let rotationAngle = sectorRad * i;
      let newVertex = pointRotateAroundPoint(
        center,
        startPoint,
        normal,
        rotationAngle
      );
      vertexes.push(newVertex);
    }
    vertexes.push(startPoint.clone());
    return vertexes;
  }
}
