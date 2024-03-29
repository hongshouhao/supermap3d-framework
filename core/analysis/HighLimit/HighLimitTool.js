import Enumerable from 'linq';
import {
  pointProjectionOnLine,
  getRectangleCoordinates,
  pointToLineDistance,
  getPointOnPlane2,
  reCalculateCartesian,
} from '../../utils/CesiumMath';

export default class HighLimitTool {
  constructor(viewer) {
    this.viewer = viewer;
    this.scene = viewer.scene;
    this.layers = [];
    this.clipping_height = 100;
    this.clipping_halfWidth = 300;

    this.createHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
    this.editHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );

    this.setCursor = (className) => window.s3d.setCursor(className);
    this.resetCursor = () => window.s3d.resetCursor();
  }

  start () {
    let _this = this;
    _this.resetState();
    _this.loadLayers().then(() => {
      if (this._corners) {
        _this.createRectangle();
        _this.updateClipBox();
      } else {
        _this.createHandler.setInputAction(function (e) {
          _this.setCursor('cursor-move');
          if (!_this.clippingRectangle) {
            _this.createRectangleByMouse(e.endPosition);
          } else {
            _this.moveDefaultectangle(e.endPosition);
            _this.updateClipBox();
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        _this.createHandler.setInputAction(function () {
          _this.resetCursor();
          _this.createHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
          );
          _this.createHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.RIGHT_CLICK
          );
          _this.onEditEvent();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      }
    });
  }

  // corners: [x1,y1,x2,y2,x3,y3,x4,y4]
  setRectangle (corners) {
    this._corners = corners;
    return this;
  }

  setHeight (height) {
    this.clipping_height = height;
    if (this.clippingRectangle) {
      this.clippingRectangle.rectangle.height = height;

      for (let i = 0; i < this.clippingRectangleOutlinePositions.length; i++) {
        let ptNew = reCalculateCartesian(
          this.clippingRectangleOutlinePositions[i],
          height
        );
        this.clippingRectangleOutlinePositions[i] = ptNew;
      }

      let _this = this;
      this.clippingRectangleOutline.polyline.positions =
        new Cesium.CallbackProperty(function () {
          return _this.clippingRectangleOutlinePositions;
        }, false);

      this.updateClipBox();
    }
    return this;
  }

  setTargetLayers (layerNames) {
    this.layers = layerNames;
    return this;
  }

  loadLayers () {
    var promises = [];
    for (let lname of this.layers) {
      let newLayerName = lname + '-HighLimit';
      let newLayer = this.scene.layers.find(newLayerName);
      if (newLayer) {
        newLayer.visible = true;
        promises.push(Promise.resolve(newLayer));
      } else {
        let layer = this.scene.layers.find(lname);
        if (layer) {
          // layer.clipLineColor = Cesium.Color.RED

          let url = window.s3d.layerManager.getLayerConfig(lname).url;
          // let url = `${layer._baseUri.scheme}://${layer._baseUri.authority}${layer._baseUri.path}`
          // url = url.replace('/data/path/', '/config')
          let pro = this.viewer.scene
            .addS3MTilesLayerByScp(url, { name: newLayerName })
            .then((ly) => {
              ly.visible = true;
              ly.style3D.fillStyle = layer.style3D.fillStyle;
              ly.style3D.lineColor = layer.style3D.lineColor;
              ly.style3D.lineWidth = layer.style3D.lineWidth;
              ly.wireFrameMode = layer.wireFrameMode;
              ly.clipLineColor = Cesium.Color.RED;
              ly.style3D.fillForeColor = Cesium.Color.ORANGERED;
              return ly;
            });

          promises.push(pro);
        }
      }
    }
    return Promise.all(promises);
  }

  clear () {
    for (let lname of this.layers) {
      let ly1 = this.scene.layers.find(lname);
      if (ly1) {
        ly1.clearCustomClipBox();
      }

      let ly2 = this.scene.layers.find(lname + '-HighLimit');
      if (ly2) {
        ly2.visible = false;
        ly2.clearCustomClipBox();
      }
    }
    this._corners = null;
    this.resetState();
  }

  resetState () {
    this.viewer.entities.remove(this.clippingRectangle);
    this.viewer.entities.remove(this.clippingRectangleOutline);
    this.clippingRectangle = null;
    this.clippingRectangleOutline = null;

    this.createHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.MOUSE_MOVE
    );
    this.createHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.RIGHT_CLICK
    );
    this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
    this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
    this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.state = '';
  }

  createRectangleByMouse (mousePosition) {
    let center = this.transformMousePosition(mousePosition);
    this.clippingRectangle = this.viewer.entities.add({
      name: 'clipping_rectangle',
      rectangle: {
        height: this.clipping_height,
        coordinates: Cesium.Rectangle.fromCartesianArray(
          getRectangleCoordinates(
            center,
            this.clipping_halfWidth,
            this.clipping_halfWidth,
            false
          )
        ),
        material: Cesium.Color.fromAlpha(
          Cesium.Color.fromCssColorString('#fe8001'),
          0.2
        ),
      },
      iQueryable: false,
    });

    this.clippingRectangleOutlinePositions = getRectangleCoordinates(
      center,
      this.clipping_halfWidth,
      this.clipping_halfWidth,
      true
    );

    this.clippingRectangleOutline = this.viewer.entities.add({
      name: 'clipping_rectangle_outline',
      polyline: {
        positions: this.clippingRectangleOutlinePositions,
        material: Cesium.Color.fromCssColorString('#fe8001'),
        width: 1.0,
        clampToGround: false,
      },
      iQueryable: false,
    });
  }

  createRectangle () {
    let vertexes = Cesium.Cartesian3.fromDegreesArray(this._corners);
    this.clippingRectangle = this.viewer.entities.add({
      name: 'clipping_rectangle',
      rectangle: {
        height: this.clipping_height,
        coordinates: Cesium.Rectangle.fromCartesianArray(vertexes),
        material: Cesium.Color.fromAlpha(
          Cesium.Color.fromCssColorString('#fe8001'),
          0.2
        ),
      },
      iQueryable: false,
    });

    let rect = this.clippingRectangle.rectangle.coordinates.getValue();
    let southwest = Cesium.Rectangle.southwest(rect);
    let southeast = Cesium.Rectangle.southeast(rect);
    let northeast = Cesium.Rectangle.northeast(rect);
    let northwest = Cesium.Rectangle.northwest(rect);
    southwest.height = this.clipping_height;
    southeast.height = this.clipping_height;
    northeast.height = this.clipping_height;
    northwest.height = this.clipping_height;

    this.clippingRectangleOutlinePositions = [
      Cesium.Ellipsoid.WGS84.cartographicToCartesian(southwest),
      Cesium.Ellipsoid.WGS84.cartographicToCartesian(southeast),
      Cesium.Ellipsoid.WGS84.cartographicToCartesian(northeast),
      Cesium.Ellipsoid.WGS84.cartographicToCartesian(northwest),
      Cesium.Ellipsoid.WGS84.cartographicToCartesian(southwest),
    ];

    this.clippingRectangleOutline = this.viewer.entities.add({
      name: 'clipping_rectangle_outline',
      polyline: {
        positions: this.clippingRectangleOutlinePositions,
        material: Cesium.Color.fromCssColorString('#fe8001'),
        width: 1.0,
        clampToGround: false,
      },
      iQueryable: false,
    });
  }

  moveRectangle (startPosition, endPosition) {
    let _this = this;
    let ray1 = _this.viewer.camera.getPickRay(startPosition);
    let pointOnPlane1 = getPointOnPlane2(
      ray1.origin,
      ray1.direction,
      _this.clippingRectangleOutlinePositions
    );

    let ray2 = _this.viewer.camera.getPickRay(endPosition);
    let pointOnPlane2 = getPointOnPlane2(
      ray2.origin,
      ray2.direction,
      _this.clippingRectangleOutlinePositions
    );
    let moveVector = Cesium.Cartesian3.subtract(
      pointOnPlane2,
      pointOnPlane1,
      new Cesium.Cartesian3()
    );

    for (let i = 0; i < _this.clippingRectangleOutlinePositions.length; i++) {
      let ptNew = Cesium.Cartesian3.add(
        moveVector,
        _this.clippingRectangleOutlinePositions[i],
        new Cesium.Cartesian3()
      );

      _this.clippingRectangleOutlinePositions[i] = ptNew;
    }

    this.clippingRectangle.rectangle.coordinates = new Cesium.CallbackProperty(
      function () {
        return Cesium.Rectangle.fromCartesianArray([
          _this.clippingRectangleOutlinePositions[0],
          _this.clippingRectangleOutlinePositions[2],
        ]);
      },
      false
    );

    this.clippingRectangleOutline.polyline.positions =
      new Cesium.CallbackProperty(function () {
        return _this.clippingRectangleOutlinePositions;
      }, false);
  }

  moveDefaultectangle (mousePosition) {
    let _this = this;
    let center = _this.transformMousePosition(mousePosition);
    this.clippingRectangle.rectangle.coordinates = new Cesium.CallbackProperty(
      function () {
        return Cesium.Rectangle.fromCartesianArray(
          getRectangleCoordinates(
            center,
            _this.clipping_halfWidth,
            _this.clipping_halfWidth,
            false
          )
        );
      },
      false
    );

    this.clippingRectangleOutlinePositions = getRectangleCoordinates(
      center,
      this.clipping_halfWidth,
      this.clipping_halfWidth,
      true
    );

    this.clippingRectangleOutline.polyline.positions =
      new Cesium.CallbackProperty(function () {
        return _this.clippingRectangleOutlinePositions;
      }, false);
  }

  onEditEvent () {
    let _this = this;
    _this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
    _this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
    _this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    _this.editHandler.setInputAction(function (e) {
      if (_this.ifMouseOnOutline(e.position)) {
        _this.state = 'scale';
        _this.setCursor('cursor-pointer');
        _this.saveScaleStartPoint(e.position);
        _this.viewer.scene.screenSpaceCameraController.enableInputs = false;
      } else if (_this.ifMouseInRectangle(e.position)) {
        _this.state = 'move';
        _this.setCursor('cursor-move');
        _this.viewer.scene.screenSpaceCameraController.enableInputs = false;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    _this.editHandler.setInputAction(function () {
      if (_this.state === 'move' || _this.state === 'scale') {
        _this.state = '';
        _this.resetCursor();
        _this.viewer.scene.screenSpaceCameraController.enableInputs = true;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    _this.editHandler.setInputAction(function (e) {
      if (_this.state === 'scale') {
        _this.scaleRectangle(e.endPosition);
        _this.updateClipBox();
      } else if (_this.state === 'move') {
        _this.moveRectangle(e.startPosition, e.endPosition);
        _this.updateClipBox();
      } else {
        if (_this.ifMouseOnOutline(e.endPosition)) {
          _this.clippingRectangleOutline.polyline.width =
            new Cesium.CallbackProperty(function () {
              return 2;
            }, false);

          _this.setCursor('cursor-pointer');
        } else {
          _this.clippingRectangleOutline.polyline.width =
            new Cesium.CallbackProperty(function () {
              return 1;
            }, false);
          _this.resetCursor();
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  saveScaleStartPoint (mousePosition) {
    let ray = this.viewer.camera.getPickRay(mousePosition);
    let pointOnPlane = getPointOnPlane2(
      ray.origin,
      ray.direction,
      this.clippingRectangleOutlinePositions
    );

    let disArr = [];
    for (let i = 0; i < 4; i++) {
      let p1 = this.clippingRectangleOutlinePositions[i];
      let p2 = this.clippingRectangleOutlinePositions[i + 1];
      disArr.push({
        dis: pointToLineDistance(pointOnPlane, p1, p2),
        pts: [p1, p2],
        idx: i,
      });
    }

    let ordered = Enumerable.from(disArr)
      .orderBy((x) => x.dis)
      .toArray();
    this.scalePickedLine = ordered[0];
  }

  scaleRectangle (mousePosition) {
    let _this = this;
    let moveVector = _this.calculateScaleVector(mousePosition);
    let pt1 = Cesium.Cartesian3.add(
      moveVector,
      _this.scalePickedLine.pts[0],
      new Cesium.Cartesian3()
    );
    let pt2 = Cesium.Cartesian3.add(
      moveVector,
      _this.scalePickedLine.pts[1],
      new Cesium.Cartesian3()
    );

    if (_this.scalePickedLine.idx === 0 || _this.scalePickedLine.idx === 4) {
      _this.clippingRectangleOutlinePositions[0] = pt1;
      _this.clippingRectangleOutlinePositions[4] = pt1;
    } else {
      _this.clippingRectangleOutlinePositions[_this.scalePickedLine.idx] = pt1;
    }

    if (_this.scalePickedLine.idx + 1 === 4) {
      _this.clippingRectangleOutlinePositions[0] = pt2;
      _this.clippingRectangleOutlinePositions[4] = pt2;
    } else {
      _this.clippingRectangleOutlinePositions[_this.scalePickedLine.idx + 1] =
        pt2;
    }

    this.clippingRectangle.rectangle.coordinates = new Cesium.CallbackProperty(
      function () {
        return Cesium.Rectangle.fromCartesianArray([
          _this.clippingRectangleOutlinePositions[0],
          _this.clippingRectangleOutlinePositions[2],
        ]);
      },
      false
    );

    _this.clippingRectangleOutline.polyline.positions =
      new Cesium.CallbackProperty(function () {
        return _this.clippingRectangleOutlinePositions;
      }, false);
  }

  updateClipBox () {
    let rect = this.clippingRectangle.rectangle.coordinates.getValue();
    let center = Cesium.Rectangle.center(rect);
    let position = Cesium.Cartesian3.fromDegrees(
      Cesium.Math.toDegrees(center.longitude),
      Cesium.Math.toDegrees(center.latitude),
      this.clipping_height / 50 - 1
    );
    let width = Cesium.Cartesian3.distance(
      this.clippingRectangleOutlinePositions[0],
      this.clippingRectangleOutlinePositions[1]
    );
    let height = Cesium.Cartesian3.distance(
      this.clippingRectangleOutlinePositions[1],
      this.clippingRectangleOutlinePositions[2]
    );

    for (let lname of this.layers) {
      let ly1 = this.scene.layers.find(lname);
      if (ly1) {
        ly1.setCustomClipBox({
          dimensions: new Cesium.Cartesian3(
            width,
            height,
            this.clipping_height * 2
          ),
          position: position,
          heading: 0,
          clipMode: 'clip_behind_any_plane',
        });
      }

      let ly2 = this.scene.layers.find(lname + '-HighLimit');
      if (ly2) {
        ly2.setCustomClipBox({
          dimensions: new Cesium.Cartesian3(
            width,
            height,
            this.clipping_height * 2
          ),
          position: position,
          heading: 0,
          clipMode: 'clip_behind_all_plane',
        });
      }
    }
  }

  ifMouseOnOutline (mousePosition) {
    let pick = this.viewer.scene.pick(mousePosition, 15, 15);
    return (
      Cesium.defined(pick) &&
      pick.id &&
      pick.id.name === 'clipping_rectangle_outline'
    );
  }

  ifMouseInRectangle (mousePosition) {
    let pick = this.viewer.scene.pick(mousePosition);
    return (
      Cesium.defined(pick) && pick.id && pick.id.name === 'clipping_rectangle'
    );
  }

  transformMousePosition (mousePosition) {
    let position = this.viewer.scene.pickPosition(mousePosition);
    let cartographic = Cesium.Cartographic.fromCartesian(position);
    let longitude = Cesium.Math.toDegrees(cartographic.longitude);
    let latitude = Cesium.Math.toDegrees(cartographic.latitude);
    return Cesium.Cartesian3.fromDegrees(
      longitude,
      latitude,
      this.clipping_height
    );
  }

  calculateScaleVector (mousePosition) {
    let ray = this.viewer.camera.getPickRay(mousePosition);
    let pointOnPlane = getPointOnPlane2(
      ray.origin,
      ray.direction,
      this.clippingRectangleOutlinePositions
    );

    let ptOnline = pointProjectionOnLine(
      pointOnPlane,
      this.scalePickedLine.pts[0],
      this.scalePickedLine.pts[1]
    );

    let moveVector = Cesium.Cartesian3.subtract(
      pointOnPlane,
      ptOnline,
      new Cesium.Cartesian3()
    );
    return moveVector;
  }
}
