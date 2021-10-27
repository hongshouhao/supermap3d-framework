export default class PolygonDrawingTool {
  constructor(viewer) {
    this.viewer = viewer
    this.entities = []
    this.lineColor = '#12D035'
    this.opacity = 0.5
    this.multiable = true
    this.clampToGround = true

    this.entityAdded = function(geo) {
      console.log('entityAdded', geo)
    }
    this.drawingFinished = function(geoms) {
      console.log('drawingFinished', geoms)
    }

    this._drawHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    this._offsetZ = 0
    this._entitiesFill = []
    this._entityVertexes = []
    this._currentEntity = null
    this._currentEntityFill = null
  }

  start() {
    this.stop()
    window.s3d.toolWorking = true
    window.s3d.setCursor('cursor-crosshair')

    let _this = this
    _this._drawHandler.setInputAction(function(e) {
      let point = window.s3d.viewUtility.screenPositionToCartesian(e.position)
      point.z = point.z + _this._offsetZ
      if (!_this._currentEntity) {
        _this._createEntity(point)
      } else {
        let curEntVers = _this._getCurrentEntityVertexes()
        curEntVers.splice(curEntVers.length - 1, 0, point)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    _this._drawHandler.setInputAction(function(e) {
      if (_this._currentEntity) {
        let point = window.s3d.viewUtility.screenPositionToCartesian(
          e.endPosition
        )
        point.z = point.z + _this._offsetZ
        _this._updateEntity(point)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    _this._drawHandler.setInputAction(function() {
      let curEntVers = _this._getCurrentEntityVertexes()
      curEntVers.splice(curEntVers.length - 2, 1)
      _this._currentEntity = null
      _this._currentEntityFill = null

      if (_this.entityAdded) {
        _this.entities[_this.entities.length - 1].toGeoJson().then((result) => {
          _this.entityAdded(result)
        })
      }

      if (!_this.multiable) {
        _this.finishDrawing()
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }

  clear() {
    this.stop()
    for (let ent of this.entities) {
      this.viewer.entities.remove(ent)
    }

    for (let ent of this._entitiesFill) {
      this.viewer.entities.remove(ent)
    }

    this.entities = []
    this._entitiesFill = []
    this._currentEntity = null
    this._currentEntityFill = null
    this._entityVertexes = []
  }

  stop() {
    window.s3d.resetCursor()
    window.s3d.toolWorking = false
    this._drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    this._drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    this._drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }

  finishDrawing() {
    this.stop()
    if (this.drawingFinished) {
      this.getGeometries().then((result) => {
        this.drawingFinished(result)
      })
    }
  }

  getGeometries() {
    let coll = new Cesium.EntityCollection(this.viewer.entities.owner)
    for (let ent of this.entities) {
      coll.add(ent)
    }
    return coll.toGeoJson()
  }

  _createEntity(point) {
    let curEntVers = [point, point.clone(), point.clone()]
    this._entityVertexes.push(curEntVers)

    this._currentEntity = this.viewer.entities.add({
      name: 'sketch_polygon_outline',
      polyline: {
        positions: curEntVers,
        material: Cesium.Color.fromCssColorString(this.lineColor),
        width: 2.0,
        clampToGround: this.clampToGround,
      },
    })

    // let heightReference = this.clampToGround
    //   ? Cesium.HeightReference.CLAMP_TO_GROUND
    //   : Cesium.HeightReference.NONE
    this._currentEntityFill = this.viewer.entities.add({
      name: 'sketch_polygon_fill',
      polygon: {
        // heightReference: Cesium.HeightReference.NONE,
        hierarchy: curEntVers.slice(0, -1),
        material: Cesium.Color.fromAlpha(
          Cesium.Color.fromCssColorString(this.lineColor),
          this.opacity
        ),
      },
    })

    this.entities.push(this._currentEntity)
    this._entitiesFill.push(this._currentEntityFill)
  }

  _updateEntity(point) {
    if (!this._currentEntity) {
      return
    }

    let curEntVers = this._getCurrentEntityVertexes()
    curEntVers[curEntVers.length - 2] = point
    this._currentEntity.polyline.positions = new Cesium.CallbackProperty(
      () => curEntVers,
      false
    )

    this._currentEntityFill.polygon.hierarchy = new Cesium.CallbackProperty(
      () => new Cesium.PolygonHierarchy(curEntVers.slice(0, -1)),
      false
    )
  }

  _getCurrentEntityVertexes() {
    return this._entityVertexes[this._entityVertexes.length - 1]
  }
}
