import SketchTool from './tools/Sketch/SketchTool'
import HighLimitTool from './analysis/HighLimit/HighLimitTool'
import SubmergedTool from './analysis/Submerged/SubmergedTool'
import SceneRouteTool from './tools/Scene/SceneRouteTool'
import { gridSamplingPointsInPolygon } from './utils/CesiumUtility'
export default class Test {
  constructor() {
    this.createSketchTool()
  }
  createSketchTool() {
    this.count = 1
    this.sketchTool = new SketchTool(window.s3d.viewer)
    this.sketchTool.setMultiable(false)
    this.sketchTestStep = 0
  }

  doTest() {
    //this.setLayerVisibleTest()
    // this.addLayerTest()
    this.submergedTest()
    //this.highLimitTest()
    //this.randomPoints()
    // this.sceneRoute()
    //this.loadShapefile()
    // this.loadGeoJSON()
    // this.insertToolButton()
    // this.entityToGeoJson()
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

  setLayerVisibleTest() {
    if (typeof this.layerVisible === 'undefined') {
      this.layerVisible = false
    }
    this.layerVisible = !this.layerVisible
    window.s3d.setLayerVisible('东沙湖', this.layerVisible)
  }
  addLayerTest() {
    window.s3d.addLayer(
      {
        name: '倾斜',
        type: 'S3M',
        visible: false,
        url: `http://localhost:8090/iserver/services/3D-local3DCache-szgx4490/rest/realspace/datas/Config_3/config`,
      },
      {
        duration: 2,
        offset: {
          heading: 6.087014263548862,
          pitch: -0.5091484573438768,
          range: 100,
        },
      }
    )
  }
  highLimitTest() {
    let highLimitTool = new HighLimitTool(window.s3d.viewer)
    highLimitTool
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

    highLimitTool.start()
  }
  submergedTest() {
    let submergedTool = new SubmergedTool(window.s3d.viewer)
    submergedTool
      .setTargetLayers(['园区-盒子'])
      .includingGlobe()
      //园区
      .setCoverageArea([
        120.655,
        31.3219,
        3,
        120.6657,
        31.3131,
        3,
        120.6794,
        31.3081,
        3,
        120.6794,
        31.3251,
        3,
        120.655,
        31.3219,
        3,
      ])
    // .setCoverageArea([
    //   120.7658,
    //   31.3345,
    //   3,
    //   120.7644,
    //   31.3397,
    //   3,
    //   120.769,
    //   31.3403,
    //   3,
    //   120.7701,
    //   31.3352,
    //   3,
    //   120.7658,
    //   31.3345,
    //   3,
    // ])
    submergedTool.start()
    submergedTool.getSubmergedArea().then((samplePts) => {
      samplePts.forEach((p) => {
        window.s3d.debugUtility.labelPointLL(p, false)
      })
    })
  }
  randomPoints() {
    let geojson = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.7658, 31.3345],
            [120.7644, 31.3397],
            [120.769, 31.3403],
            [120.7701, 31.3352],
            [120.7658, 31.3345],
          ],
        ],
      },
      properties: {},
    }

    window.s3d.dataUtility.loadGeoJson(geojson)
    let resutl = gridSamplingPointsInPolygon(
      geojson,
      0.0003,
      window.s3d.viewer.terrainProvider
    )
    resutl.then((positions) => {
      positions.forEach((p) => {
        window.s3d.debugUtility.labelPointLL(p, false)
      })
    })
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
