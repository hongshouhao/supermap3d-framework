import BaseDrawingTool from './BaseDrawingTool';
export default class PolygonDrawingTool extends BaseDrawingTool {
  constructor(viewer, options = {}) {
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
    this._currentEntityOutline = null;
    this._vertexLimitCount = 100;
  }

  setVertexLimitCount(count) {
    if (!count || count < 3) {
      return;
    }
    this._vertexLimitCount = count;
  }

  _initCurrentEntityVertexes(vertex) {
    return [vertex, vertex.clone(), vertex.clone()];
  }
  _mouseLeftClick(currEntVers, newVertex) {
    currEntVers.splice(currEntVers.length - 1, 0, newVertex);
  }
  _mouseMoving(currEntVers, newVertex) {
    currEntVers[currEntVers.length - 2] = newVertex;
  }
  _beforeFinishingCurrentDrawing(currEntVers) {
    currEntVers.splice(currEntVers.length - 2, 1);
    this._currentEntityOutline = null;
  }
  _createCurrentEntity(currEntVers) {
    this._currentEntityOutline = this.viewer.entities.add({
      name: 'sketch_polygon_outline',
      polyline: {
        positions: new Cesium.CallbackProperty(() => currEntVers, false),
        material: Cesium.Color.fromAlpha(
          Cesium.Color.fromCssColorString(this.options.lineColor),
          this.options.lineOpacity
        ),
        width: 2.0,
        clampToGround: this.options.clampToGround,
      },
      iQueryable: false,
    });
    this._entitiesOutline.push(this._currentEntityOutline);

    this._entitiesOutline.push(this._currentEntityOutline);
    // let heightReference = this.clampToGround
    //   ? Cesium.HeightReference.CLAMP_TO_GROUND
    //   : Cesium.HeightReference.NONE
    return this.viewer.entities.add({
      name: 'sketch_polygon',
      polygon: {
        // heightReference: Cesium.HeightReference.NONE,
        hierarchy: new Cesium.CallbackProperty(
          () => new Cesium.PolygonHierarchy(currEntVers.slice(0, -1)),
          false
        ),
        material: Cesium.Color.fromAlpha(
          Cesium.Color.fromCssColorString(this.options.fillColor),
          this.options.fillOpacity
        ),
      },
      iQueryable: false,
    });
  }
  _shouldFinishCurrentDrawing(currEntVers) {
    return this._vertexLimitCount + 2 === currEntVers.length;
  }

  clear() {
    super.clear();
    for (let ent of this._entitiesOutline) {
      this.viewer.entities.remove(ent);
    }
    this._entitiesOutline = [];
    this._currentEntityOutline = null;
  }

  _getCurrentEntityVertexes() {
    return this._entityVertexes[this._entityVertexes.length - 1];
  }
}
