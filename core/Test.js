import SketchTool from './tools/Sketch/SketchTool'
import HighLimitTool from './analysis/HighLimit/HighLimitTool'
import SubmergedTool from './analysis/Submerged/SubmergedTool'
import SceneRouteTool from './tools/Scene/SceneRouteTool'
export default class Test {
  constructor() {
    this.createSketchTool()
    this.createSubmergedTool()
    this.createHighLimitTool()
  }
  createSketchTool() {
    this.count = 1
    this.sketchTool = new SketchTool(window.s3d.viewer)
    this.sketchTool.setMultiable(false)
    this.sketchTestStep = 0
  }
  createSubmergedTool() {
    this.submergedTool = new SubmergedTool(window.s3d.viewer)
    this.submergedTool
      .setTargetLayers(['大场景'])
      .includingGlobe([
        120.6014997708723,
        31.180936477517143,
        0,
        120.60515662761527,
        31.180896259318505,
        0,
        120.60575593261512,
        31.186082838897974,
        0,
        120.60050207082269,
        31.186380190938625,
        0,
      ])
  }
  createHighLimitTool() {
    this.highLimitTool = new HighLimitTool(window.s3d.viewer)
    this.highLimitTool
      .setTargetLayers(['楼幢'])
      .setHeight(60)
      .setRectangle([
        120.6014997708723,
        31.180936477517143,
        120.60515662761527,
        31.180896259318505,
        120.60575593261512,
        31.186082838897974,
        120.60050207082269,
        31.186380190938625,
      ])
  }
  doTest() {
    this.sceneRoute()
    // this.submergedTool.start()
    // this.highLimitTool.start()
    //this.loadShapefile()
    // this.loadGeoJSON()
    // this.insertToolButton()
    // this.entityToGeoJson()
    // window.s3d.setLayerVisible('标志标线', true)
    //this.sketchTest()
    // window.s3d.viewUtility.rotateZ(1)
    // window.s3d
    //   .query({ layer: '交通信号', sql: 'SMID =1' })
    //   .then((response) => console.log(response))
    // window.s3d.openPopup({
    //   object: { layer: '有线电视', sql: '元素id = 66736' },
    // })
    // if (this.count === 1) {
    //   debugger
    // window.s3d.openPopup({
    //   object: { layer: '供电', sql: 'SMID = 4480' },
    // })
    //   this.count++
    // } else if (this.count === 2) {
    //   window.s3d.closePopup()
    //   debugger
    //   window.s3d.openPopup({
    //     object: { layer: '污水', sql: 'SMID = 1464' },
    //   })
    //   this.count++
    // } else if (this.count === 3) {
    //   window.s3d.closePopup()
    //   debugger
    //   window.s3d.openPopup({
    //     object: { layer: '供电', sql: 'SMID = 4265' },
    //   })
    //   this.count++
    // }
    // window.s3d.flyToS3mFeatures(
    //   { layer: '供电', sql: 'SMID =  5534 ' },
    //   { scale: 1.5 }
    // )
    // window.s3d.flyTo([130, 31, 1000])
    // window.s3d.flyTo(Cesium.Cartesian3.fromDegreesArray([130, 31])[0])
    // window.s3d.flyTo(Cesium.Cartesian3.fromDegrees(130, 31))
    // console.log(window.s3d.getAllLayers((x) => x.type === 'S3M' && x.visible))
    // console.log(window.s3d.getLayer('供电'))
    // console.log(window.s3d.getLayer((x) => x.name === '供电'))
  }

  sceneRoute() {
    let tool = new SceneRouteTool(window.s3d.viewer)
    tool.setRoute('/test.fpf').then(() => tool.start())
  }
  insertToolButton() {
    window.s3d.toolbar.insertButton([2, 0], {
      title: '测试',
      icon: 'my-icon-mea-point',
      click: function() {
        alert('click')
      },
    })
  }
  load3dTiles() {
    var tileset = window.s3d.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: './3dtiles/tileset.json',
      })
    )

    tileset.readyPromise.then(function(tileset) {
      // window.s3d.viewer.zoomTo(
      //   tileset,
      //   new Cesium.HeadingPitchRange(
      //     0.5,
      //     -0.2,
      //     tileset.boundingSphere.radius * 1.0
      //   )
      // )
      window.s3d.viewer.camera.viewBoundingSphere(
        tileset.boundingSphere
        // new Cesium.HeadingPitchRange(0, -0.5, 0)
      )
    })
  }
  loadShapefile() {
    // window.s3d.dataUtility.loadShapefile('/test.shp')
    window.s3d.dataUtility.loadTrailLineFromShapefile('/test.shp', {
      width: 4,
      color: new Cesium.Color(0.9765, 0.7647, 0.4667, 1.0),
      trailLength: 0.5,
      period: 2,
    })
  }
  loadGeoJSON() {
    let geojson = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.6051439576166, 31.182623348967315],
            [120.60454406195154, 31.18123669097755],
            [120.60557820129517, 31.180994015265277],
            [120.60619062354726, 31.18215582423319],
            [120.60618967226178, 31.182160091113577],
            [120.61562716969533, 31.187796980711134],
            [120.60675290392506, 31.18458419309506],
            [120.60677488993603, 31.184584192869124],
            [120.6051439576166, 31.182623348967315],
          ],
        ],
      },
      properties: {
        name: 'sketch_polygon_fill',
        styleUrl: '#style-1',
        styleHash: '-640c9941',
        'fill-opacity': 0.5019607843137255,
        fill: '#12d035',
        visibility: '1',
      },
    }
    window.s3d.dataUtility.loadGeoJson(geojson)
  }

  debug() {
    window.s3d.debugUtility.labelPoint(
      Cesium.Cartesian3.fromDegrees(120.7769, 31.6024, 11.573)
    )
  }

  sketchTest() {
    if (this.sketchTestStep === 0) {
      this.sketchTestStep++
      this.sketchTool.start('polyline')
    } else if (this.sketchTestStep === 1) {
      this.sketchTestStep++
      this.sketchTool.start('polygon')
    } else {
      this.sketchTool.getGeometries().then((result) => {
        console.log(result)
      })
    }
  }
  entityToGeoJson() {
    window.s3d.debugUtility.drawCameraDirection()
    window.s3d.viewer.entities
      .toGeoJson()
      .then((geojson) => console.log(geojson))
    window.s3d.viewer.entities.values[0]
      .toGeoJson()
      .then((geojson) => console.log(geojson))
  }
}
