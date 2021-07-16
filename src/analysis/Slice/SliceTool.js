export default class SliceTool {
  constructor(viewer) {
    this.viewer = viewer
    this.primitive = null
    this.pickPointHandler = new Cesium.DrawHandler(
      viewer,
      Cesium.DrawMode.Point
    )

    let _this = this

    let drawPreviewHandler = new Cesium.ScreenSpaceEventHandler(
      viewer.scene.canvas
    )

    drawPreviewHandler.setInputAction(function(e) {
      var position = _this.viewer.scene.pickPosition(e.endPosition)
      var cartographic = Cesium.Cartographic.fromCartesian(position)
      let planeXModelMatrix = _this.getXModelMatrix(
        cartographic.longitude,
        cartographic.latitude
      )

      if (!_this.primitive) {
        _this.primitive = _this.createPlane(
          planeXModelMatrix,
          Cesium.Color.fromAlpha(
            Cesium.Color.fromCssColorString('rgb(254, 128, 1)'),
            0.5
          )
        )
        console.log(_this.primitive)
      } else {
        console.log(_this.primitive)
        // _this.primitive.geometryInstances.geometry._positions = new Cesium.CallbackProperty(
        //   function() {
        //     return Cesium.Cartesian3.fromDegrees(
        //       cartographic.longitude,
        //       cartographic.latitude
        //     )
        //   },
        //   false
        // ) //防止在移动过程中闪烁
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    _this.pickPointHandler.drawEvt.addEventListener(function(result) {
      drawPreviewHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      )
      var point = result.object
      // 将获取的点的位置转化成经纬度
      var cartographic = Cesium.Cartographic.fromCartesian(point.position)

      _this.getXModelMatrix(cartographic.longitude, cartographic.latitude)
    })

    // var boxPosition,
    //   position,
    //   dim,
    //   width = 5,
    //   height = 5,
    //   heading = 0,
    //   pitch = 0,
    //   roll = 0,
    //   extrudeDistance = 1.0,
    //   startClip = false,
    //   hasClipped = false
    // var box = viewer.entities.add({
    //   // 标识盒
    //   position: Cesium.Cartesian3.fromDegrees(0, 0, 0),
    //   show: false,
    //   box: {
    //     dimensions: new Cesium.Cartesian3(5, 5, 0.1),
    //     fill: false,
    //     outline: true,
    //     outlineColor: Cesium.Color.WHITE,
    //     outlineWidth: 5.0,
    //   },
    // })
    // var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
    // handler.setInputAction(function(movement) {
    //   if (startClip) {
    //     boxPosition = scene.pickPosition(movement.endPosition)
    //     if (!boxPosition) {
    //       return
    //     }
    //     box.position = boxPosition
    //   }
    // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    // handler.setInputAction(function(evt) {
    //   if (startClip) {
    //     position = scene.pickPosition(evt.position)
    //     if (!position) {
    //       return
    //     }
    //     var hpr = new Cesium.HeadingPitchRoll(
    //       Cesium.Math.toRadians(heading),
    //       Cesium.Math.toRadians(pitch),
    //       Cesium.Math.toRadians(roll)
    //     )
    //     var orientation = Cesium.Transforms.headingPitchRollQuaternion(
    //       position,
    //       hpr
    //     )
    //     box.orientation = orientation
    //     dim = new Cesium.Cartesian3(width, height, extrudeDistance)
    //     updateClip()
    //     startClip = false
    //     hasClipped = true
    //     box.show = false
    //   }
    // }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // var viewModel = {
    //   width: 5,
    //   height: 5,
    //   heading: 0.0,
    //   pitch: 0.0,
    //   roll: 0.0,
    //   extrudeDistance: 1.0,
    //   isMoving: false,
    // }
    // Cesium.knockout.track(viewModel)
    // var toolbar = document.getElementById('toolbar')
    // Cesium.knockout.applyBindings(viewModel, toolbar)

    // Cesium.knockout
    //   .getObservable(viewModel, 'width')
    //   .subscribe(function(newValue) {
    //     width = Number(newValue)
    //     box.box.dimensions = new Cesium.Cartesian3(width, height, 0.1)
    //     dim = new Cesium.Cartesian3(width, height, extrudeDistance)
    //     if (!position) {
    //       return
    //     }
    //     if (hasClipped) {
    //       updateClip()
    //     }
    //   })

    // Cesium.knockout
    //   .getObservable(viewModel, 'height')
    //   .subscribe(function(newValue) {
    //     height = Number(newValue)
    //     box.box.dimensions = new Cesium.Cartesian3(width, height, 0.1)
    //     dim = new Cesium.Cartesian3(width, height, extrudeDistance)
    //     if (!position) {
    //       return
    //     }
    //     if (hasClipped) {
    //       updateClip()
    //     }
    //   })
    // Cesium.knockout
    //   .getObservable(viewModel, 'heading')
    //   .subscribe(function(newValue) {
    //     heading = Number(newValue)
    //     var hpr = new Cesium.HeadingPitchRoll(
    //       Cesium.Math.toRadians(heading),
    //       Cesium.Math.toRadians(pitch),
    //       Cesium.Math.toRadians(roll)
    //     )
    //     var orientation = Cesium.Transforms.headingPitchRollQuaternion(
    //       boxPosition,
    //       hpr
    //     )
    //     box.orientation = orientation
    //     if (!position) {
    //       return
    //     }
    //     if (hasClipped) {
    //       updateClip()
    //     }
    //   })
    // Cesium.knockout
    //   .getObservable(viewModel, 'pitch')
    //   .subscribe(function(newValue) {
    //     pitch = Number(newValue)
    //     var hpr = new Cesium.HeadingPitchRoll(
    //       Cesium.Math.toRadians(heading),
    //       Cesium.Math.toRadians(pitch),
    //       Cesium.Math.toRadians(roll)
    //     )
    //     var orientation = Cesium.Transforms.headingPitchRollQuaternion(
    //       boxPosition,
    //       hpr
    //     )
    //     box.orientation = orientation
    //     if (!position) {
    //       return
    //     }
    //     if (hasClipped) {
    //       updateClip()
    //     }
    //   })
    // Cesium.knockout
    //   .getObservable(viewModel, 'roll')
    //   .subscribe(function(newValue) {
    //     roll = Number(newValue)
    //     var hpr = new Cesium.HeadingPitchRoll(
    //       Cesium.Math.toRadians(heading),
    //       Cesium.Math.toRadians(pitch),
    //       Cesium.Math.toRadians(roll)
    //     )
    //     var orientation = Cesium.Transforms.headingPitchRollQuaternion(
    //       boxPosition,
    //       hpr
    //     )
    //     box.orientation = orientation
    //     if (!position) {
    //       return
    //     }
    //     if (hasClipped) {
    //       updateClip()
    //     }
    //   })

    // Cesium.knockout
    //   .getObservable(viewModel, 'extrudeDistance')
    //   .subscribe(function(newValue) {
    //     extrudeDistance = Number(newValue)
    //     if (hasClipped) {
    //       updateClip()
    //     }
    //   })
  }

  start() {
    this.pickPointHandler.deactivate()
    this.pickPointHandler.activate()
  }

  getXModelMatrix(longitude, latitude) {
    var dimensions = new Cesium.Cartesian3(100.0, 100.0, 1.0)

    var positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(
      Cesium.Math.toDegrees(longitude),
      Cesium.Math.toDegrees(latitude)
    )

    var translateMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
      positionOnEllipsoid
    )
    var rotationXMatrix = Cesium.Matrix4.fromRotationTranslation(
      Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(-90.0))
    )
    var scaleMatrix = Cesium.Matrix4.fromScale(dimensions)

    var planeXModelMatrix = new Cesium.Matrix4()
    Cesium.Matrix4.multiply(translateMatrix, rotationXMatrix, planeXModelMatrix)
    Cesium.Matrix4.multiply(planeXModelMatrix, scaleMatrix, planeXModelMatrix)
    return planeXModelMatrix
  }

  createPlane(planeModelMatrix, color) {
    var planeGeometry = new Cesium.PlaneGeometry({
      vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
    })
    var planeOutlineGeometry = new Cesium.PlaneOutlineGeometry({})
    var planeGeometryInstance = new Cesium.GeometryInstance({
      geometry: planeGeometry,
      modelMatrix: planeModelMatrix,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(color),
      },
    })

    scene.primitives.add(
      new Cesium.Primitive({
        geometryInstances: planeGeometryInstance,
        appearance: new Cesium.PerInstanceColorAppearance({
          closed: false,
          translucent: false,
        }),
      })
    )

    var planeOutlineGeometryInstance = new Cesium.GeometryInstance({
      geometry: planeOutlineGeometry,
      modelMatrix: planeModelMatrix,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          new Cesium.Color(1.0, 1.0, 1.0, 1.0)
        ),
      },
    })

    let primitive = new Cesium.Primitive({
      geometryInstances: planeOutlineGeometryInstance,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true,
        renderState: {
          lineWidth: Math.min(1.0, scene.maximumAliasedLineWidth),
        },
      }),
    })

    scene.primitives.add(primitive)
    return primitive
  }
}
