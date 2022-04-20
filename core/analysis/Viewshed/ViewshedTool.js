import { lonLatToCartesian } from '../../utils/CesiumMath'
export default class ViewshedTool {
  constructor(viewer) {
    this.viewer = viewer
    this.scene = viewer.scene
    this.viewshedFlag = false

    this.viewModel = {
      direction: 1,
      pitch: 1,
      distance: 1,
      verticalFov: 1,
      horizontalFov: 1,
    }

    this.viewshed3D = new Cesium.ViewShed3D(this.scene)

    this.pickPointHandler = new Cesium.DrawHandler(
      this.viewer,
      Cesium.DrawMode.Point
    )
    this.drawHandler = new Cesium.ScreenSpaceEventHandler(this.scene.canvas)
  }

  start() {
    this.viewModel.direction = this.viewshed3D.direction
    this.viewModel.pitch = this.viewshed3D.pitch
    this.viewModel.distance = this.viewshed3D.distance
    this.viewModel.verticalFov = this.viewshed3D.verticalFov
    this.viewModel.horizontalFov = this.viewshed3D.horizontalFov

    let _this = this
    let viewPosition = null
    // 鼠标移动时间回调
    _this.drawHandler.setInputAction(function (e) {
      // 若此标记为false，则激活对可视域分析对象的操作
      if (!_this.viewshedFlag) {
        // 获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
        let last = _this.scene.pickPosition(e.endPosition)
        // 计算该点与视口位置点坐标的距离
        let distance = Cesium.Cartesian3.distance(viewPosition, last)

        if (distance > 0) {
          // 将鼠标当前点坐标转化成经纬度
          let cartographic = Cesium.Cartographic.fromCartesian(last)
          let longitude = Cesium.Math.toDegrees(cartographic.longitude)
          let latitude = Cesium.Math.toDegrees(cartographic.latitude)
          let height = cartographic.height
          // 通过该点设置可视域分析对象的距离及方向
          _this.viewshed3D.setDistDirByPoint([longitude, latitude, height])
        }

        _this.viewModel.direction = _this.viewshed3D.direction
        _this.viewModel.pitch = _this.viewshed3D.pitch
        _this.viewModel.distance = _this.viewshed3D.distance
        _this.viewModel.horizontalFov = _this.viewshed3D.horizontalFov
        _this.viewModel.verticalFov = _this.viewshed3D.verticalFov
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    window.s3d.setCursor('cursor-crosshair')
    _this.drawHandler.setInputAction(function (e) {
      // 鼠标右键事件回调，不再执行鼠标移动事件中对可视域的操作
      window.s3d.resetCursor()
      _this.viewshedFlag = true
      let end = _this.scene.pickPosition(e.position)
      let start = Cartesian3.fromDegrees(..._this.viewshed3D.viewPosition)
      // let start = lonLatToCartesian(..._this.viewshed3D.viewPosition);
      window.s3d.cameraUtility.lookAt(start, end)

      _this.drawHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      )
      _this.drawHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.RIGHT_CLICK
      )
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    _this.pickPointHandler.drawEvt.addEventListener(function (result) {
      let point = result.object
      viewPosition = point.position

      // 将获取的点的位置转化成经纬度
      let cartographic = Cesium.Cartographic.fromCartesian(point.position)
      let longitude = Cesium.Math.toDegrees(cartographic.longitude)
      let latitude = Cesium.Math.toDegrees(cartographic.latitude)
      let height = cartographic.height + 1.8
      point.position = Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        height
      )

      if (_this.viewshedFlag) {
        // 设置视口位置
        _this.viewshed3D.viewPosition = [longitude, latitude, height]
        _this.viewshed3D.build()
        // 将标记置为false以激活鼠标移动回调里面的设置可视域操作
        _this.viewshedFlag = false
      }
    })

    if (this.pickPointHandler.active) {
      this.pickPointHandler.deactivate()
    }

    // 先清除之前的可视域分析
    this.viewer.entities.removeAll()
    // this.viewshed3D.distance = 0.1
    this.viewshedFlag = true

    // 激活绘制点类
    this.pickPointHandler.activate()
  }

  bindUI(dom) {
    let _this = this
    Cesium.knockout.track(_this.viewModel)
    Cesium.knockout.applyBindings(_this.viewModel, dom)
    Cesium.knockout
      .getObservable(_this.viewModel, 'direction')
      .subscribe(function (newValue) {
        if (_this.viewshedFlag) {
          _this.viewshed3D.direction = parseFloat(newValue)
          console.log('heading', newValue)
          console.log('pitch', _this.viewer.camera.pitch)
          _this._updateCamera(newValue, _this.viewer.camera.pitch)
          _this._updateCamera(
            newValue,
            Cesium.Math.toDegrees(_this.viewer.camera.pitch)
          )
        }
      })
    Cesium.knockout
      .getObservable(_this.viewModel, 'pitch')
      .subscribe(function (newValue) {
        if (_this.viewshedFlag) {
          _this.viewshed3D.pitch = parseFloat(newValue)
          _this._updateCamera(
            Cesium.Math.toDegrees(_this.viewer.camera.heading),
            newValue
          )
        }
      })
    Cesium.knockout
      .getObservable(_this.viewModel, 'distance')
      .subscribe(function (newValue) {
        if (_this.viewshedFlag) {
          _this.viewshed3D.distance = parseFloat(newValue)
        }
      })
    Cesium.knockout
      .getObservable(_this.viewModel, 'verticalFov')
      .subscribe(function (newValue) {
        if (_this.viewshedFlag) {
          _this.viewshed3D.verticalFov = parseFloat(newValue)
        }
      })
    Cesium.knockout
      .getObservable(_this.viewModel, 'horizontalFov')
      .subscribe(function (newValue) {
        if (_this.viewshedFlag) {
          _this.viewshed3D.horizontalFov = parseFloat(newValue)
        }
      })
  }

  _updateCamera(heading, pitch) {
    this.viewer.camera.flyTo({
      destination: this.viewer.camera.position,
      orientation: {
        heading: Cesium.Math.toRadians(heading),
        pitch: Cesium.Math.toRadians(pitch),
        roll: 0.0,
      },
      duration: 0,
    })
  }

  clear() {
    this.pickPointHandler.deactivate()
    this.viewer.entities.removeAll()
    this.viewshed3D.distance = 0.1
    this.viewshedFlag = true
  }
}
