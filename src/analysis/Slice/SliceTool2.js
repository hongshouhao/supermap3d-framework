export default class SliceTool2 {
  constructor(viewer) {
    this.viewer = viewer
    this.polygonEntity = viewer.entities.add({
      id: 'clipping_polygon',
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray([
          115.00769546779887,
          39.00948953601627,
          115.01061031637882,
          39.01040583624218,
          115.01127283211821,
          39.00875368295838,
          115.00837238000206,
          39.0079302039017,
        ]),
        height: 100,
        material: new Cesium.Color(1, 1, 1, 0.5),
        outline: true,
        outlineColor: Cesium.Color.RED,
      },
    })

    console.log(this.polygonEntity.position)
    this.polygonPreviousCoordinates = this.polygonEntity.polygon.hierarchy.getValue()

    let drawPreviewHandler = new Cesium.ScreenSpaceEventHandler(
      viewer.scene.canvas
    )

    // let _this = this
    drawPreviewHandler.setInputAction(function(e) {
      // var position = _this.viewer.scene.pickPosition(e.endPosition)
      // var cartographic = Cesium.Cartographic.fromCartesian(position)
      // const longitude = Cesium.Math.toDegrees(cartographic.longitude)
      // const latitude = Cesium.Math.toDegrees(cartographic.latitude)
      // const height = cartographic.height
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
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
