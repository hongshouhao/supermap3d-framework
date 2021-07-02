export default class Viewshed3dTool {
  constructor(viewer) {
    let _this = this

    _this.viewer = viewer
    _this.scene = viewer.scene
    _this.viewshedFlag = false

    _this.viewModel = {
      direction: 1,
      pitch: 1,
      distance: 1,
      verticalFov: 1,
      horizontalFov: 1,
    }

    _this.viewshed3D = new Cesium.ViewShed3D(scene)
    // var colorStr1 = viewshed3D.visibleAreaColor.toCssColorString()
    // var colorStr2 = viewshed3D.hiddenAreaColor.toCssColorString()

    _this.pickPointHandler = new Cesium.DrawHandler(
      _this.viewer,
      Cesium.DrawMode.Point
    )
    let drawHandler = new Cesium.ScreenSpaceEventHandler(_this.scene.canvas)

    let viewPosition = null
    // 鼠标移动时间回调
    drawHandler.setInputAction(function(e) {
      // 若此标记为false，则激活对可视域分析对象的操作
      if (!_this.viewshedFlag) {
        //获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
        var position = e.endPosition
        var last = _this.scene.pickPosition(position)

        //计算该点与视口位置点坐标的距离
        var distance = Cesium.Cartesian3.distance(viewPosition, last)

        if (distance > 0) {
          // 将鼠标当前点坐标转化成经纬度
          var cartographic = Cesium.Cartographic.fromCartesian(last)
          var longitude = Cesium.Math.toDegrees(cartographic.longitude)
          var latitude = Cesium.Math.toDegrees(cartographic.latitude)
          var height = cartographic.height
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

    // eslint-disable-next-line no-unused-vars
    drawHandler.setInputAction(function(e) {
      //鼠标右键事件回调，不再执行鼠标移动事件中对可视域的操作
      _this.viewshedFlag = true
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    _this.pickPointHandler.drawEvt.addEventListener(function(result) {
      var point = result.object
      var position = point.position
      viewPosition = position

      // 将获取的点的位置转化成经纬度
      var cartographic = Cesium.Cartographic.fromCartesian(position)
      var longitude = Cesium.Math.toDegrees(cartographic.longitude)
      var latitude = Cesium.Math.toDegrees(cartographic.latitude)
      var height = cartographic.height + 1.8
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
  }

  reset() {
    this.viewModel.direction = this.viewshed3D.direction
    this.viewModel.pitch = this.viewshed3D.pitch
    this.viewModel.distance = this.viewshed3D.distance
    this.viewModel.verticalFov = this.viewshed3D.verticalFov
    this.viewModel.horizontalFov = this.viewshed3D.horizontalFov

    if (this.pickPointHandler.active) {
      this.pickPointHandler.deactivate()
    }

    //先清除之前的可视域分析
    this.viewer.entities.removeAll()
    // this.viewshed3D.distance = 0.1
    this.viewshedFlag = true

    //激活绘制点类
    this.pickPointHandler.activate()
  }

  bindUI(dom) {
    let _this = this
    Cesium.knockout.track(_this.viewModel)
    Cesium.knockout.applyBindings(_this.viewModel, dom)
    Cesium.knockout
      .getObservable(_this.viewModel, 'direction')
      .subscribe(function(newValue) {
        _this.viewshed3D.direction = parseFloat(newValue)
      })
    Cesium.knockout
      .getObservable(_this.viewModel, 'pitch')
      .subscribe(function(newValue) {
        _this.viewshed3D.pitch = parseFloat(newValue)
      })
    Cesium.knockout
      .getObservable(_this.viewModel, 'distance')
      .subscribe(function(newValue) {
        _this.viewshed3D.distance = parseFloat(newValue)
      })
    Cesium.knockout
      .getObservable(_this.viewModel, 'verticalFov')
      .subscribe(function(newValue) {
        _this.viewshed3D.verticalFov = parseFloat(newValue)
      })
    Cesium.knockout
      .getObservable(_this.viewModel, 'horizontalFov')
      .subscribe(function(newValue) {
        _this.viewshed3D.horizontalFov = parseFloat(newValue)
      })
  }

  clear() {
    this.pickPointHandler.deactivate()
    this.viewer.entities.removeAll()
    this.viewshed3D.distance = 0.1
    this.viewshedFlag = true
  }
}
