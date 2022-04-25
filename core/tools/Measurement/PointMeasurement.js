import { cartesianToLonlat } from '../../utils/CesiumMath';
export default class PointMeasurement {
  constructor(viewer) {
    this.viewer = viewer;
    this.pointEntities = [];
    this.currentEntity = null;
    this.status = 'none';
    this.drag = false;
    this.createHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );

    this.editHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
  }

  start() {
    if (this.createHandler) {
      this.createHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      );
      this.createHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.RIGHT_CLICK
      );
      this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
      this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
      this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    let _this = this;
    window.s3d.setCursor('cursor-crosshair');
    _this.createHandler.setInputAction(function (e) {
      if (_this.status === 'none') {
        _this.status = 'moving';
        _this.addPonit(e.endPosition);
      } else if (_this.status === 'moving') {
        _this.updatePonit(e.endPosition);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    _this.createHandler.setInputAction(function () {
      window.s3d.resetCursor();
      _this.createHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      );
      _this.createHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.RIGHT_CLICK
      );
      _this.status = 'none';
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    _this.editHandler.setInputAction(function (e) {
      let pick = _this.viewer.scene.pick(e.position, 15, 15);
      if (
        Cesium.defined(pick) &&
        pick.id &&
        pick.id.name === 'point_annotation'
      ) {
        _this.drag = true;
        _this.status = 'moving';
        _this.currentEntity = pick.id;
        _this.viewer.scene.screenSpaceCameraController.enableInputs = false;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    _this.editHandler.setInputAction(function (e) {
      if (_this.drag) {
        _this.updatePonit(e.endPosition);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    _this.editHandler.setInputAction(function () {
      if (_this.drag) {
        _this.status = 'none';
        _this.drag = false;
        _this.viewer.scene.screenSpaceCameraController.enableInputs = true;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
  }

  clear() {
    for (let ent of this.pointEntities) {
      this.viewer.entities.remove(ent);
    }
    this.createHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.createHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.RIGHT_CLICK
    );
    this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
    this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
    this.editHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  addPonit(mousePosition) {
    let p = this.transformMousePosition(mousePosition);
    let cartesian = this.viewer.scene.pickPosition(mousePosition);
    cartesian.z = cartesian.z + 10;
    let entity = this.viewer.entities.add({
      position: cartesian,
      name: 'point_annotation',
      point: {
        pixelSize: 8,
        color: Cesium.Color.YELLOW,
      },
      label: {
        text: this.getLableText(p),
        font: '20px 宋体',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.fromCssColorString('#212fd2'),
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        pixelOffset: new Cesium.Cartesian2(10, -10),
        backgroundColor: Cesium.Color.fromAlpha(
          Cesium.Color.fromCssColorString('#2b312c'),
          1
        ),
        showBackground: true,
        eyeOffset: new Cesium.Cartesian3(0, 0, -10),
      },
    });
    this.currentEntity = entity;
    this.pointEntities.push(entity);
  }

  updatePonit(mousePosition) {
    if (this.currentEntity) {
      let cartesian = this.viewer.scene.pickPosition(mousePosition);
      this.currentEntity.position = new Cesium.CallbackProperty(function () {
        return cartesian;
      }, false);

      let coordinate = this.transformMousePosition(mousePosition);
      this.currentEntity.label.text = this.getLableText(coordinate);
    }
  }

  getLableText(point) {
    return `经度: ${point.x.toFixed(4)}\n纬度: ${point.y.toFixed(
      4
    )}\n高度: ${point.z.toFixed(3)}m`;
  }

  transformMousePosition(mousePosition) {
    return window.s3d.getCoordinate(mousePosition);
  }
}
