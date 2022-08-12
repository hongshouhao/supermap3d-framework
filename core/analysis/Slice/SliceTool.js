import Enumerable from 'linq';
import {
  pointProjectionOnLine,
  getRectangleCoordinates,
  pointToLineDistance,
  getPointOnPlane2,
  cartesianToLonlat,
  reCalculateCartesian,
} from '../../utils/CesiumMath';

export default class SliceTool {
  constructor(viewer) {
    this.viewer = viewer;
    this.scene = viewer.scene;
    this.clipping_height = 50;
    this.clipping_halfWidth = 300;

    this.createHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );

    this.editHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
    this.working = false;
  }

  start() {
    let _this = this;
    _this.working = true;
    _this.resetState();
    _this.createHandler.setInputAction(function (e) {
      if (!_this.clippingRectangle) {
        _this.createRectangle(e.endPosition);
      } else {
        _this.moveDefaultectangle(e.endPosition);
        // 根据下面的代码移动有误差，因为鼠标状态还没稳定
        // _this.moveRectangle(e.startPosition, e.endPosition)
        _this.updateClipBox();
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    _this.createHandler.setInputAction(function () {
      _this.rotate(0, 90, 0);
      _this.createHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      );
      _this.createHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.RIGHT_CLICK
      );

      _this.onEditEvent();
      _this.working = false;
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  setHeight(height) {
    if (this.clippingRectangle) {
      this.clippingRectangle.polygon.height = height;

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

    this.clipping_height = height;
  }

  rotate() {
    // heading, pitch, roll
    // var hpr = new Cesium.HeadingPitchRoll(
    //   Cesium.Math.toRadians(heading),
    //   Cesium.Math.toRadians(pitch),
    //   Cesium.Math.toRadians(roll)
    // )
    // let midPt = Cesium.Cartesian3.divideByScalar(
    //   Cesium.Cartesian3.add(
    //     this.clippingRectangleOutlinePositions[0],
    //     this.clippingRectangleOutlinePositions[2],
    //     new Cesium.Cartesian3()
    //   ),
    //   2,
    //   new Cesium.Cartesian3()
    // )
    // let orientation = Cesium.Transforms.headingPitchRollQuaternion(midPt, hpr)
    // let m = Cesium.Transforms.headingPitchRollToFixedFrame(
    //   midPt,
    //   hpr,
    //   Cesium.Ellipsoid.WGS84,
    //   Cesium.Transforms.eastNorthUpToFixedFrame,
    //   new Cesium.Matrix4()
    // )
    // var center = Cesium.Matrix4.multiplyByPoint(
    //   m,
    //   midPt,
    //   new Cesium.Cartesian3()
    // )
  }

  clear() {
    for (let ly of this.scene.layers._layerQueue) {
      if (ly) {
        ly.clearCustomClipBox();
      }
    }

    this.resetState();
    this.working = false;
  }

  resetState() {
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

  createRectangle(mousePosition) {
    let center = this.transformMousePosition(mousePosition);
    // this.clippingRectangle = this.viewer.entities.add({
    //   name: 'clipping_rectangle',
    //   rectangle: {
    //     height: this.clipping_height,
    //     coordinates: Cesium.Rectangle.fromCartesianArray(
    //       getRectangleCoordinates(
    //         center,
    //         this.clipping_halfWidth,
    //         this.clipping_halfWidth,
    //         false
    //       )
    //     ),
    //     material: Cesium.Color.fromAlpha(
    //       Cesium.Color.fromCssColorString('#fe8001'),
    //       0.2
    //     ),
    //   },
    // })

    this.clippingRectangleOutlinePositions = getRectangleCoordinates(
      center,
      this.clipping_halfWidth,
      this.clipping_halfWidth,
      true
    );
    this.clippingRectangle = this.viewer.entities.add({
      name: 'clipping_rectangle',
      polygon: {
        height: this.clipping_height,
        hierarchy: this.clippingRectangleOutlinePositions.slice(0, 4),
        material: Cesium.Color.fromAlpha(
          Cesium.Color.fromCssColorString('#fe8001'),
          0.2
        ),
      },
      iQueryable: false,
    });

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

  moveRectangle(startPosition, endPosition) {
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

    // this.clippingRectangle.rectangle.coordinates = new Cesium.CallbackProperty(
    //   function() {
    //     return Cesium.Rectangle.fromCartesianArray([
    //       _this.clippingRectangleOutlinePositions[0],
    //       _this.clippingRectangleOutlinePositions[2],
    //     ])
    //   },
    //   false
    // )

    this.clippingRectangle.polygon.hierarchy =
      _this.clippingRectangleOutlinePositions.slice(0, 4);
    this.clippingRectangleOutline.polyline.positions =
      new Cesium.CallbackProperty(function () {
        return _this.clippingRectangleOutlinePositions;
      }, false);
  }

  moveDefaultectangle(mousePosition) {
    let _this = this;
    let center = _this.transformMousePosition(mousePosition);
    // this.clippingRectangle.rectangle.coordinates = new Cesium.CallbackProperty(
    //   function() {
    //     return Cesium.Rectangle.fromCartesianArray(
    //       getRectangleCoordinates(
    //         center,
    //         _this.clipping_halfWidth,
    //         _this.clipping_halfWidth,
    //         false
    //       )
    //     )
    //   },
    //   false
    // )

    this.clippingRectangleOutlinePositions = getRectangleCoordinates(
      center,
      this.clipping_halfWidth,
      this.clipping_halfWidth,
      true
    );

    this.clippingRectangle.polygon.hierarchy =
      _this.clippingRectangleOutlinePositions.slice(0, 4);

    // new Cesium.CallbackProperty(
    //   function() {
    //     return _this.clippingRectangleOutlinePositions.slice(0, 4)
    //   },
    //   false
    // )

    this.clippingRectangleOutline.polyline.positions =
      new Cesium.CallbackProperty(function () {
        return _this.clippingRectangleOutlinePositions;
      }, false);
  }

  onEditEvent() {
    let _this = this;
    _this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
    _this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
    _this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    _this.editHandler.setInputAction(function (e) {
      if (_this.ifMouseOnOutline(e.position)) {
        _this.state = 'scale';
        _this.saveScaleStartPoint(e.position);
        _this.viewer.scene.screenSpaceCameraController.enableInputs = false;
      } else if (_this.ifMouseInRectangle(e.position)) {
        _this.viewer.scene.screenSpaceCameraController.enableInputs = false;
        _this.state = 'move';
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    _this.editHandler.setInputAction(function () {
      if (_this.state === 'scale' || _this.state === 'move') {
        _this.viewer.scene.screenSpaceCameraController.enableInputs = true;
        _this.state = '';
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

          window.s3d.setCursor('cursor-crosshair');
        } else {
          _this.clippingRectangleOutline.polyline.width =
            new Cesium.CallbackProperty(function () {
              return 1;
            }, false);
          window.s3d.resetCursor();
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  saveScaleStartPoint(mousePosition) {
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

  scaleRectangle(mousePosition) {
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

    // this.clippingRectangle.rectangle.coordinates = new Cesium.CallbackProperty(
    //   function() {
    //     return Cesium.Rectangle.fromCartesianArray([
    //       _this.clippingRectangleOutlinePositions[0],
    //       _this.clippingRectangleOutlinePositions[2],
    //     ])
    //   },
    //   false
    // )

    this.clippingRectangle.polygon.hierarchy =
      _this.clippingRectangleOutlinePositions.slice(0, 4);

    _this.clippingRectangleOutline.polyline.positions =
      new Cesium.CallbackProperty(function () {
        return _this.clippingRectangleOutlinePositions;
      }, false);
  }

  updateClipBox() {
    let midPt = Cesium.Cartesian3.divideByScalar(
      Cesium.Cartesian3.add(
        this.clippingRectangleOutlinePositions[0],
        this.clippingRectangleOutlinePositions[2],
        new Cesium.Cartesian3()
      ),
      2,
      new Cesium.Cartesian3()
    );

    let lonlat = cartesianToLonlat(midPt);
    let position = Cesium.Cartesian3.fromDegrees(
      lonlat.longitude,
      lonlat.latitude,
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

    for (let ly of this.scene.layers._layerQueue) {
      ly.setCustomClipPlane(
        this.clippingRectangleOutlinePositions[0],
        this.clippingRectangleOutlinePositions[1],
        this.clippingRectangleOutlinePositions[2]
      );

      console.log(position);
      console.log(width);
      console.log(height);
      // ly.setCustomClipBox({
      //   dimensions: new Cesium.Cartesian3(
      //     width,
      //     height,
      //     this.clipping_height * 2
      //   ),
      //   position: position,
      //   heading: 0,
      //   clipMode: 'clip_behind_any_plane',
      // })

      // ly.setCustomClipCross({
      //   position: position,
      //   dimensions: new Cesium.Cartesian3(
      //     width,
      //     height,
      //     this.clipping_height * 2
      //   ),
      //   heading: 0,
      //   pitch: 0,
      //   roll: 0,
      //   extrudeDistance: 0.1,
      // })
    }
  }

  ifMouseOnOutline(mousePosition) {
    let pick = this.viewer.scene.pick(mousePosition, 15, 15);
    return (
      Cesium.defined(pick) &&
      pick.id &&
      pick.id.name === 'clipping_rectangle_outline'
    );
  }

  ifMouseInRectangle(mousePosition) {
    let pick = this.viewer.scene.pick(mousePosition);
    return (
      Cesium.defined(pick) && pick.id && pick.id.name === 'clipping_rectangle'
    );
  }

  transformMousePosition(mousePosition) {
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

  calculateScaleVector(mousePosition) {
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
